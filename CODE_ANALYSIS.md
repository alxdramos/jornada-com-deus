# Análise de Código: Arquitetura de Autenticação

**Data**: 2026-02-22
**Contexto**: NextAuth v5 beta + armazenamento em arquivo local (fs) + Vercel

---

## 1. PROBLEMA CRÍTICO IDENTIFICADO

### Raiz Causa
A aplicação usa **NextAuth v5 com CredentialsProvider que depende de `fs` (Node.js)**. Em produção no Vercel, `fs` não é suportado em Edge Runtime, causando falha silenciosa na autenticação.

**Sintomas**:
- Usuários acessam app sem autenticação (sem sessão)
- Profile mostra "?" em vez do nome
- Middleware redireciona, mas página cacheada serve antes

---

## 2. ARQUIVOS AFETADOS E DEPENDÊNCIAS

### 2.1 Arquivos com Problemas CRÍTICOS

| Arquivo | Problema | Tipo | Impacto |
|---------|----------|------|--------|
| **src/auth.ts** | CredentialsProvider usa `fs` + `bcryptjs` | NODE ONLY | Login quebrado em produção |
| **src/lib/credentials-db.ts** | Lê/escreve arquivo JSON com `fs.readFileSync/writeFileSync` | NODE ONLY | Sem persistência em Vercel |
| **src/app/actions/register.ts** | Chama `createCredentialUser()` (fs-based) | NODE ONLY | Registro quebrado em produção |

### 2.2 Arquivos com Problemas MODERADOS

| Arquivo | Problema | Tipo | Impacto |
|---------|----------|------|--------|
| **src/middleware.ts** | Não consegue validar sessão se NextAuth falhar | SIDE-EFFECT | Proteção de rotas falha |
| **src/app/page.tsx** | `await auth()` + `redirect()` funcionam, mas dependem de NextAuth funcionar | DEPENDENCY | Proteção bypassed se auth falhar |
| **src/auth.config.ts** | GoogleProvider OK, mas sem fallback se `fs` falha | PARTIAL | Google OAuth funciona, credentials não |

### 2.3 Arquivos SEM PROBLEMAS

| Arquivo | Status | Observações |
|---------|--------|-------------|
| **src/app/login/page.tsx** | OK | Renderiza formulários (Google + Credentials) |
| **src/app/register/page.tsx** | Depende de action | Depende de `registerUser` funcionar |
| **next-auth.d.ts** | OK | Tipagem correta |
| **env.example** | OK | Documenta vars necessárias |

---

## 3. ANÁLISE TÉCNICA DETALHADA

### 3.1 Fluxo de Autenticação Atual

```
Login (client)
  → CredentialsLoginForm.tsx
  → signIn("credentials", {email, password})
  → NextAuth handlers
  → CredentialsProvider.authorize()
  → verifyCredentials() [fs-based]
  → bcrypt.compare()
  → JSON.parse(fs.readFileSync()) ← FALHA EM VERCEL
```

**Por que falha**:
- Vercel Edge Runtime não permite `fs` imports
- O arquivo `data/credentials-users.json` não existe em produção
- bcryptjs também não pode ser usado em Edge Runtime

### 3.2 Fluxo GoogleOAuth (Funciona)

```
Login (client)
  → signIn("google")
  → GoogleProvider em auth.config.ts
  → OAuth redirect → Google
  → Callback → NextAuth JWT (stateless) ✅
```

**Por que funciona**: GoogleProvider não usa `fs` ou módulos Node.js bloqueados.

### 3.3 Problema de Persistência de Sessão

**NextAuth precisa de UMA destas opções:**

```javascript
// OPÇÃO A: Database (PostgreSQL, MongoDB, etc.)
// Salva sessões/tokens em DB
export const authOptions = {
  providers: [...],
  adapter: PostgresAdapter(), // ou outro adapter
}

// OPÇÃO B: JWT (stateless)
// Codifica dados na sessão JWT
export const authOptions = {
  providers: [...],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
}

// OPÇÃO C: Arquivo local (desenvolvimento apenas)
// ❌ NÃO FUNCIONA EM VERCEL (fs bloqueado)
```

