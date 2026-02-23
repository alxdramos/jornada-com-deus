# Diagnóstico Arquitetural - Loop de Autenticação "Jornada com Deus"

**Data**: 22/02/2026
**Status**: CRÍTICO
**Recomendação**: Opção B (Supabase Auth puro)

---

## 1. ANÁLISE DA ARQUITETURA ATUAL

### 1.1 Stack de Autenticação Atual

```
Frontend (React 19 + Next.js 16)
    ↓
Middleware (Edge Runtime)
    ↓ [Usa authConfig leve — sem persistência]
NextAuth v5 beta (INCOMPLETE)
    ├── GoogleProvider (OAuth2)
    ├── CredentialsProvider (login local com bcryptjs)
    └── ❌ SEM PERSISTÊNCIA DE SESSÃO
    ↓
Session Callbacks (JWT)
    ├── JWT token assinado com AUTH_SECRET
    ├── Token armazenado em COOKIE HTTP-Only
    └── ❌ SEM BANCO DE DADOS BACKEND
```

### 1.2 Problema Raiz Identificado

**NextAuth está configurado para JWT-only sem persistência de sessão:**

| Componente | Status | Problema |
|-----------|--------|----------|
| `auth.config.ts` | ✅ Válido | Leve, compatível com Edge Runtime |
| `auth.ts` | ✅ Válido | CredentialsProvider funciona (fs/bcryptjs) |
| JWT Token | ✅ Gerado | Assinado com `AUTH_SECRET` |
| Session Storage | ❌ **FALTA** | Nenhum banco de dados configurado |
| Session Validation | ❌ **FALTA** | Apenas leitura de JWT, sem persistência |
| Vercel Cache CDN | ❌ **CONFLITA** | Página home em static cache (x-nextjs-prerender: 1) |

### 1.3 Por Que o Loop Infinito Ocorre

```
FLUXO PROBLEMÁTICO:
1. Usuário acessa /
2. Middleware checa req.auth (vazio — sem sessão persistida)
3. Middleware redireciona para /login
4. Usuário faz login (token JWT criado)
5. Token armazenado em cookie HTTP-Only ✅
6. Usuário redireciona para /
7. ❌ Vercel CDN serve VERSÃO CACHEADA da home (ignora cookie/auth)
8. Middleware TENTA validar, mas...
9. authConfig não consegue persistir sessão entre requisições
10. Loop volta ao passo 2

RAIZ CAUSA: Dois problemas simultâneos
├─ NextAuth sem persistência (falta banco de dados)
└─ Vercel servindo página em cache estático
```

### 1.4 Tentativas Anteriores (Falhadas)

| Tentativa | Implementação | Resultado |
|-----------|--------------|-----------|
| `trustHost: true` | Adicionado em auth.config.ts | ✗ Não resolveu (cache é o problema) |
| `force-dynamic` em page.tsx | `export const dynamic = 'force-dynamic'` | ✗ Client component não re-avalia no servidor |
| Server-side `await auth()` | Implementado em page.tsx | ✗ Sessão não persiste — falta DB |
| Middleware logging | Adicionado debugging | ✓ Confirmou o fluxo, mas problema persiste |

---

## 2. COMPARAÇÃO DE SOLUÇÕES

### OPÇÃO A: NextAuth + Banco de Dados

```
Arquitetura:
Cliente → NextAuth Middleware → JWT Token → PostgreSQL (Sessions)
                                          → User Auth Records

Vantagens:
✅ NextAuth suporta persistência via adapter (prisma, drizzle, etc)
✅ Google OAuth + Email/Senha no mesmo lugar
✅ Sessões mais seguras (backend-validated)

Desvantagens:
❌ Adiciona complexidade: nova DB, migrations, adapters
❌ NextAuth v5 beta ainda não tem adapters estáveis
❌ Mais dependencies, mais surface de erro
❌ Vercel cache still problematic

Esforço: 4-5 dias
```

