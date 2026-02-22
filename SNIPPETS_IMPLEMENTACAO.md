# Code Snippets - Guia de Implementação Rápida

**Objetivo:** Referência pronta para copiar-colar durante implementação
**Atualizado:** 22 de Fevereiro de 2026

---

## FASE 1: Data Layer

### 1.1 Adicionar script em `package.json`

```json
{
  "scripts": {
    "sync:oracoes": "ts-node scripts/sync-oracoes.ts",
    "sync:meditacoes": "ts-node scripts/sync-meditacoes.ts"
  }
}
```

### 1.2 Criar `src/data/meditacoes.ts` (header)

```typescript
/**
 * src/data/meditacoes.ts
 *
 * AUTO-GERADO por scripts/sync-meditacoes.ts
 * Gerado: 2026-02-22T12:00:00.000Z
 * NÃO EDITE MANUALMENTE
 */

export interface Meditacao {
  id: string;
  titulo: string;
  descricao: string;
  audioUrl: string;
  imagem: {
    background: string;
    icon: string;
  };
  duracao: number;
  tema: string;
  tags?: string[];
  criadoEm: string;
}

export interface Prayer {
  id: string;
  title: string;
  content: string;
  category: string;
  isCustom: boolean;
  createdAt: Date;
  audioUrl?: string;
  duration?: number;
  imagem?: {
    background: string;
    icon: string;
  };
}

// Dados exportados
export const MEDITACOES: Meditacao[] = [
  // Preenchido por sync-meditacoes.ts
];

export const MEDITACOES_COUNT = 17;

export default MEDITACOES;
```

### 1.3 Adaptar `src/lib/image-mapper.ts`

```typescript
// Adicionar método após mapOracoes()

mapMeditacoes(titulos: string[]): ImageMapping[] {
  const imagemFiles = [
    'creation_2422229105.png',
    'creation_1234567890.png',
    // ... todas as imagens disponíveis
  ];

  return titulos.map((titulo, index) => {
    // Usar hash simples do título como seed
    const hash = titulo
      .split('')
      .reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0);

    const imageIndex = Math.abs(hash) % imagemFiles.length;
    const imagemFile = imagemFiles[imageIndex];

    return {
      titulo,
      imagem: {
        background: imagemFile,
        icon: imagemFile,
      },
    };
  });
}
```

---

## FASE 2: Components

### 2.1 `src/components/tabs/meditacoes/MeditationCard.tsx`

