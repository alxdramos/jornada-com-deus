# Jornada com Deus

> **PWA devocional cristã — completa e funcional em produção.** Cultivar um relacionamento mais profundo com Deus através de práticas espirituais diárias, conteúdo em áudio, gamificação e sincronização multi-device.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Auth-Supabase-green)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Instalável-orange)](https://web.dev/progressive-web-apps/)

**App em produção:** [app.minhajornadadiaria.com.br](https://app.minhajornadadiaria.com.br)
**Site de apresentação:** [minhajornadadiaria.com.br](https://minhajornadadiaria.com.br)

---

## Visão do Produto

**Jornada com Deus** é uma PWA para cristãos que desejam cultivar hábito diário de intimidade com Deus.

- **Foco:** rotina espiritual diária — devocional, oração, meditação, Bíblia, diário
- **Sensação visual:** paz, leveza, minimalismo acolhedor
- **Paleta:** fundo `#FAF9F6`, primary `#FB923C` (laranja), accent `#10B981` (verde), texto `#1F2937`
- **Dark mode:** disponível (paleta marrom-quente `#1A1714` — não azul frio)
- **Freemium:** conteúdo base gratuito + áudio narrado = tier Plus
- **Gamificação:** streak diário, XP (+100/dia), níveis, **Árvore da Vida** (11 estágios visuais), feedback háptico e animação de evolução
- **Offline-first:** funciona sem internet via IndexedDB + Service Worker

---

## Stack Técnica

### Core

| Tecnologia | Uso |
|---|---|
| **Next.js 15** (App Router) | Framework principal — SSR, SSG, API routes, Server Actions |
| **React 19** | UI com `useActionState` (React 19 nativo) |
| **TypeScript 5** (strict) | Tipagem obrigatória em todo o projeto |
| **Tailwind CSS 4** | Estilização utilitária |

### UI / Animações

| Tecnologia | Uso |
|---|---|
| **shadcn/ui** | Componentes base (Button, Card, Dialog, etc.) |
| **Radix UI** | Primitivos acessíveis |
| **Framer Motion** | Animações e transições suaves em todo o app |
| **Lucide React** | Ícones |
| **Sonner** | Toast notifications |

### Autenticação e Backend

| Tecnologia | Uso |
|---|---|
| **Supabase Auth** | Google OAuth + E-mail/Senha + confirmação de e-mail |
| **Supabase Database** | PostgreSQL com RLS + Realtime subscriptions |
| **Supabase Client (browser)** | `src/lib/supabase.ts` — lazy init |
| **Supabase Client (server)** | `src/lib/supabase-server.ts` — factory com cookies |

### Estado e Persistência

| Tecnologia | Uso |
|---|---|
| **Zustand 5** | Estado global (com `persist` middleware → localStorage) |
| **Dexie 4** (IndexedDB) | Banco offline no browser — 6 tabelas |
| **Supabase Realtime** | Sync multi-device em tempo real (progress, favorites) |

### PWA / Performance

| Tecnologia | Uso |
|---|---|
| **Service Worker customizado** | `public/sw.js` — estratégias CacheFirst/NetworkFirst/StaleWhileRevalidate |
| **Background Sync API** | Sincronização de dados offline quando volta online |
| **Web Push (VAPID)** | Notificações push nativas no navegador |
| **web-push** | Biblioteca Node.js para envio de notificações |
| **Vercel Cron Jobs** | Disparo automático 3× ao dia (7h, 12h, 20h Brasília) |
| **next/image** | Otimização automática de imagens — WebP/AVIF |

### APIs Externas e CDN

| Serviço | Uso |
|---|---|
| **Supabase Cloud** | Database, Auth, Realtime, Storage |
| **Cloudflare R2** | CDN de áudios MP3 (meditações, orações, estudos) |
| **bible-api.com** | Bíblia Almeida Corrigida Fiel (online-only) |
| **Unsplash** | Imagens hero nas telas de login/cadastro |
| **Google OAuth** | Login social |
| **Vercel** | Deploy automático (push → produção) |

---

## Abas do App (9 tabs)

| Tab | Componente | Conteúdo |
|---|---|---|
| **Hoje** | `TabHoje.tsx` | 4 etapas diárias + gamificação (XP/streak/árvore) |
| **Explorar** | `TabExplorar.tsx` | Hub de navegação — cards para todas as seções |
| **Meditações** | `TabMeditacoes.tsx` | 17 meditações com áudio + imagens espirituais únicas |
| **Estudos Bíblicos** | `TabEstudos.tsx` | 21 estudos com áudio + imagens espirituais únicas |
| **Bíblia** | `TabBiblia.tsx` | 66 livros, busca, navegação AT/NT via bible-api.com |
| **Orações** | `TabOracoes.tsx` | 40+ orações com áudio + criação personalizada |
| **Diário** | `TabDiario.tsx` | 4 tipos de entrada espiritual + busca + tags |
| **Devocional** | `TabDevocional.tsx` | Devocionais diários com versículo e reflexão |
| **Kids** | `TabKids.tsx` | Conteúdo adaptado para crianças |

---

## Features Implementadas

### Autenticação (Supabase)
- Google OAuth com foto real no avatar
- Login e-mail + senha com confirmação de e-mail
- Cadastro com campo nome completo obrigatório
- Link de confirmação aponta para `app.minhajornadadiaria.com.br` (não localhost)
- Mensagem específica para e-mail não confirmado
- Middleware de proteção de rotas (SSR cookies)
- `AuthContext` + `useAuthSync` (Supabase → Zustand → Dexie)
- Callback `/auth/callback` para Google OAuth e e-mail confirm

### Banco de Dados Supabase (Migrations aplicadas)
- `001_create_auth_tables.sql` — users, accounts, sessions
- `20260223_sync_offline_data.sql` — prayers, journal_entries (offline-first)
- `20260224_bible_verses.sql` — bible_verses com full-text search
- `20260224_user_progress_favorites.sql` — user_progress, user_favorites
- `20260224_enable_realtime_rls_consolidation.sql` — RLS idempotente + Realtime
- `20260226_payment_system.sql` — subscriptions + hotmart_webhook_logs + colunas plan/expires_at em profiles + trigger sync_profile_plan
- **RLS ativo** em todas as tabelas (`auth.uid() = user_id`)

### Sync Multi-Device (Tempo Real)
- **Prayers + Journal** — offline-first via `useSyncManager` (Dexie `pending` → Supabase upsert)
- **Progress/XP/Streak/Árvore** — `useSupabaseSync`:
  - Hydrate no login (remoto ganha se tiver mais XP)
  - Push debounced 2s em cada mudança
  - Realtime subscription `postgres_changes` UPDATE
- **Favorites** — `useFavorites`:
  - Hydrate no login (merge com localStorage)
  - Toggle: localStorage imediato + upsert/delete Supabase em background
  - Realtime subscription `postgres_changes` INSERT/DELETE

### PWA Completa
- Instalável em Android e iOS
- Service Worker customizado com 5 estratégias de cache
- **Background Sync** — dados offline sincronizados automaticamente quando volta online
- **Meta tags iOS completas:** `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-touch-icon`, 5 splash screens para todos os modelos de iPhone
- **Manifest PWA otimizado** com screenshots (narrow + wide), shortcuts, display_override
- Página offline com fallback

### Push Notifications (Web Push VAPID)
- **3× ao dia** via Vercel Cron: 7h, 12h, 20h (horário de Brasília)
- Mensagens personalizadas por horário (manhã/tarde/noite)
- Mensagens especiais por dia da semana (segunda-motivação, sexta-reflexão, fim de semana-paz)
- **Deep links** nas notificações: `/?tab=hoje`, `/?tab=meditacoes`, `/?tab=oracoes`
- Botão **"Testar"** no painel admin para disparar push para si mesmo
- Subscription salva no Supabase com `user_id`

### Painel Administrativo (`/admin`)
- Acesso restrito a usuários com `role = 'admin'` via RLS
- **KPIs do app** — usuários ativos, assinantes Premium, métricas de retenção
- **Disparo manual de push** para todos os assinantes + **botão de teste** individual
- **Gestão de assinantes Hotmart** — lista com status (active/canceled/refunded), planos, datas e histórico
- **Logs de webhooks Hotmart** — eventos processados em tempo real (PURCHASE_APPROVED, PURCHASE_REFUNDED, etc.)
- **Listagem completa de usuários** com status de plano e data de cadastro
- Componentes: `KpiCard`, `PushNotificationCard`, `SubscribersTable`, `WebhookLogsTable`, `UsersTable`, `charts/`

### Monetização (Hotmart)
- **Paywall** em conteúdo Premium: meditações, orações e estudos bíblicos com áudio narrado
- **`PaywallModal`** — modal com 3 planos (mensal/trimestral/anual), checkout Hotmart via `NEXT_PUBLIC_HOTMART_CHECKOUT_URL`
- **Webhook Hotmart** — `/api/webhooks/hotmart` valida `HOTTOK`, processa PURCHASE_APPROVED / PURCHASE_REFUNDED / PURCHASE_CANCELED
- **`useSubscription`** — hook com Realtime listener, expõe `isPlusUser` derivado de `plan = 'plus'`
- **Plan sync automático** — trigger SQL sincroniza `profiles.plan = 'plus'` imediatamente após compra aprovada
- **Transições Premium** — `AnimatePresence` com slide direcional entre abas para UX fluido
- **Compartilhamento social nativo** — Árvore da Vida e versículos via Web Share API

### Acessibilidade (WCAG AA)
- **100% WCAG AA** conforme auditoria em `ACCESSIBILITY_CHECKLIST.md` (verificado com axe DevTools)
- Todos os botões e inputs têm `aria-label` ou texto descritivo
- Ícones decorativos com `aria-hidden="true"`, ícones funcionais com `aria-label`
- Razão de contraste ≥ 4.5:1 (texto normal) e ≥ 3:1 (texto grande e componentes de UI)
- Navegação completa por teclado: Tab, Shift+Tab, Enter, Space, Escape, setas direcionais
- `lang="pt-BR"` declarado no `<html>`, semântica HTML correta (`button`, `input`, `label`)
- VoiceOver (iOS/Safari) e TalkBack (Android/Chrome) verificados

### Conteúdo em Áudio (Cloudflare R2)
- 17 meditações guiadas com áudio
- 21 estudos bíblicos com áudio
- 40+ orações com áudio
- Proxy CORS em `/api/audio` para todas as URLs R2

### Imagens Espirituais (geradas por IA)
- **17 imagens únicas** para meditações (aquarela espiritual, luz dourada)
- **21 imagens únicas** para estudos bíblicos (cenas temáticas sem texto)
- **11 imagens** para os estágios da Árvore da Vida
- **6 cards** da aba Explorar
- Todas servidas via `next/image` com WebP/AVIF automático

### Performance (next/image)
- **Todos os `<img>` substituídos** por `next/image` em componentes críticos
- `priority` nas imagens hero de login/register (LCP direto)
- `fill + sizes` nos cards de grid (lazy load automático)
- AVIF e WebP servidos automaticamente conforme suporte do browser
- Avatares Google com `width/height` explícitos + fallback via state (sem manipulação de DOM)

### Dark Mode
- **Light é padrão** — dark mode opcional via botão
- Paleta marrom-quente no dark: `#1A1714` (bg) / `#F0EDE8` (texto)
- Não usa `prefers-color-scheme` automático (escolha explícita do usuário)
- Cor primária laranja mantida igual em ambos os modos
- Persistida em localStorage via `useDarkMode`

### Gamificação
- XP +100 por dia completo (thresholds não-lineares por nível)
- Streak de dias consecutivos
- Nível e treeLevel unificados — ambos derivados do `totalXp` via `getLevelFromXp()`
- **Árvore da Vida** — 11 estágios visuais com thresholds de dias `[0,5,10,18,27,37,48,59,70,80,90]`
- **Animação de evolução** — overlay "Árvore Evoluiu!" com Framer Motion (3.5s) ao subir de estágio
- **Feedback háptico** — `useHaptics` com padrões: `light`, `stepComplete`, `dayComplete`, `levelUp`, `treeEvolve`, `error` (Web Vibration API, fallback silencioso no iOS)
- Persistência: localStorage + Dexie + Supabase Realtime

### Site de Apresentação (`site/`)
- Landing page em `minhajornadadiaria.com.br`
- 8 seções: Navbar, Hero, Missão, Problema/Solução, Recursos, Depoimentos, CTA, Footer
- 3 mockups de telefone com imagens geradas por IA
- Deploy independente via Vercel

---

## Estrutura de Arquivos

```
jornada-com-deus/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Layout raiz + meta tags iOS PWA completas
│   │   ├── page.tsx                    # Entry point (auth guard)
│   │   ├── page-content.tsx            # 9 tabs renderizadas condicionalmente
│   │   ├── globals.css                 # Tailwind + variáveis CSS light/dark
│   │   ├── actions/
│   │   │   └── register.ts             # Server Action de cadastro
│   │   ├── admin/                      # Painel administrativo (role = admin)
│   │   │   ├── layout.tsx              # Guard de admin
│   │   │   ├── page.tsx                # Dashboard admin (KPIs + gráficos)
│   │   │   ├── assinaturas/            # Assinaturas Hotmart + logs de webhook
│   │   │   └── usuarios/               # Lista de usuários com status de plano
│   │   ├── api/
│   │   │   ├── audio/                  # Proxy CORS para áudios Cloudflare R2
│   │   │   ├── push/
│   │   │   │   ├── send/               # Disparo de push (Vercel Cron + manual)
│   │   │   │   └── subscribe/          # Registro de subscription VAPID
│   │   │   ├── admin/push/test/        # Teste de push para o próprio admin
│   │   │   └── webhooks/hotmart/       # Webhook Hotmart (valida HOTTOK + processa compras)
│   │   ├── auth/callback/              # Callback OAuth + confirmação de e-mail
│   │   ├── biblia/sobre/               # Aviso legal da tradução bíblica
│   │   ├── login/                      # Tela de login (Google + e-mail/senha)
│   │   ├── offline/                    # Página fallback offline
│   │   ├── register/                   # Tela de cadastro
│   │   ├── privacidade/                # Política de Privacidade LGPD (SSG)
│   │   └── termos/                     # Termos de Serviço CDC (SSG)
│   ├── components/
│   │   ├── auth/
│   │   │   ├── CredentialsLoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── admin/
│   │   │   ├── KpiCard.tsx             # Card de métricas do dashboard
│   │   │   ├── PushNotificationCard.tsx # Push manual + botão testar
│   │   │   ├── SubscriptionsTable.tsx  # SubscribersTable + WebhookLogsTable (Hotmart)
│   │   │   ├── UsersTable.tsx          # Lista de usuários
│   │   │   ├── Sidebar.tsx             # Navegação lateral admin
│   │   │   ├── Topbar.tsx              # Barra superior admin
│   │   │   └── charts/                 # Componentes de gráficos (Recharts)
│   │   ├── layout/
│   │   │   └── UserHeader.tsx          # Header universal (avatar + ProfileModal)
│   │   ├── providers/
│   │   │   └── SessionProvider.tsx
│   │   ├── tabs/                       # 9 telas das abas principais
│   │   │   ├── TabHoje.tsx
│   │   │   ├── TabExplorar.tsx
│   │   │   ├── TabMeditacoes.tsx
│   │   │   ├── TabEstudos.tsx
│   │   │   ├── TabBiblia.tsx
│   │   │   ├── TabOracoes.tsx
│   │   │   ├── TabDiario.tsx
│   │   │   ├── TabDevocional.tsx
│   │   │   ├── TabKids.tsx
│   │   │   ├── explorar/
│   │   │   │   └── MeditationCard.tsx  # Card meditação c/ next/image
│   │   │   ├── meditacoes/
│   │   │   │   ├── MeditationDetailModalWithPlayer.tsx
│   │   │   │   └── MeditationPlayerBar.tsx
│   │   │   ├── estudos/
│   │   │   │   ├── EstudoCard.tsx
│   │   │   │   ├── EstudoDetailModalWithPlayer.tsx
│   │   │   │   └── EstudoPlayerBar.tsx
│   │   │   ├── oracoes/
│   │   │   │   ├── PrayerCard.tsx      # Card oração c/ next/image
│   │   │   │   ├── PrayerDetailModalWithPlayer.tsx
│   │   │   │   └── PrayerPlayerBar.tsx
│   │   │   └── diario/
│   │   ├── ui/                         # Componentes shadcn/ui customizados
│   │   ├── AuthSyncWrapper.tsx         # Supabase → Zustand → Dexie
│   │   ├── BottomNav.tsx               # Navegação inferior (z-[9999])
│   │   ├── GamificationCard.tsx        # XP / streak / Árvore da Vida
│   │   ├── ImmersiveAudioPlayer.tsx    # Player fullscreen (z-[2000])
│   │   ├── NotificationSheet.tsx       # UI de solicitação de push
│   │   ├── OfflineIndicator.tsx
│   │   ├── ProfileModal.tsx            # Modal perfil c/ next/image avatar
│   │   ├── ServiceWorkerRegistration.tsx # Registro SW + Background Sync tags
│   │   ├── TreeGrowthVisual.tsx        # Visualização 11 estágios da árvore
│   │   └── PaywallModal.tsx            # Modal de planos Premium (Hotmart checkout)
│   ├── stores/
│   │   ├── userStore.ts                # Perfil + plan (free/plus) + subscriptionStatus
│   │   ├── progressStore.ts            # XP, streak, nível, árvore
│   │   ├── tabStore.ts                 # Aba ativa + deep link (?tab=)
│   │   └── oracaoStore.ts              # Estado das orações
│   ├── hooks/
│   │   ├── useAuthSync.ts              # Supabase ↔ Zustand ↔ Dexie
│   │   ├── useBible.ts                 # API bible-api.com + cache sessionStorage
│   │   ├── useDarkMode.ts              # Dark mode via localStorage (light padrão)
│   │   ├── useDiaryStorage.ts
│   │   ├── useFavorites.ts             # Offline-first + sync Supabase + realtime
│   │   ├── useHaptics.ts               # Web Vibration API — padrões de feedback háptico
│   │   ├── useHojeSteps.ts             # Etapas do dia com haptics integrado
│   │   ├── useImageFallback.ts         # Fallback inteligente de imagens por categoria
│   │   ├── useImmersiveAudioPlayer.ts  # Player de áudio fullscreen
│   │   ├── useMeditationPlayer.ts      # Player de meditação
│   │   ├── useOnlineStatus.ts          # Online/offline + wasOffline flag
│   │   ├── usePrayerPlayer.ts          # Player de oração
│   │   ├── usePrayerStorage.ts
│   │   ├── usePushNotifications.ts     # Subscription VAPID + solicitação de permissão
│   │   ├── useSubscription.ts          # Plan status + isPlusUser + Realtime listener
│   │   ├── useSupabaseSync.ts          # Progress sync: hydrate + push debounced + realtime
│   │   ├── useSyncManager.ts           # Offline data → Supabase (prayers + journal)
│   │   └── useToast.ts
│   ├── lib/
│   │   ├── db.ts                       # Dexie IndexedDB (6 tabelas)
│   │   ├── supabase.ts                 # Cliente browser (lazy init)
│   │   ├── supabase-server.ts          # Cliente server (factory com cookies)
│   │   └── utils.ts
│   ├── data/
│   │   ├── estudos.ts                  # 21 estudos bíblicos com áudio R2
│   │   ├── meditacoes.ts               # 17 meditações com áudio R2
│   │   ├── oracoes.ts                  # 40+ orações com áudio R2
│   │   └── ...
│   └── styles/
│       ├── tokens.css                  # Design tokens (cores, espaçamento, tipografia)
│       └── animations.css
├── public/
│   ├── sw.js                           # Service Worker customizado
│   ├── manifest.json                   # PWA manifest (screenshots + shortcuts)
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   ├── icon-logo.png
│   ├── screenshots/                    # 5 screenshots do app (PWA install UI)
│   └── images/
│       ├── tree-stages/                # 11 imagens da Árvore da Vida (IA)
│       ├── meditacoes/                 # 17 imagens de meditações (IA)
│       ├── estudos/                    # 21 imagens de estudos bíblicos (IA)
│       └── explore-cards/              # 6 cards da aba Explorar (IA)
├── supabase/
│   └── migrations/
│       ├── 001_create_auth_tables.sql
│       ├── 20260223_sync_offline_data.sql
│       ├── 20260224_bible_verses.sql
│       ├── 20260224_user_progress_favorites.sql
│       ├── 20260224_enable_realtime_rls_consolidation.sql
│       └── 20260226_payment_system.sql  # subscriptions + hotmart_webhook_logs + plan sync
├── vercel.json                         # Cron jobs: 3x/dia notificações push
├── next.config.ts                      # remotePatterns + AVIF/WebP + SW headers
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## Service Worker — Estratégias de Cache

Arquivo: `public/sw.js` (customizado, sem next-pwa/Workbox)

| Rota | Estratégia | TTL |
|---|---|---|
| `/_next/static/` | CacheFirst | 1 ano |
| `/_next/image` | CacheFirst | 30 dias |
| R2 Cloudflare (áudios) | CacheFirst | 30 dias |
| Google avatares | CacheFirst | 7 dias |
| `/api/bible`, bible-api.com | NetworkFirst | 7 dias |
| Navegação (pages) | NavigationFirst + fallback `/offline` | — |
| Resto | StaleWhileRevalidate | — |

### Background Sync
Quando offline, dados ficam em Dexie com `syncStatus: 'pending'`. Ao voltar online:
1. SW detecta conectividade → dispara tags `background-sync-prayers`, `background-sync-journal`, `sync-progress`
2. SW envia mensagem `BACKGROUND_SYNC` para todos os clients ativos
3. `ServiceWorkerRegistration.tsx` despacha evento `sw-background-sync` no window
4. `useSyncManager` escuta o evento e executa upsert no Supabase

---

## Push Notifications

### Fluxo completo
```
Usuário permite notificação
  → usePushNotifications subscreve VAPID
  → POST /api/push/subscribe → salva em Supabase (user_id + subscription JSON)

Vercel Cron (10h / 15h / 23h UTC)
  → GET /api/push/send
  → Lê todas as subscriptions do Supabase
  → web-push.sendNotification() com mensagem personalizada por horário
  → Notificação com deep link abre a aba correta no app
```

### Mensagens por horário
| UTC | Brasília | Tipo | Deep link |
|---|---|---|---|
| 10h | 7h | Bom dia + motivação | `/?tab=hoje` |
| 15h | 12h | Pausa espiritual | `/?tab=meditacoes` |
| 23h | 20h | Reflexão noturna | `/?tab=oracoes` |

---

## Design System

### Cores (light / dark)

```css
/* Light (padrão) */
--background: #FAF9F6;
--foreground: #1F2937;
--primary:    #FB923C;   /* laranja — igual nos dois modos */
--accent:     #10B981;   /* verde — igual nos dois modos */

/* Dark (opcional) */
--background: #1A1714;   /* marrom escuro quente */
--foreground: #F0EDE8;   /* branco quente */
--card:       #231F1B;
--secondary:  #2E2924;
--border:     #3D3830;
```

### Z-Index (hierarquia)

| Elemento | z-index |
|---|---|
| Conteúdo normal | 0–100 |
| Modais bottom-sheet | z-[1000] |
| ImmersiveAudioPlayer | z-[2000] |
| BottomNav | z-[9999] |
| Dialog overlay (ProfileModal) | z-[9999] |
| Dialog content (ProfileModal) | z-[10000] |

---

## Variáveis de Ambiente

Arquivo: `.env.local` (não commitado)

```env
# Supabase — obrigatório
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Web Push VAPID — obrigatório para notificações
NEXT_PUBLIC_VAPID_PUBLIC_KEY="..."
VAPID_PRIVATE_KEY="..."
VAPID_EMAIL="mailto:contato@minhajornadadiaria.com.br"

# Hotmart — obrigatório para monetização
HOTMART_HOTTOK="..."                                    # Token de validação de webhooks (Dashboard Hotmart)
NEXT_PUBLIC_HOTMART_CHECKOUT_URL="https://pay.hotmart.com/..."   # Link do produto para checkout
```

Gerar chaves VAPID:
```bash
npx web-push generate-vapid-keys
```

---

## Como Executar

```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env.local com as variáveis acima

# 3. Desenvolvimento
npm run dev
# → http://localhost:3000

# 4. Build de produção
npm run build
npm start

# 5. Lint
npm run lint
```

---

## Deploy

| Serviço | URL | Deploy |
|---|---|---|
| **App** | https://app.minhajornadadiaria.com.br | Vercel — automático no push `main` |
| **Site** | https://minhajornadadiaria.com.br | Vercel — `cd site && npx vercel --prod` |
| **Database** | Supabase Cloud | `tmwkizdzulzufpuonhod.supabase.co` |
| **CDN Áudios** | Cloudflare R2 | pub-* buckets (imutável) |
| **Auth redirect** | `/auth/callback` | `app.minhajornadadiaria.com.br` |

> ⚠️ O site (`minhajornadadiaria.com.br`) tem projeto Vercel **separado** do app. Após mexer em `site/`, rodar: `cd site && npx vercel --prod`

---

## Status MVP — 27/02/2026 (atualizado)

### ✅ Implementado e em produção

**Autenticação e Acesso:**
- ✅ Google OAuth + Login e-mail/senha (Supabase Auth)
- ✅ Cadastro com nome completo + confirmação de e-mail
- ✅ Middleware de proteção de rotas (SSR cookies)
- ✅ Callback OAuth + confirm redirect para domínio de produção

**Banco de Dados e Segurança:**
- ✅ PostgreSQL Supabase com 6 migrations aplicadas (incluindo payment_system)
- ✅ RLS ativo em todas as tabelas
- ✅ Realtime publication habilitada

**Sync e Offline:**
- ✅ Offline-first com IndexedDB (Dexie) — prayers, journal, progress
- ✅ Background Sync via Service Worker (sync automático ao voltar online)
- ✅ Realtime multi-device: progress, favorites

**Conteúdo:**
- ✅ 17 meditações guiadas com áudio (Cloudflare R2)
- ✅ 21 estudos bíblicos com áudio (Cloudflare R2)
- ✅ 40+ orações com áudio (Cloudflare R2)
- ✅ Bíblia completa online (66 livros, busca, navegação AT/NT)
- ✅ Devocional diário + Kids

**Gamificação:**
- ✅ XP +100/dia + streak + níveis + Árvore da Vida (11 estágios — thresholds não-lineares)
- ✅ Feedback háptico (`useHaptics`) em cada etapa, dia completo, level up e evolução da árvore
- ✅ Animação de evolução "Árvore Evoluiu!" com overlay Framer Motion (3.5s)
- ✅ Compartilhamento social nativo — Árvore da Vida e versículos via Web Share API
- ✅ Persistência localStorage + Dexie + Supabase Realtime

**PWA:**
- ✅ Instalável em Android e iOS
- ✅ Service Worker customizado (5 estratégias de cache, sem next-pwa/Workbox)
- ✅ Background Sync automático (3 sync tags: prayers, journal, progress)
- ✅ Meta tags iOS completas — `apple-mobile-web-app-capable`, 5 splash screens para diferentes modelos iPhone
- ✅ Manifest com 5 screenshots (narrow + wide), 4 shortcuts, categorias, `display_override`
- ✅ Página offline com fallback

**Push Notifications:**
- ✅ Web Push com VAPID (permissão + subscription salva no Supabase)
- ✅ 3× ao dia via Vercel Cron (7h, 12h, 20h Brasília)
- ✅ Mensagens personalizadas por horário e dia da semana
- ✅ Deep links nas notificações (abre aba correta no app)

**Painel Admin:**
- ✅ Dashboard em `/admin` com KPIs (usuários ativos, assinantes Premium, métricas)
- ✅ Disparo manual de push para todos os assinantes + botão de teste individual
- ✅ Gestão de assinantes Hotmart com status, planos e histórico
- ✅ Logs de webhooks Hotmart em tempo real
- ✅ Listagem completa de usuários
- ✅ Acesso protegido por `role = 'admin'` via RLS

**Monetização (Hotmart):**
- ✅ Paywall em meditações, orações e estudos bíblicos (conteúdo Premium)
- ✅ PaywallModal com 3 planos (mensal/trimestral/anual) + checkout Hotmart
- ✅ Webhook handler `/api/webhooks/hotmart` com validação HOTTOK
- ✅ Sincronização automática de plan via trigger SQL
- ✅ `useSubscription` hook com Realtime listener

**Design e UX:**
- ✅ Light mode como padrão + Dark mode opcional (paleta marrom-quente `#1A1714`)
- ✅ 9 abas com navegação por bottom nav
- ✅ Transições Premium — AnimatePresence com slide direcional entre abas
- ✅ Imagens espirituais únicas geradas por IA para todo o conteúdo
- ✅ `next/image` em todos os componentes (WebP/AVIF automático)
- ✅ Animações Framer Motion em todo o app

**Acessibilidade:**
- ✅ 100% WCAG AA (auditado com axe DevTools — ver `ACCESSIBILITY_CHECKLIST.md`)
- ✅ Navegação completa por teclado, foco visível, semântica HTML correta
- ✅ VoiceOver (iOS) e TalkBack (Android) verificados
- ✅ `lang="pt-BR"`, contraste ≥ 4.5:1, `aria-label` em todos os elementos interativos

**Páginas Legais:**
- ✅ Política de Privacidade (LGPD, SSG)
- ✅ Termos de Serviço (CDC, SSG)

**Site de Apresentação:**
- ✅ Landing page completa em `minhajornadadiaria.com.br`
- ✅ 3 mockups com imagens IA + responsivo desktop/mobile

---

### 🚧 Próximos Passos

**Crescimento de Conteúdo:**
- [ ] Dashboard de progresso espiritual (gráficos semanais/mensais de XP e streak)
- [ ] Planos de leitura bíblica estruturados (21/30/90 dias)
- [ ] Expansão do conteúdo Kids (meditações + estudos infantis)

**Distribuição Nativa:**
- [ ] Build nativo via Capacitor (iOS/Android)
- [ ] Publicação na Google Play Store
- [ ] Publicação na Apple App Store

**Qualidade e Infraestrutura:**
- [ ] Testes E2E com Playwright (fluxos críticos: login, gamificação, push)
- [ ] Cobertura de testes unitários para hooks principais

---

## Licença

Este projeto é **privado** e propriedade intelectual da Jornada com Deus. Todos os direitos reservados.

---

*"Tudo posso naquele que me fortalece." — Filipenses 4:13*