### OPÇÃO B: Supabase Auth Puro (RECOMENDADO)

```
Arquitetura:
Cliente (@supabase/supabase-js) → Supabase Auth
                                  ├─ Google OAuth
                                  ├─ Email/Senha
                                  └─ PostgreSQL (sessions + user data)

Vantagens:
✅ Autenticação completa com persistência automática
✅ Sessões gerenciadas pelo servidor (sem JWT issues)
✅ Google OAuth nativo
✅ Email/Senha com bcrypt no Supabase
✅ Cookies são validadas sempre (bypass cache)
✅ RLS (Row-Level Security) para dados de usuário
✅ Simples, uma single source-of-truth
✅ Removemos NextAuth beta — elimina dependência instável

Desvantagens:
❌ Supabase é SaaS (não self-hosted neste MVP)
❌ Custo de $5-50/mês em produção
❌ Requer migração de credenciais locais

Esforço: 2-3 dias
```

### OPÇÃO C: Simplificar NextAuth + Força Side-Client

```
Arquitetura:
NextAuth (apenas JWT, sem DB) → useAuthSync hook força refresh

Vantagens:
✅ Sem nova dependência externa
✅ Menos código
✅ NextAuth v5 segue configurado

Desvantagens:
❌ Sessões expõem user no JWT (segurança)
❌ Vercel cache ainda conflita
❌ Não soluciona raiz causa
❌ Frágil, pode quebrar com atualizações NextAuth

Esforço: 1-2 dias (atalho, mas temporário)
```

---

## 3. RECOMENDAÇÃO ARQUITETURAL

### DECISÃO: **OPÇÃO B - Supabase Auth Puro**

#### Racional

1. **Resolve raiz causa**: Sessões persistidas no servidor (Supabase) não dependem de cache CDN
2. **Remove beta dependency**: NextAuth v5 beta → removido completamente
3. **Implementação clara**: Supabase tem SDKs estáveis (supabase-js 2.x)
4. **Segurança melhor**: Sessions server-validated, não JWT-only
5. **Custo aceitável**: Tier gratuito cobre MVP, $5-20/mês em produção
6. **Time familiar**: Já usando Supabase em outros projetos

#### Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────────┐
│                   APLICAÇÃO REACT                           │
│  (localhost:3000 / minhajornadadiaria.com.br)               │
└──────────────┬──────────────────────────────────────────────┘
               │
               ├─ @supabase/supabase-js
               │  (Cliente SDK)
               │
               ↓
         ┌─────────────────┐
         │ SUPABASE        │
         │ (SaaS Backend)  │
         └─────────────────┘
               │
         ┌─────┴──────────────┐
         ↓                    ↓
    ┌─────────────┐    ┌──────────────┐
    │   AUTH      │    │  PostgreSQL  │
    ├─────────────┤    ├──────────────┤
    │ Google OAuth│    │ users        │
    │ Email/Pass  │    │ profiles     │
    │ 2FA (opt)   │    │ sessions     │
    │ JWT tokens  │    │ user_prefs   │
    └─────────────┘    └──────────────┘

