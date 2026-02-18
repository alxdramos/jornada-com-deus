import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Progress {
  currentStreak: number;
  maxStreak: number;
  totalXp: number;
  level: number;
  treeLevel: number; // 0-10
  lastCompletedDate: Date | null;
  completedDays: number; // Total de dias completados
}

interface ProgressStore {
  progress: Progress;
  completeDay: () => void;
  getXpForNextLevel: () => number;
  getTreeProgress: () => number; // 0-100 para barra de progresso da árvore
  resetProgress: () => void;
}

const INITIAL_PROGRESS: Progress = {
  currentStreak: 0,
  maxStreak: 0,
  totalXp: 0,
  level: 1,
  treeLevel: 0,
  lastCompletedDate: null,
  completedDays: 0,
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: INITIAL_PROGRESS,

      completeDay: () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const { progress } = get();

        // Verificar se já completou hoje
        if (progress.lastCompletedDate) {
          const lastCompleted = new Date(progress.lastCompletedDate);
          const lastCompletedDate = new Date(lastCompleted.getFullYear(), lastCompleted.getMonth(), lastCompleted.getDate());

          if (lastCompletedDate.getTime() === today.getTime()) {
            // Já completou hoje, não fazer nada
            return;
          }
        }

        // Calcular se mantém o streak
        let newStreak = 1; // Começa com 1
        if (progress.lastCompletedDate) {
          const lastCompleted = new Date(progress.lastCompletedDate);
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          const lastCompletedDate = new Date(lastCompleted.getFullYear(), lastCompleted.getMonth(), lastCompleted.getDate());

          if (lastCompletedDate.getTime() === yesterday.getTime()) {
            // Completou ontem, mantém streak +1
            newStreak = progress.currentStreak + 1;
          }
          // Senão, streak reseta para 1
        }

        // Calcular novo XP e level
        const xpGained = 75; // XP por dia completado
        const newTotalXp = progress.totalXp + xpGained;
        const newLevel = Math.floor(newTotalXp / 100) + 1;

        // Calcular novo treeLevel (árvore da vida)
        const newCompletedDays = progress.completedDays + 1;
        const newTreeLevel = Math.min(Math.floor(newCompletedDays / 5), 10);

        const newProgress: Progress = {
          currentStreak: newStreak,
          maxStreak: Math.max(progress.maxStreak, newStreak),
          totalXp: newTotalXp,
          level: newLevel,
          treeLevel: newTreeLevel,
          lastCompletedDate: today,
          completedDays: newCompletedDays,
        };

        set({ progress: newProgress });
      },

      getXpForNextLevel: () => {
        const { progress } = get();
        const xpForCurrentLevel = (progress.level - 1) * 100;
        const xpForNextLevel = progress.level * 100;
        return xpForNextLevel - progress.totalXp;
      },

      getTreeProgress: () => {
        const { progress } = get();
        const daysForCurrentLevel = progress.treeLevel * 5;
        const daysForNextLevel = (progress.treeLevel + 1) * 5;
        const progressInCurrentLevel = progress.completedDays - daysForCurrentLevel;

        return (progressInCurrentLevel / (daysForNextLevel - daysForCurrentLevel)) * 100;
      },

      resetProgress: () => set({ progress: INITIAL_PROGRESS }),
    }),
    {
      name: 'progress-storage',
    }
  )
);