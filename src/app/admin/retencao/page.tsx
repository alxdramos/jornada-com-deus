import { Suspense } from 'react'
import { KpiCard } from '@/components/admin/KpiCard'
import { CohortTable } from '@/components/admin/CohortTable'
import { ChurnTrendChart } from '@/components/admin/ChurnTrendChart'
import { AtRiskUsersTable } from '@/components/admin/AtRiskUsersTable'
import {
  getRetentionKpis,
  getCohortRetention,
  getChurnTrend,
  getAtRiskUsers,
} from '@/lib/admin/retention-queries'

async function RetencaoContent() {
  const [kpis, cohort, churnTrend, atRisk] = await Promise.all([
    getRetentionKpis(),
    getCohortRetention(),
    getChurnTrend(),
    getAtRiskUsers(),
  ])

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1F2937]">Retenção & Churn</h1>
        <p className="text-sm text-[#9CA3AF] mt-0.5">
          Análise de coorte D7/D30, churn de assinaturas e usuários em risco
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Retenção D7"
          value={`${kpis.d7Retention}%`}
          icon="trending-up"
          color={kpis.d7Retention >= 40 ? 'green' : 'default'}
          description="Ativos na 1ª semana"
          index={0}
        />
        <KpiCard
          title="Retenção D30"
          value={`${kpis.d30Retention}%`}
          icon="users"
          color={kpis.d30Retention >= 20 ? 'green' : 'default'}
          description="Ativos no 1º mês"
          index={1}
        />
        <KpiCard
          title="Churn (mês)"
          value={`${kpis.churnRateMonth}%`}
          icon="activity"
          description="Taxa de cancelamentos Plus"
          index={2}
        />
        <KpiCard
          title="Em risco (30d)"
          value={kpis.atRiskCount}
          icon="crown"
          color={kpis.atRiskCount > 0 ? 'orange' : 'green'}
          description="Plus expirando em breve"
          index={3}
        />
      </div>

      {/* Streak médio */}
      {kpis.avgStreak > 0 && (
        <div className="bg-gradient-to-r from-[#006947]/5 to-[#815100]/5 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-sm font-semibold text-[#1F2937]">
              Streak médio de usuários ativos: {kpis.avgStreak} dias
            </p>
            <p className="text-xs text-[#9CA3AF]">
              Usuários com progresso nos últimos 30 dias
            </p>
          </div>
        </div>
      )}

      {/* Cohort Table + Churn Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CohortTable data={cohort} />
        <ChurnTrendChart data={churnTrend} />
      </div>

      {/* At-Risk Users */}
      <AtRiskUsersTable users={atRisk} />
    </div>
  )
}

export default function RetencaoPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-6 max-w-[1400px]">
          <div className="h-8 w-48 bg-[#F3F4F6] rounded-xl animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-72 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse" />
            <div className="h-72 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse" />
          </div>
          <div className="h-48 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse" />
        </div>
      }
    >
      <RetencaoContent />
    </Suspense>
  )
}
