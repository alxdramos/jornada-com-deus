# Supabase Implementation Checklist — Arquivo Histórico

> **Estado atual (27/02/2026): SUPABASE EM PRODUÇÃO ✅**
> Este checklist foi criado em 22/02/2026 para guiar a implementação inicial.
> Todos os itens foram concluídos. Para configuração em novo ambiente, use este arquivo como guia.
> Para o estado atual do projeto, consulte o **README.md**.

**Project:** Jornada com Deus PWA
**Phase:** ✅ Database Architecture — COMPLETO E EM PRODUÇÃO
**URL Produção:** https://app.minhajornadadiaria.com.br

---

## Phase 1: Schema Deployment

### 1.1 Environment Preparation

- [ ] Verify Supabase project exists at https://supabase.com/dashboard
- [ ] Confirm Google OAuth credentials configured in Supabase Auth
- [ ] Note Project URL from Supabase dashboard
- [ ] Note Anon Key from Project Settings > API
- [ ] Note Service Role Key from Project Settings > API
- [ ] Create `.env.local` with Supabase credentials:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=[key]
  SUPABASE_SERVICE_ROLE_KEY=[key]
  ```

### 1.2 Schema Execution

- [ ] Open Supabase Dashboard > SQL Editor
- [ ] Create new query
- [ ] Copy entire `SCHEMA_DESIGN.sql` file
- [ ] Paste into SQL Editor
- [ ] Execute query (Ctrl+Enter or Run button)
- [ ] Verify "✓ Compiled successfully" message
- [ ] Wait for all statements to complete (5-10 seconds)

### 1.3 Schema Verification

- [ ] Open **Table Editor** and verify 8 new tables exist:
  - [ ] `profiles`
  - [ ] `user_settings`
  - [ ] `favorites`
  - [ ] `journal_entries`
  - [ ] `meditation_history`
  - [ ] `prayer_history`
  - [ ] `daily_passages`
  - [ ] `audit_log`

- [ ] Verify triggers created by running in SQL Editor:
  ```sql
  SELECT trigger_name, event_manipulation, event_object_table
  FROM information_schema.triggers
  WHERE trigger_schema = 'public'
  ORDER BY event_object_table;
  ```
  Expected: 6 triggers (one per table with timestamps)

- [ ] Verify RLS policies enabled:
  ```sql
  SELECT tablename
  FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'favorites', 'journal_entries');
  ```

### 1.4 Trigger Testing

- [ ] Create test user in Auth section
  - Email: `test@example.com`
  - Password: `TempPass123!`

- [ ] Verify auto-created profile:
  ```sql
  SELECT id, email, created_at FROM public.profiles
  WHERE email = 'test@example.com';
  ```

- [ ] Verify auto-created user_settings:
  ```sql
  SELECT id, theme, language FROM public.user_settings
  WHERE id = (SELECT id FROM public.profiles WHERE email = 'test@example.com');
  ```

- [ ] Delete test user and verify cascade:
  ```sql
  SELECT COUNT(*) FROM public.profiles
  WHERE email = 'test@example.com';
  ```
  Expected: 0 rows (cascade delete working)

---

## Phase 2: Supabase Client Setup

### 2.1 Install Dependencies

```bash
npm install @supabase/supabase-js
```

- [ ] Confirm installation

### 2.2 Create Client Files

Create file: `src/lib/supabase-client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

- [ ] File created

