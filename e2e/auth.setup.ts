/**
 * Setup de autenticação para E2E.
 * Executa UMA vez antes dos testes autenticados e salva o storage state.
 *
 * Requer variáveis de ambiente:
 *   E2E_USER_EMAIL — email do usuário de teste
 *   E2E_USER_PASSWORD — senha do usuário de teste
 */
import { test as setup, expect } from '@playwright/test'
import path from 'path'

const AUTH_FILE = path.join(__dirname, '.auth/user.json')

setup('autenticar usuário de teste', async ({ page }) => {
  const email = process.env.E2E_USER_EMAIL
  const password = process.env.E2E_USER_PASSWORD

  if (!email || !password) {
    throw new Error(
      'E2E_USER_EMAIL e E2E_USER_PASSWORD são obrigatórios para o setup de autenticação.\n' +
      'Crie um arquivo .env.e2e ou exporte as variáveis antes de rodar os testes E2E.'
    )
  }

  await page.goto('/login')

  // Preenche o formulário de login
  await page.getByLabel(/e-?mail/i).fill(email)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: /entrar|login/i }).click()

  // Aguarda redirect para fora do /login após autenticação bem-sucedida
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 20_000 })
  await page.waitForTimeout(500)

  // Se o onboarding aparecer, clica por todos os 4 slides
  const step0 = page.getByRole('button', { name: /explorar o app/i })
  if (await step0.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await step0.click()
    await page.waitForTimeout(400)
    // Step 1: Features — "Continuar"
    const step1 = page.getByRole('button', { name: /^continuar$/i })
    if (await step1.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await step1.click()
      await page.waitForTimeout(400)
    }
    // Step 2: Notifications — "Agora não"
    const step2 = page.getByRole('button', { name: /agora não|continuar sem/i })
    if (await step2.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await step2.click()
      await page.waitForTimeout(400)
    }
    // Step 3: Interests — selecionar um interesse + "Começar minha jornada"
    const interest = page.getByRole('button', { name: /paz interior/i })
    if (await interest.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await interest.click()
      await page.waitForTimeout(300)
      const finish = page.getByRole('button', { name: /começar minha jornada/i })
      if (await finish.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await finish.click()
        await page.waitForTimeout(600)
      }
    }
  }

  // Aguarda o loading "Carregando sua jornada..." desaparecer (useAuthSync assíncrono)
  await page.locator('text=Carregando sua jornada').waitFor({ state: 'hidden', timeout: 20_000 }).catch(() => {})

  // Aguarda a navegação principal aparecer
  await expect(
    page.getByRole('navigation')
      .or(page.locator('[role="tablist"]'))
      .or(page.locator('nav'))
  ).toBeVisible({ timeout: 10_000 })

  // Garante que hasCompletedOnboarding está gravado no localStorage antes de salvar o estado
  // (evita race condition entre useAuthSync e a persistência do Zustand)
  await page.evaluate(() => {
    try {
      const raw = localStorage.getItem('user-storage')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.state?.user) {
          parsed.state.user.hasCompletedOnboarding = true
          localStorage.setItem('user-storage', JSON.stringify(parsed))
        }
      }
    } catch { /* ignora */ }
  })

  // Salva o estado de autenticação para reuso
  await page.context().storageState({ path: AUTH_FILE })
})
