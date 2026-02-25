-- ============================================================
-- Push Subscriptions — notificações diárias "Bom dia"
-- ============================================================

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id                    UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint              TEXT        NOT NULL UNIQUE,
  p256dh                TEXT        NOT NULL,
  auth_key              TEXT        NOT NULL,
  notifications_enabled BOOLEAN     NOT NULL DEFAULT true,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Usuário só acessa/altera as próprias subscriptions
CREATE POLICY "push_subscriptions_owner"
  ON public.push_subscriptions
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role (cron) pode ler todas para enviar notificações
CREATE POLICY "push_subscriptions_service_read"
  ON public.push_subscriptions
  FOR SELECT
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id
  ON public.push_subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_enabled
  ON public.push_subscriptions(notifications_enabled)
  WHERE notifications_enabled = true;

-- Trigger: manter updated_at atualizado
DROP TRIGGER IF EXISTS trg_push_subscriptions_updated_at ON public.push_subscriptions;
CREATE TRIGGER trg_push_subscriptions_updated_at
  BEFORE UPDATE ON public.push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
