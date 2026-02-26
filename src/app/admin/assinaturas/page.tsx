import { KpiCard } from '@/components/admin/KpiCard'
import { SubscribersTable, WebhookLogsTable } from '@/components/admin/SubscriptionsTable'
import { getSubscriptionKpis, getSubscribers, getWebhookLogs } from '@/lib/admin/queries'

export default async function AssinaturasPage() {
  const [kpi, subscribers, webhookLogs] = await Promise.all([
    getSubscriptionKpis(),
    getSubscribers(50),
    getWebhookLogs(20),
  ])

  const mrrFormatted = kpi.mrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-[#1F2937]">Assinaturas</h1>
        <p className="text-sm text-[#9CA3AF] mt-0.5">
          Monetização via Hotmart — dados em tempo real
        </p>
      </div>

      {/* KPI Cards de Monetização */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Assinantes Plus"
          value={kpi.totalPlus}
          icon="crown"
          color="orange"
          description={`+${kpi.newThisMonth} este mês`}
          index={0}
        />
        <KpiCard
          title="Taxa de Conversão"
          value={`${kpi.conversionRate}%`}
          icon="trending-up"
          color="green"
          description="Free → Plus"
          index={1}
        />
        <KpiCard
          title="Churn (mês)"
          value={kpi.churnThisMonth}
          icon="activity"
          description="Cancelamentos"
          index={2}
        />
        <KpiCard
          title="MRR"
          value={mrrFormatted}
          icon="zap"
          color="green"
          description="Receita mensal recorrente"
          index={3}
        />
      </div>

      {/* Tabela de assinantes */}
      <SubscribersTable subscribers={subscribers} />

      {/* Logs de webhook */}
      <WebhookLogsTable logs={webhookLogs} />
    </div>
  )
}
