'use client'

import { cn } from '@/lib/utils'
import type { CohortRow } from '@/lib/admin/retention-queries'

interface CohortTableProps {
  data: CohortRow[]
}

function RetentionCell({ value }: { value: number }) {
  if (value === -1) return <span className="text-xs text-[#C4C9D4]">—</span>

  const color =
    value >= 50
      ? 'text-[#10B981]'
      : value >= 25
        ? 'text-[#FB923C]'
        : 'text-red-400'

  return (
    <div className="flex flex-col items-end gap-1">
      <span className={cn('text-sm font-bold tabular-nums', color)}>{value}%</span>
      <div className="w-16 h-1 bg-[#F3F4F6] rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full',
            value >= 50 ? 'bg-[#10B981]' : value >= 25 ? 'bg-[#FB923C]' : 'bg-red-400'
          )}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  )
}

export function CohortTable({ data }: CohortTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#1F2937]">Retenção por Coorte</h3>
        <p className="text-xs text-[#9CA3AF]">
          % de usuários que completaram ao menos 1 sessão devocional
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <span className="text-2xl">📊</span>
          <p className="text-sm text-[#9CA3AF]">Dados insuficientes</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F3F4F6]">
                <th className="text-left py-2.5 pr-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
                  Coorte
                </th>
                <th className="text-right py-2.5 px-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
                  Usuários
                </th>
                <th className="text-right py-2.5 px-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
                  D7
                </th>
                <th className="text-right py-2.5 pl-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
                  D30
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F9F8F5]">
              {data.map((row) => (
                <tr key={row.cohort} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3.5 pr-4 font-semibold text-[#1F2937] capitalize">
                    {row.cohort}
                  </td>
                  <td className="py-3.5 px-3 text-right text-[#6B7280] tabular-nums">
                    {row.total.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <RetentionCell value={row.d7} />
                  </td>
                  <td className="py-3.5 pl-3 text-right">
                    <RetentionCell value={row.d30} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-[#F9F8F5] flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
          <span className="text-[11px] text-[#9CA3AF]">≥50% excelente</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FB923C]" />
          <span className="text-[11px] text-[#9CA3AF]">25–49% ok</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="text-[11px] text-[#9CA3AF]">&lt;25% atenção</span>
        </div>
        <span className="text-[11px] text-[#C4C9D4] ml-auto">
          — = coorte nova demais para medir
        </span>
      </div>
    </div>
  )
}
