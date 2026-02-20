# Análise de Refatoração de Componentes Monolíticos

## Execução: 2026-02-20
**Projeto:** Jornada com Deus
**Foco:** Quebrar componentes mantendo funcionalidades sem overhead

---

## 1. TabExplorar.tsx

### Métricas Básicas
- **Total de linhas:** 691
- **Complexidade:** ALTA
- **Tecnologias:** React, Framer Motion, Custom Hooks, Context

### Estados (useState)
| Estado | Tipo | Responsabilidade |
|--------|------|------------------|
| `catAtiva` | string | Categoria ativa de meditações |
| `chipAtivo` | string | Chip de filtro ativo (DORMIR, ANSIEDADE, etc) |
| `paywallOpen` | boolean | Mostrar modal paywall |
| `playerOpen` | boolean | Mostrar player de meditação |
| `selectedMeditation` | MeditationCard \| null | Meditação selecionada |
| `isLoading` | boolean | Estado de carregamento |
| `showAllModal` | boolean | Mostrar modal "VER TUDO" |
| `selectedSection` | 'meditacoes' \| 'escrituras' \| 'novo' | Seção ativa no modal |
| `modalTestamento` | "AT" \| "NT" | Testamento selecionado no modal |

**Total: 9 estados**

### Múltiplas Responsabilidades Identificadas

1. **Filtro e Busca (linhas 141-146)**
   - Lógica de filtro por categoria
   - Lógica de filtro por chip
   - Função `meditatacoesFiltradas`

2. **Gerenciamento de Modais (linhas 131-139)**
   - Estado de paywall
   - Estado de player
   - Estado de "ver tudo"
   - Lógica de seleção de seção

3. **Renderização de Cards (linhas 235-457)**
   - Card de meditações (similares mas duplicados)
   - Card de escrituras
   - Card de "tudo novo"
   - Lógica de Plus/Free dentro dos cards

4. **Modal VER TUDO (linhas 480-686)**
   - Subestadosde categoria no modal
   - Subestados de testamento
   - Renderização condicional complexa

5. **Dados Hardcoded (linhas 15-112)**
   - CATEGORIAS, CHIPS, LIVROS_AT, LIVROS_NT
   - Array MEDITACOES com 6 objetos
   - cardsEscrituras com 3 objetos
   - cardsNovo com 3 objetos

### Dados Hardcoded que Podem ser Extraídos

```typescript
// Deveriam ser em arquivo separado ou API
const CATEGORIAS = ["TUDO", "MENTE", "CORPO", "ESPÍRITO", "MÚSICA", "ESTUDOS"];
const CHIPS = ["TUDO", "DORMIR", "ANSIEDADE", "PAZ", "<5MINS", "MOTIVAÇÃO", "ORAÇÃO"];
const LIVROS_AT = [...]; // 39 livros
const LIVROS_NT = [...]; // 27 livros
const MEDITACOES = [...]; // 6 objetos com imagens, áudios, descrições
const cardsEscrituras = [...]; // 3 objetos
const cardsNovo = [...]; // 3 objetos
```

### Sub-componentes que Podem ser Criados

1. **MeditationCard.tsx**
   - Props: meditation, isPlus, isFavorite, onPlay, onToggleFavorite
   - Linhas 268-340 extraídas

2. **ScriptureCard.tsx**
   - Props: card, isPlus, onPlay
   - Versão horizontal do card

3. **ExploreFilters.tsx**
   - Props: categories, chips, activeCat, activeChip, onCatChange, onChipChange
   - Linhas 201-233

4. **AllContentModal.tsx**
   - Props: isOpen, onClose, section, data, isPlus
   - Linhas 480-686 (todo o modal "VER TUDO")

5. **ContentSection.tsx**
   - Props: title, items, sectionType, onViewAll
   - Wrapper reutilizável para cada seção

6. **PaywallOverlay.tsx** (já existe PaywallModal)
   - Reutilizar componente existente

### Proposta de Refatoração

```
src/components/
├── tabs/
│   ├── TabExplorar.tsx (refatorado para ~200 linhas)
│   └── explorar/
│       ├── ExploreFilters.tsx
│       ├── MeditationCard.tsx
│       ├── ScriptureCard.tsx
│       ├── ContentSection.tsx
│       └── AllContentModal.tsx
├── data/
│   ├── meditacoes.ts (MEDITACOES, cardsEscrituras, cardsNovo)
│   ├── biblia.ts (LIVROS_AT, LIVROS_NT)
│   └── filters.ts (CATEGORIAS, CHIPS)
└── [existentes]
```

### Estrutura Pós-Refatoração Estimada

