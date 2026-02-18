"use client";

import { motion } from "framer-motion";
import { Flame, Star, TreePine } from "lucide-react";
import { useProgressStore } from "@/stores/progressStore";
import { AppCard } from "./AppCard";

export function GamificationCard() {
  const { progress, getXpForNextLevel, getTreeProgress } = useProgressStore();
  const xpProgress = ((progress.totalXp % 100) / 100) * 100;
  const treeProgress = getTreeProgress();

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
              Nível {progress.level}
            </span>
            <span className="text-muted-foreground">
              {progress.totalXp % 100} / 100 XP
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
            +{getXpForNextLevel()} XP para o próximo nível
          </div>
        </div>

        {/* Árvore da Vida */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <TreePine className="w-4 h-4 text-green-600" />
              Árvore da Vida
            </span>
            <span className="text-muted-foreground">
              {progress.treeLevel} / 10
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(treeProgress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
          </div>

          <div className="text-xs text-muted-foreground text-center">
            {progress.completedDays} dias completados
          </div>
        </div>

      </div>
    </AppCard>
  );
}