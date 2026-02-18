"use client";

import { GamificationCard } from "@/components/GamificationCard";
import { AppButton } from "@/components/AppButton";
import { ProfileModal } from "@/components/ProfileModal";
import { useUserStore } from "@/stores/userStore";
import { useState } from "react";
import { User } from "lucide-react";

export function TabHoje() {
  const [profileOpen, setProfileOpen] = useState(false);
  const user = useUserStore((s) => s.user);

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header: avatar + título (Cresça com Deus) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setProfileOpen(true)}
            className="w-12 h-12 rounded-full bg-[#FB923C] flex items-center justify-center text-white font-bold text-lg shrink-0"
          >
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1F2937]">Cresça com Deus</h1>
            <button className="text-sm text-[#FB923C]">VER CALENDÁRIO & FAVORITOS</button>
          </div>
        </div>

        <GamificationCard />
      </div>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
