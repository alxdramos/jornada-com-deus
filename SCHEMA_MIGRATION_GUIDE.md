# Supabase Schema Migration Guide

**Project:** Jornada com Deus PWA
**Date:** 2026-02-22
**Status:** Ready for Execution

---

## Overview

This guide provides step-by-step instructions to deploy the schema from `SCHEMA_DESIGN.sql` to your Supabase instance. The schema extends Supabase's built-in auth system with user-specific data tables, row-level security policies, and triggers.

**Key Features:**
- Automatic profile creation on user signup
- Row-level security (RLS) on all tables
- Support for favorites, journal, meditation/prayer history
- Audit logging
- Utility views for analytics

---

## Prerequisites

- Active Supabase project (free tier minimum)
- Admin access to Supabase dashboard
- SQL Editor access in Supabase
- The file `SCHEMA_DESIGN.sql` ready to execute

---

## Step 1: Verify Current Auth Setup

Before running migrations, verify your Supabase OAuth configuration:

1. Go to **Project Settings → Auth**
2. Verify **Auth Providers** are configured:
   - Google OAuth (for `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`)
   - Confirm Email/Password is enabled (for credentials)

3. Note your **Project URL** and **Anon Key** (from **Project Settings → API**)
   ```
   Project URL: https://[project-id].supabase.co
   Anon Key: eyJ... (used for client-side auth)
   ```

4. Get your **Service Role Key** (from **Project Settings → API**)
   ```
   Service Role Key: eyJ... (used for admin operations)
   ```

---

## Step 2: Execute Schema SQL

### Option A: Via Supabase SQL Editor (Recommended for First-Time)

1. Open Supabase Dashboard → **SQL Editor**
2. Click **"New Query"** or use the New Query button
3. Copy **entire contents** of `SCHEMA_DESIGN.sql`
4. Paste into the editor
5. Click **Run** (or press `Ctrl+Enter`)
6. Wait for completion (should show green checkmark)

**Expected Output:**
```
✓ Compiled successfully
All statements executed
```

**Time:** ~5-10 seconds

### Option B: Via Command Line (For Automated Deployment)

If you have Supabase CLI installed:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Authenticate
supabase login

# Link to your project
supabase link --project-ref [project-id]

# Run migrations
supabase db push

# Or execute raw SQL file
psql "postgresql://postgres:[password]@[host]:5432/postgres" < SCHEMA_DESIGN.sql
```

---

## Step 3: Verify Schema Creation

After running the SQL, verify all tables were created:

### In Supabase Dashboard:

1. Go to **Table Editor**
2. You should see these new tables in the `public` schema:
   - `profiles`
   - `user_settings`
   - `favorites`
   - `journal_entries`
   - `meditation_history`
   - `prayer_history`
   - `daily_passages`
   - `audit_log`

### Via SQL Query:

Run this query in SQL Editor to list all tables:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected Output:**
```
audit_log
daily_passages
favorites
journal_entries
meditation_history
prayer_history
user_settings
profiles
```

---

## Step 4: Test RLS & Triggers

### Test 1: Automatic Profile Creation

1. Create a test user in Supabase Auth:
   - Go to **Auth → Users**
   - Click **"Add user"**
   - Set email: `test@example.com`, password: `TempPass123!`

2. Verify profile was created:
   ```sql
   SELECT id, email, name, created_at FROM public.profiles
   WHERE email = 'test@example.com';
   ```

   **Expected:** One row with the test user's profile

3. Also verify user_settings was created:
   ```sql
   SELECT id, theme, language FROM public.user_settings
   WHERE id = (SELECT id FROM public.profiles WHERE email = 'test@example.com');
   ```

   **Expected:** One row with theme='light', language='pt-BR'

### Test 2: Row-Level Security

1. In SQL Editor, set **Service Role** mode:
   - Click the role dropdown (top-right of editor)
   - Select **"service_role"** (this bypasses RLS)

2. Insert test data:
   ```sql
   -- Insert test favorite as service role
   INSERT INTO public.favorites (user_id, content_type, content_id, content_title)
   VALUES (
     (SELECT id FROM public.profiles WHERE email = 'test@example.com'),
     'meditation',
     'med_1',
     'Test Meditation'
   );
   ```

3. Switch back to **"authenticated"** role (default)

4. Test that you can't see other users' data:
   ```sql
   -- As authenticated user, try to see all favorites
   -- This should return ZERO rows (RLS blocks access)
   SELECT * FROM public.favorites;
   ```

   **Expected:** 0 rows (RLS working correctly)

5. Create journal entry as authenticated user:
   ```sql
   INSERT INTO public.journal_entries (user_id, title, body)
   VALUES (
     auth.uid(),  -- Current user's ID
     'Test Entry',
     'This is a test journal entry'
   );

   -- This should succeed if authenticated
   ```

---

## Step 5: Configure Application Environment Variables

Update your `.env.local` (or deployment environment) with Supabase credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # For server-side operations

# Auth (existing)
AUTH_GOOGLE_ID=xxx
AUTH_GOOGLE_SECRET=xxx
AUTH_SECRET=xxx
```

