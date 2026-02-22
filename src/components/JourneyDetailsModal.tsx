"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Star, TreePine, Zap } from "lucide-react";
import { useProgressStore } from "@/stores/progressStore";

interface JourneyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JourneyDetailsModal({ isOpen, onClose }: JourneyDetailsModalProps) {
  const { progress, getXpForNextLevel, getTreeProgress } = useProgressStore();
  const xpProgress = ((progress.totalXp % 100) / 100) * 100;
  const treeProgress = getTreeProgress();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 pb-20 max-w-2xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-text-primary">Sua Jornada</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-bg-secondary rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Conteúdo */}
              <div className="space-y-8">
                {/* Streak */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🔥</div>
                    <div>
                      <div className="text-3xl font-bold text-orange-600">
                        {progress.currentStreak}
                      </div>
                      <div className="text-sm text-orange-700">
                        Dias de atividade consecutivos
                      </div>
                      <div className="text-xs text-orange-600 mt-1">
                        Melhor: {progress.maxStreak} dias
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nível e XP */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-text-primary flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Nível {progress.level}
                      </span>
                      <span className="text-sm text-text-secondary">
                        {progress.totalXp % 100} / 100 XP
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <p className="text-xs text-text-secondary mt-2 text-center">
                      +{getXpForNextLevel()} XP para o próximo nível
                    </p>
                  </div>
                </div>

                {/* Árvore da Vida */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-text-primary flex items-center gap-2">
                        <TreePine className="w-5 h-5 text-green-600" />
                        Árvore da Vida
                      </span>
                      <span className="text-sm text-text-secondary">
                        {progress.treeLevel} / 10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(treeProgress, 100)}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                    <p className="text-xs text-text-secondary mt-2 text-center">
                      {progress.completedDays} dias completados • {progress.treeLevel === 10 ? '🎉 Árvore completa!' : 'Continue crescendo!'}
                    </p>
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {progress.totalXp}
                    </div>
                    <div className="text-xs text-blue-700 mt-1">
                      Total de XP
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {progress.completedDates?.length || 0}
                    </div>
                    <div className="text-xs text-purple-700 mt-1">
                      Dias ativos
                    </div>
                  </div>
                </div>

                {/* Motivação */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-200">
                  <p className="text-text-secondary text-sm mb-2">
                    Você está cultivando sua Árvore da Vida! Continue consistente e
                  </p>
                  <p className="font-semibold text-green-700">
                    Você alcançará o topo! 🌳✨
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
