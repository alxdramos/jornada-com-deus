'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface iOSInstallGuideProps {
  onClose: () => void
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 22 22"
      fill="none"
      stroke="white"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <polyline points="8,8 11,5 14,8" />
      <line x1="11" y1="5" x2="11" y2="14" />
      <path d="M4 14v5a1 1 0 001 1h12a1 1 0 001-1v-5" />
    </svg>
  )
}

const slides = [
  {
    step: 1,
    title: 'Toque no ícone de Compartilhar',
    description: 'Na barra inferior do Safari',
    visual: (
      <div className="mx-auto w-[220px] space-y-2">
        {/* Safari address bar mock */}
        <div className="bg-gray-100 rounded-xl px-3 py-1.5 text-center border border-gray-200">
          <span className="text-xs text-gray-400">jornada-com-deus.app</span>
        </div>
        {/* Safari bottom toolbar mock */}
        <div className="bg-[#F2F2F7] border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-2xl font-light leading-none">‹</span>
            <span className="text-gray-300 text-2xl font-light leading-none">›</span>
            {/* Share button — highlighted and pulsing */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center shadow-md"
            >
              <ShareIcon />
            </motion.div>
            {/* Bookmarks icon */}
            <svg viewBox="0 0 20 20" fill="none" stroke="#C7C7CC" strokeWidth={1.5} className="w-5 h-5">
              <path d="M5 3h10a1 1 0 011 1v13l-6-3-6 3V4a1 1 0 011-1z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Tabs icon */}
            <svg viewBox="0 0 20 20" fill="none" stroke="#C7C7CC" strokeWidth={1.5} className="w-5 h-5">
              <rect x="3" y="5" width="12" height="12" rx="2" />
              <path d="M7 5V3h10a1 1 0 011 1v12h-2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <p className="text-center text-xs text-blue-500 font-semibold">↑ Procure este ícone em azul</p>
      </div>
    ),
  },
  {
    step: 2,
    title: 'Toque em "Adicionar à Tela de Início"',
    description: 'Role o menu para baixo se não aparecer',
    visual: (
      <div className="mx-auto w-[220px] bg-[#F2F2F7] rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Menu items (faded) */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-200 opacity-30">
          <span className="text-base">📤</span>
          <span className="text-xs text-gray-700">AirDrop</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-200 opacity-30">
          <span className="text-base">✉️</span>
          <span className="text-xs text-gray-700">Mensagens</span>
        </div>
        {/* Highlighted option */}
        <motion.div
          className="flex items-center gap-3 px-3 py-2.5 border-b border-gray-200"
          animate={{ backgroundColor: ['#EFF6FF', '#DBEAFE', '#EFF6FF'] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-6 bg-gray-800 rounded-md flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold leading-none">+</span>
          </div>
          <span className="text-xs font-bold text-blue-700">Adicionar à Tela de Início</span>
        </motion.div>
        <div className="flex items-center gap-3 px-3 py-2 opacity-30">
          <span className="text-base">🔖</span>
          <span className="text-xs text-gray-700">Adicionar favorito</span>
        </div>
      </div>
    ),
  },
  {
    step: 3,
    title: 'Toque em "Adicionar" para confirmar',
    description: 'O ícone aparecerá na sua tela inicial',
    visual: (
      <div className="mx-auto w-[220px] bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
        {/* Dialog header */}
        <div className="px-4 pt-4 pb-3 text-center border-b border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Adicionar à Tela de Início</p>
          <div className="flex items-center gap-2 justify-center">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-lg">🙏</span>
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-gray-800">Jornada com Deus</p>
              <p className="text-[10px] text-gray-400">jornada-com-deus.app</p>
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex divide-x divide-gray-200">
          <div className="flex-1 py-3 text-center">
            <span className="text-xs text-blue-500">Cancelar</span>
          </div>
          <motion.div
            className="flex-1 py-3 text-center"
            animate={{ backgroundColor: ['#EFF6FF', '#DBEAFE', '#EFF6FF'] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-xs font-bold text-blue-600">Adicionar</span>
          </motion.div>
        </div>
      </div>
    ),
  },
]

export function IosInstallGuide({ onClose }: iOSInstallGuideProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slide = slides[currentSlide]
  const isFirst = currentSlide === 0
  const isLast = currentSlide === slides.length - 1

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 rounded-t-3xl bg-white shadow-2xl border-t border-gray-200 p-6 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🙏</span>
          </div>
          <h2 className="text-base font-bold text-gray-900">Instalar no iPhone</h2>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-lg leading-none"
          aria-label="Fechar"
        >
          ×
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-1.5 mb-5">
        {slides.map((_, i) => (
          <motion.div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentSlide ? 'w-6 bg-purple-600' : 'w-1.5 bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Slide Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.18 }}
          className="space-y-4"
        >
          {/* Visual illustration */}
          <div className="min-h-[140px] flex items-center justify-center py-2">
            {slide.visual}
          </div>

          {/* Text */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {slide.step}
              </span>
              <h3 className="text-sm font-bold text-gray-900">{slide.title}</h3>
            </div>
            <p className="text-xs text-gray-500">{slide.description}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={() => !isFirst && setCurrentSlide(prev => prev - 1)}
          disabled={isFirst}
          aria-label="Voltar"
          className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 font-semibold text-sm transition-colors"
        >
          ← Voltar
        </button>
        <button
          onClick={() => (isLast ? onClose() : setCurrentSlide(prev => prev + 1))}
          aria-label={isLast ? 'Concluir' : 'Próximo'}
          className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors"
        >
          {isLast ? 'Entendido ✓' : 'Próximo →'}
        </button>
      </div>
    </motion.div>
  )
}
