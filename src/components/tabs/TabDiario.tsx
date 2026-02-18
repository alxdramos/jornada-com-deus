"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, Plus, Heart, Quote, BookOpen, Calendar, X, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer, staggerItem, hoverLift } from "@/lib/animations";

interface DiaryEntry {
  id: string;
  type: 'note' | 'highlight' | 'verse' | 'quote';
  title: string;
  content: string;
  reference?: string; // Para versículos/citações
  tags?: string[];
  createdAt: Date;
  isFavorite?: boolean;
}

const ENTRIES_EXEMPLO: DiaryEntry[] = [
  {
    id: "highlight-1",
    type: "highlight",
    title: "Momento de reflexão - João 3:16",
    content: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    reference: "João 3:16",
    tags: ["amor", "salvação", "fé"],
    createdAt: new Date(Date.now() - 86400000), // 1 dia atrás
    isFavorite: true
  },
  {
    id: "note-1",
    type: "note",
    title: "Reflexão sobre a gratidão",
    content: "Hoje me dei conta de como é importante agradecer pelas pequenas coisas da vida. Cada dia é uma oportunidade de crescimento espiritual.",
    tags: ["gratidão", "reflexão", "crescimento"],
    createdAt: new Date(Date.now() - 172800000), // 2 dias atrás
    isFavorite: false
  },
  {
    id: "verse-1",
    type: "verse",
    title: "Versículo do dia",
    content: "Tudo posso naquele que me fortalece.",
    reference: "Filipenses 4:13",
    tags: ["força", "fé", "poder"],
    createdAt: new Date(Date.now() - 259200000), // 3 dias atrás
    isFavorite: true
  },
  {
    id: "quote-1",
    type: "quote",
    title: "Citação inspiradora",
    content: "A fé é dar o primeiro passo, mesmo que você não veja toda a escada.",
    reference: "Martin Luther King Jr.",
    tags: ["fé", "inspiração", "coragem"],
    createdAt: new Date(Date.now() - 345600000), // 4 dias atrás
    isFavorite: false
  }
];

type TabType = 'Tudo' | 'Destaques' | 'Anotações' | 'Citações';

const TABS: TabType[] = ['Tudo', 'Destaques', 'Anotações', 'Citações'];