- **TabExplorar.tsx:** ~200 linhas (de 691)
- **ExploreFilters.tsx:** ~50 linhas
- **MeditationCard.tsx:** ~80 linhas
- **ScriptureCard.tsx:** ~60 linhas
- **AllContentModal.tsx:** ~250 linhas (organizado)
- **Data files:** ~150 linhas total
- **Economia:** -241 linhas, +590 linhas distribuídas (melhor organização)

### Redução de Complexidade
- States por componente: 9 → 2-3 em cada sub-componente
- Props injetadas em vez de estados globais
- Lógica de filtro isolada
- Dados separados da UI

---

## 2. TabDiario.tsx

### Métricas Básicas
- **Total de linhas:** 599
- **Complexidade:** ALTA
- **Tecnologias:** React, Framer Motion, localStorage

### Estados (useState)
| Estado | Tipo | Responsabilidade |
|--------|------|------------------|
| `activeTab` | TabType | Aba ativa (Tudo, Destaques, Anotações, Citações) |
| `entries` | DiaryEntry[] | Lista de entradas |
| `showCreateModal` | boolean | Mostrar modal de criação |
| `showEntryDetail` | DiaryEntry \| null | Entrada em detalhes |
| `searchQuery` | string | Query de busca |
| `showSearch` | boolean | Mostrar campo de busca |
| `newEntryType` | DiaryEntry['type'] | Tipo de entrada sendo criada |
| `newEntryTitle` | string | Título da nova entrada |
| `newEntryContent` | string | Conteúdo da nova entrada |
| `newEntryReference` | string | Referência (opcional) |
| `newEntryTags` | string[] | Tags da nova entrada |

**Total: 11 estados**

### Múltiplas Responsabilidades Identificadas

1. **Gerenciamento de Entradas (linhas 68-130)**
   - Carregar do localStorage
   - Filtrar por aba
   - Filtrar por busca
   - Toggle favorito
   - Salvar no localStorage

2. **Criação de Entradas (linhas 132-169)**
   - 5 estados para formulário
   - Validação
   - Criação de nova entrada
   - Persistência

3. **Tag Management (linhas 161-169)**
   - Adicionar tag
   - Remover tag

4. **Renderização de Lista (linhas 240-342)**
   - Mapeamento de entradas
   - States vazios por tipo
   - Cards de entradas
   - Lógica de truncamento

5. **Modais (linhas 357-596)**
   - Modal de criação (230 linhas)
   - Modal de detalhes (100 linhas)

5. **Utilitários (linhas 171-187)**
   - `getEntryIcon(type)`
   - `getEntryColor(type)`

### Dados Hardcoded

```typescript
const ENTRIES_EXEMPLO: DiaryEntry[] = [...]; // 4 entradas
const TABS: TabType[] = ['Tudo', 'Destaques', 'Anotações', 'Citações'];
```

### Sub-componentes que Podem ser Criados

1. **DiaryEntryCard.tsx**
   - Props: entry, isFavorite, onToggleFavorite, onView
   - Linhas 267-341

2. **DiaryCreateModal.tsx**
   - Props: isOpen, onClose, onCreate
   - Linhas 358-501

3. **DiaryDetailModal.tsx**
   - Props: entry, isOpen, onClose, isFavorite, onToggleFavorite
   - Linhas 504-596

4. **DiaryFilters.tsx**
   - Props: tabs, activeTab, searchQuery, onTabChange, onSearchChange
   - Linhas 203-238

5. **DiaryEmptyState.tsx**
   - Props: tabType
   - Linhas 247-265

6. **EntryTypeSelector.tsx** (reutilizável)
   - Props: selected, onSelect
   - Dentro do CreateModal

### Proposta de Refatoração

```
src/components/
├── tabs/
│   ├── TabDiario.tsx (refatorado para ~150 linhas)
│   └── diario/
│       ├── DiaryFilters.tsx
│       ├── DiaryEntryCard.tsx
│       ├── DiaryEmptyState.tsx
│       ├── DiaryCreateModal.tsx
│       ├── DiaryDetailModal.tsx
│       └── EntryTypeSelector.tsx (reutilizável)
├── data/
│   └── diario-exemplo.ts (ENTRIES_EXEMPLO, TABS)
└── [existentes]
```

### Estrutura Pós-Refatoração Estimada

- **TabDiario.tsx:** ~150 linhas (de 599)
- **DiaryFilters.tsx:** ~40 linhas
- **DiaryEntryCard.tsx:** ~90 linhas
- **DiaryEmptyState.tsx:** ~35 linhas
- **DiaryCreateModal.tsx:** ~150 linhas
- **DiaryDetailModal.tsx:** ~80 linhas
- **EntryTypeSelector.tsx:** ~50 linhas
- **Data file:** ~60 linhas
- **Distribuição:** 605 linhas em 8 arquivos (+6 linhas de imports/exports)

