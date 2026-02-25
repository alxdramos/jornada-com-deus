'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { PlanPoint } from '@/lib/admin/types'

interface FreePlusDonutProps {
  data: PlanPoint[]
}

export function FreePlusDonut({ data }: FreePlusDonutProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm h-full">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-[#1F2937]">Distribuição por Plano</h3>
        <p className="text-xs text-[#9CA3AF]">{total.toLocaleString('pt-BR')} usuários total</p>
      </div>

      {total === 0 ? (
        <div className="h-[180px] flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 bg-[#F3F4F6] rounded-xl flex items-center justify-center">
            <span className="text-lg">🌱</span>
          </div>
          <p className="text-sm text-[#9CA3AF]">Ainda sem usuários</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="42%"
              innerRadius={52}
              outerRadius={76}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
              formatter={(value) => [`${Number(value ?? 0).toLocaleString('pt-BR')} usuários`, '']}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
