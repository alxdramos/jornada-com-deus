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
- **Gamificação:** streak diário, XP (+100/dia + leitura bíblica), níveis, **Árvore da Vida** (11 estágios visuais), feedback háptico e animação de evolução
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
| **Cloudflare R2** | Armazenamento dos áudios MP3 (meditações, orações, estudos) |
| **Cloudflare Workers** | CDN de áudio (`workers/audio-cdn.js`) — opcional, ativa via `NEXT_PUBLIC_AUDIO_CDN_BASE` |
| **Upstash Redis** | Rate limiting distribuído (persiste entre deploys) — ativa via `UPSTASH_REDIS_REST_URL` |
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
| **Meditações** | `TabMeditacoes.tsx` | 28 meditações com áudio + imagens espirituais únicas |
| **Estudos Bíblicos** | `TabEstudos.tsx` | 31 estudos com áudio + imagens espirituais únicas |
| **Bíblia** | `TabBiblia.tsx` | 66 livros, busca, navegação AT/NT + 6 planos de leitura com XP |
| **Orações** | `TabOracoes.tsx` | 47 orações com áudio + criação personalizada |
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
- `20260304_security_fixes.sql` — hardening de segurança adicional
- `20260414_expire_subscriptions.sql` — índice em expires_at + update trigger para 'expired' + view `subscriptions_status`
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
- **Gestão de assinantes** — lista com status (active/expired/canceled), planos, datas e histórico
- **Logs de webhooks** — eventos Herospark e Hotmart processados em tempo real
- **Retenção** — CohortTable + ChurnTrendChart + AtRiskUsersTable
- **Listagem completa de usuários** com status de plano e data de cadastro
- Componentes: `KpiCard`, `PushNotificationCard`, `SubscribersTable`, `WebhookLogsTable`, `UsersTable`, `charts/`

### Monetização (Herospark) — Freemium

- **Modelo Freemium** — 4 itens gratuitos no topo de cada categoria; restante bloqueado para Plus
  - Meditações: 4 gratuitas · 12 Plus | Orações: 4 gratuitas · 43 Plus | Devocionais: 4 gratuitos · 74 Plus | Estudos: 4 gratuitos · 27 Plus
- **`PaywallModal`** — bottom sheet com 3 planos: Mensal R$19,90 · Trimestral R$49,90 (3×) · Anual R$180,00 (12×)
  - Links de checkout Herospark hardcoded · `createPortal` para escapar stacking context · z-index `10050/10051`
- **Webhook Herospark** — `/api/webhooks/herospark?token=TOKEN` — token via query param (timing-safe), rate limit 30 req/min, idempotência por `email+offer_id+data`
  - Detecta plano por `offer_title` ("mensal"/"trimestral"/"anual"), fallback por valor em reais
  - Expiração com buffer: Mensal = 35 dias · Trimestral = 95 dias · Anual = 370 dias
- **Cron de expiração** — `/api/crons/expire-subscriptions` todo dia às 06:00 UTC · marca `status = 'expired'` em lote · trigger SQL reverte `profiles.plan = 'free'`
- **`useSubscription`** — hook com Realtime listener, expõe `isPlusUser` derivado de `plan = 'plus'`
- **Plan sync automático** — trigger SQL `sync_profile_plan` sincroniza `profiles.plan` imediatamente após compra aprovada
- **Webhook legacy Hotmart** — `/api/webhooks/hotmart` mantido para histórico
- **Compartilhamento social nativo** — Árvore da Vida e versículos via Web Share API

### Acessibilidade (WCAG AA)
- **100% WCAG AA** conforme auditoria em `ACCESSIBILITY_CHECKLIST.md` (verificado com axe DevTools)
- Todos os botões e inputs têm `aria-label` ou texto descritivo
- Ícones decorativos com `aria-hidden="true"`, ícones funcionais com `aria-label`
- Razão de contraste ≥ 4.5:1 (texto normal) e ≥ 3:1 (texto grande e componentes de UI)
- Navegação completa por teclado: Tab, Shift+Tab, Enter, Space, Escape, setas direcionais
- `lang="pt-BR"` declarado no `<html>`, semântica HTML correta (`button`, `input`, `label`)
- VoiceOver (iOS/Safari) e TalkBack (Android/Chrome) verificados