### Redução de Complexidade
- States por componente: 11 → 2-3
- Lógica de localStorage isolada em custom hook (useDiaryStorage)
- Formulário em componente separado

---

## 3. TabBiblia.tsx

### Métricas Básicas
- **Total de linhas:** 508
- **Complexidade:** MÉDIA-ALTA
- **Tecnologias:** React, Custom Hook (useBible), Framer Motion, API

### Estados (useState)
| Estado | Tipo | Responsabilidade |
|--------|------|------------------|
| `testamento` | "AT" \| "NT" | Testamento selecionado |
| `viewState` | ViewState | Estado atual (books, chapters, verses) |
| `selectedBook` | string | Livro selecionado |
| `selectedChapter` | number | Capítulo selecionado |
| `searchQuery` | string | Query de busca por referência |
| `showSearch` | boolean | Mostrar campo de busca |
| `accessedChapters` | Set<string> | Capítulos acessados (para tracking) |

**Total: 7 estados** + estados do hook `useBible` (loading, error, data)

### Múltiplas Responsabilidades Identificadas

1. **Navegação de Estado (linhas 19-71)**
   - Gerenciar viewState (books → chapters → verses)
   - Seleção de livro
   - Seleção de capítulo
   - Funções goBack()

2. **Busca por Referência (linhas 72-98)**
   - Input de busca
   - Validação de query
   - Chamada a API via hook
   - Parsing de resultado

3. **Renderização de Livros (linhas 247-268)**
   - Lista de livros por testamento

4. **Renderização de Capítulos (linhas 270-315)**
   - Grid de capítulos
   - Animações
   - Estados de loading

5. **Renderização de Versículos (linhas 317-503)**
   - Display de versículos
   - Compartilhamento
   - Progresso de leitura
   - Navegação entre capítulos
   - Jump to chapter

6. **UI Complexa no Versículos (linhas 426-501)**
   - Barra de progresso
   - Botões prev/next
   - Jump buttons
   - Bastante duplicação visual

### Dados Hardcoded

```typescript
type ViewState = "books" | "chapters" | "verses";
// Dados vêm do hook useBible que faz chamadas a API
// Mas exemplos de busca são hardcoded: ["João 3:16", "Gn 1:1", "Sl 23", "Mt 5:1-12"]
```

### Sub-componentes que Podem ser Criados

1. **BibleBooksList.tsx**
   - Props: livros, onSelectBook, testamento
   - Linhas 255-266

2. **BibleChapterGrid.tsx**
   - Props: selectedBook, totalChapters, selectedChapter, loading, onSelectChapter
   - Linhas 270-314

3. **BibleVerseList.tsx**
   - Props: selectedBook, selectedChapter, verses, loading, error, onShare, onRetry
   - Linhas 317-418

4. **BibleChapterNavigation.tsx**
   - Props: selectedBook, selectedChapter, totalChapters, accessedChapters, loading, onSelectChapter
   - Linhas 420-501

5. **BibleSearchBar.tsx**
   - Props: query, loading, error, onSearch, onClear
   - Linhas 174-243

6. **BibleTestamentToggle.tsx**
   - Props: selected, onToggle
   - Linhas 150-172

### Proposta de Refatoração

```
src/components/
├── tabs/
│   ├── TabBiblia.tsx (refatorado para ~100 linhas)
│   └── biblia/
│       ├── BibleTestamentToggle.tsx
│       ├── BibleSearchBar.tsx
│       ├── BibleBooksList.tsx
│       ├── BibleChapterGrid.tsx
│       ├── BibleVerseList.tsx
│       └── BibleChapterNavigation.tsx
└── [existentes]
```

### Estrutura Pós-Refatoração Estimada

- **TabBiblia.tsx:** ~100 linhas (de 508)
- **BibleTestamentToggle.tsx:** ~25 linhas
- **BibleSearchBar.tsx:** ~70 linhas
- **BibleBooksList.tsx:** ~35 linhas
- **BibleChapterGrid.tsx:** ~70 linhas
- **BibleVerseList.tsx:** ~120 linhas
- **BibleChapterNavigation.tsx:** ~120 linhas
- **Distribuição:** 540 linhas em 7 arquivos

### Redução de Complexidade
- States por componente: 7 → 2-3
- Lógica de navegação simplificada
- ViewState gerenciado de forma mais clara
- Separação de responsabilidades UI vs. dados

