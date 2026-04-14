-- ============================================================
-- Expiração automática de assinaturas
-- ============================================================

-- 1. Garantir que 'expired' está no CHECK de status (caso não esteja)
-- (a migration original já inclui 'expired', só reforçando)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name LIKE '%subscriptions%status%'
      AND check_clause LIKE '%expired%'
  ) THEN
    ALTER TABLE public.subscriptions
      DROP CONSTRAINT IF EXISTS subscriptions_status_check;
    ALTER TABLE public.subscriptions
      ADD CONSTRAINT subscriptions_status_check
        CHECK (status IN ('active', 'inactive', 'canceled', 'refunded', 'expired', 'chargeback'));
  END IF;
END $$;

-- 2. Índice em expires_at para o cron de expiração (acesso rápido)
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at
  ON public.subscriptions(expires_at)
  WHERE status = 'active';

-- 3. Garantir que sync_profile_plan trata 'expired' corretamente
-- (quando status = 'expired', profiles.plan volta para 'free')
CREATE OR REPLACE FUNCTION public.sync_profile_plan()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    plan = CASE WHEN NEW.status = 'active' THEN NEW.plan ELSE 'free' END,
    subscription_expires_at = CASE
      WHEN NEW.status = 'active' THEN NEW.expires_at
      ELSE NULL
    END,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. View helper para admin — assinaturas ativas e próximas a vencer
CREATE OR REPLACE VIEW public.subscriptions_status AS
SELECT
  s.id,
  s.user_id,
  p.email,
  p.name,
  s.plan,
  s.plan_interval,
  s.status,
  s.starts_at,
  s.expires_at,
  s.canceled_at,
  CASE
    WHEN s.status = 'active' AND s.expires_at > NOW() THEN 'vigente'
    WHEN s.status = 'active' AND s.expires_at <= NOW() THEN 'vencida_pendente'
    WHEN s.status = 'expired' THEN 'expirada'
    WHEN s.status = 'canceled' THEN 'cancelada'
    WHEN s.status = 'refunded' THEN 'reembolsada'
    WHEN s.status = 'chargeback' THEN 'chargeback'
    ELSE s.status
  END AS situacao,
  ROUND(EXTRACT(EPOCH FROM (s.expires_at - NOW())) / 86400) AS dias_restantes
FROM public.subscriptions s
LEFT JOIN public.profiles p ON p.id = s.user_id
ORDER BY s.expires_at DESC;
