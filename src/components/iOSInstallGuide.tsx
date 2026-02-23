'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface iOSInstallGuideProps {
  onClose: () => void
}

const slides = [
  {
    step: 1,
    emoji: '👆',
    title: 'Toque no botão Compartilhar',
    description: 'No topo da tela do navegador',
  },
  {
    step: 2,
    emoji: '📱',
    title: 'Selecione "Adicionar à Tela de Início"',
    description: '',
  },
  {
    step: 3,
    emoji: '✅',
    title: 'Confirme tocando em "Adicionar"',
    description: '',
  },
]

export function IosInstallGuide({ onClose }: iOSInstallGuideProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slide = slides[currentSlide]
  const isFirst = currentSlide === 0
  const isLast = currentSlide === slides.length - 1

  const handleNext = () => {
    if (!isLast) {
      setCurrentSlide(prev => prev + 1)
    } else {
      onClose()
    }
  }

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentSlide(prev => prev - 1)
    }
  }

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 rounded-t-3xl bg-white shadow-lg border-t border-gray-200 p-6 z-50"
    >
      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentSlide ? 'bg-purple-600' : 'bg-gray-300'
            }`}
            animate={{ scale: i === currentSlide ? 1.2 : 1 }}
          />
        ))}
      </div>

      {/* Content Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="min-h-[200px] flex flex-col justify-center text-center mb-8"
        >
          <p className="text-5xl mb-4">{slide.emoji}</p>

          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900">
              {slide.step}️⃣
            </p>
            <h3 className="text-lg font-bold text-gray-900">{slide.title}</h3>
            {slide.description && (
              <p className="text-sm text-gray-600">{slide.description}</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={handlePrev}
          disabled={isFirst}
          aria-label="Voltar"
          className="flex-1 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold transition duration-200"
        >
          ← Voltar
        </button>
        <button
          onClick={handleNext}
          aria-label={isLast ? 'Fechar' : 'Próximo'}
          className="flex-1 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition duration-200"
        >
          {isLast ? 'Pronto ✓' : 'Próximo →'}
        </button>
      </div>
    </motion.div>
  )
}
