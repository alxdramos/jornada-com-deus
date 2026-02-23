'use client'

import { motion } from 'framer-motion'

interface AndroidInstallFlowProps {
  onInstall: () => Promise<void>
  onDismiss: () => void
  isLoading?: boolean
}

export function AndroidInstallFlow({ onInstall, onDismiss, isLoading = false }: AndroidInstallFlowProps) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 rounded-t-3xl bg-white shadow-lg border-t border-gray-200 p-6 z-50"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">✨</span>
        <h2 className="text-xl font-bold text-gray-900">Instale o Jornada com Deus</h2>
      </div>

      {/* Subtitle */}
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Acesse como aplicativo, mais rápido e sem barra do navegador.
      </p>

      {/* CTAs */}
      <div className="flex gap-3">
        <button
          onClick={onInstall}
          disabled={isLoading}
          aria-label="Instalar aplicativo"
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-500 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          {isLoading ? 'Instalando...' : 'Instalar agora'}
        </button>
        <button
          onClick={onDismiss}
          disabled={isLoading}
          aria-label="Adiar instalação"
          className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-900 font-semibold py-3 rounded-lg transition duration-200"
        >
          Depois
        </button>
      </div>
    </motion.div>
  )
}
