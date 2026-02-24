"use client";

import { motion } from "framer-motion";
import { Flame, Star } from "lucide-react";
import { useProgressStore, TREE_XP_THRESHOLDS } from "@/stores/progressStore";
import { AppCard } from "./AppCard";
import { TreeGrowthVisual } from "./TreeGrowthVisual";

export function GamificationCard() {
  const { progress, getXpForNextLevel, getTreeProgress } = useProgressStore();
  const treeProgress = getTreeProgress();
  // XP dentro do nível atual da árvore (alinhado com TREE_XP_THRESHOLDS)
  const xpCurrentLevel = TREE_XP_THRESHOLDS[progress.treeLevel] ?? 0;
  const xpNextLevel = TREE_XP_THRESHOLDS[Math.min(progress.treeLevel + 1, 10)] ?? TREE_XP_THRESHOLDS[10];
  const xpInLevel = progress.totalXp - xpCurrentLevel;
  const xpToNextLevel = xpNextLevel - xpCurrentLevel;
  const xpProgress = progress.treeLevel >= 10 ? 100 : treeProgress;

  return (
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
              Nível {progress.treeLevel}
            </span>
            <span className="text-muted-foreground">
              {progress.treeLevel >= 10
                ? `${progress.totalXp} XP — Máximo!`
                : `${xpInLevel} / ${xpToNextLevel} XP`}
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
          <div className="text-sm font-medium text-text-primary">Árvore da Vida</div>
          <TreeGrowthVisual
            treeLevel={progress.treeLevel}
            completedDays={progress.completedDays}
            treeProgress={treeProgress}
            compact
          />
        </div>

      </div>
    </AppCard>
  );
}
