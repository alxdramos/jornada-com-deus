# Supabase Schema - Quick Reference Guide

**For:** Developers implementing the Supabase integration
**Created:** 2026-02-22
**Status:** Ready for Use

---

## 1-Minute Overview

A complete Supabase schema with 8 tables, RLS security, and auto-provisioning for "Jornada com Deus" PWA.

**What you get:**
- Automatic profile creation on user signup
- User preferences (theme, language, notifications)
- Bookmarks for prayers, meditations, scriptures
- Journal entries with tagging and mood tracking
- Meditation session history with ratings
- Prayer tracking (count, answered status)
- Automatic timestamps on all tables
- Complete audit trail of user actions

**Security:** Database-enforced row-level security (RLS) ensures users can only see their own data.

---

## Files Delivered

| File | What It Is | Read Time |
|------|-----------|-----------|
| **SCHEMA_DESIGN.sql** | Complete SQL to run in Supabase | 5 min |
| **SCHEMA_MIGRATION_GUIDE.md** | Step-by-step deployment guide | 10 min |
| **SUPABASE_TYPES_REFERENCE.ts** | TypeScript types for all tables | 5 min |
| **SUPABASE_IMPLEMENTATION_CHECKLIST.md** | 80-item implementation roadmap | 20 min |
| **SUPABASE_SCHEMA_EXECUTIVE_SUMMARY.md** | Business overview | 10 min |
| **ARCHITECTURE_DIAGRAM.txt** | ASCII diagrams of all flows | 15 min |
| **QUICK_REFERENCE.md** | This file! | 3 min |

---

## Getting Started (5 Minutes)

### Step 1: Copy & Run Schema

1. Open Supabase Dashboard → **SQL Editor**
2. New Query
3. Paste all of `SCHEMA_DESIGN.sql`
4. Run ▶
5. Wait for ✓ success (5-10 sec)

### Step 2: Verify It Worked

Run this query in SQL Editor:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;
```

Should see 8 tables:
- audit_log
- daily_passages
- favorites
- journal_entries
- meditation_history
- prayer_history
- user_settings
- profiles

### Step 3: Test Auto-Profile Creation

1. Create test user in **Auth** section
   - Email: `test@example.com`
   - Password: `TempPass123!`

2. Check if profile created:
   ```sql
   SELECT * FROM profiles WHERE email = 'test@example.com';
   ```

If you see a row → **SUCCESS! Schema is working.**

---

## Most Common Tasks

### Task: Add User Favorite

```typescript
const { data, error } = await supabase
  .from('favorites')
  .insert({
    user_id: session.user.id,
    content_type: 'meditation', // 'prayer' | 'meditation' | 'passage'
    content_id: 'med_1',
    content_title: 'A Rocha Firme',
    note: 'My favorite meditation'
  });
```

### Task: Create Journal Entry

```typescript
const { data, error } = await supabase
  .from('journal_entries')
  .insert({
    user_id: session.user.id,
    title: 'Today\'s Reflection',
    body: 'I felt peaceful during...',
    mood: 'grateful', // 'peaceful' | 'grateful' | 'anxious' | 'hopeful' | 'struggling'
    tags: ['prayer', 'gratitude']
  });
```

### Task: Start Meditation Session

```typescript
const { data: session, error } = await supabase
  .from('meditation_history')
  .insert({
    user_id: sessionUser.id,
    meditation_id: 'med_1',
    meditation_title: 'Guided Meditation',
    meditation_duration_seconds: 600
  })
  .select()
  .single();
```

### Task: Complete Meditation Session

```typescript
const { error } = await supabase
  .from('meditation_history')
  .update({
    completed_at: new Date().toISOString(),
    duration_listened_seconds: 580, // User listened 9:40 of 10:00
    completion_percentage: 97,
    was_completed: true,
    user_rating: 5, // 1-5 stars
    user_notes: 'Very relaxing'
  })
  .eq('id', sessionId);
