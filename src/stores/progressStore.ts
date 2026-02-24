import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper: retorna hoje no formato 'YYYY-MM-DD' (local timezone)
function getTodayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Helper: retorna ontem no formato 'YYYY-MM-DD'
function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

interface Progress {
  currentStreak: number;
  maxStreak: number;
  totalXp: number;
  level: number;
  treeLevel: number; // 0-10
  lastCompletedDate: string | null; // 'YYYY-MM-DD' — evita bug de serialização Date→JSON
  completedDays: number;
  completedDates: string[]; // Array de datas 'YYYY-MM-DD' para o calendário
}

interface ProgressStore {
  progress: Progress;
  completeDay: () => void;
  isTodayCompleted: () => boolean;
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
  completedDates: [],
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: INITIAL_PROGRESS,

      isTodayCompleted: () => {
        const { progress } = get();
        return progress.lastCompletedDate === getTodayStr();
      },

      completeDay: () => {
        const todayStr = getTodayStr();
        const { progress } = get();

        // Idempotente: já completou hoje, não faz nada
        if (progress.lastCompletedDate === todayStr) return;

        // Calcular streak
        let newStreak = 1;
        if (progress.lastCompletedDate === getYesterdayStr()) {
          newStreak = progress.currentStreak + 1;
        }

        const xpGained = 75;
        const newTotalXp = progress.totalXp + xpGained;
        const newLevel = Math.floor(newTotalXp / 100) + 1;

        const newCompletedDays = progress.completedDays + 1;
        const newTreeLevel = Math.min(Math.floor(newCompletedDays / 5), 10);

        const newCompletedDates = progress.completedDates.includes(todayStr)
          ? progress.completedDates
          : [...(progress.completedDates ?? []), todayStr];

        set({
          progress: {
            currentStreak: newStreak,
            maxStreak: Math.max(progress.maxStreak, newStreak),
            totalXp: newTotalXp,
            level: newLevel,
            treeLevel: newTreeLevel,
            lastCompletedDate: todayStr,
            completedDays: newCompletedDays,
            completedDates: newCompletedDates,
          },
        });
      },

      getXpForNextLevel: () => {
        const { progress } = get();
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
