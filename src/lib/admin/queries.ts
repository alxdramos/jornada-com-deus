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

// ── KPIs de Monetização (Hotmart) ─────────────────────────────────────────
export interface SubscriptionKpi {
  totalPlus: number
  mrr: number
  conversionRate: number
  churnThisMonth: number
  newThisMonth: number
}

export async function getSubscriptionKpis(): Promise<SubscriptionKpi> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  const monthISO = startOfMonth.toISOString()

  const [activeResult, totalUsersResult, newThisMonthResult, canceledThisMonthResult, mrrResult] = await Promise.all([
    // Total assinantes Plus ativos
    supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    // Total usuários (para conversão)
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    // Novas assinaturas este mês
    supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .gte('created_at', monthISO),
    // Cancelamentos este mês
    supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .in('status', ['canceled', 'refunded', 'chargeback'])
      .gte('canceled_at', monthISO),
    // MRR: soma dos price_paid de subscriptions ativas
    supabaseAdmin
      .from('subscriptions')
      .select('price_paid')
      .eq('status', 'active'),
  ])

  const totalPlus = activeResult.count ?? 0
  const totalUsers = totalUsersResult.count ?? 1
  const mrr = (mrrResult.data ?? []).reduce((acc, s) => acc + (s.price_paid ?? 0), 0)
  const conversionRate = totalUsers > 0 ? (totalPlus / totalUsers) * 100 : 0

  return {
    totalPlus,
    mrr,
    conversionRate: parseFloat(conversionRate.toFixed(1)),
    churnThisMonth: canceledThisMonthResult.count ?? 0,
    newThisMonth: newThisMonthResult.count ?? 0,
  }
}

// ── Lista de assinantes ────────────────────────────────────────────────────
export interface SubscriberRow {
  user_id: string
  plan: string
  status: string
  price_paid: number | null
  currency: string | null
  starts_at: string | null
  expires_at: string | null
  canceled_at: string | null
  created_at: string
  // Joined from profiles
  email?: string
  name?: string
}

export async function getSubscribers(limit = 50): Promise<SubscriberRow[]> {
  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id, plan, status, price_paid, currency, starts_at, expires_at, canceled_at, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (!data || data.length === 0) return []

  // Buscar emails dos profiles
  const userIds = data.map((s) => s.user_id)
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, email, name')
    .in('id', userIds)

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]))

  return data.map((s) => ({
    ...s,
    email: profileMap[s.user_id]?.email ?? '—',
    name: profileMap[s.user_id]?.name ?? '—',
  }))
}

// ── Atualizar getPlanDistribution para dados reais ────────────────────────
export async function getPlanDistributionReal(): Promise<PlanPoint[]> {
  const [totalCount, plusCount] = await Promise.all([
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
  ])

  const plus = plusCount.count ?? 0
  const total = totalCount.count ?? 0
  const free = Math.max(0, total - plus)

  return [
    { name: 'Free', value: free, color: '#9CA3AF' },
    { name: 'Plus', value: plus, color: '#FB923C' },
  ]
}

// ── Logs de webhook ────────────────────────────────────────────────────────
export interface WebhookLog {
  id: string
  event: string
  hotmart_transaction: string | null
  buyer_email: string | null
  processed: boolean
  error: string | null
  created_at: string
}

export async function getWebhookLogs(limit = 20): Promise<WebhookLog[]> {
  const { data } = await supabaseAdmin
    .from('hotmart_webhook_logs')
    .select('id, event, hotmart_transaction, buyer_email, processed, error, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  return (data ?? []) as WebhookLog[]
}
