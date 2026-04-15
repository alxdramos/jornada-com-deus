'use client'

import { useState, useRef, useCallback } from 'react'
import { X, Upload, Music, ImageIcon, Loader2, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ContentItem, ContentType, ContentStatus } from '@/lib/admin/content-queries'

interface ContentFormModalProps {
  isOpen: boolean
  editItem?: ContentItem | null
  onClose: () => void
  onSave: (data: Partial<ContentItem>) => Promise<void>
}

type FormData = {
  type: ContentType
  status: ContentStatus
  title: string
  short_title: string
  description: string
  content: string
  reference: string
  category: string
  plus: boolean
  audio_url: string
  audio_duration: string
  image_url: string
  tags: string
  sort_order: string
}

const TYPE_OPTIONS: { value: ContentType; label: string; emoji: string }[] = [
  { value: 'meditacao', label: 'Meditação', emoji: '🧘' },
  { value: 'oracao', label: 'Oração', emoji: '🙏' },
  { value: 'devocional', label: 'Devocional', emoji: '📖' },
  { value: 'estudo', label: 'Estudo Bíblico', emoji: '✝️' },
  { value: 'kids', label: 'Kids', emoji: '👶' },
]

const CATEGORIES_BY_TYPE: Record<ContentType, string[]> = {
  meditacao: ['Tudo', 'Mente', 'Corpo', 'Espírito', 'Música', 'Estudos'],
  oracao: ['Manhã', 'Noite', 'Família', 'Trabalho', 'Saúde', 'Gratidão', 'Intercessão'],
  devocional: ['Fé', 'Esperança', 'Paz', 'Oração', 'Gratidão', 'Perdão'],
  estudo: ['Salmos', 'Evangelhos', 'Epístolas', 'Sabedoria', 'Proféticos'],
  kids: ['Histórias', 'Orações Kids', 'Músicas', 'Versículos'],
}

type UploadState = { status: 'idle' | 'uploading' | 'done' | 'error'; progress?: number; error?: string }

