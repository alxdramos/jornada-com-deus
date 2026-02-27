import { Suspense } from 'react'
import { KpiCard } from '@/components/admin/KpiCard'
import { TicketsTable } from '@/components/admin/TicketsTable'
import { getTicketKpis, getAdminTickets } from '@/lib/admin/queries'

export const dynamic = 'force-dynamic'

async function TicketsList({ searchParams }: { searchParams: { page?: string; status?: string } }) {
  const page = Math.max(1, Number(searchParams.page ?? 1))
  const status = searchParams.status
  const { tickets, total } = await getAdminTickets(page, 50, status)
  return <TicketsTable tickets={tickets} total={total} />
}

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string }>
}

export default async function SuportePage({ searchParams }: PageProps) {
  const params = await searchParams
  const kpi = await getTicketKpis()

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-[#1F2937]">Suporte</h1>
        <p className="text-sm text-[#9CA3AF] mt-0.5">
          Central de Ajuda — tickets abertos por usuários
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Tickets Abertos"
          value={kpi.totalOpen}
          icon="activity"
          color={kpi.totalOpen > 0 ? 'orange' : 'default'}
          description="Aguardando resposta"
          index={0}
        />
        <KpiCard
          title="Aguardando Usuário"
          value={kpi.totalAguardando}
          icon="users"
          color="default"
          description="Resposta enviada"
          index={1}
        />
        <KpiCard
          title="Resolvidos"
          value={kpi.totalResolvido}
          icon="trending-up"
          color="green"
          description="Total resolvidos"
          index={2}
        />
        <KpiCard
          title="Tickets Hoje"
          value={kpi.totalHoje}
          icon="zap"
          color="default"
          description="Abertos hoje"
          index={3}
        />
      </div>

      {/* Tabela */}
      <Suspense fallback={
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center text-[#9CA3AF] text-sm">
          Carregando tickets...
        </div>
      }>
        <TicketsList searchParams={params} />
      </Suspense>
    </div>
  )
}