---

## 4. HojeSteps.tsx

### Métricas Básicas
- **Total de linhas:** 444
- **Complexidade:** MÉDIA
- **Tecnologias:** React, Framer Motion, Custom Hooks, Data functions

### Estados (useState)
| Estado | Tipo | Responsabilidade |
|--------|------|------------------|
| `completados` | Set<EtapaId> | Etapas completadas |
| `expandido` | EtapaId \| null | Etapa expandida |
| `playerAberto` | boolean | Player de áudio aberto |
| `lerAberto` | boolean | Modal de leitura aberta |

**Total: 4 estados** (bem organizado!)

### Múltiplas Responsabilidades Identificadas

1. **Gerenciamento de Estados de Conclusão (linhas 46-82)**
   - Toggle de etapa
   - Toggle de expandido
   - Auto-marking ao expandir
   - Conclusão do dia completo

2. **Renderização de Card: Versículo (linhas 91-156)**
   - 65 linhas em um único card

3. **Renderização de Card: Passagem (linhas 158-249)**
   - 91 linhas em um único card

4. **Renderização de Card: Devocional (linhas 251-296)**
   - 45 linhas

5. **Renderização de Card: Oração (linhas 298-361)**
   - 63 linhas

6. **Modal de Leitura (linhas 387-441)**
   - 54 linhas de modal duplicando estrutura

### Dados Hardcoded

```typescript
const DEVOCIONAL_FIXO = {
  refBiblica: "Efésios 3:14-16",
  titulo: "Mansidão e Majestade",
  texto: "..." // Texto longo
};

type EtapaId = "versiculo" | "passagem" | "devocional" | "oracao";
```

### Sub-componentes que Podem ser Criados

1. **DailyStepCard.tsx** (genérico reutilizável)
   - Props: id, title, icon, subtitle, completed, expanded, onToggleComplete, onToggleExpand, children
   - Linhas 92-156 padrão (aplicável a todos os 4 cards)

2. **VersiculoStepCard.tsx**
   - Props: versiculo, completed, expanded, onToggleComplete, onToggleExpand
   - Herda de DailyStepCard

3. **PassagemStepCard.tsx**
   - Props: passagem, completed, expanded, onToggleComplete, onToggleExpand
   - Linhas 158-249

4. **DevocionalStepCard.tsx**
   - Props: devocional, completed, isPlus, onToggleComplete, onOpenPlayer, onOpenLeitura
   - Linhas 251-296

5. **OracaoStepCard.tsx**
   - Props: oracao, completed, expanded, onToggleComplete, onToggleExpand
   - Linhas 298-361

6. **DailyReadModal.tsx**
   - Props: isOpen, onClose, titulo, texto, referencia
   - Linhas 387-441 (aplicável a múltiplos modais)

### Proposta de Refatoração

```
src/components/
├── HojeSteps.tsx (refatorado para ~100 linhas)
├── hojeSteps/
│   ├── DailyStepCard.tsx (base reutilizável)
│   ├── VersiculoStepCard.tsx
│   ├── PassagemStepCard.tsx
│   ├── DevocionalStepCard.tsx
│   ├── OracaoStepCard.tsx
│   └── DailyReadModal.tsx
└── [existentes - ImmersiveAudioPlayer]
```

### Estrutura Pós-Refatoração Estimada

- **HojeSteps.tsx:** ~100 linhas (de 444)
- **DailyStepCard.tsx:** ~80 linhas
- **VersiculoStepCard.tsx:** ~60 linhas
- **PassagemStepCard.tsx:** ~80 linhas
- **DevocionalStepCard.tsx:** ~50 linhas
- **OracaoStepCard.tsx:** ~60 linhas
- **DailyReadModal.tsx:** ~80 linhas
- **Distribuição:** 510 linhas em 7 arquivos

### Redução de Complexidade
- Componente base DailyStepCard elimina duplicação
- Estados simplificados
- Reutilização de padrões
- Modal genérico para leitura

---

## 5. TabOracoes.tsx

### Métricas Básicas
- **Total de linhas:** 431
- **Complexidade:** MÉDIA
- **Tecnologias:** React, localStorage, Framer Motion

### Estados (useState)
| Estado | Tipo | Responsabilidade |
|--------|------|------------------|
| `prayers` | Prayer[] | Lista de orações |
| `categoriaAtiva` | string | Categoria ativa |
| `showCreateModal` | boolean | Modal de criação |
| `showPrayerDetail` | Prayer \| null | Oração em detalhes |
| `favorites` | Set<string> | IDs de favoritos |
| `newPrayerTitle` | string | Título da nova oração |
| `newPrayerContent` | string | Conteúdo da nova oração |
| `newPrayerCategory` | string | Categoria da nova oração |