**Status Atual**: Nenhuma das 3 opções está CORRETAMENTE configurada
- GoogleProvider tenta JWT, mas sem `AUTH_SECRET`
- CredentialsProvider usa arquivo JSON (não escalável)
- Sem adapter de DB

---

## 4. IMPACTO NA ARQUITETURA

### 4.1 Segurança

| Aspecto | Status | Risco |
|---------|--------|-------|
| Senhas bcryptadas | ✅ | Baixo (bcrypt com custo 12) |
| CORS/CSRF | ⚠️ | Médio (dependente de config) |
| Persistência segura | ❌ | CRÍTICO (arquivo visível em git) |
| JWT sem secret | ❌ | CRÍTICO (sessão pode ser forjada) |

### 4.2 Escalabilidade

| Aspecto | Status | Problema |
|---------|--------|----------|
| Deploy em Vercel | ❌ | `fs` bloqueado |
| Multi-region | ❌ | Arquivo JSON não sincroniza |
| Suporta Google OAuth | ✅ | Funciona |
| Suporta Credentials | ❌ | Quebrado em produção |

### 4.3 Fluxo de Autenticação

```
CLIENTE                    SERVIDOR (Vercel)              VERCEL EDGE
┌─────────────────────┐    ┌──────────────────┐          ┌─────────┐
│ Login Form          │    │ CredentialsAuth  │          │Middleware
│ (email+password)    │───▶│ authorize()      │──────────▶│         │
└─────────────────────┘    │ fs.readFileSync()│          │ Falha   │
                           │ ❌ BLOQUEADO     │          └─────────┘
                           └──────────────────┘
```

---

## 5. CÓDIGO QUE PRECISA SER REESCRITO

### 5.1 src/auth.ts — REMOVER CredentialsProvider

**Linhas 20-45**: CredentialsProvider inteiro
```typescript
// ❌ REMOVE ISTO:
CredentialsProvider({
  name: "Credenciais",
  credentials: { ... },
  async authorize(credentials) {
    const user = await verifyCredentials(...); // fs-based
    ...
  }
})
```

**Motivo**: Depende de `fs` que não existe em Vercel

### 5.2 src/lib/credentials-db.ts — DELETAR OU REESCREVER

**Inteiro arquivo** (112 linhas):
- Linhas 12-50: I/O com `fs.readFileSync` / `fs.writeFileSync`
- Linhas 34-42: `readUsers()` lê JSON
- Linhas 44-50: `writeUsers()` escreve JSON

**Substituir por**:
- PostgreSQL adapter (Supabase, neon.tech)
- MongoDB (Atlas)
- Firebase Auth

### 5.3 src/app/actions/register.ts — REFATORAR

**Linha 3**: `import { createCredentialUser }`
```typescript
import { createCredentialUser } from "@/lib/credentials-db"; // ❌ fs-based
```

**Linha 41**: `await createCredentialUser({...})`

**Solução**: Delegar para DB provider ou remover

### 5.4 src/auth.config.ts — ADICIONAR JWT SECRET

**Faltam linhas**:
```typescript
export const authConfig: NextAuthConfig = {
  providers: [...],

  // ❌ FALTA ISTO:
  secret: process.env.AUTH_SECRET, // Para JWT stateless

  session: {
    strategy: "jwt", // Necessário para stateless
  },

  // ... rest
}
```

---

## 6. VARIÁVEIS DE AMBIENTE FALTANTES

**Arquivo**: `.env` (não existe) ou `.env.local`

**Variáveis necessárias em produção:**

```bash
# NextAuth JWT
AUTH_SECRET=<random-string-64-chars>      # ❌ Falta

# Google OAuth
AUTH_GOOGLE_ID=<from-google-cloud>        # ✅ Deve existir
AUTH_GOOGLE_SECRET=<from-google-cloud>    # ✅ Deve existir

# Database (se escolhido)
DATABASE_URL=<postgresql-ou-mongodb>      # ❌ Falta

# NextAuth URL (produção)
NEXTAUTH_URL=https://app.minhajornadadiaria.com.br
```

---

## 7. CAMINHOS DE SOLUÇÃO

