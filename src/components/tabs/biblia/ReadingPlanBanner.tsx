"use client";

import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Flame, Star } from "lucide-react";
import { useReadingPlanStore } from "@/stores/readingPlanStore";
import { getPlanById } from "@/data/planos-leitura";
import { cn } from "@/lib/utils";

interface ReadingPlanBannerProps {
  onOpenPlan: () => void;
}

export function ReadingPlanBanner({ onOpenPlan }: ReadingPlanBannerProps) {
  const activePlan = useReadingPlanStore((s) => s.activePlan);
  const getCurrentDay = useReadingPlanStore((s) => s.getCurrentDay);
  const getDayProgress = useReadingPlanStore((s) => s.getDayProgress);
  const getTodayReadings = useReadingPlanStore((s) => s.getTodayReadings);

  const plan = activePlan ? getPlanById(activePlan.planId) : null;

  // — Sem plano ativo: card convite —
  if (!activePlan || !plan) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onOpenPlan}
        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-400 transition-all text-left group"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#1F2937] text-sm">Planos de Leitura</p>
          <p className="text-xs text-[#6B7280] mt-0.5">21, 30 ou 90 dias · +25 XP por capítulo</p>
        </div>
        <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-amber-500 transition-colors flex-shrink-0" />
      </motion.button>
    );
  }

  // — Plano ativo: progresso do dia —
  const currentDay = getCurrentDay();
  const { completed, total } = getDayProgress();
  const todayReadings = getTodayReadings();
  const allDoneToday = completed === total && total > 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onOpenPlan}
      className={cn(
        "w-full p-4 rounded-2xl border transition-all text-left group",
        allDoneToday
          ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-400"
          : "bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 hover:border-violet-400"
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform text-lg",
          `bg-gradient-to-br ${plan.color}`
        )}>
          {plan.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-[#1F2937] text-sm truncate">{plan.title}</p>
            {allDoneToday && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold">
                <Star className="w-2.5 h-2.5" /> Feito!
              </span>
            )}
          </div>
          <p className="text-xs text-[#6B7280]">Dia {currentDay} de {plan.duration}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-violet-500 transition-colors flex-shrink-0" />
      </div>

      {/* Barra de progresso do dia */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#6B7280]">
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-500" />
            {todayReadings?.title ?? "Hoje"}
          </span>
          <span className="font-medium" style={{ color: plan.accentColor }}>
            {completed}/{total} cap.
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${plan.color}`}
            initial={{ width: 0 }}
            animate={{ width: total > 0 ? `${(completed / total) * 100}%` : "0%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.button>
  );
}
