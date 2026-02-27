'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, Crown, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SupportTicket, TicketMessage } from '@/lib/admin/types'

// Badge de status colorido
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; cls: string }> = {
    aberto:     { label: 'Aberto',     cls: 'bg-red-50 text-red-600 border border-red-200' },
    aguardando: { label: 'Aguardando', cls: 'bg-amber-50 text-amber-600 border border-amber-200' },
    resolvido:  { label: 'Resolvido',  cls: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
    fechado:    { label: 'Fechado',    cls: 'bg-gray-100 text-gray-500 border border-gray-200' },
  }
  const c = config[status] ?? config.aberto
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.cls}`}>
      {c.label}
    </span>
  )
}

// Badge de categoria
function CategoryBadge({ category }: { category: string }) {
  const labels: Record<string, string> = {
    pagamento: '💳 Pagamento',
    acesso:    '🔒 Acesso',
    tecnico:   '🔧 Técnico',
    feedback:  '💬 Feedback',
    outro:     '📝 Outro',
  }
  return (
    <span className="text-xs text-[#6B7280] bg-[#F9F8F5] px-2 py-0.5 rounded-full">
      {labels[category] ?? category}
    </span>
  )
}

interface TicketsTableProps {
  tickets: SupportTicket[]
  total: number
}

export function TicketsTable({ tickets, total }: TicketsTableProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, TicketMessage[]>>({})
  const [loadingMessages, setLoadingMessages] = useState<string | null>(null)
  const [reply, setReply] = useState<Record<string, string>>({})
  const [sending, setSending] = useState<string | null>(null)
  const [changingStatus, setChangingStatus] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('todos')

  const filteredTickets = statusFilter === 'todos'
    ? tickets
    : tickets.filter((t) => t.status === statusFilter)

  async function toggleExpand(ticketId: string) {
    if (expandedId === ticketId) {
      setExpandedId(null)
      return
    }
    setExpandedId(ticketId)
    if (!messages[ticketId]) {
      setLoadingMessages(ticketId)
      try {
        const res = await fetch(`/api/support/tickets/${ticketId}/messages`)
        const data = await res.json()
        setMessages((prev) => ({ ...prev, [ticketId]: data.messages ?? [] }))
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingMessages(null)
      }
    }
  }

  async function sendReply(ticketId: string) {
    const text = reply[ticketId]?.trim()
    if (!text) return

    setSending(ticketId)
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => ({
          ...prev,
          [ticketId]: [...(prev[ticketId] ?? []), data.message],
        }))
        setReply((prev) => ({ ...prev, [ticketId]: '' }))
        startTransition(() => router.refresh())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSending(null)
    }
  }

  async function changeStatus(ticketId: string, status: string) {
    setChangingStatus(ticketId)
    try {
      await fetch(`/api/support/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      startTransition(() => router.refresh())
    } catch (e) {
      console.error(e)
    } finally {
      setChangingStatus(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
      {/* Header + filtros */}
      <div className="px-5 py-4 border-b border-[#E5E7EB] flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-[#FB923C]" />
          <h3 className="text-sm font-semibold text-[#1F2937]">Tickets de Suporte</h3>
          <span className="text-xs text-[#9CA3AF] bg-[#F9F8F5] px-2 py-0.5 rounded-full">{total}</span>
        </div>
        <div className="flex gap-1.5 ml-auto">
          {['todos', 'aberto', 'aguardando', 'resolvido', 'fechado'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full font-medium transition-colors capitalize',
                statusFilter === s
                  ? 'bg-[#FB923C] text-white'
                  : 'bg-[#F9F8F5] text-[#6B7280] hover:bg-[#F3F4F6]'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {filteredTickets.length === 0 ? (
        <div className="py-16 text-center text-[#9CA3AF]">
          <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum ticket encontrado</p>
        </div>
      ) : (
        <div className="divide-y divide-[#F3F4F6]">
          {filteredTickets.map((ticket) => {
            const isExpanded = expandedId === ticket.id
            return (
              <div key={ticket.id}>
                {/* Row principal */}
                <div
                  className={cn(
                    'px-5 py-4 hover:bg-[#FAFAF9] cursor-pointer transition-colors',
                    isExpanded && 'bg-[#FAFAF9]'
                  )}
                  onClick={() => toggleExpand(ticket.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                      ticket.user_plan === 'plus'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-[#F3F4F6] text-[#6B7280]'
                    )}>
                      {ticket.user_plan === 'plus' ? (
                        <Crown size={15} className="text-amber-600" />
                      ) : (
                        (ticket.user_name ?? ticket.user_email ?? '?').charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[#1F2937] truncate">{ticket.subject}</p>
                          <p className="text-xs text-[#9CA3AF] mt-0.5">
                            {ticket.user_name ?? ticket.user_email} ·{' '}
                            {new Date(ticket.updated_at).toLocaleDateString('pt-BR', {
                              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <CategoryBadge category={ticket.category} />
                          <StatusBadge status={ticket.status} />
                          {ticket.message_count != null && ticket.message_count > 0 && (
                            <span className="text-xs bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-full">
                              {ticket.message_count} msg
                            </span>
                          )}
                          {isExpanded ? <ChevronUp size={15} className="text-[#9CA3AF]" /> : <ChevronDown size={15} className="text-[#9CA3AF]" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detalhe expandido */}
                {isExpanded && (
                  <div className="px-5 pb-5 bg-[#FAFAF9] border-t border-[#F3F4F6]">
                    {/* Status actions */}
                    <div className="flex items-center gap-2 py-3 border-b border-[#F3F4F6] mb-4">
                      <span className="text-xs text-[#9CA3AF] font-medium">Alterar status:</span>
                      {['aberto', 'aguardando', 'resolvido', 'fechado'].map((s) => (
                        <button
                          key={s}
                          disabled={ticket.status === s || changingStatus === ticket.id}
                          onClick={(e) => { e.stopPropagation(); changeStatus(ticket.id, s) }}
                          className={cn(
                            'text-xs px-2.5 py-1 rounded-full font-medium transition-colors capitalize',
                            ticket.status === s
                              ? 'bg-[#1F2937] text-white'
                              : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#FB923C] hover:text-[#FB923C]',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {/* Mensagens */}
                    {loadingMessages === ticket.id ? (
                      <div className="flex justify-center py-6">
                        <Loader2 size={20} className="animate-spin text-[#FB923C]" />
                      </div>
                    ) : (
                      <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
                        {(messages[ticket.id] ?? []).map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              'flex',
                              msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'
                            )}
                          >
                            <div className={cn(
                              'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                              msg.sender_type === 'admin'
                                ? 'bg-[#FB923C] text-white rounded-br-sm'
                                : 'bg-white border border-[#E5E7EB] text-[#1F2937] rounded-bl-sm'
                            )}>
                              <p>{msg.message}</p>
                              <p className={cn(
                                'text-[10px] mt-1',
                                msg.sender_type === 'admin' ? 'text-amber-100' : 'text-[#9CA3AF]'
                              )}>
                                {msg.sender_type === 'admin' ? 'Você' : (ticket.user_name ?? 'Usuário')} ·{' '}
                                {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}
                        {(messages[ticket.id] ?? []).length === 0 && (
                          <p className="text-xs text-[#9CA3AF] text-center py-4">Nenhuma mensagem ainda</p>
                        )}
                      </div>
                    )}

                    {/* Campo de resposta */}
                    {ticket.status !== 'fechado' && (
                      <div className="flex gap-2 items-end" onClick={(e) => e.stopPropagation()}>
                        <textarea
                          value={reply[ticket.id] ?? ''}
                          onChange={(e) => setReply((prev) => ({ ...prev, [ticket.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              sendReply(ticket.id)
                            }
                          }}
                          placeholder="Digite sua resposta... (Enter para enviar)"
                          rows={2}
                          className="flex-1 resize-none text-sm bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#FB923C] text-[#1F2937] placeholder:text-[#9CA3AF]"
                        />
                        <button
                          onClick={() => sendReply(ticket.id)}
                          disabled={!reply[ticket.id]?.trim() || sending === ticket.id}
                          className="w-10 h-10 bg-[#FB923C] text-white rounded-xl flex items-center justify-center hover:bg-[#f97316] transition-colors disabled:opacity-50 shrink-0"
                        >
                          {sending === ticket.id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Send size={15} />
                          )}
                        </button>
                      </div>
                    )}
                    {ticket.status === 'fechado' && (
                      <p className="text-xs text-[#9CA3AF] text-center py-2">Ticket fechado</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
