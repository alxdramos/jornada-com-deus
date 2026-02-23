'use client'

import { useAuth } from '@/contexts/AuthContext'
import { HomeContent } from './page-content'

export default function Home() {
  const { user, loading } = useAuth()

  // Enquanto verifica a sessão, mostra spinner breve
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FB923C] mx-auto" />
          <p className="text-gray-500 text-sm">Um momento...</p>
        </div>
      </div>
    )
  }

  // Sem usuário: o middleware já redireciona para /login
  // Renderizar null evita flash de conteúdo durante a navegação
  if (!user) {
    return null
  }

  return <HomeContent />
}
