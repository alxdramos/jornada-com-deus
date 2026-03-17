import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock })

// Mock fetch
const fetchMock = vi.fn().mockResolvedValue({ ok: true })
global.fetch = fetchMock

import { useAnalytics } from '../useAnalytics'

describe('useAnalytics', () => {
  beforeEach(() => {
    sessionStorageMock.clear()
    fetchMock.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('trackEvent dispara fetch para /api/analytics/track', () => {
    const { result } = renderHook(() => useAnalytics())
    act(() => {
      result.current.trackEvent('test_event', { foo: 'bar' })
    })
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/analytics/track',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    )
  })

  it('inclui event_name e properties no body', () => {
    const { result } = renderHook(() => useAnalytics())
    act(() => {
      result.current.trackEvent('meditation_started', { id: '42', title: 'Paz' })
    })
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.event_name).toBe('meditation_started')
    expect(body.properties).toEqual({ id: '42', title: 'Paz' })
  })

  it('inclui session_id gerado no sessionStorage', () => {
    const { result } = renderHook(() => useAnalytics())
    act(() => {
      result.current.trackEvent('test_event')
    })
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(typeof body.session_id).toBe('string')
    expect(body.session_id.length).toBeGreaterThan(0)
  })

  it('session_id é reutilizado na mesma sessão', () => {
    const { result } = renderHook(() => useAnalytics())
    act(() => {
      result.current.trackEvent('event_a')
      result.current.trackEvent('event_b')
    })
    const sid1 = JSON.parse(fetchMock.mock.calls[0][1].body).session_id
    const sid2 = JSON.parse(fetchMock.mock.calls[1][1].body).session_id
    expect(sid1).toBe(sid2)
  })

  it('trackMeditationStarted dispara com event correto', () => {
    const { result } = renderHook(() => useAnalytics())
    act(() => {
      result.current.trackMeditationStarted('m1', 'Paz Interior')
    })
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.event_name).toBe('meditation_started')
    expect(body.properties).toEqual({ id: 'm1', title: 'Paz Interior' })
  })

  it('trackPrayerStarted dispara com event correto', () => {
    const { result } = renderHook(() => useAnalytics())
    act(() => {
      result.current.trackPrayerStarted('p1', 'Oração da Manhã')
    })
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.event_name).toBe('prayer_started')
    expect(body.properties).toEqual({ id: 'p1', title: 'Oração da Manhã' })
  })

  it('trackPaywallShown dispara com source correto', () => {
    const { result } = renderHook(() => useAnalytics())
    act(() => {
      result.current.trackPaywallShown('tab_meditacoes')
    })
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.event_name).toBe('paywall_shown')
    expect(body.properties.source).toBe('tab_meditacoes')
  })

  it('trackPurchaseClicked dispara com plano correto', () => {
    const { result } = renderHook(() => useAnalytics())
    act(() => {
      result.current.trackPurchaseClicked('trimestral')
    })
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.event_name).toBe('purchase_clicked')
    expect(body.properties.plan).toBe('trimestral')
  })

  it('não lança erro se fetch falhar (fire-and-forget)', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'))
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { result } = renderHook(() => useAnalytics())
    await act(async () => {
      result.current.trackEvent('test_event')
      await new Promise((r) => setTimeout(r, 0))
    })
    expect(warnSpy).toHaveBeenCalledWith(
      '[analytics] erro silenciado:',
      expect.any(Error)
    )
  })
})
