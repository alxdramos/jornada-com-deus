import { create } from 'zustand';
import { ORACOES, Oracao } from '@/data/oracoes';

export interface OracaoState {
  // Data
  oracoes: Oracao[];
  currentOracao: Oracao | null;
  favoritos: string[]; // IDs das orações favoritadas

  // UI State
  isPlaying: boolean;
  currentAudioId: string | null;
  searchQuery: string;
  filteredOracoes: Oracao[];

  // Actions
  loadOracoes: () => void;
  setCurrentOracao: (oracao: Oracao | null) => void;
  searchOracoes: (query: string) => void;
  toggleFavorito: (id: string) => void;
  isFavorito: (id: string) => boolean;
  setPlaying: (playing: boolean, audioId?: string) => void;
  getNextOracao: () => Oracao | null;
  getPreviousOracao: () => Oracao | null;
}

export const useOracaoStore = create<OracaoState>((set, get) => ({
  // Initial state
  oracoes: [],
  currentOracao: null,
  favoritos: [],
  isPlaying: false,
  currentAudioId: null,
  searchQuery: '',
  filteredOracoes: [],

  // Load all oracoes
  loadOracoes: () => {
    set({
      oracoes: ORACOES,
      filteredOracoes: ORACOES,
    });

    // Load favoritos from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('oracoes-favoritos');
      if (saved) {
        set({ favoritos: JSON.parse(saved) });
      }
    }
  },

  // Set current oracao
  setCurrentOracao: (oracao: Oracao | null) => {
    set({ currentOracao: oracao });
  },

  // Search oracoes by title or text
  searchOracoes: (query: string) => {
    const state = get();
    const { oracoes } = state;

    set({ searchQuery: query });

    if (!query.trim()) {
      set({ filteredOracoes: oracoes });
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = oracoes.filter(
      (oracao) =>
        oracao.titulo.toLowerCase().includes(lowerQuery) ||
        oracao.texto.toLowerCase().includes(lowerQuery)
    );

    set({ filteredOracoes: filtered });
  },

  // Toggle favorite status
  toggleFavorito: (id: string) => {
    const state = get();
    const { favoritos } = state;

    let updated: string[];
    if (favoritos.includes(id)) {
      updated = favoritos.filter((fav) => fav !== id);
    } else {
      updated = [...favoritos, id];
    }

    set({ favoritos: updated });

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('oracoes-favoritos', JSON.stringify(updated));
    }
  },

  // Check if oracao is favorite
  isFavorito: (id: string) => {
    const state = get();
    return state.favoritos.includes(id);
  },

  // Set playing state
  setPlaying: (playing: boolean, audioId?: string) => {
    set({
      isPlaying: playing,
      currentAudioId: audioId || null,
    });
  },

  // Get next oracao
  getNextOracao: () => {
    const state = get();
    const { currentOracao, filteredOracoes } = state;

    if (!currentOracao) return filteredOracoes[0] || null;

    const currentIndex = filteredOracoes.findIndex(
      (o) => o.id === currentOracao.id
    );

    if (currentIndex === -1 || currentIndex === filteredOracoes.length - 1) {
      return filteredOracoes[0] || null; // Loop to first
    }

    return filteredOracoes[currentIndex + 1];
  },

  // Get previous oracao
  getPreviousOracao: () => {
    const state = get();
    const { currentOracao, filteredOracoes } = state;

    if (!currentOracao) return filteredOracoes[filteredOracoes.length - 1] || null;

    const currentIndex = filteredOracoes.findIndex(
      (o) => o.id === currentOracao.id
    );

    if (currentIndex === -1 || currentIndex === 0) {
      return filteredOracoes[filteredOracoes.length - 1] || null; // Loop to last
    }

    return filteredOracoes[currentIndex - 1];
  },
}));

export default useOracaoStore;
