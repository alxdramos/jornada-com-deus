# Guia Prático de Implementação - Refatoração de Monólitos

## Estrutura do Projeto Pós-Refatoração

### Antes
```
src/components/
├── tabs/
│   ├── TabExplorar.tsx (691 linhas)
│   ├── TabDiario.tsx (599 linhas)
│   ├── TabBiblia.tsx (508 linhas)
│   └── TabOracoes.tsx (431 linhas)
├── HojeSteps.tsx (444 linhas)
├── MeditationPlayer.tsx (424 linhas)
├── ImmersiveAudioPlayer.tsx (351 linhas)
├── CalendarioFavoritosModal.tsx (310 linhas)
└── [outros componentes]
```

### Depois
```
src/
├── components/
│   ├── tabs/
│   │   ├── TabExplorar.tsx (200 linhas)
│   │   ├── TabDiario.tsx (150 linhas)
│   │   ├── TabBiblia.tsx (100 linhas)
│   │   ├── TabOracoes.tsx (100 linhas)
│   │   ├── explorar/
│   │   │   ├── ExploreFilters.tsx
│   │   │   ├── MeditationCard.tsx
│   │   │   ├── ScriptureCard.tsx
│   │   │   ├── ContentSection.tsx
│   │   │   └── AllContentModal.tsx
│   │   ├── diario/
│   │   │   ├── DiaryFilters.tsx
│   │   │   ├── DiaryEntryCard.tsx
│   │   │   ├── DiaryEmptyState.tsx
│   │   │   ├── DiaryCreateModal.tsx
│   │   │   ├── DiaryDetailModal.tsx
│   │   │   └── EntryTypeSelector.tsx
│   │   ├── biblia/
│   │   │   ├── BibleTestamentToggle.tsx
│   │   │   ├── BibleSearchBar.tsx
│   │   │   ├── BibleBooksList.tsx
│   │   │   ├── BibleChapterGrid.tsx
│   │   │   ├── BibleVerseList.tsx
│   │   │   └── BibleChapterNavigation.tsx
│   │   └── oracoes/
│   │       ├── PrayerFilters.tsx
│   │       ├── PrayerCard.tsx
│   │       ├── PrayerCreateModal.tsx
│   │       └── PrayerDetailModal.tsx
│   ├── hojeSteps/
│   │   ├── HojeSteps.tsx (100 linhas)
│   │   ├── DailyStepCard.tsx
│   │   ├── VersiculoStepCard.tsx
│   │   ├── PassagemStepCard.tsx
│   │   ├── DevocionalStepCard.tsx
│   │   ├── OracaoStepCard.tsx
│   │   └── DailyReadModal.tsx
│   ├── meditationPlayer/
│   │   ├── MeditationPlayer.tsx (150 linhas)
│   │   ├── AudioPlayerProgress.tsx
│   │   ├── AudioPlayerControls.tsx
│   │   ├── AudioPlayerSecondaryControls.tsx
│   │   ├── AudioPlayerHeader.tsx
│   │   └── hooks/
│   │       └── useAudioPlayer.ts
│   ├── immersiveAudioPlayer/
│   │   ├── ImmersiveAudioPlayer.tsx (120 linhas)
│   │   ├── AudioTextDisplay.tsx
│   │   ├── SpeedControls.tsx
│   │   └── hooks/
│   │       └── useSimulatedAudio.ts
│   ├── calendarModal/
│   │   ├── CalendarioFavoritosModal.tsx (100 linhas)
│   │   ├── CalendarView.tsx
│   │   ├── CalendarHeader.tsx
│   │   ├── CalendarGrid.tsx
│   │   ├── JourneyStats.tsx
│   │   ├── FavoritesView.tsx
│   │   ├── FavoritoItem.tsx
│   │   └── hooks/
│   │       └── useCalendarData.ts
│   ├── ui/
│   │   ├── PlusOverlay.tsx
│   │   ├── PlusOverlayWithOptions.tsx
│   │   ├── EmptyState.tsx
│   │   └── DailyStepCard.tsx
│   └── [outros componentes]
├── hooks/
│   ├── useAudioPlayer.ts
│   ├── useDiaryStorage.ts
│   ├── usePrayerStorage.ts
│   ├── useCalendarData.ts
│   ├── useFavorites.ts
│   └── useToast.ts (existente)
├── data/
│   ├── meditacoes.ts
│   ├── oracoes-predefinidas.ts
│   ├── diario-exemplo.ts
│   ├── biblia.ts
│   ├── filters.ts
│   └── calendar-constants.ts
└── [resto do projeto]
```

