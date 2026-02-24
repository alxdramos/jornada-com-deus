import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Thresholds de dias para cada nível da árvore (meta: 90 dias para nível 10)
// Progressão natural: rápido no início, mais longa no fim (jornada espiritual)
export const TREE_DAY_THRESHOLDS = [0, 5, 10, 18, 27, 37, 48, 59, 70, 80, 90];

// Thresholds de XP correspondentes (1 dia completo = 100 XP)
// [0, 500, 1000, 1800, 2700, 3700, 4800, 5900, 7000, 8000, 9000]
export const TREE_XP_THRESHOLDS = TREE_DAY_THRESHOLDS.map(d => d * 100);

// Helper: calcula o nível da árvore baseado nos dias completados
function getTreeLevelForDays(days: number): number {
  let level = 0;
  for (let i = 1; i < TREE_DAY_THRESHOLDS.length; i++) {
    if (days >= TREE_DAY_THRESHOLDS[i]) level = i;
    else break;
  }
  return level;
}

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

        const xpGained = 100; // 1 dia completo = 100 XP (alinhado à jornada de 90 dias)
        const newTotalXp = progress.totalXp + xpGained;
        const newCompletedDays = progress.completedDays + 1;
        const newTreeLevel = getTreeLevelForDays(newCompletedDays);
        const newLevel = newTreeLevel; // level e treeLevel falam a mesma língua

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
        if (progress.treeLevel >= 10) return 0;
        const xpForNextLevel = TREE_XP_THRESHOLDS[progress.treeLevel + 1];
        return Math.max(0, xpForNextLevel - progress.totalXp);
      },

      getTreeProgress: () => {
        const { progress } = get();
        if (progress.treeLevel >= 10) return 100;
        const xpCurrentLevel = TREE_XP_THRESHOLDS[progress.treeLevel];
        const xpNextLevel = TREE_XP_THRESHOLDS[progress.treeLevel + 1];
        const progressInCurrentLevel = progress.totalXp - xpCurrentLevel;
        return (progressInCurrentLevel / (xpNextLevel - xpCurrentLevel)) * 100;
      },

      resetProgress: () => set({ progress: INITIAL_PROGRESS }),
    }),
    {
      name: 'progress-storage',
    }
  )
);
