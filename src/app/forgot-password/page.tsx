'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      )

      if (resetError) throw resetError

      setSent(true)
    } catch (err) {
      setError((err as Error).message ?? 'Erro ao enviar e-mail. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-6">
      <div className="w-full max-w-sm space-y-8">

        {/* Logo + título */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-[22px] bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center shadow-xl shadow-orange-200/60">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 5.15-4.97 13.5 0 18 4.97-4.5 4.97-12.85 0-18z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c0 4.97 4.5 9.03 9 9-4.5 0-9 4.03-9 9" opacity="0.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937] tracking-tight">
              Recuperar senha
            </h1>
            <p className="text-[#6B7280] mt-1 text-base">
              Enviaremos um link para redefinir sua senha
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl shadow-gray-200/60 p-8 space-y-6">

          {!sent ? (
            <>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#1F2937]">
                  Informe seu e-mail
                </h2>
                <p className="text-sm text-[#6B7280]">
                  Você receberá um link para criar uma nova senha
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-medium text-[#1F2937]">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="
                      w-full h-11 px-4 rounded-xl border border-gray-200
                      bg-white/80 text-[#1F2937] text-sm placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-[#FB923C]/40 focus:border-[#FB923C]
                      transition-colors duration-150 disabled:opacity-50
                    "
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full h-11 flex items-center justify-center gap-2
                    bg-[#FB923C] hover:bg-[#F97316] disabled:bg-[#FB923C]/60
                    text-white font-medium text-sm rounded-xl
                    shadow-md shadow-orange-200/50 hover:shadow-lg hover:shadow-orange-200/60
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#FB923C]/40 focus:ring-offset-1
                  "
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando…
                    </>
                  ) : (
                    'Enviar link de recuperação'
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Estado de sucesso */
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                <Mail className="w-7 h-7 text-green-600" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-[#1F2937]">E-mail enviado!</h2>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Verifique sua caixa de entrada e clique no link para redefinir sua senha.
                  Não se esqueça de checar o spam.
                </p>
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Link enviado para <strong>{email}</strong></span>
              </div>
            </div>
          )}

          {/* Link voltar */}
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-[#6B7280] hover:text-[#FB923C] transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </Link>
        </div>

      </div>
    </div>
  )
}