```typescript
import { Meditacao } from "@/data/meditacoes";
import { Heart, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MeditationCardProps {
  meditation: Meditacao;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (meditation: Meditacao) => void;
}

function formatDuration(seconds?: number): string {
  if (!seconds || seconds === 0) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MeditationCard({
  meditation,
  isFavorite,
  onToggleFavorite,
  onViewDetails
}: MeditationCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = meditation.imagem?.background ? `/images/${meditation.imagem.background}` : null;

  return (
    <div
      className="rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
      onClick={() => onViewDetails(meditation)}
    >
      {/* Image Section */}
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

        {/* Button Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(meditation);
            }}
            className="p-3 rounded-full transition-all bg-white text-purple-600 hover:bg-purple-600 hover:text-white"
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

      {/* Content Section */}
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
          {meditation.titulo}
        </h3>
        <p className="text-xs text-gray-600">{formatDuration(meditation.duracao)}</p>
        {meditation.descricao && (
          <p className="text-xs text-gray-600 line-clamp-2 mt-2">
            {meditation.descricao}
          </p>
        )}
        {meditation.tags && meditation.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {meditation.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">
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

### 2.2 `src/components/tabs/meditacoes/MeditationsModal.tsx`

```typescript
import { useState } from "react";
import { MEDITACOES, Meditacao } from "@/data/meditacoes";
import { MeditationCard } from "./MeditationCard";

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
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            Todas as Meditações ({MEDITACOES.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

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

        {totalPages > 1 && (
          <div className="flex justify-between items-center">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
            >
              ← Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {page + 1} de {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
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

### 2.3 `src/components/tabs/meditacoes/index.ts`

```typescript
export { MeditationCard } from "./MeditationCard";
export { MeditationsModal } from "./MeditationsModal";
export { MeditationDetailModalWithPlayer } from "./MeditationDetailModalWithPlayer";
```

---

## FASE 3: Container

### 3.1 `src/components/tabs/TabMeditacoes.tsx`

```typescript
"use client";

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

  const handleViewDetails = (meditation: Meditacao) => {
    setSelectedMeditation(meditation);
    setShowDetailModal(true);
  };

  const inicialMeditacoes = MEDITACOES.slice(0, 4);

  return (
    <>
      <div className="min-h-screen bg-[#FAF9F6] p-6 pb-28">
        <div className="max-w-4xl mx-auto space-y-6">
          <UserHeader
            title="Meditações"
            rightElement={
              <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-purple-600" />
              </div>
            }
          />

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

      {showAllModal && (
        <MeditationsModal
          isOpen={showAllModal}
          onClose={() => setShowAllModal(false)}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onViewDetails={handleViewDetails}
        />
      )}

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

### 3.2 `src/components/tabs/meditacoes/MeditationDetailModalWithPlayer.tsx`

```typescript
import { useRef, useState } from "react";
import { Meditacao } from "@/data/meditacoes";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface MeditationDetailModalWithPlayerProps {
  meditation: Meditacao;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MeditationDetailModalWithPlayer({
  meditation,
  onClose,
  isFavorite,
  onToggleFavorite
}: MeditationDetailModalWithPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = async () => {
    if (!audioRef.current) return;

    try {
      setError(null);
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (err) {
      setError(`Erro ao reproduzir: ${err instanceof Error ? err.message : "desconhecido"}`);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold flex-1 pr-4">{meditation.titulo}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {meditation.imagem?.background && (
          <img
            src={`/images/${meditation.imagem.background}`}
            alt={meditation.titulo}
            className="w-full h-40 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}

        {meditation.descricao && (
          <p className="text-sm text-gray-700 line-clamp-4">
            {meditation.descricao}
          </p>
        )}

        <div className="space-y-3 bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePlay}
              disabled={isLoading}
              className="p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 fill-current" />
              )}
            </button>
            <div className="text-sm text-gray-700">
              {formatTime(currentTime)} / {formatTime(meditation.duracao)}
            </div>
          </div>

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

          <audio
            ref={audioRef}
            src={meditation.audioUrl}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onEnded={() => setIsPlaying(false)}
            onLoadStart={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            onError={() => setError("Erro ao carregar áudio")}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          onClick={() => onToggleFavorite(meditation.id)}
          className={cn(
            "w-full py-2 rounded-lg font-medium transition",
            isFavorite
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          )}
        >
          {isFavorite ? "❤️ Remover dos Favoritos" : "🤍 Adicionar aos Favoritos"}
        </button>

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

---

## FASE 4: Integration

### 4.1 Adicionar seção em `src/components/tabs/TabOracoes.tsx`

```typescript
// Adicionar após seção de Orações:

import { TabMeditacoes } from "./TabMeditacoes";

export function TabOracoes() {
  // ... código existente de orações ...

  return (
    <>
      <div className="min-h-screen bg-[#FAF9F6] p-6 pb-28">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Orações existentes */}
          <UserHeader title="Orações" {...} />
          <ContentSection title="Orações" {...}>
            {/* ... */}
          </ContentSection>

          {/* NOVO: Seção de Meditações */}
          <div className="pt-8 border-t border-gray-200">
            <TabMeditacoes />
          </div>
        </div>
      </div>
    </>
  );
}
```

### 4.2 Atualizar `src/components/BottomNav.tsx`

```typescript
// Adicionar link novo (exemplo):

<NavLink
  href="#meditacoes"
  onClick={() => {
    // Scroll to meditation section or navigate
    const elem = document.getElementById("meditacoes-section");
    elem?.scrollIntoView({ behavior: "smooth" });
  }}
  icon={<Sparkles className="w-5 h-5" />}
  label="Meditações"
  active={activeTab === "meditacoes"}
/>
```

---

## FASE 5: QA Checklist

### 5.1 Commands to Run

```bash
# Sync data
npm run sync:meditacoes

# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build

# Test (if configured)
npm test

# Start dev server
npm run dev
```

### 5.2 Manual Test Checklist

```
[ ] Navegue para aba Orações
[ ] Veja seção "Meditações" com 4 cards
[ ] Clique em um card → Modal abre
[ ] Clique Play → Áudio toca (sem erro CORS)
[ ] Clique Pause → Áudio pausa
[ ] Mude progresso com slider → Áudio salta
[ ] Clique Favorite → Ícone muda
[ ] Reload página → Favorito persiste
[ ] Feche modal → Aba normal
[ ] Clique "VER TUDO" → Modal com todas
[ ] Navegue paginação (se > 20 items)
[ ] Teste em mobile (375px viewport)
[ ] Teste em desktop (1920px viewport)
[ ] Verifique: sem erros console
[ ] Verifique: imagens carregam
[ ] Verifique: responsivo
```

---

## Troubleshooting Rápido

### Problema: Imagens não carregam

**Solução:**
```typescript
// No MeditationCard, verificar:
const imageUrl = meditation.imagem?.background
  ? `/images/${meditation.imagem.background}`
  : null;

// Arquivo existe em: /public/images/creation_*.png
// Usar linter: ls public/images/ | grep creation
```

### Problema: Áudio CORS error

**Solução:**
```typescript
// Usar proxy:
audioUrl: "/api/audio?url=" + encodeURIComponent(meditation.audioUrl)

// Não usar direto:
// audioUrl: meditation.audioUrl  ❌ Errado (CORS)
```

### Problema: TypeScript erros

**Solução:**
```bash
# Checar tipos
npm run typecheck

# Adicionar tipos se faltarem:
export interface Meditacao {
  id: string;        // ✅ adicionar
  titulo: string;    // ✅ adicionar
  // etc...
}
```

### Problema: Favoritos não persistem

**Solução:**
```typescript
// Usar useFavorites hook (já existe):
const { toggleFavorite, isFavorite } = useFavorites();

// Não criar novo sistema (reutilizar ✅)
// Hook salva em sessionStorage/localStorage
```

---

## Performance Tips

### Bundle Size
```typescript
// Lazy load modals
const MeditationsModal = dynamic(() =>
  import("./meditacoes/MeditationsModal").then(m => m.MeditationsModal),
  { loading: () => <div>Carregando...</div> }
);
```

### Image Optimization
```typescript
// Usar sizes para responsividade
<img
  src={imageUrl}
  alt={meditation.titulo}
  sizes="(max-width: 768px) 100vw, 50vw"
  className="w-full h-full object-cover"
/>
```

### Audio Performance
```typescript
// Usar preload seletivamente
<audio
  ref={audioRef}
  src={meditation.audioUrl}
  preload="metadata"  // ← Não preload completo
  onTimeUpdate={...}
/>
```

---

## Commits Recomendados

```bash
# FASE 1
git commit -m "feat: add meditation data layer
- Create scripts/sync-meditacoes.ts
- Create src/data/meditacoes.ts with 17 records
- Adapt image-mapper.ts::mapMeditacoes()
- Add sync:meditacoes script to package.json"

# FASE 2
git commit -m "feat: add meditation card & modal components
- Create MeditationCard.tsx (adapted from PrayerCard)
- Create MeditationsModal.tsx with pagination
- Define purple color scheme
- Add MeditationCard tests"

# FASE 3
git commit -m "feat: add meditation container & player
- Create TabMeditacoes.tsx
- Create MeditationDetailModalWithPlayer.tsx
- Integrate audio player with /api/audio proxy
- Connect useFavorites hook"

# FASE 4
git commit -m "feat: integrate meditation navigation
- Add meditacoes section to TabOracoes.tsx
- Update BottomNav with Meditações link
- Add route handling"

# FASE 5
git commit -m "test: add meditation QA & polish
- All 17 meditations load correctly
- Audio plays without CORS errors
- Favorites persist across sessions
- Responsive on mobile/tablet/desktop
- TypeScript & linting: 0 errors"
```

---

**Última Atualização:** 22 de Fevereiro de 2026
**Validado:** ✅ Pronto para usar
