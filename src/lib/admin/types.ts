// Admin panel types — MVP
// MVP - features avançadas como meditações ouvidas, versículos mais lidos etc. serão adicionadas depois

export interface AdminUser {
  id: string
  name: string | null
  email: string
  avatar_url: string | null
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
  email?: string
  name?: string
}

export interface SubscriptionKpi {
  totalPlus: number
  mrr: number
  conversionRate: number
  churnThisMonth: number
  newThisMonth: number
}

export interface WebhookLog {
  id: string
  event: string
  hotmart_transaction: string | null
  buyer_email: string | null
  processed: boolean
  error: string | null
  created_at: string
}

// ── Support Tickets ────────────────────────────────────────────
export type TicketCategory = 'pagamento' | 'acesso' | 'tecnico' | 'feedback' | 'outro'
export type TicketPriority = 'normal' | 'alta'
export type TicketStatus = 'aberto' | 'aguardando' | 'resolvido' | 'fechado'

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  user_name: string | null
  user_email: string | null
  user_plan: string | null
  created_at: string
  updated_at: string
  // Joined: última mensagem
  last_message?: string
  message_count?: number
}

export interface TicketMessage {
  id: string
  ticket_id: string
  sender_type: 'user' | 'admin'
  message: string
  created_at: string
}

export interface TicketKpi {
  totalOpen: number
  totalAguardando: number
  totalResolvido: number
  totalHoje: number
}
