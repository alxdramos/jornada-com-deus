import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60_000, // 60s por teste (Supabase auth calls podem demorar)
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    // No WSL2, usa o Chrome do Windows para evitar dependências de sistema faltantes
    ...(process.env.WSL_DISTRO_NAME ? {
      executablePath: '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
    } : {}),
  },

  projects: [
    // Projeto de setup: faz login uma vez e salva o estado de auth
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: process.env.WSL_DISTRO_NAME ? {
        launchOptions: {
          executablePath: '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
        },
      } : {},
    },

    // Testes autenticados (reutilizam o estado de auth)
    {
      name: 'chromium',
      testIgnore: [/auth\.unauth\.spec\.ts/, /paywall\.spec\.ts/],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Testes móveis (PWA Android)
    {
      name: 'mobile-android',
      testIgnore: [/paywall\.spec\.ts/, /auth\.unauth\.spec\.ts/],
      use: {
        ...devices['Pixel 5'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Testes de paywall — requerem auth para acessar a aba Meditações
    {
      name: 'paywall',
      testMatch: /paywall\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Testes sem autenticação (login, paywall anônimo)
    {
      name: 'unauthenticated',
      testMatch: /.*\.unauth\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Inicia o servidor Next.js automaticamente para testes locais
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
