import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mocks hoisted (necessário por causa do hoisting do vi.mock)
const mocks = vi.hoisted(() => ({
  completeDay: vi.fn(),
  isTodayCompleted: vi.fn().mockReturnValue(false),
  progress: { level: 0, treeLevel: 0 },
  getState: vi.fn(() => ({ progress: { level: 0, treeLevel: 0 } })),
  dayCompleted: vi.fn(),
  vibrateStepComplete: vi.fn(),
  vibrateDayComplete: vi.fn(),
  vibrateLevelUp: vi.fn(),
  vibrateTreeEvolve: vi.fn(),
}))

vi.mock('@/stores/progressStore', () => ({
  XP_PER_DAY: 100,
  useProgressStore: Object.assign(
    vi.fn(() => ({
      completeDay: mocks.completeDay,
      isTodayCompleted: mocks.isTodayCompleted,
      progress: mocks.progress,
    })),
    { getState: mocks.getState }
  ),
}))

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ dayCompleted: mocks.dayCompleted }),
}))

vi.mock('@/hooks/useHaptics', () => ({
  useHaptics: () => ({
    vibrateStepComplete: mocks.vibrateStepComplete,
    vibrateDayComplete: mocks.vibrateDayComplete,
    vibrateLevelUp: mocks.vibrateLevelUp,
    vibrateTreeEvolve: mocks.vibrateTreeEvolve,
  }),
}))

import { useHojeSteps } from '../useHojeSteps'

