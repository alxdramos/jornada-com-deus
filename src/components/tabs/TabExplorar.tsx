"use client";

import { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIAS = ["MENTE", "MÚSICA", "ESTUDOS"];
const CHIPS = ["TUDO", "DORMIR", "ANSIEDADE", "<5MINS", "MOTIVAÇÃO"];

const cardsEscrituras = [
  { title: "Salmo 76", duration: "3 min", plus: false },
  { title: "Salmo 51", duration: "4 min", plus: true },
  { title: "Salmo 23", duration: "3 min", plus: false },
];

const cardsNovo = [
  { title: "O Crente é uma Exceção", duration: "3 min", plus: false },
  { title: "Uma Palavra Final", duration: "8 min", plus: true },
  { title: "Deus É Fiel", duration: "5 min", plus: false },
];

export function TabExplorar() {
  const user = useUserStore((s) => s.user);
  const [catAtiva, setCatAtiva] = useState("MENTE");
  const [chipAtivo, setChipAtivo] = useState("TUDO");

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header: avatar + Explorar + Favoritos */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FB923C] flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <h1 className="text-xl font-bold text-[#1F2937]">Explorar</h1>
          </div>
          <button className="flex items-center gap-1 text-[#FB923C]">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">Favoritos</span>
          </button>
        </div>

        {/* Abas de categoria */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              onClick={() => setCatAtiva(c)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap",
                catAtiva === c
                  ? "bg-[#1F2937] text-white"
                  : "bg-white text-[#1F2937] shadow-sm"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => setChipAtivo(c)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap",
                chipAtivo === c ? "bg-[#FB923C] text-white" : "bg-white/80 text-[#6B7280]"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Seção Escrituras */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#1F2937]">Escrituras</h2>
            <button className="text-sm text-[#FB923C] font-medium">VER TUDO &gt;</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {cardsEscrituras.map((card) => (
              <div
                key={card.title}
                className="min-w-[140px] bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="h-24 bg-gradient-to-br from-slate-200 to-slate-300" />
                <div className="p-3">
                  <p className="font-medium text-[#1F2937] text-sm">{card.title}</p>
                  <p className="text-xs text-[#6B7280]">{card.duration}</p>
                  {card.plus && (
                    <span className="inline-block w-4 h-4 rounded bg-gray-800 mt-1" title="Plus" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seção Tudo novo, de novo */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#1F2937]">Tudo novo, de novo</h2>
            <button className="text-sm text-[#FB923C] font-medium">VER TUDO &gt;</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {cardsNovo.map((card) => (
              <div
                key={card.title}
                className="min-w-[140px] bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="h-24 bg-gradient-to-br from-amber-100 to-orange-200" />
                <div className="p-3">
                  <p className="font-medium text-[#1F2937] text-sm">{card.title}</p>
                  <p className="text-xs text-[#6B7280]">{card.duration}</p>
                  {card.plus && (
                    <span className="inline-block w-4 h-4 rounded bg-gray-800 mt-1" title="Plus" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

