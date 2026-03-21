"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Star, Share2, Check, Leaf, Sparkles, Trophy } from "lucide-react";
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
  const xpNextLevel = safeLevel < 10
    ? (TREE_XP_THRESHOLDS[safeLevel + 1] ?? TREE_XP_THRESHOLDS[10])
    : TREE_XP_THRESHOLDS[10];
  const xpForThisLevel = Math.max(1, xpNextLevel - xpCurrentLevel);
  const xpInLevel = Math.max(0, progress.totalXp - xpCurrentLevel);
  const xpProgress = safeLevel >= 10 ? 100 : Math.min(100, (xpInLevel / xpForThisLevel) * 100);
  const treeProgress = getTreeProgress();

  // Animação de evolução da árvore
  const prevTreeLevelRef = useRef(progress.treeLevel);
  const [showEvolution, setShowEvolution] = useState(false);
  const [evolvedStageName, setEvolvedStageName] = useState("");

  useEffect(() => {
    if (progress.treeLevel > prevTreeLevelRef.current) {
      const stage = TREE_STAGES[progress.treeLevel];
      setEvolvedStageName(stage?.name ?? "");
      setShowEvolution(true);
      const timer = setTimeout(() => setShowEvolution(false), 3500);
      prevTreeLevelRef.current = progress.treeLevel;
      return () => clearTimeout(timer);
    }
    prevTreeLevelRef.current = progress.treeLevel;
  }, [progress.treeLevel]);

  return (
    <div className="relative">
      <AppCard
        title="Sua Jornada"
        style={{
          background: "linear-gradient(135deg, rgba(0,105,71,0.04) 0%, rgba(129,81,0,0.04) 100%)",
        }}
      >
        <div className="space-y-5">

          {/* Streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: progress.currentStreak > 0 ? [1, 1.1, 1] : 1 }}
                transition={{
                  duration: 2,
                  repeat: progress.currentStreak > 0 ? Infinity : 0,
                  repeatType: "reverse",
                }}
                className="p-2.5 rounded-xl"
                style={
                  progress.currentStreak > 0
                    ? {
                        background: "var(--color-secondary-container)",
                        boxShadow: "var(--shadow-sm)",
                      }
                    : { background: "var(--color-surface-container)" }
                }
              >
                <Flame
                  className="w-5 h-5"
                  style={
                    progress.currentStreak > 0
                      ? { color: "var(--color-secondary)" }
                      : { color: "var(--color-on-surface-variant)" }
                  }
                />
              </motion.div>
              <div>
                <div className="text-2xl font-bold text-text-primary leading-none">
                  {progress.currentStreak}
                </div>
                <div className="text-xs text-text-secondary mt-0.5">dias de streak</div>
              </div>
            </div>

            {/* Nível badge */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{
                background: "var(--color-primary-container)",
                color: "var(--color-on-primary-container)",
              }}
            >
              <Star className="w-4 h-4 fill-current" style={{ color: "var(--color-primary)" }} />
              <span className="text-sm font-bold" style={{ color: "var(--color-on-primary-container)" }}>
                Nível {progress.level}
              </span>
            </div>
          </div>

          {/* Barra de XP — violet → gold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium">
                {xpInLevel} / {xpForThisLevel} XP
              </span>
              {progress.maxStreak > progress.currentStreak && (
                <span className="text-text-tertiary">
                  Melhor: {progress.maxStreak} dias
                </span>
              )}
            </div>

            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            </div>

            <div className="text-xs text-text-secondary text-center">
              {safeLevel >= 10 ? (
                <span className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                  <Trophy className="w-3.5 h-3.5" />
                  Bananeira Gloriosa atingida!
                </span>
              ) : (
                `+${getXpForNextLevel()} XP para o próximo nível`
              )}
            </div>
          </div>

          {/* Árvore da Vida */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-text-primary">Árvore da Vida</span>
              </div>
              <button
                onClick={() => {
                  const stage = TREE_STAGES[progress.treeLevel];
                  share({
                    title: "Minha Árvore da Vida",
                    text: `Estágio ${progress.treeLevel + 1} — ${stage?.name ?? "Crescendo"}!\n\n${progress.currentStreak} dias de streak\n${progress.completedDays} dias na jornada\n\nJunte-se a mim na Jornada com Deus!`,
                  });
                }}
                className="flex items-center gap-1 text-xs transition-colors px-2 py-1 rounded-lg"
              style={{ color: "var(--color-primary-dim)" }}
                aria-label="Compartilhar progresso da Árvore da Vida"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-green-600 dark:text-green-400">Copiado!</span>
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
            style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              initial={{ scale: 0.7, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -16 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="rounded-2xl px-8 py-6 text-center shadow-2xl mx-4 border border-white/20"
              style={{
                background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dim) 60%, var(--color-secondary) 100%)",
              }}
            >
              <motion.div
                animate={{ rotate: [0, -8, 8, -6, 6, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="flex items-center justify-center gap-2 mb-3"
              >
                <Leaf className="w-8 h-8 text-green-300" />
                <Sparkles className="w-6 h-6 text-amber-300" />
              </motion.div>
              <div className="text-lg font-bold text-white">Árvore Evoluiu!</div>
              <div className="text-sm text-white/75 mt-1 font-medium">{evolvedStageName}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