**Total: 8 estados**

### Múltiplas Responsabilidades Identificadas

1. **Gerenciamento de Dados (linhas 64-146)**
   - Carregar do localStorage
   - Gerenciar lista de orações
   - Filtrar por categoria
   - Criar nova oração
   - Deletar oração
   - Toggle favorito

2. **Renderização de Cards (linhas 200-251)**
   - Card de oração com metadados
   - Display de tags/categoria
   - Data de criação

3. **Modal de Criação (linhas 267-347)**
   - 80 linhas de formulário

4. **Modal de Detalhes (linhas 351-428)**
   - 77 linhas de detalhes

5. **Filtros/Abas (linhas 181-197)**
   - Botões de categoria

### Dados Hardcoded

```typescript
const PRAYERS_PREDEFINIDAS: Prayer[] = [...]; // 5 orações
const CATEGORIAS = ["Todas", "Graças", "Paz", "Família", "Perdão", "Força", "Minhas"];
```

### Sub-componentes que Podem ser Criados

1. **PrayerCard.tsx**
   - Props: prayer, isFavorite, onToggleFavorite, onView
   - Linhas 201-250

2. **PrayerFilters.tsx**
   - Props: categories, active, onCategoryChange
   - Linhas 181-197

3. **PrayerCreateModal.tsx**
   - Props: isOpen, onClose, onCreate
   - Linhas 267-347

4. **PrayerDetailModal.tsx**
   - Props: prayer, isOpen, onClose, isFavorite, onToggleFavorite, onDelete
   - Linhas 351-428

5. **PrayerEmptyState.tsx** (reutilizável)
   - Props: message
   - Estado vazio

### Proposta de Refatoração

```
src/components/
├── tabs/
│   ├── TabOracoes.tsx (refatorado para ~100 linhas)
│   └── oracoes/
│       ├── PrayerFilters.tsx
│       ├── PrayerCard.tsx
│       ├── PrayerCreateModal.tsx
│       └── PrayerDetailModal.tsx
├── ui/
│   └── EmptyState.tsx (reutilizável)
├── data/
│   └── oracoes-predefinidas.ts
└── [existentes]
```

### Estrutura Pós-Refatoração Estimada

- **TabOracoes.tsx:** ~100 linhas (de 431)
- **PrayerFilters.tsx:** ~25 linhas
- **PrayerCard.tsx:** ~60 linhas
- **PrayerCreateModal.tsx:** ~90 linhas
- **PrayerDetailModal.tsx:** ~80 linhas
- **Data file:** ~50 linhas
- **Distribuição:** 405 linhas em 6 arquivos

### Redução de Complexidade
- States por componente: 8 → 2-3
- Lógica de CRUD isolada em custom hook (usePrayers)
- Modais separados

---

## 6. MeditationPlayer.tsx

### Métricas Básicas
- **Total de linhas:** 424
- **Complexidade:** MÉDIA
- **Tecnologias:** React, useRef para áudio, Framer Motion

### Estados (useState)
| Estado | Tipo | Responsabilidade |
|--------|------|------------------|
| `playing` | boolean | Está tocando |
| `progress` | number | Progresso 0-100 |
| `volume` | number | Volume 0-1 |
| `muted` | boolean | Muted |
| `currentTime` | number | Tempo atual em segundos |
| `isFavorite` | boolean | Favorito |
| `repeat` | boolean | Repeat ativado |
| `showPlusOverlay` | boolean | Mostrar overlay Plus |
| `audioError` | boolean | Erro de áudio |
| `audioLoading` | boolean | Carregando áudio |

**Total: 10 estados** + useRef para audioRef e progressRef

### Múltiplas Responsabilidades Identificadas

1. **Gerenciamento de Áudio (linhas 56-138)**
   - Setup do elemento áudio
   - Event listeners
   - Simulação de progresso
   - Tratamento de erros

2. **Controles de Reprodução (linhas 148-197)**
   - togglePlay()
   - handleProgressClick()
   - skip()
   - formatTime()

3. **UI de Controles (linhas 291-375)**
   - Botões de play/pause
   - Volume
   - Favorito
   - Repeat
   - Share
   - Skip buttons

4. **Overlay Plus (linhas 378-399)**
   - 20 linhas de overlay

5. **Background e Layout (linhas 202-265)**
   - Background image
   - Close button
   - Title/description

### Dados Hardcoded

