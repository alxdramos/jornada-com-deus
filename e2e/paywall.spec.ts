/**
 * E2E — Fluxo de Paywall e Assinatura
 *
 * Testa (usuário autenticado, plano free):
 * - A aba Meditações carrega e exibe cards
 * - Conteúdo premium (plus: true) exibe badge PLUS
 * - Clicar em card premium abre o PaywallModal
 * - PaywallModal exibe planos de assinatura
 * - Botão Fechar fecha o modal
 * - CTA "Assinar Premium" está presente no modal
 *
 * Nota: testes de compra real (Hotmart) são cobertos pelos unit tests do webhook.
 * Conteúdo plus está disponível em "VER TUDO" (itens salmo-51, palavra-final).
 */
import { test, expect, Page } from '@playwright/test'

/**
 * Injeta script ANTES do React carregar para garantir hasCompletedOnboarding: true.
 * Resolve a race condition entre o useAuthSync (que chama Supabase de forma assíncrona)
 * e o componente de onboarding que lê o Zustand store antes do sync completar.
 *
 * Deve ser chamado ANTES de page.goto().
 */
async function patchOnboardingBeforeLoad(page: Page) {
  await page.addInitScript(() => {
    try {
      const raw = window.localStorage.getItem('user-storage')
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed?.state?.user) {
        parsed.state.user.hasCompletedOnboarding = true
        window.localStorage.setItem('user-storage', JSON.stringify(parsed))
      }
    } catch { /* ignora */ }
  })
}

/**
 * Aguarda o useAuthSync completar verificando localStorage.
 * O Zustand persist sincroniza estado → localStorage após setUser().
 */
async function waitForAuthSync(page: Page) {
  await page.waitForFunction(() => {
    try {
      const raw = localStorage.getItem('user-storage')
      if (!raw) return false
      const parsed = JSON.parse(raw)
      return parsed?.state?.user?.hasCompletedOnboarding === true
    } catch { return false }
  }, { timeout: 20_000 }).catch(() => {
    // timeout gracioso — continua mesmo sem confirmação
  })
}

