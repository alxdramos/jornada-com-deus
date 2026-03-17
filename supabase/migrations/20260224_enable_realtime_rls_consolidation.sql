-- ============================================================
-- Consolidação: RLS idempotente + Realtime Publication
-- Execute no Supabase SQL Editor
-- ============================================================

-- ── 1. Garantir RLS habilitado em todas as tabelas ──────────
ALTER TABLE IF EXISTS public.user_progress    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_favorites   ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.prayers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.journal_entries  ENABLE ROW LEVEL SECURITY;

-- ── 2. Políticas idempotentes (DROP + CREATE) ───────────────

-- user_progress
DROP POLICY IF EXISTS "user_progress_owner" ON public.user_progress;
CREATE POLICY "user_progress_owner"
  ON public.user_progress
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_favorites
DROP POLICY IF EXISTS "user_favorites_owner" ON public.user_favorites;
CREATE POLICY "user_favorites_owner"
  ON public.user_favorites
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- prayers
DROP POLICY IF EXISTS "prayers_own_user" ON public.prayers;
CREATE POLICY "prayers_own_user"
  ON public.prayers
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- journal_entries
DROP POLICY IF EXISTS "journal_entries_own_user" ON public.journal_entries;
CREATE POLICY "journal_entries_own_user"
  ON public.journal_entries
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 3. Habilitar Realtime Publication (idempotente) ────────
-- Necessário para supabase.channel() receber postgres_changes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_progress'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_progress;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_favorites'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_favorites;
  END IF;
END $$;
