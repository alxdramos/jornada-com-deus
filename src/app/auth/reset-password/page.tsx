'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type PageState = 'loading' | 'ready' | 'success' | 'error'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>('loading')
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const handleReset = async () => {
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')
      const errorParam = url.searchParams.get('error')
      const errorDescription = url.searchParams.get('error_description')

      if (errorParam) {
        setSessionError(errorDescription ?? 'Link inválido ou expirado.')
        setPageState('error')
        return
      }

      if (code) {
        // PKCE flow: troca o code por uma sessão de reset
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          setSessionError('O link expirou ou já foi usado. Solicite um novo.')
          setPageState('error')
          return
        }
        setPageState('ready')
        return
      }

      // Implicit flow: verifica se já há sessão (SIGNED_IN via hash #access_token)
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setPageState('ready')
        return
      }

      // Escuta evento SIGNED_IN (implicit flow com #access_token no hash)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setPageState('ready')
          subscription.unsubscribe()
        }
        if (event === 'PASSWORD_RECOVERY') {
          setPageState('ready')
          subscription.unsubscribe()
        }
      })

      // Fallback timeout — link inválido
      const timeout = setTimeout(() => {
        setSessionError('Link inválido ou expirado. Solicite um novo link de recuperação.')
        setPageState('error')
        subscription.unsubscribe()
      }, 5000)

      return () => {
        clearTimeout(timeout)
        subscription.unsubscribe()
      }
    }

    handleReset()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (password.length < 6) {
      setFormError('A senha deve ter mínimo 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setFormError('As senhas não correspondem.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      setPageState('success')
      // Redireciona para home após 2s (já está autenticado)
      setTimeout(() => router.replace('/'), 2000)
    } catch (err) {
      setFormError((err as Error).message ?? 'Erro ao atualizar senha. Tente novamente.')
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
              Nova senha
            </h1>
            <p className="text-[#6B7280] mt-1 text-base">
              Jornada com Deus
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl shadow-gray-200/60 p-8 space-y-6">

          {/* Loading */}
          {pageState === 'loading' && (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#FB923C]" />
              <p className="text-sm text-[#6B7280]">Verificando link…</p>
            </div>
          )}

          {/* Erro de sessão (link inválido/expirado) */}
          {pageState === 'error' && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{sessionError}</span>
              </div>
              <button
                onClick={() => router.push('/forgot-password')}
                className="
                  w-full h-11 flex items-center justify-center
                  bg-[#FB923C] hover:bg-[#F97316]
                  text-white font-medium text-sm rounded-xl
                  shadow-md shadow-orange-200/50 transition-all duration-200
                "
              >
                Solicitar novo link
              </button>
            </div>
          )}

          {/* Formulário de nova senha */}
          {pageState === 'ready' && (
            <>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#1F2937]">
                  Crie uma nova senha
                </h2>
                <p className="text-sm text-[#6B7280]">
                  Escolha uma senha forte com pelo menos 6 caracteres
                </p>
              </div>

              {formError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-[#1F2937]">
                    Nova senha
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="
                        w-full h-11 px-4 pr-11 rounded-xl border border-gray-200
                        bg-white/80 text-[#1F2937] text-sm placeholder:text-gray-400
                        focus:outline-none focus:ring-2 focus:ring-[#FB923C]/40 focus:border-[#FB923C]
                        transition-colors duration-150 disabled:opacity-50
                      "
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FB923C] transition-colors disabled:opacity-50"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="confirm" className="block text-sm font-medium text-[#1F2937]">
                    Confirmar nova senha
                  </label>
                  <div className="relative">
                    <input
                      id="confirm"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      placeholder="Repita a senha"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      disabled={loading}
                      className="
                        w-full h-11 px-4 pr-11 rounded-xl border border-gray-200
                        bg-white/80 text-[#1F2937] text-sm placeholder:text-gray-400
                        focus:outline-none focus:ring-2 focus:ring-[#FB923C]/40 focus:border-[#FB923C]
                        transition-colors duration-150 disabled:opacity-50
                      "
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FB923C] transition-colors disabled:opacity-50"
                      aria-label={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
                      Salvando…
                    </>
                  ) : (
                    'Salvar nova senha'
                  )}
                </button>
              </form>
            </>
          )}

          {/* Sucesso */}
          {pageState === 'success' && (
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-[#1F2937]">Senha atualizada!</h2>
                <p className="text-sm text-[#6B7280]">
                  Sua nova senha foi salva. Redirecionando para o app…
                </p>
              </div>
              <Loader2 className="w-5 h-5 animate-spin text-[#FB923C] mx-auto" />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
