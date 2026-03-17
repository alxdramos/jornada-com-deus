"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { ConfettiCanvas } from "./ConfettiCanvas";

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  treeStageName?: string;
}

const MILESTONE_MESSAGES: Record<number, string> = {
  1: "Sua fé deu os primeiros passos. Continue assim!",
  2: "Você está crescendo espiritualmente. Cada dia conta!",
  3: "Sua dedicação é inspiradora. A árvore floresce!",
  4: "Metade do caminho! Sua perseverança é admirável.",
  5: "Você alcançou o equilíbrio. A fé move montanhas!",
  6: "Sua raiz é profunda. Nada pode abalar sua fé!",
  7: "Quase no topo! Você é um exemplo de fidelidade.",
  8: "A sabedoria floresce com a constância. Parabéns!",
  9: "Um passo do ápice! Você é uma luz para o mundo.",
  10: "NÍVEL MÁXIMO! Você completou sua Jornada com Deus!",
};

const DEFAULT_MESSAGE = "Cada passo nessa jornada transforma seu coração!";

const STARS = ["★", "★", "★"];

export function MilestoneModal({
  isOpen,
  onClose,
  newLevel,
  treeStageName,
}: MilestoneModalProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, 8000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, onClose]);

  const message = MILESTONE_MESSAGES[newLevel] ?? DEFAULT_MESSAGE;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti */}
          <ConfettiCanvas />

          {/* Fullscreen overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[10004] flex flex-col items-center justify-center overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, #1E0A3C 0%, #4C1D95 50%, #7C3AED 100%)",
            }}
            onClick={onClose}
          >
            {/* Animated glow */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                background: [
                  "radial-gradient(ellipse at center, rgba(124,58,237,0.4) 0%, transparent 70%)",
                  "radial-gradient(ellipse at center, rgba(202,138,4,0.3) 0%, transparent 70%)",
                  "radial-gradient(ellipse at center, rgba(124,58,237,0.4) 0%, transparent 70%)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-5 px-8 text-center">
              {/* Trophy */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: [0, 1.2, 1], rotate: [- 20, 10, 0] }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                >
                  <Trophy
                    className="text-amber-400"
                    style={{ width: 80, height: 80 }}
                    strokeWidth={1.5}
                  />
                </motion.div>
              </motion.div>

              {/* Level text */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 18 }}
                className="text-6xl font-black text-white tracking-wider"
              >
                NÍVEL {newLevel}
              </motion.h1>

              {/* Stars */}
              <motion.div className="flex items-center gap-2">
                {STARS.map((star, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.55 + i * 0.12, type: "spring", stiffness: 300, damping: 20 }}
                    className="text-amber-400 text-3xl"
                  >
                    {star}
                  </motion.span>
                ))}
              </motion.div>

              {/* Tree stage name */}
              {treeStageName && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-white/80 text-base font-medium"
                >
                  Sua Árvore evoluiu para{" "}
                  <span className="text-white font-bold">{treeStageName}</span>!
                </motion.p>
              )}

              {/* Motivational message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95 }}
                className="text-white/70 text-sm leading-relaxed max-w-xs"
              >
                {message}
              </motion.p>

              {/* CTA button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="mt-4 bg-amber-400 text-black font-bold rounded-full px-8 py-3 text-base active:scale-[0.97] transition-transform shadow-lg"
              >
                Incrível!
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
