# Infrastructure & Configuration Links

## Production URLs

| Serviço | URL | Status |
|---------|-----|--------|
| **Main App** | https://app.minhajornadadiaria.com.br | 🔴 Auth broken |
| **Preview Deploy** | https://jornada-com-deus-git-*.vercel.app | Staging |
| **GitHub Repo** | https://github.com/[user]/jornada-com-deus | Source |

---

## DevOps Dashboards

### Vercel
- **Project Settings**: https://vercel.com/dashboard/projects/jornada-com-deus/settings
  - Environment Variables: `/settings/environment-variables`
  - Deployments: `/deployments`
  - Integrations: `/integrations`

### Google Cloud
- **OAuth 2.0 Credentials**: https://console.cloud.google.com/apis/credentials
  - Verify redirect URIs
  - Check Client IDs/Secrets
  - Monitor API quota

### GitHub
- **Repository Settings**: https://github.com/[user]/jornada-com-deus/settings
  - Secrets: `/settings/secrets/actions`
  - Deploy keys: `/settings/keys`
  - Branch protection: `/settings/branches`

---

## Supabase (TBD)

- **Project URL**: [To be created]
- **Database Connection**: [To be configured]
- **Auth Configuration**: [To be setup]

---

## Credentials Locations

| Secret | Location | Sensitivity |
|--------|----------|-------------|
| AUTH_GOOGLE_ID | Vercel Env (public) | Medium |
| AUTH_GOOGLE_SECRET | Vercel Secrets | CRITICAL |
| AUTH_SECRET | Vercel Secrets | CRITICAL |
| SUPABASE_SERVICE_ROLE_KEY | Server-only | CRITICAL |
| SUPABASE_ANON_KEY | Client + Server | Medium |

---

## Quick Actions (DevOps)

### Check Vercel Env Vars
```bash
# Access: https://vercel.com/dashboard/projects/jornada-com-deus/settings/environment-variables
# Required:
# - AUTH_GOOGLE_ID
# - AUTH_GOOGLE_SECRET
# - AUTH_SECRET
```

### Test Production URL
```bash
curl -I https://app.minhajornadadiaria.com.br
# Check response headers for:
# - Cache-Control (should NOT be public if protected)
# - Set-Cookie (NextAuth session cookie)
# - X-Nextjs-Prerender (if cached)
```

### Trigger Preview Deploy
```bash
# Merge to main or create PR
# Vercel auto-builds preview
# Check: https://vercel.com/dashboard/projects/jornada-com-deus/deployments
```

---

## Emergency Contacts

| Role | Contact | When |
|------|---------|------|
| DevOps Lead | @devops | Vercel/infra issues |
| Security | [TBD] | Auth/secrets breach |
| Database | [TBD] | Supabase setup |

---

## Documentation

| Doc | Location | Purpose |
|-----|----------|---------|
| **Audit Report** | `./VERCEL_AUDIT.md` | Full findings |
| **Summary** | `./VERCEL_AUDIT_SUMMARY.md` | Quick reference |
| **Secrets Template** | `./VERCEL_SECRETS_TEMPLATE.md` | Setup instructions |
| **Auth Hotfix** | `./AUTH_HOTFIX_STATUS.md` | Previous attempts |

---

**Last Updated**: 22/02/2026
**Owner**: @devops (Gage)
