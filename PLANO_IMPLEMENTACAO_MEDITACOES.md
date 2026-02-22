# Plano de Implementação: Meditações na Aba Orações

**Arquiteto Responsável:** Aria (@architect)
**Data:** 22 de Fevereiro de 2026
**Status:** Arquitetura de Projeto
**Complexidade Geral:** MEDIUM (M)

---

## 1. VISÃO GERAL DA ARQUITETURA

### Objetivo Principal
Implementar funcionalidade completa de meditações na aba "Orações" (TabOracoes), mantendo paridade com o padrão já estabelecido pela aba "Explorar" (Meditações existentes) e reutilizando 100% da infraestrutura de orações.

### Escopo de Integração
- **17 meditações** do arquivo `meditacao.xlsx` (Cloudflare R2)
- **Formato de áudio:** MP3 (via `/api/audio` proxy para CORS)
- **Biblioteca de imagens:** `/public/images/creation_*.png` (compartilhada)
- **Padrão visual:** Identidade com `PrayerCard` (orações)
- **Localização:** 4 meditações iniciais + modal "VER TUDO" com paginação

### Princípio de Design: REUSE > ADAPT
- **Reutilizar:** `ContentSection`, `PrayerCard` como template
- **Adaptar:** Componentes card para tipo "Meditation" (sem quebrar Prayer)
- **Criar:** `meditacoes.ts` (data layer) + `TabMeditacoes.tsx` (aba)

---

## 2. FLUXO DE DADOS: Excel → App Display

```
┌─────────────────────────────────────────────────────────────┐
│                   Google Sheets/Excel                        │
│              (meditacao.xlsx - 17 registros)                 │
└────────────────┬────────────────────────────────────────────┘
                 │ (Manual ou sync-script)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│          scripts/sync-meditacoes.ts (NOVO)                  │
│  - Busca dados do Excel via Google Sheets API               │
│  - Remove tags [inhales], etc                               │
│  - Mapeia imagens aleatórias/inteligentes                   │
│  - Valida URLs de áudio (R2)                                │
│  - Gera MEDITACOES array TypeScript                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│           src/data/meditacoes.ts (NOVO)                     │
│  - Interface: Meditacao {id, titulo, descricao...}          │
│  - Export: MEDITACOES: Meditacao[] (17 items)               │
│  - Mirrors: src/data/oracoes.ts structure                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│       src/components/tabs/TabMeditacoes.tsx (NOVO)          │
│  - Estado local: selectedMeditation, showAllModal           │
│  - Handlers: handlePlayMeditation, toggleFavorite           │
│  - Renderiza: 4 MeditationCards + ContentSection            │
└────────────────┬────────────────────────────────────────────┘
                 │
       ┌─────────┴──────────┐
       ▼                    ▼
┌──────────────────┐   ┌──────────────────┐
│  MeditationCard  │   │ MeditationsModal  │
│  (4 cards vistos)│   │ (todos + paginação)
└──────────────────┘   └──────────────────┘
       │                    │
       └─────────┬──────────┘
                 ▼
        ┌────────────────────┐
        │ MeditationPlayer   │
        │ (áudio + UI)       │
        └────────────────────┘
```

### Fluxo de Áudio (CORS via Proxy)
```
MeditationCard.onClick()
    │
    ├─→ useMeditationPlayer hook
    │   │
    │   ├─→ audioUrl: https://pub-*.r2.dev/Med_*.mp3
    │   │
    │   └─→ Proxy: /api/audio?url=<encoded-url>
    │       │
    │       └─→ Server-side fetch (sem CORS)
    │           Response + Access-Control-Allow-Origin headers
    │
    └─→ <audio> elemento toca com sucesso
```

---

## 3. ARQUITETURA DE COMPONENTES

### Hierarquia de Componentes
```
TabMeditacoes (Container Principal)
├── UserHeader
│   └── Ícone distintivo (diferente de Orações)
├── ContentSection
│   └── MeditationCard × 4
│       ├── Imagem aleatória
│       ├── Botão Play (overlay)
│       ├── Botão Favorite (coração)
│       └── Metadados (duração, categoria)
├── MeditationsModal (VER TUDO)
│   ├── Paginação (20 por página, máx 1 página)
│   └── MeditationCard × até 20
└── MeditationPlayer
    ├── Controles de reprodução
    ├── Barra de progresso
    └── Exibição de duração
```

### Decisão de Componentização

**Opção A: Componente único `MeditationCard` (RECOMENDADO)**
- ✅ Reutiliza 90% do código de `PrayerCard`
- ✅ Mesma assinatura de props (com pequenas diferenças)
- ✅ Mantém consistência visual
- ✅ Simplifica manutenção

