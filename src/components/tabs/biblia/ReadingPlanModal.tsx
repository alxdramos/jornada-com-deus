"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BookOpen,
  CheckCircle2,
  Circle,
  ChevronRight,
  Star,
  Flame,
  Trophy,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { useReadingPlanStore } from "@/stores/readingPlanStore";
import { READING_PLANS, getPlanById, ReadingPlan } from "@/data/planos-leitura";
import { cn } from "@/lib/utils";

interface ReadingPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReadChapter?: (bookId: string, bookName: string, chapter: number) => void;
}

type ModalView = "list" | "detail" | "active";

export function ReadingPlanModal({ isOpen, onClose, onReadChapter }: ReadingPlanModalProps) {
  const [view, setView] = useState<ModalView>("list");
  const [previewPlan, setPreviewPlan] = useState<ReadingPlan | null>(null);

  const activePlan     = useReadingPlanStore((s) => s.activePlan);
  const startPlan      = useReadingPlanStore((s) => s.startPlan);
  const abandonPlan    = useReadingPlanStore((s) => s.abandonPlan);
  const isChapterRead  = useReadingPlanStore((s) => s.isChapterRead);
  const markChapterRead= useReadingPlanStore((s) => s.markChapterRead);
  const getCurrentDay  = useReadingPlanStore((s) => s.getCurrentDay);
  const getTodayReadings = useReadingPlanStore((s) => s.getTodayReadings);
  const getTotalProgress = useReadingPlanStore((s) => s.getTotalProgress);

  const currentPlan   = activePlan ? getPlanById(activePlan.planId) : null;
  const currentDay    = getCurrentDay();
  const todayReadings = getTodayReadings();
  const progress      = getTotalProgress();

  // Qual view exibir de fato
  const effectiveView: ModalView = (() => {
    if (activePlan && view === "list") return "active";
    return view;
  })();

  function handleStartPlan(planId: string) {
    startPlan(planId);
    setView("active");
    setPreviewPlan(null);
  }

  function handleOpenChapter(bookId: string, bookName: string, chapter: number) {
    markChapterRead(bookId, chapter);
    if (onReadChapter) {
      onReadChapter(bookId, bookName, chapter);
    }
    onClose();
  }

  function handleAbandon() {
    if (confirm("Abandonar o plano atual? Seu progresso será perdido.")) {
      abandonPlan();
      setView("list");
    }
  }

  function goBack() {
    if (effectiveView === "active") {
      onClose();
      return;
    }
    setView("list");
    setPreviewPlan(null);
  }

  const showBack = effectiveView === "detail" || (effectiveView === "active" && !activePlan?.isCompleted);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl flex flex-col"
            style={{ height: "88dvh", maxHeight: "88dvh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header fixo */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6] flex-shrink-0">
              <div className="flex items-center gap-2">
                {effectiveView !== "list" && (
                  <button
                    onClick={goBack}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-600" />
                  </button>
                )}
                <h2 className="text-lg font-bold text-[#1F2937]">
                  {effectiveView === "list"   ? "Planos de Leitura" :
                   effectiveView === "detail" ? (previewPlan?.title ?? "") :
                                               (currentPlan?.title ?? "Plano Ativo")}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            {/* Corpo com scroll */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={effectiveView}
                  initial={{ opacity: 0, x: effectiveView === "list" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: effectiveView === "list" ? 20 : -20 }}
                  transition={{ duration: 0.18 }}
                >
                  {/* ── LISTA ── */}
                  {effectiveView === "list" && (
                    <div className="p-5 space-y-4 pb-24">
                      <p className="text-sm text-[#6B7280]">
                        Leia a Bíblia com consistência. Ganhe{" "}
                        <span className="font-semibold" style={{ color: "var(--color-primary, #006947)" }}>+25 XP</span> por capítulo lido.
                      </p>

                      {READING_PLANS.map((plan) => (
                        <button
                          key={plan.id}
                          onClick={() => { setPreviewPlan(plan); setView("detail"); }}
                          className="w-full p-4 rounded-2xl border border-[#E5E7EB] hover:border-gray-300 hover:shadow-md text-left transition-all group"
                        >
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl shadow group-hover:scale-105 transition-transform",
                              `bg-gradient-to-br ${plan.color}`
                            )}>
                              {plan.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-[#1F2937]">{plan.title}</h3>
                                <span
                                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                                  style={{ backgroundColor: plan.accentColor }}
                                >
                                  {plan.subtitle}
                                </span>
                              </div>
                              <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">
                                {plan.description}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                                  <BookOpen className="w-3 h-3" />
                                  {plan.days.reduce((s, d) => s + d.readings.length, 0)} cap.
                                </span>
                                <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--color-primary, #006947)" }}>
                                  <Zap className="w-3 h-3" />
                                  +{plan.xpPerChapter} XP/cap
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#D1D5DB] group-hover:text-gray-400 flex-shrink-0 mt-1" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ── DETALHE (preview) ── */}
                  {effectiveView === "detail" && previewPlan && (
                    <div className="p-5 space-y-5 pb-24">
                      {/* Hero */}
                      <div className={cn("rounded-2xl p-5 text-white bg-gradient-to-br", previewPlan.color)}>
                        <div className="text-4xl mb-3">{previewPlan.icon}</div>
                        <h3 className="text-xl font-bold">{previewPlan.title}</h3>
                        <p className="text-white/80 text-sm mt-1">{previewPlan.subtitle}</p>
                        <p className="text-white/90 text-sm mt-3 leading-relaxed">{previewPlan.description}</p>
                        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/20">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{previewPlan.duration}</p>
                            <p className="text-white/70 text-xs">dias</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{previewPlan.days.reduce((s, d) => s + d.readings.length, 0)}</p>
                            <p className="text-white/70 text-xs">capítulos</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">
                              {previewPlan.days.reduce((s, d) => s + d.readings.length, 0) * previewPlan.xpPerChapter}
                            </p>
                            <p className="text-white/70 text-xs">XP total</p>
                          </div>
                        </div>
                      </div>

                      {/* Primeiros dias */}
                      <div>
                        <h4 className="font-semibold text-[#374151] text-sm mb-3">Primeiros dias</h4>
                        <div className="space-y-2">
                          {previewPlan.days.slice(0, 5).map((day) => (
                            <div key={day.day} className="flex items-center gap-3 p-3 rounded-xl bg-[#F9FAFB]">
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                style={{ backgroundColor: previewPlan.accentColor }}
                              >
                                {day.day}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#374151] truncate">{day.title}</p>
                                <p className="text-xs text-[#9CA3AF]">
                                  {day.readings.map((r) => `${r.bookName} ${r.chapter}`).join(", ")}
                                </p>
                              </div>
                            </div>
                          ))}
                          {previewPlan.days.length > 5 && (
                            <p className="text-xs text-center text-[#9CA3AF] py-1">
                              + {previewPlan.days.length - 5} dias restantes
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartPlan(previewPlan.id)}
                        className={cn(
                          "w-full py-4 rounded-2xl text-white font-bold text-base bg-gradient-to-r shadow-lg active:scale-[0.98] transition-transform",
                          previewPlan.color
                        )}
                      >
                        Começar Agora
                      </button>
                    </div>
                  )}

                  {/* ── PLANO ATIVO ── */}
                  {effectiveView === "active" && currentPlan && activePlan && (
                    <div className="p-5 space-y-5 pb-24">
                      {/* Progresso geral */}
                      <div className={cn("rounded-2xl p-4 text-white bg-gradient-to-br", currentPlan.color)}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-white/70 text-xs">Dia atual</p>
                            <p className="text-3xl font-bold">{currentDay} <span className="text-lg font-normal text-white/70">/ {currentPlan.duration}</span></p>
                          </div>
                          <div className="text-right">
                            <p className="text-white/70 text-xs">XP ganho</p>
                            <p className="text-2xl font-bold flex items-center gap-1 justify-end">
                              <Zap className="w-5 h-5" />{activePlan.totalXpEarned}
                            </p>
                          </div>
                        </div>
                        <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-white/70 transition-all duration-500"
                            style={{ width: `${(progress.completedDays / currentPlan.duration) * 100}%` }}
                          />
                        </div>
                        <p className="text-white/60 text-xs mt-1.5 text-right">
                          {progress.completedChapters} de {progress.totalChapters} cap. lidos
                        </p>
                      </div>

                      {/* Leitura de hoje */}
                      {todayReadings && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <h4 className="font-semibold text-[#374151] text-sm">
                              Hoje — {todayReadings.title}
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {todayReadings.readings.map((reading) => {
                              const read = isChapterRead(reading.bookId, reading.chapter);
                              return (
                                <button
                                  key={`${reading.bookId}-${reading.chapter}`}
                                  onClick={() => handleOpenChapter(reading.bookId, reading.bookName, reading.chapter)}
                                  className={cn(
                                    "w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left active:scale-[0.98]",
                                    read
                                      ? "bg-emerald-50 border-emerald-200"
                                      : "bg-white border-[#E5E7EB] hover:border-gray-300"
                                  )}
                                >
                                  {read
                                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                    : <Circle className="w-5 h-5 text-[#D1D5DB] flex-shrink-0" />
                                  }
                                  <div className="flex-1">
                                    <p className={cn(
                                      "font-medium text-sm",
                                      read ? "text-emerald-700 line-through" : "text-[#374151]"
                                    )}>
                                      {reading.bookName} {reading.chapter}
                                    </p>
                                    {!read && (
                                      <p className="text-xs text-[#9CA3AF] mt-0.5 flex items-center gap-1">
                                        <Zap className="w-2.5 h-2.5" style={{ color: "#006947" }} />
                                        +{currentPlan.xpPerChapter} XP ao ler
                                      </p>
                                    )}
                                  </div>
                                  {read
                                    ? <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                    : <ChevronRight className="w-4 h-4 text-[#D1D5DB] flex-shrink-0" />
                                  }
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {activePlan.isCompleted && (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                          <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                          <p className="font-bold text-[#1F2937]">Plano Concluído! 🎉</p>
                          <p className="text-sm text-[#6B7280] mt-1">
                            Parabéns! Você completou o {currentPlan.title}.
                          </p>
                        </div>
                      )}

                      {/* Ação */}
                      <div className="pb-2">
                        {activePlan.isCompleted ? (
                          <button
                            onClick={() => { abandonPlan(); setView("list"); }}
                            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors"
                          style={{ backgroundColor: "var(--color-primary, #006947)" }}
                          >
                            Iniciar novo plano
                          </button>
                        ) : (
                          <button
                            onClick={handleAbandon}
                            className="w-full py-3 rounded-xl border border-red-200 text-red-500 font-medium text-sm hover:bg-red-50 transition-colors"
                          >
                            Abandonar plano
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
