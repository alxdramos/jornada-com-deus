"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Crown,
  CheckCircle,
  Star,
  Heart,
  Moon,
  Volume2,
  BookOpen,
  Lock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
  feature?: string;
}

// ─── Planos disponíveis ───────────────────────────────────────────────────
const PLANOS = [
  {
    id: "mensal" as const,
    label: "Mensal",
    preco: "R$ 19,90",
    periodo: "/mês",
    detalhe: "Renovação mensal automática",
    desconto: null,
    destaque: false,
    envKey: "NEXT_PUBLIC_HOTMART_CHECKOUT_MENSAL",
  },
  {
    id: "trimestral" as const,
    label: "Trimestral",
    preco: "R$ 16,63",
    periodo: "/mês",
    detalhe: "Cobrado R$ 49,90 a cada 3 meses",
    desconto: "16% off",
    destaque: true,
    envKey: "NEXT_PUBLIC_HOTMART_CHECKOUT_TRIMESTRAL",
  },
  {
    id: "anual" as const,
    label: "Anual",
    preco: "R$ 12,49",
    periodo: "/mês",
    detalhe: "Cobrado R$ 149,90 por ano",
    desconto: "37% off",
    destaque: false,
    envKey: "NEXT_PUBLIC_HOTMART_CHECKOUT_ANUAL",
  },
] as const;

type PlanoId = (typeof PLANOS)[number]["id"];

// Mapa de variáveis de ambiente dos checkouts
const CHECKOUT_URLS: Record<PlanoId, string | undefined> = {
  mensal: process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_MENSAL,
  trimestral: process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_TRIMESTRAL,
  anual: process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_ANUAL,
};

// ─── Benefícios ───────────────────────────────────────────────────────────
const BENEFICIOS_PREMIUM = [
  {
    icon: Volume2,
    titulo: "Áudios narrados exclusivos",
    descricao: "Meditações e devocionais narrados em português do Brasil",
  },
  {
    icon: Moon,
    titulo: "Meditações exclusivas",
    descricao: "Biblioteca completa com meditações para cada momento do dia",
  },
  {
    icon: BookOpen,
    titulo: "Estudos bíblicos completos",
    descricao: "Acesso a todos os estudos aprofundados da Palavra",
  },
  {
    icon: Heart,
    titulo: "Diário espiritual avançado",
    descricao: "Reflexões guiadas e acompanhamento da sua jornada",
  },
  {
    icon: Star,
    titulo: "Experiência sem anúncios",
    descricao: "Foco total na presença de Deus, sem distrações",
  },
];

export function PaywallModal({ isOpen, onClose, onUpgrade, feature }: PaywallModalProps) {
  const [planoSelecionado, setPlanoSelecionado] = useState<PlanoId>("trimestral");

  const handleUpgrade = () => {
    const url = CHECKOUT_URLS[planoSelecionado];
    if (!url) {
      console.warn("[PaywallModal] URL de checkout não configurada para o plano:", planoSelecionado);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    onUpgrade?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal — tela cheia */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-0 z-[9999] flex flex-col bg-white overflow-y-auto"
          >
            <div className="w-full max-w-lg mx-auto flex flex-col min-h-full">
              {/* Header com gradiente Premium */}
              <div className="relative bg-gradient-to-br from-[#92400E] via-[#B45309] to-[#D97706] p-6 text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                    transition={{ duration: 1.2, delay: 0.3, repeat: Infinity, repeatDelay: 4 }}
                    className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
                  >
                    <Crown className="w-6 h-6 text-yellow-300" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold">Jornada Premium</h2>
                    <p className="text-amber-100 text-sm">Desbloqueie sua experiência completa</p>
                  </div>
                </div>

                {feature && (
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="w-4 h-4" />
                      <span>Este conteúdo requer Jornada Premium</span>
                    </div>
                    <p className="text-amber-50 text-xs mt-1 opacity-90">
                      "{feature}" está disponível apenas para membros Premium
                    </p>
                  </div>
                )}
              </div>

              {/* Conteúdo */}
              <div className="p-6 space-y-5">
                {/* Seletor de planos */}
                <div>
                  <h3 className="font-semibold text-[#1F2937] text-center text-sm mb-3">
                    Escolha seu plano:
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {PLANOS.map((plano) => (
                      <button
                        key={plano.id}
                        onClick={() => setPlanoSelecionado(plano.id)}
                        className={cn(
                          "relative rounded-2xl border-2 p-3 text-left transition-all duration-200",
                          planoSelecionado === plano.id
                            ? "border-[#FB923C] bg-[#FB923C]/5"
                            : "border-[#E5E7EB] hover:border-[#FB923C]/50"
                        )}
                      >
                        {plano.desconto && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                            {plano.desconto}
                          </span>
                        )}
                        {plano.destaque && !plano.desconto && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#FB923C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                            Popular
                          </span>
                        )}
                        <p className="font-semibold text-xs text-[#6B7280] mb-1">{plano.label}</p>
                        <p className="font-bold text-[#1F2937] text-base leading-none">{plano.preco}</p>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">{plano.periodo}</p>
                      </button>
                    ))}
                  </div>

                  {/* Detalhe do plano selecionado */}
                  {(() => {
                    const plano = PLANOS.find((p) => p.id === planoSelecionado);
                    return plano ? (
                      <p className="text-center text-xs text-[#9CA3AF] mt-2">{plano.detalhe}</p>
                    ) : null;
                  })()}
                </div>

                {/* Benefícios */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-[#1F2937] text-center text-sm">O que você ganha:</h3>
                  {BENEFICIOS_PREMIUM.map((beneficio, index) => {
                    const Icon = beneficio.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.07 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-3.5 h-3.5 text-[#10B981]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#1F2937] text-sm">{beneficio.titulo}</p>
                          <p className="text-xs text-[#6B7280] mt-0.5">{beneficio.descricao}</p>
                        </div>
                        <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Botão de upgrade — gradiente Premium */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpgrade}
                  className={cn(
                    "w-full py-4 px-6 rounded-2xl font-semibold text-lg text-white",
                    "bg-gradient-to-r from-[#92400E] via-[#D97706] to-[#FB923C]",
                    "hover:opacity-95 active:scale-[0.98] transition-all",
                    "shadow-[0_4px_20px_rgba(180,83,9,0.4)]"
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-200" />
                    <span>Assinar Premium {PLANOS.find((p) => p.id === planoSelecionado)?.label}</span>
                  </div>
                </motion.button>

                {/* Footer */}
                <div className="text-center space-y-2">
                  <p className="text-xs text-[#6B7280]">
                    ✓ Pagamento seguro via Hotmart • ✓ Cancela quando quiser • ✓ 7 dias de garantia
                  </p>
                  <button
                    onClick={onClose}
                    className="text-sm text-[#6B7280] hover:text-[#1F2937] transition-colors"
                  >
                    Talvez mais tarde
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
