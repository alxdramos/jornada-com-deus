'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)

        // Timeout de segurança: se demorar mais de 6s, considera sem sessão
        const timeoutPromise = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 6000)
        )

        const sessionPromise = supabase.auth.getSession().then(({ data, error }) => {
          if (error) throw error
          return data.session
        })

        const initialSession = await Promise.race([sessionPromise, timeoutPromise])

        setSession(initialSession)
        setUser(initialSession?.user ?? null)
      } catch (err) {
        console.error('[Auth] Initialization error:', err)
        const message = err instanceof Error ? err.message : 'Erro ao inicializar autenticação'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Escuta mudanças de auth (login, logout, refresh de token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('[Auth] Evento:', event, '| Usuário:', newSession?.user?.email ?? 'nenhum')
        setSession(newSession)
        setUser(newSession?.user ?? null)
        // Garante que loading é false após qualquer mudança de auth
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed'
      console.error('[Auth] Sign in error:', err)
      setError(message)
      throw err
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setError(null)
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed'
      console.error('[Auth] Sign up error:', err)
      setError(message)
      throw err
    }
  }

  const signInWithGoogle = async () => {
    try {
      setError(null)
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Rota de callback que troca o code por sessão no servidor
          redirectTo: `${origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao entrar com Google'
      console.error('[Auth] Google sign in error:', err)
      setError(message)
      throw err
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setSession(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed'
      console.error('[Auth] Sign out error:', err)
      setError(message)
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        error,
        signIn,
        signUp,
        signInWithGoogle,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
