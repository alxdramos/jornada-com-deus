import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mocks hoisted — necessário para evitar "Cannot access before initialization"
const { mockSupabase, mockChannel, mockUseAuth } = vi.hoisted(() => {
  const mockChannel = {
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
  }

  const mockBuilder: any = {}
  mockBuilder.from = vi.fn(() => mockBuilder)
  mockBuilder.select = vi.fn(() => mockBuilder)
  mockBuilder.eq = vi.fn(() => mockBuilder)
  mockBuilder.maybeSingle = vi.fn(() => Promise.resolve({ data: null, error: null }))

  const mockSupabase = {
    ...mockBuilder,
    from: mockBuilder.from,
    select: mockBuilder.select,
    eq: mockBuilder.eq,
    maybeSingle: mockBuilder.maybeSingle,
    channel: vi.fn(() => mockChannel),
    removeChannel: vi.fn(),
  }

  const mockUseAuth = vi.fn(() => ({ user: null as null | { id: string; email: string } }))

  return { mockSupabase, mockChannel, mockUseAuth }
})

vi.mock('@/lib/supabase', () => ({ supabase: mockSupabase }))
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => mockUseAuth() }))

import { useSubscription } from '../useSubscription'

const MOCK_USER = { id: 'user-123', email: 'test@example.com' }

describe('useSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({ user: null })
    // Restaurar cadeia de mocks
    mockSupabase.from.mockReturnValue(mockSupabase)
    mockSupabase.select.mockReturnValue(mockSupabase)
    mockSupabase.eq.mockReturnValue(mockSupabase)
    mockSupabase.maybeSingle.mockResolvedValue({ data: null, error: null })
    mockSupabase.channel.mockReturnValue(mockChannel)
  })

  describe('Sem usuário autenticado', () => {
    it('retorna DEFAULT_SUBSCRIPTION quando user é null', async () => {
      const { result } = renderHook(() => useSubscription())
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.subscription.plan).toBe('free')
      expect(result.current.subscription.status).toBeNull()
      expect(result.current.isPlusUser).toBe(false)
    })

    it('não faz chamada ao Supabase quando sem usuário', async () => {
      renderHook(() => useSubscription())
      // Pequena espera para garantir que o efeito rodou
      await new Promise((r) => setTimeout(r, 10))
      expect(mockSupabase.from).not.toHaveBeenCalled()
    })
  })

  describe('isPlusUser', () => {
    it('retorna true quando plan=plus e status=active', async () => {
      mockUseAuth.mockReturnValue({ user: MOCK_USER })
      mockSupabase.maybeSingle.mockResolvedValue({
        data: { plan: 'plus', status: 'active', expires_at: null, hotmart_subscription_id: 'sub-1' },
      })

      const { result } = renderHook(() => useSubscription())
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.isPlusUser).toBe(true)
    })

    it('retorna false quando plan=plus mas status=canceled (degradado para free)', async () => {
      mockUseAuth.mockReturnValue({ user: MOCK_USER })
      mockSupabase.maybeSingle.mockResolvedValue({
        data: { plan: 'plus', status: 'canceled', expires_at: null, hotmart_subscription_id: 'sub-1' },
      })

      const { result } = renderHook(() => useSubscription())
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.isPlusUser).toBe(false)
      expect(result.current.subscription.plan).toBe('free')
    })

    it('retorna false quando plan=free', async () => {
      mockUseAuth.mockReturnValue({ user: MOCK_USER })
      mockSupabase.maybeSingle.mockResolvedValue({
        data: { plan: 'free', status: null, expires_at: null, hotmart_subscription_id: null },
      })

      const { result } = renderHook(() => useSubscription())
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.isPlusUser).toBe(false)
    })

    it('retorna false quando sem dados no Supabase (usuário novo)', async () => {
      mockUseAuth.mockReturnValue({ user: MOCK_USER })
      mockSupabase.maybeSingle.mockResolvedValue({ data: null })

      const { result } = renderHook(() => useSubscription())
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.isPlusUser).toBe(false)
      expect(result.current.subscription.plan).toBe('free')
    })
  })

  describe('isExpired', () => {
    it('retorna true quando expiresAt é no passado', async () => {
      mockUseAuth.mockReturnValue({ user: MOCK_USER })
      const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      mockSupabase.maybeSingle.mockResolvedValue({
        data: { plan: 'plus', status: 'active', expires_at: pastDate, hotmart_subscription_id: null },
      })

      const { result } = renderHook(() => useSubscription())
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.isExpired).toBe(true)
    })

    it('retorna false quando expiresAt é no futuro', async () => {
      mockUseAuth.mockReturnValue({ user: MOCK_USER })
      const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
      mockSupabase.maybeSingle.mockResolvedValue({
        data: { plan: 'plus', status: 'active', expires_at: futureDate, hotmart_subscription_id: null },
      })

      const { result } = renderHook(() => useSubscription())
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.isExpired).toBe(false)
    })

    it('retorna false quando expiresAt é null', async () => {
      mockUseAuth.mockReturnValue({ user: MOCK_USER })
      mockSupabase.maybeSingle.mockResolvedValue({
        data: { plan: 'plus', status: 'active', expires_at: null, hotmart_subscription_id: null },
      })

      const { result } = renderHook(() => useSubscription())
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.isExpired).toBe(false)
    })
  })

  describe('Tratamento de erros', () => {
    it('retorna DEFAULT_SUBSCRIPTION em caso de erro no fetch', async () => {
      mockUseAuth.mockReturnValue({ user: MOCK_USER })
      mockSupabase.maybeSingle.mockRejectedValue(new Error('network error'))

      const { result } = renderHook(() => useSubscription())
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.subscription.plan).toBe('free')
      expect(result.current.isPlusUser).toBe(false)
    })
  })

  describe('Realtime', () => {
    it('cria canal Supabase para o usuário', async () => {
      mockUseAuth.mockReturnValue({ user: MOCK_USER })

      renderHook(() => useSubscription())
      await waitFor(() => expect(mockSupabase.channel).toHaveBeenCalledWith(`subscription-${MOCK_USER.id}`))
    })

    it('chama removeChannel no cleanup', async () => {
      mockUseAuth.mockReturnValue({ user: MOCK_USER })

      const { unmount } = renderHook(() => useSubscription())
      await waitFor(() => expect(mockSupabase.channel).toHaveBeenCalled())
      unmount()
      expect(mockSupabase.removeChannel).toHaveBeenCalled()
    })
  })

  describe('Estado de loading', () => {
    it('inicia com loading=true quando há usuário', () => {
      mockUseAuth.mockReturnValue({ user: MOCK_USER })
      mockSupabase.maybeSingle.mockReturnValue(new Promise(() => {})) // nunca resolve

      const { result } = renderHook(() => useSubscription())
      expect(result.current.loading).toBe(true)
    })
  })
})
