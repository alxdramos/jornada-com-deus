'use client';

import { motion } from 'framer-motion';
import { GamificationState } from '@/types/gamification';

interface TreeOfLifeProps {
  progress: GamificationState | null;
}

export function TreeOfLife({ progress }: TreeOfLifeProps) {
  if (!progress) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-b from-sky-100 to-green-100 rounded-lg">
        <p className="text-gray-500">Carregando árvore...</p>
      </div>
    );
  }

  const treeScale = (progress.level / 50) * 100;

  return (
    <motion.div
      className="w-full h-96 bg-gradient-to-b from-sky-100 to-green-100 rounded-lg flex items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg viewBox="0 0 400 600" className="w-full h-full">
        {/* RAÍZES */}
        <motion.path
          d="M200,600 Q180,550 170,500"
          stroke="#8B4513"
          strokeWidth={8 + (progress.streakDays / 30) * 4}
          fill="none"
          animate={{ strokeWidth: 8 + (progress.streakDays / 30) * 4 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d="M200,600 Q220,550 230,500"
          stroke="#8B4513"
          strokeWidth={8 + (progress.streakDays / 30) * 4}
          fill="none"
          animate={{ strokeWidth: 8 + (progress.streakDays / 30) * 4 }}
          transition={{ duration: 0.5 }}
        />

        {/* TRONCO */}
        <motion.rect
          x="185"
          y={400 - (200 * treeScale) / 100}
          width="30"
          height={200 * (treeScale / 100)}
          fill="#654321"
          animate={{ height: 200 * (treeScale / 100) }}
          transition={{ duration: 0.5 }}
        />

        {/* COPA - Triângulo */}
        <motion.polygon
          points={`200,${300 - (150 * treeScale) / 100} ${150 + (50 * treeScale) / 100},${350 - (50 * treeScale) / 100} ${250 - (50 * treeScale) / 100},${350 - (50 * treeScale) / 100}`}
          fill="#22c55e"
          animate={{
            fill: progress.stage === 'Frutífera' ? '#fbbf24' : '#22c55e',
          }}
          transition={{ duration: 0.5 }}
        />

        {/* FRUTOS - Badges */}
        {progress.badges.map((badge, idx) => (
          <motion.circle
            key={badge.id}
            cx={200 + Math.cos((idx * Math.PI) / 4) * 100}
            cy={250 + Math.sin((idx * Math.PI) / 4) * 100}
            r="12"
            fill="#fbbf24"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: idx * 0.1 }}
          />
        ))}
      </svg>

      {/* Texto com Nível */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <motion.div
            className="text-5xl font-bold text-green-700"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {progress.level}
          </motion.div>
          <p className="text-lg font-semibold text-green-600">{progress.stage}</p>
        </div>
      </div>
    </motion.div>
  );
}
