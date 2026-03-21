'use client'

import type { ChurnTrendPoint } from '@/lib/admin/retention-queries'

interface ChurnTrendChartProps {
  data: ChurnTrendPoint[]
}

export function ChurnTrendChart({ data }: ChurnTrendChartProps) {
  const maxVal = Math.max(...data.flatMap((d) => [d.newSubs, d.canceled]), 1)
  const totalNew = data.reduce((s, d) => s + d.newSubs, 0)
  const totalCanceled = data.reduce((s, d) => s + d.canceled, 0)
  const netGrowth = totalNew - totalCanceled

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[#1F2937]">Novos vs Cancelamentos</h3>
          <p className="text-xs text-[#9CA3AF]">Assinaturas Plus — últimos 6 meses</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-[#9CA3AF]">Crescimento líquido</p>
          <p
            className={`text-lg font-bold tabular-nums ${netGrowth >= 0 ? 'text-[#10B981]' : 'text-red-400'}`}
          >
            {netGrowth >= 0 ? '+' : ''}
            {netGrowth}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-5">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#10B981]" />
          <span className="text-xs text-[#6B7280]">Novos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-400" />
          <span className="text-xs text-[#6B7280]">Cancelamentos</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-2 h-36">
        {data.map((point) => {
          const newH = Math.max((point.newSubs / maxVal) * 100, point.newSubs > 0 ? 4 : 0)
          const cancelH = Math.max(
            (point.canceled / maxVal) * 100,
            point.canceled > 0 ? 4 : 0
          )
          return (
            <div key={point.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center gap-0.5 h-28">
                <div
                  className="flex-1 bg-[#10B981] rounded-t transition-all duration-500"
                  style={{ height: `${newH}%` }}
                  title={`Novos: ${point.newSubs}`}
                />
                <div
                  className="flex-1 bg-red-400 rounded-t transition-all duration-500"
                  style={{ height: `${cancelH}%` }}
                  title={`Cancelamentos: ${point.canceled}`}
                />
              </div>
              <span className="text-[10px] text-[#9CA3AF] capitalize whitespace-nowrap">
                {point.month}
              </span>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-[#F9F8F5] flex justify-between text-xs">
        <span className="text-[#9CA3AF]">
          Total novos:{' '}
          <span className="font-semibold text-[#10B981]">{totalNew}</span>
        </span>
        <span className="text-[#9CA3AF]">
          Total cancelamentos:{' '}
          <span className="font-semibold text-red-400">{totalCanceled}</span>
        </span>
      </div>
    </div>
  )
}
