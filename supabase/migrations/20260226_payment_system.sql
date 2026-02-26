-- ============================================================
-- Payment System — Hotmart Integration
-- ============================================================

-- 1. Adicionar colunas em profiles (plan + subscription_expires_at)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'plus')),
  ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;

-- 2. Tabela subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                      UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                 UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                    TEXT        NOT NULL DEFAULT 'plus' CHECK (plan IN ('free', 'plus')),
  status                  TEXT        NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'canceled', 'refunded', 'expired', 'chargeback')),
  hotmart_subscription_id TEXT,
  hotmart_transaction     TEXT,
  product_id              TEXT,
  price_paid              NUMERIC(10,2),
  currency                TEXT        DEFAULT 'BRL',
  starts_at               TIMESTAMPTZ,
  expires_at              TIMESTAMPTZ,
  canceled_at             TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. Tabela hotmart_webhook_logs (auditoria)
CREATE TABLE IF NOT EXISTS public.hotmart_webhook_logs (
  id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  event               TEXT        NOT NULL,
  hotmart_transaction TEXT,
  buyer_email         TEXT,
  payload             JSONB       NOT NULL,
  processed           BOOLEAN     NOT NULL DEFAULT false,
  error               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotmart_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Usuário lê a própria subscription
CREATE POLICY "subscriptions_owner_read"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role pode tudo em subscriptions (webhook handler)
CREATE POLICY "subscriptions_service_all"
  ON public.subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Webhook logs: apenas service role
CREATE POLICY "webhook_logs_service_all"
  ON public.hotmart_webhook_logs
  FOR ALL
  USING (auth.role() = 'service_role');

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_hotmart_transaction ON public.subscriptions(hotmart_transaction);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_buyer_email ON public.hotmart_webhook_logs(buyer_email);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON public.hotmart_webhook_logs(created_at DESC);

-- 6. updated_at trigger em subscriptions
DROP TRIGGER IF EXISTS trg_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. Trigger: sync profiles.plan quando subscription mudar
CREATE OR REPLACE FUNCTION public.sync_profile_plan()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    plan = CASE WHEN NEW.status = 'active' THEN NEW.plan ELSE 'free' END,
    subscription_expires_at = CASE WHEN NEW.status = 'active' THEN NEW.expires_at ELSE NULL END,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_profile_plan ON public.subscriptions;
CREATE TRIGGER trg_sync_profile_plan
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_plan();
