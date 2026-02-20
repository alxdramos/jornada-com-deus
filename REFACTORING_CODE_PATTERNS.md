# Padrões de Código para Refatoração

## Objetivo
Garantir consistência e qualidade durante a refatoração de componentes monolíticos.

---

## 1. Estrutura de Componentes

### 1.1 Componente Simples (UI apenas)

```typescript
import { cn } from "@/lib/utils";

interface MyComponentProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * Descrição breve do componente
 * @param title - Título do componente
 * @param isActive - Se está ativo
 * @param onClick - Callback ao clicar
 * @param className - Classes CSS adicionais
 */
export function MyComponent({
  title,
  isActive,
  onClick,
  className
}: MyComponentProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-colors",
        isActive ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700",
        className
      )}
    >
      {title}
    </button>
  );
}
```

### 1.2 Componente com Estado Local

```typescript
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ExpandableComponentProps {
  title: string;
  content: React.ReactNode;
  defaultExpanded?: boolean;
}

export function ExpandableComponent({
  title,
  content,
  defaultExpanded = false
}: ExpandableComponentProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left font-medium"
      >
        {title}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### 1.3 Componente com Dados (list wrapper)

```typescript
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface MyListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
}

export function MyList<T extends { id: string }>({
  items,
  renderItem,
  emptyMessage = "Nenhum item encontrado"
}: MyListProps<T>) {
  if (items.length === 0) {
    return <p className="text-gray-500 text-center py-8">{emptyMessage}</p>;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      {items.map((item, index) => (
        <motion.div key={item.id} variants={staggerItem}>
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

---

## 2. Padrões de Props

### 2.1 Props com Callbacks

```typescript
// ❌ Evitar muitos callbacks
interface BadComponentProps {
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onSkipForward?: () => void;
  onSkipBackward?: () => void;
  onToggleFavorite?: () => void;
}

// ✅ Agrupar relacionados
interface GoodComponentProps {
  onPlaybackChange?: (action: 'play' | 'pause' | 'stop') => void;
  onSkip?: (direction: 'forward' | 'backward') => void;
  onToggleFavorite?: () => void;
}
```

### 2.2 Props com Estados Relacionados

```typescript
// ❌ Evitar
interface BadProps {
  isLoading: boolean;
  hasError: boolean;
  error?: Error;
  data?: unknown;
}

// ✅ Usar discriminated union
type ComponentState =
  | { status: 'idle'; data?: unknown }
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: unknown };

interface GoodProps {
  state: ComponentState;
}
```

### 2.3 Props com Dados Extensíveis

```typescript
// ❌ Props específicos demais
interface BadCardProps {
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  category: string;
  plus: boolean;
  audioUrl?: string;
}

// ✅ Props genéricos com data object
interface GoodCardProps {
  data: {
    title: string;
    description: string;
    imageUrl: string;
    [key: string]: unknown;
  };
  renderHeader?: (data: GoodCardProps['data']) => React.ReactNode;
  renderFooter?: (data: GoodCardProps['data']) => React.ReactNode;
}
```

---

## 3. Custom Hooks Pattern

### 3.1 Hook de Gerenciamento de Estado com localStorage

```typescript
import { useState, useEffect, useCallback } from "react";

interface UseLocalStorageOptions {
  key: string;
  initialValue: unknown;
  serialize?: (value: unknown) => string;
  deserialize?: (value: string) => unknown;
}

export function useLocalStorage<T>({
  key,
  initialValue,
  serialize = JSON.stringify,
  deserialize = JSON.parse
}: UseLocalStorageOptions) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (deserialize(item) as T) : (initialValue as T);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue as T;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, serialize(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, serialize]
  );

  return [storedValue, setValue] as const;
}

// Uso:
const [favorites, setFavorites] = useLocalStorage({
  key: 'favorites',
  initialValue: []
});
```

### 3.2 Hook de Efeitos Assíncronos

```typescript
import { useState, useEffect } from "react";

type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

export function useAsync<T>(
  fn: () => Promise<T>,
  dependencies: unknown[] = []
) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });

  useEffect(() => {
    let mounted = true;

    setState({ status: 'pending' });
    fn()
      .then((data) => {
        if (mounted) setState({ status: 'success', data });
      })
      .catch((error) => {
        if (mounted) setState({ status: 'error', error });
      });

    return () => {
      mounted = false;
    };
  }, dependencies);

  return state;
}

// Uso:
const result = useAsync(() => fetchMeditationData(), [userId]);
if (result.status === 'pending') return <Loading />;
if (result.status === 'error') return <Error error={result.error} />;
if (result.status === 'success') return <Data data={result.data} />;
```

### 3.3 Hook de Array com CRUD

```typescript
import { useState, useCallback } from "react";

interface UseArrayOptions<T> {
  initialValue?: T[];
}

export function useArray<T extends { id: string | number }>(
  { initialValue = [] }: UseArrayOptions<T> = {}
) {
  const [items, setItems] = useState<T[]>(initialValue);

  const add = useCallback((item: T) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const remove = useCallback((id: T['id']) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const update = useCallback((id: T['id'], updates: Partial<T>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  return { items, add, remove, update, clear };
}

// Uso:
const { items: prayers, add, remove, update } = useArray<Prayer>();
```

---

## 4. Padrões de Gerenciamento de Estado

### 4.1 State Machine Pattern

```typescript
type DailyState =
  | { stage: 'versiculo'; expanded: boolean; completed: boolean }
  | { stage: 'passagem'; expanded: boolean; completed: boolean }
  | { stage: 'devocional'; playerOpen: boolean; completed: boolean }
  | { stage: 'oracao'; expanded: boolean; completed: boolean };

interface UseDailyStepsState {
  stages: DailyState[];
  completedCount: number;
  toggleStage: (stage: DailyState['stage']) => void;
  expandStage: (stage: DailyState['stage']) => void;
}

export function useDailySteps(): UseDailyStepsState {
  const [stages, setStages] = useState<DailyState[]>([
    { stage: 'versiculo', expanded: false, completed: false },
    { stage: 'passagem', expanded: false, completed: false },
    { stage: 'devocional', playerOpen: false, completed: false },
    { stage: 'oracao', expanded: false, completed: false }
  ]);

  const toggleStage = (stageName: DailyState['stage']) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.stage === stageName
          ? { ...stage, completed: !stage.completed }
          : stage
      )
    );
  };

  const expandStage = (stageName: DailyState['stage']) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.stage === stageName
          ? { ...stage, expanded: !stage.expanded }
          : stage
      )
    );
  };

  return {
    stages,
    completedCount: stages.filter((s) => s.completed).length,
    toggleStage,
    expandStage
  };
}
```

### 4.2 Filter Reducer Pattern

```typescript
interface FilterState {
  category: string;
  search: string;
  sortBy: 'date' | 'title' | 'favorite';
  limit: number;
  offset: number;
}

type FilterAction =
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_SORT'; payload: FilterState['sortBy'] }
  | { type: 'SET_PAGINATION'; payload: { limit: number; offset: number } }
  | { type: 'RESET' };

const initialFilterState: FilterState = {
  category: 'all',
  search: '',
  sortBy: 'date',
  limit: 20,
  offset: 0
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, category: action.payload, offset: 0 };
    case 'SET_SEARCH':
      return { ...state, search: action.payload, offset: 0 };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload, offset: 0 };
    case 'SET_PAGINATION':
      return { ...state, ...action.payload };
    case 'RESET':
      return initialFilterState;
    default:
      return state;
  }
}

export function useFilter() {
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);
  return { filters, dispatch };
}
```

---

## 5. Padrões de Renderização

### 5.1 Render Props Pattern (para lógica complexa)

```typescript
interface DataDisplayProps<T> {
  data: T[];
  children: (item: T, index: number) => React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export function DataDisplay<T>({
  data,
  children,
  fallback,
  className
}: DataDisplayProps<T>) {
  if (data.length === 0) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <div className={className}>
      {data.map((item, index) => (
        <div key={index}>{children(item, index)}</div>
      ))}
    </div>
  );
}

// Uso:
<DataDisplay data={prayers} fallback={<EmptyState />}>
  {(prayer) => <PrayerCard prayer={prayer} />}
</DataDisplay>
```

### 5.2 Compound Component Pattern (para componentes complexos)

```typescript
import { createContext, useContext } from "react";

interface ModalContextType {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ isOpen, onClose, title }}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        {children}
      </div>
    </ModalContext.Provider>
  );
}

export function ModalHeader() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('ModalHeader must be used inside Modal');

  return (
    <div className="border-b p-4 flex items-center justify-between">
      <h2 className="text-xl font-bold">{context.title}</h2>
      <button onClick={context.onClose}>Close</button>
    </div>
  );
}

export function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className="p-6 overflow-y-auto flex-1">{children}</div>;
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div className="border-t p-4 flex gap-2">{children}</div>;
}

// Uso:
<Modal isOpen={true} onClose={() => {}}>
  <ModalHeader />
  <ModalBody>Conteúdo</ModalBody>
  <ModalFooter>
    <button>Cancelar</button>
    <button>Confirmar</button>
  </ModalFooter>
</Modal>
```

---

## 6. Padrões de Performance

### 6.1 Memoização Adequada

```typescript
import React from "react";

interface MeditationCardProps {
  meditation: Meditation;
  isPlus: boolean;
  isFavorite: boolean;
  onPlay: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

/**
 * Componente memoizado para evitar re-renders desnecessários
 * Compara apenas props relevantes
 */
const MeditationCard = React.memo(
  function MeditationCard({
    meditation,
    isPlus,
    isFavorite,
    onPlay,
    onToggleFavorite
  }: MeditationCardProps) {
    return (
      <div>
        {/* ... */}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.meditation.id === nextProps.meditation.id &&
      prevProps.isPlus === nextProps.isPlus &&
      prevProps.isFavorite === nextProps.isFavorite
      // Callbacks não comparar por identidade (instabilidade)
    );
  }
);

export { MeditationCard };
```

### 6.2 useCallback para Callbacks Estáveis

```typescript
import { useCallback, useMemo } from "react";

interface ParentProps {
  items: Meditation[];
}

export function Parent({ items }: ParentProps) {
  // ✅ Callback estável - não muda a menos que `items` mude
  const handlePlay = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (item) playMeditation(item);
    },
    [items]
  );

  // ✅ Dados memoizados - recalculado apenas se `items` muda
  const filteredItems = useMemo(
    () => items.filter((i) => i.category === 'MENTE'),
    [items]
  );

  return (
    <div>
      {filteredItems.map((item) => (
        <MeditationCard
          key={item.id}
          meditation={item}
          onPlay={handlePlay}
        />
      ))}
    </div>
  );
}
```

---

## 7. Padrões de Erro e Loading

### 7.1 Error Boundary Pattern

```typescript
import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
    console.error('Error caught by boundary:', error);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback?.(this.state.error) || (
          <div className="p-4 bg-red-50 text-red-700 rounded">
            Ocorreu um erro. Tente novamente.
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### 7.2 Loading Skeleton Pattern

```typescript
import { Skeleton } from "@/components/ui/Skeleton";

interface DataViewProps<T> {
  data?: T[];
  isLoading: boolean;
  error?: Error;
  renderItem: (item: T) => ReactNode;
  renderSkeleton?: () => ReactNode;
}

export function DataView<T>({
  data,
  isLoading,
  error,
  renderItem,
  renderSkeleton = () => <Skeleton className="h-20 mb-4" />
}: DataViewProps<T>) {
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded">
        Erro: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>{renderSkeleton?.()}</div>
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return <div className="text-gray-500">Nenhum dado encontrado</div>;
  }

  return (
    <div>{data.map((item) => renderItem(item))}</div>
  );
}
```

---

## 8. Tipos TypeScript Compartilhados

### 8.1 Arquivo: `src/types/common.ts`

```typescript
// Estados de entidades
export type EntityStatus = 'idle' | 'pending' | 'success' | 'error';

export interface EntityState<T, E = Error> {
  status: EntityStatus;
  data?: T;
  error?: E;
}

// Paginação
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

// Filtros genéricos
export interface FilterParams {
  search?: string;
  category?: string;
  sortBy?: string;
  limit?: number;
  offset?: number;
}

// Callbacks genéricos
export type EntityCallback<T> = (entity: T) => void;
export type EntityListCallback<T> = (entities: T[]) => void;
```

---

## 9. Checklist de Qualidade

Antes de considerar um componente "refatorado", verificar:

- [ ] Componente tem menos de 150 linhas
- [ ] Componente tem máximo 3-5 estados
- [ ] Props são bem documentadas com JSDoc
- [ ] Não há dados hardcoded
- [ ] Componentum é testável
- [ ] Não há duplicação de código com outros componentes
- [ ] Usa TypeScript corretamente (sem `any`)
- [ ] Memoização apropriada (React.memo ou useMemo)
- [ ] Callbacks são estáveis (useCallback)
- [ ] Sem console.log em produção
- [ ] Segue convenção de nomenclatura do projeto
- [ ] Compatível com dark mode (se aplicável)
- [ ] Acessível (ARIA labels, keyboard nav)

---

## 10. Exemplos Completos

### Componente Completo: Card de Meditação

```typescript
import { motion } from "framer-motion";
import { Heart, Play, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

/** Tipo de dados da meditação */
export interface Meditation {
  id: string;
  title: string;
  duration: string;
  category: string;
  plus: boolean;
  description?: string;
  tags: string[];
  image?: string;
}

interface MeditationCardProps {
  meditation: Meditation;
  isPlus: boolean;
  isFavorite: boolean;
  onPlay: (meditation: Meditation) => void;
  onToggleFavorite: (id: string) => void;
  className?: string;
}

/**
 * Card de meditação exibindo imagem, título, duração e tags
 *
 * @example
 * <MeditationCard
 *   meditation={meditation}
 *   isPlus={true}
 *   isFavorite={false}
 *   onPlay={(med) => console.log(med)}
 *   onToggleFavorite={(id) => console.log(id)}
 * />
 */
const MeditationCard = React.memo(
  function MeditationCard({
    meditation,
    isPlus,
    isFavorite,
    onPlay,
    onToggleFavorite,
    className
  }: MeditationCardProps) {
    const handlePlayClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onPlay(meditation);
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite(meditation.id);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow",
          className
        )}
      >
        {/* Image Section */}
        <div
          className="h-32 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${meditation.image})` }}
        >
          <div className="absolute inset-0 bg-black/20" />

          {/* Plus Badge */}
          {meditation.plus && !isPlus && (
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
              <Crown className="w-3 h-3 text-white" />
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn("w-4 h-4", isFavorite ? "text-red-500 fill-current" : "text-white")} />
          </button>

          {/* Play Button */}
          <button
            onClick={handlePlayClick}
            className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-lg"
            aria-label="Play meditation"
          >
            <Play className="w-5 h-5 text-black ml-0.5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-[#1F2937] text-sm line-clamp-2 mb-2">
            {meditation.title}
          </h3>

          {/* Description */}
          {meditation.description && (
            <p className="text-xs text-[#6B7280] mb-3 line-clamp-2">
              {meditation.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Duration & Plus Badge */}
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

            {/* Tags */}
            <div className="flex gap-1">
              {meditation.tags.slice(0, 2).map((tag) => (
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
      </motion.div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.meditation.id === nextProps.meditation.id &&
      prevProps.isPlus === nextProps.isPlus &&
      prevProps.isFavorite === nextProps.isFavorite &&
      prevProps.className === nextProps.className
    );
  }
);

MeditationCard.displayName = "MeditationCard";

export { MeditationCard };
```

---

## Conclusão

Estes padrões garantem:
- ✅ Código limpo e manutenível
- ✅ Performance otimizada
- ✅ Type-safety com TypeScript
- ✅ Reusabilidade
- ✅ Testabilidade

Use como referência durante a refatoração.

---

**Documento criado:** 2026-02-20
**Última atualização:** 2026-02-20
