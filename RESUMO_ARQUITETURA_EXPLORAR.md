# Resumo Executivo: Adicionar Meditações do Google Sheets na Aba Explorar

**Data:** 22 de Fevereiro de 2026
**Arquiteto:** Aria (@architect)
**Escopo:** Sincronizar TODAS as meditações do Google Sheets para aba "Explorar"

---

## 🎯 Objetivo (Corrigido)

**NÃO é:** Adicionar 17 meditações + manter 6-8 hardcoded
**É:** Sincronizar 100% das meditações do Google Sheets e deletar os exemplos hardcoded

```
Situação Atual
├─ TabExplorar.tsx (funcional)
├─ MeditationCard.tsx (funcional)
├─ src/data/meditacoes.ts (com ~6-8 exemplos TEMPORÁRIOS)
└─ AllContentModal.tsx (funcional)

Após Implementação
├─ TabExplorar.tsx (sem mudanças)
├─ MeditationCard.tsx (sem mudanças)
├─ src/data/meditacoes.ts (100% GOOGLE SHEETS, nenhum hardcoding)
└─ AllContentModal.tsx (sem mudanças)
```

---

## 📊 Escopo de Dados

| Item | Antes | Depois |
|------|-------|--------|
| **Fonte** | Hardcoded em meditacoes.ts | Google Sheets (dinâmico) |
| **Quantidade** | ~6-8 (exemplos) | N (todas do Sheets) |
| **Atualização** | Manual (editar TS) | Automática (sync script) |
| **Deletar** | Não | Sim (hardcoded) |

---

## 🔄 Fluxo de Implementação

```
FASE 1: Sincronização (1-2h)
└─ Criar scripts/sync-meditacoes.ts
└─ Mapear colunas Google Sheets
└─ Popular src/data/meditacoes.ts com dados
└─ Deletar meditações hardcoded antigas
└─ npm run sync:meditacoes ✅

FASE 2: Validação (1h)
└─ Testar que TODAS as meditações carregam
└─ Verificar filtros (categoria, tags)
└─ Testar paginação
└─ Validar áudio (sem CORS)

FASE 3: QA (2h)
└─ E2E completo
└─ Responsividade
└─ Bundle size
└─ Performance
└─ ✅ PRONTO

TOTAL: 4-5 horas | Esforço: S (Small)
```

---

## ✅ O QUE JÁ EXISTE (Reutilizar 100%)

```
✅ TabExplorar.tsx          ← Container (sem mudanças)
✅ ExploreFilters.tsx       ← Filtros (sem mudanças)
✅ MeditationCard.tsx       ← Card visual (sem mudanças)
✅ AllContentModal.tsx      ← Modal "VER TUDO" (sem mudanças)
✅ MeditationPlayer.tsx     ← Player de áudio (sem mudanças)
✅ ContentSection.tsx       ← Seção (sem mudanças)
✅ useFavorites hook        ← Favoritos (sem mudanças)
✅ /api/audio proxy         ← CORS (sem mudanças)
```

**NENHUM COMPONENTE NOVO É NECESSÁRIO**
Apenas expandir/sincronizar dados do Google Sheets.

---

## 📝 Arquivo Principal a Modificar

### `src/data/meditacoes.ts`

**De:**
```typescript
export const MEDITACOES: MeditationCard[] = [
  { id: "renovacao-ceu-infinito", title: "Renovação...", ... },
  { id: "paz-aguas-tranquilas", title: "A Paz...", ... },
  // 4-6 items mais (EXEMPLOS)
];
```

**Para:**
```typescript
// AUTO-GERADO por scripts/sync-meditacoes.ts
// TODAS as meditações vêm do Google Sheets

export const MEDITACOES: MeditationCard[] = [
  { id: "medit-001", title: "...", audioUrl: "...", ... },
  { id: "medit-002", title: "...", audioUrl: "...", ... },
  // N items (do Google Sheets)
];

export const MEDITACOES_COUNT = N;
```

---

## 🔧 Script Novo: `scripts/sync-meditacoes.ts`

**O que faz:**
1. Conecta ao Google Sheets (usando SheetsClient existente)
2. Busca aba "Meditacoes" (ou nome correto)
3. Extrai TODAS as meditações
4. Mapeia campos (titulo → title, etc)
5. **DELETA** meditações hardcoded
6. Regenera `src/data/meditacoes.ts` com 100% dados do Sheets
7. Imprime relatório