**Opção B: Tipo genérico `ContentCard`**
- ❌ Maior refactoring inicial
- ❌ Risco de quebrar Orações existentes
- ⚠️ Melhor para futura escalabilidade (Bíblia, etc)

**Decisão:** Implementar Opção A com interface discriminada:
```typescript
type Card = PrayerCard | MeditationCard;
// Cada um mantém sua interface específica
// MeditationCard adapta visualmente, não estruturalmente
```

---

## 4. FASES DE IMPLEMENTAÇÃO

## FASE 1: Data Layer & Infraestrutura de Sincronização

**Duração Estimada:** 1-2 horas
**Esforço:** XS (Extra Small)
**Responsável:** @dev (após design de dados)

### 4.1.1 Objetivos
- [ ] Criar script de sincronização de meditações (`sync-meditacoes.ts`)
- [ ] Estruturar dados em `src/data/meditacoes.ts`
- [ ] Validar integração com Google Sheets API (reutilizar `SheetsClient`)
- [ ] Implementar mapeamento automático de imagens

### 4.1.2 Arquivos a Criar/Modificar
| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `scripts/sync-meditacoes.ts` | **CREATE** | Script de sincronização (mirror de `sync-oracoes.ts`) |
| `src/data/meditacoes.ts` | **CREATE** | Definição de interfaces + dados exportados |
| `src/lib/image-mapper.ts` | **ADAPT** | Adicionar método `mapMeditacoes()` (reutilizar lógica) |
| `package.json` | **MODIFY** | Adicionar script: `"sync:meditacoes": "ts-node scripts/sync-meditacoes.ts"` |

### 4.1.3 Tarefas Técnicas Específicas

#### 4.1.3.1 Criar `src/data/meditacoes.ts`
```typescript
// Importar estrutura de ORACOES como referência
export interface Meditacao {
  id: string;              // ex: "paz-aguas-tranquilas"
  titulo: string;          // ex: "A Paz das Águas Tranquilas"
  descricao: string;       // Primeiras linhas do áudio/texto
  audioUrl: string;        // URL Cloudflare R2 (MP3)
  imagem: {
    background: string;    // ex: "creation_1234.png"
    icon: string;
  };
  duracao: number;         // Segundos (extraído de metadata de áudio)
  tema: string;           // ex: "paz", "ansiedade", "meditacao"
  criadoEm: string;       // ISO timestamp
  tags?: string[];        // ["PAZ", "SONO", "<5MINS"]
}

export const MEDITACOES: Meditacao[] = [
  // 17 itens gerados por sync-meditacoes.ts
];

export const MEDITACOES_COUNT = 17;
```

#### 4.1.3.2 Criar `scripts/sync-meditacoes.ts`
```typescript
// Estrutura:
// 1. Ler credenciais Google (reutilizar jornadacomdeus-ce9c0e55fc3e.json)
// 2. Conectar a nova aba "meditacao.xlsx" (mesmo spreadsheet ou novo?)
// 3. Extrair campos: titulo, descricao, audioUrl, duracao, tema
// 4. Remover tags: [inhales deeply], [pause], etc (mesmo removeTagsFromText)
// 5. Mapear imagens com ImageMapper.mapMeditacoes()
// 6. Validar URLs de áudio (ping R2, verificar 200 OK)
// 7. Escrever src/data/meditacoes.ts
// 8. Imprimir relatório: "✅ 17 meditações sincronizadas"
```

#### 4.1.3.3 Adaptar `src/lib/image-mapper.ts`
```typescript
class ImageMapper {
  mapOracoes(titulos: string[]): ImageMapping[] { /*...*/}

  // NOVO:
  mapMeditacoes(titulos: string[]): ImageMapping[] {
    // Reutilizar mesma lógica hash-based de mapOracoes()
    // Ou implementar seleção aleatória com seed consistente
  }
}
```

### 4.1.4 Dependências e Bloqueadores
- ✅ `SheetsClient` já existe e funciona
- ✅ Google Sheets credentials já configuradas
- ⚠️ **BLOQUEADOR:** Necessário identificar nome exato da aba no Excel ("meditacao.xlsx" - qual aba?)
- ⚠️ **BLOQUEADOR:** Validar que 17 meditações estão no Excel/Sheets com campos corretos

### 4.1.5 Critérios de Aceitação
- [ ] `npm run sync:meditacoes` executa sem erros
- [ ] Gera 17 registros em `src/data/meditacoes.ts`
- [ ] Todas as URLs de áudio retornam HTTP 200
- [ ] Todas as imagens mapeadas existem em `/public/images/`
- [ ] TypeScript compila sem erros em `meditacoes.ts`
- [ ] `MEDITACOES_COUNT === 17`

---

## FASE 2: Componentes de Apresentação (Cards & Modais)

