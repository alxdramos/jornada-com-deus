import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// ─── Supabase mock ────────────────────────────────────────────────────────────
const supabaseMock: any = {
  from: vi.fn(() => supabaseMock),
  select: vi.fn(() => supabaseMock),
  insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
  upsert: vi.fn(() => Promise.resolve({ data: null, error: null })),
  update: vi.fn(() => supabaseMock),
  eq: vi.fn(() => supabaseMock),
  maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
  // Thenable: permite await na cadeia (ex: await supabase.from().update().eq())
  then: (resolve: (val: any) => any) =>
    Promise.resolve({ data: null, error: null }).then(resolve),
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => supabaseMock),
}))

// ─── Importações após os mocks ────────────────────────────────────────────────
import { detectPlanInterval, calcExpiresAt, timingSafeCompare } from '../utils'
import { POST, GET } from '../route'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const VALID_HOTTOK = 'test-valid-hottok'
const SUPABASE_URL = 'https://test.supabase.co'
const SUPABASE_KEY = 'test-service-role-key'

function makeRequest(
  body: object,
  headers: Record<string, string> = {}
): NextRequest {
  return new NextRequest('http://localhost/api/webhooks/hotmart', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      hottok: VALID_HOTTOK,
      ...headers,
    }),
    body: JSON.stringify(body),
  })
}

const PURCHASE_APPROVED_PAYLOAD = {
  id: 'evt-001',
  creation_date: Date.now(),
  event: 'PURCHASE_APPROVED',
  version: '2.0.0',
  data: {
    product: { id: '123', name: 'Jornada Plus' },
    purchase: {
      transaction: 'TXN-001',
      status: 'approved',
      payment: { value: 29.9, currency_value: 'BRL', type: 'CREDIT_CARD' },
    },
    buyer: { name: 'João Silva', email: 'joao@example.com' },
    subscription: { subscriber: { code: 'SUB-001' }, plan: { name: 'Mensal' } },
  },
}

// ─── Testes das funções puras ─────────────────────────────────────────────────
describe('detectPlanInterval', () => {
  it('retorna "mensal" por padrão quando sem nome de plano', () => {
    expect(detectPlanInterval()).toBe('mensal')
    expect(detectPlanInterval('')).toBe('mensal')
    expect(detectPlanInterval('Plano Básico')).toBe('mensal')
  })

  it('retorna "anual" para planos anuais', () => {
    expect(detectPlanInterval('Plano Anual')).toBe('anual')
    expect(detectPlanInterval('annual plan')).toBe('anual')
    expect(detectPlanInterval('12 meses')).toBe('anual')
  })

  it('retorna "trimestral" para planos trimestrais', () => {
    expect(detectPlanInterval('Plano Trimestral')).toBe('trimestral')
    expect(detectPlanInterval('quarterly subscription')).toBe('trimestral')
    expect(detectPlanInterval('3 meses')).toBe('trimestral')
    expect(detectPlanInterval('plano 3mes')).toBe('trimestral')
  })

  it('é case-insensitive', () => {
    expect(detectPlanInterval('ANUAL')).toBe('anual')
    expect(detectPlanInterval('TRIMESTRAL')).toBe('trimestral')
  })
})

describe('calcExpiresAt', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('mensal retorna ~35 dias à frente', () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const result = calcExpiresAt('mensal')
    const diff = new Date(result).getTime() - Date.now()
    const diffDays = diff / (1000 * 60 * 60 * 24)
    expect(diffDays).toBeCloseTo(35, 0)
  })

  it('trimestral retorna ~95 dias à frente', () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const result = calcExpiresAt('trimestral')
    const diff = new Date(result).getTime() - Date.now()
    const diffDays = diff / (1000 * 60 * 60 * 24)
    expect(diffDays).toBeCloseTo(95, 0)
  })

  it('anual retorna ~370 dias à frente', () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const result = calcExpiresAt('anual')
    const diff = new Date(result).getTime() - Date.now()
    const diffDays = diff / (1000 * 60 * 60 * 24)
    expect(diffDays).toBeCloseTo(370, 0)
  })

  it('retorna string ISO válida', () => {
    const result = calcExpiresAt('mensal')
    expect(() => new Date(result)).not.toThrow()
    expect(new Date(result).toISOString()).toBe(result)
  })
})

