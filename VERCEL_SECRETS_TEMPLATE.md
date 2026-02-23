# Vercel Secrets Configuration Template

## Instruções de Setup

1. Abrir: https://vercel.com/dashboard
2. Selecionar projeto: `jornada-com-deus`
3. Settings → Environment Variables
4. Adicionar cada variável abaixo

---

## Variables Necessárias (Copiar + Colar)

### 1. AUTH_SECRET (NOVO - Gerar para Vercel)
```
Nome: AUTH_SECRET
Valor: [Gerar com: openssl rand -base64 32]
Tipo: Secret (encriptado)
Ambientes: Production, Preview, Development
```

**Não copiar do `.env.local`** — gerar novo especificamente para Vercel.

**Gerar via terminal**:
```bash
openssl rand -base64 32
# Saída ex: Yz1nRiWHkFqD5R0bZqKpL8/mT9XsP2jGhYtLpQwXaBE=
```

---

### 2. AUTH_GOOGLE_ID (Do Google Cloud)
```
Nome: AUTH_GOOGLE_ID
Valor: [SEU_GOOGLE_CLIENT_ID].apps.googleusercontent.com
Tipo: Plain text (não é sensível, público)
Ambientes: Production, Preview, Development
```

**Verificar em**: Google Cloud Console → OAuth 2.0 Client IDs

---

### 3. AUTH_GOOGLE_SECRET (SENSÍVEL)
```
Nome: AUTH_GOOGLE_SECRET
Valor: [SEU_GOOGLE_CLIENT_SECRET]
Tipo: Secret (encriptado)
Ambientes: Production, Preview, Development
```

**Verificar em**: Google Cloud Console → OAuth 2.0 Client IDs
**⚠️ NEVER** commitar ao Git

---

## Variáveis Pós-Supabase (Adicionar depois)

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (Server-only, Secret)
```

---

## Validação Checklist

- [ ] AUTH_SECRET adicionada e novo (não copido de local)
- [ ] AUTH_GOOGLE_ID configurada
- [ ] AUTH_GOOGLE_SECRET configurada como Secret
- [ ] Todos em "Production" se deploy é pra produção
- [ ] Redeploy após adicionar variáveis
- [ ] Teste de login em https://app.minhajornadadiaria.com.br

---

## Se Login Falhar

### Erro: "Invalid OAuth state"
1. Ir pra Google Cloud Console
2. Verificar OAuth 2.0 Client IDs
3. Adicionar authorized origin:
   ```
   https://app.minhajornadadiaria.com.br
   ```
4. Adicionar redirect URI:
   ```
   https://app.minhajornadadiaria.com.br/api/auth/callback/google
   ```
5. Salvar e redeployar

### Erro: "Uncaught Error: Session not found"
- Supabase não está implementado ainda
- Próximo passo: integrar database adapter
- Por enquanto: testes em preview apenas

---

## Segurança - Não Fazer

```
❌ Não commitar .env.local ao Git
❌ Não reutilizar secrets development em produção
❌ Não expor SUPABASE_SERVICE_ROLE_KEY (server-only)
❌ Não usar CredentialsProvider (arquivo local) em produção
```

---

**Documento**: Referência para @devops ao configurar Vercel
**Data**: 22/02/2026
**Status**: Pre-deployment (aguardando Supabase)
