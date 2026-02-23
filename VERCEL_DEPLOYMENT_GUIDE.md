# Vercel Deployment Guide - Pós Supabase

**Status**: Supabase adapter integrado e testado localmente
**Próximo Passo**: Deploy em Vercel com Supabase cloud
**ETA**: 30 min

---

## Checklist Pré-Deploy

### Ambiente de Desenvolvimento
```
[ ] npm run build — Passou sem erros
[ ] npm run dev — Servidor rodando
[ ] Login com Google funciona
[ ] Sessão persiste após refresh
[ ] Logout funciona
```

**Verificar com:**
```bash
npm run build  # Deve terminar com "✓ Compiled successfully"
npm run dev    # http://localhost:3000 — testar login
```

---

## Fase 1: Configurar Supabase Cloud (30 min)

### 1.1 Criar Projeto Supabase
1. Abrir https://app.supabase.com
2. "New Project"
3. Nome: `jornada-com-deus-prod`
4. Região: São Paulo (ou sua)
5. Database password: gerar seguro e guardar
6. Esperar ~2 min por criação

### 1.2 Copiar Credentials
Settings → API:
- SUPABASE_URL = `https://[PROJECT-ID].supabase.co`
- SUPABASE_ANON_KEY = copiar key pública
- SUPABASE_SERVICE_ROLE_KEY = copiar key privada

### 1.3 Executar SQL Migrations
1. SQL Editor → New Query
2. Copiar conteúdo de `supabase/migrations/001_create_auth_tables.sql`
3. Executar (Ctrl+Enter)

### 1.4 Configurar Google OAuth
1. Authentication → Providers → Google
2. Client ID: `[SEU_GOOGLE_CLIENT_ID].apps.googleusercontent.com`
3. Client Secret: `[SEU_GOOGLE_CLIENT_SECRET]`
4. Salvar

**IMPORTANTE**: Adicionar URL callback ao Google Cloud:
- Copiar "Callback URL for Google" do Supabase
- Google Cloud Console → OAuth 2.0 Client IDs
- Adicionar à "Authorized redirect URIs"

---

## Fase 2: Adicionar Variáveis ao Vercel

### 2.1 Acessar Vercel Dashboard
https://vercel.com/dashboard/projects/jornada-com-deus/settings/environment-variables

### 2.2 Adicionar Supabase Variables

```
SUPABASE_URL
├─ Tipo: Plain text (não sensível)
├─ Valor: https://[PROJECT-ID].supabase.co
└─ Ambientes: Production, Preview, Development

SUPABASE_ANON_KEY
├─ Tipo: Plain text (ou Secret se preferir)
├─ Valor: eyJhbGc...
└─ Ambientes: Production, Preview, Development

SUPABASE_SERVICE_ROLE_KEY
├─ Tipo: Secret (ENCRIPTADO - CRÍTICO)
├─ Valor: eyJhbGc...
└─ Ambientes: Production (APENAS)
```

**IMPORTANTE**:
- NUNCA expor SUPABASE_SERVICE_ROLE_KEY em Preview/Development
- Usar ANON_KEY em Development
- SERVICE_ROLE_KEY apenas em servidor de produção

### 2.3 Verificar Variáveis Existentes

```
[ ] AUTH_GOOGLE_ID (já deve estar)
[ ] AUTH_GOOGLE_SECRET (já deve estar)
[ ] AUTH_SECRET (já deve estar)
    ↳ Se não: gerar novo com: openssl rand -base64 32
```

### 2.4 Salvar Variáveis
Clicar "Save" — Vercel requer redeploy para aplicar

---

## Fase 3: Deploy em Staging (Preview)

### 3.1 Trigger Deploy
```bash
# Opção A: Merge simples no Git
git add .
git commit -m "feat: add Supabase adapter for session persistence [Deployment]"
git push origin main

# Vercel faz build automático (ou criar PR se usar)
```

### 3.2 Monitorar Build
1. Abrir https://vercel.com/dashboard/projects/jornada-com-deus/deployments
2. Esperar build completar (2-5 min)
3. Se falhar, verificar logs

**Logs úteis**:
```
/function [GET] /api/auth/signin
/function [POST] /api/auth/callback/google
/function [GET] /api/auth/session
```

### 3.3 Testar em Preview
Após deploy, Vercel fornece URL de preview:
```
https://jornada-com-deus-git-main-*.vercel.app
```

**Testes**:
1. Abrir em navegador incógnito
2. Tentar login com Google
3. Verificar se sessão funciona
4. Refresh page — deve manter logado
5. Logout — deve redirecionar

---

## Fase 4: Deploy em Produção

### 4.1 Confirmar Staging OK
```
✅ Login funciona
✅ Sessão persiste
✅ Logout funciona
✅ Nenhum erro no Sentry
```

### 4.2 Fazer Deploy
```bash
# Vercel automatically deploys on main branch
# Se usar button no dashboard:
# Deployments → [Latest Preview] → Promote to Production
```

