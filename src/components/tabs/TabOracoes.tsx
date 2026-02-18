"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/stores/userStore";
import { Bird, Plus, Heart, Edit3, Trash2, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Prayer {
  id: string;
  title: string;
  content: string;
  category: string;
  isCustom: boolean;
  createdAt: Date;
}

const PRAYERS_PREDEFINIDAS: Prayer[] = [
  {
    id: "gracas-manha",
    title: "Ação de Graças - Manhã",
    content: "Senhor, obrigado pelo novo dia que me concedes. Pela oportunidade de viver, trabalhar e glorificar o Teu nome. Que este dia seja produtivo e cheio da Tua presença. Guia meus passos e minhas decisões. Amém.",
    category: "Graças",
    isCustom: false,
    createdAt: new Date()
  },
  {
    id: "paz-interior",
    title: "Paz Interior",
    content: "Pai celestial, dá-me a paz que excede todo entendimento. Guarda meu coração e minha mente em Cristo Jesus. Livra-me da ansiedade e do medo. Que eu descanse em Ti hoje. Amém.",
    category: "Paz",
    isCustom: false,
    createdAt: new Date()
  },
  {
    id: "familia",
    title: "Pela Família",
    content: "Senhor, abençoa minha família. Protege cada um dos meus entes queridos. Dá sabedoria aos pais, obediência aos filhos. Que sejamos um exemplo do amor de Cristo. Amém.",
    category: "Família",
    isCustom: false,
    createdAt: new Date()
  },
  {
    id: "perdao",
    title: "Pedido de Perdão",
    content: "Pai, perdoa minhas faltas e pecados. Purifica meu coração. Ajuda-me a perdoar aqueles que me ofenderam. Renova minha mente e meu espírito. Amém.",
    category: "Perdão",
    isCustom: false,
    createdAt: new Date()
  },
  {
    id: "forca",
    title: "Força Diária",
    content: "Senhor, dá-me força para enfrentar os desafios deste dia. Capacita-me com o Teu poder. Que eu seja corajoso e fiel em todas as circunstâncias. Amém.",
    category: "Força",
    isCustom: false,
    createdAt: new Date()
  }
];

const CATEGORIAS = ["Todas", "Graças", "Paz", "Família", "Perdão", "Força", "Minhas"];

export function TabOracoes() {
  const user = useUserStore((s) => s.user);
  const [prayers, setPrayers] = useState<Prayer[]>(PRAYERS_PREDEFINIDAS);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPrayerDetail, setShowPrayerDetail] = useState<Prayer | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [newPrayerTitle, setNewPrayerTitle] = useState("");
  const [newPrayerContent, setNewPrayerContent] = useState("");
  const [newPrayerCategory, setNewPrayerCategory] = useState("Minhas");

  useEffect(() => {
    // Carregar orações salvas e favoritos
    const savedPrayers = localStorage.getItem('custom-prayers');
    const savedFavorites = localStorage.getItem('prayer-favorites');

    if (savedPrayers) {
      try {
        type StoredPrayer = Omit<Prayer, 'createdAt'> & { createdAt: string };
        const parsed = JSON.parse(savedPrayers) as StoredPrayer[];
        const customPrayers = parsed.map((p) => ({
          ...p,
          createdAt: new Date(p.createdAt)
        }));
        setPrayers([...PRAYERS_PREDEFINIDAS, ...customPrayers]);
      } catch (error) {
        console.error('Erro ao carregar orações salvas:', error);
      }
    }

    if (savedFavorites) {
      try {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      } catch (error) {
        console.error('Erro ao carregar favoritos das orações:', error);
      }
    }
  }, []);

  const filteredPrayers = prayers.filter(prayer => {
    if (categoriaAtiva === "Todas") return true;
    if (categoriaAtiva === "Minhas") return prayer.isCustom;
    return prayer.category === categoriaAtiva;
  });

  const toggleFavorite = (prayerId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(prayerId)) {
        next.delete(prayerId);
      } else {
        next.add(prayerId);
      }
      localStorage.setItem('prayer-favorites', JSON.stringify([...next]));
      return next;
    });
  };

  const createPrayer = () => {
    if (!newPrayerTitle.trim() || !newPrayerContent.trim()) return;

    const newPrayer: Prayer = {
      id: `custom-${Date.now()}`,
      title: newPrayerTitle.trim(),
      content: newPrayerContent.trim(),
      category: newPrayerCategory,
      isCustom: true,
      createdAt: new Date()
    };

    const updatedPrayers = [...prayers, newPrayer];
    setPrayers(updatedPrayers);

    // Salvar no localStorage
    const customPrayers = updatedPrayers.filter(p => p.isCustom);
    localStorage.setItem('custom-prayers', JSON.stringify(customPrayers));

    // Limpar formulário
    setNewPrayerTitle("");
    setNewPrayerContent("");
    setNewPrayerCategory("Minhas");
    setShowCreateModal(false);
  };

  const deletePrayer = (prayerId: string) => {
    const updatedPrayers = prayers.filter(p => p.id !== prayerId);
    setPrayers(updatedPrayers);

    // Atualizar localStorage
    const customPrayers = updatedPrayers.filter(p => p.isCustom);
    localStorage.setItem('custom-prayers', JSON.stringify(customPrayers));

    // Remover dos favoritos se necessário
    if (favorites.has(prayerId)) {
      const newFavorites = new Set(favorites);
      newFavorites.delete(prayerId);
      setFavorites(newFavorites);
      localStorage.setItem('prayer-favorites', JSON.stringify([...newFavorites]));
    }

    setShowPrayerDetail(null);
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
              <h1 className="text-xl font-bold text-[#1F2937]">Orações</h1>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center">
              <Bird className="w-5 h-5 text-[#10B981]" />
            </div>
          </div>

          {/* Categorias */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIAS.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaAtiva(categoria)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  categoriaAtiva === categoria
                    ? "bg-[#10B981] text-white"
                    : "bg-white text-[#1F2937] hover:bg-[#F9FAFB]"
                )}
              >
                {categoria}
              </button>
            ))}
          </div>

          {/* Lista de Orações */}
          <div className="space-y-4">
            {filteredPrayers.map((prayer) => (
              <motion.div
                key={prayer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1F2937] text-base mb-1">
                      {prayer.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full",
                        prayer.isCustom ? "bg-[#FB923C]/10 text-[#FB923C]" : "bg-[#10B981]/10 text-[#10B981]"
                      )}>
                        {prayer.category}
                      </span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{prayer.createdAt.toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(prayer.id)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      favorites.has(prayer.id)
                        ? "text-red-500"
                        : "text-[#6B7280] hover:text-red-500"
                    )}
                  >
                    <Heart className={cn("w-5 h-5", favorites.has(prayer.id) && "fill-current")} />
                  </button>
                </div>

                <p className="text-[#6B7280] text-sm leading-relaxed mb-3 line-clamp-2">
                  {prayer.content}
                </p>

                <button
                  onClick={() => setShowPrayerDetail(prayer)}
                  className="text-[#10B981] text-sm font-medium hover:text-[#059669] transition-colors"
                >
                  Ver oração completa →
                </button>
              </motion.div>
            ))}
          </div>

          {/* FAB para criar nova oração */}
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#10B981] text-white shadow-lg flex items-center justify-center hover:bg-[#059669] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Modal de Criação de Oração */}
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
                  <h2 className="text-xl font-bold text-[#1F2937]">Nova Oração</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                  >
                    <X className="w-5 h-5 text-[#6B7280]" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-2">
                      Título da Oração
                    </label>
                    <input
                      type="text"
                      value={newPrayerTitle}
                      onChange={(e) => setNewPrayerTitle(e.target.value)}
                      placeholder="Ex: Oração pela família"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1F2937] placeholder:text-[#9CA3AF]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-2">
                      Categoria
                    </label>
                    <select
                      value={newPrayerCategory}
                      onChange={(e) => setNewPrayerCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1F2937]"
                    >
                      {["Minhas", "Graças", "Paz", "Família", "Perdão", "Força"].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-2">
                      Conteúdo da Oração
                    </label>
                    <textarea
                      value={newPrayerContent}
                      onChange={(e) => setNewPrayerContent(e.target.value)}
                      placeholder="Escreva sua oração aqui..."
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1F2937] placeholder:text-[#9CA3AF] resize-none"
                    />
                  </div>

                  <button
                    onClick={createPrayer}
                    disabled={!newPrayerTitle.trim() || !newPrayerContent.trim()}
                    className="w-full py-4 bg-[#10B981] text-white font-semibold rounded-xl hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Criar Oração
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de Detalhes da Oração */}
      <AnimatePresence>
        {showPrayerDetail && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[1000] flex items-end"
              onClick={() => setShowPrayerDetail(null)}
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
                    <h2 className="text-xl font-bold text-[#1F2937]">{showPrayerDetail.title}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        showPrayerDetail.isCustom ? "bg-[#FB923C]/10 text-[#FB923C]" : "bg-[#10B981]/10 text-[#10B981]"
                      )}>
                        {showPrayerDetail.category}
                      </span>
                      <span className="text-[#6B7280] text-sm">
                        {showPrayerDetail.createdAt.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(showPrayerDetail.id)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        favorites.has(showPrayerDetail.id)
                          ? "text-red-500"
                          : "text-[#6B7280] hover:text-red-500"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", favorites.has(showPrayerDetail.id) && "fill-current")} />
                    </button>
                    {showPrayerDetail.isCustom && (
                      <button
                        onClick={() => deletePrayer(showPrayerDetail.id)}
                        className="p-2 rounded-lg text-[#6B7280] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => setShowPrayerDetail(null)}
                      className="p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                    >
                      <X className="w-5 h-5 text-[#6B7280]" />
                    </button>
                  </div>
                </div>

                <div className="bg-[#F9FAFB] rounded-2xl p-6 mb-6">
                  <p className="text-[#1F2937] leading-relaxed whitespace-pre-wrap">
                    {showPrayerDetail.content}
                  </p>
                </div>

                <button
                  onClick={() => setShowPrayerDetail(null)}
                  className="w-full py-4 bg-[#10B981] text-white font-semibold rounded-xl hover:bg-[#059669] transition-colors"
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
