# Auditoria Vercel - Jornada com Deus

**Data**: 22/02/2026
**Status**: CRÍTICO - Autenticação quebrada em produção
**Recomendação**: Implementar Supabase antes de push para produção

---

## 1. Variáveis de Ambiente - Status Atual

### Configuradas Localmente (`.env.local`)
```
✅ AUTH_GOOGLE_ID (Google OAuth - app registration)
✅ AUTH_GOOGLE_SECRET (Google OAuth - app secret)
✅ AUTH_SECRET (NextAuth JWT signing key)
```

### FALTANDO no Vercel Dashboard
```
❌ SUPABASE_URL (não existe ainda)
❌ SUPABASE_ANON_KEY (não existe ainda)
❌ SUPABASE_SERVICE_ROLE_KEY (não existe ainda)
❌ DATABASE_URL (não existe)
```

### Variáveis que DEVEM estar em Vercel (crítico)
Verificar se as seguintes estão configuradas em Vercel Dashboard:
- `AUTH_GOOGLE_ID` - Google OAuth Client ID
- `AUTH_GOOGLE_SECRET` - Google OAuth Client Secret (SENSÍVEL)
- `AUTH_SECRET` - NextAuth JWT secret (SENSÍVEL, gerar novo para Vercel)

**Risco**: Se não configuradas no Vercel, OAuth falhará em produção.

---

## 2. Problemas Identificados

### 2.1 NextAuth v5 Beta (CRÍTICO)
**Arquivo**: `package.json`
**Versão**: `"next-auth": "^5.0.0-beta.30"`

**Problemas**:
- NextAuth v5 ainda em BETA (não recomendado para produção)
- Mudanças breaking entre betas
- Suporte limitado para edge cases
- Session persistence sem BD ainda é experimental

**Recomendação**:
- [ ] Upgrade para v4.24+ (stable) antes de produção, OU
- [ ] Manter v5 beta + implementar Supabase para persistência de sessão

### 2.2 Sem Persistência de Sessão (CRÍTICO)
**Atual**: NextAuth configurado com APENAS JWT (em memória)
**Problema**:
- Sessões não persistem entre deployments
- Usuários ficam deslogados após restart do servidor
- Em Vercel serverless, cada request pode ir pra instância diferente

**Evidência**:
- `auth.config.ts`: Sem database adapter
- `auth.ts`: Sem Prisma/Supabase adapter
- `.env.local`: Sem `DATABASE_URL`

**Impacto em Produção**: CRÍTICO - usuários experenciam logouts aleatórios

### 2.3 Credenciais Locais em Arquivo (INSEGURO)
**Arquivo**: `src/lib/credentials-db.ts` (lê de `data/credentials-users.json`)

**Problemas**:
- Hashes bcrypt armazenados em arquivo JSON no repositório
- Não é escalável (impossível adicionar usuários em produção)
- Exposição se `.gitignore` falhar
- CredentialsProvider configurado apenas no Node.js runtime

**Mitigação**:
- `data/credentials-users.json` adicionado ao `.gitignore` (OK)
- Mas ainda não é adequado para produção

### 2.4 Configuração Edge Runtime vs Node.js (COMPLEXIDADE)
**Problema**: Split entre `auth.config.ts` (Edge) e `auth.ts` (Node.js)

**Motivo**:
- Middleware roda no Edge Runtime (sem `fs`, `bcryptjs`)
- CredentialsProvider precisa de `fs` + `bcryptjs` (Node.js only)
- GoogleProvider roda em ambos

**Risco em Vercel**:
- Middleware bate em edge function (rápido)
- Mas validação de credenciais vai pro Node.js (em caso de auth falhar)
- Pode causar race conditions ou timeouts

### 2.5 Cache Estático em Produção (BLOQUEANTE)
**Evidência** (no AUTH_HOTFIX_STATUS.md):
```
Página HOME está sendo servida como STATIC CACHE (x-nextjs-prerender: 1)
Vercel CDN serve página cacheada ANTES do middleware conseguir redirecionar
```

**Impacto**:
- Usuários não autenticados conseguem ver página home
- Middleware roda mas é tarde demais
- Necessário `export const dynamic = 'force-dynamic'` na home

---

## 3. Estado de Autenticação em Produção

### Último Teste (22/02/2026)
- **URL**: `app.minhajornadadiaria.com.br`
- **Status**: ACESSÍVEL SEM LOGIN
- **Profile Badge**: Mostra "?" ao invés do nome
- **3x Hotfix Commitados**: `9b678b7`, `d902b49`, `84861a7`
- **Não Testado**: Em produção pós-hotfix

---

## 4. Pós-Implementação Supabase - Variáveis Necessárias

Após setup do Supabase, adicionar ao Vercel Dashboard:

### Variables (public, sem sensibilidade)
```
SUPABASE_URL=https://your-project.supabase.co
```

### Secrets (sensível - usar GitHub Actions ou Vercel Secrets)
```
SUPABASE_ANON_KEY=eyJhbGc...       # Client-side key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Server-side key (NUNCA exposar)
```

### Google OAuth (manter atual)
```
AUTH_GOOGLE_ID=1051426960448-...
AUTH_GOOGLE_SECRET=GOCSPX-...      # Gerar novo para Vercel (não reutilizar local)
AUTH_SECRET=novo-secret-para-vercel  # GERAR NOVO (não copiar local)
```

### Database (se for usar PostgreSQL direto)
```
DATABASE_URL=postgresql://user:pass@host/db  # Optional
```

