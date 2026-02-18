"use client";

import { useUserStore } from "@/stores/userStore";
import { motion } from "framer-motion";
import { PenLine } from "lucide-react";

export function TabDiario() {
  const user = useUserStore((s) => s.user);

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header: avatar + Diário + ícone */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FB923C] flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <h1 className="text-xl font-bold text-[#1F2937]">Diário</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center">
            <span className="text-lg">👥</span>
          </div>
        </div>

        {/* Abas: Tudo, Destaques, Anotações, Citações */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["Tudo", "Destaques", "Anotações", "Citações"].map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap ${
                i === 0 ? "bg-[#E5E7EB] text-[#1F2937]" : "bg-transparent text-[#6B7280]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Ilustração: livro com estrelas */}
        <motion.div
          className="flex flex-col items-center justify-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative w-48 h-40 flex items-center justify-center">
            {/* Livro aberto (SVG simplificado) */}
            <svg
              viewBox="0 0 120 80"
              className="w-full h-full text-[#1F2937]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10 L20 70 L60 70 L60 10 Z" />
              <path d="M60 10 L60 70 L100 70 L100 10 Z" />
              <path d="M60 10 L60 70" />
              {/* Estrelas sobre o livro */}
              <path d="M35 35 L37 42 L44 42 L38 47 L40 54 L35 50 L30 54 L32 47 L26 42 L33 42 Z" fill="currentColor" stroke="none" />
              <path d="M85 38 L86.5 43 L92 43 L87.5 46.5 L89 52 L85 49 L81 52 L82.5 46.5 L78 43 L83.5 43 Z" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <p className="text-[#6B7280] text-center max-w-sm mt-6 leading-relaxed">
            Uma coleção dos seus destaques diários, versículos favoritos e anotações pessoais.
          </p>
        </motion.div>

        {/* FAB: botão de adicionar (pena) */}
        <motion.button
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#3B82F6] text-white shadow-lg flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PenLine className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}