describe('useHojeSteps', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.isTodayCompleted.mockReturnValue(false)
    mocks.progress.level = 0
    mocks.progress.treeLevel = 0
    mocks.getState.mockReturnValue({ progress: { level: 0, treeLevel: 0 } })
  })

  describe('Estado inicial', () => {
    it('inicia com zero etapas quando dia não foi completado', () => {
      const { result } = renderHook(() => useHojeSteps())
      expect(result.current.completados.size).toBe(0)
      expect(result.current.todayDone).toBe(false)
    })

    it('inicia com todas as 4 etapas quando dia já foi completado', () => {
      mocks.isTodayCompleted.mockReturnValue(true)
      const { result } = renderHook(() => useHojeSteps())
      expect(result.current.completados.size).toBe(4)
      expect(result.current.todayDone).toBe(true)
    })

    it('expandido inicia como null', () => {
      const { result } = renderHook(() => useHojeSteps())
      expect(result.current.expandido).toBeNull()
    })

    it('playerAberto e lerAberto iniciam como false', () => {
      const { result } = renderHook(() => useHojeSteps())
      expect(result.current.playerAberto).toBe(false)
      expect(result.current.lerAberto).toBe(false)
    })
  })

  describe('toggleEtapa', () => {
    it('adiciona uma etapa ao completados', () => {
      const { result } = renderHook(() => useHojeSteps())
      act(() => { result.current.toggleEtapa('versiculo') })
      expect(result.current.completados.has('versiculo')).toBe(true)
    })

    it('remove uma etapa ao chamar duas vezes', () => {
      const { result } = renderHook(() => useHojeSteps())
      act(() => { result.current.toggleEtapa('versiculo') })
      act(() => { result.current.toggleEtapa('versiculo') })
      expect(result.current.completados.has('versiculo')).toBe(false)
    })

    it('chama vibrateStepComplete ao adicionar etapa', () => {
      const { result } = renderHook(() => useHojeSteps())
      act(() => { result.current.toggleEtapa('passagem') })
      expect(mocks.vibrateStepComplete).toHaveBeenCalledOnce()
    })

    it('não vibra ao remover etapa', () => {
      const { result } = renderHook(() => useHojeSteps())
      act(() => { result.current.toggleEtapa('passagem') })
      mocks.vibrateStepComplete.mockClear()
      act(() => { result.current.toggleEtapa('passagem') })
      expect(mocks.vibrateStepComplete).not.toHaveBeenCalled()
    })

    it('é bloqueado quando todayDone=true (não altera estado)', () => {
      mocks.isTodayCompleted.mockReturnValue(true)
      const { result } = renderHook(() => useHojeSteps())
      const sizeBefore = result.current.completados.size
      act(() => { result.current.toggleEtapa('versiculo') })
      expect(result.current.completados.size).toBe(sizeBefore)
    })

    it('não vibra quando todayDone=true', () => {
      mocks.isTodayCompleted.mockReturnValue(true)
      const { result } = renderHook(() => useHojeSteps())
      act(() => { result.current.toggleEtapa('versiculo') })
      expect(mocks.vibrateStepComplete).not.toHaveBeenCalled()
    })

    it('permite marcar todas as 4 etapas independentemente', () => {
      const { result } = renderHook(() => useHojeSteps())
      const steps = ['versiculo', 'passagem', 'devocional', 'oracao'] as const
      steps.forEach((step) => {
        act(() => { result.current.toggleEtapa(step) })
      })
      expect(result.current.completados.size).toBe(4)
    })
  })

  describe('toggleExpandido', () => {
    it('expande uma etapa', () => {
      const { result } = renderHook(() => useHojeSteps())
      act(() => { result.current.toggleExpandido('devocional') })
      expect(result.current.expandido).toBe('devocional')
    })

    it('fecha ao clicar na mesma etapa duas vezes', () => {
      const { result } = renderHook(() => useHojeSteps())
      act(() => { result.current.toggleExpandido('devocional') })
      act(() => { result.current.toggleExpandido('devocional') })
      expect(result.current.expandido).toBeNull()
    })

    it('troca para outra etapa', () => {
      const { result } = renderHook(() => useHojeSteps())
      act(() => { result.current.toggleExpandido('devocional') })
      act(() => { result.current.toggleExpandido('oracao') })
      expect(result.current.expandido).toBe('oracao')
    })

    it('marca a etapa como completada ao expandir (quando não completada ainda)', () => {
      const { result } = renderHook(() => useHojeSteps())
      act(() => { result.current.toggleExpandido('versiculo') })
      expect(result.current.completados.has('versiculo')).toBe(true)
    })
  })

  describe('handleConcluirDia', () => {
    it('chama completeDay, vibrateDayComplete e dayCompleted', () => {
      const { result } = renderHook(() => useHojeSteps())
      act(() => { result.current.handleConcluirDia() })
      expect(mocks.completeDay).toHaveBeenCalledOnce()
      expect(mocks.vibrateDayComplete).toHaveBeenCalledOnce()
      expect(mocks.dayCompleted).toHaveBeenCalledOnce()
    })

    it('é idempotente: não chama completeDay quando todayDone=true', () => {
      mocks.isTodayCompleted.mockReturnValue(true)
      const { result } = renderHook(() => useHojeSteps())
      act(() => { result.current.handleConcluirDia() })
      expect(mocks.completeDay).not.toHaveBeenCalled()
      expect(mocks.vibrateDayComplete).not.toHaveBeenCalled()
    })

    it('chama vibrateLevelUp quando level sobe', () => {
      vi.useFakeTimers()
      mocks.getState.mockReturnValue({ progress: { level: 1, treeLevel: 0 } })
      const { result } = renderHook(() => useHojeSteps())
      act(() => { result.current.handleConcluirDia() })
      vi.runAllTimers()
      expect(mocks.vibrateLevelUp).toHaveBeenCalledOnce()
      vi.useRealTimers()
    })

    it('chama vibrateTreeEvolve (com prioridade) quando treeLevel sobe', () => {
      vi.useFakeTimers()
      mocks.getState.mockReturnValue({ progress: { level: 1, treeLevel: 1 } })
      const { result } = renderHook(() => useHojeSteps())
      act(() => { result.current.handleConcluirDia() })
      vi.runAllTimers()
      expect(mocks.vibrateTreeEvolve).toHaveBeenCalledOnce()
      expect(mocks.vibrateLevelUp).not.toHaveBeenCalled()
      vi.useRealTimers()
    })

    it('não chama vibrateLevelUp nem vibrateTreeEvolve sem evolução', () => {
      vi.useFakeTimers()
      mocks.getState.mockReturnValue({ progress: { level: 0, treeLevel: 0 } })
      const { result } = renderHook(() => useHojeSteps())
      act(() => { result.current.handleConcluirDia() })
      vi.runAllTimers()
      expect(mocks.vibrateLevelUp).not.toHaveBeenCalled()
      expect(mocks.vibrateTreeEvolve).not.toHaveBeenCalled()
      vi.useRealTimers()
    })
  })

  describe('controles de UI', () => {
    it('setPlayerAberto altera playerAberto', () => {
      const { result } = renderHook(() => useHojeSteps())
      act(() => { result.current.setPlayerAberto(true) })
      expect(result.current.playerAberto).toBe(true)
    })

    it('setLerAberto altera lerAberto', () => {
      const { result } = renderHook(() => useHojeSteps())
      act(() => { result.current.setLerAberto(true) })
      expect(result.current.lerAberto).toBe(true)
    })
  })
})
