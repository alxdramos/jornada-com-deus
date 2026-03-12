/**
 * Teste de debug temporário — investiga estado do DOM no modal de meditações
 * REMOVER após debug
 */
import { test, expect } from '@playwright/test'

test('debug: inspeciona DOM do modal de meditações', async ({ page }) => {
  // Patch onboarding antes de carregar
  await page.addInitScript(() => {
    try {
      const raw = window.localStorage.getItem('user-storage')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.state?.user) {
          parsed.state.user.hasCompletedOnboarding = true
          window.localStorage.setItem('user-storage', JSON.stringify(parsed))
        }
      }
    } catch { /* ignora */ }
  })

  await page.goto('/?tab=meditacoes')
  await page.locator('text=Carregando sua jornada').waitFor({ state: 'hidden', timeout: 20_000 }).catch(() => {})

  // Aguarda auth sync
  await page.waitForFunction(() => {
    try {
      const raw = localStorage.getItem('user-storage')
      const p = JSON.parse(raw || '{}')
      return p?.state?.user?.hasCompletedOnboarding === true
    } catch { return false }
  }, { timeout: 20_000 }).catch(() => {})

  await expect(page.getByText('Meditações').first()).toBeVisible({ timeout: 10_000 })

  // Lê o estado do Zustand (user.isPlus)
  const userState = await page.evaluate(() => {
    try {
      const raw = localStorage.getItem('user-storage')
      const p = JSON.parse(raw || '{}')
      return { isPlus: p?.state?.user?.isPlus, plan: p?.state?.user?.plan, hasOnboarding: p?.state?.user?.hasCompletedOnboarding }
    } catch { return null }
  })
  console.log('USER STATE:', JSON.stringify(userState))

  // Clica VER TUDO
  const verTudoBtn = page.getByRole('button', { name: /ver tudo/i }).first()
  await expect(verTudoBtn).toBeVisible({ timeout: 8_000 })
  await verTudoBtn.click()

  // Aguarda modal
  await expect(page.getByText('Todas as Meditações')).toBeVisible({ timeout: 8_000 })
  await page.waitForTimeout(1000)

  // Inspeciona DOM do modal
  const domInfo = await page.evaluate(() => {
    const plusBadges = document.querySelectorAll('span')
    const plusSpans = Array.from(plusBadges).filter(s => s.textContent?.includes('PLUS'))
    const salmo51 = document.querySelector('[title="Salmo 51"]') ||
      Array.from(document.querySelectorAll('*')).find(el => el.textContent?.trim() === 'Salmo 51')

    return {
      totalSpans: plusBadges.length,
      plusSpanCount: plusSpans.length,
      plusSpanTexts: plusSpans.map(s => s.textContent?.trim()).slice(0, 5),
      salmo51Found: !!salmo51,
      totalElements: document.querySelectorAll('*').length,
      // Procura 'Salmo' em todos os elementos
      salmoTextElements: Array.from(document.querySelectorAll('h2, h3, p, span, div'))
        .filter(el => el.childNodes.length === 1 && el.textContent?.includes('Salmo'))
        .map(el => el.textContent?.trim())
        .slice(0, 5)
    }
  })
  console.log('DOM INFO:', JSON.stringify(domInfo, null, 2))

  // Deve ter encontrado Salmo 51
  expect(domInfo.salmo51Found || domInfo.salmoTextElements.some(t => t?.includes('51'))).toBeTruthy()
})
