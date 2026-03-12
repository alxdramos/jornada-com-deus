/**
 * Testes de regressão para normalizeDateStr.
 *
 * Contexto: o bug original usava String(Date).slice(0,10) que retornava
 * "Thu Feb 27" em vez de "2026-02-27", quebrando isTodayCompleted() e
 * fazendo o botão "Confirmar" reaparecer após reload.
 */
import { describe, it, expect } from 'vitest'
import { normalizeDateStr } from '../useAuthSync'

describe('normalizeDateStr', () => {
  describe('Formato correto ISO passado diretamente', () => {
    it('retorna YYYY-MM-DD sem modificação', () => {
      expect(normalizeDateStr('2026-02-27')).toBe('2026-02-27')
    })

    it('retorna datas de fevereiro corretamente (não confunde 28/29)', () => {
      expect(normalizeDateStr('2026-02-28')).toBe('2026-02-28')
    })

    it('retorna datas de dezembro corretamente', () => {
      expect(normalizeDateStr('2025-12-31')).toBe('2025-12-31')
    })
  })

  describe('Formato legado bugado (String(Date).slice(0,10))', () => {
    it('normaliza "Thu Feb 27" para YYYY-MM-DD', () => {
      const result = normalizeDateStr('Thu Feb 27 2026')
      expect(result).toMatch(/^\d{4}-02-27$/)
    })

    it('normaliza "Wed Feb 25" para YYYY-MM-DD', () => {
      const result = normalizeDateStr('Wed Feb 25 2026')
      expect(result).toMatch(/^\d{4}-02-25$/)
    })

    it('normaliza formato ISO completo com hora para apenas data', () => {
      const result = normalizeDateStr('2026-02-27T03:00:00.000Z')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  describe('Valores especiais', () => {
    it('retorna null quando raw é null', () => {
      expect(normalizeDateStr(null)).toBeNull()
    })

    it('retorna null para string vazia (não é null mas pode ocorrer)', () => {
      const result = normalizeDateStr('')
      expect(result).toBeNull()
    })

    it('retorna null para formato inválido que não pode ser parseado', () => {
      expect(normalizeDateStr('data-invalida-xyz')).toBeNull()
    })
  })

  describe('Propriedade crítica: isTodayCompleted não quebra após round-trip', () => {
    it('resultado tem exatamente 10 caracteres no formato correto', () => {
      const result = normalizeDateStr('2026-03-11')
      expect(result).toHaveLength(10)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('resultado é comparável com getTodayStr (mesmo formato)', () => {
      const today = new Date()
      const y = today.getFullYear()
      const m = String(today.getMonth() + 1).padStart(2, '0')
      const d = String(today.getDate()).padStart(2, '0')
      const todayStr = `${y}-${m}-${d}`

      // Simula o bug antigo: serialização de data como string locale
      const legacyBuggedStr = today.toString() // ex: "Wed Mar 11 2026 10:00:00..."
      const normalized = normalizeDateStr(legacyBuggedStr)

      expect(normalized).toBe(todayStr)
    })
  })
})