---

## Fase 1: Setup - Criar Estrutura Base

### Step 1.1: Criar pastas
```bash
mkdir -p src/components/tabs/explorar
mkdir -p src/components/tabs/diario
mkdir -p src/components/tabs/biblia
mkdir -p src/components/tabs/oracoes
mkdir -p src/components/hojeSteps
mkdir -p src/components/meditationPlayer/hooks
mkdir -p src/components/immersiveAudioPlayer/hooks
mkdir -p src/components/calendarModal/hooks
mkdir -p src/components/ui
mkdir -p src/hooks
mkdir -p src/data
```

### Step 1.2: Criar arquivo de dados para TabExplorar
**Arquivo:** `src/data/meditacoes.ts`

```typescript
export const CATEGORIAS = ["TUDO", "MENTE", "CORPO", "ESPÍRITO", "MÚSICA", "ESTUDOS"];

export const CHIPS = ["TUDO", "DORMIR", "ANSIEDADE", "PAZ", "<5MINS", "MOTIVAÇÃO", "ORAÇÃO"];

export interface MeditationCard {
  id: string;
  title: string;
  duration: string;
  category: string;
  plus: boolean;
  description?: string;
  tags: string[];
  image?: string;
  audioUrl?: string;
}

export const MEDITACOES: MeditationCard[] = [
  {
    id: "renovacao-ceu-infinito",
    title: "Renovação Sob o Céu Infinito",
    duration: "8 min",
    category: "MENTE",
    plus: false,
    description: "Respire fundo e sinta a estabilidade dos seus pés firmemente plantados no chão.",
    tags: ["RENOVAÇÃO", "PAZ", "FORÇA"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    audioUrl: "https://pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev/Med_20260217015141_620.mp3"
  },
  // ... resto das meditações
];

export const SCRIPTURE_CARDS = [
  { id: "salmo-76", title: "Salmo 76", duration: "3 min", plus: false, category: "ESTUDOS" },
  // ... resto
];

export const NEW_CONTENT_CARDS = [
  { id: "crente-excecao", title: "O Crente é uma Exceção", duration: "3 min", plus: false, category: "ESTUDOS" },
  // ... resto
];
```

### Step 1.3: Criar arquivo de dados para Bíblia
**Arquivo:** `src/data/biblia.ts`

```typescript
export const LIVROS_AT = [
  "Gênesis", "Êxodo", "Levítico",
  // ... 39 livros
];

export const LIVROS_NT = [
  "Mateus", "Marcos", "Lucas",
  // ... 27 livros
];
```

### Step 1.4: Criar arquivo de dados para Orações
**Arquivo:** `src/data/oracoes-predefinidas.ts`

```typescript
export interface Prayer {
  id: string;
  title: string;
  content: string;
  category: string;
  isCustom: boolean;
  createdAt: Date;
}

export const PRAYER_CATEGORIES = ["Todas", "Graças", "Paz", "Família", "Perdão", "Força", "Minhas"];

export const PRAYERS_PREDEFINIDAS: Prayer[] = [
  {
    id: "gracas-manha",
    title: "Ação de Graças - Manhã",
    content: "Senhor, obrigado pelo novo dia...",
    category: "Graças",
    isCustom: false,
    createdAt: new Date()
  },
  // ... resto
];
```

### Step 1.5: Criar Custom Hook para Armazenamento
**Arquivo:** `src/hooks/useDiaryStorage.ts`

