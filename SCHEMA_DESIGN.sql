-- ============================================================================
-- Supabase Schema Design for "Jornada com Deus" PWA
-- Generated: 2026-02-22
-- ============================================================================
--
-- OVERVIEW:
-- This schema extends Supabase's built-in auth.users table with user-specific
-- data (profiles, settings, favorites, and journal entries). All tables use
-- auth.users.id as foreign key with cascading deletes.
--
-- SECURITY:
-- - Row-level security (RLS) enabled on all public tables
-- - Users can only read/write their own data (except public content)
-- - Service role bypasses RLS for migrations/admin operations
--
-- ============================================================================


-- =============================================================================
-- 1. ENABLE EXTENSIONS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "http";


-- =============================================================================
-- 2. PROFILES TABLE (User Core Data)
-- =============================================================================
-- Linked to auth.users.id via foreign key
-- One profile per user, created automatically via trigger

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- User Info
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,

  -- Account Status
  account_status TEXT DEFAULT 'active', -- 'active', 'suspended', 'deleted'
  subscription_plan TEXT DEFAULT 'free', -- 'free', 'plus', 'premium'

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  preferences JSONB DEFAULT '{}', -- Extensible field for future use

  CONSTRAINT email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at);


-- =============================================================================
-- 3. USER SETTINGS TABLE (App Preferences)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Display
  theme TEXT DEFAULT 'light', -- 'light', 'dark', 'auto'
  language TEXT DEFAULT 'pt-BR', -- 'pt-BR', 'en', etc.
  font_size TEXT DEFAULT 'medium', -- 'small', 'medium', 'large'

  -- Notifications
  notifications_enabled BOOLEAN DEFAULT TRUE,
  prayer_reminders_enabled BOOLEAN DEFAULT TRUE,
  meditation_reminders_enabled BOOLEAN DEFAULT TRUE,
  daily_passage_enabled BOOLEAN DEFAULT TRUE,
  notification_time TIME DEFAULT '07:00',

  -- Privacy & Sharing
  profile_public BOOLEAN DEFAULT FALSE,
  allow_prayer_sharing BOOLEAN DEFAULT FALSE,

  -- Audio
  autoplay_audio BOOLEAN DEFAULT FALSE,
  auto_continue_meditation BOOLEAN DEFAULT FALSE,

  -- Data
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_settings_theme ON public.user_settings(theme);
CREATE INDEX idx_user_settings_language ON public.user_settings(language);


-- =============================================================================
-- 4. FAVORITES TABLE (User Favorites: Prayers, Meditations, Passages)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Content Reference
  content_type TEXT NOT NULL, -- 'prayer', 'meditation', 'passage'
  content_id TEXT NOT NULL, -- ID from source data (e.g., 'ora_0', 'med_1', 'salmos_23_1')
  content_title TEXT,
  content_data JSONB, -- Store snippet of content for offline access

  -- Metadata
  order_index INTEGER DEFAULT 0, -- For custom ordering
  note TEXT, -- User's personal note about this favorite

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraint: One favorite per user per content
  CONSTRAINT unique_user_content UNIQUE(user_id, content_type, content_id)
);

CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_content_type ON public.favorites(content_type);
CREATE INDEX idx_favorites_created_at ON public.favorites(created_at DESC);


-- =============================================================================
-- 5. JOURNAL TABLE (Daily Reflections)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Content
  title TEXT,
  body TEXT NOT NULL,
  mood TEXT, -- 'peaceful', 'grateful', 'anxious', 'hopeful', 'struggling'
  tags TEXT[] DEFAULT '{}', -- e.g., ['prayer', 'answered', 'healing']

  -- Associated Content
  prayer_id TEXT, -- Reference to prayer that inspired entry
  meditation_id TEXT, -- Reference to meditation that inspired entry

  -- Metadata
  is_published BOOLEAN DEFAULT FALSE, -- Can be shared with community (future feature)
  is_archived BOOLEAN DEFAULT FALSE,
  word_count INTEGER,
  reading_time_minutes INTEGER,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  entry_date DATE DEFAULT CURRENT_DATE
);

CREATE INDEX idx_journal_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entry_date ON public.journal_entries(entry_date DESC);
CREATE INDEX idx_journal_created_at ON public.journal_entries(created_at DESC);
CREATE INDEX idx_journal_tags ON public.journal_entries USING GIN(tags);


-- =============================================================================
-- 6. MEDITATION HISTORY TABLE (Track User Progress)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.meditation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Session Info
  meditation_id TEXT NOT NULL, -- Reference to meditation from data
  meditation_title TEXT,
  meditation_duration_seconds INTEGER,

  -- Completion Data
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_listened_seconds INTEGER, -- How long user actually listened
  completion_percentage INTEGER DEFAULT 0, -- 0-100

  -- User Feedback
  was_completed BOOLEAN DEFAULT FALSE,
  user_rating INTEGER, -- 1-5 stars
  user_notes TEXT,

  -- Analytics
  was_interrupted BOOLEAN DEFAULT FALSE,
  resumed_count INTEGER DEFAULT 0,

  CONSTRAINT rating_range CHECK(user_rating IS NULL OR (user_rating >= 1 AND user_rating <= 5))
);

