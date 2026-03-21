/**
 * Retention & Churn queries — B18
 * Análise de coorte D7/D30, tendência de churn e usuários em risco
 */
import { supabaseAdmin } from '@/lib/supabase'

// ── Helpers ───────────────────────────────────────────────────────────────────

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function formatMonth(date: Date): string {
  return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RetentionKpis {
  d7Retention: number   // % do coorte de 7d que teve ao menos 1 sessão na 1ª semana
  d30Retention: number  // % do coorte de 30d que teve ao menos 1 sessão no 1º mês
  churnRateMonth: number // % de Plus que cancelou este mês
  atRiskCount: number   // Plus com assinatura expirando em 30 dias
  avgStreak: number     // Streak médio de usuários ativos
}

export interface CohortRow {
  cohort: string  // "Mar/26"
  total: number
  d7: number      // % retidos até o dia 7 (-1 = N/A, coorte nova demais)
  d30: number     // % retidos até o dia 30 (-1 = N/A)
}

export interface ChurnTrendPoint {
  month: string     // "Jan/26"
  canceled: number
  newSubs: number
}

export interface AtRiskUser {
  user_id: string
  email: string | null
  name: string | null
  expires_at: string
  daysLeft: number
}

// ── Retention KPIs ────────────────────────────────────────────────────────────

export async function getRetentionKpis(): Promise<RetentionKpis> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const thirtyDaysFromNow = addDays(now, 30)
  const fourteenDaysAgo = addDays(now, -14)
  const sevenDaysAgo = addDays(now, -7)
  const sixtyDaysAgo = addDays(now, -60)
  const thirtyDaysAgo = addDays(now, -30)

  // Buscar coortes em paralelo com métricas de negócio
  const [d7CohortData, d30CohortData, plusActive, churnedMonth, atRisk, streaks] = await Promise.all([
    // D7 cohort: cadastros há 7-14 dias (velhos o suficiente para medir D7)
    supabaseAdmin
      .from('profiles')
      .select('id')
      .gte('created_at', fourteenDaysAgo.toISOString())
      .lt('created_at', sevenDaysAgo.toISOString()),
    // D30 cohort: cadastros há 30-60 dias
    supabaseAdmin
      .from('profiles')
      .select('id')
      .gte('created_at', sixtyDaysAgo.toISOString())
      .lt('created_at', thirtyDaysAgo.toISOString()),
    // Assinantes Plus ativos
    supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    // Cancelamentos este mês
    supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .in('status', ['canceled', 'refunded', 'chargeback'])
      .gte('canceled_at', startOfMonth.toISOString()),
    // Usuários em risco: Plus expirando em 30 dias
    supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .gte('expires_at', now.toISOString())
      .lte('expires_at', thirtyDaysFromNow.toISOString()),
    // Streak médio de usuários ativos (últimos 30d)
    supabaseAdmin
      .from('user_progress')
      .select('current_streak')
      .gt('current_streak', 0)
      .gte('updated_at', thirtyDaysAgo.toISOString()),
  ])

  const d7Ids = (d7CohortData.data ?? []).map((u) => u.id)
  const d30Ids = (d30CohortData.data ?? []).map((u) => u.id)

  // Buscar progresso dos coortes para calcular retenção via completed_dates
  const [d7Progress, d30Progress] = await Promise.all([
    d7Ids.length > 0
      ? supabaseAdmin
          .from('user_progress')
          .select('user_id, completed_dates')
          .in('user_id', d7Ids)
      : Promise.resolve({ data: [] }),
    d30Ids.length > 0
      ? supabaseAdmin
          .from('user_progress')
          .select('user_id, completed_dates')
          .in('user_id', d30Ids)
      : Promise.resolve({ data: [] }),
  ])

  // D7: % que completou ao menos 1 sessão na primeira semana
  const d7RetainedCount = (d7Progress.data ?? []).filter(
    (p) => (p.completed_dates ?? []).length > 0
  ).length

  // D30: % que completou ao menos 1 sessão no primeiro mês
  const d30RetainedCount = (d30Progress.data ?? []).filter(
    (p) => (p.completed_dates ?? []).length > 0
  ).length

  const plusActiveCount = plusActive.count ?? 1
  const churned = churnedMonth.count ?? 0
  const streakList = streaks.data ?? []
  const avgStreak =
    streakList.length > 0
      ? Math.round(streakList.reduce((s, r) => s + (r.current_streak ?? 0), 0) / streakList.length)
      : 0

  return {
    d7Retention: d7Ids.length > 0 ? Math.round((d7RetainedCount / d7Ids.length) * 100) : 0,
    d30Retention: d30Ids.length > 0 ? Math.round((d30RetainedCount / d30Ids.length) * 100) : 0,
    churnRateMonth:
      plusActiveCount > 0 ? parseFloat(((churned / plusActiveCount) * 100).toFixed(1)) : 0,
    atRiskCount: atRisk.count ?? 0,
    avgStreak,
  }
}

