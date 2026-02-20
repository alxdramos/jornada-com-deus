"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart, Flame, Calendar } from "lucide-react";
import { useProgressStore } from "@/stores/progressStore";
import { cn } from "@/lib/utils";

interface CalendarioFavoritosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FavoritoItem {
  id: string;
  titulo: string;
  tipo: "oracao" | "diario" | "meditacao";
}

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function CalendarioFavoritosModal({ isOpen, onClose }: CalendarioFavoritosModalProps) {
  const { progress } = useProgressStore();
  const [aba, setAba] = useState<"calendario" | "favoritos">("calendario");
  const [mesSelecionado, setMesSelecionado] = useState(new Date());
  const [favoritos, setFavoritos] = useState<FavoritoItem[]>([]);

  // Carregar favoritos do localStorage
  useEffect(() => {
    if (!isOpen) return;
    const items: FavoritoItem[] = [];

    // Orações favoritas
    const prayerFavs = localStorage.getItem('prayer-favorites');
    const prayerData = localStorage.getItem('custom-prayers');
    if (prayerFavs) {
      type StoredPrayer = { id: string; title: string };
      const favIds: string[] = JSON.parse(prayerFavs);
      const allPrayers: StoredPrayer[] = prayerData ? JSON.parse(prayerData) : [];
      const predefinidas = [
        { id: "gracas-manha", title: "Ação de Graças - Manhã" },
        { id: "paz-interior", title: "Paz Interior" },
        { id: "familia", title: "Pela Família" },
        { id: "perdao", title: "Pedido de Perdão" },
        { id: "forca", title: "Força Diária" },
      ];
      [...predefinidas, ...allPrayers].forEach(p => {
        if (favIds.includes(p.id)) {
          items.push({ id: p.id, titulo: p.title, tipo: "oracao" });
        }
      });
    }

    // Entradas favoritas do diário
    const diaryData = localStorage.getItem('diary-entries');
    if (diaryData) {
      type StoredEntry = { id: string; title: string; isFavorite: boolean };
      const entries: StoredEntry[] = JSON.parse(diaryData);
      entries.filter(e => e.isFavorite).forEach(e => {
        items.push({ id: e.id, titulo: e.title, tipo: "diario" });
      });
    }

    setFavoritos(items);
  }, [isOpen]);

  // Gerar dias do calendário
  const gerarDiasDoMes = () => {
    const ano = mesSelecionado.getFullYear();
    const mes = mesSelecionado.getMonth();
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    const completedSet = new Set(progress.completedDates ?? []);
    const hoje = new Date();

    const dias: { dia: number | null; concluido: boolean; ehHoje: boolean }[] = [];
    // Células vazias antes do primeiro dia
    for (let i = 0; i < primeiroDia; i++) {
      dias.push({ dia: null, concluido: false, ehHoje: false });
    }
    // Dias do mês
    for (let d = 1; d <= totalDias; d++) {
      const dateStr = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const ehHoje = hoje.getFullYear() === ano && hoje.getMonth() === mes && hoje.getDate() === d;
      dias.push({ dia: d, concluido: completedSet.has(dateStr), ehHoje });
    }
    return dias;
  };

  const mudarMes = (direcao: -1 | 1) => {
    setMesSelecionado(prev => {
      const novo = new Date(prev);
      novo.setMonth(prev.getMonth() + direcao);
      return novo;
    });
  };

  const tipoCor = (tipo: FavoritoItem["tipo"]) => {
    if (tipo === "oracao") return "bg-[#10B981]/10 text-[#10B981]";
    if (tipo === "diario") return "bg-[#F59E0B]/10 text-[#F59E0B]";
    return "bg-[#8B5CF6]/10 text-[#8B5CF6]";
  };

  const tipoLabel = (tipo: FavoritoItem["tipo"]) => {
    if (tipo === "oracao") return "Oração";
    if (tipo === "diario") return "Diário";
    return "Meditação";
  };

  const dias = gerarDiasDoMes();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[1000] flex items-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="bg-white rounded-t-3xl w-full max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-[#F3F4F6]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1F2937]">Minha Jornada</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-[#F9FAFB] transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            {/* Abas */}
            <div className="flex gap-2">
              <button
                onClick={() => setAba("calendario")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  aba === "calendario"
                    ? "bg-[#FB923C] text-white"
                    : "bg-[#F3F4F6] text-[#6B7280]"
                )}
              >
                <Calendar className="w-4 h-4" />
                Calendário
              </button>
              <button
                onClick={() => setAba("favoritos")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  aba === "favoritos"
                    ? "bg-[#FB923C] text-white"
                    : "bg-[#F3F4F6] text-[#6B7280]"
                )}
              >
                <Heart className="w-4 h-4" />
                Favoritos
              </button>
            </div>
          </div>

          <div className="px-6 py-6">
            {aba === "calendario" && (
              <div>
                {/* Stats rápidos */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[#FFF7ED] rounded-2xl p-3 text-center">
                    <Flame className="w-5 h-5 text-[#FB923C] mx-auto mb-1" />
                    <p className="text-xl font-bold text-[#1F2937]">{progress.currentStreak}</p>
                    <p className="text-xs text-[#6B7280]">Sequência</p>
                  </div>
                  <div className="bg-[#F0FDF4] rounded-2xl p-3 text-center">
                    <Calendar className="w-5 h-5 text-[#10B981] mx-auto mb-1" />
                    <p className="text-xl font-bold text-[#1F2937]">{progress.completedDays}</p>
                    <p className="text-xs text-[#6B7280]">Total dias</p>
                  </div>
                  <div className="bg-[#F5F3FF] rounded-2xl p-3 text-center">
                    <Flame className="w-5 h-5 text-[#8B5CF6] mx-auto mb-1" />
                    <p className="text-xl font-bold text-[#1F2937]">{progress.maxStreak}</p>
                    <p className="text-xs text-[#6B7280]">Recorde</p>
                  </div>
                </div>

                {/* Navegação do mês */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => mudarMes(-1)}
                    className="p-2 rounded-xl hover:bg-[#F9FAFB] transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#6B7280]" />
                  </button>
                  <h3 className="font-semibold text-[#1F2937]">
                    {MESES[mesSelecionado.getMonth()]} {mesSelecionado.getFullYear()}
                  </h3>
                  <button
                    onClick={() => mudarMes(1)}
                    className="p-2 rounded-xl hover:bg-[#F9FAFB] transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-[#6B7280]" />
                  </button>
                </div>

                {/* Cabeçalho da semana */}
                <div className="grid grid-cols-7 mb-2">
                  {DIAS_SEMANA.map(d => (
                    <div key={d} className="text-center text-xs font-medium text-[#9CA3AF] py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Dias */}
                <div className="grid grid-cols-7 gap-1">
                  {dias.map((item, i) => (
                    <div key={i} className="aspect-square flex items-center justify-center">
                      {item.dia !== null && (
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                            item.concluido
                              ? "bg-[#10B981] text-white"
                              : item.ehHoje
                              ? "border-2 border-[#FB923C] text-[#FB923C]"
                              : "text-[#6B7280] hover:bg-[#F9FAFB]"
                          )}
                        >
                          {item.dia}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Legenda */}
                <div className="flex items-center gap-6 mt-4 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#10B981]" />
                    <span className="text-xs text-[#6B7280]">Concluído</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-[#FB923C]" />
                    <span className="text-xs text-[#6B7280]">Hoje</span>
                  </div>
                </div>
              </div>
            )}

            {aba === "favoritos" && (
              <div>
                {favoritos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#FFF7ED] flex items-center justify-center mb-4">
                      <Heart className="w-8 h-8 text-[#FB923C]" />
                    </div>
                    <h3 className="font-semibold text-[#1F2937] mb-1">
                      Nenhum favorito ainda
                    </h3>
                    <p className="text-sm text-[#6B7280] max-w-xs">
                      Adicione orações e entradas do diário aos favoritos para vê-las aqui.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-[#6B7280] mb-4">
                      {favoritos.length} {favoritos.length === 1 ? "item favoritado" : "itens favoritados"}
                    </p>
                    {favoritos.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#F3F4F6] shadow-sm"
                      >
                        <Heart className="w-5 h-5 text-red-400 fill-current shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#1F2937] text-sm truncate">
                            {item.titulo}
                          </p>
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium shrink-0",
                          tipoCor(item.tipo)
                        )}>
                          {tipoLabel(item.tipo)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