describe('timingSafeCompare', () => {
  it('retorna true para strings idênticas', () => {
    expect(timingSafeCompare('abc123', 'abc123')).toBe(true)
  })

  it('retorna false para strings diferentes', () => {
    expect(timingSafeCompare('abc123', 'abc124')).toBe(false)
  })

  it('retorna false para strings de comprimento diferente', () => {
    expect(timingSafeCompare('abc', 'abcd')).toBe(false)
  })

  it('retorna false quando uma string é vazia', () => {
    expect(timingSafeCompare('', 'abc')).toBe(false)
    expect(timingSafeCompare('abc', '')).toBe(false)
  })

  it('retorna true para strings vazias iguais', () => {
    expect(timingSafeCompare('', '')).toBe(true)
  })
})

// ─── Testes do handler POST ───────────────────────────────────────────────────
describe('POST /api/webhooks/hotmart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('HOTMART_HOTTOK', VALID_HOTTOK)
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', SUPABASE_URL)
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', SUPABASE_KEY)

    // Restaurar cadeia de mocks
    supabaseMock.from.mockReturnValue(supabaseMock)
    supabaseMock.select.mockReturnValue(supabaseMock)
    supabaseMock.update.mockReturnValue(supabaseMock)
    supabaseMock.eq.mockReturnValue(supabaseMock)
    supabaseMock.maybeSingle.mockResolvedValue({ data: null, error: null })
    supabaseMock.insert.mockResolvedValue({ data: null, error: null })
    supabaseMock.upsert.mockResolvedValue({ data: null, error: null })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('Segurança: HOTTOK', () => {
    it('retorna 500 quando HOTMART_HOTTOK não está configurado', async () => {
      vi.stubEnv('HOTMART_HOTTOK', '')
      const req = makeRequest(PURCHASE_APPROVED_PAYLOAD)
      const res = await POST(req)
      expect(res.status).toBe(500)
    })

    it('retorna 401 quando HOTTOK está ausente', async () => {
      const req = new NextRequest('http://localhost/api/webhooks/hotmart', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(PURCHASE_APPROVED_PAYLOAD),
      })
      const res = await POST(req)
      expect(res.status).toBe(401)
    })

    it('retorna 401 quando HOTTOK é inválido', async () => {
      const req = makeRequest(PURCHASE_APPROVED_PAYLOAD, { hottok: 'wrong-token' })
      const res = await POST(req)
      expect(res.status).toBe(401)
    })
  })

  describe('Segurança: HMAC (opcional)', () => {
    it('retorna 401 quando HMAC secret está configurado mas header ausente', async () => {
      vi.stubEnv('HOTMART_WEBHOOK_SECRET', 'my-secret')
      const req = makeRequest(PURCHASE_APPROVED_PAYLOAD)
      const res = await POST(req)
      expect(res.status).toBe(401)
      vi.unstubAllEnvs()
      vi.stubEnv('HOTMART_HOTTOK', VALID_HOTTOK)
    })
  })

  describe('Validação de payload', () => {
    it('retorna 400 para body inválido (não é JSON)', async () => {
      const req = new NextRequest('http://localhost/api/webhooks/hotmart', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json', hottok: VALID_HOTTOK }),
        body: 'not-json',
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })
  })

  describe('Rate limiting', () => {
    it('retorna 429 após exceder 30 requisições por minuto do mesmo IP', async () => {
      // Usa IP único para não interferir com outros testes
      const testIp = `192.168.99.99`
      const makeRateLimitedReq = () =>
        new NextRequest('http://localhost/api/webhooks/hotmart', {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
            hottok: VALID_HOTTOK,
            'x-forwarded-for': testIp,
          }),
          body: JSON.stringify(PURCHASE_APPROVED_PAYLOAD),
        })

      // Processar 30 requisições (deve passar)
      for (let i = 0; i < 30; i++) {
        supabaseMock.maybeSingle.mockResolvedValue({ data: null })
        supabaseMock.insert.mockResolvedValue({ error: null })
        await POST(makeRateLimitedReq())
      }

      // A 31ª deve ser rejeitada
      const res = await POST(makeRateLimitedReq())
      expect(res.status).toBe(429)

      const body = await res.json()
      expect(body.error).toBe('Too Many Requests')
    })
  })

  describe('Fluxo principal: PURCHASE_APPROVED', () => {
    it('retorna 200 com evento e status quando processado com sucesso', async () => {
      supabaseMock.maybeSingle
        .mockResolvedValueOnce({ data: null }) // idempotência: sem transação duplicada
        .mockResolvedValueOnce({ data: { id: 'profile-id' } }) // busca perfil

      const req = makeRequest(PURCHASE_APPROVED_PAYLOAD, { 'x-forwarded-for': '10.0.0.1' })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.received).toBe(true)
      expect(body.event).toBe('PURCHASE_APPROVED')
      expect(body.status).toBe('active')
    })

    it('chama upsert em subscriptions para PURCHASE_APPROVED', async () => {
      supabaseMock.maybeSingle
        .mockResolvedValueOnce({ data: null })
        .mockResolvedValueOnce({ data: { id: 'profile-id' } })

      const req = makeRequest(PURCHASE_APPROVED_PAYLOAD, { 'x-forwarded-for': '10.0.0.2' })
      await POST(req)

      expect(supabaseMock.upsert).toHaveBeenCalled()
    })
  })

  describe('Idempotência', () => {
    it('ignora transação já processada (already_processed)', async () => {
      // Primeira chamada: maybeSingle retorna transação existente com processed=true
      supabaseMock.maybeSingle.mockResolvedValueOnce({
        data: { id: 'log-id', processed: true },
      })

      const req = makeRequest(PURCHASE_APPROVED_PAYLOAD, { 'x-forwarded-for': '10.0.0.3' })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.note).toBe('already_processed')
      // Não deve ter chamado upsert (não reprocessou)
      expect(supabaseMock.upsert).not.toHaveBeenCalled()
    })
  })

  describe('Cancelamento e reembolso', () => {
    const makeCancellationPayload = (event: string) => ({
      ...PURCHASE_APPROVED_PAYLOAD,
      event,
      data: {
        ...PURCHASE_APPROVED_PAYLOAD.data,
        subscription: {
          subscriber: { code: 'SUB-001' },
          status: 'canceled',
        },
      },
    })

    it('processa PURCHASE_CANCELED retornando status=canceled', async () => {
      supabaseMock.maybeSingle
        .mockResolvedValueOnce({ data: null })
        .mockResolvedValueOnce({ data: { id: 'profile-id' } })

      const req = makeRequest(makeCancellationPayload('PURCHASE_CANCELED'), {
        'x-forwarded-for': '10.0.0.4',
      })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.status).toBe('canceled')
    })

    it('processa PURCHASE_REFUNDED retornando status=refunded', async () => {
      supabaseMock.maybeSingle
        .mockResolvedValueOnce({ data: null })
        .mockResolvedValueOnce({ data: { id: 'profile-id' } })

      const req = makeRequest(
        { ...PURCHASE_APPROVED_PAYLOAD, event: 'PURCHASE_REFUNDED' },
        { 'x-forwarded-for': '10.0.0.5' }
      )
      const res = await POST(req)
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.status).toBe('refunded')
    })
  })

  describe('Eventos desconhecidos', () => {
    it('retorna 200 com note=evento_ignorado para eventos não tratados', async () => {
      supabaseMock.maybeSingle
        .mockResolvedValueOnce({ data: null })

      const req = makeRequest(
        { ...PURCHASE_APPROVED_PAYLOAD, event: 'UNKNOWN_EVENT' },
        { 'x-forwarded-for': '10.0.0.6' }
      )
      const res = await POST(req)
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.note).toBe('evento_ignorado')
    })
  })
})

// ─── GET health check ─────────────────────────────────────────────────────────
describe('GET /api/webhooks/hotmart', () => {
  it('retorna status ok', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('ok')
  })
})
