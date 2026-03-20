'use client'

import { useState } from 'react'
import { Pencil, Trash2, Eye, EyeOff, Music, ImageIcon } from 'lucide-react'
import type { ContentItem, ContentType } from '@/lib/admin/content-queries'

interface ContentTableProps {
  items: ContentItem[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onEdit: (item: ContentItem) => void
  onDelete: (id: string) => void
  onToggleStatus: (item: ContentItem) => void
}

const TYPE_LABELS: Record<ContentType, string> = {
  meditacao: 'Meditação',
  oracao: 'Oração',
  devocional: 'Devocional',
  estudo: 'Estudo',
  kids: 'Kids',
}

const TYPE_COLORS: Record<ContentType, string> = {
  meditacao: 'bg-blue-100 text-blue-700',
  oracao: 'bg-purple-100 text-purple-700',
  devocional: 'bg-green-100 text-green-700',
  estudo: 'bg-amber-100 text-amber-700',
  kids: 'bg-pink-100 text-pink-700',
}

const STATUS_COLORS = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  archived: 'bg-red-100 text-red-600',
}

const STATUS_LABELS = {
  published: 'Publicado',
  draft: 'Rascunho',
  archived: 'Arquivado',
}

export function ContentTable({
  items,
  total,
  page,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
}: ContentTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const totalPages = Math.ceil(total / pageSize)

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este conteúdo?')) return
    setDeletingId(id)
    await onDelete(id)
    setDeletingId(null)
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-[#6B7280] text-sm">Nenhum conteúdo encontrado.</p>
        <p className="text-[#9CA3AF] text-xs mt-1">Clique em "Novo Conteúdo" para adicionar.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Título
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Tipo
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Mídia
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Plus
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-[#F9FAFB] transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-[#1F2937] truncate max-w-[280px]">{item.title}</p>
                    {item.category && (
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{item.category}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[item.type]}`}>
                    {TYPE_LABELS[item.type]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>
                    {STATUS_LABELS[item.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-[#9CA3AF]">
                    {item.audio_url && <span title="Tem áudio"><Music className="w-4 h-4 text-blue-500" /></span>}
                    {item.image_url && <span title="Tem imagem"><ImageIcon className="w-4 h-4 text-green-500" /></span>}
                    {!item.audio_url && !item.image_url && <span className="text-xs">—</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {item.plus ? (
                    <span className="text-xs font-medium text-[#FB923C]">Plus</span>
                  ) : (
                    <span className="text-xs text-[#9CA3AF]">Free</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onToggleStatus(item)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-[#6B7280] hover:text-[#1F2937]"
                      title={item.status === 'published' ? 'Despublicar' : 'Publicar'}
                    >
                      {item.status === 'published' ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-[#6B7280] hover:text-blue-600"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-[#6B7280] hover:text-red-600 disabled:opacity-50"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB]">
          <p className="text-xs text-[#6B7280]">
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} de {total}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-xs rounded-lg border border-[#E5E7EB] disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              ← Anterior
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs rounded-lg border border-[#E5E7EB] disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Próxima →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
