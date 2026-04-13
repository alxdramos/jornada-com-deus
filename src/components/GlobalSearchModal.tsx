'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, Mic2, Headphones, BookOpen, SearchX, Loader2, MessageCircle } from 'lucide-react';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { useTabStore } from '@/stores/tabStore';
import type { SearchResult, SearchResultType } from '@/types/search';

// ─── Icon per content type ────────────────────────────────────────────────────
function TypeIcon({ type }: { type: SearchResultType }) {
  const cls = 'w-5 h-5 shrink-0';
  if (type === 'oracao') return <Mic2 className={`${cls} text-amber-500`} />;
  if (type === 'meditacao') return <Headphones className={`${cls} text-emerald-600`} />;
  if (type === 'devocional') return <MessageCircle className={`${cls} text-orange-500`} />;
  return <BookOpen className={`${cls} text-emerald-500`} />;
}

// ─── Category badge ───────────────────────────────────────────────────────────
function CategoryBadge({ category, type }: { category?: string; type: SearchResultType }) {
  const colors: Record<SearchResultType, string> = {
    oracao: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    meditacao: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    estudo: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    devocional: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };
  const label = category ?? (type === 'oracao' ? 'Oração' : type === 'meditacao' ? 'Meditação' : type === 'devocional' ? 'Devocional' : 'Estudo');
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colors[type]}`}>
      {label}
    </span>
  );
}

// ─── Single result row ────────────────────────────────────────────────────────
function ResultItem({
  result,
  index,
  onSelect,
}: {
  result: SearchResult;
  index: number;
  onSelect: (r: SearchResult) => void;
}) {
  return (
    <motion.button
      key={result.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035, duration: 0.18 }}
      onClick={() => onSelect(result)}
      className="w-full flex items-start gap-3 px-4 py-3 text-left
        hover:bg-emerald-50 dark:hover:bg-emerald-900/10
        border-l-2 border-transparent hover:border-emerald-600
        transition-all group"
    >
      <div className="mt-0.5">
        <TypeIcon type={result.type} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-text-primary truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {result.title}
          </span>
          <CategoryBadge category={result.category} type={result.type} />
        </div>
        {result.description && (
          <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
            {result.description}
          </p>
        )}
      </div>
    </motion.button>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export function GlobalSearchModal() {
  const { isOpen, setIsOpen, query, setQuery, results, isLoading } = useGlobalSearch();
  const setActiveTab = useTabStore((s) => s.setActiveTab);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  function handleSelect(result: SearchResult) {
    if (result.type === 'oracao') setActiveTab('oracoes');
    else if (result.type === 'meditacao') setActiveTab('meditacoes');
    else if (result.type === 'estudo') setActiveTab('estudos');
    else if (result.type === 'devocional') setActiveTab('devocional');
    setIsOpen(false);
  }

  const showEmpty = !isLoading && query.length >= 2 && results.length === 0;
  const showHint = !isLoading && query.length < 2 && query.length > 0;
  const showInitialHint = !isLoading && query.length === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        // Backdrop
        <motion.div
          className="fixed inset-0 z-[10001] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        >
          {/* Modal panel */}
          <motion.div
            className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: -12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -12 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input row */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-emerald-600 shrink-0 animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-text-secondary shrink-0" />
              )}
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar devocionais, orações, meditações..."
                className="flex-1 bg-transparent text-base text-text-primary placeholder-text-secondary outline-none"
                aria-label="Campo de busca global"
              />
              <div className="flex items-center gap-2 shrink-0">
                <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-text-secondary border border-gray-200 dark:border-gray-700 rounded">
                  ⌘K
                </kbd>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Fechar busca"
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>
            </div>

            {/* Results / states */}
            <div className="max-h-80 overflow-y-auto">
              {/* Results list */}
              {results.length > 0 && (
                <div>
                  <AnimatePresence initial={false}>
                    {results.map((r, i) => (
                      <ResultItem key={r.id} result={r} index={i} onSelect={handleSelect} />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Empty state */}
              {showEmpty && (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-text-secondary">
                  <SearchX className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm">
                    Nenhum resultado para{' '}
                    <span className="font-semibold text-text-primary">&ldquo;{query}&rdquo;</span>
                  </p>
                </div>
              )}

              {/* Short query hint */}
              {showHint && (
                <p className="text-sm text-text-secondary text-center py-8">
                  Digite pelo menos 2 caracteres para buscar
                </p>
              )}

              {/* Initial hint */}
              {showInitialHint && (
                <div className="py-6 px-4 space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                    Buscar em
                  </p>
                  {[
                    { icon: <MessageCircle className="w-4 h-4 text-orange-500" />, label: 'Devocionais' },
                    { icon: <Mic2 className="w-4 h-4 text-amber-500" />, label: 'Orações' },
                    { icon: <Headphones className="w-4 h-4 text-emerald-600" />, label: 'Meditações' },
                    { icon: <BookOpen className="w-4 h-4 text-emerald-500" />, label: 'Estudos Bíblicos' },
                  ].map(({ icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 text-sm text-text-secondary px-1"
                    >
                      {icon}
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