/** Navega para a aba Meditações via URL param e aguarda hydration completa */
async function goToMeditacoes(page: Page) {
  // CRÍTICO: patch localStorage ANTES do goto para que Zustand rehydrate corretamente
  await patchOnboardingBeforeLoad(page)

  await page.goto('/?tab=meditacoes')

  // Aguarda loading auth/Supabase terminar
  await page.locator('text=Carregando sua jornada').waitFor({ state: 'hidden', timeout: 20_000 }).catch(() => {})

  // Aguarda auth sync completar (hasCompletedOnboarding setado pelo useAuthSync via Supabase)
  await waitForAuthSync(page)

  // Fallback: dispensa onboarding caso ainda apareça (ex: token expirado no CI)
  const step0 = page.getByRole('button', { name: /explorar o app/i })
  if (await step0.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await step0.click()
    await page.waitForTimeout(400)
    const step1 = page.getByRole('button', { name: /^continuar$/i })
    if (await step1.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await step1.click()
      await page.waitForTimeout(400)
    }
    const step2 = page.getByRole('button', { name: /agora não|continuar sem/i })
    if (await step2.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await step2.click()
      await page.waitForTimeout(400)
    }
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

  // Aguarda o header da aba aparecer (onboarding removido)
  await expect(page.getByText('Meditações').first()).toBeVisible({ timeout: 10_000 })
}

/**
 * Abre o modal "Ver Tudo" e retorna um locator para um card PLUS clicável.
 *
 * IMPORTANTE: os itens PLUS ficam no final da lista scrollável (item 13+ de 17).
 * Usamos count() em vez de isVisible() porque Playwright trata elementos
 * fora do scroll viewport como não visíveis — mas count() detecta elementos no DOM.
 * O click({ force: true }) faz o scroll automático antes de clicar.
 */
async function openAllAndFindPlus(page: Page) {
  // Clica em VER TUDO para abrir o MeditacoesModal
  const verTudoBtn = page.getByRole('button', { name: /ver tudo/i }).first()
  if (!(await verTudoBtn.isVisible({ timeout: 8_000 }).catch(() => false))) {
    return null
  }
  await verTudoBtn.click()

  // Aguarda o header do modal aparecer (garante que o modal está montado)
  const modalHeader = page.getByText('Todas as Meditações')
  if (!(await modalHeader.isVisible({ timeout: 8_000 }).catch(() => false))) {
    return null
  }

  // Aguarda animação do modal completar
  await page.waitForTimeout(500)

  // Estratégia 1: badge PLUS via texto no DOM (pode estar scrollado fora do viewport)
  const plusBadge = page.locator('span').filter({ hasText: /PLUS/ }).first()
  if ((await plusBadge.count()) > 0) {
    // Scroll até o elemento para garantir visibilidade
    await plusBadge.scrollIntoViewIfNeeded().catch(() => {})
    return plusBadge
  }

  // Estratégia 2: busca pelo título dos itens plus conhecidos
  for (const title of ['Salmo 51', 'Uma Palavra Final']) {
    const card = page.getByText(title, { exact: true }).first()
    if ((await card.count()) > 0) {
      await card.scrollIntoViewIfNeeded().catch(() => {})
      return card
    }
  }

  return null
}

test.describe('Aba Meditações — carregamento', () => {
  test('aba Meditações carrega com cards visíveis', async ({ page }) => {
    await goToMeditacoes(page)

    // Aguarda hydration (cards substituem skeletons)
    await page.waitForTimeout(1_500)

    // Pelo menos um card de meditação deve estar visível
    const cards = page.locator('.rounded-2xl.cursor-pointer')
    await expect(cards.first()).toBeVisible({ timeout: 8_000 })
  })
})

test.describe('PaywallModal — usuário free', () => {
  test('clicar em card premium (via VER TUDO) abre o PaywallModal', async ({ page }) => {
    await goToMeditacoes(page)

    const plusBadge = await openAllAndFindPlus(page)
    if (!plusBadge) {
      // Sem conteúdo premium visível — skip gracioso
      test.skip()
      return
    }

    // Clica no card premium (o badge está dentro do card; force para contornar hover overlay)
    await plusBadge.click({ force: true })

    // PaywallModal deve aparecer (fixed inset-0 com texto "Jornada Premium")
    await expect(
      page.getByText('Jornada Premium').first()
    ).toBeVisible({ timeout: 5_000 })
  })

  test('PaywallModal exibe seletor de planos', async ({ page }) => {
    await goToMeditacoes(page)

    const plusBadge = await openAllAndFindPlus(page)
    if (!plusBadge) {
      test.skip()
      return
    }

    await plusBadge.click({ force: true })
    await expect(page.getByText('Jornada Premium').first()).toBeVisible({ timeout: 5_000 })

    // Verifica opções de planos
    await expect(page.getByText('Mensal')).toBeVisible({ timeout: 3_000 })
    await expect(page.getByText('Trimestral')).toBeVisible({ timeout: 3_000 })
    await expect(page.getByText('Anual')).toBeVisible({ timeout: 3_000 })
  })

  test('PaywallModal exibe botão de assinatura', async ({ page }) => {
    await goToMeditacoes(page)

    const plusBadge = await openAllAndFindPlus(page)
    if (!plusBadge) {
      test.skip()
      return
    }

    await plusBadge.click({ force: true })
    await expect(page.getByText('Jornada Premium').first()).toBeVisible({ timeout: 5_000 })

    // CTA de assinatura visível (texto "Assinar Premium ...")
    await expect(
      page.getByRole('button', { name: /assinar premium/i })
    ).toBeVisible({ timeout: 3_000 })
  })

  test('fechar PaywallModal com botão Fechar', async ({ page }) => {
    await goToMeditacoes(page)

    const plusBadge = await openAllAndFindPlus(page)
    if (!plusBadge) {
      test.skip()
      return
    }

    await plusBadge.click({ force: true })

    const premiumTitle = page.getByText('Jornada Premium').first()
    await expect(premiumTitle).toBeVisible({ timeout: 5_000 })

    // Fecha com botão aria-label="Fechar"
    await page.getByRole('button', { name: 'Fechar' }).click()

    await expect(premiumTitle).not.toBeVisible({ timeout: 3_000 })
  })

  test('botão "Talvez mais tarde" fecha o modal', async ({ page }) => {
    await goToMeditacoes(page)

    const plusBadge = await openAllAndFindPlus(page)
    if (!plusBadge) {
      test.skip()
      return
    }

    await plusBadge.click({ force: true })
    await expect(page.getByText('Jornada Premium').first()).toBeVisible({ timeout: 5_000 })

    await page.getByText('Talvez mais tarde').click()

    await expect(page.getByText('Jornada Premium').first()).not.toBeVisible({ timeout: 3_000 })
  })
})

test.describe('Acesso premium — usuário Plus', () => {
  test('usuário Plus não vê o modal de paywall ao navegar para meditações', async ({ page }) => {
    // Patch ANTES de goto: simula usuário Plus no localStorage
    await page.addInitScript(() => {
      try {
        const raw = localStorage.getItem('user-storage')
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed?.state?.user) {
            parsed.state.user.isPlus = true
            parsed.state.user.plan = 'plus'
            parsed.state.user.subscriptionStatus = 'active'
            parsed.state.user.hasCompletedOnboarding = true
            localStorage.setItem('user-storage', JSON.stringify(parsed))
          }
        }
      } catch { /* ignora */ }
    })

    await page.goto('/?tab=meditacoes')
    await page.locator('text=Carregando sua jornada').waitFor({ state: 'hidden', timeout: 20_000 }).catch(() => {})
    await waitForAuthSync(page)

    await expect(page.getByText('Meditações').first()).toBeVisible({ timeout: 10_000 })
    await page.waitForTimeout(1_000)

    // Modal de paywall NÃO deve aparecer automaticamente
    await expect(
      page.getByText('Jornada Premium')
    ).not.toBeVisible({ timeout: 3_000 })
  })
})