export function TabDiario() {
  const user = useUserStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<TabType>('Tudo');
  const [entries, setEntries] = useState<DiaryEntry[]>(ENTRIES_EXEMPLO);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEntryDetail, setShowEntryDetail] = useState<DiaryEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Novo estado para criação
  const [newEntryType, setNewEntryType] = useState<'note' | 'highlight' | 'verse' | 'quote'>('note');
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [newEntryContent, setNewEntryContent] = useState("");
  const [newEntryReference, setNewEntryReference] = useState("");
  const [newEntryTags, setNewEntryTags] = useState<string[]>([]);

  useEffect(() => {
    // Carregar entradas salvas do localStorage
    const savedEntries = localStorage.getItem('diary-entries');
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        const customEntries = parsed.map((entry: any) => ({
          ...entry,
          createdAt: new Date(entry.createdAt)
        }));
        setEntries([...ENTRIES_EXEMPLO, ...customEntries]);
      } catch (error) {
        console.error('Erro ao carregar entradas do diário:', error);
      }
    }
  }, []);

  const filteredEntries = entries.filter(entry => {
    // Filtro por aba
    if (activeTab === 'Destaques' && !entry.isFavorite) return false;
    if (activeTab === 'Anotações' && entry.type !== 'note') return false;
    if (activeTab === 'Citações' && entry.type !== 'quote' && entry.type !== 'verse') return false;

    // Filtro por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.reference?.toLowerCase().includes(query) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return true;
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const toggleFavorite = (entryId: string) => {
    setEntries(prev => prev.map(entry =>
      entry.id === entryId ? { ...entry, isFavorite: !entry.isFavorite } : entry
    ));

    // Salvar no localStorage (apenas entradas customizadas)
    const customEntries = entries.filter(e => !ENTRIES_EXEMPLO.some(ex => ex.id === e.id));
    localStorage.setItem('diary-entries', JSON.stringify(customEntries));
  };

  const createEntry = () => {
    if (!newEntryTitle.trim() || !newEntryContent.trim()) return;

    const newEntry: DiaryEntry = {
      id: `custom-${Date.now()}`,
      type: newEntryType,
      title: newEntryTitle.trim(),
      content: newEntryContent.trim(),
      reference: newEntryReference.trim() || undefined,
      tags: newEntryTags,
      createdAt: new Date(),
      isFavorite: false
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);

    // Salvar no localStorage
    const customEntries = updatedEntries.filter(e => !ENTRIES_EXEMPLO.some(ex => ex.id === e.id));
    localStorage.setItem('diary-entries', JSON.stringify(customEntries));

    // Limpar formulário
    setNewEntryTitle("");
    setNewEntryContent("");
    setNewEntryReference("");
    setNewEntryTags([]);
    setShowCreateModal(false);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !newEntryTags.includes(tag.trim())) {
      setNewEntryTags([...newEntryTags, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewEntryTags(newEntryTags.filter(tag => tag !== tagToRemove));
  };

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'highlight': return BookOpen;
      case 'verse': return Quote;
      case 'quote': return Quote;
      default: return PenLine;
    }
  };

  const getEntryColor = (type: string) => {
    switch (type) {
      case 'highlight': return 'text-[#FB923C] bg-[#FB923C]/10';
      case 'verse': return 'text-[#10B981] bg-[#10B981]/10';
      case 'quote': return 'text-[#8B5CF6] bg-[#8B5CF6]/10';
      default: return 'text-[#6B7280] bg-[#6B7280]/10';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#FAF9F6] p-6 pb-28">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FB923C] flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <h1 className="text-xl font-bold text-[#1F2937]">Diário</h1>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F59E0B]/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#F59E0B]" />
            </div>
          </div>

          {/* Abas */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeTab === tab
                    ? "bg-[#F59E0B] text-white"
                    : "bg-white text-[#1F2937] hover:bg-[#F9FAFB]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Barra de busca */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar no diário..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1F2937] placeholder:text-[#9CA3AF] text-sm pr-10"
              />
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Search className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
          </div>

          {/* Lista de Entradas */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            {filteredEntries.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-6">
                  <BookOpen className="w-12 h-12 text-[#6B7280]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                  {activeTab === 'Tudo' ? 'Seu diário está vazio' :
                   activeTab === 'Destaques' ? 'Nenhum destaque ainda' :
                   activeTab === 'Anotações' ? 'Nenhuma anotação' :
                   'Nenhuma citação'}
                </h3>
                <p className="text-[#6B7280] text-center max-w-sm">
                  Comece criando sua primeira entrada no diário espiritual.
                </p>
              </motion.div>
            ) : (
              filteredEntries.map((entry, index) => {
                const Icon = getEntryIcon(entry.type);
                return (
                  <motion.div
                    key={entry.id}
                    variants={staggerItem}
                    initial="initial"
                    animate="animate"
                    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                          getEntryColor(entry.type)
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1F2937] text-base mb-1">
                            {entry.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{entry.createdAt.toLocaleDateString('pt-BR')}</span>
                            </div>
                            {entry.reference && (
                              <>
                                <span>•</span>
                                <span>{entry.reference}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFavorite(entry.id)}
                        className={cn(
                          "p-2 rounded-lg transition-colors flex-shrink-0",
                          entry.isFavorite
                            ? "text-red-500"
                            : "text-[#6B7280] hover:text-red-500"
                        )}
                      >
                        <Heart className={cn("w-5 h-5", entry.isFavorite && "fill-current")} />
                      </button>
                    </div>

                    <p className="text-[#6B7280] text-sm leading-relaxed mb-3 line-clamp-3">
                      {entry.content}
                    </p>

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-[#F1F5F9] text-[#64748B] text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => setShowEntryDetail(entry)}
                      className="text-[#F59E0B] text-sm font-medium hover:text-[#D97706] transition-colors"
                    >
                      Ver completo →
                    </button>
                  </motion.div>
                );
              }              )
            )}
          </motion.div>

          {/* FAB para criar nova entrada */}
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#F59E0B] text-white shadow-lg flex items-center justify-center hover:bg-[#D97706] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Modal de Criação de Entrada */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[1000] flex items-end"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="bg-white rounded-t-3xl p-6 w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#1F2937]">Nova Entrada</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                  >
                    <X className="w-5 h-5 text-[#6B7280]" />
                  </button>
                </div>

                {/* Tipo de entrada */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#1F2937] mb-3">
                    Tipo de entrada
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { type: 'note', label: 'Anotação', icon: PenLine },
                      { type: 'highlight', label: 'Destaque', icon: BookOpen },
                      { type: 'verse', label: 'Versículo', icon: Quote },
                      { type: 'quote', label: 'Citação', icon: Quote }
                    ].map(({ type, label, icon: Icon }) => (
                      <button
                        key={type}
                        onClick={() => setNewEntryType(type as any)}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-colors flex flex-col items-center gap-2",
                          newEntryType === type
                            ? "border-[#F59E0B] bg-[#F59E0B]/5"
                            : "border-[#E5E7EB] hover:border-[#F59E0B]/50"
                        )}
                      >
                        <Icon className="w-6 h-6 text-[#6B7280]" />
                        <span className="text-sm font-medium text-[#1F2937]">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={newEntryTitle}
                      onChange={(e) => setNewEntryTitle(e.target.value)}
                      placeholder="Título da entrada"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1F2937] placeholder:text-[#9CA3AF]"
                    />
                  </div>

                  {(newEntryType === 'verse' || newEntryType === 'quote') && (
                    <div>
                      <label className="block text-sm font-medium text-[#1F2937] mb-2">
                        Referência
                      </label>
                      <input
                        type="text"
                        value={newEntryReference}
                        onChange={(e) => setNewEntryReference(e.target.value)}
                        placeholder={newEntryType === 'verse' ? "Ex: João 3:16" : "Ex: C.S. Lewis"}
                        className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1F2937] placeholder:text-[#9CA3AF]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-2">
                      Conteúdo
                    </label>
                    <textarea
                      value={newEntryContent}
                      onChange={(e) => setNewEntryContent(e.target.value)}
                      placeholder="Escreva sua reflexão, versículo ou citação..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1F2937] placeholder:text-[#9CA3AF] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-2">
                      Tags (opcional)
                    </label>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {newEntryTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#F1F5F9] text-[#64748B] text-sm rounded-full"
                        >
                          #{tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Adicionar tag..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTag((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#1F2937] placeholder:text-[#9CA3AF] text-sm"
                    />
                  </div>

                  <button
                    onClick={createEntry}
                    disabled={!newEntryTitle.trim() || !newEntryContent.trim()}
                    className="w-full py-4 bg-[#F59E0B] text-white font-semibold rounded-xl hover:bg-[#D97706] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Criar Entrada
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de Detalhes da Entrada */}
      <AnimatePresence>
        {showEntryDetail && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[1000] flex items-end"
              onClick={() => setShowEntryDetail(null)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="bg-white rounded-t-3xl p-6 w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[#1F2937]">{showEntryDetail.title}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getEntryColor(showEntryDetail.type)
                      )}>
                        {showEntryDetail.type === 'note' ? 'Anotação' :
                         showEntryDetail.type === 'highlight' ? 'Destaque' :
                         showEntryDetail.type === 'verse' ? 'Versículo' : 'Citação'}
                      </span>
                      <span className="text-[#6B7280] text-sm">
                        {showEntryDetail.createdAt.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(showEntryDetail.id)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        showEntryDetail.isFavorite
                          ? "text-red-500"
                          : "text-[#6B7280] hover:text-red-500"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", showEntryDetail.isFavorite && "fill-current")} />
                    </button>
                    <button
                      onClick={() => setShowEntryDetail(null)}
                      className="p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                    >
                      <X className="w-5 h-5 text-[#6B7280]" />
                    </button>
                  </div>
                </div>

                {showEntryDetail.reference && (
                  <div className="bg-[#F9FAFB] rounded-xl p-4 mb-4">
                    <p className="text-[#6B7280] text-sm font-medium">
                      {showEntryDetail.reference}
                    </p>
                  </div>
                )}

                <div className="bg-[#F9FAFB] rounded-xl p-4 mb-4">
                  <p className="text-[#1F2937] leading-relaxed whitespace-pre-wrap">
                    {showEntryDetail.content}
                  </p>
                </div>

                {showEntryDetail.tags && showEntryDetail.tags.length > 0 && (
                  <div className="flex gap-2 mb-6 flex-wrap">
                    {showEntryDetail.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[#F1F5F9] text-[#64748B] text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setShowEntryDetail(null)}
                  className="w-full py-4 bg-[#F59E0B] text-white font-semibold rounded-xl hover:bg-[#D97706] transition-colors"
                >
                  Fechar
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
