import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TabId = 'hoje' | 'explorar' | 'biblia' | 'meditacoes' | 'oracoes' | 'diario' | 'estudos' | 'devocional' | 'kids';

// Ordem visual das tabs na BottomNav — usada para calcular direção do slide
const TAB_ORDER: TabId[] = ['hoje', 'explorar', 'biblia', 'oracoes', 'meditacoes', 'estudos', 'diario', 'devocional', 'kids'];

interface TabStore {
  activeTab: TabId;
  tabDirection: number; // 1 = slide da direita (avançar) | -1 = slide da esquerda (voltar)
  setActiveTab: (tab: TabId) => void;
}

export const useTabStore = create<TabStore>()(
  persist(
    (set) => ({
      activeTab: 'hoje',
      tabDirection: 1,
      setActiveTab: (tab: TabId) => set((state) => ({
        activeTab: tab,
        tabDirection: TAB_ORDER.indexOf(tab) >= TAB_ORDER.indexOf(state.activeTab) ? 1 : -1,
      })),
    }),
    {
      name: 'tab-store',
      // tabDirection é ephemeral — não precisa persistir
      partialize: (state) => ({ activeTab: state.activeTab }),
    }
  )
);
