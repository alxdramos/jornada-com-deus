"use client";

import { motion, AnimatePresence } from "framer-motion";

export interface TreeStage {
  level: number;
  name: string;
  description: string;
  visual: string; // SVG/emoji representation
  bgFrom: string;
  bgTo: string;
  daysRequired: number;
}

export const TREE_STAGES: TreeStage[] = [
  {
    level: 0,
    name: "Semente",
    description: "Sua jornada começa aqui",
    visual: "🌰",
    bgFrom: "#78350F",
    bgTo: "#92400E",
    daysRequired: 0,
  },
  {
    level: 1,
    name: "Broto",
    description: "Primeiros passos na fé",
    visual: "🌱",
    bgFrom: "#14532D",
    bgTo: "#166534",
    daysRequired: 5,
  },
  {
    level: 2,
    name: "Muda",
    description: "Raízes se aprofundando",
    visual: "🌿",
    bgFrom: "#15803D",
    bgTo: "#16A34A",
    daysRequired: 10,
  },
  {
    level: 3,
    name: "Planta Jovem",
    description: "Crescendo com constância",
    visual: "🪴",
    bgFrom: "#065F46",
    bgTo: "#047857",
    daysRequired: 15,
  },
  {
    level: 4,
    name: "Árvore Jovem",
    description: "Fé florescendo",
    visual: "🌲",
    bgFrom: "#166534",
    bgTo: "#15803D",
    daysRequired: 20,
  },
  {
    level: 5,
    name: "Árvore Adulta",
    description: "Plantado em Cristo",
    visual: "🌳",
    bgFrom: "#14532D",
    bgTo: "#166534",
    daysRequired: 25,
  },
  {
    level: 6,
    name: "Bananeira Jovem",
    description: "Primeiros frutos aparecem",
    visual: "🌴",
    bgFrom: "#365314",
    bgTo: "#3F6212",
    daysRequired: 30,
  },
  {
    level: 7,
    name: "Bananeira Florida",
    description: "Floração em abundância",
    visual: "🌸🌴",
    bgFrom: "#713F12",
    bgTo: "#92400E",
    daysRequired: 35,
  },
  {
    level: 8,
    name: "Primeiros Cachos",
    description: "Frutos da perseverança",
    visual: "🌴🍌",
    bgFrom: "#92400E",
    bgTo: "#B45309",
    daysRequired: 40,
  },
  {
    level: 9,
    name: "Bananeira Plena",
    description: "Colheita de frutos espirituais",
    visual: "🍌🌴",
    bgFrom: "#B45309",
    bgTo: "#D97706",
    daysRequired: 45,
  },
  {
    level: 10,
    name: "Bananeira Gloriosa",
    description: "50 dias! Jornada completa! 🎉",
    visual: "✨🍌✨",
    bgFrom: "#D97706",
    bgTo: "#FBBF24",
    daysRequired: 50,
  },
];

interface TreeGrowthVisualProps {
  treeLevel: number; // 0-10
  completedDays: number;
  treeProgress: number; // 0-100
  compact?: boolean; // versão compacta para o card
}

