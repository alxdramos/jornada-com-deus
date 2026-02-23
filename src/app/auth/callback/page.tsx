'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

/**
 * Página de callback OAuth — suporte implicit flow (#access_token no hash)
 * e PKCE flow (?code= nos query params).
 *
 * O Supabase client com detectSessionInUrl: true processa o hash automaticamente
 * e dispara onAuthStateChange → ouvimos esse evento para redirecionar.
 */
export default function AuthCallbackPage() {
  const router = useRouter()
  const redirected = useRef(false)

  useEffect(() => {
    // Escuta mudança de estado de auth — dispara quando o cliente
    // detecta o #access_token no hash (implicit flow) ou após exchangeCodeForSession (PKCE)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session && !redirected.current) {
        redirected.current = true
        router.replace('/')
      }
    })

    const handleCallback = async () => {
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')
      const errorParam = url.searchParams.get('error')

      if (errorParam) {
        router.replace(`/login?error=${errorParam}`)
        return
      }

      if (code) {
        // PKCE flow: troca o code por sessão (onAuthStateChange vai disparar com SIGNED_IN)
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          console.error('[Auth Callback] Erro PKCE:', error)
          router.replace('/login?error=auth_error')
          return
        }
      }

      // Implicit flow: o cliente detecta #access_token automaticamente.
      // Verificação imediata caso onAuthStateChange já tenha disparado.
      const { data } = await supabase.auth.getSession()
      if (data.session && !redirected.current) {
        redirected.current = true
        router.replace('/')
        return
      }

      // Fallback: se em 5s não autenticou, volta para o login
      const timeout = setTimeout(() => {
        if (!redirected.current) {
          redirected.current = true
          router.replace('/login?error=timeout')
        }
      }, 5000)

      return () => clearTimeout(timeout)
    }

    handleCallback()

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF9F6] gap-4">
      <div className="w-10 h-10 border-4 border-[#FB923C] border-t-transparent rounded-full animate-spin" />
      <p className="text-[#1F2937] text-base font-medium">Autenticando com Google...</p>
    </div>
  )
}