Create file: `src/lib/supabase-server.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

- [ ] File created

### 2.3 Create TypeScript Types

Create file: `src/types/supabase.ts`

Copy content from `SUPABASE_TYPES_REFERENCE.ts`

- [ ] File created with all types

### 2.4 Update Auth Callbacks

File: `src/auth.config.ts`

Add after session callback:

```typescript
async session({ session, token }) {
  if (token.sub) {
    session.user.id = token.sub;
  }

  // Fetch user profile from Supabase
  const { supabaseServer } = await import('@/lib/supabase-server');
  const { data: profile } = await supabaseServer
    .from('profiles')
    .select('*')
    .eq('id', token.sub)
    .single();

  if (profile) {
    session.user.image = profile.avatar_url;
  }

  return session;
}
```

- [ ] Callback updated

---

## Phase 3: API Route Implementation

### 3.1 Profile API Routes

Create: `src/app/api/profile/route.ts`

```typescript
import { auth } from '@/auth';
import { supabase } from '@/lib/supabase-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from('profiles')
    .update(body)
    .eq('id', session.user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
```

- [ ] Route created and tested

### 3.2 Settings API Routes

Create: `src/app/api/settings/route.ts`

Similar pattern to profile (GET/PUT for user_settings table)

- [ ] Route created and tested

### 3.3 Favorites API Routes

Create: `src/app/api/favorites/route.ts`

```typescript
// GET: List all favorites
// POST: Create favorite
// DELETE: Remove favorite
```

- [ ] Route created and tested

### 3.4 Journal API Routes

Create: `src/app/api/journal/route.ts`

```typescript
// GET: List entries
// POST: Create entry
// PUT: Update entry (by ID)
// DELETE: Delete entry (by ID)
```

- [ ] Route created and tested

---

## Phase 4: React Hooks & Components

### 4.1 Create Custom Hooks

File: `src/hooks/useProfile.ts`

```typescript
import { useEffect, useState } from 'react';
import type { Profile } from '@/types/supabase';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { profile, loading, error };
}
```

- [ ] Hook created

File: `src/hooks/useSettings.ts`

- [ ] Hook created

File: `src/hooks/useFavorites.ts`

```typescript
// Functions:
// - getFavorites()
// - addFavorite()
// - removeFavorite()
// - reorderFavorites()
```

- [ ] Hook created

File: `src/hooks/useJournal.ts`

```typescript
// Functions:
// - getEntries()
// - createEntry()
// - updateEntry()
// - deleteEntry()
```

- [ ] Hook created

### 4.2 Create Components

Create: `src/components/ProfileCard.tsx`

- [ ] Component created
- [ ] Displays user profile
- [ ] Links to edit profile

Create: `src/components/SettingsPanel.tsx`

- [ ] Component created
- [ ] Theme selector
- [ ] Notification toggles
- [ ] Language selector

Create: `src/components/FavoritesButton.tsx`

Reusable favorite toggle button for prayers/meditations

- [ ] Component created
- [ ] Add/remove favorite functionality
- [ ] Visual feedback (heart icon)

Create: `src/components/JournalEntry.tsx`

Display journal entry with markdown support

- [ ] Component created

Create: `src/components/MeditationPlayer.tsx` (enhancement)

Add history tracking on completion

- [ ] Updated to track meditation_history
- [ ] Add user rating after completion
- [ ] Save completion percentage

---

## Phase 5: Integration Tests

### 5.1 Auth Flow Test

- [ ] User signs up with Google
- [ ] Profile created automatically
- [ ] User settings created with defaults
- [ ] User can fetch profile via API
- [ ] Profile data reflects in UI

### 5.2 Favorites Test

- [ ] Add favorite from meditation detail
- [ ] Favorite appears in favorites list
- [ ] Remove favorite from list
- [ ] Favorites persist across sessions
- [ ] Favorites visible only to owner (RLS)

### 5.3 Journal Test

- [ ] Create journal entry from dashboard
- [ ] Entry appears in journal list
- [ ] Edit entry
- [ ] Delete entry
- [ ] Search entries by tag
- [ ] Filter by mood

### 5.4 Meditation History Test

- [ ] Start meditation
- [ ] Complete meditation
- [ ] Rate meditation (1-5 stars)
- [ ] Add notes
- [ ] View history stats
- [ ] See average rating

### 5.5 RLS Test

- [ ] Logout and try to access another user's data
- [ ] Verify 403 Forbidden or empty response
- [ ] Confirm users can only see their own data

---

## Phase 6: Performance & Optimization

### 6.1 Add Indexes Verification

Run in SQL Editor:

```sql
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;
```

- [ ] Verify all indexes exist (see SCHEMA_DESIGN.sql section 13)

### 6.2 Query Optimization

- [ ] Implement pagination for long lists:
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

- [ ] Add WHERE clauses to limit data fetches

### 6.3 Caching Strategy

- [ ] Implement React Query or SWR for data fetching
- [ ] Cache frequently accessed data (profile, settings)
- [ ] Set appropriate cache durations

---

## Phase 7: Monitoring & Maintenance

### 7.1 Database Monitoring

- [ ] Check storage usage monthly:
  - Go to **Project Settings > Database**
  - Free plan: 500 MB limit
  - Monitor growth rate

### 7.2 Backup Verification

- [ ] Enable automatic backups
- [ ] Free plan: Weekly backups
- [ ] Pro plan: Daily backups
- [ ] Test restore procedure

### 7.3 Error Logging

- [ ] Add error logging for failed API calls
- [ ] Monitor Supabase logs
- [ ] Set up alerts for RLS violations

### 7.4 Performance Monitoring

- [ ] Monitor query execution times
- [ ] Check slow query logs
- [ ] Optimize indexes if needed

---

## Phase 8: Production Deployment

### 8.1 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] RLS policies properly configured
- [ ] No console errors in production build
- [ ] API routes tested end-to-end
- [ ] Email verification enabled in Auth
- [ ] Domain verified in Auth settings

### 8.2 Deployment Steps

- [ ] Update `.env` on hosting platform with Supabase keys
- [ ] Deploy Next.js app to production
- [ ] Verify database connectivity
- [ ] Test user signup flow
- [ ] Monitor error logs for first 24 hours

### 8.3 Post-Deployment

- [ ] Announce feature to users
- [ ] Monitor daily active users
- [ ] Check database growth
- [ ] Gather user feedback

---

## Timeline Estimate

| Phase | Duration | Status |
|-------|----------|--------|
| Schema Deployment | 15 min | Ready |
| Client Setup | 30 min | Pending |
| API Routes | 2-3 hours | Pending |
| Hooks & Components | 4-5 hours | Pending |
| Integration Testing | 2-3 hours | Pending |
| Performance Optimization | 1-2 hours | Pending |
| Production Deployment | 1 hour | Pending |
| **Total** | **~11-14 hours** | |

---

## Files Delivered

1. **SCHEMA_DESIGN.sql** - Complete DDL + RLS + Triggers
2. **SCHEMA_MIGRATION_GUIDE.md** - Step-by-step execution guide
3. **SUPABASE_TYPES_REFERENCE.ts** - TypeScript types for all tables
4. **SUPABASE_IMPLEMENTATION_CHECKLIST.md** - This file

---

## Key Architectural Decisions

### Design Patterns Used

1. **RLS for Multi-Tenancy**
   - Each user isolated from other users
   - Service role for admin operations
   - Policies defined per table

2. **Triggers for Automation**
   - Auto-create profile on signup
   - Auto-update timestamps
   - Cascade deletes on user deletion

3. **Extensible JSON Fields**
   - `preferences` in profiles
   - `content_data` in favorites
   - Allow future feature additions without schema changes

4. **Audit Trail**
   - Track all user actions
   - Store before/after values
   - IP address logging for security

### Security Measures

- All PII encrypted in transit (HTTPS)
- Passwords hashed in auth.users table
- RLS prevents cross-user data access
- Audit log tracks all modifications
- Foreign key constraints prevent orphaned records

### Scalability Considerations

- Indexed columns for fast queries
- Composite indexes for common joins
- Views for analytics (don't impact raw table performance)
- Partitioning ready (audit_log could be time-partitioned)

---

## Support & Troubleshooting

### Common Issues

**Q: RLS blocking my queries**
A: Ensure you're using authenticated client and policies allow the operation

**Q: Profile not created on signup**
A: Check trigger exists: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created'`

**Q: Foreign key constraint error**
A: Ensure auth.users.id exists before inserting into public tables

**Q: Performance degradation**
A: Check indexes are created and query explains show index usage

---

## Next Steps After Deployment

1. Implement data export feature (GDPR compliance)
2. Add data retention policies
3. Create admin dashboard for user management
4. Implement real-time updates with Supabase subscriptions
5. Add advanced analytics and reporting
6. Implement data anonymization for deleted users

---

**Document Version:** 1.0
**Last Updated:** 2026-02-22
**Status:** READY FOR EXECUTION

For questions about schema, contact the database engineer.
