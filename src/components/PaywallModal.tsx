"use client";

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
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
  feature?: string;
}

const BENEFICIOS_PLUS = [
  {
    icon: Volume2,
    titulo: "Áudios de meditação exclusivos",
    descricao: "Mais de 50 meditações guiadas em português"
  },
  {
    icon: Moon,
    titulo: "Modo sono personalizado",
    descricao: "Meditações específicas para uma noite de descanso"
  },
  {
    icon: Heart,
    titulo: "Diário espiritual avançado",
    descricao: "Ferramentas de reflexão e acompanhamento de progresso"
  },
  {
    icon: BookOpen,
    titulo: "Biblioteca completa de estudos",
    descricao: "Acesso a todos os conteúdos premium da Bíblia"
  },
  {
    icon: Star,
    titulo: "Experiência sem anúncios",
    descricao: "Foco total na sua jornada espiritual"
  }
];

export function PaywallModal({ isOpen, onClose, onUpgrade, feature }: PaywallModalProps) {
  const handleUpgrade = () => {
    const checkoutUrl = process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_URL ?? 'https://hotmart.com/product/jornada-com-deus-plus';
    window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
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
            className="fixed inset-0 bg-black/60 z-[1000] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 flex items-center justify-center z-[1001] p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
              {/* Header com gradiente */}
              <div className="relative bg-gradient-to-br from-[#FB923C] via-[#F97316] to-[#EA580C] p-6 text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Jornada Plus</h2>
                    <p className="text-orange-100 text-sm">Desbloqueie sua experiência completa</p>
                  </div>
                </div>

                {feature && (
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="w-4 h-4" />
                      <span>Este conteúdo requer Jornada Plus</span>
                    </div>
                    <p className="text-orange-50 text-xs mt-1 opacity-90">
                      "{feature}" está disponível apenas para membros Plus
                    </p>
                  </div>
                )}
              </div>

              {/* Conteúdo */}
              <div className="p-6 space-y-6">
                {/* Preço */}
                <div className="text-center">
                  <div className="inline-flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#1F2937]">R$ 9,90</span>
                    <span className="text-sm text-[#6B7280]">/mês</span>
                  </div>
                  <p className="text-sm text-[#6B7280] mt-1">Cancela quando quiser</p>
                </div>

                {/* Benefícios */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#1F2937] text-center">O que você ganha:</h3>
                  {BENEFICIOS_PLUS.map((beneficio, index) => {
                    const Icon = beneficio.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-[#10B981]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#1F2937] text-sm">{beneficio.titulo}</p>
                          <p className="text-xs text-[#6B7280] mt-0.5">{beneficio.descricao}</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Botão de upgrade */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpgrade}
                  className={cn(
                    "w-full py-4 px-6 rounded-2xl font-semibold text-lg text-white",
                    "bg-gradient-to-r from-[#FB923C] to-[#F97316]",
                    "hover:opacity-95 active:scale-[0.98] transition-all",
                    "shadow-lg"
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="w-5 h-5" />
                    <span>Começar Jornada Plus</span>
                  </div>
                </motion.button>

                {/* Footer */}
                <div className="text-center space-y-2">
                  <p className="text-xs text-[#6B7280]">
                    Pagamento seguro • Suporte 24/7 • Satisfação garantida
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