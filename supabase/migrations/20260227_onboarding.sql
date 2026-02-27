-- ============================================================
-- Onboarding: campos has_completed_onboarding + interests
-- ============================================================

-- Adicionar coluna de onboarding na tabela users
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS has_completed_onboarding BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';

-- Índice para queries de usuários que completaram onboarding
CREATE INDEX IF NOT EXISTS idx_users_onboarding
  ON public.users (has_completed_onboarding);

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_users_updated_at();
