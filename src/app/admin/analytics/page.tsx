import { Suspense } from 'react'
import { KpiCard } from '@/components/admin/KpiCard'
import {
  getTopMeditations,
  getTopPrayers,
  getPaywallFunnel,
  getFeatureEngagement,
} from '@/lib/admin/analytics-queries'

async function AnalyticsContent() {
  const [topMeditations, topPrayers, funnel, engagement] = await Promise.all([
    getTopMeditations(5),
    getTopPrayers(5),
    getPaywallFunnel(),
    getFeatureEngagement(),
  ])

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1F2937]">Analytics</h1>
        <p className="text-sm text-[#9CA3AF] mt-0.5">
          Comportamento dos usuários — últimos 30 dias
        </p>
      </div>

      {/* Funil do Paywall */}
      <section>
        <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
          Funil do Paywall
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard
            title="Paywall exibido"
            value={funnel.shown}
            icon="activity"
            description="Usuários que viram o paywall"
            index={0}
          />
          <KpiCard
            title="Clicou em assinar"
            value={funnel.clicked}
            icon="trending-up"
            color="orange"
            description="Abriram o checkout"
            index={1}
          />
          <KpiCard
            title="Taxa de conversão"
            value={`${funnel.conversionRate}%`}
            icon="zap"
            color={funnel.conversionRate >= 10 ? 'green' : 'default'}
            description="shown → clicked"
            index={2}
          />
        </div>
      </section>

      {/* Top Conteúdo */}
      <section>
        <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
          Top Conteúdo
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Meditações */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[#1F2937]">Meditações mais ouvidas</h3>
              <p className="text-xs text-[#9CA3AF]">Por quantidade de inícios</p>
            </div>
            {topMeditations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <span className="text-2xl">🎧</span>
                <p className="text-sm text-[#9CA3AF]">Nenhum dado ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topMeditations.map((item, i) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-bold text-[#C4C9D4] shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1F2937] truncate">{item.title}</p>
                      <div className="mt-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#8B5CF6] rounded-full"
                          style={{ width: `${(item.count / (topMeditations[0]?.count || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#6B7280] tabular-nums shrink-0">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Orações */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[#1F2937]">Orações mais reproduzidas</h3>
              <p className="text-xs text-[#9CA3AF]">Por quantidade de inícios</p>
            </div>
            {topPrayers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <span className="text-2xl">🙏</span>
                <p className="text-sm text-[#9CA3AF]">Nenhum dado ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topPrayers.map((item, i) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-bold text-[#C4C9D4] shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1F2937] truncate">{item.title}</p>
                      <div className="mt-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#10B981] rounded-full"
                          style={{ width: `${(item.count / (topPrayers[0]?.count || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#6B7280] tabular-nums shrink-0">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Engajamento por Feature */}
      <section>
        <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
          Usuários únicos por feature
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {engagement.map((item, i) => (
            <KpiCard
              key={item.feature}
              title={item.feature}
              value={item.uniqueUsers}
              icon="users"
              description="usuários únicos (30d)"
              index={i}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-6 max-w-[1400px]">
          <div className="h-8 w-48 bg-[#F3F4F6] rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-64 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse" />
            <div className="h-64 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse" />
          </div>
        </div>
      }
    >
      <AnalyticsContent />
    </Suspense>
  )
}