CREATE INDEX idx_meditation_history_user_id ON public.meditation_history(user_id);
CREATE INDEX idx_meditation_history_started_at ON public.meditation_history(started_at DESC);
CREATE INDEX idx_meditation_history_meditation_id ON public.meditation_history(meditation_id);
CREATE INDEX idx_meditation_history_completed ON public.meditation_history(completed_at) WHERE completed_at IS NOT NULL;


-- =============================================================================
-- 7. PRAYER HISTORY TABLE (Track User Prayers)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.prayer_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Prayer Info
  prayer_id TEXT NOT NULL, -- Reference to prayer from data
  prayer_title TEXT,

  -- Tracking
  prayed_count INTEGER DEFAULT 1,
  last_prayed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  times_completed INTEGER DEFAULT 1,

  -- Status
  is_answered BOOLEAN DEFAULT FALSE,
  answered_date TIMESTAMP WITH TIME ZONE,

  -- User Notes
  personal_notes TEXT,
  answered_notes TEXT, -- User's reflection on how prayer was answered

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_prayer_history_user_id ON public.prayer_history(user_id);
CREATE INDEX idx_prayer_history_last_prayed ON public.prayer_history(last_prayed_at DESC);
CREATE INDEX idx_prayer_history_is_answered ON public.prayer_history(is_answered) WHERE is_answered = TRUE;


-- =============================================================================
-- 8. DAILY PASSAGES TABLE (Daily Scripture Reading)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.daily_passages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Passage Info
  passage_reference TEXT NOT NULL, -- e.g., 'Salmos 23:1'
  passage_text TEXT,
  book TEXT,
  chapter INTEGER,
  verse_start INTEGER,
  verse_end INTEGER,

  -- User Actions
  was_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  was_marked BOOLEAN DEFAULT FALSE,
  reflection TEXT,

  -- Tracking
  passage_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_daily_passages_user_id ON public.daily_passages(user_id);
CREATE INDEX idx_daily_passages_date ON public.daily_passages(passage_date DESC);
CREATE INDEX idx_daily_passages_was_read ON public.daily_passages(was_read);


-- =============================================================================
-- 9. AUDIT LOG TABLE (Track User Actions)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Action Details
  action TEXT NOT NULL, -- 'login', 'create_entry', 'update_profile', etc.
  resource_type TEXT, -- 'journal', 'prayer', 'meditation', 'profile'
  resource_id TEXT,

  -- Change Data (for updates)
  changes JSONB,
  old_values JSONB,
  new_values JSONB,

  -- Metadata
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_action ON public.audit_log(action);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at DESC);


-- =============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
-- Enable RLS on all public tables

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_passages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;


-- ─────────────────────────────────────────────────────────────────────────
-- PROFILES: Users can only read/update their own profile
-- ─────────────────────────────────────────────────────────────────────────

CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are readable if published (future feature)"
  ON public.profiles
  FOR SELECT
  USING (
    (auth.uid() = id) OR
    (account_status = 'active' AND (preferences->>'profile_public')::boolean = TRUE)
  );


-- ─────────────────────────────────────────────────────────────────────────
-- USER_SETTINGS: Users can only manage their own settings
-- ─────────────────────────────────────────────────────────────────────────

CREATE POLICY "Users can view their own settings"
  ON public.user_settings
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own settings"
  ON public.user_settings
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own settings"
  ON public.user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = id);


-- ─────────────────────────────────────────────────────────────────────────
-- FAVORITES: Users can only access their own favorites
-- ─────────────────────────────────────────────────────────────────────────

CREATE POLICY "Users can view their own favorites"
  ON public.favorites
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create favorites"
  ON public.favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites"
  ON public.favorites
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.favorites
  FOR DELETE
  USING (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────
-- JOURNAL_ENTRIES: Users can only access their own entries
-- (or public entries if profile is shared - future feature)
-- ─────────────────────────────────────────────────────────────────────────

CREATE POLICY "Users can view their own journal"
  ON public.journal_entries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create journal entries"
  ON public.journal_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
  ON public.journal_entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
  ON public.journal_entries
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Public entries are readable if published and profile is shared"
  ON public.journal_entries
  FOR SELECT
  USING (
    is_published = TRUE AND
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = journal_entries.user_id
      AND (p.preferences->>'profile_public')::boolean = TRUE
    )
  );


-- ─────────────────────────────────────────────────────────────────────────
-- MEDITATION_HISTORY: Users can only access their own history
-- ─────────────────────────────────────────────────────────────────────────

