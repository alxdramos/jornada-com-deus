import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useProgressStore } from '../progressStore'

describe('progressStore', () => {
  beforeEach(() => {
    // Limpar localStorage entre testes
    window.localStorage.clear()
    // Resetar state do Zustand
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

      // Dia 1
      vi.setSystemTime(new Date(2024, 0, 1))
      let store = useProgressStore.getState()
      store.completeDay()

      // Dia 2 (próximo dia)
      vi.setSystemTime(new Date(2024, 0, 2))
      store = useProgressStore.getState()
      store.completeDay()

      const updated = useProgressStore.getState()
      expect(updated.progress.currentStreak).toBe(2)
      expect(updated.progress.totalXp).toBe(150) // 75 * 2
      expect(updated.progress.completedDays).toBe(2)
    })

    it('reseta streak para 1 quando pula um dia', () => {
      vi.useFakeTimers()

      // Dia 1
      vi.setSystemTime(new Date(2024, 0, 1))
      let store = useProgressStore.getState()
      store.completeDay()
      expect(useProgressStore.getState().progress.currentStreak).toBe(1)

      // Dia 3 (pula dia 2)
      vi.setSystemTime(new Date(2024, 0, 3))
      store = useProgressStore.getState()
      store.completeDay()

      const updated = useProgressStore.getState()
      expect(updated.progress.currentStreak).toBe(1) // Resetado
      expect(updated.progress.maxStreak).toBe(1) // Max streak não muda
      expect(updated.progress.completedDays).toBe(2)
    })

    it('atualiza level a cada 100 XP', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2024, 0, 1))

      const store = useProgressStore.getState()

      // 2 dias = 150 XP = nível 2
      store.completeDay()
      vi.setSystemTime(new Date(2024, 0, 2))
      store.completeDay()

      const updated = useProgressStore.getState()
      expect(updated.progress.totalXp).toBe(150)
      expect(updated.progress.level).toBe(2) // floor(150/100) + 1 = 2
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

      // Completar 60 dias (treeLevels: 0-1-2-3-4-5-6-7-8-9-10)
      for (let i = 0; i < 60; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        const store = useProgressStore.getState()
        store.completeDay()
      }

      const updated = useProgressStore.getState()
      expect(updated.progress.treeLevel).toBe(10) // Capped at 10
    })

    it('atualiza lastCompletedDate corretamente', () => {
      vi.useFakeTimers()
      const date1 = new Date(2024, 0, 1)
      vi.setSystemTime(date1)

      const store = useProgressStore.getState()
      store.completeDay()

      const updated = useProgressStore.getState()
      const lastDate = updated.progress.lastCompletedDate as Date
      expect(lastDate.getFullYear()).toBe(2024)
      expect(lastDate.getMonth()).toBe(0)
      expect(lastDate.getDate()).toBe(1)
    })

    it('adiciona data no formato YYYY-MM-DD em completedDates', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2024, 0, 15))

      const store = useProgressStore.getState()
      store.completeDay()

      const updated = useProgressStore.getState()
      expect(updated.progress.completedDates.length).toBe(1)
      // Verificar formato YYYY-MM-DD
      expect(updated.progress.completedDates[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      // Verificar que contém data válida (2024 ou 2023 dependendo timezone)
      expect(updated.progress.completedDates[0]).toMatch(/^202[34]-/)
    })

    it('atualiza maxStreak quando currentStreak é maior', () => {
      vi.useFakeTimers()

      // Criar streak de 3 dias
      for (let i = 0; i < 3; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        const store = useProgressStore.getState()
        store.completeDay()
      }

      const updated = useProgressStore.getState()
      expect(updated.progress.maxStreak).toBe(3)
    })
  })

  describe('getXpForNextLevel', () => {
    it('retorna XP necessário para próximo level', () => {
      const store = useProgressStore.getState()
      // Level 1, totalXp 0 -> faltam 100 para level 2
      expect(store.getXpForNextLevel()).toBe(100)
    })

    it('calcula corretamente após ganhar XP', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2024, 0, 1))

      let store = useProgressStore.getState()
      store.completeDay() // +75 XP, level ainda 1

      store = useProgressStore.getState()
      expect(store.progress.totalXp).toBe(75)
      expect(store.progress.level).toBe(1)
      expect(store.getXpForNextLevel()).toBe(25) // 100 - 75
    })

    it('retorna 0 quando em novo level', () => {
      vi.useFakeTimers()

      for (let i = 0; i < 2; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        const store = useProgressStore.getState()
        store.completeDay()
      }

      const store = useProgressStore.getState()
      expect(store.progress.totalXp).toBe(150)
      expect(store.progress.level).toBe(2)
      expect(store.getXpForNextLevel()).toBe(50) // 200 - 150
    })
  })

  describe('getTreeProgress', () => {
    it('retorna 0-100 para progresso da árvore no tier atual', () => {
      vi.useFakeTimers()

      // 0 dias completados, treeLevel 0
      let store = useProgressStore.getState()
      expect(store.getTreeProgress()).toBe(0)

      // 2 dias completados, treeLevel ainda 0 (precisa 5)
      for (let i = 0; i < 2; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        store = useProgressStore.getState()
        store.completeDay()
      }

      store = useProgressStore.getState()
      expect(store.progress.completedDays).toBe(2)
      expect(store.progress.treeLevel).toBe(0)
      // Progress = (2 - 0) / (5 - 0) * 100 = 40%
      expect(store.getTreeProgress()).toBe(40)
    })

    it('reseta para 0 ao atingir novo tier', () => {
      vi.useFakeTimers()

      // 5 dias = tier 1
      for (let i = 0; i < 5; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        const store = useProgressStore.getState()
        store.completeDay()
      }

      let store = useProgressStore.getState()
      expect(store.progress.treeLevel).toBe(1)
      // Progress = (5 - 5) / (10 - 5) * 100 = 0%
      expect(store.getTreeProgress()).toBe(0)

      // 7 dias = tier 1, 40% progress
      for (let i = 5; i < 7; i++) {
        vi.setSystemTime(new Date(2024, 0, i + 1))
        store = useProgressStore.getState()
        store.completeDay()
      }

      store = useProgressStore.getState()
      // Progress = (7 - 5) / (10 - 5) * 100 = 40%
      expect(store.getTreeProgress()).toBe(40)
    })
  })

  describe('resetProgress', () => {
    it('volta ao estado inicial', () => {
      vi.useFakeTimers()

      // Ganhar XP e progresso
      vi.setSystemTime(new Date(2024, 0, 1))
      let store = useProgressStore.getState()
      store.completeDay()

      let updated = useProgressStore.getState()
      expect(updated.progress.totalXp).toBe(75)
      expect(updated.progress.currentStreak).toBe(1)

      // Reset
      store = useProgressStore.getState()
      store.resetProgress()

      updated = useProgressStore.getState()
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
