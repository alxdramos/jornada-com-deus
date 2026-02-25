import { Suspense } from 'react'
import { KpiCard } from '@/components/admin/KpiCard'
import { UsersLineChart } from '@/components/admin/charts/UsersLineChart'
import { DauMauChart } from '@/components/admin/charts/DauMauChart'
import { FreePlusDonut } from '@/components/admin/charts/FreePlusDonut'
import { PushNotificationCard } from '@/components/admin/PushNotificationCard'
import {
  getKpiData,
  getUserGrowth30d,
  getDauLast7d,
  getPlanDistribution,
  getRecentUsers,
} from '@/lib/admin/queries'

// MVP - features avançadas como meditações ouvidas, versículos mais lidos etc. serão adicionadas depois

async function DashboardContent() {
  const [kpi, growth, dau, plans, recentUsers] = await Promise.all([
    getKpiData(),
    getUserGrowth30d(),
    getDauLast7d(),
    getPlanDistribution(),
    getRecentUsers(6),
  ])

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1F2937]">Dashboard</h1>
        <p className="text-sm text-[#9CA3AF] mt-0.5">
          Visão geral do crescimento e engajamento
        </p>
      </div>

      {/* KPI Grid — 6 cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Usuários"
          value={kpi.totalUsers}
          icon="users"
          index={0}
        />
        <KpiCard
          title="Novos (7 dias)"
          value={kpi.newUsers7d}
          icon="user-plus"
          color="green"
          description="Última semana"
          index={1}
        />
        <KpiCard
          title="Novos (30 dias)"
          value={kpi.newUsers30d}
          icon="zap"
          description="Último mês"
          index={2}
        />
        <KpiCard
          title="Ativos Hoje"
          value={kpi.dauToday}
          icon="activity"
          color="orange"
          description="DAU de hoje"
          index={3}
        />
        <KpiCard
          title="Ativos 30 dias"
          value={kpi.mauMonth}
          icon="trending-up"
          color="blue"
          description="MAU aproximado"
          index={4}
        />
        <KpiCard
          title="Assinantes Plus"
          value="Em breve"
          icon="crown"
          color="orange"
          description="Gateway pendente"
          index={5}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <UsersLineChart data={growth} />
        </div>
        <FreePlusDonut data={plans} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DauMauChart data={dau} />

        {/* Cadastros recentes */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#1F2937]">Cadastros Recentes</h3>
            <p className="text-xs text-[#9CA3AF]">Últimos usuários registrados</p>
          </div>

          {recentUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <span className="text-2xl">🌱</span>
              <p className="text-sm text-[#9CA3AF]">Ainda sem usuários</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FB923C]/10 flex items-center justify-center text-xs font-bold text-[#FB923C] shrink-0">
                    {(user.name ?? user.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1F2937] truncate leading-tight">
                      {user.name ?? 'Sem nome'}
                    </p>
                    <p className="text-xs text-[#9CA3AF] truncate leading-tight">{user.email}</p>
                  </div>
                  <p className="text-xs text-[#C4C9D4] shrink-0 tabular-nums">
                    {new Date(user.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notificação Push */}
        <PushNotificationCard />
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-6 max-w-[1400px]">
          <div className="h-8 w-48 bg-[#F3F4F6] rounded-xl animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 h-64 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse" />
            <div className="h-64 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse" />
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