```

### Task: Mark Prayer as Answered

```typescript
const { error } = await supabase
  .from('prayer_history')
  .update({
    is_answered: true,
    answered_date: new Date().toISOString(),
    answered_notes: 'God provided a job offer today!'
  })
  .eq('id', prayerId);
```

### Task: Get User Stats

```typescript
const { data: stats, error } = await supabase
  .from('user_stats') // This is a VIEW (pre-calculated)
  .select('*')
  .eq('id', userId)
  .single();

// Returns:
// {
//   total_meditations: 15,
//   total_prayers: 42,
//   total_journal_entries: 8,
//   avg_meditation_rating: 4.6,
//   answered_prayers: 3
// }
```

---

## Table Reference

### profiles
User core data. Linked to `auth.users.id`. Auto-created on signup.

```
id              UUID (primary key, links to auth.users.id)
name            TEXT
email           TEXT
avatar_url      TEXT
bio             TEXT
account_status  'active' | 'suspended' | 'deleted'
subscription_plan 'free' | 'plus' | 'premium'
created_at      TIMESTAMP
updated_at      TIMESTAMP (auto-updated by trigger)
last_login_at   TIMESTAMP
preferences     JSONB (for future extensibility)
```

### user_settings
App preferences. Auto-created on signup with defaults.

```
id              UUID (primary key, links to auth.users.id)
theme           'light' | 'dark' | 'auto'
language        'pt-BR' | 'en' | ...
font_size       'small' | 'medium' | 'large'
notifications_enabled     BOOLEAN
prayer_reminders_enabled  BOOLEAN
meditation_reminders_enabled BOOLEAN
daily_passage_enabled     BOOLEAN
notification_time         TIME (e.g., '07:00')
profile_public  BOOLEAN
autoplay_audio  BOOLEAN
auto_continue_meditation BOOLEAN
updated_at      TIMESTAMP (auto-updated by trigger)
```

### favorites
Bookmarked prayers, meditations, passages.

```
id              UUID (primary key)
user_id         UUID (foreign key to auth.users.id)
content_type    'prayer' | 'meditation' | 'passage'
content_id      TEXT (e.g., 'med_1', 'ora_5')
content_title   TEXT
content_data    JSONB (snapshot of content)
order_index     INTEGER (for custom ordering)
note            TEXT (user's personal note)
created_at      TIMESTAMP
updated_at      TIMESTAMP (auto-updated by trigger)
```

### journal_entries
Daily reflections and thoughts.

```
id              UUID (primary key)
user_id         UUID (foreign key to auth.users.id)
title           TEXT
body            TEXT (main content)
mood            'peaceful' | 'grateful' | 'anxious' | 'hopeful' | 'struggling'
tags            TEXT[] (array of tags)
prayer_id       TEXT (reference to prayer if relevant)
meditation_id   TEXT (reference to meditation if relevant)
is_published    BOOLEAN (for future community feature)
is_archived     BOOLEAN
word_count      INTEGER (auto-calculated)
reading_time_minutes INTEGER (auto-calculated)
created_at      TIMESTAMP
updated_at      TIMESTAMP (auto-updated by trigger)
entry_date      DATE
```

### meditation_history
Track meditation sessions for progress and stats.

```
id              UUID (primary key)
user_id         UUID (foreign key to auth.users.id)
meditation_id   TEXT (reference to MEDITACOES data)
meditation_title TEXT
meditation_duration_seconds INTEGER
started_at      TIMESTAMP (auto-set)
completed_at    TIMESTAMP (when user finished)
duration_listened_seconds INTEGER (how long user actually listened)
completion_percentage INTEGER (0-100)
was_completed   BOOLEAN
user_rating     INTEGER (1-5 stars, null if not rated)
user_notes      TEXT
was_interrupted BOOLEAN (if user paused/resumed)
resumed_count   INTEGER (how many times resumed)
```

### prayer_history
Track prayer sessions for progress and answered prayers.

```
id              UUID (primary key)
user_id         UUID (foreign key to auth.users.id)
prayer_id       TEXT (reference to ORACOES data)
prayer_title    TEXT
prayed_count    INTEGER (how many times prayed)
last_prayed_at  TIMESTAMP
times_completed INTEGER
is_answered     BOOLEAN
answered_date   TIMESTAMP (when answer came)
personal_notes  TEXT (user's thoughts about the prayer)
answered_notes  TEXT (how the prayer was answered)
created_at      TIMESTAMP
updated_at      TIMESTAMP (auto-updated by trigger)
```

### daily_passages
Track scripture reading progress.

```
id              UUID (primary key)
user_id         UUID (foreign key to auth.users.id)
passage_reference TEXT (e.g., 'Salmos 23:1')
passage_text    TEXT
book            TEXT
chapter         INTEGER
verse_start     INTEGER
verse_end       INTEGER
was_read        BOOLEAN
read_at         TIMESTAMP
was_marked      BOOLEAN
reflection      TEXT (user's thoughts on passage)
passage_date    DATE
created_at      TIMESTAMP
```

### audit_log
Complete audit trail of user actions.

```
id              UUID (primary key)
user_id         UUID (foreign key to auth.users.id)
action          TEXT ('login', 'create_entry', 'update_profile', etc.)
resource_type   TEXT ('journal', 'prayer', 'meditation', etc.)
resource_id     TEXT
changes         JSONB (what changed)
old_values      JSONB (before state)
new_values      JSONB (after state)
ip_address      INET
user_agent      TEXT
created_at      TIMESTAMP
```

---

## Security Essentials

### RLS is Always Active

Every table has RLS policies. Users can ONLY access their own data.

Example: This will return ZERO rows (not an error):
```sql
-- As authenticated user, try to see all favorites
-- RLS blocks access to other users' favorites
SELECT * FROM favorites;

-- This works (your own favorites):
SELECT * FROM favorites WHERE user_id = auth.uid();
```

### What RLS Protects Against

✓ User X can't read User Y's journal
✓ User X can't modify User Y's favorites
✓ User X can't delete User Y's prayer history
✓ User X can't see User Y's settings

### Service Role Key Bypasses RLS

Only use in server-side code (not browser):

```typescript
// src/lib/supabase-server.ts
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Bypass RLS
);

// Usage (only in server-side routes):
const { data } = await supabaseServer
  .from('profiles')
  .select('*'); // Returns ALL users' profiles
```

---

## Performance Tips

### ✓ DO: Use Pagination

```typescript
const pageSize = 20;
const page = 0;

const { data } = await supabase
  .from('journal_entries')
  .select('*')
  .eq('user_id', userId)
  .range(page * pageSize, (page + 1) * pageSize - 1)
  .order('created_at', { ascending: false });
```

### ✗ DON'T: Fetch All Rows

```typescript
// SLOW - brings all rows to client
const { data } = await supabase
  .from('journal_entries')
  .select('*'); // Could be 1000s of rows

// FAST - only what's needed
const { data } = await supabase
  .from('journal_entries')
  .select('id, title, created_at')
  .eq('user_id', userId)
  .limit(20);
```

### ✓ DO: Filter at Database

```typescript
// FAST - database filters
const { data } = await supabase
  .from('meditation_history')
  .select('*')
  .eq('was_completed', true)
  .gte('started_at', thirtyDaysAgo);
```

### ✗ DON'T: Filter in JavaScript

```typescript
// SLOW - brings all rows, filters in app
const { data: all } = await supabase
  .from('meditation_history')
  .select('*');

const filtered = all.filter(m => m.was_completed && m.started_at > thirtyDaysAgo);
```

---

## Common Errors & Solutions

### Error: "Unauthorized" (403)

**Cause:** RLS policy blocking your query
**Solution:** Check if `user_id` matches `auth.uid()`

```typescript
// Wrong - tries to access another user's data
const { data, error } = await supabase
  .from('journal_entries')
  .select('*')
  .eq('user_id', someOtherId);
// Error: Unauthorized

// Right - accesses own data
const { data, error } = await supabase
  .from('journal_entries')
  .select('*')
  .eq('user_id', auth.uid());
// Success!
```

### Error: "Failed to create profile"

**Cause:** User wasn't in auth.users
**Solution:** Create user in Auth first, profile auto-creates

```typescript
// This happens automatically on signup
// No manual profile creation needed
```

### Error: "Foreign key constraint failed"

**Cause:** Trying to insert with non-existent user_id
**Solution:** Verify user exists and is authenticated

```typescript
const session = await auth();
if (!session?.user?.id) {
  throw new Error('User not authenticated');
}

// Now safe to use session.user.id as foreign key
```

---

## Testing Checklist

Before going live:

- [ ] Run SCHEMA_DESIGN.sql in Supabase SQL Editor
- [ ] Verify 8 tables created (see earlier in this guide)
- [ ] Create test user → verify profile auto-created
- [ ] Try accessing another user's data → verify 403 error
- [ ] Create favorite → verify it appears in list
- [ ] Create journal entry → verify it's saved
- [ ] Start meditation → verify history recorded
- [ ] Complete meditation → verify completion data saved
- [ ] Rate meditation → verify rating stored
- [ ] Mark prayer answered → verify status changed

---

## Environment Variables

Add to `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (from Dashboard)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (from Dashboard)

# Auth (existing)
AUTH_GOOGLE_ID=xxx
AUTH_GOOGLE_SECRET=xxx
AUTH_SECRET=xxx
```

Get keys from: Supabase Dashboard → **Project Settings → API**

---

## Useful SQL Queries

### Check Database Size

```sql
SELECT
  pg_size_pretty(pg_database_size('postgres')) AS size;
```

### Count Rows Per Table

```sql
SELECT
  schemaname,
  tablename,
  n_live_tup AS live_rows
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;
```

### Check RLS Policies

```sql
SELECT
  tablename,
  policyname,
  permissive,
  qual AS policy_definition
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Check Triggers

```sql
SELECT
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
```

### Check All Indexes

```sql
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## Next Steps

1. **Execute Schema** (5 min)
   - Follow "Getting Started" section above
   - Verify all 8 tables created

2. **Setup Clients** (30 min)
   - Create `src/lib/supabase-client.ts`
   - Create `src/lib/supabase-server.ts`
   - Copy types from `SUPABASE_TYPES_REFERENCE.ts` to `src/types/supabase.ts`

3. **Build API Routes** (2-3 hours)
   - `/api/profile`
   - `/api/settings`
   - `/api/favorites`
   - `/api/journal`
   - `/api/meditation-history`
   - `/api/prayer-history`

4. **Create React Hooks** (2-3 hours)
   - `useProfile()`
   - `useSettings()`
   - `useFavorites()`
   - `useJournal()`
   - `useMeditationHistory()`

5. **Add Components** (2-3 hours)
   - Profile card
   - Settings panel
   - Favorites list
   - Journal editor
   - Meditation player (enhanced with history)

6. **Test & Deploy** (2-3 hours)
   - Run integration tests
   - Deploy to production
   - Monitor for errors

---

## Support Resources

- Supabase Docs: https://supabase.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Auth.js Docs: https://authjs.dev/

---

## Questions?

Refer to detailed docs:
- Schema details → `SCHEMA_DESIGN.sql`
- Deployment steps → `SCHEMA_MIGRATION_GUIDE.md`
- API types → `SUPABASE_TYPES_REFERENCE.ts`
- Implementation tasks → `SUPABASE_IMPLEMENTATION_CHECKLIST.md`
- Architecture → `ARCHITECTURE_DIAGRAM.txt`

**Document Version:** 1.0
**Status:** Ready to Use
