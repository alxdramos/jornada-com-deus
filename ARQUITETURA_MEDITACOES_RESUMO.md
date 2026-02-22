# Arquitetura de Meditações - Resumo Executivo

**Data:** 22 de Fevereiro de 2026
**Arquiteto:** Aria (@architect)
**Versão:** 1.0

---

## Sumário Executivo

Implementação de 17 meditações na aba "Orações" usando padrão **REUSE-DRIVEN** com reutilização 90% de infraestrutura de Orações. Estrutura paralela mantém ambos os sistemas independentes e escaláveis.

### Eficiência de Arquitetura
- **Componentes Novos:** 5 (MeditationCard, MeditationsModal, TabMeditacoes, MeditationDetailModal, index)
- **Arquivos Adaptados:** 2 (image-mapper.ts, scripts)
- **Linhas de Código Novas:** ~1.200
- **Percentual Reutilizado:** 87%
- **Risco de Quebra:** BAIXO (isolamento completo)

---

## 1. ARQUITETURA VISUAL: COMPONENTES

```
┌─────────────────────────────────────────────────────────────────┐
│                    APP JORNADA COM DEUS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Navigation: [Hoje] [Orações] [Explorar] [Bíblia]               │
│                  ↓                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                    │
│  TabOracoes (Container Principal)                               │
│  ├─ UserHeader ("Orações")                                      │
│  │                                                                │
│  ├─ ContentSection: "Orações"                                   │
│  │  └─ PrayerCard × 4 [Laranja/Orange UI]                      │
│  │     ├─ Imagem aleatória                                      │
│  │     ├─ Play + Favorite buttons                               │
│  │     └─ Duração + Categoria                                   │
│  │                                                                │
│  ├─ ContentSection: "Meditações" ← NOVO                         │
│  │  └─ MeditationCard × 4 [Roxo/Purple UI]                     │
│  │     ├─ Imagem aleatória (compartilhada)                      │
│  │     ├─ Play + Favorite buttons                               │
│  │     └─ Duração + Tags                                        │
│  │                                                                │
│  └─ Modais (on-demand)                                          │
│     ├─ OracoesModal (20 orações/página)                         │
│     ├─ PrayerDetailModalWithPlayer                              │
│     ├─ MeditationsModal (17 meditações/página)   ← NOVO         │
│     └─ MeditationDetailModalWithPlayer           ← NOVO         │
│                                                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. FLUXO DE DADOS: Excel → Aplicação

```
Excel/Google Sheets
        ↓
        │ 17 meditações (titulo, descricao, audioUrl, tema)
        ↓
