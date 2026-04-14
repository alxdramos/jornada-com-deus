"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  X,
  Crown,
  CheckCircle,
  Heart,
  Moon,
  Volume2,
  BookOpen,
  Lock,
  Sparkles,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
  feature?: string;
}

// ─── URLs Herospark ───────────────────────────────────────────────────────────
const CHECKOUT_URLS = {
  mensal:     "https://pay.herospark.com/assinatura-mensal-minha-jornada-diaria-516847",
  trimestral: "https://pay.herospark.com/trimestral-minha-jornada-diaria-516849",
  anual:      "https://pay.herospark.com/anual-sua-jornada-completa-na-fe-516850",
} as const;

// ─── Planos ───────────────────────────────────────────────────────────────────
const PLANOS = [
  {
    id: "mensal" as const,
    label: "Mensal",
    preco: "R$ 19,90",
    periodo: "/mês",
    detalhe: "Renovação mensal automática",
    badge: null,
    destaque: false,
  },
  {
    id: "trimestral" as const,
    label: "Trimestral",
    preco: "R$ 49,90",
    periodo: "/trim.",
    detalhe: "em até 3x · cobrado a cada 3 meses",
    badge: "Mais flexível",
    destaque: false,
  },
  {
    id: "anual" as const,
    label: "Anual",
    preco: "R$ 180,00",
    periodo: "/ano",
    detalhe: "em 12x · melhor custo-benefício",
    badge: "Melhor valor",
    destaque: true,
  },
] as const;

type PlanoId = (typeof PLANOS)[number]["id"];

// ─── Benefícios ───────────────────────────────────────────────────────────────
const BENEFICIOS = [
  { icon: Volume2, titulo: "Áudios narrados completos",     sub: "Meditações, orações e estudos com locução profissional" },
  { icon: Moon,    titulo: "Meditações exclusivas",         sub: "Biblioteca completa para cada momento do dia" },
  { icon: BookOpen,titulo: "Estudos bíblicos aprofundados", sub: "Séries temáticas para crescimento espiritual" },
  { icon: Heart,   titulo: "Diário espiritual avançado",    sub: "Reflexões guiadas e acompanhamento da jornada" },
  { icon: Star,    titulo: "Sem anúncios",                  sub: "Foco total na presença de Deus, sem distrações" },
];

// ─────────────────────────────────────────────────────────────────────────────

