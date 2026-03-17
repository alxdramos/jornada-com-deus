"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ConfettiCanvas } from "./ConfettiCanvas";

interface DayCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  xpGained: number;
  newStreak: number;
  newLevel: number;
  previousLevel: number;
}

export function DayCompletionModal({
  isOpen,
  onClose,
  xpGained,
  newStreak,
  newLevel,
  previousLevel,
}: DayCompletionModalProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, onClose]);

  const leveledUp = newLevel > previousLevel;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti on top of everything */}
          <ConfettiCanvas />

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10002]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[10002] flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl pointer-events-auto"
              style={{
                background: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)",
              }}
            >
              <div className="p-8 flex flex-col items-center gap-4 text-center">
                {/* Emoji animado */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ delay: 0.2, duration: 0.5, times: [0, 0.6, 1] }}
                  className="text-6xl"
                  role="img"
                  aria-label="Estrela"
                >
                  🌟
                </motion.div>

                {/* Título */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white"
                >
                  Dia Concluído!
                </motion.h2>

                {/* Subtítulo */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/80 text-sm"
                >
                  Você completou sua jornada de hoje
                </motion.p>

                {/* Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap items-center justify-center gap-3"
                >
                  {/* XP Badge */}
                  <span className="bg-amber-400 text-black font-bold rounded-full px-4 py-1 text-sm">
                    +{xpGained} XP
                  </span>

                  {/* Streak Badge */}
                  <span className="text-white font-semibold text-sm">
                    🔥 {newStreak} {newStreak === 1 ? "dia seguido" : "dias seguidos"}!
                  </span>
                </motion.div>

                {/* Level Up Badge (condicional) */}
                {leveledUp && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.65, type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <span className="bg-violet-300 text-violet-900 font-bold rounded-full px-4 py-1 text-sm">
                      Nível {newLevel}! ⭐
                    </span>
                  </motion.div>
                )}

                {/* Botão Continuar */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  onClick={onClose}
                  className="mt-2 w-full bg-white text-violet-700 font-bold rounded-2xl py-3 px-6 text-base active:scale-[0.97] transition-transform"
                >
                  Continuar
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
