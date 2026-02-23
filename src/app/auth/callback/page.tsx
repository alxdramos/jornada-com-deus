'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

/**
 * Página de callback OAuth — lida com dois fluxos:
 * 1. PKCE flow: Supabase retorna ?code= nos query params → troca por sessão server-aware
 * 2. Implicit flow: Supabase retorna #access_token= no hash → cliente detecta automaticamente
 */
export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'processando' | 'erro'>('processando')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')
        const errorParam = url.searchParams.get('error')

        if (errorParam) {
          setErrorMsg(`Erro de autenticação: ${errorParam}`)
          setStatus('erro')
          setTimeout(() => router.replace('/login'), 3000)
          return
        }

        if (code) {
          // PKCE flow — troca o code por sessão
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            console.error('[Auth Callback] Erro no PKCE:', error)
            setErrorMsg(error.message)
            setStatus('erro')
            setTimeout(() => router.replace('/login'), 3000)
            return
          }
        }

        // Implicit flow ou PKCE concluído — aguarda o cliente detectar a sessão no hash
        // O Supabase client com detectSessionInUrl: true já lida com o #access_token
        const { data } = await supabase.auth.getSession()

        if (data.session) {
          router.replace('/')
        } else {
          // Aguarda mais um tick para o cliente processar o hash
          setTimeout(async () => {
            const { data: retryData } = await supabase.auth.getSession()
            if (retryData.session) {
              router.replace('/')
            } else {
              setErrorMsg('Não foi possível estabelecer a sessão. Tente novamente.')
              setStatus('erro')
              setTimeout(() => router.replace('/login'), 3000)
            }
          }, 1500)
        }
      } catch (err) {
        console.error('[Auth Callback] Erro inesperado:', err)
        setErrorMsg('Erro inesperado. Redirecionando...')
        setStatus('erro')
        setTimeout(() => router.replace('/login'), 3000)
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF9F6] gap-4">
      {status === 'processando' ? (
        <>
          <div className="w-10 h-10 border-4 border-[#FB923C] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#1F2937] text-base font-medium">Autenticando com Google...</p>
        </>
      ) : (
        <>
          <p className="text-red-500 text-base font-medium text-center px-6">{errorMsg}</p>
          <p className="text-[#6B7280] text-sm">Redirecionando para o login...</p>
        </>
      )}
    </div>
  )
}
