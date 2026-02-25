'use client'

import { useState } from 'react'
import { Bell, Send, Loader2, CheckCircle2, AlertCircle, FlaskConical } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface SendResult {
  sent: number
  total: number
  expired_removed: number
  message?: string
}

async function getSelfSubscription(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch {
    return null;
  }
}

export function PushNotificationCard() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [testStatus, setTestStatus] = useState<Status>('idle')
  const [result, setResult] = useState<SendResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [testErrorMsg, setTestErrorMsg] = useState('')

  async function handleSend() {
    if (!title.trim() || !body.trim()) return

    setStatus('loading')
    setResult(null)
    setErrorMsg('')

    try {
      const res = await fetch('/api/admin/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: body.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Erro ao enviar')
      }

      setResult(data)
      setStatus('success')
      setTitle('')
      setBody('')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro desconhecido')
      setStatus('error')
    }
  }

  async function handleTestSelf() {
    setTestStatus('loading')
    setTestErrorMsg('')

    try {
      const subscription = await getSelfSubscription()

      if (!subscription) {
        throw new Error('Você não está inscrito nas notificações. Ative o sino 🔔 primeiro.')
      }

      const subJson = subscription.toJSON()
      const res = await fetch('/api/admin/push/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: {
            endpoint: subJson.endpoint,
            keys: { p256dh: subJson.keys?.p256dh, auth: subJson.keys?.auth },
          },
          title: title.trim() || undefined,
          body: body.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Erro ao enviar teste')
      }

      setTestStatus('success')
      setTimeout(() => setTestStatus('idle'), 3000)
    } catch (err) {
      setTestErrorMsg(err instanceof Error ? err.message : 'Erro desconhecido')
      setTestStatus('error')
      setTimeout(() => setTestStatus('idle'), 5000)
    }
  }

  const canSend = title.trim().length > 0 && body.trim().length > 0 && status !== 'loading'
  const canTest = testStatus !== 'loading' && status !== 'loading'

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-xl bg-[#FB923C]/10">
          <Bell size={17} className="text-[#FB923C]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#1F2937]">Notificação Push</h3>
          <p className="text-xs text-[#9CA3AF]">Enviar para todos os usuários</p>
        </div>
      </div>

      {/* Formulário */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-[#6B7280] mb-1">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            placeholder="Ex: Bom dia! ✨"
            className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-sm text-[#1F2937] placeholder-[#C4C9D4] focus:outline-none focus:ring-2 focus:ring-[#FB923C]/30 focus:border-[#FB923C] transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#6B7280] mb-1">Mensagem</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={200}
            rows={3}
            placeholder="Ex: Sua jornada espiritual de hoje está te esperando."
            className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-sm text-[#1F2937] placeholder-[#C4C9D4] focus:outline-none focus:ring-2 focus:ring-[#FB923C]/30 focus:border-[#FB923C] transition-all resize-none"
          />
          <p className="text-xs text-[#C4C9D4] text-right mt-0.5">{body.length}/200</p>
        </div>

        {/* Preview */}
        {(title || body) && (
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F9F8F5] p-3">
            <p className="text-xs font-medium text-[#9CA3AF] mb-1.5">Preview</p>
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center shrink-0">
                <span className="text-white text-xs">🌱</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1F2937] leading-tight">
                  {title || '—'}
                </p>
                <p className="text-xs text-[#6B7280] leading-tight mt-0.5">
                  {body || '—'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-2">
          {/* Testar para mim */}
          <button
            onClick={handleTestSelf}
            disabled={!canTest}
            title="Envia a notificação apenas para você (requer notificações ativas)"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[#6B7280] text-xs font-semibold transition-all duration-200 hover:bg-[#F9F8F5] hover:border-[#D1D5DB] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {testStatus === 'loading' ? (
              <Loader2 size={13} className="animate-spin" />
            ) : testStatus === 'success' ? (
              <CheckCircle2 size={13} className="text-[#10B981]" />
            ) : (
              <FlaskConical size={13} />
            )}
            {testStatus === 'loading' ? 'Testando...' : testStatus === 'success' ? 'Enviado!' : 'Testar'}
          </button>

          {/* Enviar para todos */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FB923C] text-white text-sm font-semibold transition-all duration-200 hover:bg-[#F97316] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
            {status === 'loading' ? 'Enviando...' : 'Enviar para todos'}
          </button>
        </div>

        {/* Hint do botão de teste */}
        <p className="text-xs text-[#C4C9D4]">
          Testar envia só para você. Precisa ter o sino 🔔 ativado neste dispositivo.
        </p>
      </div>

      {/* Feedback — envio geral */}
      <AnimatePresence>
        {status === 'success' && result && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20"
          >
            <CheckCircle2 size={15} className="text-[#10B981] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#10B981]">
                {result.sent} de {result.total} enviadas
              </p>
              {result.expired_removed > 0 && (
                <p className="text-xs text-[#6B7280] mt-0.5">
                  {result.expired_removed} subscription(s) expirada(s) removida(s)
                </p>
              )}
              {result.message && (
                <p className="text-xs text-[#6B7280] mt-0.5">{result.message}</p>
              )}
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100"
          >
            <AlertCircle size={15} className="text-red-400 shrink-0" />
            <p className="text-xs text-red-500">{errorMsg}</p>
          </motion.div>
        )}

        {/* Feedback — teste */}
        {testStatus === 'error' && testErrorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100"
          >
            <AlertCircle size={15} className="text-amber-500 shrink-0" />
            <p className="text-xs text-amber-600">{testErrorMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
