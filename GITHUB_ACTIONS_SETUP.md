# 🚀 Setup do GitHub Actions - Sincronização Automática

## 📋 Configuração Necessária

Para que o GitHub Actions sincronize as orações automaticamente, você precisa adicionar as credenciais do Google como um **Secret** no repositório.

---

## ✅ Passo 1: Preparar a Credencial

Você já tem o arquivo: `jornadacomdeus-ce9c0e55fc3e.json`

**Conteúdo do arquivo (JSON):**
```json
{
  "type": "service_account",
  "project_id": "jornadacomdeus",
  "private_key_id": "...",
  "private_key": "...",
  ...
}
```

---

## ✅ Passo 2: Adicionar Secret no GitHub

### Opção A: Via GitHub Web UI (Mais Fácil)

1. Abra seu repositório no GitHub
2. Vá para **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret**
4. Configure:
   - **Name:** `GOOGLE_CREDENTIALS`
   - **Value:** Cole TODO O CONTEÚDO do arquivo `jornadacomdeus-ce9c0e55fc3e.json`
5. Clique em **Add secret**

### Opção B: Via GitHub CLI (Terminal)

```bash
# Copie o conteúdo do arquivo JSON
cat jornadacomdeus-ce9c0e55fc3e.json | gh secret set GOOGLE_CREDENTIALS
```

---

## 📅 Passo 3: Configurar Horário do Cron Job

O workflow está configurado para rodar às **03:30 UTC** (equivale a **00:30 em Brasília durante horário de verão**)

**Para AJUSTAR O HORÁRIO:**

Edite `.github/workflows/sync-oracoes.yml` e altere a linha:

```yaml
- cron: '30 3 * * *'  # Altere os números
```

**Formato:** `'minuto hora dia-mês dia-semana'` (UTC)

**Exemplos:**
- `'30 0 * * *'` = 00:30 UTC = 21:30 Brasília (verão)
- `'30 3 * * *'` = 03:30 UTC = 00:30 Brasília (verão)
- `'30 2 * * *'` = 02:30 UTC = 23:30 Brasília (verão)

**Ferramentas úteis:**
- [Crontab.guru](https://crontab.guru) - Visualizar em forma legível

---

## 🧪 Passo 4: Testar Manualmente

Antes de esperar o cron automático, teste manualmente:

1. Vá para **Actions** no seu repositório
2. Clique em **Sync Oracoes Diárias**
3. Clique em **Run workflow** → **Run workflow**
4. Monitore a execução em tempo real

---

## 📊 O que Acontece Automaticamente

A cada dia (horário configurado), o workflow:

1. ✅ Faz checkout do código
2. ✅ Instala dependências Node
3. ✅ Carrega credenciais do Google
4. ✅ **Sincroniza** orações do Google Sheets
5. ✅ **Processa** dados (remove tags, mapeia imagens)
6. ✅ **Commita** automaticamente se houver mudanças
7. ✅ **Push** para o repositório

---

## 🔍 Monitorar Execuções

**Ver histórico de execuções:**
1. GitHub → **Actions** → **Sync Oracoes Diárias**
2. Você verá um log de cada execução

**Logs detalhados:**
- Clique em uma execução específica
- Expanda **Sync oracoes from Google Sheets**
- Veja exatamente quantas orações foram sincronizadas

---

## 🚨 Troubleshooting

### "Authentication failed"
**Solução:** Verifique se o secret `GOOGLE_CREDENTIALS` está correto
- Copie TODO o arquivo JSON (incluindo as chaves)
- Verifique se não há espaços em branco extras

### "No changes to commit"
**Solução:** Normal! Significa que:
- As orações no Sheets não foram atualizadas desde a última sincronização
- O workflow rodou mas não houve mudanças

### Workflow não roda
**Solução:**
1. Verifique se `.github/workflows/sync-oracoes.yml` está no repositório
2. GitHub Actions deve estar habilitado em **Settings** → **Actions**
3. Teste manualmente primeiro (Run workflow)

---

## 📝 Ajustar a Frequência

**Para rodar mais vezes por dia:**
```yaml
- cron: '0 0,6,12,18 * * *'  # A cada 6 horas (00:00, 06:00, 12:00, 18:00 UTC)
```

**Para rodar a cada hora:**
```yaml
- cron: '0 * * * *'  # Todos os dias, a cada hora
```

---

## ✨ Após Configurar

Uma vez que está tudo funcionando:

1. **Diariamente** uma nova oração será sincronizada automaticamente
2. O arquivo `src/data/oracoes.ts` será atualizado
3. Imagens serão mapeadas sem repetição
4. Tags `[como estas]` serão removidas automaticamente
5. Tudo será commitado no repositório

**Zero esforço manual!** 🎉

---

## 🔗 Links Úteis

- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [GitHub Actions - Cron Scheduling](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)
- [Crontab.guru](https://crontab.guru) - Validar expressões cron

---

**Próximo passo:** Configure o secret `GOOGLE_CREDENTIALS` e teste!
