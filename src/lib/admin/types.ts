// Admin panel types — MVP
// MVP - features avançadas como meditações ouvidas, versículos mais lidos etc. serão adicionadas depois

export interface AdminUser {
  id: string
  name: string | null
  email: string
  image: string | null
  role: 'user' | 'admin' | 'moderator'
  created_at: string
  // From user_progress (joined)
  current_streak?: number
  total_xp?: number
  level?: number
  tree_level?: number
  completed_days?: number
}

export interface KpiData {
  totalUsers: number
  newUsers7d: number
  newUsers30d: number
  dauToday: number
  mauMonth: number
}

export type KpiColor = 'default' | 'green' | 'orange' | 'blue'

export type KpiIconName =
  | 'users'
  | 'user-plus'
  | 'crown'
  | 'activity'
  | 'trending-up'
  | 'zap'

export interface GrowthPoint {
  date: string
  count: number
}

export interface DauPoint {
  date: string
  dau: number
}

export interface PlanPoint {
  name: string
  value: number
  color: string
}

export interface RecentUser {
  id: string
  name: string | null
  email: string
  created_at: string
}
