'use client'

import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AtRiskUser } from '@/lib/admin/retention-queries'

interface AtRiskUsersTableProps {
  users: AtRiskUser[]
}

export function AtRiskUsersTable({ users }: AtRiskUsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#1F2937]">Usuários em Risco</h3>
          <p className="text-xs text-[#9CA3AF]">
            Assinaturas Plus expirando nos próximos 30 dias
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <span className="text-2xl">✅</span>
          <p className="text-sm text-[#9CA3AF]">Nenhum usuário em risco no momento</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-[#FB923C]/10">
          <AlertTriangle size={14} className="text-[#FB923C]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#1F2937]">
            Usuários em Risco ({users.length})
          </h3>
          <p className="text-xs text-[#9CA3AF]">
            Assinaturas Plus expirando nos próximos 30 dias — considere campanha de renovação
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F3F4F6]">
              <th className="text-left py-2.5 pr-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
                Usuário
              </th>
              <th className="text-right py-2.5 px-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
                Expira em
              </th>
              <th className="text-right py-2.5 pl-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
                Dias restantes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F9F8F5]">
            {users.map((user) => {
              const urgency =
                user.daysLeft <= 7 ? 'high' : user.daysLeft <= 14 ? 'medium' : 'low'
              return (
                <tr key={user.user_id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3.5 pr-4">
                    <p className="font-medium text-[#1F2937]">{user.name ?? '—'}</p>
                    <p className="text-xs text-[#9CA3AF]">{user.email ?? '—'}</p>
                  </td>
                  <td className="py-3.5 px-3 text-right text-xs text-[#6B7280]">
                    {new Date(user.expires_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3.5 pl-3 text-right">
                    <span
                      className={cn(
                        'text-sm font-bold tabular-nums',
                        urgency === 'high' && 'text-red-500',
                        urgency === 'medium' && 'text-[#FB923C]',
                        urgency === 'low' && 'text-[#6B7280]'
                      )}
                    >
                      {user.daysLeft}d
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