### Conteúdo em Áudio (Cloudflare R2 + CDN)
- 28 meditações guiadas com áudio
- 31 estudos bíblicos com áudio
- 47 orações com áudio
- Proxy `/api/audio` com **HTTP Range requests** (seeking/streaming real sem re-download)
- `src/lib/cdn.ts` — `resolveAudioUrl()` usa CDN customizado se `NEXT_PUBLIC_AUDIO_CDN_BASE` estiver configurado, fallback automático para o proxy
- `workers/audio-cdn.js` — Cloudflare Worker pronto para deploy (roteia por prefixo `Med_/Ora_/Est_/Dev_` ao bucket R2 correto)

### Players de Áudio — MediaSession API (lock screen + background)
- **`useMediaSession.ts`** — hook reutilizável para todos os players
- Metadados (título + álbum) transmitidos ao sistema operacional via `MediaMetadata`
- Controles de play/pause/skip na **lock screen** do celular (Android e iOS)
- **Background playback** — áudio continua mesmo com a tela bloqueada
- Atualização de `playbackState` sincronizada com o estado real do player
- Action handlers estáveis via `useCallback` (sem re-registro infinito)
- Integrado em `usePrayerPlayer`, `useMeditationPlayer` e via ambos nos 3 modais

### Onboarding Flow
- 4 slides animados com Framer Motion (`x` slide transitions)
- Slide 1: Boas-vindas, Slide 2: Recursos, Slide 3: Interesses espirituais, Slide 4: Notificações
- Seleção de interesses com chips multi-select e persistência em Supabase
- Solicitação de permissão de notificações integrada no slide final
- Fluxo disparado automaticamente no primeiro login (campo `onboarding_completed` em profiles)

### Observabilidade (Sentry)
- Sentry SDK integrado no Next.js 15 (app + server + edge)
- Captura automática de erros em produção com stack trace completo
- Error Boundaries nos componentes críticos do app
- Rota `/api/sentry-test` usada para validar a integração (removida após validação)

### Imagens Espirituais (geradas por IA)
- **17 imagens únicas** para meditações em `public/images/meditacoes/` (aquarela espiritual, luz dourada) — novas meditações herdam fallback dinâmico
- **21 imagens únicas** para estudos bíblicos em `public/images/estudos/` (cenas temáticas sem texto) — novos estudos herdam fallback dinâmico
- **80+ imagens** para orações em `public/images/creation_*.webp` (paisagens espirituais únicas)
- **11 imagens** para os estágios da Árvore da Vida em `public/images/tree-stages/`
- **7 cards** da aba Explorar em `public/images/explore-cards/` (inclui Planos de Leitura)
- Todas em formato **WebP** (526MB originais → 49MB, 91% de redução)
- Servidas via `next/image` com otimização AVIF/WebP automática

### Performance de Imagens
- **138 imagens convertidas para WebP** — 526MB → 49MB (91% de redução)
- Todos os `<img>` substituídos por `next/image` em componentes críticos
- `priority` nas imagens hero de login/register (LCP direto)
- `fill + sizes` nos cards de grid (lazy load automático)
- `imageSizes: [32, 56, 176, 352]` customizados para thumbnails da gamificação
- AVIF e WebP servidos automaticamente conforme suporte do browser
- Avatares Google com `width/height` explícitos + fallback via state

### Design Visual (Redesign Pro Max — 01/03/2026)
- **Tipografia:** Lora (headings) + Raleway (body) via `next/font/google`
- **Paleta brand:** Purple `#7C3AED` + Gold `#CA8A04` — tokens em `src/styles/tokens.css`
- **BottomNav glassmorphism:** `rgba(255,255,255,0.88)` + `blur(20px)` + pill indicator violet com spring animation
- **Cards glassmorphism:** `bg-white/80 backdrop-blur-[12px]` — PrayerCard, MeditationCard, EstudoCard
- **GamificationCard redesign:** streak pill orange→red (Flame icon), level badge violet (Star), XP bar gradiente purple→gold
- **Versículo do Dia:** `VerseOfDayCard` com 31 versículos, gradiente devotional, Lora itálica
- **Saudação por horário:** Bom dia / Boa tarde / Boa noite no TabHoje
- **Skeleton Screens:** `ImageCardSkeleton` + `StudyCardSkeleton` — hydration-aware (4 skeletons no SSR)

### UX Android/iOS Imersiva (PWA)
- **Players fullscreen:** `PrayerDetailModalWithPlayer`, `MeditationDetailModalWithPlayer`, `EstudoDetailModalWithPlayer` — `fixed inset-0 z-[10001]`
  - Hero image: `clamp(240px, 42vh, 340px)` com gradiente escuro sobreposto
  - ChevronDown no topo (padrão Spotify) — sem botão X
  - `whileTap={{ scale: 0.88 }}` em todos os botões de ação
  - `overscroll-contain` na área de conteúdo scrollável
  - `padding-top: env(safe-area-inset-top)` para notch do iPhone
- **Modais "Ver Tudo" fullscreen:** `OracoesModal`, `MeditacoesModal`, `EstudosModal` — `z-[10000]`
  - Lista única scrollável — **paginação removida**
  - Header com ChevronDown para fechar (padrão nativo)
  - `MeditacoesModal` exibe TODAS as meditações: `MEDITACOES + CARDS_ESCRITURAS + CARDS_NOVO` (inclui itens Plus)
- **Transições de abas:** AnimatePresence + `motion.div` `key={activeTab}` — fade+slide 200ms ease-out
- **Tap feedback:** `whileTap={{ scale: 0.88 }}` em botões críticos

### Dark Mode
- **Light é padrão** — dark mode opcional via botão (Sun/Moon icons Lucide)
- Paleta marrom-quente no dark: `#1A1714` (bg) / `#F0EDE8` (texto)
- Não usa `prefers-color-scheme` automático (escolha explícita do usuário)
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
│   │   │   ├── webhooks/hotmart/       # Webhook Hotmart — legacy (HOTTOK + HMAC + rate limit + idempotência)
│   │   │   ├── webhooks/herospark/     # Webhook Herospark — token via query param + detecção de plano + cron de expiração
│   │   │   └── crons/
│   │   │       ├── expire-subscriptions/ # Expira assinaturas vencidas (06:00 UTC)
│   │   │       ├── email-inactive/     # E-mail para usuários inativos
│   │   │       ├── email-post-trial/   # E-mail pós-período de teste
│   │   │       └── email-streak-milestone/ # E-mail de streak milestone
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
│   │   ├── ui/                         # Componentes shadcn/ui + Skeleton customizados
│   │   ├── AuthSyncWrapper.tsx         # Supabase → Zustand → Dexie
│   │   ├── BottomNav.tsx               # Navegação inferior (z-[9999])
│   │   ├── GamificationCard.tsx        # XP / streak / Árvore — redesign Purple+Gold
│   │   ├── ImmersiveAudioPlayer.tsx    # Player fullscreen (z-[2000])
│   │   ├── NotificationSheet.tsx       # UI de solicitação de push
│   │   ├── OfflineIndicator.tsx
│   │   ├── ProfileModal.tsx            # Modal perfil c/ next/image avatar
│   │   ├── ServiceWorkerRegistration.tsx # Registro SW + Background Sync tags
│   │   ├── TreeGrowthVisual.tsx        # Visualização 11 estágios da árvore
│   │   ├── VerseOfDayCard.tsx          # Versículo do Dia (31 versículos, Lora itálica)
│   │   └── PaywallModal.tsx            # Modal de planos Premium (Hotmart checkout)
│   ├── stores/
│   │   ├── userStore.ts                # Perfil + plan (free/plus) + subscriptionStatus
│   │   ├── progressStore.ts            # XP, streak, nível, árvore + addXp() para planos
│   │   ├── readingPlanStore.ts         # Planos de leitura — activePlan + pendingChapter
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
│   │   ├── useMediaSession.ts          # MediaSession API — lock screen + background playback
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
│   │   ├── estudos.ts                  # 31 estudos bíblicos com áudio R2
│   │   ├── meditacoes.ts               # 28 meditações com áudio R2
│   │   ├── oracoes.ts                  # 47 orações com áudio R2
│   │   ├── planos-leitura.ts           # 6 planos de leitura bíblica (7/10/15/21/30/90 dias)
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
│       ├── 20260226_payment_system.sql  # subscriptions + hotmart_webhook_logs + plan sync
│       └── 20260304_security_fixes.sql  # hardening de segurança adicional
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

### Tipografia

| Fonte | Uso |
|---|---|
| **Lora** (Google Fonts) | Headings h1–h6, versículo do dia, títulos de seção |
| **Raleway** (Google Fonts) | Body, labels, botões, navegação |

### Paleta de Cores (light / dark)

```css
/* Light (padrão) */
--color-bg-primary:    #F8F7F4;
--color-text-primary:  #1F2937;
--color-brand:         #7C3AED;   /* roxo — cor principal da marca */
--color-brand-light:   #A78BFA;
--color-gold:          #CA8A04;   /* dourado — badges, XP bar */
--color-gold-light:    #FCD34D;

/* Dark (opcional) */
--color-bg-primary:    #1A1714;   /* marrom escuro quente */
--color-text-primary:  #F0EDE8;   /* branco quente */
--card:                #231F1B;
--secondary:           #2E2924;
--border:              #3D3830;
```

> Orange (`#FB923C`) ainda usado em streak/fire e elementos de gamificação. Laranja não é o primary do brand.

### Z-Index (hierarquia)

| Elemento | z-index |
|---|---|
| Conteúdo normal | 0–100 |
| ImmersiveAudioPlayer | z-[2000] |
| BottomNav | z-[9999] |
| Dialog overlay (ProfileModal) | z-[9999] |
| Dialog content (ProfileModal) | z-[10000] |
| Modais "Ver Tudo" (Orações/Meditações/Estudos) | z-[10000] |
| Players de detalhe fullscreen | z-[10001] |

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
HOTMART_WEBHOOK_SECRET="..."                            # Secret HMAC opcional — camada extra de segurança (X-Hotmart-Signature)

# Upstash Redis — rate limiting distribuído (recomendado em produção)
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"         # console.upstash.com → Create Database
UPSTASH_REDIS_REST_TOKEN="..."
# Sem essas vars, usa fallback in-memory (funciona, mas reinicia a cada deploy)

# CDN de áudio — opcional (melhora latência e elimina custo de banda no Vercel)
NEXT_PUBLIC_AUDIO_CDN_BASE="https://audio.minhajornadadiaria.com.br"
# Requer deploy de workers/audio-cdn.js no Cloudflare Workers com custom domain
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

## Status MVP — 19/03/2026

### ✅ Implementado e em produção

**Autenticação e Acesso:**
- ✅ Google OAuth + Login e-mail/senha (Supabase Auth)
- ✅ Cadastro com nome completo + confirmação de e-mail
- ✅ Middleware de proteção de rotas (SSR cookies)
- ✅ Callback OAuth + confirm redirect para domínio de produção

**Banco de Dados e Segurança:**
- ✅ PostgreSQL Supabase com migrations aplicadas (incluindo payment_system, analytics_events, content_library)
- ✅ RLS ativo em todas as tabelas
- ✅ Realtime publication habilitada

**Sync e Offline:**
- ✅ Offline-first com IndexedDB (Dexie) — prayers, journal, progress
- ✅ Background Sync via Service Worker (sync automático ao voltar online)
- ✅ Realtime multi-device: progress, favorites

**Conteúdo:**
- ✅ 28 meditações guiadas com áudio (Cloudflare R2)
- ✅ 31 estudos bíblicos com áudio (Cloudflare R2)
- ✅ 47 orações com áudio (Cloudflare R2)
- ✅ Bíblia completa online (66 livros, busca, navegação AT/NT)
- ✅ **6 planos de leitura bíblica** com progresso e XP por capítulo (7/10/15/21/30/90 dias)
- ✅ Devocional diário + Kids

**Planos de Leitura Bíblica:**
- ✅ 6 planos com estrutura de dias, leituras e temas — 🕊️ Salmos & Paz (7d), ⛰️ Fé (10d), 🌱 Começando com Deus (15d), ✨ Conheça Jesus (21d), 📖 Sabedoria Viva (30d), 🌿 NT Completo (90d)
- ✅ XP +25 por capítulo lido (integrado ao pool global de XP + nível + árvore)
- ✅ `ReadingPlanBanner` na aba Bíblia — convite ou barra de progresso do dia atual
- ✅ `ReadingPlanModal` com 3 views: lista de planos, detalhes/início, leituras do dia com checkboxes
- ✅ Card "Planos de Leitura" na aba Explorar com navegação cross-tab direta ao capítulo
- ✅ `pendingChapter` ephemeral no store — Explorar define, Bíblia consome e limpa no mount
- ✅ Persistência via Zustand `persist` com `partialize` (exclui `pendingChapter` do localStorage)

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
- ✅ Versículo diário NVI nas notificações matinais (31 versículos rotativos por dia do mês)
- ✅ Evening push condicional (só envia para quem não concluiu o dia)
- ✅ Streak milestones: mensagens especiais D7, D14, D21, D28, D30, D60, D90, D100
- ✅ Push de level-up — endpoint `/api/push/level-up` disparado pelo client ao subir de nível

**Painel Admin:**
- ✅ Dashboard em `/admin` com KPIs (usuários ativos, assinantes Premium, métricas)
- ✅ Disparo manual de push para todos os assinantes + botão de teste individual
- ✅ Gestão de assinantes Hotmart com status, planos e histórico
- ✅ Logs de webhooks Hotmart em tempo real
- ✅ Listagem completa de usuários
- ✅ Acesso protegido por `role = 'admin'` via RLS
- ✅ **CMS de Conteúdo** `/admin/conteudo` — criar/editar/publicar meditações, orações, devocionais, estudos e kids sem deploy

**Players de Áudio (MediaSession API):**
- ✅ `useMediaSession.ts` — hook central reutilizável pelos 3 players
- ✅ Controles na lock screen do celular (play/pause/skip +15s/-15s)
- ✅ Background playback — áudio não para ao bloquear a tela
- ✅ Metadados (título + álbum) transmitidos ao SO via `MediaMetadata`
- ✅ Integrado nos 3 players: meditações, orações e estudos bíblicos

**Monetização (Hotmart):**
- ✅ Paywall em meditações, orações e estudos bíblicos (conteúdo Premium)
- ✅ PaywallModal com 3 planos (mensal/trimestral/anual) + checkout Hotmart
- ✅ Webhook handler `/api/webhooks/hotmart` — segurança em 3 camadas:
  - HOTTOK com `timingSafeEqual` (anti timing-attack)
  - Rate limiting 30 req/min por IP — **Upstash Redis distribuído** (persiste entre deploys/instâncias) com fallback in-memory gracioso
  - Idempotência por `hotmart_transaction` (anti-replay de eventos duplicados)
  - HMAC-SHA256 opcional via `HOTMART_WEBHOOK_SECRET` (header `X-Hotmart-Signature`)
  - Helpers (`timingSafeCompare`, `detectPlanInterval`, `calcExpiresAt`) em `utils.ts` separado (testável + compatível Next.js route exports)
- ✅ Sincronização automática de plan via trigger SQL
- ✅ `useSubscription` hook com Realtime listener

**Onboarding:**
- ✅ Flow de 4 slides com Framer Motion (disparado no 1º login)
- ✅ Seleção de interesses espirituais com persistência em Supabase
- ✅ Solicitação de permissão de notificações no último slide

**Observabilidade:**
- ✅ Sentry SDK integrado (app + server + edge)
- ✅ Error Boundaries em componentes críticos

**Design e UX:**
- ✅ Light mode como padrão + Dark mode opcional (paleta marrom-quente `#1A1714`)
- ✅ 9 abas com navegação por bottom nav (glassmorphism + pill indicator violet)
- ✅ Transições de abas AnimatePresence fade+slide (200ms ease-out)
- ✅ Imagens espirituais únicas geradas por IA (138 WebP, 91% menores que PNG original)
- ✅ `next/image` em todos os componentes (WebP/AVIF automático, `imageSizes` customizados)
- ✅ Animações Framer Motion + `whileTap scale(0.88)` em botões críticos
- ✅ **Redesign visual Pro Max:** Lora+Raleway, paleta Purple+Gold, cards glassmorphism
- ✅ **Players fullscreen imersivos** (z-[10001]) — padrão Spotify com ChevronDown
- ✅ **Modais "Ver Tudo" fullscreen** (z-[10000]) — lista única sem paginação
- ✅ **Versículo do Dia** — 31 versículos rotacionados com `VerseOfDayCard`
- ✅ **Skeleton Screens** — `ImageCardSkeleton` + `StudyCardSkeleton` hydration-aware
- ✅ **GamificationCard redesign** — streak pill orange→red, level badge violet, XP bar purple→gold
- ✅ **Diário — Prompts rotativos** — 33 prompts em 5 categorias (reflexão, gratidão, intenção, escuta, compromisso), exibidos ao abrir entrada em branco com botão "Outro" para trocar

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
- [ ] Expansão do conteúdo Kids (meditações + estudos infantis)
- [ ] Personalização por interesses do onboarding (feed TabHoje + recomendações TabExplorar)
- [ ] Oração guiada — PrayerTimerModal (5/15/30min) + GuidedPrayerFlow (leitura → silêncio → intenção)

**Distribuição Nativa:**
- [ ] Build nativo via Capacitor (iOS/Android)
- [ ] Publicação na Google Play Store
- [ ] Publicação na Apple App Store

**Qualidade e Infraestrutura:**
- ✅ Testes unitários com Vitest — 433 testes passando
- ✅ Testes E2E com Playwright — 33/33 passando (auth, paywall, gamificação, mobile)
- ✅ `playwright.config.ts` configurado para WSL2 com `chrome-headless-shell` via `LD_LIBRARY_PATH`
- ✅ `scripts/setup-playwright-deps.sh` instala libs do sistema sem `sudo` (WSL2)
- [ ] Dashboard de progresso espiritual (gráficos semanais/mensais de XP e streak)

---

## Licença

Este projeto é **privado** e propriedade intelectual da Jornada com Deus. Todos os direitos reservados.

---

*"Tudo posso naquele que me fortalece." — Filipenses 4:13*
