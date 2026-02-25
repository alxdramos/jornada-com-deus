import { KpiCard } from '@/components/admin/KpiCard'
import { SubscriptionsPlaceholder } from '@/components/admin/SubscriptionsTable'

// MVP - features avançadas como churn detalhado, cohort analysis etc. serão adicionadas depois

export default function AssinaturasPage() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-[#1F2937]">Assinaturas</h1>
        <p className="text-sm text-[#9CA3AF] mt-0.5">
          Monetização e planos de assinatura
        </p>
      </div>

      {/* KPI Cards de Monetização */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Assinantes Plus"
          value={0}
          icon="crown"
          color="orange"
          description="Gateway não integrado"
          index={0}
        />
        <KpiCard
          title="Taxa de Conversão"
          value="0%"
          icon="trending-up"
          color="green"
          description="Free → Plus"
          index={1}
        />
        <KpiCard
          title="Churn (mês)"
          value={0}
          icon="activity"
          description="Cancelamentos"
          index={2}
        />
        <KpiCard
          title="Receita MRR"
          value="—"
          icon="zap"
          description="Integração pendente"
          index={3}
        />
      </div>

      {/* Placeholder com roadmap */}
      <SubscriptionsPlaceholder />
    </div>
  )
}