---

## Step 6: Implement TypeScript Clients

### Create Supabase Client

File: `src/lib/supabase-client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Create Server Client

File: `src/lib/supabase-server.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

### Define Types

File: `src/types/supabase.ts`

```typescript
export type Profile = {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  account_status: 'active' | 'suspended' | 'deleted';
  subscription_plan: 'free' | 'plus' | 'premium';
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  preferences: Record<string, any>;
};

export type UserSettings = {
  id: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  font_size: 'small' | 'medium' | 'large';
  notifications_enabled: boolean;
  updated_at: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  content_type: 'prayer' | 'meditation' | 'passage';
  content_id: string;
  content_title: string | null;
  content_data: Record<string, any> | null;
  order_index: number;
  note: string | null;
  created_at: string;
  updated_at: string;
};

// Add more types for other tables...
```

---

## Step 7: Test Auth Integration

### Test Profile Creation on Signup

1. Start your Next.js app:
   ```bash
   npm run dev
   ```

2. Go to `/login`

3. Sign up with Google OAuth or Email/Password

4. Check Supabase **Table Editor → profiles** to verify:
   - New row was created
   - `email` matches signup email
   - `created_at` is current time

5. Check **user_settings** table:
   - New row with default theme='light'

---

## Step 8: Backup & Maintenance

### Regular Backups

Supabase automatically backs up daily (Pro plan) or weekly (Free plan). To manually backup:

1. Go to **Project Settings → Backups**
2. Click **"Start a backup now"**
3. Wait for completion
4. Download if needed

### Monitor Database Size

1. Go to **Project Settings → Database**
2. View current storage usage
3. Free plan has 500 MB limit

---

## Troubleshooting

### Issue: "Permission denied" when creating profiles

**Solution:** Ensure the trigger function has `SECURITY DEFINER` set (already in schema).

### Issue: RLS blocking valid queries

**Solution:** Verify you're using the correct Supabase client and user is authenticated.

### Issue: Timestamps not updating

**Solution:** Check that triggers were created successfully:

```sql
SELECT * FROM information_schema.triggers
WHERE event_object_table = 'profiles';
```

### Issue: Foreign key constraint error

**Solution:** Ensure `auth.users` exist before inserting into public tables. The triggers handle this automatically on signup.

---

## Rollback Procedure

If you need to revert the schema:

1. **Backup first** using Supabase backups feature
2. In SQL Editor, execute:

```sql
-- Drop all public tables (WARNING: This deletes all data)
DROP TABLE IF EXISTS public.audit_log CASCADE;
DROP TABLE IF EXISTS public.daily_passages CASCADE;
DROP TABLE IF EXISTS public.prayer_history CASCADE;
DROP TABLE IF EXISTS public.meditation_history CASCADE;
DROP TABLE IF EXISTS public.journal_entries CASCADE;
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.user_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop all triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP TRIGGER IF EXISTS update_profiles_timestamp ON public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.update_profiles_updated_at CASCADE;
-- ... (repeat for all triggers/functions)

-- Drop views
DROP VIEW IF EXISTS public.user_stats CASCADE;
DROP VIEW IF EXISTS public.user_activity_30d CASCADE;
```

---

## Next Steps

After schema deployment:

1. **Update Next.js auth callbacks** to sync user data with Supabase
2. **Implement profile fetch** on first login
3. **Add user settings UI** in settings page
4. **Create favorites feature** in prayer/meditation detail views
5. **Implement journal feature** with CRUD operations
6. **Add meditation/prayer history tracking** on player completion

---

## Support

For issues, check:
- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Your project's error logs in Supabase Dashboard

---

**Schema Version:** 1.0
**Last Updated:** 2026-02-22
**Status:** Production Ready