---

## 5. Checklist de Segurança - Variáveis Sensíveis

| Variável | Local | Vercel | GitHub Actions | Risco |
|----------|-------|--------|---|---|
| AUTH_GOOGLE_ID | .env.local | ✅ Config | ❌ Não expo | Médio |
| AUTH_GOOGLE_SECRET | .env.local | ⚠️ Secret | ❌ Não expo | CRÍTICO |
| AUTH_SECRET | .env.local | ⚠️ Secret | ❌ Não expo | CRÍTICO |
| SUPABASE_ANON_KEY | Não existe | ⚠️ Secret | ⚠️ Optional | Baixo |
| SUPABASE_SERVICE_ROLE_KEY | Não existe | ⚠️ Secret | ❌ Não expo | CRÍTICO |

**Ações necessárias**:
- [ ] **Nunca** commitar `.env.local` ao Git
- [ ] **Gerar novos secrets** especificamente para Vercel (não reutilizar desenvolvimento)
- [ ] Usar "Encrypted Secrets" no Vercel Dashboard, não em arquivo
- [ ] GitHub Actions: apenas `SUPABASE_ANON_KEY` e `AUTH_GOOGLE_ID` (se CI precisa)

---

## 6. GitHub Actions & Deployment Pipeline

### Atual
- Não encontrado `github/workflows/` configurado
- Deploy aparenta ser manual ou via Vercel Git sync

### Recomendado (pós-Supabase)
```yaml
# .github/workflows/deploy.yml
env:
  SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
  # NÃO incluir SUPABASE_SERVICE_ROLE_KEY (server-only)
```

---

## 7. Recomendações - Ordem de Implementação

### FASE 1: Imediato (pré-Supabase)
```
1. [ ] Criar novo AUTH_SECRET especificamente para Vercel
2. [ ] Verificar Google OAuth credentials:
       - Estão configuradas em Google Cloud Console?
       - Redirect URIs incluem app.minhajornadadiaria.com.br?
3. [ ] Adicionar variáveis ao Vercel Dashboard (não deixar em branco)
4. [ ] Testar login em desenvolvimento (npm run dev)
5. [ ] Preview deploy no Vercel pré-produção
```

### FASE 2: Implementação Supabase (1-2 dias)
```
1. [ ] Criar projeto Supabase (ou usar VPS existente)
2. [ ] Configurar Supabase Auth (OAuth Google)
3. [ ] Setup banco de dados:
       - Tabela users (id, email, name, avatar)
       - Tabela sessions (para persistência)
4. [ ] Integrar NextAuth + Supabase adapter
5. [ ] Teste em staging (preview.app.minhajornadadiaria.com.br)
6. [ ] Deploy para produção
```

### FASE 3: Segurança Pós-Deploy
```
1. [ ] Ativar "Deployment Protection" no Vercel
2. [ ] Configurar GitHub branch protection (require CI pass)
3. [ ] Setup monitor de segurança (Sentry para Auth errors)
4. [ ] Audit log de logins (Supabase provides this)
5. [ ] Backup automático de BD (Supabase automated)
```

---

## 8. Problemas Conhecidos & Soluções

### Problema 1: "Session not found" após deploy
**Causa**: JWT expirou ou não foi persistido
**Solução**: Implementar Supabase com database adapter
**Workaround temp**: Adicionar `maxAge: 604800` (7 dias) em auth.ts

### Problema 2: "Invalid OAuth state"
**Causa**:
- Mismatch entre `AUTH_GOOGLE_ID` no Google Cloud vs Vercel
- Redirect URI não configurado no Google Cloud
**Solução**:
1. Ir pra Google Cloud Console
2. Verificar OAuth 2.0 Client IDs
3. Confirmar Authorized JavaScript Origins e Redirect URIs
4. Devem incluir `https://app.minhajornadadiaria.com.br`

### Problema 3: "Middleware not redirecting unauthenticated users"
**Causa**: Edge Runtime limitation + static cache
**Solução**:
```typescript
// src/app/page.tsx
export const dynamic = 'force-dynamic';
```

### Problema 4: Users can see app without login
**Causa**: Vercel CDN serving static cache
**Solução**:
- Use `force-dynamic` em pages protegidas
- OU implementar `await auth()` no Server Component
- OU usar middleware com proper cache headers

---

## 9. Recomendação Final (DevOps)

### ❌ NÃO fazer agora
```
- Não fazer push para produção até Supabase estar integrado
- Não reutilizar secrets development em produção
- Não usar CredentialsProvider em produção (arquivo local inseguro)
```

### ✅ Fazer AGORA (pré-Supabase)
```
1. Adicionar variáveis Auth ao Vercel Dashboard
2. Testar Google OAuth em staging
3. Documento de migração Supabase pronto
```

### ✅ Fazer DEPOIS (pós-Supabase)
```
1. Implementar database adapter
2. Setup session persistence
3. Deploy para produção
4. Monitor de auth errors (Sentry)
```

---

## 10. Contato & Escalação

**Status Atual**: BLOQUEADO por falta de persistência de sessão
**Responsável**: @devops (infraestrutura Vercel + secrets)
**Bloqueador Técnico**: Supabase não implementado
**Timeline**: Supabase setup = 1-2 dias, testing = 1 dia

**Próximo Passo**: Aguardar implementação Supabase + migração de NextAuth adapter.

---

**Assinado**: @devops (Gage)
**Última Atualização**: 22/02/2026
