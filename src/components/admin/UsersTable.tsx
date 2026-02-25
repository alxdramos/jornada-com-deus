'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, ChevronLeft, ChevronRight, Flame, Star } from 'lucide-react'
import type { AdminUser } from '@/lib/admin/types'

interface UsersTableProps {
  users: AdminUser[]
  total: number
  page: number
  pageSize: number
}

const roleBadge: Record<string, { label: string; cls: string }> = {
  admin: { label: 'Admin', cls: 'bg-red-50 text-red-600' },
  moderator: { label: 'Mod', cls: 'bg-blue-50 text-blue-600' },
  user: { label: 'Free', cls: 'bg-[#F3F4F6] text-[#6B7280]' },
}

export function UsersTable({ users, total, page, pageSize }: UsersTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  const totalPages = Math.ceil(total / pageSize)

  function navigate(params: Record<string, string>) {
    const current = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value) current.set(key, value)
      else current.delete(key)
    })
    startTransition(() => router.push(`/admin/usuarios?${current.toString()}`))
  }

  function handleSearch(value: string) {
    setSearch(value)
    navigate({ search: value, page: '1' })
  }

  function fmtDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4C9D4]" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por nome ou email..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-[#F9F8F5] border border-[#E5E7EB] rounded-xl outline-none focus:ring-2 focus:ring-[#FB923C]/20 focus:border-[#FB923C] transition-all placeholder:text-[#C4C9D4]"
          />
        </div>
        <p className="text-sm text-[#9CA3AF] shrink-0 font-medium">
          {total.toLocaleString('pt-BR')} usuários
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F3F4F6] bg-[#FAFAFA]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
                Usuário
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide hidden md:table-cell">
                Email
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
                Streak
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide hidden sm:table-cell">
                Nível
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide hidden lg:table-cell">
                XP
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide hidden sm:table-cell">
                Plano
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide hidden md:table-cell">
                Cadastro
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-14 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    <p className="text-sm text-[#9CA3AF]">Nenhum usuário encontrado</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const badge = roleBadge[user.role] ?? roleBadge.user
                return (
                  <tr
                    key={user.id}
                    className="border-b border-[#F9F8F5] hover:bg-[#FAFAF9] transition-colors"
                  >
                    {/* Avatar + Nome */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#FB923C]/10 flex items-center justify-center text-xs font-bold text-[#FB923C] shrink-0">
                          {(user.name ?? user.email).charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#1F2937] truncate max-w-[100px] lg:max-w-[140px]">
                          {user.name ?? 'Sem nome'}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 text-[#6B7280] hidden md:table-cell">
                      <span className="truncate max-w-[160px] block">{user.email}</span>
                    </td>

                    {/* Streak */}
                    <td className="py-3 px-4 text-center">
                      {user.current_streak ? (
                        <span className="inline-flex items-center gap-1 text-[#FB923C] font-bold text-xs">
                          <Flame size={11} />
                          {user.current_streak}
                        </span>
                      ) : (
                        <span className="text-[#E5E7EB] text-xs">—</span>
                      )}
                    </td>

                    {/* Nível */}
                    <td className="py-3 px-4 text-center hidden sm:table-cell">
                      {user.level ? (
                        <span className="inline-flex items-center gap-1 text-[#10B981] font-bold text-xs">
                          <Star size={10} />
                          {user.level}
                        </span>
                      ) : (
                        <span className="text-[#E5E7EB] text-xs">—</span>
                      )}
                    </td>

                    {/* XP */}
                    <td className="py-3 px-4 text-center text-[#6B7280] tabular-nums text-xs hidden lg:table-cell">
                      {user.total_xp ? user.total_xp.toLocaleString('pt-BR') : '—'}
                    </td>

                    {/* Plano / Role */}
                    <td className="py-3 px-4 text-center hidden sm:table-cell">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </td>

                    {/* Cadastro */}
                    <td className="py-3 px-4 text-[#9CA3AF] text-xs hidden md:table-cell">
                      {fmtDate(user.created_at)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between bg-[#FAFAFA]">
          <p className="text-xs text-[#9CA3AF]">
            Página <span className="font-semibold text-[#6B7280]">{page}</span> de{' '}
            <span className="font-semibold text-[#6B7280]">{totalPages}</span>
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => navigate({ page: String(page - 1) })}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => navigate({ page: String(page + 1) })}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
