'use client'

import { motion } from 'framer-motion'

interface AndroidInstallFlowProps {
  onInstall: () => Promise<void>
  onDismiss: () => void
  isLoading?: boolean
}

const benefits = [
  { icon: '⚡', text: 'Abre direto da tela inicial, sem navegar' },
  { icon: '📴', text: 'Funciona mesmo sem internet' },
  { icon: '🎯', text: 'Tela cheia, sem barra do navegador' },
]

export function AndroidInstallFlow({ onInstall, onDismiss, isLoading = false }: AndroidInstallFlowProps) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 rounded-t-3xl bg-white shadow-2xl border-t border-gray-200 p-6 z-50"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-md flex-shrink-0">
          🙏
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Instale o Jornada com Deus</h2>
          <p className="text-xs text-gray-400">Grátis • Como um app nativo</p>
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-2.5 mb-5">
        {benefits.map(b => (
          <div key={b.text} className="flex items-center gap-3">
            <span className="text-lg leading-none">{b.icon}</span>
            <span className="text-sm text-gray-600">{b.text}</span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex gap-3">
        <button
          onClick={onInstall}
          disabled={isLoading}
          aria-label="Instalar aplicativo"
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          {isLoading ? 'Instalando...' : '⬇️  Instalar agora'}
        </button>
        <button
          onClick={onDismiss}
          disabled={isLoading}
          aria-label="Adiar instalação"
          className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-600 font-medium py-3 rounded-xl transition-colors text-sm"
        >
          Depois
        </button>
      </div>
    </motion.div>
  )
}
