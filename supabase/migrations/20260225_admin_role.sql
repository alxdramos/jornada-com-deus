-- ============================================================================
-- Admin: public.profiles (linked to auth.users) + role column
-- Padrão canônico Supabase: profiles sincroniza com auth.users via trigger
-- ============================================================================

-- 1. Criar tabela profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  email       TEXT,
  avatar_url  TEXT,
  role        TEXT        NOT NULL DEFAULT 'user'
                          CHECK (role IN ('user', 'admin', 'moderator')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Índices
CREATE INDEX IF NOT EXISTS idx_profiles_role      ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email     ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created   ON public.profiles(created_at DESC);

-- 3. RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Cada usuário vê apenas seu próprio perfil
CREATE POLICY "profiles_owner_select"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_owner_update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 4. Trigger: auto-criar profile no cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Trigger: updated_at automático
CREATE OR REPLACE FUNCTION public.set_profiles_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();

-- 6. Backfill: criar profiles para usuários já existentes no auth.users
INSERT INTO public.profiles (id, name, email, avatar_url)
SELECT
  id,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'),
  email,
  raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PASSO FINAL: defina seu admin (execute após rodar esta migration):
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'seu@email.com';
-- ============================================================================