scripts/sync-meditacoes.ts
        │
        ├─ Remove tags [inhales], [pause]
        ├─ Mapeia imagens aleatórias (/public/images/*.png)
        ├─ Valida URLs de áudio (Cloudflare R2)
        └─ Gera TypeScript
        ↓
src/data/meditacoes.ts
        │
        ├─ MEDITACOES: Meditacao[] (17 items)
        └─ MEDITACOES_COUNT = 17
        ↓
React Components (TabMeditacoes, MeditationCard, etc.)
        ├─ 4 cards na aba
        ├─ Modal "VER TUDO" com todas
        └─ Player com áudio (via /api/audio proxy)
```

### Estrutura de Dados: `Meditacao`
```typescript
interface Meditacao {
  id: string;                    // "paz-aguas-tranquilas"
  titulo: string;                // "A Paz das Águas Tranquilas"
  descricao: string;             // Primeiras linhas do conteúdo
  audioUrl: string;              // https://pub-*.r2.dev/Med_*.mp3
  imagem: {
    background: string;          // "creation_2422229105.png"
    icon: string;
  };
  duracao: number;               // Segundos (ex: 720 = 12 min)
  tema: string;                  // "paz", "ansiedade", "meditacao"
  tags?: string[];               // ["PAZ", "DORMIR", "<5MINS"]
  criadoEm: string;              // ISO timestamp
}
```

---

## 3. PADRÃO DE REUTILIZAÇÃO: REUSE > ADAPT > CREATE

### Reutilização 100% ✅
- Google Sheets API client (`SheetsClient`)
- Image library (`/public/images/creation_*.png`)
- Favorites system (`useFavorites` hook)
- Audio proxy (`/api/audio?url=...`)
- Componentes base (`UserHeader`, `ContentSection`)
- Player infrastructure

### Adaptação < 30% ✅
- `PrayerCard` → `MeditationCard` (cores roxas, mesma estrutura)
- `OracoesModal` → `MeditationsModal` (paginação idêntica)
- `sync-oracoes.ts` → `sync-meditacoes.ts` (lógica duplicada, dados diferentes)
- `image-mapper.ts` → adicionar `mapMeditacoes()` (reusa `mapOracoes()`)

### Criação Mínima ✅
- `TabMeditacoes.tsx` (container novo, padrão estabelecido)
- `MeditationDetailModalWithPlayer.tsx` (player wrapper)
- `meditacoes.ts` data file (gerado, não manual)

---

## 4. CICLO DE IMPLEMENTAÇÃO: 5 FASES

| Fase | Foco | Duração | Esforço | Status |
|------|------|---------|--------|--------|
| **1** | Data Layer (sync + schema) | 1-2h | XS | Pending |
| **2** | Components (card, modal) | 2-3h | S | Pending |
| **3** | Container + Player | 2-3h | S | Pending |
| **4** | Navigation Integration | 1-2h | XS | Pending |
| **5** | QA + Polish | 2-3h | S | Pending |
| | **TOTAL** | **9-12h** | **M** | **Ready** |

### Mapa de Dependências
```
FASE 1 (Data)
    ↓ (necessário para)
FASE 2 (Components) ← também depende de design colors
    ↓ (necessário para)
FASE 3 (Container) ← integra FASE 2
    ↓ (necessário para)
FASE 4 (Navigation) ← integra FASE 3
    ↓ (necessário para)
FASE 5 (QA) ← testa tudo
```

---

## 5. ESTRUTURA DE DIRETÓRIOS

```
src/
├── components/
│   ├── tabs/
│   │   ├── TabOracoes.tsx                        [MODIFY: add Meditações section]
│   │   ├── meditacoes/                           [NEW FOLDER]
│   │   │   ├── index.ts                          [NEW: barrel export]
│   │   │   ├── MeditationCard.tsx                [NEW: visual component]
│   │   │   ├── MeditationsModal.tsx              [NEW: list modal]
│   │   │   └── MeditationDetailModalWithPlayer.tsx [NEW: player modal]
│   │   └── explorar/
│   │       └── ContentSection.tsx                [REUSE: as is]
│   ├── layout/
│   │   └── UserHeader.tsx                        [REUSE: as is]
│   └── BottomNav.tsx                             [MODIFY: add nav link]
│
├── data/
│   ├── meditacoes.ts                             [NEW: auto-generated by sync]
│   ├── oracoes.ts                                [REUSE: existing]
│   └── seed.ts                                   [Optional: mock data]
│
├── hooks/
│   ├── useFavorites.ts                           [REUSE: existing]
│   └── useMeditationPlayer.ts                    [OPTIONAL: new if needed]
│
└── lib/
    ├── sheets-client.ts                          [REUSE: existing]
    ├── image-mapper.ts                           [ADAPT: add mapMeditacoes()]
    └── utils.ts                                  [REUSE: cn() function]

scripts/
├── sync-oracoes.ts                               [REUSE: as model]
└── sync-meditacoes.ts                            [NEW: meditation sync]

public/images/
└── creation_*.png                                [REUSE: shared image library]
```

---

## 6. PADRÃO VISUAL: DESIGN SYSTEM

### Orações (Existente)
```
Primary Color:    #FB923C (Orange)
Accent:          #10B981 (Green)
Fallback Gradient: green-400 → blue-500
Button Hover:     opacity-30 overlay
Icon:            Heart (lucide-react)
```

### Meditações (Novo - Paralelo)
```
Primary Color:    #9333EA (Purple)
Accent:          #6D28D9 (Purple Dark)
Fallback Gradient: purple-400 → indigo-600
Button Hover:     opacity-30 overlay (mesmo padrão)
Icon:            Wand2 (lucide-react)
```

### Exemplo: MeditationCard Layout
```
┌─────────────────────────────┐
│                             │
│   🖼️  Imagem                │ ← /public/images/creation_*.png
│   (random aleatória)        │   (fallback: roxo gradient)
│                             │
│ On Hover:                   │
│ ┌─────────────────────────┐ │
│ │ ▶️ Play  ❤️ Favorite    │ │
│ └─────────────────────────┘ │
│                             │
├─────────────────────────────┤
│ A Paz das Águas Tranquilas  │ ← titulo
│ 12:00                        │ ← duracao
│                             │
│ Respire comigo, suavemente  │ ← descricao (line-clamp-2)
│ sinta o peso de seu corpo   │
│                             │
│ [PAZ] [TRANQUILIDADE]       │ ← tags (max 2)
└─────────────────────────────┘
```

---

## 7. FLUXO DE USUÁRIO: Ponta a Ponta

### Cenário: Usuário descobre e toca meditação

```
1. Usuário navega para "Orações"
   └─ Vê seção "Meditações" com 4 cards

2. Clica em MeditationCard
   └─ MeditationDetailModalWithPlayer abre

3. Modal exibe:
   ├─ Título + Imagem
   ├─ Descrição
   ├─ Botão Play/Pause + Barra de Progresso
   ├─ Contador (0:00 / 12:00)
   └─ Botão Favorite

4. Clica "Play"
   ├─ audioUrl é proxiado: /api/audio?url=<R2-url>
   ├─ Servidor busca sem CORS
   ├─ Response retorna com headers corretos
   └─ <audio> toca com sucesso ✅

5. Clica "Favorite"
   ├─ useFavorites.toggleFavorite(meditation.id)
   ├─ Estado local atualiza
   └─ Persiste em sessionStorage ✅

6. Clica "Fechar"
   └─ Modal fecha, aba retorna ao normal

7. (Bonus) Clica "VER TUDO"
   ├─ MeditationsModal abre
   ├─ Exibe todas 17 meditações (1 página)
   ├─ Paginação desabilitada (< 20 items)
   └─ Mesmo fluxo acima para qualquer card
```

---

## 8. DECISÕES ARQUITETURAIS CHAVE

### Decisão 1: Integração vs Página Separada
**Decisão:** Integração na aba "Orações" (TabOracoes)
- ✅ Mantém padrão de "Explorar" (múltiplas seções)
- ✅ Menos roteamento complexo
- ✅ Navegação mais simples
- ✅ Futuro: se crescer, extrai para página `/app/meditacoes`

### Decisão 2: Componente Separado vs Genérico
**Decisão:** `MeditationCard` separado (não genérico)
- ✅ 90% de reutilização com clone de `PrayerCard`
- ✅ Zero risco de quebra em `PrayerCard`
- ✅ Simplifica manutenção (cores, comportamento independentes)
- ✅ Futuro: refatorar para `<Card type="prayer|meditation" />` se necessário

### Decisão 3: Sincronização de Dados
**Decisão:** Script automático `sync-meditacoes.ts` (não manual)
- ✅ Reutiliza padrão de `sync-oracoes.ts`
- ✅ Validação automática de URLs/imagens
- ✅ Auditável (log de cada sincronização)
- ✅ Manual backup: dados mock em `seed.ts`

### Decisão 4: Audio CORS
**Decisão:** Reutilizar `/api/audio` proxy existente
- ✅ Já implementado e testado (usado em Orações)
- ✅ Server-side fetch sem CORS
- ✅ Cache de 24h por URL
- ✅ Zero novos endpoints

---

## 9. CRITÉRIOS DE SUCESSO

### Funcional
- ✅ 17 meditações carregam de Excel
- ✅ 4 visíveis em "Meditações" tab
- ✅ Play/pause/progresso funciona
- ✅ Favoritos persistem
- ✅ "VER TUDO" modal com paginação

### Técnico
- ✅ TypeScript: 0 erros (`npm run typecheck`)
- ✅ ESLint: 0 erros (`npm run lint`)
- ✅ Build: sem warnings (`npm run build`)
- ✅ Bundle size < 500KB delta
- ✅ Imagens carregam < 2s
- ✅ Áudio toca < 1s após clique

### UX/Design
- ✅ Responsivo (mobile/tablet/desktop)
- ✅ Cores consistentes (roxo para meditações)
- ✅ Botões acessíveis (ARIA labels)
- ✅ Transições suaves (Framer Motion)
- ✅ Fallbacks funcionais (gradiente roxo)

### Reutilização
- ✅ 87% de código reutilizado
- ✅ Zero quebra em existentes
- ✅ Isolamento completo (MeditationCard vs PrayerCard)

---

## 10. RISCOS IDENTIFICADOS & MITIGAÇÃO

| Risco | Prob | Impacto | Mitigação |
|-------|------|--------|-----------|
| Dados Excel incompletos | MÉDIA | ALTO | Mock data em seed.ts; validar antes de FASE 1 |
| Quebra de Orações | BAIXA | CRÍTICO | Branch isolado; refactor apenas componentes novos |
| CORS de R2 | BAIXA | MÉDIO | Proxy /api/audio já existe |
| Performance | BAIXA | MÉDIO | Lazy loading de modais; code splitting |
| Sincronização | BAIXA | BAIXO | Script com validação + log |
| Imagens não encontradas | MÉDIO | BAIXO | Gradiente fallback implementado |

---

## 11. TIMELINE SUGERIDA

### Semana 1 (Sprint)
- **Day 1:** FASE 1 (Data) - sync-meditacoes.ts + meditacoes.ts
- **Day 2:** FASE 2 (Components) - MeditationCard + MeditationsModal
- **Day 3:** FASE 3 (Container) - TabMeditacoes + Player
- **Day 4:** FASE 4 (Navigation) + FASE 5 (QA)
- **Day 5:** Refinements + PR review

**Throughput:** 9-12 horas = ~1.5 sprints

---

## 12. PRÓXIMOS PASSOS

### Imediato (Pré-Implementação)
- [ ] Validar que 17 meditações estão prontas no Excel
- [ ] Confirmar nomes de colunas/abas exatos
- [ ] Revisar palete de cores roxo (design feedback)
- [ ] Criar branch: `feature/meditacoes-tab`

### Durante Implementação
- [ ] Executar FASE 1 → FASE 5 sequencialmente
- [ ] Commits semânticos e rastreáveis
- [ ] QA incremental (não deixar para o final)
- [ ] Documentação inline de código

### Pós-Implementação
- [ ] PR review com @dev + @qa
- [ ] Deploy em staging
- [ ] Teste E2E em devices reais
- [ ] Merge para main
- [ ] Deploy produção

---

## Referências Rápidas

**Documentação Completa:** `/jornada-com-deus/PLANO_IMPLEMENTACAO_MEDITACOES.md`

**Padrões Reutilizados:**
- `src/components/tabs/oracoes/PrayerCard.tsx`
- `src/components/tabs/oracoes/OracoesModal.tsx`
- `scripts/sync-oracoes.ts`
- `src/lib/image-mapper.ts`

**Dependências Externas:** Google Sheets API, Cloudflare R2, lucide-react, framer-motion

**Status:** ✅ **READY FOR IMPLEMENTATION**

---

**Aprovado por:** Aria (@architect)
**Data:** 22 de Fevereiro de 2026
**Versão:** 1.0 (Final)