```typescript
// Default no prop
imagemFundo = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop"

// Magic numbers
skipAmount = 15; // segundos
totalDuration = 300; // 5 minutos (assumido)
```

### Sub-componentes que Podem ser Criados

1. **AudioPlayerProgress.tsx**
   - Props: progress, currentTime, duration, onProgressClick, formatTime
   - Linhas 267-289

2. **AudioPlayerControls.tsx**
   - Props: playing, loading, error, onTogglePlay, onSkip
   - Linhas 291-328

3. **AudioPlayerSecondaryControls.tsx**
   - Props: muted, favorite, repeat, onToggleMute, onToggleFavorite, onToggleRepeat, onShare
   - Linhas 330-375

4. **PlusOverlay.tsx** (genérico reutilizável)
   - Props: isVisible, title, description, onUpgrade, onDismiss
   - Linhas 378-399

5. **AudioPlayerHeader.tsx**
   - Props: title, description, duration, isPlus, onClose
   - Linhas 228-265

### Proposta de Refatoração

```
src/components/
├── MeditationPlayer.tsx (refatorado para ~150 linhas)
├── meditationPlayer/
│   ├── AudioPlayerProgress.tsx
│   ├── AudioPlayerControls.tsx
│   ├── AudioPlayerSecondaryControls.tsx
│   ├── AudioPlayerHeader.tsx
│   └── hooks/
│       └── useAudioPlayer.ts (lógica de áudio)
├── ui/
│   └── PlusOverlay.tsx (reutilizável)
└── [existentes]
```

### Estrutura Pós-Refatoração Estimada

- **MeditationPlayer.tsx:** ~150 linhas (de 424)
- **AudioPlayerProgress.tsx:** ~40 linhas
- **AudioPlayerControls.tsx:** ~50 linhas
- **AudioPlayerSecondaryControls.tsx:** ~60 linhas
- **AudioPlayerHeader.tsx:** ~50 linhas
- **useAudioPlayer.ts:** ~100 linhas (lógica extraída)
- **PlusOverlay.tsx:** ~40 linhas
- **Distribuição:** 490 linhas em 7 arquivos

### Redução de Complexidade
- Estados por componente: 10 → 2-3
- Lógica de áudio isolada em custom hook
- UI components separados
- Reutilização de PlusOverlay em múltiplos players

---

## 7. ImmersiveAudioPlayer.tsx

### Métricas Básicas
- **Total de linhas:** 351
- **Complexidade:** MÉDIA
- **Tecnologias:** React, Framer Motion, Speed controls

### Estados (useState)
| Estado | Tipo | Responsabilidade |
|--------|------|------------------|
| `playing` | boolean | Está tocando |
| `progress` | number | Progresso 0-100 |
| `currentTime` | number | Tempo atual |
| `volume` | number | Volume |
| `muted` | boolean | Muted |
| `speed` | number | Velocidade (0.75, 1, 1.25, 1.5, 2) |
| `repeat` | boolean | Repeat ativado |
| `isFavorite` | boolean | Favorito |
| `showPlusOverlay` | boolean | Mostrar overlay Plus |

**Total: 9 estados**

### Múltiplas Responsabilidades Identificadas

1. **Simulação de Progresso (linhas 53-79)**
   - Setup de intervalo
   - Cleanup

2. **Controles de Reprodução (linhas 81-114)**
   - togglePlay()
   - handleProgressClick()
   - skip()
   - formatTime()

3. **UI de Reprodução (linhas 142-208)**
   - Title/metadados
   - Texto rolável
   - Progress bar

4. **Controles Principais (linhas 210-241)**
   - Play/pause
   - Skip buttons

5. **Controles Secundários (linhas 243-288)**
   - Volume
   - Favorito
   - Repeat
   - Share

6. **Controles de Velocidade (linhas 290-311)**
   - 5 botões de velocidade

7. **Overlay Plus (linhas 314-347)**
   - 33 linhas de overlay com opções

### Comparação com MeditationPlayer

**Similaridades:**
- Mesma estrutura de player
- Estados similares
- Lógica similares

**Diferenças:**
- ImmersiveAudioPlayer tem speed controls
- Mostra texto na tela
- Overlay Plus com 2 botões (upgrade + dismiss)
- Simulação em vez de áudio real

### Sub-componentes que Podem ser Criados

1. **AudioPlayerProgress.tsx** (compartilhado com MeditationPlayer)
   - Mesma coisa

2. **SpeedControls.tsx**
   - Props: currentSpeed, speeds, onSpeedChange
   - Linhas 290-311

3. **PlusOverlayWithOptions.tsx** (extensão de PlusOverlay)
   - Props: isVisible, onUpgrade, onDismiss
   - Linhas 314-347

