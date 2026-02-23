# Supabase Setup Guide

**Status**: Supabase adapter integrado em auth.ts + schema pronto
**Tempo Estimado**: 15-30 min (cloud) ou 30-45 min (self-hosted)

---

## OPÇÃO 1: Supabase Cloud (Recomendado - Mais Rápido)

### Passo 1.1: Criar Projeto Supabase
1. Ir para: https://app.supabase.com
2. Clicar "New Project"
3. Nome: `jornada-com-deus`
4. Região: `South America - São Paulo` (ou sua preferência)
5. Database password: Gerar seguro (guardar em local seguro)
6. Clicar "Create new project" — leva ~2 min

### Passo 1.2: Copiar Credenciais
Após projeto criado, ir para Settings → API:

```
SUPABASE_URL = https://[PROJECT-ID].supabase.co
SUPABASE_ANON_KEY = eyJhbGc...  (Anon/Public key)
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc... (Service Role key)
```

### Passo 1.3: Executar Migrations SQL
1. Abrir Supabase Dashboard
2. SQL Editor → Nova query
3. Copiar conteúdo de `supabase/migrations/001_create_auth_tables.sql`
4. Colar na query editor
5. Clicar "Run" (ctrl+Enter)

**Esperado**: Todas as queries rodam sem erro

### Passo 1.4: Configurar Google OAuth no Supabase
1. Dashboard → Authentication → Providers
2. Google → Enable
3. Client ID: `[SEU_GOOGLE_CLIENT_ID].apps.googleusercontent.com`
4. Client Secret: `[SEU_GOOGLE_CLIENT_SECRET]`
5. Authorized redirect URLs (Supabase fornece uma específica)
6. Salvar

**IMPORTANTE**: Adicionar URL de callback do Supabase ao Google Cloud Console:
- Copiar URL callback do Supabase
- Ir para Google Cloud Console → OAuth 2.0 Client IDs
- Adicionar à "Authorized redirect URIs"

### Passo 1.5: Atualizar .env.local
```bash
SUPABASE_URL="https://[PROJECT-ID].supabase.co"
SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."
```

### Passo 1.6: Testar em Desenvolvimento
```bash
npm run dev
# Ir para http://localhost:3000
# Clicar em "Sign in with Google"
# Verificar se login funciona
```

**Esperado**:
- ✅ Redirecionamento para Google login
- ✅ Após autenticação, volta para home
- ✅ Profile badge mostra nome do usuário
- ✅ Refresh page → ainda logado (sessão persistida)

---

## OPÇÃO 2: Supabase Self-Hosted (VPS)

Se a infraestrutura já existe (VPS com Docker):

### Passo 2.1: Deploy Supabase via Docker
```bash
# Clone Supabase repo
git clone --depth 1 https://github.com/supabase/supabase.git
cd supabase/docker

# Copiar example env
cp .env.example .env

# Editar .env (opcional)
# - POSTGRES_PASSWORD
# - JWT_SECRET
# - etc

# Start containers
docker-compose up -d

# Aguarde ~1 min
```

### Passo 2.2: Acessar Supabase Self-Hosted
```
URL: http://localhost:3000
Usuário: admin@example.com
Senha: [configurada em .env]
```

### Passo 2.3: Executar Migrations
Mesmo que OPÇÃO 1 (Passo 1.3)

### Passo 2.4: Configurar Google OAuth
Mesmo que OPÇÃO 1 (Passo 1.4) — mas usar URL do seu VPS

---

## Troubleshooting

### Erro: "SUPABASE_URL not set"
```
❌ Solução: Adicionar SUPABASE_URL ao .env.local
✅ Verificar: echo $SUPABASE_URL
```

### Erro: "Auth tables don't exist"
```
❌ Solução: SQL migration não foi executada
✅ Ir para Supabase Dashboard → SQL Editor
✅ Executar todas as queries de 001_create_auth_tables.sql
```

### Erro: "Invalid OAuth state"
```
❌ Solução: Redirect URI mismatch no Google Cloud Console
✅ Adicionar URL de callback do Supabase:
   https://[PROJECT-ID].supabase.co/auth/v1/callback?provider=google
```

### Erro: "Service role key missing"
```
❌ Solução: SUPABASE_SERVICE_ROLE_KEY não está em .env.local
✅ Verificar: echo $SUPABASE_SERVICE_ROLE_KEY
✅ Copiar de Supabase Dashboard → Settings → API → Service Role
```

### Session não persiste após refresh
```
❌ Solução: Adapter não está sendo usado corretamente
✅ Verificar em auth.ts:
   - adapter: SupabaseAdapter({ url, secret })
   - SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY configuradas
```

---

## Verificação Pós-Setup

### Checklist de Funcionalidade
```
[ ] Login com Google funciona
[ ] Sessão persiste após refresh (F5)
[ ] Profile badge mostra nome do usuário
[ ] Logout funciona
[ ] Voltar a acessar app redireciona para login
```

### Verificação no Banco de Dados
No Supabase SQL Editor:
```sql
-- Ver usuários criados
SELECT id, email, name, created_at FROM public.users;

-- Ver contas OAuth
SELECT user_id, provider, created_at FROM public.accounts;

-- Ver sessões ativas
SELECT user_id, expires FROM public.sessions WHERE expires > NOW();
```

---

## Próximos Passos

### Se Usando Supabase Cloud
1. [ ] Adicionar custom domain (opcional)
2. [ ] Setup backup automático
3. [ ] Configurar alertas de erros
4. [ ] Upgrade plano se necessário

### Se Usando Self-Hosted
1. [ ] Setup SSL/TLS
2. [ ] Configurar backup automático
3. [ ] Monitorar storage
4. [ ] Planejar escalabilidade

### Ambos
1. [ ] Adicionar SUPABASE_* vars ao Vercel Dashboard
2. [ ] Testar deploy em preview
3. [ ] Deploy em produção
4. [ ] Monitorar Auth errors (Sentry)

---

## Arquivo de Schema SQL

A schema está em: `supabase/migrations/001_create_auth_tables.sql`

Contém:
- ✅ Tabela `users` (com RLS)
- ✅ Tabela `accounts` (OAuth providers)
- ✅ Tabela `sessions` (NextAuth sessions)
- ✅ Tabela `verification_tokens`
- ✅ Indexes para performance
- ✅ Trigger para updated_at

---

## Comando Rápido (Atalho)

Se já tem tudo configurado e quer pular checklist:

```bash
# Dev
npm run dev

# Test em preview
npm run build && npm run start

# Submit env vars pro Vercel
vercel env pull

# Edit e push
vercel env push SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY
```

---

**Data**: 22/02/2026
**Status**: PRONTO PARA IMPLEMENTAÇÃO
**Responsável**: @devops (setup) + @dev (testes)
