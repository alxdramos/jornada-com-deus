import { create } from 'zustand';

export type TabId = 'hoje' | 'explorar' | 'biblia' | 'oracoes' | 'diario';

interface TabStore {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export const useTabStore = create<TabStore>((set) => ({
  activeTab: 'hoje',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
