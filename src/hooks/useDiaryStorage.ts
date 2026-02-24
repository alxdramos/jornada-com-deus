import { useState, useEffect } from "react";
import { DiaryEntry, DiaryTabType, ENTRIES_EXEMPLO } from "@/data/diario";
import { db, JournalEntry } from "@/lib/db";

// Mapeamento de tipos DiaryEntry → JournalEntry (Dexie)
const DIARY_TYPE_MAP: Record<string, JournalEntry['type']> = {
  note:      'anotacao',
  highlight: 'destaque',
  quote:     'citacao',
  verse:     'reflexao',
};

export function useDiaryStorage() {
  const [entries, setEntries] = useState<DiaryEntry[]>(ENTRIES_EXEMPLO);
  const [loaded, setLoaded] = useState(false);

  // Carregar entradas do localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem("diary-entries");
    if (savedEntries) {
      try {
        type StoredEntry = Omit<DiaryEntry, "createdAt"> & { createdAt: string };
        const parsed = JSON.parse(savedEntries) as StoredEntry[];
        const customEntries = parsed.map((entry) => ({
          ...entry,
          createdAt: new Date(entry.createdAt),
        }));
        setEntries([...ENTRIES_EXEMPLO, ...customEntries]);
      } catch (error) {
        console.error("Erro ao carregar entradas do diário:", error);
      }
    }
    setLoaded(true);
  }, []);

  // Salvar apenas entradas customizadas no localStorage
  const saveToLocalStorage = (allEntries: DiaryEntry[]) => {
    const customEntries = allEntries.filter(
      (e) => !ENTRIES_EXEMPLO.some((ex) => ex.id === e.id)
    );
    localStorage.setItem("diary-entries", JSON.stringify(customEntries));
  };

  const addEntry = (entry: DiaryEntry) => {
    const newEntries = [...entries, entry];
    setEntries(newEntries);
    saveToLocalStorage(newEntries);

    // Também grava no Dexie com syncStatus='pending' para sync offline→online
    db.journalEntries.add({
      type: DIARY_TYPE_MAP[entry.type] ?? 'anotacao',
      content: entry.content,
      date: entry.createdAt,
      favorite: entry.isFavorite ?? false,
      userId: 0, // atualizado pelo useAuthSync quando autenticado
      syncStatus: 'pending',
      localId: entry.id,
    }).catch((err) =>
      console.warn('[DiaryStorage] Falha ao gravar no Dexie (não crítico):', err)
    );
  };

  const updateEntry = (id: string, updates: Partial<DiaryEntry>) => {
    const newEntries = entries.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    setEntries(newEntries);
    saveToLocalStorage(newEntries);
  };

  const deleteEntry = (id: string) => {
    const newEntries = entries.filter((e) => e.id !== id);
    setEntries(newEntries);
    saveToLocalStorage(newEntries);
  };

  const toggleFavorite = (id: string) => {
    updateEntry(id, {
      isFavorite: !entries.find((e) => e.id === id)?.isFavorite,
    });
  };

  const filterEntries = (activeTab: DiaryTabType, searchQuery: string) => {
    return entries
      .filter((entry) => {
        // Filtro por aba
        if (activeTab === "Destaques" && !entry.isFavorite) return false;
        if (activeTab === "Anotações" && entry.type !== "note") return false;
        if (
          activeTab === "Citações" &&
          entry.type !== "quote" &&
          entry.type !== "verse"
        )
          return false;

        // Filtro por busca
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            entry.title.toLowerCase().includes(query) ||
            entry.content.toLowerCase().includes(query) ||
            entry.reference?.toLowerCase().includes(query) ||
            entry.tags?.some((tag) => tag.toLowerCase().includes(query))
          );
        }

        return true;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  return {
    entries,
    loaded,
    addEntry,
    updateEntry,
    deleteEntry,
    toggleFavorite,
    filterEntries,
  };
}
