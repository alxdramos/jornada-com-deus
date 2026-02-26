-- ============================================================
-- Add plan_interval to subscriptions — suporte a mensal/trimestral/anual
-- ============================================================

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS plan_interval TEXT DEFAULT 'mensal'
    CHECK (plan_interval IN ('mensal', 'trimestral', 'anual'));