export function ContentFormModal({ isOpen, editItem, onClose, onSave }: ContentFormModalProps) {
  const defaultForm: FormData = {
    type: editItem?.type ?? 'meditacao',
    status: editItem?.status ?? 'draft',
    title: editItem?.title ?? '',
    short_title: editItem?.short_title ?? '',
    description: editItem?.description ?? '',
    content: editItem?.content ?? '',
    reference: editItem?.reference ?? '',
    category: editItem?.category ?? '',
    plus: editItem?.plus ?? false,
    audio_url: editItem?.audio_url ?? '',
    audio_duration: editItem?.audio_duration?.toString() ?? '',
    image_url: editItem?.image_url ?? '',
    tags: editItem?.tags?.join(', ') ?? '',
    sort_order: editItem?.sort_order?.toString() ?? '0',
  }

  const [form, setForm] = useState<FormData>(defaultForm)
  const [saving, setSaving] = useState(false)
  const [audioUpload, setAudioUpload] = useState<UploadState>({ status: 'idle' })
  const [imageUpload, setImageUpload] = useState<UploadState>({ status: 'idle' })
  const audioInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const uploadFile = useCallback(
    async (file: File, fileType: 'audio' | 'image') => {
      const setter = fileType === 'audio' ? setAudioUpload : setImageUpload
      setter({ status: 'uploading' })

      try {
        // 1. Obter presigned URL
        const res = await fetch('/api/admin/content/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            fileName: file.name,
            contentMimeType: file.type,
            fileType,
            contentType: form.type,
            fileSize: file.size,
          }),
        })

        if (!res.ok) {
          const err = await res.json()
          setter({ status: 'error', error: err.error ?? 'Erro ao gerar URL' })
          return
        }

        const { presignedUrl, publicUrl } = await res.json()

        // 2. Upload direto ao R2
        const uploadRes = await fetch(presignedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        })

        if (!uploadRes.ok) {
          setter({ status: 'error', error: 'Falha no upload para R2' })
          return
        }

        // 3. Salvar URL no form
        if (fileType === 'audio') {
          set('audio_url', publicUrl)
        } else {
          set('image_url', publicUrl)
        }
        setter({ status: 'done' })
      } catch (e) {
        setter({ status: 'error', error: 'Erro inesperado no upload' })
      }
    },
    [form.type]
  )

  const handleSubmit = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      await onSave({
        type: form.type,
        status: form.status,
        title: form.title.trim(),
        short_title: form.short_title.trim() || null,
        description: form.description.trim() || null,
        content: form.content.trim() || null,
        reference: form.reference.trim() || null,
        category: form.category || null,
        plus: form.plus,
        audio_url: form.audio_url || null,
        audio_duration: form.audio_duration ? parseInt(form.audio_duration) : null,
        image_url: form.image_url || null,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        sort_order: parseInt(form.sort_order) || 0,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const UploadButton = ({
    fileType,
    accept,
    uploadState,
    currentUrl,
    label,
    inputRef,
  }: {
    fileType: 'audio' | 'image'
    accept: string
    uploadState: UploadState
    currentUrl: string
    label: string
    inputRef: React.RefObject<HTMLInputElement | null>
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) uploadFile(file, fileType)
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadState.status === 'uploading'}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#374151] hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {uploadState.status === 'uploading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : uploadState.status === 'done' ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : fileType === 'audio' ? (
            <Music className="w-4 h-4 text-blue-500" />
          ) : (
            <ImageIcon className="w-4 h-4 text-purple-500" />
          )}
          {uploadState.status === 'uploading' ? 'Enviando...' : label}
        </button>
        {uploadState.status === 'error' && (
          <span className="text-xs text-red-500">{uploadState.error}</span>
        )}
      </div>
      {currentUrl && (
        <input
          type="url"
          value={currentUrl}
          onChange={(e) => set(fileType === 'audio' ? 'audio_url' : 'image_url', e.target.value)}
          className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E5E7EB] text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#FB923C]"
          placeholder="ou cole a URL manualmente"
        />
      )}
      {!currentUrl && (
        <input
          type="url"
          value={currentUrl}
          onChange={(e) => set(fileType === 'audio' ? 'audio_url' : 'image_url', e.target.value)}
          className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E5E7EB] text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#FB923C]"
          placeholder="ou cole a URL do R2 manualmente"
        />
      )}
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-[#1F2937]">
                {editItem ? 'Editar Conteúdo' : 'Novo Conteúdo'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Tipo + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Tipo *</label>
                  <select
                    value={form.type}
                    onChange={(e) => set('type', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#FB923C]"
                  >
                    {TYPE_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.emoji} {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => set('status', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#FB923C]"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </div>
              </div>

              {/* Título */}
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Título *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="Título do conteúdo"
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#FB923C]"
                />
              </div>

              {/* Título curto + Referência */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Título curto</label>
                  <input
                    type="text"
                    value={form.short_title}
                    onChange={(e) => set('short_title', e.target.value)}
                    placeholder="Ex: Paz Interior"
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#FB923C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Referência bíblica</label>
                  <input
                    type="text"
                    value={form.reference}
                    onChange={(e) => set('reference', e.target.value)}
                    placeholder="Ex: Filipenses 4:7"
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#FB923C]"
                  />
                </div>
              </div>

              {/* Categoria + Plus */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Categoria</label>
                  <select
                    value={form.category}
                    onChange={(e) => set('category', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#FB923C]"
                  >
                    <option value="">Selecione...</option>
                    {CATEGORIES_BY_TYPE[form.type].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.plus}
                      onChange={(e) => set('plus', e.target.checked)}
                      className="w-4 h-4 rounded accent-[#FB923C]"
                    />
                    <span className="text-sm text-[#374151]">Conteúdo Plus</span>
                  </label>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Breve descrição exibida nos cards..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#FB923C] resize-none"
                />
              </div>

              {/* Conteúdo completo */}
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Texto completo</label>
                <textarea
                  value={form.content}
                  onChange={(e) => set('content', e.target.value)}
                  placeholder="Texto completo da oração, devocional ou estudo..."
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#FB923C] resize-none"
                />
              </div>

              {/* Upload de Áudio */}
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                  Áudio (MP3, WAV, AAC — máx 100 MB)
                </label>
                <UploadButton
                  fileType="audio"
                  accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/aac,audio/mp4"
                  uploadState={audioUpload}
                  currentUrl={form.audio_url}
                  label="Enviar áudio para R2"
                  inputRef={audioInputRef}
                />
                {form.audio_url && (
                  <div className="mt-2">
                    <label className="block text-xs font-medium text-[#6B7280] mb-1">Duração (segundos)</label>
                    <input
                      type="number"
                      value={form.audio_duration}
                      onChange={(e) => set('audio_duration', e.target.value)}
                      placeholder="Ex: 300 (5 min)"
                      className="w-40 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-1 focus:ring-[#FB923C]"
                    />
                  </div>
                )}
              </div>

              {/* Upload de Imagem */}
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                  Imagem de capa (JPG, PNG, WebP — máx 10 MB)
                </label>
                <UploadButton
                  fileType="image"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  uploadState={imageUpload}
                  currentUrl={form.image_url}
                  label="Enviar imagem para R2"
                  inputRef={imageInputRef}
                />
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="mt-2 h-20 w-36 object-cover rounded-lg border border-[#E5E7EB]"
                  />
                )}
              </div>

              {/* Tags + Ordem */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => set('tags', e.target.value)}
                    placeholder="Ex: paz, ansiedade, família"
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#FB923C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Ordem</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => set('sort_order', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#FB923C]"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] px-6 py-4 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-[#374151] text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.title.trim() || saving}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#FB923C] text-white text-sm font-medium hover:bg-[#EA580C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Salvando...' : editItem ? 'Salvar alterações' : 'Criar conteúdo'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
