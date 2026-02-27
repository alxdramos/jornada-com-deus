-- ============================================================
-- Onboarding: campos has_completed_onboarding + interests
-- ============================================================

-- Adicionar colunas de onboarding em profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS has_completed_onboarding BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';

-- Índice para queries de usuários que completaram onboarding
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding
  ON public.profiles (has_completed_onboarding);
