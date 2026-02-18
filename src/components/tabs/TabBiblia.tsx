"use client";

import { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { BookOpen, ChevronDown, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

const LIVROS_AT = ["Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio", "Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel"];
const LIVROS_NT = ["Mateus", "Marcos", "Lucas", "João", "Atos", "Romanos", "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios"];

export function TabBiblia() {
  const user = useUserStore((s) => s.user);
  const [testamento, setTestamento] = useState<"AT" | "NT">("AT");
  const livros = testamento === "AT" ? LIVROS_AT : LIVROS_NT;

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header: avatar + Bíblia NVI + ícone grupo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FB923C] flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#1F2937]">Bíblia</h1>
              <button className="flex items-center gap-1 text-[#1F2937] text-sm">
                NVI <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FB923C]/20 flex items-center justify-center">
            <span className="text-lg">👥</span>
          </div>
        </div>

        {/* Segmented: ANTIGO / NOVO TESTAMENTO */}
        <div className="flex rounded-xl overflow-hidden bg-white shadow-sm">
          <button
            onClick={() => setTestamento("AT")}
            className={cn(
              "flex-1 py-3 text-sm font-medium",
              testamento === "AT" ? "bg-[#1F2937] text-white" : "bg-white text-[#1F2937]"
            )}
          >
            ANTIGO TESTAMENTO
          </button>
          <button
            onClick={() => setTestamento("NT")}
            className={cn(
              "flex-1 py-3 text-sm font-medium",
              testamento === "NT" ? "bg-[#1F2937] text-white" : "bg-white text-[#1F2937]"
            )}
          >
            NOVO TESTAMENTO
          </button>
        </div>

        {/* Busca + bookmark */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Pesquisar na Bíblia"
            className="flex-1 px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1F2937] placeholder:text-[#9CA3AF] text-sm"
          />
          <button className="p-3 rounded-xl bg-white border border-[#E5E7EB]">
            <Bookmark className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Lista de livros */}
        <div className="space-y-2">
          {livros.map((livro) => (
            <div
              key={livro}
              className="bg-white rounded-2xl px-4 py-4 shadow-sm text-[#1F2937] font-medium"
            >
              {livro}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