### Opção A: PostgreSQL via Supabase (Recomendado)
- Migrar `credentials-db.ts` para Supabase Auth
- Manter GoogleProvider
- Adicionar JWT secret
- Tempo: ~4 horas

**Impacto em Código:**
- DELETE: `src/lib/credentials-db.ts` (112 linhas)
- DELETE: `src/auth.ts` CredentialsProvider (25 linhas)
- MODIFY: `src/auth.config.ts` (adicionar adapter)
- MODIFY: `src/app/actions/register.ts` (chamar Supabase)

### Opção B: Firebase Auth (Mais rápido)
- Google OAuth + Firebase email/password
- Sem banco de dados próprio
- Tempo: ~3 horas

**Impacto em Código:**
- REWRITE: `src/auth.ts` (usar FirebaseProvider)
- DELETE: `src/lib/credentials-db.ts`
- MODIFY: `src/app/actions/register.ts`

### Opção C: NextAuth JWT + OAuth Only (Mínimo)
- Remover CredentialsProvider
- Apenas Google OAuth + JWT
- Sem registro local
- Tempo: ~1 hora

**Impacto em Código:**
- DELETE: `src/lib/credentials-db.ts` (112 linhas)
- DELETE: `src/auth.ts` CredentialsProvider (25 linhas)
- DELETE: `src/app/register` (página inteira)
- DELETE: `src/app/actions/register.ts` (49 linhas)
- MODIFY: `src/auth.config.ts` (adicionar JWT secret)

---

## 8. RESUMO DE MUDANÇAS NECESSÁRIAS

### Arquivos que DEVEM SER MODIFICADOS

```
src/
├── auth.ts                           [CRÍTICO: remover CredentialsProvider]
├── auth.config.ts                    [CRÍTICO: adicionar JWT secret + adapter]
├── middleware.ts                     [MODERADO: manter/testar]
├── app/
│   ├── page.tsx                      [OK: mantém logicamente]
│   ├── login/page.tsx                [Ajustar conforme solução]
│   ├── register/page.tsx             [Remover se Opção C]
│   └── actions/register.ts           [Remover se Opção C]
└── lib/
    ├── credentials-db.ts             [CRÍTICO: DELETAR ou migrar]
    └── credentials-db.test.ts        [Remover junto]
```

### Impacto Total de Código

| Ação | Linhas | Arquivos |
|------|--------|----------|
| DELETE | ~187 | 3 arquivos |
| MODIFY | ~150 | 4 arquivos |
| ADD | ~80 | 1-2 arquivos |
| **TOTAL** | **~417** | **8 arquivos** |

---

## 9. SEQUÊNCIA DE IMPLEMENTAÇÃO

1. **[FASE 1] Escolher solução** (Opção A/B/C)
2. **[FASE 2] Configurar provider** (Supabase/Firebase/JWT)
3. **[FASE 3] Deletar código fs-based** (credentials-db.ts, CredentialsProvider)
4. **[FASE 4] Refatorar login/register** (adaptar UI se necessário)
5. **[FASE 5] Testar em produção** (Vercel staging)
6. **[FASE 6] Deploy** (com novo AUTH_SECRET no Vercel)

---

## 10. REFERÊNCIAS

**Documentação**:
- [NextAuth.js v5 - Providers](https://authjs.dev/getting-started/providers)
- [NextAuth.js - Databases](https://authjs.dev/getting-started/database)
- [NextAuth.js - JWT](https://authjs.dev/getting-started/session-management)

**Vercel Constraints**:
- Edge Runtime bloqueia: `fs`, `path`, `child_process`
- Node.js Runtime permite tudo, mas é mais lento

---

## Conclusão

**Status**: BLOQUEADOR CRÍTICO para produção

A arquitetura atual funciona em **desenvolvimento local** (Node.js), mas **FALHA em Vercel** (Edge Runtime bloqueia `fs`). A aplicação precisa de uma das 3 soluções acima para permitir autenticação em produção.

**Tempo estimado para correção**: 3-4 horas (dependendo de solução escolhida)

**Risco de não corrigir**: Usuários em produção sem autenticação real, profile vazio, loop de redirecionamento infinito.
