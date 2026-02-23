# Vercel Audit Summary - Jornada com Deus

## Status: CRÍTICO - DO NOT DEPLOY YET

---

## Achados Principais

### 1. Sem Persistência de Sessão (BLOQUEADOR)
- NextAuth v5 beta sem database adapter
- Sessões perdidas a cada deploy em Vercel serverless
- **Impacto**: Usuários deslogam aleatoriamente em produção

### 2. Google OAuth não testado em Vercel
- Variáveis podem estar faltando no Vercel Dashboard
- Redirect URIs podem não estar configuradas no Google Cloud
- **Impacto**: "Invalid OAuth state" errors em produção

### 3. Credenciais Locais Inseguras
- Login com email/senha usa arquivo JSON com bcrypt hashes
- Não escalável (impossível adicionar usuários em produção)
- **Impacto**: Impossível onboarding de usuários novo

### 4. Caching Estático Bloqueia Auth
- Página HOME servida como static cache por Vercel
- Middleware roda mas é tarde demais
- **Impacto**: Usuários não autenticados conseguem acessar app

---

## Variáveis de Ambiente - Checklist

### Verificar no Vercel Dashboard Agora
```
✅ AUTH_GOOGLE_ID (Google OAuth Client ID)
✅ AUTH_GOOGLE_SECRET (Google OAuth Client Secret) — SENSÍVEL
✅ AUTH_SECRET (NextAuth JWT key) — SENSÍVEL
```

**Se qualquer uma estiver faltando → Deploy falhará**

### Adicionar Pós-Supabase
```
⏳ SUPABASE_URL
⏳ SUPABASE_ANON_KEY
⏳ SUPABASE_SERVICE_ROLE_KEY (server-only, nunca em público)
```

---

## Roadmap

| Fase | Prioridade | Bloqueador | Timeline |
|------|-----------|-----------|----------|
| **1. Verificar OAuth em Vercel** | CRÍTICO | Setup Google Cloud | 1h |
| **2. Implementar Supabase** | CRÍTICO | Setup BD + adapter | 1-2 dias |
| **3. Teste em Staging** | ALTA | Supabase pronto | 1 dia |
| **4. Deploy Produção** | ALTA | Testes passando | 1h |

---

## Decisão Recomendada

### OPÇÃO A: Rápida (NextAuth + Supabase)
- Implementar Supabase Auth + database adapter
- Manter Google OAuth
- Remover CredentialsProvider (arquivo local)
- Tempo: 2-3 dias
- Risco: Baixo (padrão consolidado)

### OPÇÃO B: Supabase Simples
- Setup Supabase Auth apenas (sem BD)
- Usar para validação de sessão
- Manter storage JSON local por agora
- Tempo: 1-2 dias
- Risco: Médio (sessões ainda podem perder)

### OPÇÃO C: Volta pra v4 Stable
- Downgrade NextAuth para v4.24+
- Remover database adapter
- Confiar em JWT apenas
- Tempo: 2h
- Risco: Alto (problema de sessão persiste)

**Recomendação**: OPÇÃO A (Supabase completo)

---

## Próximo Passo (DevOps)

1. [ ] Abrir Vercel Dashboard
2. [ ] Settings → Environment Variables
3. [ ] Verificar se `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET` estão lá
4. [ ] Se não: Copiar de `.env.local` (GERAR NOVO AUTH_SECRET antes)
5. [ ] Se sim: Testar login em preview deploy
6. [ ] Report resultado para @dev (bloqueador para Supabase)

**ETA**: 1h
**Relatório Completo**: Ver `VERCEL_AUDIT.md`
