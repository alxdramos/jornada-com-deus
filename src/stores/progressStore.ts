import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const XP_PER_DAY = 75;
export const LEVEL_XP_STEP = 100;
export const TREE_DAYS_STEP = 5;

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

export function getLevelFromXp(totalXp: number): number {
  return Math.max(1, Math.floor(totalXp / LEVEL_XP_STEP) + 1);
}

export function getCompletedDaysFromXp(totalXp: number): number {
  return Math.max(0, Math.floor(totalXp / XP_PER_DAY));
}

export function getTreeLevelFromDays(completedDays: number): number {
  return Math.min(Math.max(0, Math.floor(completedDays / TREE_DAYS_STEP)), 10);
}

const INITIAL_PROGRESS: Progress = {
  currentStreak: 0,
  maxStreak: 0,
  totalXp: 0,
  level: getLevelFromXp(0),
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

        const xpGained = XP_PER_DAY;
        const newTotalXp = progress.totalXp + xpGained;
        const newLevel = getLevelFromXp(newTotalXp);

        const calculatedCompletedDays = getCompletedDaysFromXp(newTotalXp);
        const newCompletedDays = Math.max(progress.completedDays + 1, calculatedCompletedDays);
        const newTreeLevel = getTreeLevelFromDays(newCompletedDays);

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
        const safeLevel = Math.max(1, progress.level);
        const xpForNextLevel = safeLevel * LEVEL_XP_STEP;
        return Math.max(0, xpForNextLevel - progress.totalXp);
      },

      getTreeProgress: () => {
        const { progress } = get();
        if (progress.treeLevel >= 10) return 100;
        const daysForCurrentLevel = progress.treeLevel * TREE_DAYS_STEP;
        const daysForNextLevel = (progress.treeLevel + 1) * TREE_DAYS_STEP;
        const progressInCurrentLevel = progress.completedDays - daysForCurrentLevel;
        const raw = (progressInCurrentLevel / (daysForNextLevel - daysForCurrentLevel)) * 100;
        return Math.max(0, Math.min(100, raw));
      },

      resetProgress: () => set({ progress: INITIAL_PROGRESS }),
    }),
    {
      name: 'progress-storage',
    }
  )
);
