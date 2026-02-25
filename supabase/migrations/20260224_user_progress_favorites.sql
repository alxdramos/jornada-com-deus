-- ============================================================
-- user_progress: sync de gamificação (XP, streak, árvore)
-- user_favorites: sync de favoritos (meditações, orações, estudos)
-- ============================================================

-- ── user_progress ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_progress (
  id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak      INTEGER     NOT NULL DEFAULT 0,
  max_streak          INTEGER     NOT NULL DEFAULT 0,
  total_xp            INTEGER     NOT NULL DEFAULT 0,
  level               INTEGER     NOT NULL DEFAULT 1,
  tree_level          INTEGER     NOT NULL DEFAULT 0,
  completed_days      INTEGER     NOT NULL DEFAULT 0,
  last_completed_date DATE,
  completed_dates     TEXT[]      NOT NULL DEFAULT '{}',
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_progress_owner"
  ON public.user_progress
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id
  ON public.user_progress(user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER trg_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ── user_favorites ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id    TEXT        NOT NULL,
  item_type  TEXT        NOT NULL,   -- 'meditation' | 'oracao' | 'estudo'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_favorites_owner"
  ON public.user_favorites
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id
  ON public.user_favorites(user_id);
