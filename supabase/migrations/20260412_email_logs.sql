-- ============================================================
-- Email Logs — rastreia emails enviados via Resend
-- Usado para idempotência (não enviar o mesmo email duas vezes)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.email_logs (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  email      TEXT        NOT NULL,
  template   TEXT        NOT NULL,
  resend_id  TEXT,
  metadata   JSONB       NOT NULL DEFAULT '{}',
  sent_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para consultas de idempotência por usuário + template
CREATE INDEX IF NOT EXISTS idx_email_logs_user_template
  ON public.email_logs(user_id, template, sent_at DESC);

-- Índice para queries administrativas por data
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at
  ON public.email_logs(sent_at DESC);

-- Índice para queries por template (para stats)
CREATE INDEX IF NOT EXISTS idx_email_logs_template
  ON public.email_logs(template, sent_at DESC);

-- RLS: somente service_role pode ler/escrever (é sempre chamado via backend)
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "email_logs_service_only"
  ON public.email_logs
  USING (false)
  WITH CHECK (false);

-- Comentários para documentação
COMMENT ON TABLE public.email_logs IS 'Registro de emails transacionais enviados via Resend. Usado para idempotência nos crons e webhooks.';
COMMENT ON COLUMN public.email_logs.template IS 'Identificador do template: welcome, inactive-d3, streak-milestone-7, post-trial-d3, subscription-confirmed, subscription-cancelled';
COMMENT ON COLUMN public.email_logs.resend_id IS 'ID retornado pela API do Resend para rastreabilidade';
COMMENT ON COLUMN public.email_logs.metadata IS 'Dados extras do envio: streak, expiresInDays, etc.';
