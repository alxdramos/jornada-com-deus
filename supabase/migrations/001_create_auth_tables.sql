-- ============================================================================
-- NextAuth.js Supabase Adapter Schema
-- ============================================================================
-- These tables are created by the @auth/supabase-adapter automatically,
-- but we include them here for reference and manual setup if needed.
--
-- In Supabase Dashboard, Auth tables (users, sessions, etc.) are managed
-- by the Auth system itself. These SQL statements are for additional tables
-- needed by NextAuth.
-- ============================================================================

-- ============================================================================
-- Users table (extended fields beyond Supabase Auth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMP WITH TIME ZONE,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own record
CREATE POLICY "Users can view their own record"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own record
CREATE POLICY "Users can update their own record"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- Accounts table (OAuth provider accounts)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own accounts"
  ON public.accounts
  FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================================
-- Sessions table (NextAuth session management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
  ON public.sessions
  FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================================
-- Verification tokens table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- ============================================================================
-- Indexes for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_session_token ON public.sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON public.verification_tokens(token);

-- ============================================================================
-- Function to update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
