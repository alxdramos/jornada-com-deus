import { useState, useEffect } from "react";
import { Prayer, PRAYERS_PREDEFINIDAS, ORACOES } from "@/data/oracoes";

export function usePrayerStorage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);

  // Carregar orações e favoritos do localStorage
  useEffect(() => {
    // Garantir que orações predefinidas sejam carregadas
    // Se PRAYERS_PREDEFINIDAS vazio, converter ORACOES diretamente
    let predefinidas = PRAYERS_PREDEFINIDAS.length > 0 ? PRAYERS_PREDEFINIDAS : [];

    if (predefinidas.length === 0 && ORACOES.length > 0) {
      // Fallback: converter ORACOES para Prayer se necessário
      const temaParaCategoria: Record<string, string> = {
        "esperanca": "Esperança",
        "paz": "Paz",
        "gracas": "Graças",
        "perdao": "Perdão",
        "forca": "Força",
        "fe": "Fé",
        "default": "Graças"
      };

      predefinidas = ORACOES.map((oracao) => {
        const tema = oracao.theme?.toLowerCase() || "default";
        const categoria = temaParaCategoria[tema] || "Graças";

        return {
          id: oracao.id,
          title: oracao.titulo,
          content: oracao.texto,
          category: categoria,
          isCustom: false,
          createdAt: new Date(oracao.createdAt),
          audioUrl: oracao.audioUrl,
          imagem: oracao.imagem
        };
      });
    }

    const savedPrayers = localStorage.getItem('custom-prayers');
    const savedFavorites = localStorage.getItem('prayer-favorites');

    try {
      if (savedPrayers) {
        type StoredPrayer = Omit<Prayer, 'createdAt'> & { createdAt: string };
        const parsed = JSON.parse(savedPrayers) as StoredPrayer[];
        const customPrayers = parsed.map((p) => ({
          ...p,
          createdAt: new Date(p.createdAt)
        }));
        setPrayers([...predefinidas, ...customPrayers]);
      } else {
        setPrayers(predefinidas);
      }
    } catch (error) {
      console.error('Erro ao carregar orações salvas:', error);
      setPrayers(predefinidas);
    }

    if (savedFavorites) {
      try {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      } catch (error) {
        console.error('Erro ao carregar favoritos das orações:', error);
      }
    }

    setInitialized(true);
    console.log('✅ usePrayerStorage inicializado com', predefinidas.length, 'orações predefinidas');
  }, []);

  const createPrayer = (title: string, content: string, category: string) => {
    if (!title.trim() || !content.trim()) return;

    const newPrayer: Prayer = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category,
      isCustom: true,
      createdAt: new Date()
    };

    const updatedPrayers = [...prayers, newPrayer];
    setPrayers(updatedPrayers);

    const customPrayers = updatedPrayers.filter(p => p.isCustom);
    localStorage.setItem('custom-prayers', JSON.stringify(customPrayers));
  };

  const deletePrayer = (prayerId: string) => {
    const updatedPrayers = prayers.filter(p => p.id !== prayerId);
    setPrayers(updatedPrayers);

    const customPrayers = updatedPrayers.filter(p => p.isCustom);
    localStorage.setItem('custom-prayers', JSON.stringify(customPrayers));

    if (favorites.has(prayerId)) {
      const newFavorites = new Set(favorites);
      newFavorites.delete(prayerId);
      setFavorites(newFavorites);
      localStorage.setItem('prayer-favorites', JSON.stringify([...newFavorites]));
    }
  };

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

  return {
    prayers,
    favorites,
    createPrayer,
    deletePrayer,
    toggleFavorite
  };
}