**Execução:**
```bash
npm run sync:meditacoes
```

---

## 📋 Checklist de Aceitação

### FASE 1: Data Sync ✅
- [ ] Script `sync-meditacoes.ts` criado
- [ ] `npm run sync:meditacoes` sem erros
- [ ] Todas as meditações do Sheets carregadas
- [ ] Meditações hardcoded deletadas
- [ ] TypeScript compila (`npm run typecheck`)

### FASE 2: Validação ✅
- [ ] Meditações aparecem em Explorar (4 no inicial)
- [ ] "VER TUDO" modal exibe TODAS
- [ ] Filtros funcionam (MENTE, CORPO, ESPÍRITO, MÚSICA, ESTUDOS)
- [ ] Paginação correta (20/página)
- [ ] Áudio toca sem CORS error

### FASE 3: QA ✅
- [ ] E2E completo (descobrir → tocar → favoritar)
- [ ] Nenhum erro no console
- [ ] Responsivo (mobile 375px, desktop 1920px)
- [ ] Performance OK (< 3s carregamento)
- [ ] Bundle size OK (< 200KB delta)
- [ ] Linting OK (`npm run lint`)

---

## ⚠️ Pontos Críticos

### ANTES de implementar:

1. **Validar Google Sheets:**
   - Aba "Meditacoes" existe?
   - Quais são os nomes das colunas exatos?
   - Quantas linhas de dados (N meditações)?

2. **Estrutura de Colunas Esperadas:**
   - `titulo` / `title`?
   - `descricao` / `description`?
   - `audioUrl` / `audio_url`?
   - `duracao` / `duration`?
   - `categoria` / `category`?
   - `tags` / `palavras_chave`?
   - `imagem` / `image_url`?

3. **URLs de Áudio:**
   - Todos apontam para Cloudflare R2?
   - Todos retornam HTTP 200?

---

## 📚 Documentação Completa

- **Plano Detalhado:** `/PLANO_MEDITACOES_EXPLORAR.md`
- **Componentes Existentes:** `/src/components/tabs/explorar/`
- **Data Atual:** `/src/data/meditacoes.ts` (será substituído)
- **Script Existente (modelo):** `/scripts/sync-oracoes.ts`

---

## 🚀 Próximos Passos

1. **Confirmar Estrutura do Sheets** com usuário
   - Nome da aba
   - Nomes das colunas
   - Número total de meditações

2. **Criar script de sincronização**
   - `scripts/sync-meditacoes.ts`

3. **Executar sincronização**
   - `npm run sync:meditacoes`

4. **Testar (FASES 2 & 3)**
   - Validação de dados
   - QA manual

5. **Commit & Merge**
   - PR para main

---

## 📞 Informações para Validação

**Usuario Confirmou:**
- ✅ Meditações estão no Google Sheets (não são 17, são TODAS)
- ✅ Exemplos hardcoded podem ser deletados
- ✅ Sincronizar 100% do Sheets (não misturar)
- ✅ Implementar na aba "Explorar" (não em "Orações")

**Pendente:**
- ⚠️ Estrutura exata do Google Sheets (colunas, aba name)
- ⚠️ Quantas meditações no total (N)

---

## ✨ Resultado Final

**Aba Explorar (pós-implementação):**
```
┌─ Filtros (MENTE, CORPO, ESPÍRITO, MÚSICA, ESTUDOS)
├─ Filtros (PAZ, DORMIR, ANSIEDADE, MOTIVAÇÃO, ORAÇÃO, <5MINS)
│
├─ Seção "Meditações"
│  ├─ 4 cards (primeiras 4 do Sheets)
│  └─ Botão "VER TUDO" → Modal com TODAS
│
├─ Seção "Escrituras"
│  └─ Cards + "VER TUDO"
│
└─ Seção "Tudo novo, de novo"
   └─ Cards + "VER TUDO"
```

**Dados:**
- 100% sincronizado com Google Sheets
- Atualizável via `npm run sync:meditacoes`
- Zero hardcoding (exemplos deletados)

---

**Status:** ✅ PRONTO PARA IMPLEMENTAR
**Aprovado por:** @architect (Aria)
**Data:** 22 de Fevereiro de 2026
