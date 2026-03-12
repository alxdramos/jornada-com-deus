/**
 * Script único: cria conta de teste no Supabase via /register
 * Executar uma vez para preparar o ambiente E2E.
 */
import { chromium } from '@playwright/test'

const EMAIL = 'e2e-test@jornadadeus.dev'
const PASSWORD = 'E2eTest@2026!'
const NAME = 'Usuário E2E'

;(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.WSL_DISTRO_NAME
      ? undefined
      : undefined,
  })
  const page = await browser.newPage()

  console.log('→ Acessando /register...')
  await page.goto('http://localhost:3000/register')
  await page.waitForLoadState('networkidle')

  // Preenche o formulário de registro
  const nameInput = page.getByLabel(/nome/i).first()
  if (await nameInput.isVisible()) {
    await nameInput.fill(NAME)
  }

  await page.getByLabel(/e-?mail/i).fill(EMAIL)
  await page.locator('input[type="password"]').first().fill(PASSWORD)

  // Confirmar senha (se existir campo)
  const confirmPassword = page.locator('input[type="password"]').nth(1)
  if (await confirmPassword.isVisible({ timeout: 1000 }).catch(() => false)) {
    await confirmPassword.fill(PASSWORD)
  }

  console.log('→ Submetendo formulário...')
  await page.getByRole('button', { name: /cadastrar|criar|registrar/i }).click()

  // Aguarda resultado
  await page.waitForTimeout(3000)

  const url = page.url()
  const bodyText = await page.locator('body').innerText()

  console.log('URL após submit:', url)

  if (url.includes('/') && !url.includes('/register')) {
    console.log('✓ Conta criada e login realizado com sucesso!')
    console.log(`  Email: ${EMAIL}`)
    console.log(`  Senha: ${PASSWORD}`)
  } else if (bodyText.toLowerCase().includes('email') && bodyText.toLowerCase().includes('confirm')) {
    console.log('✓ Conta criada — confirme o email no Supabase (ou desative email confirmation nas settings)')
    console.log(`  Email: ${EMAIL}`)
    console.log(`  Senha: ${PASSWORD}`)
  } else {
    console.log('⚠ Resultado incerto. Texto na página:', bodyText.substring(0, 300))
    // Tira screenshot para diagnóstico
    await page.screenshot({ path: '/tmp/register-result.png' })
    console.log('Screenshot salvo em /tmp/register-result.png')
  }

  await browser.close()
})()