### 4.3 Testar em Produção
Após deploy (~30 seg):
```
1. Abrir https://app.minhajornadadiaria.com.br
2. Testar login com Google
3. Verificar profile badge mostra nome
4. Refresh — sessão deve persistir
5. Logout — deve redirecionar para login
```

### 4.4 Monitorar Errors
```bash
# Sentry
https://sentry.io/organizations/[ORG]/issues/?project=[PROJECT]

# Vercel Analytics
https://vercel.com/dashboard/projects/jornada-com-deus/analytics

# Supabase Logs
https://app.supabase.com/project/[PROJECT-ID]/logs/postgres-logs
```

---

## Troubleshooting Pós-Deploy

### Erro: "SUPABASE_URL is not set"
```
❌ Solução: Variável não foi adicionada ao Vercel
✅ Adicionar em Vercel Dashboard → Environment Variables
✅ Trigger redeploy: git push ou dashboard button
```

### Erro: "Invalid OAuth state"
```
❌ Solução: Callback URI mismatch
✅ Verificar em Supabase:
   - Ir para Authentication → Providers → Google
   - Copiar "Callback URL for Google"
   - Adicionar ao Google Cloud Console → Authorized redirect URIs
✅ Aguardar ~1 min propagação
✅ Testar novamente
```

### Erro: "Service role key not set"
```
❌ Solução: SERVICE_ROLE_KEY não está configurada (server-side)
✅ Adicionar ao Vercel como Secret
✅ Não incluir em Development (usar ANON_KEY)
✅ Redeploy
```

### Sessão desaparece após deploy
```
❌ Solução: Supabase adapter não está ativo
✅ Verificar: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY configuradas
✅ Verificar: auth.ts possui:
   adapter: SupabaseAdapter({ url, secret })
✅ Redeploy
```

### "Unauthorized" ao acessar rotas protegidas
```
❌ Solução: Middleware não está redirecionando corretamente
✅ Verificar: await auth() em /src/app/page.tsx
✅ Adicionar dynamic='force-dynamic' em páginas protegidas
✅ Verificar: middleware.ts tem rota protegida
```

---

## Rollback de Emergência

Se algo quebrar:

```bash
# Opção 1: Vercel Dashboard
# Deployments → [Previous Working] → "Restore"

# Opção 2: Git
git revert HEAD
git push  # Vercel redeploy automático

# Opção 3: Manual
vercel rollback --confirm
```

---

## Monitoramento Contínuo

### Setup Sentry (Recomendado)
```bash
# 1. Criar conta em sentry.io
# 2. Criar projeto para "Next.js"
# 3. Obter DSN
# 4. Adicionar ao Vercel:
#    SENTRY_DSN=https://...@sentry.io/...
```

### Verificação Diária
```
[ ] Testar login em https://app.minhajornadadiaria.com.br
[ ] Verificar Sentry para Auth errors
[ ] Verificar Supabase para crashes
[ ] Monitor de uptime (StatusPage ou similar)
```

### Backup Automático
Supabase fornece backup automático:
```
Dashboard → Settings → Backups
Backup automático habilitado a cada 24h
Retenção de 7 dias
```

---

## Variáveis de Ambiente - Resumo Final

| Variável | Valor | Tipo | Ambiente |
|----------|-------|------|----------|
| AUTH_GOOGLE_ID | [Google Cloud] | Text | Prod/Preview |
| AUTH_GOOGLE_SECRET | [Google Cloud] | Secret | Prod/Preview |
| AUTH_SECRET | [Novo - openssl rand] | Secret | Prod/Preview |
| SUPABASE_URL | [Supabase Cloud] | Text | Prod/Preview |
| SUPABASE_ANON_KEY | [Supabase API] | Text | Prod/Preview |
| SUPABASE_SERVICE_ROLE_KEY | [Supabase API] | Secret | Prod ONLY |

---

## Checklist Final

```
[ ] Supabase cloud project criado
[ ] SQL migrations executadas
[ ] Google OAuth configurado
[ ] Variáveis adicionadas ao Vercel
[ ] Build local funcionando (npm run build)
[ ] Deploy em staging testado
[ ] Testes em produção passaram
[ ] Sentry configurado (opcional)
[ ] Backup automático confirmado
[ ] Documentação atualizada
[ ] Time notificado sobre deployment
```

---

## Documentação de Referência

- **Setup Supabase**: `./SUPABASE_SETUP.md`
- **Migração de Usuários**: `./scripts/migrate-users-to-supabase.ts`
- **Audit Vercel**: `./VERCEL_AUDIT.md`
- **Action Plan**: `./DEVOPS_ACTION_PLAN.md`

---

**Data**: 22/02/2026
**Responsável**: @devops (infraestrutura)
**Status**: PRONTO PARA IMPLEMENTAÇÃO
