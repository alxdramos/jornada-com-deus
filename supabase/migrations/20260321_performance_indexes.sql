-- B15 — Índices de Performance
-- Queries frequentes no admin panel e operações críticas do app

-- ── user_progress ──────────────────────────────────────────────────────────────
-- FK user_id não tem índice automático no PostgreSQL
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id
  ON user_progress(user_id);

-- Query combinada user + updated_at para DAU, retenção e análise de coorte
CREATE INDEX IF NOT EXISTS idx_user_progress_user_updated
  ON user_progress(user_id, updated_at DESC);

-- ── user_favorites ─────────────────────────────────────────────────────────────
-- Já existe UNIQUE(user_id, item_id) mas não há índice só por user_id para listing
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id
  ON user_favorites(user_id);

-- Filtrar bookmarks por tipo de conteúdo
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_type
  ON user_favorites(user_id, item_type);

-- ── subscriptions ──────────────────────────────────────────────────────────────
-- Dashboard: filtrar por status (active, canceled, etc.)
CREATE INDEX IF NOT EXISTS idx_subscriptions_status
  ON subscriptions(status);

-- Verificação de plano por usuário
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status
  ON subscriptions(user_id, status);

-- Usuários em risco: assinaturas ativas próximas do vencimento
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_active
  ON subscriptions(expires_at ASC)
  WHERE status = 'active';

-- Análise de churn: quando cada assinatura foi cancelada
CREATE INDEX IF NOT EXISTS idx_subscriptions_canceled_at
  ON subscriptions(canceled_at DESC)
  WHERE canceled_at IS NOT NULL;

-- ── profiles ───────────────────────────────────────────────────────────────────
-- Distribuição de planos free/plus
CREATE INDEX IF NOT EXISTS idx_profiles_plan
  ON profiles(plan);

-- Crescimento de usuários por data de cadastro
CREATE INDEX IF NOT EXISTS idx_profiles_created_at
  ON profiles(created_at DESC);

-- Verificação de role admin (índice parcial — poucos admins)
CREATE INDEX IF NOT EXISTS idx_profiles_role_admin
  ON profiles(role)
  WHERE role IN ('admin', 'moderator');

-- ── analytics_events ───────────────────────────────────────────────────────────
-- Nota: (event_name, created_at) e (user_id, created_at) já existem na migration 20260316
-- Adicionamos apenas índice de sessão para análises futuras de funil
CREATE INDEX IF NOT EXISTS idx_analytics_events_session
  ON analytics_events(session_id)
  WHERE session_id IS NOT NULL;