4. **AudioTextDisplay.tsx**
   - Props: title, text, currentTime
   - Linhas 145-183

### Proposta de Refatoração

```
src/components/
├── ImmersiveAudioPlayer.tsx (refatorado para ~120 linhas)
├── immersiveAudioPlayer/
│   ├── AudioPlayerProgress.tsx (compartilhado)
│   ├── SpeedControls.tsx
│   ├── AudioTextDisplay.tsx
│   └── hooks/
│       └── useSimulatedAudio.ts
├── ui/
│   ├── PlusOverlay.tsx
│   └── PlusOverlayWithOptions.tsx
└── [existentes]
```

### Estrutura Pós-Refatoração Estimada

- **ImmersiveAudioPlayer.tsx:** ~120 linhas (de 351)
- **AudioTextDisplay.tsx:** ~50 linhas
- **SpeedControls.tsx:** ~35 linhas
- **PlusOverlayWithOptions.tsx:** ~50 linhas
- **useSimulatedAudio.ts:** ~70 linhas
- **AudioPlayerProgress.tsx:** ~40 linhas (compartilhado)
- **Distribuição:** 365 linhas em 6 arquivos

### Redução de Complexidade
- Estados por componente: 9 → 2-3
- Lógica de simulação isolada
- UI components separados
- Reutilização de componentes entre players

---

## 8. CalendarioFavoritosModal.tsx

### Métricas Básicas
- **Total de linhas:** 310
- **Complexidade:** MÉDIA
- **Tecnologias:** React, localStorage, Framer Motion

### Estados (useState)
| Estado | Tipo | Responsabilidade |
|--------|------|------------------|
| `aba` | "calendario" \| "favoritos" | Aba ativa |
| `mesSelecionado` | Date | Mês selecionado |
| `favoritos` | FavoritoItem[] | Lista de favoritos |

**Total: 3 estados** (bem limpo!)

### Múltiplas Responsabilidades Identificadas

1. **Carregamento de Dados (linhas 32-69)**
   - Carregar favoritos do localStorage
   - Agregar de múltiplas fontes
   - Mapear para FavoritoItem

2. **Lógica de Calendário (linhas 71-93)**
   - Gerar dias do mês
   - Marcar dias concluídos
   - Marcar dia de hoje

3. **Navegação de Mês (linhas 95-101)**
   - Mudar mês anterior/próximo

4. **Renderização de Calendário (linhas 177-259)**
   - 82 linhas de calendário

5. **Renderização de Favoritos (linhas 263-302)**
   - 39 linhas de lista de favoritos

6. **UI Utilitária (linhas 103-113)**
   - `tipoCor(tipo)`
   - `tipoLabel(tipo)`

### Dados Hardcoded

```typescript
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = ["Janeiro", "Fevereiro", ...]; // 12 meses
```

### Sub-componentes que Podem ser Criados

1. **CalendarView.tsx**
   - Props: selectedMonth, completedDates, onMonthChange, stats
   - Linhas 177-259 (core calendar)

2. **CalendarHeader.tsx**
   - Props: month, year, onPrevMonth, onNextMonth
   - Linhas 199-216

3. **CalendarGrid.tsx**
   - Props: dias, dayLabels
   - Linhas 218-247

4. **FavoritesView.tsx**
   - Props: favoritos
   - Linhas 263-302

5. **FavoritoItem.tsx**
   - Props: item
   - Linhas 282-299

6. **JourneyStats.tsx**
   - Props: currentStreak, completedDays, maxStreak
   - Linhas 181-196

### Proposta de Refatoração

```
src/components/
├── CalendarioFavoritosModal.tsx (refatorado para ~100 linhas)
├── calendarModal/
│   ├── CalendarView.tsx
│   ├── CalendarHeader.tsx
│   ├── CalendarGrid.tsx
│   ├── JourneyStats.tsx
│   ├── FavoritesView.tsx
│   ├── FavoritoItem.tsx
│   └── hooks/
│       └── useCalendarData.ts
├── data/
│   └── calendar-constants.ts (DIAS_SEMANA, MESES)
└── [existentes]
```

### Estrutura Pós-Refatoração Estimada

- **CalendarioFavoritosModal.tsx:** ~100 linhas (de 310)
- **CalendarView.tsx:** ~50 linhas
- **CalendarHeader.tsx:** ~30 linhas
- **CalendarGrid.tsx:** ~50 linhas
- **JourneyStats.tsx:** ~40 linhas
- **FavoritesView.tsx:** ~50 linhas
- **FavoritoItem.tsx:** ~25 linhas
- **useCalendarData.ts:** ~60 linhas
- **calendar-constants.ts:** ~20 linhas
- **Distribuição:** 425 linhas em 9 arquivos

