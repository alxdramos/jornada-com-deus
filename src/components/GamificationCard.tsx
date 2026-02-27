"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Star, Share2, Check } from "lucide-react";
import { TREE_XP_THRESHOLDS, useProgressStore } from "@/stores/progressStore";
import { AppCard } from "./AppCard";
import { TreeGrowthVisual, TREE_STAGES } from "./TreeGrowthVisual";
import { useNativeShare } from "@/hooks/useNativeShare";

export function GamificationCard() {
  const { progress, getXpForNextLevel, getTreeProgress } = useProgressStore();
  const { share, copied } = useNativeShare();

  // XP dentro do nível atual (baseado nos thresholds reais)
  const safeLevel = Math.max(0, Math.min(10, progress.level));
  const xpCurrentLevel = TREE_XP_THRESHOLDS[safeLevel] ?? 0;
  const xpNextLevel = safeLevel < 10 ? (TREE_XP_THRESHOLDS[safeLevel + 1] ?? TREE_XP_THRESHOLDS[10]) : TREE_XP_THRESHOLDS[10];
  const xpForThisLevel = Math.max(1, xpNextLevel - xpCurrentLevel);
  const xpInLevel = Math.max(0, progress.totalXp - xpCurrentLevel);
  const xpProgress = safeLevel >= 10 ? 100 : Math.min(100, (xpInLevel / xpForThisLevel) * 100);
  const treeProgress = getTreeProgress();

  // Animação de evolução da árvore
  const prevTreeLevelRef = useRef(progress.treeLevel);
  const [showEvolution, setShowEvolution] = useState(false);
  const [evolvedStageName, setEvolvedStageName] = useState('');

  useEffect(() => {
    if (progress.treeLevel > prevTreeLevelRef.current) {
      const stage = TREE_STAGES[progress.treeLevel];
      setEvolvedStageName(stage?.name ?? '');
      setShowEvolution(true);
      const timer = setTimeout(() => setShowEvolution(false), 3500);
      prevTreeLevelRef.current = progress.treeLevel;
      return () => clearTimeout(timer);
    }
    prevTreeLevelRef.current = progress.treeLevel;
  }, [progress.treeLevel]);

  return (
    <div className="relative">
    <AppCard title="Sua Jornada" className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="space-y-6">

        {/* Streak com fogo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: progress.currentStreak > 0 ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: progress.currentStreak > 0 ? Infinity : 0,
                repeatType: "reverse",
              }}
            >
              <Flame
                className={`w-8 h-8 ${
                  progress.currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'
                }`}
              />
            </motion.div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {progress.currentStreak}
              </div>
              <div className="text-sm text-muted-foreground">
                dias de streak
              </div>
            </div>
          </div>

          {progress.maxStreak > progress.currentStreak && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Melhor: {progress.maxStreak}
              </div>
            </div>
          )}
        </div>

        {/* Barra de XP */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              Nível {progress.level}
            </span>
            <span className="text-muted-foreground">
              {xpInLevel} / {xpForThisLevel} XP
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

          <div className="text-xs text-muted-foreground text-center">
            {progress.treeLevel >= 10
              ? "🎉 Bananeira Gloriosa atingida!"
              : `+${getXpForNextLevel()} XP para o próximo nível`}
          </div>
        </div>

        {/* Árvore da Vida — visualização por estágio */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-text-primary">Árvore da Vida</div>
            <button
              onClick={() => {
                const stage = TREE_STAGES[progress.treeLevel];
                share({
                  title: "Minha Árvore da Vida 🌳",
                  text: `🌳 Estágio ${progress.treeLevel + 1} — ${stage?.name ?? "Crescendo"}!\n\n🔥 ${progress.currentStreak} dias de streak\n📖 ${progress.completedDays} dias na jornada\n\nJunte-se a mim na Jornada com Deus!`,
                });
              }}
              className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/5"
              aria-label="Compartilhar progresso da Árvore da Vida"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-green-500">Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartilhar</span>
                </>
              )}
            </button>
          </div>
          <TreeGrowthVisual
            treeLevel={progress.treeLevel}
            completedDays={progress.completedDays}
            treeProgress={treeProgress}
            compact
          />
        </div>

      </div>
    </AppCard>

    {/* Overlay de celebração ao evoluir a árvore */}
    <AnimatePresence>
      {showEvolution && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            initial={{ scale: 0.7, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: -16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="bg-white rounded-2xl px-8 py-6 text-center shadow-2xl mx-4"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -8, 8, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl mb-3"
            >
              🌿✨
            </motion.div>
            <div className="text-lg font-bold text-green-700">Árvore Evoluiu!</div>
            <div className="text-sm text-green-600 mt-1">{evolvedStageName}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
}