**Duração Estimada:** 2-3 horas
**Esforço:** S (Small)
**Responsável:** @dev

### 4.2.1 Objetivos
- [ ] Criar `MeditationCard.tsx` (adaptação de `PrayerCard.tsx`)
- [ ] Criar `MeditationsModal.tsx` (adaptação de `OracoesModal.tsx`)
- [ ] Implementar sistema de favoritos para meditações
- [ ] Validar que imagens carregam corretamente

### 4.2.2 Arquivos a Criar/Modificar
| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `src/components/tabs/meditacoes/MeditationCard.tsx` | **CREATE** | Card visual (clone de PrayerCard com ajustes) |
| `src/components/tabs/meditacoes/MeditationsModal.tsx` | **CREATE** | Modal com lista completa (clone de OracoesModal) |
| `src/components/tabs/meditacoes/index.ts` | **CREATE** | Barrel export |
| `src/hooks/useMeditationFavorites.ts` | **CREATE** | Hook de favoritos (ou reutilizar `useFavorites`) |

### 4.2.3 Tarefas Técnicas Específicas

#### 4.2.3.1 Criar `src/components/tabs/meditacoes/MeditationCard.tsx`
**Baseado em:** `src/components/tabs/oracoes/PrayerCard.tsx`

```typescript
interface MeditationCardProps {
  meditation: Meditacao;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (meditation: Meditacao) => void;
}

export function MeditationCard({
  meditation,
  isFavorite,
  onToggleFavorite,
  onViewDetails
}: MeditationCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = meditation.imagem?.background
    ? `/images/${meditation.imagem.background}`
    : null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md
                    transition-shadow group cursor-pointer"
         onClick={() => onViewDetails(meditation)}>

      {/* Imagem com fallback gradiente */}
      <div className="relative h-40 overflow-hidden bg-gray-200">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={meditation.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-600" />
        )}

        {/* Botões overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30
                        transition-colors flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(meditation);
            }}
            className="p-3 rounded-full transition-all bg-white text-purple-600
                       hover:bg-purple-600 hover:text-white"
          >
            <Play className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(meditation.id);
            }}
            className={cn(
              "p-3 rounded-full transition-all",
              isFavorite
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-600 hover:bg-purple-600 hover:text-white"
            )}
          >
            <Heart className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
          {meditation.titulo}
        </h3>
        <p className="text-xs text-gray-600">
          {formatDuration(meditation.duracao)}
        </p>
        {meditation.descricao && (
          <p className="text-xs text-gray-600 line-clamp-2 mt-2">
            {meditation.descricao}
          </p>
        )}
        {meditation.tags && meditation.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {meditation.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-xs
                          bg-purple-100 text-purple-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Diferenças de Design:**
- Cor primária: **Roxo/Púrpura** (em vez de laranja de orações)
- Gradiente fallback: `purple-400 → indigo-600`
- Tags: máximo 2 visíveis, sem categoria fixa

#### 4.2.3.2 Criar `src/components/tabs/meditacoes/MeditationsModal.tsx`
**Baseado em:** `src/components/tabs/oracoes/OracoesModal.tsx`

```typescript
interface MeditationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (meditation: Meditacao) => void;
}