### Redução de Complexidade
- Estados por componente: 3 → 1-2
- Lógica de calendário isolada
- Lógica de dados isolada em hook
- Componentes reutilizáveis

---

## Resumo de Refatoração

### Por Componente

| Componente | Linhas | Estados | Sub-componentes | Redução Est. |
|-----------|--------|---------|-----------------|------------|
| TabExplorar | 691 | 9 | 5 | -241 linhas |
| TabDiario | 599 | 11 | 6 | -94 linhas |
| TabBiblia | 508 | 7 | 6 | +32 linhas |
| HojeSteps | 444 | 4 | 6 | +66 linhas |
| TabOracoes | 431 | 8 | 4 | -26 linhas |
| MeditationPlayer | 424 | 10 | 5 | +66 linhas |
| ImmersiveAudioPlayer | 351 | 9 | 5 | +14 linhas |
| CalendarioFavoritosModal | 310 | 3 | 6 | +115 linhas |
| **TOTAL** | **3,758** | **61** | **43** | **-68 linhas** |

### Impacto Geral

**Antes:**
- 8 mega-componentes (300-700 linhas)
- 61 estados espalhados
- Lógica duplicada
- Dados hardcoded em componentes

**Depois:**
- 8 componentes principais + 43 sub-componentes
- 10-20 estados por nível
- Lógica extraída em custom hooks
- Dados em arquivos separados
- Componentes reutilizáveis (PlusOverlay, EmptyState, etc)

### Ganhos Principais

1. **Testabilidade**: Cada sub-componente é independente
2. **Reutilização**: Componentes comuns (DailyStepCard, PlusOverlay, etc)
3. **Manutenção**: Lógica isolada em custom hooks
4. **Escalabilidade**: Fácil adicionar features sem aumentar tamanho
5. **Performance**: Componentes menores, melhor memoization
6. **Organizacordação**: Estrutura clara de pastas

### Recomendações Gerais

1. **Prioridade Alta**: TabExplorar (maior ganho) e TabDiario
2. **Custom Hooks a Criar**:
   - `useDiaryStorage` - persistência de diário
   - `usePrayerStorage` - persistência de orações
   - `useAudioPlayer` - lógica de reprodução
   - `useCalendarData` - lógica de calendário
   - `useFavoritesSync` - sincronização de favoritos

3. **Componentes Reutilizáveis Globais**:
   - `PlusOverlay.tsx` - restrição de conteúdo
   - `EmptyState.tsx` - estados vazios
   - `DailyStepCard.tsx` - padrão de card expansível
   - `AudioPlayerProgress.tsx` - barra de progresso de áudio

4. **Estrutura de Pastas Recomendada**:
   ```
   src/
   ├── components/
   │   ├── tabs/
   │   │   ├── TabExplorar.tsx
   │   │   ├── TabDiario.tsx
   │   │   ├── TabBiblia.tsx
   │   │   ├── TabOracoes.tsx
   │   │   ├── explorar/
   │   │   ├── diario/
   │   │   ├── biblia/
   │   │   └── oracoes/
   │   ├── ui/
   │   │   ├── PlusOverlay.tsx
   │   │   ├── EmptyState.tsx
   │   │   └── ...
   │   ├── hojeSteps/
   │   │   └── [sub-componentes]
   │   ├── meditationPlayer/
   │   │   └── [sub-componentes]
   │   └── calendarModal/
   │       └── [sub-componentes]
   ├── hooks/
   │   ├── useAudioPlayer.ts
   │   ├── useDiaryStorage.ts
   │   ├── usePrayerStorage.ts
   │   ├── useCalendarData.ts
   │   └── ...
   ├── data/
   │   ├── meditacoes.ts
   │   ├── oracoes-predefinidas.ts
   │   ├── biblia.ts
   │   ├── filters.ts
   │   └── ...
   └── ...
   ```

---

## Próximas Etapas

1. **Fase 1**: Criar arquivos de dados e custom hooks
2. **Fase 2**: Criar componentes de UI reutilizáveis
3. **Fase 3**: Refatorar TabExplorar (maior impacto)
4. **Fase 4**: Refatorar TabDiario e TabOracoes
5. **Fase 5**: Refatorar TabBiblia
6. **Fase 6**: Refatorar players de áudio
7. **Fase 7**: Refatorar HojeSteps e CalendarioFavoritosModal
8. **Fase 8**: Testes e ajustes finais

---

**Documento finalizado em 2026-02-20**