CREATE POLICY "Users can view their own meditation history"
  ON public.meditation_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create meditation history"
  ON public.meditation_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meditation history"
  ON public.meditation_history
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────
-- PRAYER_HISTORY: Users can only access their own history
-- ─────────────────────────────────────────────────────────────────────────

CREATE POLICY "Users can view their own prayer history"
  ON public.prayer_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create prayer history"
  ON public.prayer_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer history"
  ON public.prayer_history
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────
-- DAILY_PASSAGES: Users can only access their own passages
-- ─────────────────────────────────────────────────────────────────────────

CREATE POLICY "Users can view their own daily passages"
  ON public.daily_passages
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create daily passages"
  ON public.daily_passages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own passages"
  ON public.daily_passages
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────
-- AUDIT_LOG: Users can only view their own audit log
-- (Audit entries are created by triggers/service role)
-- ─────────────────────────────────────────────────────────────────────────

CREATE POLICY "Users can view their own audit log"
  ON public.audit_log
  FOR SELECT
  USING (auth.uid() = user_id);


-- =============================================================================
-- 11. TRIGGERS FOR AUTOMATIC PROFILE & TIMESTAMP MANAGEMENT
-- =============================================================================

-- Create profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NOW()
  );

  -- Also create default settings
  INSERT INTO public.user_settings (id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- Update updated_at timestamp on profiles
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profiles_updated_at();


-- Update updated_at timestamp on user_settings
CREATE OR REPLACE FUNCTION public.update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_settings_timestamp
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_settings_updated_at();


-- Update updated_at timestamp on favorites
CREATE OR REPLACE FUNCTION public.update_favorites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_favorites_timestamp
  BEFORE UPDATE ON public.favorites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_favorites_updated_at();


-- Update updated_at timestamp on journal_entries
CREATE OR REPLACE FUNCTION public.update_journal_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_journal_entries_timestamp
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_journal_entries_updated_at();


-- Update prayer_history timestamp
CREATE OR REPLACE FUNCTION public.update_prayer_history_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_prayer_history_timestamp
  BEFORE UPDATE ON public.prayer_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_prayer_history_timestamp();


-- =============================================================================
-- 12. UTILITY VIEWS
-- =============================================================================

-- User Statistics View
CREATE OR REPLACE VIEW public.user_stats AS
SELECT
  p.id,
  p.email,
  p.name,
  COALESCE((SELECT COUNT(*) FROM public.meditation_history WHERE user_id = p.id), 0) as total_meditations,
  COALESCE((SELECT COUNT(*) FROM public.prayer_history WHERE user_id = p.id), 0) as total_prayers,
  COALESCE((SELECT COUNT(*) FROM public.journal_entries WHERE user_id = p.id), 0) as total_journal_entries,
  COALESCE((SELECT COUNT(*) FROM public.favorites WHERE user_id = p.id), 0) as total_favorites,
  (SELECT AVG(user_rating) FROM public.meditation_history WHERE user_id = p.id AND user_rating IS NOT NULL) as avg_meditation_rating,
  (SELECT COUNT(*) FROM public.prayer_history WHERE user_id = p.id AND is_answered = TRUE) as answered_prayers,
  p.created_at,
  p.last_login_at
FROM public.profiles p;


-- User Activity View (Last 30 Days)
CREATE OR REPLACE VIEW public.user_activity_30d AS
SELECT
  p.id,
  p.email,
  COUNT(DISTINCT m.id) as meditations_last_30d,
  COUNT(DISTINCT j.id) as journal_entries_last_30d,
  COUNT(DISTINCT pr.id) as prayers_prayed_last_30d,
  MAX(GREATEST(
    m.started_at::date,
    j.created_at::date,
    pr.last_prayed_at::date
  )) as last_activity_date
FROM public.profiles p
LEFT JOIN public.meditation_history m ON p.id = m.user_id AND m.started_at > NOW() - INTERVAL '30 days'
LEFT JOIN public.journal_entries j ON p.id = j.user_id AND j.created_at > NOW() - INTERVAL '30 days'
LEFT JOIN public.prayer_history pr ON p.id = pr.user_id AND pr.last_prayed_at > NOW() - INTERVAL '30 days'
GROUP BY p.id, p.email;


-- =============================================================================
-- 13. INDEXES FOR PERFORMANCE
-- =============================================================================

-- Composite indexes for common queries
CREATE INDEX idx_meditation_history_user_completed
  ON public.meditation_history(user_id, completed_at DESC)
  WHERE was_completed = TRUE;

CREATE INDEX idx_journal_user_date
  ON public.journal_entries(user_id, entry_date DESC);

CREATE INDEX idx_prayer_history_user_answered
  ON public.prayer_history(user_id, is_answered)
  WHERE is_answered = TRUE;

CREATE INDEX idx_favorites_user_type_date
  ON public.favorites(user_id, content_type, created_at DESC);


-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
