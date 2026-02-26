'use client'

import { Crown, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SubscriberRow, WebhookLog } from '@/lib/admin/types'

// Status badge para subscription
function StatusBadge({ status }: { status: string }) {
  const config = {
    active: { label: 'Ativo', icon: CheckCircle, cls: 'text-emerald-600 bg-emerald-50' },
    canceled: { label: 'Cancelado', icon: XCircle, cls: 'text-red-500 bg-red-50' },
    refunded: { label: 'Reembolsado', icon: AlertCircle, cls: 'text-amber-600 bg-amber-50' },
    chargeback: { label: 'Chargeback', icon: AlertCircle, cls: 'text-red-700 bg-red-100' },
    inactive: { label: 'Inativo', icon: Clock, cls: 'text-gray-500 bg-gray-100' },
    expired: { label: 'Expirado', icon: Clock, cls: 'text-gray-500 bg-gray-100' },
  } as const
  const c = config[status as keyof typeof config] ?? config.inactive
  const Icon = c.icon
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full', c.cls)}>
      <Icon size={11} />
      {c.label}
    </span>
  )
}

// Tabela de assinantes
export function SubscribersTable({ subscribers }: { subscribers: SubscriberRow[] }) {
  if (subscribers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-10 text-center">
        <Crown size={28} className="text-[#FB923C] mx-auto mb-3" />
        <p className="text-sm text-[#6B7280]">Nenhum assinante Plus ainda.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center gap-2">
        <Crown size={16} className="text-[#FB923C]" />
        <h3 className="text-sm font-semibold text-[#1F2937]">Assinantes Plus</h3>
        <span className="ml-auto text-xs text-[#9CA3AF]">{subscribers.length} registros</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F9FAFB]">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Usuário</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Valor</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Início</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Expira</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {subscribers.map((s) => (
              <tr key={s.user_id} className="hover:bg-[#FAFAFA] transition-colors">
                <td className="px-5 py-3">
                  <p className="font-medium text-[#1F2937] truncate max-w-[180px]">{s.name}</p>
                  <p className="text-xs text-[#9CA3AF] truncate max-w-[180px]">{s.email}</p>
                </td>
                <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-5 py-3 font-mono text-[#1F2937]">
                  {s.price_paid != null ? `R$ ${s.price_paid.toFixed(2)}` : '—'}
                </td>
                <td className="px-5 py-3 text-[#6B7280] text-xs">
                  {s.starts_at ? new Date(s.starts_at).toLocaleDateString('pt-BR') : '—'}
                </td>
                <td className="px-5 py-3 text-[#6B7280] text-xs">
                  {s.expires_at ? new Date(s.expires_at).toLocaleDateString('pt-BR') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Tabela de logs de webhook
export function WebhookLogsTable({ logs }: { logs: WebhookLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 text-center">
        <p className="text-sm text-[#6B7280]">Nenhum webhook recebido ainda.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F3F4F6]">
        <h3 className="text-sm font-semibold text-[#1F2937]">Eventos Hotmart Recentes</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F9FAFB]">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Evento</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Email</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Transação</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-[#FAFAFA] transition-colors">
                <td className="px-5 py-3">
                  <span className="font-mono text-xs bg-[#F3F4F6] px-2 py-1 rounded">{log.event}</span>
                </td>
                <td className="px-5 py-3 text-[#6B7280] text-xs truncate max-w-[160px]">{log.buyer_email ?? '—'}</td>
                <td className="px-5 py-3 font-mono text-xs text-[#6B7280] truncate max-w-[120px]">
                  {log.hotmart_transaction ?? '—'}
                </td>
                <td className="px-5 py-3">
                  {log.processed ? (
                    <span className="text-xs text-emerald-600 font-semibold">✓ Processado</span>
                  ) : log.error ? (
                    <span className="text-xs text-red-500 font-semibold" title={log.error}>✗ Erro</span>
                  ) : (
                    <span className="text-xs text-amber-600 font-semibold">Pendente</span>
                  )}
                </td>
                <td className="px-5 py-3 text-[#6B7280] text-xs">
                  {new Date(log.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Manter SubscriptionsPlaceholder para backwards compat
export function SubscriptionsPlaceholder() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-10 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-[#FB923C]/10 to-[#F97316]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Crown size={28} className="text-[#FB923C]" />
      </div>
      <h3 className="text-base font-semibold text-[#1F2937] mb-2">Carregando assinaturas...</h3>
    </div>
  )
}
