"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "@/stores/userStore";
import { UserHeader } from "@/components/layout/UserHeader";
import { Bird, Plus } from "lucide-react";
import { Prayer } from "@/data/oracoes";
import { usePrayerStorage } from "@/hooks/usePrayerStorage";

// Sub-componentes
import { PrayerFilters } from "./oracoes/PrayerFilters";
import { PrayerCard } from "./oracoes/PrayerCard";
import { PrayerCreateModal } from "./oracoes/PrayerCreateModal";
import { PrayerDetailModal } from "./oracoes/PrayerDetailModal";

export function TabOracoes() {
  const user = useUserStore((s) => s.user);
  const { prayers, favorites, createPrayer, deletePrayer, toggleFavorite } = usePrayerStorage();

  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPrayerDetail, setShowPrayerDetail] = useState<Prayer | null>(null);

  const filteredPrayers = prayers.filter(prayer => {
    if (categoriaAtiva === "Todas") return true;
    if (categoriaAtiva === "Minhas") return prayer.isCustom;
    return prayer.category === categoriaAtiva;
  });

  return (
    <>
      <div className="min-h-screen bg-[#FAF9F6] p-6 pb-28">
        <div className="max-w-4xl mx-auto space-y-6">
          <UserHeader
            title="Orações"
            rightElement={
              <div className="w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                <Bird className="w-5 h-5 text-[#10B981]" />
              </div>
            }
          />

          <PrayerFilters
            categoriaAtiva={categoriaAtiva}
            onSelectCategory={setCategoriaAtiva}
          />

          <div className="space-y-4">
            {filteredPrayers.map((prayer) => (
              <PrayerCard
                key={prayer.id}
                prayer={prayer}
                isFavorite={favorites.has(prayer.id)}
                onToggleFavorite={toggleFavorite}
                onViewDetails={setShowPrayerDetail}
              />
            ))}
          </div>

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

      <PrayerCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreatePrayer={createPrayer}
      />

      <PrayerDetailModal
        prayer={showPrayerDetail}
        isFavorite={showPrayerDetail ? favorites.has(showPrayerDetail.id) : false}
        onClose={() => setShowPrayerDetail(null)}
        onToggleFavorite={toggleFavorite}
        onDeletePrayer={deletePrayer}
      />
    </>
  );
}
