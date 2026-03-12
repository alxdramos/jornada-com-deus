-- ============================================================
-- Security Fix Migration — Supabase Security Advisor
-- Date: 2026-03-04
-- Corrige warnings detectados pelo Supabase Security Advisor
--
-- Warnings corrigidos:
--   Views SECURITY DEFINER     : user_stats, user_activity_30d
--   Functions search_path      : 14 funções (todas as plpgsql)
--   auth.role() em RLS policies: 3 policies
-- ============================================================


-- ============================================================
-- BLOCO 1: Funções com search_path mutável
-- SET search_path = '' previne ataques de injeção via schema
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.set_profiles_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.update_support_ticket_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.update_favorites_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.update_journal_entries_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.update_prayer_history_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.update_user_settings_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

-- Funções SECURITY DEFINER (crítico — acesso elevado)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.sync_profile_plan()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  UPDATE public.profiles
  SET
    plan = CASE WHEN NEW.status = 'active' THEN NEW.plan ELSE 'free' END,
    subscription_expires_at = CASE WHEN NEW.status = 'active' THEN NEW.expires_at ELSE NULL END,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.update_ticket_on_new_message()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  UPDATE public.support_tickets
  SET updated_at = NOW(),
      status = CASE
        WHEN NEW.sender_type = 'admin' THEN 'aguardando'
        WHEN NEW.sender_type = 'user'
          AND (SELECT status FROM public.support_tickets WHERE id = NEW.ticket_id) = 'aguardando'
          THEN 'aberto'
        ELSE (SELECT status FROM public.support_tickets WHERE id = NEW.ticket_id)
      END
  WHERE id = NEW.ticket_id;
  RETURN NEW;
END; $$;


-- ============================================================
-- BLOCO 2: Views com SECURITY DEFINER (owner = postgres)
-- Owned pelo postgres sem security_invoker = true → bypassa RLS
-- Fix: recriar com WITH (security_invoker = true)
-- ============================================================

-- user_stats: definição exata do banco de produção
DROP VIEW IF EXISTS public.user_stats;
CREATE VIEW public.user_stats
  WITH (security_invoker = true)
AS
  SELECT
    p.id,
    p.email,
    p.name,
    COALESCE(( SELECT count(*) FROM public.meditation_history
               WHERE meditation_history.user_id = p.id), 0) AS total_meditations,
    COALESCE(( SELECT count(*) FROM public.prayer_history
               WHERE prayer_history.user_id = p.id), 0) AS total_prayers,
    COALESCE(( SELECT count(*) FROM public.journal_entries
               WHERE journal_entries.user_id = p.id), 0) AS total_journal_entries,
    COALESCE(( SELECT count(*) FROM public.favorites
               WHERE favorites.user_id = p.id), 0) AS total_favorites,
    ( SELECT avg(meditation_history.user_rating) FROM public.meditation_history
      WHERE meditation_history.user_id = p.id
        AND meditation_history.user_rating IS NOT NULL) AS avg_meditation_rating,
    ( SELECT count(*) FROM public.prayer_history
      WHERE prayer_history.user_id = p.id
        AND prayer_history.is_answered = true) AS answered_prayers,
    p.created_at,
    p.last_login_at
  FROM public.profiles p;

-- user_activity_30d: definição exata do banco de produção
DROP VIEW IF EXISTS public.user_activity_30d;
CREATE VIEW public.user_activity_30d
  WITH (security_invoker = true)
AS
  SELECT
    p.id,
    p.email,
    count(DISTINCT m.id) AS meditations_last_30d,
    count(DISTINCT j.id) AS journal_entries_last_30d,
    count(DISTINCT pr.id) AS prayers_prayed_last_30d,
    max(GREATEST(m.started_at::date, j.created_at::date, pr.last_prayed_at::date)) AS last_activity_date
  FROM public.profiles p
    LEFT JOIN public.meditation_history m
      ON p.id = m.user_id AND m.started_at > (now() - '30 days'::interval)
    LEFT JOIN public.journal_entries j
      ON p.id = j.user_id AND j.created_at > (now() - '30 days'::interval)
    LEFT JOIN public.prayer_history pr
      ON p.id = pr.user_id AND pr.last_prayed_at > (now() - '30 days'::interval)
  GROUP BY p.id, p.email;


-- ============================================================
-- BLOCO 3: RLS policies com auth.role() direto
-- auth.role() re-avaliado por linha → usar (SELECT auth.role())
-- para avaliação única por query (planner optimization)
-- ============================================================

DROP POLICY IF EXISTS "push_subscriptions_service_read" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_service_read"
  ON public.push_subscriptions FOR SELECT
  USING ((SELECT auth.role()) = 'service_role');

DROP POLICY IF EXISTS "subscriptions_service_all" ON public.subscriptions;
CREATE POLICY "subscriptions_service_all"
  ON public.subscriptions FOR ALL
  USING ((SELECT auth.role()) = 'service_role');

DROP POLICY IF EXISTS "webhook_logs_service_all" ON public.hotmart_webhook_logs;
CREATE POLICY "webhook_logs_service_all"
  ON public.hotmart_webhook_logs FOR ALL
  USING ((SELECT auth.role()) = 'service_role');


-- ============================================================
-- BÔNUS: Enable RLS em verification_tokens
-- ============================================================
ALTER TABLE IF EXISTS public.verification_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "verification_tokens_service_all" ON public.verification_tokens;
CREATE POLICY "verification_tokens_service_all"
  ON public.verification_tokens FOR ALL
  USING ((SELECT auth.role()) = 'service_role');
