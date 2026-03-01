# Vercel Environment Variables — Template Atual

> **Atualizado em 01/03/2026** — Sistema usa Supabase Auth (não mais NextAuth standalone).

## Como Configurar

1. Abrir: https://vercel.com/dashboard
2. Selecionar projeto: `jornada-com-deus`
3. Settings → Environment Variables
4. Adicionar cada variável abaixo

---

## ✅ Variáveis Necessárias (Estado Atual)

### Supabase (obrigatório)
```
NEXT_PUBLIC_SUPABASE_URL         → https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY    → eyJhbGc... (Project Settings > API > anon key)
SUPABASE_SERVICE_ROLE_KEY        → eyJhbGc... (Secret — Server-side only, NUNCA expor)
```

### Web Push VAPID (obrigatório para notificações)
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY     → Chave pública VAPID (gerada com npx web-push generate-vapid-keys)
VAPID_PRIVATE_KEY                → Chave privada VAPID (Secret)
VAPID_EMAIL                      → mailto:contato@minhajornadadiaria.com.br
```

Gerar chaves VAPID:
```bash
npx web-push generate-vapid-keys
```

### Hotmart (obrigatório para monetização)
```
HOTMART_HOTTOK                   → Token de validação de webhooks (Hotmart Dashboard > Webhooks)
NEXT_PUBLIC_HOTMART_CHECKOUT_URL → https://pay.hotmart.com/... (link do produto)
HOTMART_WEBHOOK_SECRET           → Secret HMAC-SHA256 opcional (X-Hotmart-Signature) — camada extra de segurança
```

---

## Checklist de Configuração

- [ ] NEXT_PUBLIC_SUPABASE_URL configurada (Production + Preview + Development)
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY configurada
- [ ] SUPABASE_SERVICE_ROLE_KEY configurada como Secret (Production only)
- [ ] NEXT_PUBLIC_VAPID_PUBLIC_KEY configurada
- [ ] VAPID_PRIVATE_KEY configurada como Secret
- [ ] VAPID_EMAIL configurada
- [ ] HOTMART_HOTTOK configurada como Secret
- [ ] NEXT_PUBLIC_HOTMART_CHECKOUT_URL configurada
- [ ] HOTMART_WEBHOOK_SECRET configurada como Secret (opcional — HMAC-SHA256)
- [ ] Redeploy após adicionar variáveis
- [ ] Testar login em https://app.minhajornadadiaria.com.br
- [ ] Testar push notification no painel admin
- [ ] Testar checkout Hotmart (sandbox)

---

## Onde obter os valores

| Variável | Onde encontrar |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Supabase Dashboard → Project Settings → API |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase Dashboard → Project Settings → API |
| SUPABASE_SERVICE_ROLE_KEY | Supabase Dashboard → Project Settings → API |
| NEXT_PUBLIC_VAPID_PUBLIC_KEY | `npx web-push generate-vapid-keys` |
| VAPID_PRIVATE_KEY | `npx web-push generate-vapid-keys` |
| HOTMART_HOTTOK | Hotmart Dashboard → Ferramentas → Webhooks |
| NEXT_PUBLIC_HOTMART_CHECKOUT_URL | Hotmart Dashboard → Produtos → Link de compra |
| HOTMART_WEBHOOK_SECRET | Gerado manualmente — qualquer string segura aleatória (opcional) |

---

## Webhook Hotmart — URL para configurar na Hotmart

```
https://app.minhajornadadiaria.com.br/api/webhooks/hotmart
```

Eventos a ativar:
- `PURCHASE_APPROVED`
- `PURCHASE_REFUNDED`
- `PURCHASE_CANCELED`
- `PURCHASE_CHARGEBACK`
- `SUBSCRIPTION_CANCELLATION`

---

## Autenticação Google OAuth — Configuração no Supabase

A autenticação Google é configurada **no Supabase Dashboard** (não no Vercel):

1. Supabase Dashboard → Authentication → Providers → Google
2. Habilitar Google OAuth
3. Inserir Client ID e Client Secret do Google Cloud Console
4. Callback URL: `https://[project-id].supabase.co/auth/v1/callback`
5. No Google Cloud Console: adicionar `https://[project-id].supabase.co/auth/v1/callback` como Redirect URI

---

*Última atualização: 01/03/2026*