// ── Cohort Retention Table ────────────────────────────────────────────────────

export async function getCohortRetention(): Promise<CohortRow[]> {
  const now = new Date()
  const rows: CohortRow[] = []

  // 6 meses de coortes mensais (mais recente por último)
  for (let i = 5; i >= 0; i--) {
    const cohortStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const cohortEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

    // Coorte precisa ter pelo menos 7 dias de idade para medir D7
    const d7Measurable = now >= addDays(cohortEnd, 7)
    // Coorte precisa ter pelo menos 30 dias de idade para medir D30
    const d30Measurable = now >= addDays(cohortEnd, 30)

    const { data: cohortUsers } = await supabaseAdmin
      .from('profiles')
      .select('id, created_at')
      .gte('created_at', cohortStart.toISOString())
      .lt('created_at', cohortEnd.toISOString())

    const total = (cohortUsers ?? []).length

    if (total === 0) {
      rows.push({ cohort: formatMonth(cohortStart), total: 0, d7: -1, d30: -1 })
      continue
    }

    const userIds = (cohortUsers ?? []).map((u) => u.id)

    // Buscar completed_dates de todos os usuários do coorte
    const { data: progressData } = await supabaseAdmin
      .from('user_progress')
      .select('user_id, completed_dates')
      .in('user_id', userIds)

    const progressMap = new Map(
      (progressData ?? []).map((p) => [p.user_id, new Set<string>(p.completed_dates ?? [])])
    )

    let d7Count = 0
    let d30Count = 0

    for (const user of cohortUsers ?? []) {
      const signupDate = new Date(user.created_at)
      const completedDates = progressMap.get(user.id) ?? new Set<string>()

      if (d7Measurable) {
        // D7: completou ao menos 1 sessão nos primeiros 7 dias após cadastro
        const d7Window = Array.from({ length: 7 }, (_, k) =>
          formatDate(addDays(signupDate, k))
        )
        if (d7Window.some((d) => completedDates.has(d))) d7Count++
      }

      if (d30Measurable) {
        // D30: completou ao menos 1 sessão nos primeiros 30 dias
        const d30Window = Array.from({ length: 30 }, (_, k) =>
          formatDate(addDays(signupDate, k))
        )
        if (d30Window.some((d) => completedDates.has(d))) d30Count++
      }
    }

    rows.push({
      cohort: formatMonth(cohortStart),
      total,
      d7: d7Measurable ? Math.round((d7Count / total) * 100) : -1,
      d30: d30Measurable ? Math.round((d30Count / total) * 100) : -1,
    })
  }

  return rows
}

// ── Churn Trend (últimos 6 meses) ─────────────────────────────────────────────

export async function getChurnTrend(): Promise<ChurnTrendPoint[]> {
  const now = new Date()
  const points: ChurnTrendPoint[] = []

  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

    const [canceledRes, newSubsRes] = await Promise.all([
      supabaseAdmin
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .in('status', ['canceled', 'refunded', 'chargeback'])
        .gte('canceled_at', monthStart.toISOString())
        .lt('canceled_at', monthEnd.toISOString()),
      supabaseAdmin
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString())
        .lt('created_at', monthEnd.toISOString()),
    ])

    points.push({
      month: formatMonth(monthStart),
      canceled: canceledRes.count ?? 0,
      newSubs: newSubsRes.count ?? 0,
    })
  }

  return points
}

// ── At-Risk Users ─────────────────────────────────────────────────────────────

export async function getAtRiskUsers(): Promise<AtRiskUser[]> {
  const now = new Date()
  const thirtyDaysFromNow = addDays(now, 30)

  const { data: subs } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id, expires_at')
    .eq('status', 'active')
    .gte('expires_at', now.toISOString())
    .lte('expires_at', thirtyDaysFromNow.toISOString())
    .order('expires_at', { ascending: true })

  if (!subs || subs.length === 0) return []

  const userIds = subs.map((s) => s.user_id)
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, email, name')
    .in('id', userIds)

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]))

  return subs.map((s) => {
    const expiresAt = new Date(s.expires_at)
    const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    const profile = profileMap.get(s.user_id)
    return {
      user_id: s.user_id,
      email: profile?.email ?? null,
      name: profile?.name ?? null,
      expires_at: s.expires_at,
      daysLeft,
    }
  })
}
