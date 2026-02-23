/**
 * TypeScript Types & Interfaces for Supabase Schema
 *
 * Reference file showing all database types. Copy these to:
 * src/types/supabase.ts
 *
 * Generated: 2026-02-22
 */

// ============================================================================
// PROFILE & SETTINGS
// ============================================================================

export type Profile = {
  id: string; // UUID, links to auth.users.id
  name: string | null;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  account_status: 'active' | 'suspended' | 'deleted';
  subscription_plan: 'free' | 'plus' | 'premium';
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  last_login_at: string | null; // ISO timestamp
  preferences: Record<string, any>; // JSONB for extensibility
};

export type UserSettings = {
  id: string; // UUID, links to auth.users.id
  theme: 'light' | 'dark' | 'auto';
  language: string; // e.g., 'pt-BR', 'en'
  font_size: 'small' | 'medium' | 'large';
  notifications_enabled: boolean;
  prayer_reminders_enabled: boolean;
  meditation_reminders_enabled: boolean;
  daily_passage_enabled: boolean;
  notification_time: string; // TIME format: '07:00'
  profile_public: boolean;
  allow_prayer_sharing: boolean;
  autoplay_audio: boolean;
  auto_continue_meditation: boolean;
  updated_at: string; // ISO timestamp
};


// ============================================================================
// FAVORITES
// ============================================================================

export type ContentType = 'prayer' | 'meditation' | 'passage';

export type Favorite = {
  id: string; // UUID
  user_id: string; // UUID
  content_type: ContentType;
  content_id: string; // Reference to source data
  content_title: string | null;
  content_data: Record<string, any> | null; // JSONB snapshot
  order_index: number;
  note: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
};

// Helper type for creating favorites
export type CreateFavoriteInput = Omit<Favorite, 'id' | 'created_at' | 'updated_at'>;

// Example Usage:
// const newFav: CreateFavoriteInput = {
//   user_id: session.user.id,
//   content_type: 'meditation',
//   content_id: 'med_1',
//   content_title: 'Test Meditation',
//   content_data: { duration: '10:00' },
//   order_index: 0,
//   note: 'My favorite meditation'
// };


// ============================================================================
// JOURNAL ENTRIES
// ============================================================================

export type JournalEntry = {
  id: string; // UUID
  user_id: string; // UUID
  title: string | null;
  body: string;
  mood: 'peaceful' | 'grateful' | 'anxious' | 'hopeful' | 'struggling' | null;
  tags: string[]; // Array of tags
  prayer_id: string | null; // Reference to prayer data
  meditation_id: string | null; // Reference to meditation data
  is_published: boolean;
  is_archived: boolean;
  word_count: number | null;
  reading_time_minutes: number | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  entry_date: string; // DATE format: '2026-02-22'
};

export type CreateJournalEntryInput = Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>;

export type UpdateJournalEntryInput = Partial<CreateJournalEntryInput>;


// ============================================================================
// MEDITATION HISTORY
// ============================================================================

export type MeditationSession = {
  id: string; // UUID
  user_id: string; // UUID
  meditation_id: string; // Reference to MEDITACOES data
  meditation_title: string | null;
  meditation_duration_seconds: number | null;
  started_at: string; // ISO timestamp
  completed_at: string | null; // ISO timestamp
  duration_listened_seconds: number | null;
  completion_percentage: number; // 0-100
  was_completed: boolean;
  user_rating: number | null; // 1-5 stars
  user_notes: string | null;
  was_interrupted: boolean;
  resumed_count: number;
};

export type CreateMeditationSessionInput = Omit<MeditationSession, 'id' | 'started_at' | 'completed_at'>;

export type UpdateMeditationSessionInput = {
  completed_at?: string;
  duration_listened_seconds?: number;
  completion_percentage?: number;
  was_completed?: boolean;
  user_rating?: number;
  user_notes?: string;
  was_interrupted?: boolean;
  resumed_count?: number;
};


// ============================================================================
// PRAYER HISTORY
// ============================================================================

export type PrayerHistory = {
  id: string; // UUID
  user_id: string; // UUID
  prayer_id: string; // Reference to ORACOES data
  prayer_title: string | null;
  prayed_count: number;
  last_prayed_at: string; // ISO timestamp
  times_completed: number;
  is_answered: boolean;
  answered_date: string | null; // ISO timestamp
  personal_notes: string | null;
  answered_notes: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
};

export type CreatePrayerHistoryInput = Omit<PrayerHistory, 'id' | 'created_at' | 'updated_at'>;

export type UpdatePrayerHistoryInput = Partial<Omit<PrayerHistory, 'id' | 'user_id' | 'prayer_id' | 'created_at'>>;


// ============================================================================
// DAILY PASSAGES
// ============================================================================

export type DailyPassage = {
  id: string; // UUID
  user_id: string; // UUID
  passage_reference: string; // e.g., 'Salmos 23:1'
  passage_text: string | null;
  book: string | null;
  chapter: number | null;
  verse_start: number | null;
  verse_end: number | null;
  was_read: boolean;
  read_at: string | null; // ISO timestamp
  was_marked: boolean;
  reflection: string | null;
  passage_date: string; // DATE format
  created_at: string; // ISO timestamp
};

