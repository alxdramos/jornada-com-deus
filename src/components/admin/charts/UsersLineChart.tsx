'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { GrowthPoint } from '@/lib/admin/types'

interface UsersLineChartProps {
  data: GrowthPoint[]
}

function fmtDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export function UsersLineChart({ data }: UsersLineChartProps) {
  const chartData = data.map((d) => ({ ...d, date: fmtDate(d.date) }))

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm h-full">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#1F2937]">Novos Usuários</h3>
        <p className="text-xs text-[#9CA3AF]">Cadastros nos últimos 30 dias</p>
      </div>

      {chartData.length === 0 ? (
        <div className="h-[180px] flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 bg-[#F3F4F6] rounded-xl flex items-center justify-center">
            <span className="text-lg">📈</span>
          </div>
          <p className="text-sm text-[#9CA3AF]">Ainda sem dados de crescimento</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart
            data={chartData}
            margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#C4C9D4' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#C4C9D4' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
              labelStyle={{ color: '#1F2937', fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey="count"
              name="Novos usuários"
              stroke="#FB923C"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#FB923C', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
