"use client";

import { motion } from "framer-motion";
import { useUserStore } from "@/stores/userStore";
import { Bird } from "lucide-react";

export function TabOracoes() {
  const user = useUserStore((s) => s.user);

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 pb-24 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FB923C] flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <h1 className="text-xl font-bold text-[#1F2937]">Orações</h1>
          </div>
        </div>

        {/* Pomba central (ícone Bird grande e sereno) */}
        <motion.div
          className="flex flex-col items-center justify-center flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center mb-8">
            <Bird
              className="w-16 h-16 text-[#FB923C]"
              strokeWidth={1.5}
            />
          </div>
          <p className="text-[#6B7280] text-center max-w-xs leading-relaxed">
            Conecte-se com Deus através da oração. Escolha uma oração rápida ou escreva a sua.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