export type CreateDailyPassageInput = Omit<DailyPassage, 'id' | 'created_at'>;

export type UpdateDailyPassageInput = Partial<Omit<DailyPassage, 'id' | 'user_id' | 'created_at'>>;


// ============================================================================
// AUDIT LOG
// ============================================================================

export type AuditLogEntry = {
  id: string; // UUID
  user_id: string; // UUID
  action: string; // 'login', 'create_entry', 'update_profile', etc.
  resource_type: string | null; // 'journal', 'prayer', 'meditation', etc.
  resource_id: string | null;
  changes: Record<string, any> | null; // JSONB
  old_values: Record<string, any> | null; // JSONB
  new_values: Record<string, any> | null; // JSONB
  ip_address: string | null;
  user_agent: string | null;
  created_at: string; // ISO timestamp
};

export type CreateAuditLogInput = Omit<AuditLogEntry, 'id' | 'created_at'>;


// ============================================================================
// ANALYTICS VIEWS
// ============================================================================

export type UserStats = {
  id: string;
  email: string;
  name: string | null;
  total_meditations: number;
  total_prayers: number;
  total_journal_entries: number;
  total_favorites: number;
  avg_meditation_rating: number | null;
  answered_prayers: number;
  created_at: string;
  last_login_at: string | null;
};

export type UserActivity30d = {
  id: string;
  email: string;
  meditations_last_30d: number;
  journal_entries_last_30d: number;
  prayers_prayed_last_30d: number;
  last_activity_date: string | null;
};


// ============================================================================
// HELPER TYPES
// ============================================================================

// Database response wrapper
export type DatabaseResponse<T> = {
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
};

// Paginated response
export type PaginatedResponse<T> = {
  data: T[];
  count: number;
  error: any | null;
};

// Filter options
export type QueryOptions = {
  pageSize?: number;
  page?: number;
  orderBy?: string;
  ascending?: boolean;
};


// ============================================================================
// INTEGRATION WITH EXISTING AUTH
// ============================================================================

/**
 * Extended user session with profile data
 *
 * Usage:
 * const session = await auth();
 * const userWithProfile: UserSession = {
 *   ...session,
 *   profile: profileData,
 *   settings: settingsData
 * };
 */
export type UserSession = {
  user: {
    id: string;
    email: string | null;
    name: string | null;
    image: string | null;
  };
  profile?: Profile;
  settings?: UserSettings;
  expires: string;
};


// ============================================================================
// SAMPLE API ROUTE USAGE
// ============================================================================

/**
 * Example: src/app/api/profile/route.ts
 *
 * GET /api/profile
 * - Fetch user's profile
 *
 * POST /api/profile
 * - Update user's profile
 *
 * Usage:
 *
 * const response = await fetch('/api/profile', {
 *   method: 'GET',
 *   headers: {
 *     'Authorization': `Bearer ${session?.user?.id}`
 *   }
 * });
 * const profile: Profile = await response.json();
 */


// ============================================================================
// SAMPLE REACT HOOK USAGE
// ============================================================================

/**
 * Example Hook: useProfile
 *
 * import { useAsync } from 'react-use';
 * import { supabase } from '@/lib/supabase-client';
 *
 * export function useProfile() {
 *   return useAsync(async () => {
 *     const { data, error } = await supabase
 *       .from('profiles')
 *       .select('*')
 *       .single();
 *
 *     if (error) throw error;
 *     return data as Profile;
 *   }, []);
 * }
 *
 * Usage in component:
 *
 * const { value: profile, loading, error } = useProfile();
 *
 * if (loading) return <Loading />;
 * if (error) return <Error error={error} />;
 * return <ProfileCard profile={profile} />;
 */


// ============================================================================
// SAMPLE QUERY PATTERNS
// ============================================================================

/**
 * 1. Fetch user favorites
 *
 * const { data, error } = await supabase
 *   .from('favorites')
 *   .select('*')
 *   .eq('user_id', userId)
 *   .order('created_at', { ascending: false });
 */

/**
 * 2. Create journal entry
 *
 * const { data, error } = await supabase
 *   .from('journal_entries')
 *   .insert({
 *     user_id: userId,
 *     title: 'My Reflection',
 *     body: 'Today I felt...',
 *     mood: 'peaceful'
 *   });
 */

/**
 * 3. Get meditation history
 *
 * const { data, error } = await supabase
 *   .from('meditation_history')
 *   .select('*')
 *   .eq('user_id', userId)
 *   .eq('was_completed', true)
 *   .gte('started_at', thirtyDaysAgo);
 */

/**
 * 4. Update user settings
 *
 * const { data, error } = await supabase
 *   .from('user_settings')
 *   .update({ theme: 'dark' })
 *   .eq('id', userId);
 */

/**
 * 5. Count favorites by type
 *
 * const { data, error } = await supabase
 *   .from('favorites')
 *   .select('content_type', { count: 'exact' })
 *   .eq('user_id', userId)
 *   .eq('content_type', 'meditation');
 */
