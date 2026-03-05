import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getPlanById, ChapterReading, PlanDay } from '@/data/planos-leitura';
import { useProgressStore } from './progressStore';

export interface ActivePlan {
  planId: string;
  startDate: string;       // YYYY-MM-DD
  completedChapters: string[]; // "joao-1", "atos-3"
  totalXpEarned: number;
  isCompleted: boolean;
}

interface ReadingPlanStore {
  activePlan: ActivePlan | null;

  // Actions
  startPlan: (planId: string) => void;
  abandonPlan: () => void;
  markChapterRead: (bookId: string, chapter: number) => void;

  // Selectors
  isChapterRead: (bookId: string, chapter: number) => boolean;
  getCurrentDay: () => number; // 1-based day since start
  getTodayReadings: () => PlanDay | null;
  getDayProgress: (day?: number) => { completed: number; total: number };
  getTotalProgress: () => { completedChapters: number; totalChapters: number; completedDays: number; totalDays: number };
}

function getTodayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDaysSince(startDate: string): number {
  const start = new Date(startDate + 'T00:00:00');
  const today = new Date(getTodayStr() + 'T00:00:00');
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff + 1; // 1-based
}

function chapterKey(bookId: string, chapter: number): string {
  return `${bookId}-${chapter}`;
}

export const useReadingPlanStore = create<ReadingPlanStore>()(
  persist(
    (set, get) => ({
      activePlan: null,

      startPlan: (planId: string) => {
        set({
          activePlan: {
            planId,
            startDate: getTodayStr(),
            completedChapters: [],
            totalXpEarned: 0,
            isCompleted: false,
          },
        });
      },

      abandonPlan: () => {
        set({ activePlan: null });
      },

      markChapterRead: (bookId: string, chapter: number) => {
        const { activePlan } = get();
        if (!activePlan || activePlan.isCompleted) return;

        const key = chapterKey(bookId, chapter);
        if (activePlan.completedChapters.includes(key)) return; // idempotent

        const plan = getPlanById(activePlan.planId);
        if (!plan) return;

        const xpGain = plan.xpPerChapter;
        const newCompleted = [...activePlan.completedChapters, key];
        const newXpEarned = activePlan.totalXpEarned + xpGain;

        // Total chapters in plan
        const totalChapters = plan.days.reduce((sum, d) => sum + d.readings.length, 0);
        const isCompleted = newCompleted.length >= totalChapters;

        // Award XP to the global progress store
        useProgressStore.getState().addXp(xpGain);

        set({
          activePlan: {
            ...activePlan,
            completedChapters: newCompleted,
            totalXpEarned: newXpEarned,
            isCompleted,
          },
        });
      },

      isChapterRead: (bookId: string, chapter: number) => {
        const { activePlan } = get();
        if (!activePlan) return false;
        return activePlan.completedChapters.includes(chapterKey(bookId, chapter));
      },

      getCurrentDay: () => {
        const { activePlan } = get();
        if (!activePlan) return 0;
        const plan = getPlanById(activePlan.planId);
        if (!plan) return 0;
        const day = getDaysSince(activePlan.startDate);
        return Math.min(day, plan.duration);
      },

      getTodayReadings: () => {
        const { activePlan } = get();
        if (!activePlan) return null;
        const plan = getPlanById(activePlan.planId);
        if (!plan) return null;
        const currentDay = getDaysSince(activePlan.startDate);
        const dayData = plan.days.find(d => d.day === currentDay);
        return dayData ?? null;
      },

      getDayProgress: (day?: number) => {
        const { activePlan } = get();
        if (!activePlan) return { completed: 0, total: 0 };
        const plan = getPlanById(activePlan.planId);
        if (!plan) return { completed: 0, total: 0 };

        const targetDay = day ?? getDaysSince(activePlan.startDate);
        const dayData = plan.days.find(d => d.day === targetDay);
        if (!dayData) return { completed: 0, total: 0 };

        const completed = dayData.readings.filter(r =>
          activePlan.completedChapters.includes(chapterKey(r.bookId, r.chapter))
        ).length;

        return { completed, total: dayData.readings.length };
      },

      getTotalProgress: () => {
        const { activePlan } = get();
        if (!activePlan) return { completedChapters: 0, totalChapters: 0, completedDays: 0, totalDays: 0 };
        const plan = getPlanById(activePlan.planId);
        if (!plan) return { completedChapters: 0, totalChapters: 0, completedDays: 0, totalDays: 0 };

        const totalChapters = plan.days.reduce((sum, d) => sum + d.readings.length, 0);
        const completedChapters = activePlan.completedChapters.length;

        // Count days where ALL readings are done
        const completedDays = plan.days.filter(dayData =>
          dayData.readings.every(r =>
            activePlan.completedChapters.includes(chapterKey(r.bookId, r.chapter))
          )
        ).length;

        return { completedChapters, totalChapters, completedDays, totalDays: plan.duration };
      },
    }),
    {
      name: 'reading-plan-storage',
    }
  )
);