export function PaywallModal({ isOpen, onClose, onUpgrade, feature }: PaywallModalProps) {
  const [planoSelecionado, setPlanoSelecionado] = useState<PlanoId>("anual");
  const [checkoutOpened, setCheckoutOpened]     = useState(false);
  const [mounted, setMounted]                   = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { trackPaywallShown, trackPurchaseClicked } = useAnalytics();

  // Montar portal apenas no cliente (SSR-safe)
  useEffect(() => { setMounted(true); }, []);

  // Rastrear abertura
  useEffect(() => {
    if (isOpen) trackPaywallShown(feature);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Resetar estado ao fechar
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setCheckoutOpened(false), 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleUpgrade = () => {
    if (checkoutOpened) return;
    trackPurchaseClicked(planoSelecionado);
    setCheckoutOpened(true);
    window.open(CHECKOUT_URLS[planoSelecionado], "_blank", "noopener,noreferrer");
    onUpgrade?.();
  };

  const planoAtivo = PLANOS.find((p) => p.id === planoSelecionado)!;

  // Portal garante renderização direta no document.body,
  // escapando qualquer stacking context do Dialog/ProfileModal
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Overlay — z acima de tudo ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-[3px] z-[10050]"
            onClick={onClose}
          />

          {/* ── Bottom sheet ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", damping: 32, stiffness: 340 }
            }
            className="fixed bottom-0 left-0 right-0 z-[10051] flex flex-col bg-white rounded-t-[28px] overflow-hidden"
            style={{ maxHeight: "92dvh" }}
            role="dialog"
            aria-modal="true"
            aria-label="Assinar Jornada Plus"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-[#E5E7EB]" />
            </div>

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="relative bg-gradient-to-br from-[#78350F] via-[#B45309] to-[#F59E0B] px-6 pt-4 pb-5 flex-shrink-0">
              {/* Fechar */}
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="absolute top-3 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <div className="flex items-center gap-3">
                <motion.div
                  animate={prefersReducedMotion ? {} : { rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ duration: 1.4, delay: 0.5, repeat: Infinity, repeatDelay: 5 }}
                  className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0"
                >
                  <Crown className="w-6 h-6 text-yellow-300" />
                </motion.div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">Jornada Plus</h2>
                  <p className="text-amber-100 text-xs">Aprofunde sua fé, todos os dias</p>
                </div>
              </div>

              {/* Feature bloqueada */}
              {feature && (
                <div className="mt-4 bg-black/20 rounded-xl px-4 py-3 flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-amber-200 mt-0.5 flex-shrink-0" />
                  <p className="text-amber-50 text-xs leading-relaxed">
                    <span className="font-semibold">"{feature}"</span> está disponível apenas para membros Plus
                  </p>
                </div>
              )}
            </div>

            {/* ── Conteúdo com scroll ─────────────────────────────────────── */}
            <div className="overflow-y-auto overscroll-contain flex-1 min-h-0 px-5 pt-5 pb-6 space-y-5">

              {/* Seletor de planos */}
              <div>
                <p className="text-xs font-semibold text-[#9CA3AF] text-center uppercase tracking-wider mb-3">
                  Escolha seu plano
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {PLANOS.map((plano) => {
                    const ativo = planoSelecionado === plano.id;
                    return (
                      <button
                        key={plano.id}
                        onClick={() => setPlanoSelecionado(plano.id)}
                        className={cn(
                          "relative rounded-2xl border-2 p-3 text-left transition-all duration-200 active:scale-95",
                          ativo
                            ? "border-[#D97706] bg-amber-50 shadow-sm"
                            : "border-[#E5E7EB] bg-white hover:border-[#D97706]/40"
                        )}
                      >
                        {/* Badge */}
                        {plano.badge && (
                          <span className={cn(
                            "absolute -top-2.5 left-1/2 -translate-x-1/2 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap",
                            plano.destaque ? "bg-[#D97706]" : "bg-[#10B981]"
                          )}>
                            {plano.badge}
                          </span>
                        )}

                        <p className={cn(
                          "font-semibold text-[10px] mb-1",
                          ativo ? "text-[#B45309]" : "text-[#9CA3AF]"
                        )}>
                          {plano.label}
                        </p>
                        <p className={cn(
                          "font-bold text-[15px] leading-none",
                          ativo ? "text-[#92400E]" : "text-[#1F2937]"
                        )}>
                          {plano.preco}
                        </p>
                        <p className="text-[9px] text-[#9CA3AF] mt-0.5">{plano.periodo}</p>
                        <p className="text-[8px] text-[#9CA3AF] mt-1 leading-tight">{plano.detalhe}</p>

                        {/* Indicador selecionado */}
                        {ativo && (
                          <motion.span
                            layoutId="plano-check"
                            className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#D97706] flex items-center justify-center"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          >
                            <CheckCircle className="w-3 h-3 text-white" />
                          </motion.span>
                        )}
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Benefícios */}
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-[#9CA3AF] text-center uppercase tracking-wider">
                  O que você ganha
                </p>
                {BENEFICIOS.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <motion.div
                      key={b.titulo}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.28 }}
                      className="flex items-center gap-3 bg-[#FFFBEB] rounded-xl px-3 py-2.5"
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#D97706]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1F2937] text-[13px] leading-snug">{b.titulo}</p>
                        <p className="text-[11px] text-[#9CA3AF] mt-0.5 leading-snug">{b.sub}</p>
                      </div>
                      <CheckCircle className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                    </motion.div>
                  );
                })}
              </div>

            </div>

            {/* ── Rodapé fixo com CTA ─────────────────────────────────────── */}
            <div className="flex-shrink-0 px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] border-t border-[#F3F4F6] bg-white space-y-3">
              <motion.button
                whileHover={checkoutOpened ? {} : { scale: 1.015 }}
                whileTap={checkoutOpened ? {} : { scale: 0.975 }}
                onClick={handleUpgrade}
                disabled={checkoutOpened}
                aria-disabled={checkoutOpened}
                className={cn(
                  "w-full h-[54px] rounded-2xl font-bold text-base text-white",
                  "bg-gradient-to-r from-[#92400E] via-[#D97706] to-[#F59E0B]",
                  "shadow-[0_6px_24px_rgba(180,83,9,0.38)]",
                  "flex items-center justify-center gap-2 transition-opacity duration-200",
                  checkoutOpened && "opacity-60 cursor-not-allowed"
                )}
              >
                <Sparkles className="w-4 h-4 text-yellow-200 flex-shrink-0" />
                <span>
                  {checkoutOpened
                    ? "Checkout aberto…"
                    : `Assinar ${planoAtivo.label} · ${planoAtivo.preco}`}
                </span>
              </motion.button>

              <div className="flex items-center justify-center gap-4">
                <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1">
                  🔒 Pagamento seguro
                </span>
                <span className="text-[#E5E7EB]">·</span>
                <span className="text-[10px] text-[#9CA3AF]">7 dias de garantia</span>
                <span className="text-[#E5E7EB]">·</span>
                <span className="text-[10px] text-[#9CA3AF]">Cancele quando quiser</span>
              </div>

              <button
                onClick={onClose}
                className="w-full text-center text-sm text-[#9CA3AF] hover:text-[#6B7280] transition-colors py-1"
              >
                Talvez mais tarde
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