export function MeditationsModal({
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onViewDetails
}: MeditationsModalProps) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 20;

  const paginatedMeditacoes = MEDITACOES.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const totalPages = Math.ceil(MEDITACOES.length / itemsPerPage);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh]
                      overflow-y-auto p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Todas as Meditações ({MEDITACOES.length})</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {paginatedMeditacoes.map(meditation => (
            <MeditationCard
              key={meditation.id}
              meditation={meditation}
              isFavorite={isFavorite(meditation.id)}
              onToggleFavorite={onToggleFavorite}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded
                        disabled:opacity-50"
            >
              ← Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {page + 1} de {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-4 py-2 bg-purple-600 text-white rounded
                        disabled:opacity-50"
            >
              Próxima →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 4.2.4 Dependências e Bloqueadores
- ✅ Componentes base (`PrayerCard`, `OracoesModal`) já existem
- ✅ Estrutura de favoritos (`useFavorites`) pronta
- ⚠️ Necessário definir paleta de cores (Roxo vs alternativa)

### 4.2.5 Critérios de Aceitação
- [ ] `MeditationCard` renderiza 4 meditações iniciais
- [ ] Imagens carregam com fallback roxo funcionando
- [ ] Botões Play e Favorite respondem a cliques
- [ ] Modal "VER TUDO" abre com 17 meditações
- [ ] Paginação funciona (apenas 1 página para 17 itens)
- [ ] Sem erros TypeScript/ESLint
- [ ] Cores e espaçamento consistentes com design system

---

## FASE 3: Container Principal & Integração com TabOracoes

**Duração Estimada:** 2-3 horas
**Esforço:** S (Small)
**Responsável:** @dev

### 4.3.1 Objetivos
- [ ] Criar `TabMeditacoes.tsx` (container principal)
- [ ] Integrar hook de favoritos com persistência
- [ ] Adicionar player de meditações
- [ ] Renderizar aba no contexto de orações

### 4.3.2 Arquivos a Criar/Modificar
| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `src/components/tabs/TabMeditacoes.tsx` | **CREATE** | Container principal (mirror de TabOracoes) |
| `src/hooks/useMeditationPlayer.ts` | **CREATE** | Hook com controles de reprodução |
| `src/components/tabs/meditacoes/index.ts` | **CREATE** | Barrel export |

### 4.3.3 Tarefas Técnicas Específicas

#### 4.3.3.1 Criar `src/components/tabs/TabMeditacoes.tsx`
```typescript
import { useState } from "react";
import { MEDITACOES, Meditacao } from "@/data/meditacoes";
import { UserHeader } from "@/components/layout/UserHeader";
import { ContentSection } from "./explorar/ContentSection";
import { MeditationsModal } from "./meditacoes/MeditationsModal";
import { MeditationDetailModalWithPlayer } from "./meditacoes/MeditationDetailModalWithPlayer";
import { MeditationCard } from "./meditacoes/MeditationCard";
import { Wand2 } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

export function TabMeditacoes() {
  const [showAllModal, setShowAllModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState<Meditacao | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  // Handlers
  const handleViewDetails = (meditation: Meditacao) => {
    setSelectedMeditation(meditation);
    setShowDetailModal(true);
  };

  // Apenas primeiros 4 itens
  const inicialMeditacoes = MEDITACOES.slice(0, 4);

  return (
    <>
      <div className="min-h-screen bg-[#FAF9F6] p-6 pb-28">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header padronizado */}
          <UserHeader
            title="Meditações"
            rightElement={
              <div className="w-10 h-10 rounded-full bg-purple-600/20
                            flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-purple-600" />
              </div>
            }
          />

          {/* Seção de Meditações */}
          <ContentSection
            title="Meditações"
            onViewAll={() => setShowAllModal(true)}
          >
            {inicialMeditacoes.map((meditacao) => (
              <MeditationCard
                key={meditacao.id}
                meditation={meditacao}
                isFavorite={isFavorite(meditacao.id)}
                onToggleFavorite={toggleFavorite}
                onViewDetails={handleViewDetails}
              />
            ))}
          </ContentSection>

        </div>
      </div>

      {/* Modal com todas as meditações */}
      {showAllModal && (
        <MeditationsModal
          isOpen={showAllModal}
          onClose={() => setShowAllModal(false)}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Modal de detalhe com player */}
      {showDetailModal && selectedMeditation && (
        <MeditationDetailModalWithPlayer
          meditation={selectedMeditation}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedMeditation(null);
          }}
          isFavorite={isFavorite(selectedMeditation.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </>
  );
}
```

#### 4.3.3.2 Criar `src/components/tabs/meditacoes/MeditationDetailModalWithPlayer.tsx`
**Baseado em:** `src/components/tabs/oracoes/PrayerDetailModalWithPlayer.tsx`

```typescript
interface MeditationDetailModalWithPlayerProps {
  meditation: Meditacao;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function MeditationDetailModalWithPlayer({
  meditation,
  onClose,
  isFavorite,
  onToggleFavorite
}: MeditationDetailModalWithPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4">

        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold flex-1">{meditation.titulo}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Imagem */}
        {meditation.imagem?.background && (
          <img
            src={`/images/${meditation.imagem.background}`}
            alt={meditation.titulo}
            className="w-full h-40 object-cover rounded-lg"
          />
        )}

        {/* Descrição */}
        {meditation.descricao && (
          <p className="text-sm text-gray-700 line-clamp-4">
            {meditation.descricao}
          </p>
        )}

        {/* Player controles */}
        <div className="space-y-3 bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePlay}
              className="p-3 rounded-full bg-purple-600 text-white
                        hover:bg-purple-700 transition"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <div className="text-sm text-gray-700">
              {formatTime(currentTime)} / {formatTime(meditation.duracao)}
            </div>
          </div>

          {/* Barra de progresso */}
          <input
            type="range"
            min="0"
            max={meditation.duracao}
            value={currentTime}
            onChange={(e) => {
              const newTime = parseFloat(e.target.value);
              setCurrentTime(newTime);
              if (audioRef.current) {
                audioRef.current.currentTime = newTime;
              }
            }}
            className="w-full"
          />

          {/* Audio element */}
          <audio
            ref={audioRef}
            src={meditation.audioUrl}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onEnded={() => setIsPlaying(false)}
          />
        </div>

        {/* Favorite button */}
        <button
          onClick={() => onToggleFavorite(meditation.id)}
          className={cn(
            "w-full py-2 rounded-lg font-medium transition",
            isFavorite
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          )}
        >
          {isFavorite ? "❤️ Remover dos Favoritos" : "🤍 Adicionar aos Favoritos"}
        </button>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
```

### 4.3.4 Dependências e Bloqueadores
- ✅ `useFavorites` hook já existe
- ✅ `UserHeader`, `ContentSection` reutilizáveis
- ⚠️ Necessário que `usePrayerPlayer.ts` seja adaptável para meditações

### 4.3.5 Critérios de Aceitação
- [ ] `TabMeditacoes` renderiza sem erros
- [ ] Exibe exatamente 4 meditações iniciais
- [ ] Botão "VER TUDO" abre modal com todas
- [ ] Player de áudio funciona (play/pause/progresso)
- [ ] Favoritos persistem durante sessão
- [ ] Navegação fluida entre modal e player
- [ ] TypeScript sem erros

---

## FASE 4: Integração na Navegação Principal

**Duração Estimada:** 1-2 horas
**Esforço:** XS (Extra Small)
**Responsável:** @dev

### 4.4.1 Objetivos
- [ ] Adicionar aba "Meditações" à navegação
- [ ] Definir rota/link apropriado
- [ ] Testar navegação e transições

### 4.4.2 Arquivos a Modificar
| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `src/components/tabs/TabOracoes.tsx` | **MODIFY** | Adicionar seção de meditações (ou criar import) |
| `src/components/BottomNav.tsx` | **MODIFY** | Adicionar ícone/link para Meditações |
| `src/app/page.tsx` (ou home) | **MODIFY** | Adicionar rota se necessário |

### 4.4.3 Tarefas Técnicas Específicas

#### 4.4.3.1 Atualizar `src/components/tabs/TabOracoes.tsx`
**Opção A (Recomendada):** Integrar meditações como subsection
```typescript
export function TabOracoes() {
  // ... estado de orações existente ...

  return (
    <>
      <div className="min-h-screen bg-[#FAF9F6] p-6 pb-28">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <UserHeader title="Orações" {...} />

          {/* Seção Orações (existente) */}
          <ContentSection title="Orações" {...}>
            {/* ... cards de orações ... */}
          </ContentSection>

          {/* NOVO: Seção Meditações */}
          <ContentSection
            title="Meditações Relacionadas"
            onViewAll={() => {
              // Navegar para página dedicada de meditações
              // ou abrir modal
            }}
          >
            {MEDITACOES.slice(0, 4).map(med => (
              <MeditationCard key={med.id} meditation={med} {...} />
            ))}
          </ContentSection>

        </div>
      </div>
    </>
  );
}
```

**Opção B:** Página dedicada `/app/meditacoes/page.tsx`
```typescript
// src/app/meditacoes/page.tsx
export default function MeditacoesPage() {
  return <TabMeditacoes />;
}
```

**Decisão recomendada:** Opção A (integração na aba Orações) mantém padrão de "Explorar" com múltiplas seções. Opção B reservada para quando meditações crescerem.

#### 4.4.3.2 Atualizar `src/components/BottomNav.tsx`
```typescript
// Adicionar navegação:
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
  <div className="flex justify-around">
    <NavLink href="/app/hoje" icon={<Home />} label="Hoje" />
    <NavLink href="/app/oracoes" icon={<Heart />} label="Orações" />
    {/* NOVO: */}
    <NavLink href="/app/oracoes#meditacoes" icon={<Sparkles />} label="Meditações" />
    <NavLink href="/app/explorar" icon={<Compass />} label="Explorar" />
    {/* ... */}
  </div>
</nav>
```

### 4.4.4 Dependências e Bloqueadores
- ✅ Estrutura de navegação já existe
- ⚠️ Decisão de arquitetura: integrada vs página separada

### 4.4.5 Critérios de Aceitação
- [ ] Meditações acessíveis do menu principal
- [ ] Navegação não quebra roteiros existentes
- [ ] Links funciona sem erros 404
- [ ] Transições suaves

---

## FASE 5: Testes, Validação & Polish

**Duração Estimada:** 2-3 horas
**Esforço:** S (Small)
**Responsável:** @qa

### 4.5.1 Objetivos
- [ ] Executar teste E2E completo (meditação do início ao fim)
- [ ] Validar carregamento de imagens e áudio
- [ ] Testar paginação e favoritos
- [ ] Executar linting e type checks
- [ ] Validar performance (bundle size, load time)

### 4.5.2 Artefatos de Teste
| Teste | Descrição | Critério de Sucesso |
|-------|-----------|-------------------|
| **E2E Audio** | Clicar em card → Play áudio | Áudio toca sem erros CORS |
| **E2E Favoritos** | Toggle favorite → persiste | Favorite persiste após reload |
| **Galeria de Imagens** | 4 cards carregam imagens | Todas as imagens visíveis, sem placeholders |
| **Modal Paginação** | Abrir "VER TUDO" → navegar | 1 página com 17 meditações |
| **TypeScript** | `npm run typecheck` | 0 erros |
| **Linting** | `npm run lint` | 0 erros/warnings |
| **Bundle** | `npm run build` | Sem aumento significativo |

### 4.5.3 Tarefas Técnicas
- [ ] Executar fluxo completo: aba Orações → seção Meditações → card → player
- [ ] Testar em mobile (viewport 375px) e desktop (1920px)
- [ ] Verificar fallbacks de imagem/áudio
- [ ] Performance: medir tempo de carregamento inicial
- [ ] Acessibilidade: Alt text em imagens, ARIA labels em botões

### 4.5.4 Critérios de Aceitação (Gate QA)
- [ ] Todas as 17 meditações carregam e tocam
- [ ] Nenhum erro no console (erros, warnings)
- [ ] Imagens carregam em <2s
- [ ] Áudio toca em <1s após clique
- [ ] Favoritos persistem
- [ ] Responsivo em todos os breakpoints
- [ ] TypeScript/ESLint sem erros
- [ ] Bundle size delta < 500KB

---

## 5. MATRIZ DE DEPENDÊNCIAS E BLOQUEADORES

```
FASE 1 (Data Layer)
  ↓
  └─→ BLOQUEADOR: Excel/Sheets não pronto?
      ├─ MITIGAÇÃO: Usar dados mock (meditacoes.mock.ts)
      └─ RETOMAR: Quando dados prontos, executar sync-meditacoes.ts

FASE 1 ✓
  ↓
FASE 2 (Components)
  ├─→ BLOQUEADOR: Design system colors undefined?
  │   └─ MITIGAÇÃO: Usar cores padrão (roxo)
  └─→ DEPENDÊNCIA: MEDITACOES array do FASE 1 ✓

FASE 2 ✓
  ↓
FASE 3 (Container)
  ├─→ DEPENDÊNCIA: MEDITACOES ✓
  └─→ DEPENDÊNCIA: MeditationCard ✓

FASE 3 ✓
  ↓
FASE 4 (Navigation)
  ├─→ DEPENDÊNCIA: TabMeditacoes ✓
  └─→ BLOQUEADOR: UX Decision (integrada vs página)?

FASE 4 ✓
  ↓
FASE 5 (QA)
  └─→ Todos os anteriores ✓
```

---

## 6. ANÁLISE DE RISCOS

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|--------|-----------|
| **Dados do Excel incompletos** | MÉDIA | ALTO | Mock data; validar antes de FASE 1 |
| **Quebra de existentes (Orações)** | BAIXA | CRÍTICO | Refactor em branch isolado; validar PrayerCard |
| **CORS de áudio no Cloudflare R2** | BAIXA | MÉDIO | `/api/audio` proxy já existe; reutilizar |
| **Performance (bundle size)** | BAIXA | MÉDIO | Code splitting; lazy load de modais |
| **Sincronismo de favoritos** | BAIXA | BAIXO | Usar `useFavorites` existente |
| **Imagens não encontradas** | MÉDIO | BAIXO | Gradiente fallback implementado |

**Ações Preventivas:**
1. Testes unitários para `MeditationCard` (isolado de Prayer)
2. Validação de schema em `sync-meditacoes.ts`
3. Teste de carga: 17 meditações + 4 cards iniciais < 100ms
4. Backup de oracoes.ts antes de refactors

---

## 7. ESFORÇO ESTIMADO POR FASE

| Fase | Tarefa | Duração | Esforço | Observações |
|------|--------|---------|--------|------------|
| **1** | Data Layer | 1-2h | XS | Reutiliza sync-oracoes.ts |
| **1** | Image Mapping | 30min | XS | Adapta mapOracoes() |
| **2** | MeditationCard | 45min | XS | Clone de PrayerCard |
| **2** | MeditationsModal | 30min | XS | Clone de OracoesModal |
| **3** | TabMeditacoes | 1h | S | Container padrão |
| **3** | MeditationDetailModal | 1h | S | Clone de Prayer version |
| **4** | Navigation Integration | 1h | XS | Adds routes/links |
| **5** | QA & Testing | 2-3h | S | E2E, linting, validation |
| **Overhead** | Refactors, fixes | 1h | XS | Buffer contingency |
| **TOTAL** | | **9-12 horas** | **M** | ~1.5 sprints |

---

## 8. FLUXO DE IMPLEMENTAÇÃO RECOMENDADO

### Sprint 0: Planning & Setup (30 min)
- [ ] Validar dados do Excel (17 meditações prontas?)
- [ ] Revisar estrutura de Orações como referência
- [ ] Criar branch: `feature/meditacoes-tab`

### Sprint 1: Fases 1-2 (4-5 horas)
**Day 1:**
- [ ] FASE 1: Criar `sync-meditacoes.ts` + `meditacoes.ts`
- [ ] `npm run sync:meditacoes` → validar 17 registros
- [ ] Commit: `feat: add meditation data layer`

**Day 2:**
- [ ] FASE 2: Criar `MeditationCard.tsx`
- [ ] FASE 2: Criar `MeditationsModal.tsx`
- [ ] Testar cards renderizados com dados mock
- [ ] Commit: `feat: add meditation components`

### Sprint 2: Fases 3-5 (4-7 horas)
**Day 3:**
- [ ] FASE 3: Criar `TabMeditacoes.tsx`
- [ ] FASE 3: Criar `MeditationDetailModalWithPlayer.tsx`
- [ ] Teste manual: player de áudio funciona?
- [ ] Commit: `feat: add meditation container & player`

**Day 4:**
- [ ] FASE 4: Integrar navegação
- [ ] FASE 5: QA completo (E2E, linting, type checks)
- [ ] Refinements (cores, espaçamento)
- [ ] Commit: `feat: integrate meditation navigation`
- [ ] Pull Request com documentação

---

## 9. PADRÕES DE CÓDIGO & CONVENÇÕES

### Estrutura de Diretórios
```
src/
├── components/tabs/
│   ├── TabMeditacoes.tsx          (novo)
│   └── meditacoes/                (novo)
│       ├── index.ts               (barrel export)
│       ├── MeditationCard.tsx      (novo)
│       ├── MeditationsModal.tsx    (novo)
│       └── MeditationDetailModalWithPlayer.tsx (novo)
├── data/
│   └── meditacoes.ts              (novo)
├── hooks/
│   └── useMeditationPlayer.ts      (novo, opcional)
└── lib/
    └── image-mapper.ts            (adapt)

scripts/
└── sync-meditacoes.ts             (novo)
```

### Convenções de Naming
- **Interfaces:** `Meditacao` (sem S plural em interfaces)
- **Componentes:** `MeditationCard`, `MeditationsModal`
- **Hooks:** `useMeditationPlayer`
- **Constants:** `MEDITACOES`, `MEDITACOES_COUNT`
- **Functions:** `formatDuration`, `removeTagsFromText`

### Cor Sistema (Meditações vs Orações)
| Elemento | Orações | Meditações |
|----------|---------|-----------|
| Primary | `#FB923C` (Laranja) | `#9333EA` (Roxo) |
| Bg Fallback | `green-400 → blue-500` | `purple-400 → indigo-600` |
| Hover | `opacity-30` dark overlay | `opacity-30` dark overlay |
| Accent | `#10B981` (Verde) | `#6D28D9` (Roxo escuro) |

---

## 10. DOCUMENTAÇÃO E RASTREABILIDADE

### Arquivos de Referência (Padrão)
- `src/components/tabs/oracoes/PrayerCard.tsx` → template para `MeditationCard`
- `src/components/tabs/oracoes/OracoesModal.tsx` → template para `MeditationsModal`
- `src/components/tabs/TabOracoes.tsx` → template para `TabMeditacoes`
- `scripts/sync-oracoes.ts` → template para `sync-meditacoes.ts`
- `src/data/oracoes.ts` → schema para `meditacoes.ts`

### Comentários de Código
```typescript
// Padrão REUSE:
// Adaptado de: src/components/tabs/oracoes/PrayerCard.tsx
// Mudanças: cor primária roxo, tags limitado a 2

// NOVO bloco:
// NOVO: Suporte a meditações com duração em segundos
// Schema: mesma estrutura de Oracoes para máxima reutilização
```

### Commits Semanticamente Significativos
```
feat: add meditation data layer (FASE 1)
- Create scripts/sync-meditacoes.ts
- Create src/data/meditacoes.ts with 17 records
- Adapt src/lib/image-mapper.ts::mapMeditacoes()

feat: add meditation card & modal components (FASE 2)
- Create MeditationCard.tsx (adapted from PrayerCard)
- Create MeditationsModal.tsx (adapted from OracoesModal)
- Define purple color scheme for meditation UI

feat: add meditation container & player (FASE 3)
- Create TabMeditacoes.tsx
- Create MeditationDetailModalWithPlayer.tsx
- Integrate audio proxy (/api/audio)

feat: integrate meditation navigation (FASE 4)
- Update BottomNav.tsx with Meditações link
- Add meditacoes section to TabOracoes
- Update routes

test: add meditation E2E & QA (FASE 5)
- All 17 meditations load & play
- Favorites persist
- Responsive on mobile & desktop
- Zero TypeScript/linting errors
```

---

## 11. CHECKLIST FINAL DE ACEIÇÃO

### Funcionalidade Completa
- [ ] 17 meditações carregadas de Excel/Sheets
- [ ] 4 meditações visíveis na aba Orações (seção)
- [ ] "VER TUDO" abre modal com todas as 17
- [ ] Clique em card abre player com áudio
- [ ] Play/pause/progresso funciona
- [ ] Favoritos toggle + persistência
- [ ] Navegação sem quebras

### Qualidade de Código
- [ ] TypeScript: `npm run typecheck` = 0 erros
- [ ] ESLint: `npm run lint` = 0 erros
- [ ] Build: `npm run build` completa sem warnings
- [ ] Tests: Unit tests para MeditationCard (se aplicável)

### Performance & UX
- [ ] Bundle size delta < 500KB
- [ ] Imagens carregam em < 2s
- [ ] Áudio toca em < 1s após clique
- [ ] Responsivo em mobile/tablet/desktop
- [ ] Nenhum erro no console

### Documentação
- [ ] Código comentado (REUSE/NOVO/adapts)
- [ ] Commits semânticos com descrições
- [ ] README atualizado com novas rotas (se necessário)
- [ ] Padrões documentados em PLANO_IMPLEMENTACAO_MEDITACOES.md

---

## 12. REFERÊNCIAS E RECURSOS

### Documentação Interna
- `src/data/oracoes.ts` - Schema de orações (modelo)
- `scripts/sync-oracoes.ts` - Script de sincronização (modelo)
- `src/lib/sheets-client.ts` - Google Sheets client
- `src/lib/image-mapper.ts` - Image mapping logic

### Dependências Reutilizadas
- `framer-motion` (staggerContainer animations)
- `lucide-react` (ícones: Play, Heart, Wand2)
- Tailwind CSS (styling)
- `cn()` utility (className merging)

### Testes Recomendados
```bash
# Build & checks
npm run build
npm run typecheck
npm run lint

# Data sync
npm run sync:meditacoes

# E2E manual (until automated)
# 1. Navigate to /app/oracoes
# 2. Scroll to "Meditações Relacionadas"
# 3. Click first card → player opens
# 4. Click play → audio plays
# 5. Toggle favorite → persists
# 6. Click "VER TUDO" → modal with all 17
```

---

## APÊNDICE: Exemplo de Estrutura `meditacoes.ts` Completa

```typescript
/**
 * src/data/meditacoes.ts
 *
 * AUTO-GERADO por scripts/sync-meditacoes.ts
 * NÃO EDITE MANUALMENTE
 */

export interface Meditacao {
  id: string;                    // ex: "paz-aguas-tranquilas"
  titulo: string;                // ex: "A Paz das Águas Tranquilas"
  descricao: string;             // Primeiras 200 caracteres do áudio
  audioUrl: string;              // URL Cloudflare R2 (.mp3)
  imagem: {
    background: string;          // ex: "creation_2422229105.png"
    icon: string;                // mesmo da background
  };
  duracao: number;               // Segundos
  tema: string;                  // ex: "paz", "ansiedade"
  tags?: string[];               // ["PAZ", "DORMIR", "<5MINS"]
  criadoEm: string;              // ISO 8601 timestamp
}

// Dados completos (17 meditações)
export const MEDITACOES: Meditacao[] = [
  {
    id: "paz-aguas-tranquilas",
    titulo: "A Paz das Águas Tranquilas",
    descricao: "Respire comigo, suavemente... sinta o peso de seu corpo...",
    audioUrl: "https://pub-78cb2e5dd78e4d38af1ad1634018010a.r2.dev/Med_20260217171734_696.mp3",
    imagem: {
      background: "creation_1234567890.png",
      icon: "creation_1234567890.png"
    },
    duracao: 720,
    tema: "paz",
    tags: ["PAZ", "TRANQUILIDADE", "REPOUSO"],
    criadoEm: "2026-02-17T17:17:34.000Z"
  },
  // ... 16 itens mais ...
];

export const MEDITACOES_COUNT = 17;

export default MEDITACOES;
```

---

**Documento Aprovado por:** @architect (Aria)
**Próxima Etapa:** Implementação FASE 1 (Data Layer)
**Estimativa:** 1.5 sprints (9-12 horas)
**Risco Geral:** BAIXO-MÉDIO (padrão bem estabelecido, reutilização alta)