```typescript
import { useState, useEffect } from "react";

export interface DiaryEntry {
  id: string;
  type: 'note' | 'highlight' | 'verse' | 'quote';
  title: string;
  content: string;
  reference?: string;
  tags?: string[];
  createdAt: Date;
  isFavorite?: boolean;
}

export function useDiaryStorage(exampleEntries: DiaryEntry[]) {
  const [entries, setEntries] = useState<DiaryEntry[]>(exampleEntries);
  const [loading, setLoading] = useState(true);

  // Carregar do localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('diary-entries');
    if (savedEntries) {
      try {
        type StoredEntry = Omit<DiaryEntry, 'createdAt'> & { createdAt: string };
        const parsed = JSON.parse(savedEntries) as StoredEntry[];
        const customEntries = parsed.map((entry) => ({
          ...entry,
          createdAt: new Date(entry.createdAt)
        }));
        setEntries([...exampleEntries, ...customEntries]);
      } catch (error) {
        console.error('Erro ao carregar entradas do diário:', error);
      }
    }
    setLoading(false);
  }, []);

  const saveEntry = (entry: DiaryEntry) => {
    const customEntries = entries.filter(e => !exampleEntries.some(ex => ex.id === e.id));
    localStorage.setItem('diary-entries', JSON.stringify([...customEntries, entry]));
    setEntries(prev => [...prev, entry]);
  };

  const updateEntry = (id: string, updates: Partial<DiaryEntry>) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));

    // Salvar apenas entradas customizadas
    const customEntries = entries.filter(e => !exampleEntries.some(ex => ex.id === e.id));
    localStorage.setItem('diary-entries', JSON.stringify(customEntries));
  };

  return { entries, saveEntry, updateEntry, loading };
}
```

---

## Fase 2: Criar Componentes Reutilizáveis

### Step 2.1: PlusOverlay.tsx
**Arquivo:** `src/components/ui/PlusOverlay.tsx`

```typescript
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface PlusOverlayProps {
  isVisible: boolean;
  title?: string;
  description?: string;
  onUpgrade: () => void;
  onDismiss?: () => void;
}

export function PlusOverlay({
  isVisible,
  title = "Conteúdo Plus",
  description = "Este conteúdo está disponível apenas para membros Plus",
  onUpgrade,
  onDismiss
}: PlusOverlayProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-[#1F2937] mb-2">{title}</h3>
        <p className="text-sm text-[#6B7280] mb-4">{description}</p>
        <button
          onClick={onUpgrade}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#FB923C] to-[#F97316] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity"
        >
          Atualizar para Plus
        </button>
      </div>
    </motion.div>
  );
}
```

### Step 2.2: EmptyState.tsx
**Arquivo:** `src/components/ui/EmptyState.tsx`

```typescript
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[#1F2937] mb-2">{title}</h3>
      <p className="text-[#6B7280] text-center max-w-sm">{description}</p>
    </div>
  );
}
```

### Step 2.3: DailyStepCard.tsx (Base para HojeSteps)
**Arquivo:** `src/components/ui/DailyStepCard.tsx`

```typescript
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyStepCardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  subtitle?: string;
  completed: boolean;
  expanded: boolean;
  onToggleComplete: () => void;
  onToggleExpand: () => void;
  children?: React.ReactNode;
}

export function DailyStepCard({
  id,
  title,
  icon,
  subtitle,
  completed,
  expanded,
  onToggleComplete,
  onToggleExpand,
  children
}: DailyStepCardProps) {
  return (
    <motion.div
      layout
      className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB]/80 overflow-hidden"
    >
      <div className="flex items-center gap-4 p-4">
        {/* Checkbox */}
        <button
          onClick={onToggleComplete}
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#E5E7EB] hover:border-[#10B981] transition-colors"
        >
          {completed ? (
            <CheckCircle className="w-5 h-5 text-[#10B981]" />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-[#9CA3AF]" />
          )}
        </button>

        {/* Content */}
        <button
          onClick={onToggleExpand}
          className="flex-1 min-w-0 text-left"
        >
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium text-[#1F2937]">{title}</span>
          </div>
          {subtitle && (
            <p className="text-xs text-[#6B7280] mt-0.5 truncate">{subtitle}</p>
          )}
        </button>

        {/* Chevron */}
        <button
          onClick={onToggleExpand}
          className="shrink-0 p-1"
        >
          <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
            <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
          </motion.div>
        </button>
      </div>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

---

## Fase 3: Refatorar TabExplorar (Prioridade Alta)

### Step 3.1: Criar MeditationCard.tsx
**Arquivo:** `src/components/tabs/explorar/MeditationCard.tsx`

```typescript
import { motion } from "framer-motion";
import { Heart, Play, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MeditationCard as MeditationCardType } from "@/data/meditacoes";