export function TreeGrowthVisual({
  treeLevel,
  completedDays,
  treeProgress,
  compact = false,
}: TreeGrowthVisualProps) {
  const stage = TREE_STAGES[Math.min(treeLevel, 10)];
  const nextStage = treeLevel < 10 ? TREE_STAGES[treeLevel + 1] : null;
  const daysToNext = nextStage ? nextStage.daysRequired - completedDays : 0;

  if (compact) {
    return (
      <div className="space-y-3">
        {/* Stage indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={treeLevel}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={compact ? "text-2xl" : "text-4xl"}
              >
                {stage.visual}
              </motion.span>
            </AnimatePresence>
            <div>
              <div className="font-semibold text-sm text-text-primary">{stage.name}</div>
              <div className="text-xs text-muted-foreground">{stage.description}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-green-600">{treeLevel}/10</div>
            <div className="text-xs text-muted-foreground">{completedDays} dias</div>
          </div>
        </div>

        {/* Progress bar */}
        {treeLevel < 10 && (
          <div className="space-y-1">
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(to right, ${stage.bgFrom}, ${stage.bgTo})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(treeProgress, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {daysToNext > 0
                ? `${daysToNext} dias para ${nextStage?.name}`
                : nextStage
                ? `Pronto para evoluir para ${nextStage.name}!`
                : "Árvore completa!"}
            </div>
          </div>
        )}

        {treeLevel === 10 && (
          <div className="text-center text-sm font-semibold text-yellow-600">
            🎉 Jornada completa! Bananeira Gloriosa!
          </div>
        )}
      </div>
    );
  }

  // Versão expandida (JourneyDetailsModal)
  return (
    <div className="space-y-6">
      {/* Visual central da árvore */}
      <div
        className="relative rounded-3xl p-8 flex flex-col items-center justify-center gap-4 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${stage.bgFrom}22, ${stage.bgTo}33)`,
          border: `1px solid ${stage.bgFrom}44`,
        }}
      >
        {/* Estágios pequenos no fundo */}
        <div className="absolute top-3 left-3 right-3 flex justify-between opacity-30">
          {TREE_STAGES.map((s) => (
            <span
              key={s.level}
              className={`text-xs ${s.level <= treeLevel ? "opacity-100" : "opacity-30"}`}
            >
              {s.level <= treeLevel ? "●" : "○"}
            </span>
          ))}
        </div>

        {/* Emoji principal */}
        <AnimatePresence mode="wait">
          <motion.div
            key={treeLevel}
            initial={{ scale: 0, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -30 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-7xl"
          >
            {stage.visual}
          </motion.div>
        </AnimatePresence>

        <div className="text-center">
          <h3 className="text-xl font-bold text-text-primary">{stage.name}</h3>
          <p className="text-sm text-text-secondary mt-1">{stage.description}</p>
        </div>

        {/* Badge de nível */}
        <div
          className="px-4 py-1.5 rounded-full text-white text-sm font-semibold"
          style={{ background: `linear-gradient(to right, ${stage.bgFrom}, ${stage.bgTo})` }}
        >
          Nível {treeLevel} / 10
        </div>
      </div>

      {/* Barra de progresso para o próximo nível */}
      {treeLevel < 10 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">
              {stage.visual} {stage.name}
            </span>
            <span className="text-text-secondary">
              {nextStage?.visual} {nextStage?.name}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(to right, ${stage.bgFrom}, ${nextStage?.bgTo ?? stage.bgTo})`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(treeProgress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            />
          </div>
          <p className="text-xs text-text-secondary text-center">
            {completedDays} dias completados •{" "}
            {daysToNext > 0
              ? `${daysToNext} dias para o próximo estágio`
              : `Pronto para evoluir!`}
          </p>
        </div>
      )}

      {/* Timeline de todos os estágios */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Jornada da Árvore
        </h4>
        <div className="grid grid-cols-1 gap-1.5">
          {TREE_STAGES.map((s) => {
            const isUnlocked = s.level <= treeLevel;
            const isCurrent = s.level === treeLevel;
            return (
              <div
                key={s.level}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  isCurrent
                    ? "bg-green-50 border border-green-200"
                    : isUnlocked
                    ? "bg-gray-50"
                    : "opacity-40"
                }`}
              >
                <span className="text-lg w-8 text-center">{s.visual}</span>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs font-semibold ${
                      isCurrent ? "text-green-700" : "text-text-primary"
                    }`}
                  >
                    {s.name}
                    {isCurrent && (
                      <span className="ml-2 text-green-600 text-xs">← atual</span>
                    )}
                  </div>
                  <div className="text-xs text-text-secondary">{s.daysRequired} dias</div>
                </div>
                {isUnlocked && (
                  <span className="text-green-500 text-sm shrink-0">✓</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
