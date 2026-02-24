import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useProgressStore, TREE_DAY_THRESHOLDS, TREE_XP_THRESHOLDS } from '../progressStore'

describe('progressStore', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useProgressStore.setState({
      progress: {
        currentStreak: 0,
        maxStreak: 0,
        totalXp: 0,
        level: 0,
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
        level: 0,
        treeLevel: 0,
        lastCompletedDate: null,
        completedDays: 0,
        completedDates: [],
      })
    })
  })

  describe('Constantes exportadas', () => {
    it('TREE_DAY_THRESHOLDS tem 11 entradas (níveis 0-10)', () => {
      expect(TREE_DAY_THRESHOLDS).toHaveLength(11)
      expect(TREE_DAY_THRESHOLDS[0]).toBe(0)
      expect(TREE_DAY_THRESHOLDS[10]).toBe(90)
    })

    it('TREE_XP_THRESHOLDS = TREE_DAY_THRESHOLDS × 100', () => {
      expect(TREE_XP_THRESHOLDS).toHaveLength(11)
      expect(TREE_XP_THRESHOLDS[0]).toBe(0)
      expect(TREE_XP_THRESHOLDS[1]).toBe(500)   // 5 dias × 100
      expect(TREE_XP_THRESHOLDS[10]).toBe(9000) // 90 dias × 100
    })
  })

  describe('completeDay', () => {
    it('adiciona 100 XP e incrementa streak no primeiro dia', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2024, 0, 1))

      const store = useProgressStore.getState()
      store.completeDay()

      const updated = useProgressStore.getState()
      expect(updated.progress.totalXp).toBe(100)
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
      expect(updated.progress.totalXp).toBe(100)
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
      expect(updated.progress.totalXp).toBe(200)
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

    it('level é igual a treeLevel (sistemas unificados)', () => {
      vi.useFakeTimers()

      // Completar 5 dias para atingir treeLevel 1
      for (let i = 0; i < 5; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        useProgressStore.getState().completeDay()
      }

      const updated = useProgressStore.getState()
      expect(updated.progress.totalXp).toBe(500)
      expect(updated.progress.treeLevel).toBe(1)
      expect(updated.progress.level).toBe(updated.progress.treeLevel)
    })

    it('atualiza treeLevel ao atingir threshold de dias', () => {
      vi.useFakeTimers()

      // Nível 1 = 5 dias
      for (let i = 0; i < 5; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        useProgressStore.getState().completeDay()
      }
      expect(useProgressStore.getState().progress.treeLevel).toBe(1)

      // Nível 2 = 10 dias
      for (let i = 5; i < 10; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        useProgressStore.getState().completeDay()
      }
      expect(useProgressStore.getState().progress.treeLevel).toBe(2)

      // Nível 3 = 18 dias
      for (let i = 10; i < 18; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        useProgressStore.getState().completeDay()
      }
      expect(useProgressStore.getState().progress.treeLevel).toBe(3)
    })

    it('treeLevel tem limite máximo de 10 (atingido com 90+ dias)', () => {
      vi.useFakeTimers()

      for (let i = 0; i < 95; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        useProgressStore.getState().completeDay()
      }

      const updated = useProgressStore.getState()
      expect(updated.progress.treeLevel).toBe(10)
      expect(updated.progress.level).toBe(10)
      expect(updated.progress.completedDays).toBe(95)
    })

    it('atingir treeLevel 10 exige exatamente 90 dias', () => {
      vi.useFakeTimers()

      for (let i = 0; i < 89; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        useProgressStore.getState().completeDay()
      }
      expect(useProgressStore.getState().progress.treeLevel).toBe(9)

      vi.setSystemTime(new Date(2024, 0, 90))
      useProgressStore.getState().completeDay()
      expect(useProgressStore.getState().progress.treeLevel).toBe(10)
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
    it('retorna 500 XP necessário para o nível 1 (do estado inicial)', () => {
      const store = useProgressStore.getState()
      // Nível 0 → Nível 1 = 500 XP (5 dias × 100)
      expect(store.getXpForNextLevel()).toBe(500)
    })

    it('calcula corretamente após ganhar XP', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2024, 0, 1))

      let store = useProgressStore.getState()
      store.completeDay()

      store = useProgressStore.getState()
      expect(store.progress.totalXp).toBe(100)
      expect(store.getXpForNextLevel()).toBe(400) // precisa 500, tem 100
    })

    it('retorna 0 ao atingir nível máximo (10)', () => {
      vi.useFakeTimers()

      for (let i = 0; i < 90; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        useProgressStore.getState().completeDay()
      }

      const store = useProgressStore.getState()
      expect(store.progress.treeLevel).toBe(10)
      expect(store.getXpForNextLevel()).toBe(0)
    })
  })

  describe('getTreeProgress', () => {
    it('retorna 0 sem dias completados', () => {
      const store = useProgressStore.getState()
      expect(store.getTreeProgress()).toBe(0)
    })

    it('retorna 40% com 2 dias no nível 0 (precisa 5 dias = 500 XP)', () => {
      vi.useFakeTimers()

      // 2 dias = 200 XP; threshold nível 0→1 = 500 XP; progresso = 200/500 = 40%
      for (let i = 0; i < 2; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        useProgressStore.getState().completeDay()
      }

      const store = useProgressStore.getState()
      expect(store.progress.completedDays).toBe(2)
      expect(store.progress.totalXp).toBe(200)
      expect(store.getTreeProgress()).toBe(40)
    })

    it('reseta para 0 ao atingir novo nível', () => {
      vi.useFakeTimers()

      // 5 dias completos → treeLevel = 1, totalXp = 500 (exatamente no threshold)
      for (let i = 0; i < 5; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        useProgressStore.getState().completeDay()
      }

      const store = useProgressStore.getState()
      expect(store.progress.treeLevel).toBe(1)
      expect(store.getTreeProgress()).toBe(0) // 0% dentro do nível 1
    })

    it('retorna 100 ao atingir nível máximo', () => {
      vi.useFakeTimers()

      for (let i = 0; i < 90; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        useProgressStore.getState().completeDay()
      }

      const store = useProgressStore.getState()
      expect(store.progress.treeLevel).toBe(10)
      expect(store.getTreeProgress()).toBe(100)
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
        level: 0,
        treeLevel: 0,
        lastCompletedDate: null,
        completedDays: 0,
        completedDates: [],
      })
    })
  })
})
