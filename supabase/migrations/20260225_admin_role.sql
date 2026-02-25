-- ============================================================================
-- Admin Role Migration — 2026-02-25
-- Adds 'role' column to public.users for admin panel access control
-- ============================================================================

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
CHECK (role IN ('user', 'admin', 'moderator'));

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ============================================================================
-- IMPORTANTE: Para definir o primeiro admin, execute no Supabase SQL Editor:
-- UPDATE public.users SET role = 'admin' WHERE email = 'seu@email.com';
-- ============================================================================

-- Política RLS: admins podem ver TODOS os usuários (para queries do painel)
CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );
