# Jornada com Deus

> **Aplicação devocional cristã PWA completa e funcional** — Uma jornada diária de intimidade com Deus através de tecnologia moderna e design sereno.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange)](https://web.dev/progressive-web-apps/)
[![Auth](https://img.shields.io/badge/Auth-Google%20%2B%20Credentials-blue)](https://authjs.dev/)

---

## Visão do Produto

**Jornada com Deus** é uma PWA para cristãos que desejam cultivar um relacionamento mais profundo com Deus através de práticas diárias espirituais.

- **Foco:** hábito diário de intimidade com Deus
- **Sensação visual:** paz, leveza, espaço em branco, minimalismo acolhedor
- **Paleta:** fundo `#FAF9F6`, primary `#FB923C`, accent `#10B981`, texto `#1F2937`
- **Design:** border-radius 16-20px, sombras suaves, muito espaço branco
- **Todo texto em português brasileiro**
- **Freemium:** conteúdo gratuito + áudio narrado = Plus
- **Gamificação:** streak, XP (+75/dia), níveis, Árvore da Vida (0–10)

---

## Stack Técnica Completa

### Core

| Tecnologia | Versão | Uso |
|---|---|---|
| **Next.js** | 16.1.6 | Framework (App Router + Server Actions) |
| **React** | 19.2.3 | UI + `useActionState` (React 19) |
| **TypeScript** | 5.x (strict) | Tipagem obrigatória em tudo |
| **Tailwind CSS** | 4.0 | Estilização utilitária |

### UI / Animações

| Tecnologia | Versão | Uso |
|---|---|---|
| **shadcn/ui** | 3.8.5 | Componentes base (Button, Card, Dialog…) |
| **Radix UI** | 1.4.3 | Primitivos acessíveis |
| **Framer Motion** | 12.34.2 | Animações e transições suaves |
| **Lucide React** | 0.574.0 | Ícones |
| **Sonner** | 2.0.7 | Toast notifications |

### Estado e Persistência

| Tecnologia | Versão | Uso |
|---|---|---|
| **Zustand** | 5.0.11 | Estado global (com `persist` middleware) |
| **Dexie (IndexedDB)** | 4.3.0 | Banco offline no browser |
| **localStorage** | — | Persistência dos stores Zustand |

### Autenticação

| Tecnologia | Versão | Uso |
|---|---|---|
| **Auth.js (NextAuth v5)** | 5.0.0-beta.30 | Framework de autenticação |
| **Google OAuth 2.0** | — | Login social |
| **CredentialsProvider** | — | Login com e-mail + senha |
| **bcryptjs** | 3.0.3 | Hash seguro de senhas (custo 12) |

### PWA / Performance

| Tecnologia | Versão | Uso |
|---|---|---|
| **next-pwa** | 5.6.0 | Service Worker + manifest |
| **Workbox** | 7.4.0 | Cache offline avançado |

### APIs Externas

| Serviço | Uso |
|---|---|
| **bible-api.com** | Bíblia Almeida Corrigida Fiel (domínio público, online-only) |
| **Cloudflare R2** | CDN para os 6 áudios de meditação |
| **Unsplash** | Placeholder de imagens na tela de login/cadastro |

---

## Estrutura de Arquivos (COMPLETA E ATUALIZADA)

```
jornada-com-deus/
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── layout.tsx                  # Layout raiz com providers
│   │   ├── page.tsx                    # Página principal — renderiza as 5 tabs
│   │   ├── globals.css                 # Estilos globais Tailwind
│   │   ├── actions/
│   │   │   └── register.ts             # Server Action de cadastro (e-mail/senha)
│   │   ├── biblia/
│   │   │   └── sobre/page.tsx          # Aviso legal sobre a tradução bíblica
│   │   ├── explorar/
│   │   │   └── page.tsx                # Rota auxiliar /explorar (placeholder)
│   │   ├── login/
│   │   │   └── page.tsx                # Tela de login (Google + e-mail/senha)
│   │   └── register/
│   │       └── page.tsx                # Tela de cadastro (e-mail/senha)
│   ├── components/
│   │   ├── auth/                       # Componentes client de autenticação
│   │   │   ├── CredentialsLoginForm.tsx # Formulário login e-mail/senha
│   │   │   └── RegisterForm.tsx        # Formulário de cadastro
│   │   ├── layout/                     # Componentes de layout reutilizáveis
│   │   │   └── UserHeader.tsx          # Cabeçalho universal (avatar + título + ProfileModal)
│   │   ├── providers/
│   │   │   └── SessionProvider.tsx     # NextAuth SessionProvider (client)
│   │   ├── tabs/                       # Telas das 5 abas principais
│   │   │   ├── TabHoje.tsx             # Aba Hoje — devocional + gamificação
│   │   │   ├── TabExplorar.tsx         # Aba Explorar — meditações + filtros
│   │   │   ├── TabBiblia.tsx           # Aba Bíblia — navegação + busca
│   │   │   ├── TabOracoes.tsx          # Aba Orações — banco + criação
│   │   │   └── TabDiario.tsx           # Aba Diário — entradas espirituais
│   │   ├── ui/                         # Componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx              # z-index corrigido: overlay z-[9999], content z-[10000]
│   │   │   ├── Skeleton.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ... (15+ componentes)
│   │   ├── AppButton.tsx
│   │   ├── AppCard.tsx
│   │   ├── AuthSyncWrapper.tsx         # Sincroniza Google session → Zustand → Dexie
│   │   ├── BottomNav.tsx               # Navegação inferior — z-[9999]
│   │   ├── CalendarioFavoritosModal.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── GamificationCard.tsx        # XP / streak / Árvore da Vida
│   │   ├── HojeSteps.tsx               # 4 etapas diárias
│   │   ├── ImmersiveAudioPlayer.tsx    # Player fullscreen — z-[2000]
│   │   ├── MeditationPlayer.tsx
│   │   ├── OfflineIndicator.tsx
│   │   ├── PaywallModal.tsx            # Modal upgrade Plus
│   │   ├── ProfileModal.tsx            # Modal perfil — usa Dialog (z-[10000])
│   │   └── SectionHeader.tsx
│   ├── stores/                         # Zustand stores com persist
│   │   ├── userStore.ts                # Perfil + isPlus
│   │   ├── progressStore.ts            # XP, streak, nível, árvore
│   │   └── tabStore.ts                 # Aba ativa
│   ├── hooks/
│   │   ├── useAuthSync.ts              # Auth.js ↔ Zustand ↔ Dexie
│   │   ├── useBible.ts                 # API bible-api.com + cache sessionStorage
│   │   ├── useDB.ts                    # Acesso ao Dexie
│   │   ├── useFavorites.ts
│   │   ├── useOnlineStatus.ts
│   │   ├── useToast.ts
│   │   └── use-pwa-install.ts
│   ├── lib/
│   │   ├── animations.ts               # Configs Framer Motion
│   │   ├── credentials-db.ts           # Store server-side de credenciais (JSON file)
│   │   ├── db.ts                       # Configuração Dexie (IndexedDB — 6 tabelas)
│   │   └── utils.ts                    # cn() e utilitários
│   ├── data/
│   │   ├── oracoes-diarias.ts          # Banco de orações pré-definidas
│   │   ├── passagens-diarias.ts
│   │   ├── seed.ts
│   │   └── versiculos.ts
│   ├── types/
│   │   └── next-auth.d.ts              # Extensão dos tipos: session.user.id
│   ├── constants/
│   │   └── theme.ts
│   ├── auth.config.ts                  # Config leve Auth.js (Edge Runtime compatible)
│   ├── auth.ts                         # Config completa Auth.js (Node.js only)
│   └── middleware.ts                   # Proteção de rotas (Edge Runtime)
├── public/
│   ├── manifest.json                   # PWA manifest
│   ├── favicon.ico
│   └── icon-*.png                      # Ícones PWA 192x192 e 512x512
├── data/                               # Gerado automaticamente (no .gitignore)
│   └── credentials-users.json          # Usuários de e-mail/senha (DEV only)
├── .env.local                          # Variáveis de ambiente (no .gitignore)
├── package.json
├── next.config.ts
├── tailwind.config.js
├── tsconfig.json
└── .gitignore
```

---

## Sistema de Autenticação (DETALHADO)

### Dois provedores ativos

```
Google OAuth  →  GoogleProvider (auth.config.ts)
E-mail/Senha  →  CredentialsProvider (auth.ts — Node.js only)
```

### Arquitetura de arquivos Auth.js (IMPORTANTE)

O Next.js middleware roda no **Edge Runtime** (sem Node.js). Por isso, a config do Auth.js é dividida em dois arquivos:

```
auth.config.ts  ──►  Edge Runtime safe
  - GoogleProvider
  - callbacks (session, jwt)
  - pages { signIn: "/login" }
  - Usado pelo: middleware.ts

auth.ts  ──►  Node.js Runtime only
  - Importa e estende authConfig
  - Adiciona CredentialsProvider (usa bcryptjs + fs)
  - Exporta: handlers, auth, signIn, signOut
  - Usado por: server actions, API routes, server components
```

**NUNCA** importe `@/auth` no `middleware.ts` — isso quebraria o Edge Runtime.
O middleware importa `NextAuth(authConfig)` do `auth.config.ts`.

### Store de credenciais (`src/lib/credentials-db.ts`)

- Armazena usuários em `data/credentials-users.json` (server-side, Node.js)
- Senhas hasheadas com **bcryptjs** (custo 12)
- Funções: `findUserByEmail`, `createCredentialUser`, `verifyCredentials`
- **DEV only** — em produção substituir por PostgreSQL/MongoDB com adapter Auth.js

### Fluxo de cadastro

```
/register  →  RegisterForm (client)
           →  registerUser (server action)
           →  createCredentialUser (credentials-db.ts)
           →  signIn("credentials") automático
           →  /
```

### Rotas protegidas (middleware.ts)

```
Protegidas (requer auth): /  /explorar  /biblia  /oracoes  /diario
Públicas:                  /login  /register  /api/auth/*
```

---

## Componente UserHeader (REUTILIZÁVEL)

Localização: `src/components/layout/UserHeader.tsx`

Todas as 5 abas usam este componente no topo. Ele **gerencia internamente** o estado do ProfileModal.

```tsx
<UserHeader
  title="Bíblia"
  subtitleElement={<button>link opcional abaixo do título</button>}
  rightElement={<div>ícones/botões do lado direito</div>}
/>
```

| Prop | Tipo | Descrição |
|---|---|---|
| `title` | `string` | Nome da aba exibido ao lado do avatar |
| `subtitleElement?` | `ReactNode` | Conteúdo abaixo do título (usado no TabHoje) |
| `rightElement?` | `ReactNode` | Slot para ações no lado direito |

**O que o UserHeader faz:**
- Consome `useSession()` para exibir a **foto do Google** no avatar
- Consome `useUserStore` para o nome (fallback)
- Skeleton enquanto carrega
- Fallback: inicial do nome com `bg-[#FB923C]` se a foto falhar
- `onClick` no avatar → abre `ProfileModal`

---

## Z-Index (hierarquia completa)

| Elemento | z-index |
|---|---|
| Conteúdo normal | 0–100 |
| Modais das abas (bottom-sheet) | z-[1000] |
| OfflineIndicator (topo) | z-[1000] |
| LoadingSpinner overlay | z-[999] |
| MeditationPlayer / ImmersiveAudioPlayer | z-[2000] |
| BottomNav | z-[9999] |
| **Dialog overlay (ProfileModal)** | **z-[9999]** |
| **Dialog content (ProfileModal)** | **z-[10000]** |

O `ProfileModal` usa o componente `Dialog` do shadcn/ui. Os valores foram corrigidos em `src/components/ui/dialog.tsx` para garantir que o modal apareça **acima do BottomNav** e de todos os outros overlays.

---

## Telas e Rotas

### `/login` — Tela de Login

- **Layout split-screen**: imagem Unsplash (esquerda, md+) + formulário (direita)
- **Glassmorphism card**: `bg-white/75 backdrop-blur-xl`
- **Botão Google**: cores oficiais (4 paths SVG coloridos) + hover laranja suave
- **Formulário e-mail/senha**: `CredentialsLoginForm` (client component)
- **Divisor "ou"** entre Google e credenciais
- Mobile: imagem como fundo com overlay `bg-[#FAF9F6]/85 backdrop-blur-sm`

### `/register` — Tela de Cadastro

- Mesmo layout split-screen do login (imagem diferente — amanhecer verde)
- Campos: nome, e-mail, senha, confirmar senha
- Validação client + server
- Após cadastro: login automático → redireciona para `/`

### `/` — Home (5 abas)

Renderiza condicionalmente via `tabStore`:

| Tab | Componente | Destaque |
|---|---|---|
| **Hoje** | `TabHoje.tsx` | 4 etapas + gamificação + UserHeader com CalendarioFavoritosModal |
| **Explorar** | `TabExplorar.tsx` | 6 meditações Cloudflare R2 + filtros + paywall Plus |
| **Bíblia** | `TabBiblia.tsx` | Online-only via bible-api.com + busca + navegação AT/NT |
| **Orações** | `TabOracoes.tsx` | Banco pré-definido + criação personalizada |
| **Diário** | `TabDiario.tsx` | 4 tipos de entrada + busca + tags |

### `/biblia/sobre` — Aviso Legal da Bíblia

### `/explorar` — Rota auxiliar (placeholder antigo, não é a aba principal)

---

## Gamificação

| Elemento | Valor |
|---|---|
| XP por dia completo | +75 |
| Streak | Dias consecutivos |
| Árvore da Vida | 0–10 (baseado em progresso) |
| Níveis | Calculados pelo XP total |

Store: `src/stores/progressStore.ts` (Zustand + localStorage persist)

---

## Dados e Banco

### Dexie (IndexedDB — client-side)

6 tabelas em `src/lib/db.ts`:

```
users           — perfil do usuário autenticado
progress        — XP, streak, nível, árvore
devotionals     — conteúdo devocional
prayers         — orações pessoais + pré-definidas
journalEntries  — entradas do diário
favorites       — favoritos por userId
```

**Importante:** Dexie roda **apenas no browser**. Não pode ser acessado em server components, server actions ou middleware.

### JSON File Store (server-side — credenciais)

Arquivo: `data/credentials-users.json` (criado automaticamente)

```json
[
  {
    "id": "uuid",
    "email": "usuario@email.com",
    "name": "Nome",
    "passwordHash": "$2b$12$...",
    "createdAt": "2026-02-19T..."
  }
]
```

**Para produção:** substituir por database real + Auth.js adapter.

---

## Variáveis de Ambiente

Arquivo: `.env.local` (não commitado)

```env
# Google OAuth — obrigatório
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."

# Segredo Auth.js — obrigatório (string longa aleatória)
AUTH_SECRET="..."
```

Gerar `AUTH_SECRET`:
```bash
openssl rand -base64 32
```

---

## Como Executar

### 1. Instalar dependências

```bash
cd jornada-com-deus
npm install
```

### 2. Configurar variáveis de ambiente

```bash
# Crie o arquivo .env.local com as variáveis acima
# Para Google OAuth: console.cloud.google.com
# Authorized redirect URIs: http://localhost:3000/api/auth/callback/google
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
# Acessa: http://localhost:3000
# Redireciona para /login automaticamente se não autenticado
```

### 4. Build de produção

```bash
npm run build
npm start
```

### 5. Linting

```bash
npm run lint
```

---

## Padrões de Código

### TypeScript

- Strict mode ativado
- Tipos explícitos em tudo — evitar `any`
- Componentes: `PascalCase` | Hooks: `camelCase` com prefixo `use`

### Imports (ordem)

```typescript
// 1. React e Next.js
import { useState } from "react";
import Link from "next/link";

// 2. Bibliotecas externas
import { motion } from "framer-motion";

// 3. Componentes internos
import { UserHeader } from "@/components/layout/UserHeader";

// 4. Hooks, stores, lib
import { useUserStore } from "@/stores/userStore";
```

### Server vs Client

```
"use client"  →  componentes com hooks, eventos, next-auth/react
sem diretiva  →  server components (padrão no App Router)
"use server"  →  server actions (em arquivos separados ou inline em forms)
```

### Regra crítica Auth.js

```
middleware.ts  →  importa APENAS auth.config.ts (Edge Runtime)
resto do app   →  importa auth.ts (Node.js)
```

---

## Design System

### Cores

```css
--background: #FAF9F6;   /* Off-white sereno */
--primary:    #FB923C;   /* Laranja quente */
--accent:     #10B981;   /* Verde paz */
--foreground: #1F2937;   /* Cinza escuro */
--muted:      #6B7280;   /* Cinza médio */
--success:    #10B981;
--warning:    #F59E0B;
--error:      #EF4444;
```

### Espaçamento e formas

- Padding padrão nas telas: `p-6 pb-28` (28 = espaço para BottomNav)
- Cards principais: `rounded-2xl` (16px)
- Avatar: `rounded-full` com `border-2 border-white shadow-md`
- Glassmorphism: `bg-white/75 backdrop-blur-xl border border-white/60`

### Animações (Framer Motion)

Configs centralizadas em `src/lib/animations.ts`:
- `fadeInUp` — entrada suave de baixo para cima
- `staggerContainer` + `staggerItem` — listas animadas em cascata
- `hoverLift` — elevação sutil no hover

---

## Próximos Passos (Roadmap)

### Produção imediata

1. **Deploy** — Vercel (recomendado para Next.js)
2. **Banco de dados real** — substituir `data/credentials-users.json` por PostgreSQL + Prisma + Auth.js adapter
3. **Testes em dispositivos reais**

### Features prioritárias

1. **Notificações push** — lembretes diários de devocional
2. **Modo noturno** — alternância automática dia/noite
3. **Dashboard de progresso** — gráficos de evolução espiritual
4. **Planos de leitura bíblica** — leituras estruturadas em dias
5. **Sistema social** — compartilhamento de reflexões

### Técnico

1. **Capacitor** — build nativo iOS/Android
2. **Google Play / App Store** — publicação
3. **Pagamentos Plus** — integração Stripe/Hotmart
4. **Analytics** — Google Analytics
5. **Testes** — Jest + React Testing Library

---

## Estado Atual do Desenvolvimento (19/02/2026)

## 🗺️ Status do MVP — Rastreamento de Progresso

> Última atualização: 24/02/2026

### ✅ Implementado e funcional

**Autenticação (Supabase):**
- ✅ Google OAuth com foto real no avatar
- ✅ Login com e-mail + senha (Supabase Auth)
- ✅ Cadastro com confirmação de e-mail (emailRedirectTo dinâmico)
- ✅ Middleware de proteção de rotas (SSR cookies)
- ✅ AuthContext + useAuthSync (Supabase → Zustand → Dexie)
- ✅ Redirecionamento automático login ↔ home
- ✅ Callback `/auth/callback` para Google OAuth + email confirm

**Supabase — Banco de Dados:**
- ✅ Cliente browser (`src/lib/supabase.ts` — lazy init com placeholder)
- ✅ Cliente server (`src/lib/supabase-server.ts` — factory para Server Components)
- ✅ Migrations aplicadas:
  - `001_create_auth_tables.sql` — users, accounts, sessions
  - `20260223_sync_offline_data.sql` — prayers, journal_entries (offline-first)
  - `20260224_bible_verses.sql` — bible_verses com full-text search
  - `20260224_user_progress_favorites.sql` — user_progress, user_favorites
- ✅ RLS ativo em todas as tabelas

**Sync de dados do usuário:**
- ✅ Prayers — offline-first via `useSyncManager` (Dexie pending → Supabase upsert)
- ✅ Journal entries — offline-first via `useSyncManager`
- ✅ Progress/Streak/XP/Árvore — `useSupabaseSync` (hydrate login + push debounced + realtime)
- ✅ Favorites — `useFavorites` com sync Supabase (hydrate login + toggle upsert/delete)
- ✅ Realtime subscription multi-device para progresso

**UI/UX:**
- ✅ Tela de login split-screen com glassmorphism
- ✅ 9 abas: Hoje, Explorar, Bíblia, Orações, Diário, Meditações, Estudos Bíblicos, Devocional, Kids
- ✅ Bottom Navigation fixo com z-[9999]
- ✅ Animações Framer Motion em todo o app
- ✅ Tags coloridas (vermelho/roxo/azul/amarelo) em Meditações, Orações e Estudos
- ✅ Modo offline com IndexedDB + Service Worker

**Conteúdo:**
- ✅ 16 meditações com áudio no Cloudflare R2
- ✅ 21 estudos bíblicos com áudio no Cloudflare R2
- ✅ 40+ orações com áudio no Cloudflare R2
- ✅ Bíblia online via bible-api.com (66 livros, busca, navegação)
- ✅ Banco de orações pré-definidas + criação personalizada
- ✅ Diário com 4 tipos de entrada

**Gamificação:**
- ✅ XP (+75/dia completo), streak, níveis, Árvore da Vida (11 estágios)
- ✅ Imagens geradas por IA para cada estágio da árvore
- ✅ Persistência: localStorage + Dexie + Supabase (multi-device)

**PWA:**
- ✅ Instalável em mobile
- ✅ Offline funcional
- ✅ Service Worker com cache Workbox

### 🚧 Pendente para lançamento MVP

- [ ] Executar migration `20260224_user_progress_favorites.sql` no Supabase cloud
- [ ] Testes end-to-end do fluxo de auth email (cadastro → confirm → login)
- [ ] Build nativo (Capacitor) — opcional pós-MVP
- [ ] Pagamentos Stripe (Plus tier)
- [ ] Push notifications (orações diárias)

### 🌐 Produção

- **URL:** https://app.minhajornadadiaria.com.br
- **Hosting:** Vercel (auto-deploy no push para `main`)
- **Database:** Supabase Cloud (`tmwkizdzulzufpuonhod.supabase.co`)
- **CDN Áudios:** Cloudflare R2 (pub-*)
- **Auth redirect:** `https://app.minhajornadadiaria.com.br/auth/callback`

---

## Licença

Este projeto é **privado** e propriedade intelectual da Jornada com Deus. Todos os direitos reservados.

---

*"Tudo posso naquele que me fortalece." — Filipenses 4:13*
