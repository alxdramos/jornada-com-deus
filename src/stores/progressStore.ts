import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const XP_PER_DAY = 100;

// Days required to reach each tree stage (0-10)
// Must stay in sync with TREE_STAGES[].daysRequired in TreeGrowthVisual.tsx
export const TREE_DAY_THRESHOLDS = [0, 5, 10, 18, 27, 37, 48, 59, 70, 80, 90] as const;

// XP thresholds for each tree level (TREE_DAY_THRESHOLDS × XP_PER_DAY)
// Level and treeLevel are UNIFIED — both derived from totalXp
export const TREE_XP_THRESHOLDS: readonly number[] = TREE_DAY_THRESHOLDS.map(d => d * XP_PER_DAY);

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
  level: number;      // 0-10, unified with treeLevel (both derived from totalXp)
  treeLevel: number;  // 0-10, unified with level
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

// Returns level 0-10 based on total XP (unified with treeLevel)
export function getLevelFromXp(totalXp: number): number {
  for (let i = TREE_XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= TREE_XP_THRESHOLDS[i]) {
      return i;
    }
  }
  return 0;
}

// Returns tree level 0-10 based on completed days
export function getTreeLevelFromDays(completedDays: number): number {
  for (let i = TREE_DAY_THRESHOLDS.length - 1; i >= 0; i--) {
    if (completedDays >= TREE_DAY_THRESHOLDS[i]) {
      return i;
    }
  }
  return 0;
}

const INITIAL_PROGRESS: Progress = {
  currentStreak: 0,
  maxStreak: 0,
  totalXp: 0,
  level: 0,
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

        const newTotalXp = progress.totalXp + XP_PER_DAY;
        const newLevel = getLevelFromXp(newTotalXp); // 0-10, unified

        const newCompletedDays = progress.completedDays + 1;

        const newCompletedDates = progress.completedDates.includes(todayStr)
          ? progress.completedDates
          : [...(progress.completedDates ?? []), todayStr];

        set({
          progress: {
            currentStreak: newStreak,
            maxStreak: Math.max(progress.maxStreak, newStreak),
            totalXp: newTotalXp,
            level: newLevel,
            treeLevel: newLevel, // Unified with level — both from XP
            lastCompletedDate: todayStr,
            completedDays: newCompletedDays,
            completedDates: newCompletedDates,
          },
        });
      },

      getXpForNextLevel: () => {
        const { progress } = get();
        if (progress.treeLevel >= 10) return 0;
        const xpForNextLevel = TREE_XP_THRESHOLDS[progress.treeLevel + 1];
        return Math.max(0, xpForNextLevel - progress.totalXp);
      },

      getTreeProgress: () => {
        const { progress } = get();
        if (progress.treeLevel >= 10) return 100;
        const xpForCurrentLevel = TREE_XP_THRESHOLDS[progress.treeLevel];
        const xpForNextLevel = TREE_XP_THRESHOLDS[progress.treeLevel + 1];
        const xpInCurrentLevel = progress.totalXp - xpForCurrentLevel;
        const raw = (xpInCurrentLevel / (xpForNextLevel - xpForCurrentLevel)) * 100;
        return Math.max(0, Math.min(100, raw));
      },

      resetProgress: () => set({ progress: INITIAL_PROGRESS }),
    }),
    {
      name: 'progress-storage',
    }
  )
);
