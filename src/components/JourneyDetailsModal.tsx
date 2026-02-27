"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Star } from "lucide-react";
import { TREE_XP_THRESHOLDS, useProgressStore } from "@/stores/progressStore";
import { TreeGrowthVisual } from "./TreeGrowthVisual";

interface JourneyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JourneyDetailsModal({ isOpen, onClose }: JourneyDetailsModalProps) {
  const { progress, getXpForNextLevel, getTreeProgress } = useProgressStore();
  const safeLevel = Math.max(0, Math.min(10, progress.level));
  const xpCurrentLevel = TREE_XP_THRESHOLDS[safeLevel] ?? 0;
  const xpNextLevel = safeLevel < 10 ? (TREE_XP_THRESHOLDS[safeLevel + 1] ?? TREE_XP_THRESHOLDS[10]) : TREE_XP_THRESHOLDS[10];
  const xpForThisLevel = Math.max(1, xpNextLevel - xpCurrentLevel);
  const xpInLevel = Math.max(0, progress.totalXp - xpCurrentLevel);
  const xpProgress = safeLevel >= 10 ? 100 : Math.min(100, (xpInLevel / xpForThisLevel) * 100);
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
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl max-h-[92vh] overflow-y-auto"
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

              <div className="space-y-8">
                {/* Streak */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ scale: progress.currentStreak > 0 ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 2, repeat: progress.currentStreak > 0 ? Infinity : 0, repeatType: "reverse" }}
                    >
                      <Flame className={`w-10 h-10 ${progress.currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                    </motion.div>
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-primary flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Nível {progress.level}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {xpInLevel} / {xpForThisLevel} XP
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
                  <p className="text-xs text-text-secondary text-center">
                    +{getXpForNextLevel()} XP para o próximo nível
                  </p>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {progress.totalXp}
                    </div>
                    <div className="text-xs text-blue-700 mt-1">Total de XP</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {progress.completedDates?.length || 0}
                    </div>
                    <div className="text-xs text-purple-700 mt-1">Dias ativos</div>
                  </div>
                </div>

                {/* Árvore da Vida — visualização completa */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                    🌱 Árvore da Vida
                  </h3>
                  <TreeGrowthVisual
                    treeLevel={progress.treeLevel}
                    completedDays={progress.completedDays}
                    treeProgress={treeProgress}
                    compact={false}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
