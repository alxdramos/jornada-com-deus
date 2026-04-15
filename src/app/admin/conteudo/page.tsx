'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, RefreshCw } from 'lucide-react'
import { ContentTable } from '@/components/admin/ContentTable'
import { ContentFormModal } from '@/components/admin/ContentFormModal'
import type { ContentItem, ContentType } from '@/lib/admin/content-queries'

type TabType = 'todos' | ContentType

const TABS: { value: TabType; label: string; emoji: string }[] = [
  { value: 'todos', label: 'Todos', emoji: '📋' },
  { value: 'meditacao', label: 'Meditações', emoji: '🧘' },
  { value: 'oracao', label: 'Orações', emoji: '🙏' },
  { value: 'devocional', label: 'Devocionais', emoji: '📖' },
  { value: 'estudo', label: 'Estudos', emoji: '✝️' },
  { value: 'kids', label: 'Kids', emoji: '👶' },
]

interface FetchResult {
  items: ContentItem[]
  total: number
}

export default function ConteudoPage() {
  const [activeTab, setActiveTab] = useState<TabType>('todos')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<FetchResult>({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<ContentItem | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: '20',
      })
      if (activeTab !== 'todos') params.set('type', activeTab)
      if (search.trim()) params.set('search', search.trim())

      const res = await fetch(`/api/admin/content?${params}`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } finally {
      setLoading(false)
    }
  }, [activeTab, search, page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Reset page ao mudar filtro
  useEffect(() => {
    setPage(1)
  }, [activeTab, search])

  const handleSave = async (formData: Partial<ContentItem>) => {
    const method = editItem ? 'PUT' : 'POST'
    const url = editItem
      ? `/api/admin/content/${editItem.id}`
      : '/api/admin/content'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setModalOpen(false)
      setEditItem(null)
      fetchData()
    }
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/content/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    fetchData()
  }

  const handleToggleStatus = async (item: ContentItem) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published'
    await fetch(`/api/admin/content/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: newStatus }),
    })
    fetchData()
  }

  const handleEdit = (item: ContentItem) => {
    setEditItem(item)
    setModalOpen(true)
  }

  const handleNew = () => {
    setEditItem(null)
    setModalOpen(true)
  }

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Biblioteca de Conteúdo</h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">
            Gerencie meditações, orações, devocionais, estudos e conteúdo kids
          </p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FB923C] text-white text-sm font-medium hover:bg-[#EA580C] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Novo Conteúdo
        </button>
      </div>

      {/* Tabs por tipo */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.value
                ? 'bg-[#FB923C]/10 text-[#FB923C]'
                : 'text-[#6B7280] hover:bg-gray-100'
            }`}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Barra de busca + total */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#FB923C]"
          />
        </div>
        <button
          onClick={fetchData}
          className="p-2 rounded-xl border border-[#E5E7EB] hover:bg-gray-50 transition-colors"
          title="Atualizar"
        >
          <RefreshCw className={`w-4 h-4 text-[#6B7280] ${loading ? 'animate-spin' : ''}`} />
        </button>
        <p className="text-sm text-[#9CA3AF]">
          {loading ? '...' : `${data.total} item${data.total !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Tabela */}
      {loading && data.items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#9CA3AF] mx-auto mb-3" />
          <p className="text-sm text-[#9CA3AF]">Carregando...</p>
        </div>
      ) : (
        <ContentTable
          items={data.items}
          total={data.total}
          page={page}
          pageSize={20}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Modal */}
      <ContentFormModal
        isOpen={modalOpen}
        editItem={editItem}
        onClose={() => {
          setModalOpen(false)
          setEditItem(null)
        }}
        onSave={handleSave}
      />
    </div>
  )
}
