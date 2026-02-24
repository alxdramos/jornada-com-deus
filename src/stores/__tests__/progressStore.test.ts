import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useProgressStore } from '../progressStore'

describe('progressStore', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useProgressStore.setState({
      progress: {
        currentStreak: 0,
        maxStreak: 0,
        totalXp: 0,
        level: 1,
        treeLevel: 0,
        lastCompletedDate: null,
        completedDays: 0,
        completedDates: [],
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Estado inicial', () => {
    it('retorna estado inicial correto', () => {
      const store = useProgressStore.getState()
      expect(store.progress).toEqual({
        currentStreak: 0,
        maxStreak: 0,
        totalXp: 0,
        level: 1,
        treeLevel: 0,
        lastCompletedDate: null,
        completedDays: 0,
        completedDates: [],
      })
    })
  })

  describe('completeDay', () => {
    it('adiciona 75 XP e incrementa streak no primeiro dia', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2024, 0, 1))

      const store = useProgressStore.getState()
      store.completeDay()

      const updated = useProgressStore.getState()
      expect(updated.progress.totalXp).toBe(75)
      expect(updated.progress.currentStreak).toBe(1)
      expect(updated.progress.completedDays).toBe(1)
    })

    it('é idempotente: chamar 2x no mesmo dia não muda estado', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2024, 0, 1))

      const store = useProgressStore.getState()
      store.completeDay()
      store.completeDay()

      const updated = useProgressStore.getState()
      expect(updated.progress.totalXp).toBe(75)
      expect(updated.progress.currentStreak).toBe(1)
      expect(updated.progress.completedDays).toBe(1)
    })

    it('incrementa streak no dia consecutivo', () => {
      vi.useFakeTimers()

      vi.setSystemTime(new Date(2024, 0, 1))
      let store = useProgressStore.getState()
      store.completeDay()

      vi.setSystemTime(new Date(2024, 0, 2))
      store = useProgressStore.getState()
      store.completeDay()

      const updated = useProgressStore.getState()
      expect(updated.progress.currentStreak).toBe(2)
      expect(updated.progress.totalXp).toBe(150)
      expect(updated.progress.completedDays).toBe(2)
    })

    it('reseta streak para 1 quando pula um dia', () => {
      vi.useFakeTimers()

      vi.setSystemTime(new Date(2024, 0, 1))
      let store = useProgressStore.getState()
      store.completeDay()
      expect(useProgressStore.getState().progress.currentStreak).toBe(1)

      vi.setSystemTime(new Date(2024, 0, 3))
      store = useProgressStore.getState()
      store.completeDay()

      const updated = useProgressStore.getState()
      expect(updated.progress.currentStreak).toBe(1)
      expect(updated.progress.maxStreak).toBe(1)
      expect(updated.progress.completedDays).toBe(2)
    })

    it('atualiza level a cada 100 XP', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2024, 0, 1))

      const store = useProgressStore.getState()
      store.completeDay()
      vi.setSystemTime(new Date(2024, 0, 2))
      store.completeDay()

      const updated = useProgressStore.getState()
      expect(updated.progress.totalXp).toBe(150)
      expect(updated.progress.level).toBe(2)
    })

    it('atualiza treeLevel a cada 5 dias completados', () => {
      vi.useFakeTimers()

      for (let i = 0; i < 5; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        const store = useProgressStore.getState()
        store.completeDay()
      }

      const updated = useProgressStore.getState()
      expect(updated.progress.completedDays).toBe(5)
      expect(updated.progress.treeLevel).toBe(1)
    })

    it('treeLevel tem limite máximo de 10', () => {
      vi.useFakeTimers()

      for (let i = 0; i < 60; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        const store = useProgressStore.getState()
        store.completeDay()
      }

      const updated = useProgressStore.getState()
      expect(updated.progress.treeLevel).toBe(10)
    })

    it('atualiza lastCompletedDate como string YYYY-MM-DD', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2024, 0, 1))

      const store = useProgressStore.getState()
      store.completeDay()

      const updated = useProgressStore.getState()
      expect(updated.progress.lastCompletedDate).toBe('2024-01-01')
    })

    it('adiciona data no formato YYYY-MM-DD em completedDates', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2024, 0, 15))

      const store = useProgressStore.getState()
      store.completeDay()

      const updated = useProgressStore.getState()
      expect(updated.progress.completedDates.length).toBe(1)
      expect(updated.progress.completedDates[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('atualiza maxStreak quando currentStreak é maior', () => {
      vi.useFakeTimers()

      for (let i = 0; i < 3; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        const store = useProgressStore.getState()
        store.completeDay()
      }

      const updated = useProgressStore.getState()
      expect(updated.progress.maxStreak).toBe(3)
    })
  })

  describe('isTodayCompleted', () => {
    it('retorna false quando nunca completou', () => {
      const store = useProgressStore.getState()
      expect(store.isTodayCompleted()).toBe(false)
    })

    it('retorna true depois de completar hoje', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2024, 0, 1))

      let store = useProgressStore.getState()
      store.completeDay()

      store = useProgressStore.getState()
      expect(store.isTodayCompleted()).toBe(true)
    })

    it('retorna false se completou ontem mas não hoje', () => {
      vi.useFakeTimers()

      vi.setSystemTime(new Date(2024, 0, 1))
      let store = useProgressStore.getState()
      store.completeDay()

      vi.setSystemTime(new Date(2024, 0, 2))
      store = useProgressStore.getState()
      expect(store.isTodayCompleted()).toBe(false)
    })
  })

  describe('getXpForNextLevel', () => {
    it('retorna XP necessário para próximo level', () => {
      const store = useProgressStore.getState()
      expect(store.getXpForNextLevel()).toBe(100)
    })

    it('calcula corretamente após ganhar XP', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2024, 0, 1))

      let store = useProgressStore.getState()
      store.completeDay()

      store = useProgressStore.getState()
      expect(store.progress.totalXp).toBe(75)
      expect(store.getXpForNextLevel()).toBe(25)
    })
  })

  describe('getTreeProgress', () => {
    it('retorna 0 sem dias completados', () => {
      const store = useProgressStore.getState()
      expect(store.getTreeProgress()).toBe(0)
    })

    it('retorna 40% com 2 dias no tier 0 (que precisa de 5)', () => {
      vi.useFakeTimers()

      for (let i = 0; i < 2; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        const store = useProgressStore.getState()
        store.completeDay()
      }

      const store = useProgressStore.getState()
      expect(store.progress.completedDays).toBe(2)
      expect(store.getTreeProgress()).toBe(40)
    })

    it('reseta para 0 ao atingir novo tier', () => {
      vi.useFakeTimers()

      for (let i = 0; i < 5; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        const store = useProgressStore.getState()
        store.completeDay()
      }

      const store = useProgressStore.getState()
      expect(store.progress.treeLevel).toBe(1)
      expect(store.getTreeProgress()).toBe(0)
    })
  })

  describe('resetProgress', () => {
    it('volta ao estado inicial', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2024, 0, 1))

      let store = useProgressStore.getState()
      store.completeDay()

      store = useProgressStore.getState()
      store.resetProgress()

      const updated = useProgressStore.getState()
      expect(updated.progress).toEqual({
        currentStreak: 0,
        maxStreak: 0,
        totalXp: 0,
        level: 1,
        treeLevel: 0,
        lastCompletedDate: null,
        completedDays: 0,
        completedDates: [],
      })
    })
  })
})
