import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TabId = 'hoje' | 'explorar' | 'biblia' | 'meditacoes' | 'oracoes' | 'diario' | 'estudos' | 'devocional' | 'kids';

interface TabStore {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export const useTabStore = create<TabStore>()(
  persist(
    (set) => ({
      activeTab: 'hoje',
      setActiveTab: (tab: TabId) => set({ activeTab: tab }),
    }),
    {
      name: 'tab-store',
    }
  )
);
