/**
 * Admin queries — usa supabaseAdmin (service role, bypassa RLS)
 * NUNCA importar em Client Components
 * MVP - features avançadas serão adicionadas depois
 */
import { supabaseAdmin } from '@/lib/supabase'
import type { AdminUser, KpiData, GrowthPoint, DauPoint, PlanPoint, RecentUser } from './types'

// ── KPI Overview ─────────────────────────────────────────────────────────────
export async function getKpiData(): Promise<KpiData> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayISO = todayStart.toISOString()

  const [totalResult, new7dResult, new30dResult, dauResult, mauResult] = await Promise.all([
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
    supabaseAdmin.from('user_progress').select('*', { count: 'exact', head: true }).gte('updated_at', todayISO),
    supabaseAdmin.from('user_progress').select('*', { count: 'exact', head: true }).gte('updated_at', thirtyDaysAgo),
  ])

  return {
    totalUsers: totalResult.count ?? 0,
    newUsers7d: new7dResult.count ?? 0,
    newUsers30d: new30dResult.count ?? 0,
    dauToday: dauResult.count ?? 0,
    mauMonth: mauResult.count ?? 0,
  }
}

// ── Crescimento de usuários (30 dias) ────────────────────────────────────────
export async function getUserGrowth30d(): Promise<GrowthPoint[]> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const { data } = await supabaseAdmin
    .from('profiles')
    .select('created_at')
    .gte('created_at', thirtyDaysAgo)
    .order('created_at', { ascending: true })

  const grouped = (data ?? []).reduce((acc: Record<string, number>, row) => {
    const date = row.created_at.slice(0, 10)
    acc[date] = (acc[date] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(grouped).map(([date, count]) => ({ date, count }))
}

// ── DAU últimos 7 dias ────────────────────────────────────────────────────────
export async function getDauLast7d(): Promise<DauPoint[]> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data } = await supabaseAdmin
    .from('user_progress')
    .select('updated_at')
    .gte('updated_at', sevenDaysAgo)

  const grouped = (data ?? []).reduce((acc: Record<string, number>, row) => {
    const date = row.updated_at.slice(0, 10)
    acc[date] = (acc[date] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(grouped)
    .map(([date, dau]) => ({ date, dau }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

// ── Distribuição de planos ────────────────────────────────────────────────────
export async function getPlanDistribution(): Promise<PlanPoint[]> {
  const { count: totalCount } = await supabaseAdmin
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // MVP: sem sistema de pagamento ainda — todos são free
  return [
    { name: 'Free', value: totalCount ?? 0, color: '#9CA3AF' },
    { name: 'Plus', value: 0, color: '#FB923C' },
  ]
}

// ── Lista paginada de usuários ────────────────────────────────────────────────
export async function getAdminUsers(
  page: number,
  pageSize: number,
  search?: string
): Promise<{ users: AdminUser[]; total: number }> {
  let query = supabaseAdmin
    .from('profiles')
    .select('id, name, email, avatar_url, role, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data: users, count } = await query

  // Busca dados de progresso para esses usuários
  const userIds = (users ?? []).map((u) => u.id)
  const { data: progress } =
    userIds.length > 0
      ? await supabaseAdmin
          .from('user_progress')
          .select('user_id, current_streak, total_xp, level, tree_level, completed_days')
          .in('user_id', userIds)
      : { data: [] }

  const progressMap = Object.fromEntries((progress ?? []).map((p) => [p.user_id, p]))

  return {
    users: (users ?? []).map((user) => ({
      ...user,
      ...(progressMap[user.id] ?? {}),
    })) as AdminUser[],
    total: count ?? 0,
  }
}

// ── Cadastros recentes ────────────────────────────────────────────────────────
export async function getRecentUsers(limit = 5): Promise<RecentUser[]> {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('id, name, email, created_at')

    .order('created_at', { ascending: false })
    .limit(limit)

  return (data ?? []) as RecentUser[]
}

// ── Top streaks ───────────────────────────────────────────────────────────────
export async function getTopStreaks(limit = 5) {
  const { data } = await supabaseAdmin
    .from('user_progress')
    .select('user_id, current_streak, max_streak, level, tree_level')
    .order('current_streak', { ascending: false })
    .limit(limit)

  return data ?? []
}