Fluxo de Autenticação:
1. Usuário clica "Login com Google" ou submete email/senha
2. @supabase/supabase-js chama Supabase Auth
3. Supabase valida, cria JWT + session no PostgreSQL
4. JWT salvo em cookie HTTP-Only (Supabase gerencia)
5. Próximas requisições incluem cookie (validado sempre)
6. Middleware Node.js valida JWT com Supabase
7. Redireciona se inválido, permite se válido
8. Vercel cache NÃO interfere (cookie sempre validado)
```

---

## 4. ROTEIRO DE IMPLEMENTAÇÃO

### FASE 1: Setup Supabase (3-4 horas)

```bash
1. Criar projeto Supabase (https://supabase.com)
   - PostgreSQL 15
   - Auth habilitado
   - Google OAuth configurado (usar credenciais existentes)

2. Configurar Google OAuth
   - Usar AUTH_GOOGLE_ID e AUTH_GOOGLE_SECRET existentes
   - Adicionar URLs de callback: http://localhost:3000, https://minhajornadadiaria.com.br

3. Criar tabelas customizadas (RLS)
   - users (Supabase cria automaticamente)
   - user_profiles (avatar, nome, preferences)
   - user_sessions_log (audit)

4. Migrar usuários existentes
   - Ler credenciais de data/credentials-users.json
   - Inserir em Supabase auth.users + user_profiles
   - Criptografia bcrypt já existe (Supabase é compatível)
```

### FASE 2: Integração Cliente (2-3 horas)

```bash
1. npm install @supabase/supabase-js

2. Criar src/lib/supabase-client.ts
   - supabaseClient com chave anon pública
   - useAuth hook que lê Supabase session

3. Substituir componentes de login
   - AuthPage.tsx → usar supabase.auth.signInWithOAuth()
   - Remover CredentialsProvider

4. Atualizar page-content.tsx
   - useAuth → const { user } = useAuth()
   - Remove dependência de NextAuth
```

### FASE 3: Middleware Node.js (2-3 horas)

```bash
1. Reescrever middleware.ts
   - Usar @supabase/ssr (server-side rendering)
   - Validar JWT contra Supabase on every request
   - Não depender de cache (always validate)

2. Remover auth.config.ts e auth.ts
   - Deletar (não mais necessário)
   - Supabase maneja tudo

3. Update .env.local
   - Remover AUTH_GOOGLE_ID, AUTH_SECRET
   - Adicionar:
     NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
     SUPABASE_SERVICE_KEY=eyJxxxx... (server-only)
```

### FASE 4: Testes (4-6 horas)

```bash
1. Test local (localhost:3000)
   - Google OAuth login
   - Email/password login (se implementar)
   - Session persistence (refresh page)
   - Logout

2. Deploy Vercel
   - Configurar env vars em Vercel dashboard
   - Testar em staging
   - Monitorar logs

3. Production (minhajornadadiaria.com.br)
   - Verificar cookies HTTPS
   - Testar 2FA se implementado
   - Migrar dados de produção
```

**Total Esforço**: ~2.5 dias
**Risco**: BAIXO (Supabase estável, SDKs bem-testados)

---

## 5. ARQUIVO DE RASTREAMENTO DE DECISÃO

**Decision ID**: ARCH-2026-02-22-AUTH-001

**Decisão**: Migrar de NextAuth v5 beta para Supabase Auth
**Justificação**: Remove beta dependency, resolve loop infinito via persistent sessions, implementação mais simples
**Alternativas Consideradas**: NextAuth + DB (4-5 dias), Simplificar NextAuth (temporário, frágil)
**Status**: RECOMENDADO (aguardando aprovação @pm)
**Próximo Passo**: @dev inicia Fase 1 (Setup Supabase)

---

## 6. RISCOS E MITIGAÇÕES

| Risco | Severidade | Mitigação |
|-------|-----------|-----------|
| Supabase outage | MÉDIO | Ter plano de rollback, testar RTO/RPO |
| Migração de usuários falha | MÉDIO | Backup data/credentials-users.json antes |
| Google OAuth misconfiguration | BAIXO | Testar OAuth em staging primeiro |
| Performance RLS queries | BAIXO | Índices bem colocados, monitorar queries |
| Custo Supabase cresce | BAIXO | Começar com free tier, avaliar em 3 meses |

---

## 7. CONCLUSÃO

**Loop infinito de autenticação = NextAuth sem persistência de sessão + Vercel cache estático.**

Solução recomendada: **Supabase Auth puro** resolve ambos os problemas com implementação simples e estável. Remove dependência de NextAuth v5 beta e estabelece single source-of-truth para sessões (PostgreSQL no Supabase).

**Aprovação necessária de**: @pm (decision owner) antes de iniciar implementação.

---

*Documento preparado como análise arquitetural. Implementação delegada a @dev após aprovação.*
