import { useState, useEffect } from "react";
import { FavoritoItem } from "@/data/calendario";

interface UseCalendarioFavoritosModalProps {
  isOpen: boolean;
}

export function useCalendarioFavoritosModal({
  isOpen
}: UseCalendarioFavoritosModalProps) {
  const [aba, setAba] = useState<"calendario" | "favoritos">("calendario");
  const [mesSelecionado, setMesSelecionado] = useState(new Date());
  const [favoritos, setFavoritos] = useState<FavoritoItem[]>([]);

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

  return {
    aba,
    setAba,
    mesSelecionado,
    favoritos,
    mudarMes,
    tipoCor,
    tipoLabel,
  };
}
