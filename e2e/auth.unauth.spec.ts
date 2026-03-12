/**
 * E2E — Fluxo de autenticação (sem sessão pré-existente)
 *
 * Testa:
 * - Redirecionamento para /login ao acessar rota protegida
 * - Formulário de login (campos, validação, erro com credenciais inválidas)
 * - Login com sucesso (usuário real ou mock via MSW futuramente)
 * - Página de registro
 */
import { test, expect } from '@playwright/test'

test.describe('Página de Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('load')
  })

  test('exibe o formulário de login', async ({ page }) => {
    await expect(page.getByLabel(/e-?mail/i)).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.getByRole('button', { name: /entrar|login/i })).toBeVisible()
  })

  test('mostra erro ao enviar formulário vazio', async ({ page }) => {
    await page.getByRole('button', { name: /entrar|login/i }).click()
    // Validação HTML5 ou mensagem de erro customizada
    const emailInput = page.getByLabel(/e-?mail/i)
    await expect(emailInput).toBeFocused()
  })

  test('mostra erro com credenciais inválidas', async ({ page }) => {
    await page.getByLabel(/e-?mail/i).fill('invalido@test.com')
    await page.locator('#password').fill('senhaerrada123')
    await page.getByRole('button', { name: /entrar|login/i }).click()

    // Aguarda mensagem de erro aparecer
    await expect(
      page.getByText(/inválid|incorret|não encontrad|error/i)
    ).toBeVisible({ timeout: 8_000 })
  })

  test('possui link para página de registro', async ({ page }) => {
    const registerLink = page.getByRole('link', { name: /criar conta|registrar|cadastr/i })
    await expect(registerLink).toBeVisible()
    await registerLink.click()
    await expect(page).toHaveURL(/register|cadastro/i)
  })
})

test.describe('Página de Registro', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('exibe os campos de registro', async ({ page }) => {
    await expect(page.getByLabel(/nome/i)).toBeVisible()
    await expect(page.getByLabel(/e-?mail/i)).toBeVisible()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
  })

  test('valida email inválido', async ({ page }) => {
    await page.getByLabel(/e-?mail/i).fill('nao-e-email')
    await page.getByRole('button', { name: /cadastrar|criar/i }).click()
    const emailInput = page.getByLabel(/e-?mail/i)
    // Browser valida o formato do email
    const validationMessage = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    )
    expect(validationMessage).not.toBe('')
  })
})

test.describe('Redirecionamentos', () => {
  test('redireciona para /login quando rota protegida é acessada sem sessão', async ({ page }) => {
    // Tenta acessar a home (rota protegida)
    await page.goto('/')
    // Deve redirecionar para login ou exibir tela de login
    await expect(page).toHaveURL(/login/, { timeout: 5_000 })
  })
})
