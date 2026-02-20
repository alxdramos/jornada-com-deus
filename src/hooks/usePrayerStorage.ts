import { useState, useEffect } from "react";
import { Prayer, PRAYERS_PREDEFINIDAS } from "@/data/oracoes";

export function usePrayerStorage() {
  const [prayers, setPrayers] = useState<Prayer[]>(PRAYERS_PREDEFINIDAS);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Carregar orações e favoritos do localStorage
  useEffect(() => {
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
