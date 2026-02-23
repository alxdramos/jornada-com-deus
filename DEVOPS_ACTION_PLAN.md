# DevOps Action Plan - Imediato

**Responsável**: @devops (Gage)
**Urgência**: CRÍTICO - Não fazer deploy até resolver
**Tempo Estimado**: 1h (verificação) + 2-3 dias (Supabase)

---

## AÇÃO 1: Verificar OAuth no Vercel (1 hora)

### Passo 1.1: Acessar Vercel
```
1. Abrir: https://vercel.com/dashboard
2. Clicar em projeto: jornada-com-deus
3. Ir para: Settings → Environment Variables
```

### Passo 1.2: Verificar variáveis existentes
Procurar por:
- [ ] `AUTH_GOOGLE_ID` — Deve conter Client ID
- [ ] `AUTH_GOOGLE_SECRET` — Deve ser marcado como Secret
- [ ] `AUTH_SECRET` — Deve ser marcado como Secret

**Se faltando alguma**:
```
1. Copiar de .env.local (TEMPORÁRIO)
2. Gerar novo AUTH_SECRET: openssl rand -base64 32
3. Adicionar ao Vercel como Secret
4. Trigger redeploy
```

### Passo 1.3: Verificar Google Cloud OAuth
```
1. Abrir: https://console.cloud.google.com/apis/credentials
2. Procurar: OAuth 2.0 Client IDs
3. Verificar se consta o Client ID de desenvolvimento
4. ADICIONAR origem autorizada:
   - Authorized JavaScript Origins:
     * https://app.minhajornadadiaria.com.br
   - Authorized redirect URIs:
     * https://app.minhajornadadiaria.com.br/api/auth/callback/google
5. Salvar
```

### Passo 1.4: Testar login em preview
```
1. Fazer merge para main (ou criar PR simples)
2. Vercel faz deploy automático
3. Copiar URL de preview (ex: https://jornada-com-deus-git-*.vercel.app)
4. Testar login com Google:
   - Clicar em "Sign in with Google"
   - Verificar se redireciona pra Google
   - Após login, verificar se sessão funciona
```

### Resultado esperado
```
✅ Logo funciona: Continuar pra Fase 2
❌ Erro "Invalid OAuth state": Ajustar Google Cloud (Step 1.3)
❌ Erro "Session not found": Normal — Supabase não implementado ainda
```

---

## AÇÃO 2: Implementar Supabase (2-3 dias)

### Contexto
- NextAuth v5 sem persistência de sessão = usuários deslogam após deploy
- Supabase resolve isso com database adapter
- Requer migração de NextAuth config

### Passo 2.1: Setup Supabase
```
[ ] Opção A: Cloud (https://supabase.com)
    - Criar novo projeto
    - Copiar SUPABASE_URL e SUPABASE_ANON_KEY

[ ] Opção B: Self-hosted (VPS)
    - Usar infraestrutura existente
    - Configurar PostgreSQL + auth
```

### Passo 2.2: Adicionar variáveis ao Vercel
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...     (Secret, server-only)
```

### Passo 2.3: Integrar NextAuth + Supabase
**Dev faz**: Migrar `auth.ts` para usar Supabase adapter
- Instalar `@auth/supabase-adapter`
- Atualizar `auth.ts` com adapter
- Testar em desenvolvimento

### Passo 2.4: Deploy em staging
```
1. Merge para branch staging
2. Preview deploy em Vercel
3. Testar login + logout
4. Verificar sessão persiste após refresh
```

### Passo 2.5: Deploy em produção
```
1. Merge para main
2. Production deployment
3. Monitor Sentry para Auth errors
4. Verificar nenhum usuário deslogou
```

---

## AÇÃO 3: Monitoramento Pós-Deploy (Contínuo)

### Setup Sentry (opcional mas recomendado)
```
1. Conectar Sentry ao Vercel
2. Monitorar Auth errors em https://app.minhajornadadiaria.com.br
3. Alertas se login falhar > 5% requests
```

### Verificação mensal
```
- [ ] Testar login com Google
- [ ] Verificar no Supabase se usuários estão sendo criados
- [ ] Checar logs de sessão expirada
- [ ] Validar secrets ainda estão configuradas (Vercel pode resetar)
```

---

## Checklist de Bloqueadores

Atual status:

| Bloqueador | Status | Ação |
|-----------|--------|------|
| OAuth vars em Vercel | ⚠️ Desconhecido | ➜ AÇÃO 1 |
| Google Cloud config | ⚠️ Desconhecido | ➜ AÇÃO 1 |
| Supabase | ❌ Não existe | ➜ AÇÃO 2 |
| NextAuth adapter | ❌ Não existe | ➜ AÇÃO 2 (dev) |
| Deploy produção | 🚫 BLOQUEADO | ➜ Após AÇÃO 1 + 2 |

---

## Fallback / Rollback

Se algo der errado:

```bash
# Rollback para último deploy sem auth
vercel rollback

# Ou fazer revert do commit que quebrou
git revert <commit-hash>
git push
```

---

## Timeline Recomendada

```
22/02 (hoje)   → AÇÃO 1 (Verificação OAuth)    [1h]
22/02-24/02    → AÇÃO 2 (Supabase setup)       [2-3 dias]
24/02          → Teste em staging               [2h]
24/02 noite    → Deploy produção               [1h]
25/02+         → AÇÃO 3 (Monitoramento)        [Ongoing]
```

---

## Documentação de Referência

- **Audit Report**: `/VERCEL_AUDIT.md` (findings detalhados)
- **Summary**: `/VERCEL_AUDIT_SUMMARY.md` (quick ref)
- **Secrets Setup**: `/VERCEL_SECRETS_TEMPLATE.md` (instruções)
- **Links**: `/INFRASTRUCTURE_LINKS.md` (dashboards)
- **Auth Hotfix**: `/AUTH_HOTFIX_STATUS.md` (histórico)

---

**Assinado**: @devops
**Data**: 22/02/2026
**Status**: PRONTO PARA AÇÃO 1