interface MeditationCardProps {
  meditation: MeditationCardType;
  isPlus: boolean;
  isFavorite: boolean;
  onPlay: (meditation: MeditationCardType) => void;
  onToggleFavorite: (id: string) => void;
}

export function MeditationCard({
  meditation,
  isPlus,
  isFavorite,
  onPlay,
  onToggleFavorite
}: MeditationCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Imagem de fundo */}
      <div
        className="h-32 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${meditation.image})` }}
      >
        <div className="absolute inset-0 bg-black/20" />

        {/* Overlay Plus */}
        {meditation.plus && !isPlus && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
            <Crown className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Botão favorito */}
        <button
          onClick={() => onToggleFavorite(meditation.id)}
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <Heart className={cn("w-4 h-4", isFavorite ? "text-red-500 fill-current" : "text-white")} />
        </button>

        {/* Botão play */}
        <button
          onClick={() => onPlay(meditation)}
          className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white hover:scale-105 transition-all shadow-lg"
        >
          <Play className="w-5 h-5 text-black ml-0.5" />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-[#1F2937] text-sm line-clamp-2">{meditation.title}</h3>
        </div>

        {meditation.description && (
          <p className="text-xs text-[#6B7280] mb-3 line-clamp-2">{meditation.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B7280]">{meditation.duration}</span>
            {meditation.plus && (
              <>
                <span className="text-[#6B7280]">•</span>
                <div className="flex items-center gap-1">
                  <Crown className="w-3 h-3 text-[#FB923C]" />
                  <span className="text-xs text-[#FB923C] font-medium">Plus</span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-1">
            {meditation.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 3.2: Criar ExploreFilters.tsx
**Arquivo:** `src/components/tabs/explorar/ExploreFilters.tsx`

```typescript
import { cn } from "@/lib/utils";

interface ExploreFiltersProps {
  categories: string[];
  chips: string[];
  activeCategory: string;
  activeChip: string;
  onCategoryChange: (category: string) => void;
  onChipChange: (chip: string) => void;
}

export function ExploreFilters({
  categories,
  chips,
  activeCategory,
  activeChip,
  onCategoryChange,
  onChipChange
}: ExploreFiltersProps) {
  return (
    <>
      {/* Categorias */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => onCategoryChange(c)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap",
              activeCategory === c
                ? "bg-[#1F2937] text-white"
                : "bg-white text-[#1F2937] shadow-sm"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {chips.map((c) => (
          <button
            key={c}
            onClick={() => onChipChange(c)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap",
              activeChip === c ? "bg-[#FB923C] text-white" : "bg-white/80 text-[#6B7280]"
            )}
          >
            {c}
          </button>
        ))}
      </div>
    </>
  );
}
```

### Step 3.3: Refatorar TabExplorar.tsx
**Arquivo:** `src/components/tabs/TabExplorar.tsx` (refatorado)

```typescript
"use client";

import { useState, useMemo } from "react";
import { useUserStore } from "@/stores/userStore";
import { UserHeader } from "@/components/layout/UserHeader";
import { Heart, Lock, Crown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaywallModal } from "@/components/PaywallModal";
import { MeditationPlayer } from "@/components/MeditationPlayer";
import { useFavorites } from "@/hooks/useFavorites";
import { MeditationCardSkeleton } from "@/components/ui/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import {
  CATEGORIAS,
  CHIPS,
  MEDITACOES,
  SCRIPTURE_CARDS,
  NEW_CONTENT_CARDS,
  MeditationCard as MeditationCardType
} from "@/data/meditacoes";
import { LIVROS_AT, LIVROS_NT } from "@/data/biblia";
import { ExploreFilters } from "./explorar/ExploreFilters";
import { MeditationCard } from "./explorar/MeditationCard";

const MODAL_TESTAMENTO = { AT: "AT" as const, NT: "NT" as const };

export function TabExplorar() {
  const user = useUserStore((s) => s.user);
  const isPlus = user?.isPlus ?? false;
  const { toggleFavorite, isFavorite } = useFavorites();

  const [catAtiva, setCatAtiva] = useState("TUDO");
  const [chipAtivo, setChipAtivo] = useState("TUDO");
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationCardType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<'meditacoes' | 'escrituras' | 'novo'>('meditacoes');
  const [modalTestamento, setModalTestamento] = useState<"AT" | "NT">("AT");

  // Filtrar meditações
  const meditatacoesFiltradas = useMemo(() => {
    return MEDITACOES.filter(med => {
      const categoriaMatch = catAtiva === "TUDO" || med.category === catAtiva;
      const chipMatch = chipAtivo === "TUDO" || med.tags.includes(chipAtivo);
      return categoriaMatch && chipMatch;
    });
  }, [catAtiva, chipAtivo]);

  const handlePlayMeditation = (meditation: MeditationCardType) => {
    if (meditation.plus && !isPlus) {
      setSelectedMeditation(meditation);
      setPaywallOpen(true);
    } else {
      setSelectedMeditation(meditation);
      setPlayerOpen(true);
    }
  };

  const handleUpgrade = () => {
    console.log("Upgrade realizado!");
  };

  return (
    <>
      <div className="min-h-screen bg-[#FAF9F6] p-6 pb-28">
        <div className="max-w-4xl mx-auto space-y-6">
          <UserHeader
            title="Explorar"
            rightElement={
              <>
                <button className="flex items-center gap-1 text-[#FB923C]">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">Favoritos</span>
                </button>
              </>
            }
          />

          {/* Filtros */}
          <ExploreFilters
            categories={CATEGORIAS}
            chips={CHIPS}
            activeCategory={catAtiva}
            activeChip={chipAtivo}
            onCategoryChange={setCatAtiva}
            onChipChange={setChipAtivo}
          />

          {/* Seção Meditações */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#1F2937]">Meditações</h2>
              <button
                onClick={() => {
                  setSelectedSection('meditacoes');
                  setShowAllModal(true);
                }}
                className="text-sm text-[#FB923C] font-medium hover:text-[#EA580C] transition-colors"
              >
                VER TUDO &gt;
              </button>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <motion.div key={i} variants={staggerItem}>
                    <MeditationCardSkeleton />
                  </motion.div>
                ))
              ) : (
                meditatacoesFiltradas.map((med) => (
                  <motion.div key={med.id} variants={staggerItem}>
                    <MeditationCard
                      meditation={med}
                      isPlus={isPlus}
                      isFavorite={isFavorite(med.id)}
                      onPlay={handlePlayMeditation}
                      onToggleFavorite={toggleFavorite}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          </section>

          {/* Modais - mantém os mesmos */}
          <PaywallModal
            isOpen={paywallOpen}
            onClose={() => setPaywallOpen(false)}
            onUpgrade={handleUpgrade}
            feature={selectedMeditation?.title}
          />

          {selectedMeditation && (
            <MeditationPlayer
              isOpen={playerOpen}
              onClose={() => setPlayerOpen(false)}
              titulo={selectedMeditation.title}
              descricao={selectedMeditation.description}
              duracao={selectedMeditation.duration}
              isPlus={isPlus || !selectedMeditation.plus}
              audioUrl={selectedMeditation.audioUrl}
            />
          )}

          {/* AllContentModal refatorado (próxima fase) */}
          {/* ... */}
        </div>
      </div>
    </>
  );
}
```

---

## Checklist de Implementação

### Fase 1: Setup
- [ ] Criar estrutura de pastas
- [ ] Criar arquivo `src/data/meditacoes.ts`
- [ ] Criar arquivo `src/data/biblia.ts`
- [ ] Criar arquivo `src/data/oracoes-predefinidas.ts`
- [ ] Criar arquivo `src/data/diario-exemplo.ts`
- [ ] Criar arquivo `src/data/filters.ts`
- [ ] Criar arquivo `src/data/calendar-constants.ts`

### Fase 2: Custom Hooks
- [ ] `src/hooks/useDiaryStorage.ts`
- [ ] `src/hooks/usePrayerStorage.ts`
- [ ] `src/hooks/useAudioPlayer.ts`
- [ ] `src/hooks/useSimulatedAudio.ts`
- [ ] `src/hooks/useCalendarData.ts`
- [ ] `src/hooks/useFavoritesSync.ts` (melhorar useFavorites existente)

### Fase 3: Componentes UI Reutilizáveis
- [ ] `src/components/ui/PlusOverlay.tsx`
- [ ] `src/components/ui/PlusOverlayWithOptions.tsx`
- [ ] `src/components/ui/EmptyState.tsx`
- [ ] `src/components/ui/DailyStepCard.tsx`

### Fase 4: TabExplorar (241 linhas economizadas)
- [ ] `src/components/tabs/explorar/ExploreFilters.tsx`
- [ ] `src/components/tabs/explorar/MeditationCard.tsx`
- [ ] `src/components/tabs/explorar/ScriptureCard.tsx`
- [ ] `src/components/tabs/explorar/ContentSection.tsx`
- [ ] `src/components/tabs/explorar/AllContentModal.tsx`
- [ ] Refatorar `src/components/tabs/TabExplorar.tsx`

### Fase 5: TabDiario (94 linhas economizadas)
- [ ] `src/components/tabs/diario/DiaryFilters.tsx`
- [ ] `src/components/tabs/diario/DiaryEntryCard.tsx`
- [ ] `src/components/tabs/diario/DiaryEmptyState.tsx`
- [ ] `src/components/tabs/diario/DiaryCreateModal.tsx`
- [ ] `src/components/tabs/diario/DiaryDetailModal.tsx`
- [ ] `src/components/tabs/diario/EntryTypeSelector.tsx`
- [ ] Refatorar `src/components/tabs/TabDiario.tsx`

### Fase 6: TabOracoes (26 linhas economizadas)
- [ ] `src/components/tabs/oracoes/PrayerFilters.tsx`
- [ ] `src/components/tabs/oracoes/PrayerCard.tsx`
- [ ] `src/components/tabs/oracoes/PrayerCreateModal.tsx`
- [ ] `src/components/tabs/oracoes/PrayerDetailModal.tsx`
- [ ] Refatorar `src/components/tabs/TabOracoes.tsx`

### Fase 7: TabBiblia (+32 linhas no total)
- [ ] `src/components/tabs/biblia/BibleTestamentToggle.tsx`
- [ ] `src/components/tabs/biblia/BibleSearchBar.tsx`
- [ ] `src/components/tabs/biblia/BibleBooksList.tsx`
- [ ] `src/components/tabs/biblia/BibleChapterGrid.tsx`
- [ ] `src/components/tabs/biblia/BibleVerseList.tsx`
- [ ] `src/components/tabs/biblia/BibleChapterNavigation.tsx`
- [ ] Refatorar `src/components/tabs/TabBiblia.tsx`

### Fase 8: HojeSteps (+66 linhas no total)
- [ ] `src/components/hojeSteps/DailyStepCard.tsx` (base)
- [ ] `src/components/hojeSteps/VersiculoStepCard.tsx`
- [ ] `src/components/hojeSteps/PassagemStepCard.tsx`
- [ ] `src/components/hojeSteps/DevocionalStepCard.tsx`
- [ ] `src/components/hojeSteps/OracaoStepCard.tsx`
- [ ] `src/components/hojeSteps/DailyReadModal.tsx`
- [ ] Refatorar `src/components/HojeSteps.tsx`

### Fase 9: Players de Áudio
- [ ] `src/components/meditationPlayer/hooks/useAudioPlayer.ts`
- [ ] `src/components/meditationPlayer/AudioPlayerProgress.tsx`
- [ ] `src/components/meditationPlayer/AudioPlayerControls.tsx`
- [ ] `src/components/meditationPlayer/AudioPlayerSecondaryControls.tsx`
- [ ] `src/components/meditationPlayer/AudioPlayerHeader.tsx`
- [ ] Refatorar `src/components/MeditationPlayer.tsx`
- [ ] `src/components/immersiveAudioPlayer/hooks/useSimulatedAudio.ts`
- [ ] `src/components/immersiveAudioPlayer/AudioTextDisplay.tsx`
- [ ] `src/components/immersiveAudioPlayer/SpeedControls.tsx`
- [ ] Refatorar `src/components/ImmersiveAudioPlayer.tsx`

### Fase 10: CalendarioFavoritosModal (+115 linhas no total)
- [ ] `src/components/calendarModal/hooks/useCalendarData.ts`
- [ ] `src/components/calendarModal/CalendarView.tsx`
- [ ] `src/components/calendarModal/CalendarHeader.tsx`
- [ ] `src/components/calendarModal/CalendarGrid.tsx`
- [ ] `src/components/calendarModal/JourneyStats.tsx`
- [ ] `src/components/calendarModal/FavoritesView.tsx`
- [ ] `src/components/calendarModal/FavoritoItem.tsx`
- [ ] Refatorar `src/components/CalendarioFavoritosModal.tsx`

### Fase 11: Testes
- [ ] Testar cada componente isoladamente
- [ ] Testar integração entre componentes
- [ ] Verificar tipos TypeScript
- [ ] Verificar performance com React DevTools
- [ ] Testar em mobile

---

## Dicas de Implementação

### 1. Começar pelo Mais Simples
Comece com componentes de UI reutilizáveis (PlusOverlay, EmptyState) antes de refatorar tabs.

### 2. Manter Compatibilidade
Cada sub-componente deve ter a mesma interface visual que o código original.

### 3. Testar Incrementalmente
Após refatorar cada componente, teste se funciona igual ao original antes de passar para o próximo.

### 4. Usar TypeScript
Aproveite tipos compartilhados para evitar regressões.

### 5. Documentar Props
Use comentários JSDoc para documentar props de componentes reutilizáveis:

```typescript
/**
 * Componente de card de meditação
 * @param meditation - Dados da meditação
 * @param isPlus - Se o usuário é Plus
 * @param isFavorite - Se está favoritado
 * @param onPlay - Callback ao clicar play
 * @param onToggleFavorite - Callback ao clicar favorito
 */
export function MeditationCard({ ... }: MeditationCardProps) { ... }
```

### 6. Usar Memo para Performance
Para componentes que renderizam listas, considere memoização:

```typescript
export const MeditationCard = React.memo(function MeditationCard(props) {
  // ...
}, (prev, next) => {
  // Comparação customizada se necessário
  return prev.meditation.id === next.meditation.id;
});
```

---

## Próximas Etapas Recomendadas

1. **Semana 1**: Fases 1-3 (Setup + Custom Hooks + Componentes UI)
2. **Semana 2**: Fases 4-5 (TabExplorar + TabDiario)
3. **Semana 3**: Fases 6-7 (TabOracoes + TabBiblia)
4. **Semana 4**: Fases 8-10 (HojeSteps + Players + Calendar)
5. **Semana 5**: Fase 11 (Testes e ajustes)

---

**Documento criado em 2026-02-20**
