'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { create } from 'zustand';
import type { SearchResult } from '@/types/search';

// ─── Singleton store so modal and button share the same isOpen state ──────────
interface SearchStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));

// ─── Full hook used by the modal ──────────────────────────────────────────────
interface UseGlobalSearchReturn {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  isLoading: boolean;
}

export function useGlobalSearch(): UseGlobalSearchReturn {
  const { isOpen, open, close } = useSearchStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  // Keyboard shortcut: Cmd+K / Ctrl+K to open, Escape to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) close(); else open();
      }
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, open, close]);

  // Reset results when closing
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Debounced search
  const performSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }

    // Cancel previous in-flight request
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q)}&limit=20`,
        { signal: controllerRef.current.signal }
      );
      if (!res.ok) {
        setResults([]);
        return;
      }
      const data = await res.json();
      setResults(data.results ?? []);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, performSearch]);

  const setIsOpen = useCallback(
    (val: boolean) => { if (val) open(); else close(); },
    [open, close]
  );

  return {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    results,
    isLoading,
  };
}
