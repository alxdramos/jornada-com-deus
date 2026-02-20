# 📖 Guia de Sincronização de Orações

## ✅ O que foi implementado (Passos 1 e 2)

### 1️⃣ **Script de Sincronização com Google Sheets**

**Arquivo:** `scripts/sync-oracoes.ts`

O script automaticamente:
- ✅ Busca orações do Google Sheets via API
- ✅ Remove tags em colchetes `[como estas]` do texto
- ✅ Gera IDs únicos baseado nos títulos
- ✅ Valida dados (título, texto, audioUrl)
- ✅ Salva em TypeScript (`src/data/oracoes.ts`) e JSON (`public/data/oracoes.json`)

**Como executar manualmente:**
```bash
npm run sync:oracoes
```

### 2️⃣ **Sistema Inteligente de Mapeamento de Imagens**

**Arquivo:** `src/lib/image-mapper.ts`

O mapper:
- ✅ Seleciona imagens aleatoriamente da pasta `Imagens Paisagem/`
- ✅ **Nunca repete** a mesma imagem (memória persistente)
- ✅ Mantém histórico de mapeamentos em `.image-state.json`
- ✅ Associa 1 imagem para background + icon (mesma)
- ✅ Reseta rotação quando todas as imagens foram usadas

**Estado atual (`.image-state.json`):**
- 35 orações mapeadas
- 35 imagens diferentes usadas
- Pronto para novas orações

---

## 📊 Estrutura dos Dados Gerados

### Arquivo: `src/data/oracoes.ts`

```typescript
export interface Oracao {
  id: string;              // "entrega-do-fardo-para-receber-o-jugo-suave-de-jesus"
  titulo: string;          // "Entrega do Fardo para Receber o Jugo Suave de Jesus"
  texto: string;           // Texto SEM tags [como estas]
  audioUrl: string;        // https://r2.dev/Ora_....mp3
  imagem: {
    background: string;    // "creation_2422229105.png"
    icon: string;         // "creation_2422229105.png" (MESMA)
  };
  createdAt: string;       // "2026-02-20T19:20:23.621Z"
  theme: string;           // "default"
}

export const ORACOES: Oracao[] = [...]
export const ORACOES_COUNT = 35
```

### Arquivo: `public/data/oracoes.json`

Cópia pública dos dados em JSON (para APIs/referencias).

### Arquivo: `.image-state.json`

Rastreia quais imagens já foram usadas:
```json
{
  "mappings": [...],        // Cada oração → sua imagem
  "usedImages": [...],      // Imagens já utilizadas
  "availableImages": [...], // Imagens ainda disponíveis
  "lastUpdated": "..."
}
```

---

## 🔄 Fluxo de Sincronização Automática (Próximo Passo)

Será configurado no GitHub Actions (`.github/workflows/sync-oracoes.yml`):

```yaml
# Roda todos os dias às 00:30 (meia-noite)
name: Sync Oracoes Diárias
on:
  schedule:
    - cron: '30 0 * * *'  # UTC (ajuste para seu timezone)
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Sync Oracoes
        run: npm run sync:oracoes
      - name: Commit & Push
        run: |
          git add src/data/oracoes.ts public/data/oracoes.json .image-state.json
          git commit -m "chore: sync oracoes from sheets"
          git push
```

---

## 💾 Credenciais

A chave do Google (Service Account) está em:
- **Local:** `jornada-com-deus/jornadacomdeus-ce9c0e55fc3e.json`
- **Em produção:** Armazenar como `GOOGLE_CREDENTIALS` em secrets do GitHub

---

## 🎨 Próximo Passo (3️⃣)

### Integração no PWA

Será criado:
1. **Componente React** (`src/components/OracaoCard.tsx`)
   - Exibe título, texto, áudio, imagem de fundo
   - Scroll de imagens de fundo enquanto escuta

2. **Hook Zustand** (`src/stores/oracaoStore.ts`)
   - Gerencia estado de orações
   - Sincronização com IndexedDB (Dexie)

3. **Página** (`src/app/oracoes/page.tsx`)
   - Lista de orações com busca/filtro
   - Visualizador de oração individual

---

## 📝 Checklist de Hoje

- [x] Passo 1: Script de sincronização com Google Sheets
  - [x] Cliente Google Sheets API
  - [x] Remoção de tags em colchetes
  - [x] Geração de TypeScript + JSON
  - [x] Testado com sucesso ✅

- [x] Passo 2: Sistema de mapeamento de imagens
  - [x] Seleção aleatória sem repetição
  - [x] Persistência de estado
  - [x] Rotação inteligente
  - [x] Testado com 35 orações ✅

- [ ] Passo 3: Integração no PWA (próximo)
- [ ] Passo 4: GitHub Actions automático (próximo)

---

## 🚀 Quer rodar agora?

```bash
# Sincronizar dados
npm run sync:oracoes

# Resultado:
# ✅ 35 orações sincronizadas
# ✅ Imagens mapeadas
# ✅ TypeScript + JSON gerados
```

---

## 📌 Notas Importantes

1. **Google Sheets:** Coluna C = Título, D = Texto, K = Audio URL
2. **Tags:** Qualquer coisa em `[colchetes]` é removida automaticamente
3. **Imagens:** Devem estar em `/mnt/c/Users/User/Documents/Meu projeto/Imagens Paisagem/`
4. **TypeScript:** Arquivo é **auto-gerado** — NÃO EDITAR MANUALMENTE
5. **Rotação de imagens:** Quando todas as 27 imagens forem usadas, reseta automaticamente

---

**Status:** ✨ Passos 1 e 2 Completos! Pronto para o Passo 3?
