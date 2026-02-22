"use client";

import { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { UserHeader } from "@/components/layout/UserHeader";
import { Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

// Sub-componentes
import { DiaryFilters } from "./diario/DiaryFilters";
import { DiaryEntryCard } from "./diario/DiaryEntryCard";
import { DiaryCreateModal } from "./diario/DiaryCreateModal";
import { DiaryDetailModal } from "./diario/DiaryDetailModal";
import { DiaryEmptyState } from "./diario/DiaryEmptyState";

// Hook e dados
import { useDiaryStorage } from "@/hooks/useDiaryStorage";
import { DiaryEntry, DiaryTabType, DiaryEntryType } from "@/data/diario";

export function TabDiario() {
  const user = useUserStore((s) => s.user);
  const {
    entries,
    loaded,
    addEntry,
    deleteEntry,
    toggleFavorite,
    filterEntries,
  } = useDiaryStorage();

  // Estados
  const [activeTab, setActiveTab] = useState<DiaryTabType>("Tudo");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEntryDetail, setShowEntryDetail] = useState<DiaryEntry | null>(
    null
  );

  // Filtrar entradas
  const filteredEntries = filterEntries(activeTab, searchQuery);

  // Handlers
  const handleCreateEntry = (data: {
    type: DiaryEntryType;
    title: string;
    content: string;
    reference?: string;
    tags: string[];
  }) => {
    const newEntry: DiaryEntry = {
      id: `custom-${Date.now()}`,
      type: data.type,
      title: data.title,
      content: data.content,
      reference: data.reference,
      tags: data.tags,
      createdAt: new Date(),
      isFavorite: false,
    };

    addEntry(newEntry);
    setShowCreateModal(false);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-bg-primary p-6 pb-28 flex items-center justify-center">
        <div className="text-text-secondary">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-bg-primary p-6 pb-28">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <UserHeader
            title="Diário"
            rightElement={
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
              >
                <Search className="w-5 h-5 text-text-primary" />
              </button>
            }
          />

          {/* Filtros */}
          <DiaryFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showSearch={showSearch}
            onToggleSearch={setShowSearch}
          />

          {/* Botão Nova Entrada */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#FB923C] text-white font-medium hover:bg-[#EA580C] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Entrada
          </button>

          {/* Lista de entradas */}
          {filteredEntries.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {filteredEntries.map((entry) => (
                <motion.div key={entry.id} variants={staggerItem}>
                  <DiaryEntryCard
                    entry={entry}
                    onViewDetail={setShowEntryDetail}
                    onToggleFavorite={toggleFavorite}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <DiaryEmptyState
              searchActive={searchQuery.length > 0}
              onCreateNew={() => setShowCreateModal(true)}
            />
          )}
        </div>
      </div>

      {/* Modais */}
      <DiaryCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateEntry}
      />

      <DiaryDetailModal
        entry={showEntryDetail}
        isOpen={!!showEntryDetail}
        onClose={() => setShowEntryDetail(null)}
        onToggleFavorite={toggleFavorite}
        onDelete={(id) => {
          deleteEntry(id);
          setShowEntryDetail(null);
        }}
      />
    </>
  );
}
