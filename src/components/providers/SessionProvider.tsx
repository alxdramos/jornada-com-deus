'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  return <AuthProvider>{children}</AuthProvider>
}