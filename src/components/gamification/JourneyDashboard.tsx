'use client';

import { useGamification } from '@/hooks/useGamification';
import { TreeOfLife } from './TreeOfLife';
import { motion } from 'framer-motion';

export function JourneyDashboard() {
  const { progress } = useGamification();

  if (!progress) {
    return (
      <div className="flex items-center justify-center h-96 bg-bg-primary rounded-lg">
        <p className="text-text-secondary">Carregando sua jornada...</p>
      </div>
    );
  }

  const nextLevelXP = (progress.level * 100);
  const currentLevelXP = ((progress.level - 1) * 100);
  const progressPercent = ((progress.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="space-y-6">
      {/* Header com Nível e Progresso */}
      <motion.div
        className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl font-bold">Nível {progress.level}</h2>
            <p className="text-xl opacity-90">{progress.stage}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">{progress.totalXP} XP</p>
            <p className="text-xs opacity-50">Próximo nível: {nextLevelXP} XP</p>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-yellow-300"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercent, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Árvore da Vida */}
      <TreeOfLife progress={progress} />

      {/* Estatísticas dos Ramos */}
      <div className="grid grid-cols-2 gap-4">
        <RamoBranchCard title="🙏 Orações" count={progress.branches.oracao} color="green" />
        <RamoBranchCard title="🧘 Meditações" count={progress.branches.meditacao} color="blue" />
        <RamoBranchCard title="📖 Bíblia" count={progress.branches.biblia} color="purple" />
        <RamoBranchCard title="📝 Reflexão" count={progress.branches.diario} color="orange" />
      </div>

      {/* Streak */}
      <motion.div
        className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-3xl font-bold text-red-500 mb-1">{progress.streakDays} 🔥</div>
        <p className="text-sm text-text-secondary">Dias de atividade</p>
      </motion.div>

      {/* Badges */}
      {progress.badges.length > 0 && (
        <motion.div
          className="bg-bg-secondary rounded-lg p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="font-bold text-text-primary mb-3">Badges Conquistadas ({progress.badges.length})</h3>
          <div className="grid grid-cols-4 gap-3">
            {progress.badges.map((badge) => (
              <motion.div
                key={badge.id}
                className="bg-yellow-500/20 rounded-lg p-3 text-center hover:bg-yellow-500/30 transition"
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className="text-xs font-semibold text-text-primary line-clamp-2">{badge.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface RamoBranchCardProps {
  title: string;
  count: number;
  color: string;
}

function RamoBranchCard({ title, count, color }: RamoBranchCardProps) {
  const colorClasses = {
    green: 'bg-green-500/10 border-green-500',
    blue: 'bg-blue-500/10 border-blue-500',
    purple: 'bg-purple-500/10 border-purple-500',
    orange: 'bg-orange-500/10 border-orange-500',
  }[color];

  return (
    <motion.div
      className={`${colorClasses} border rounded-lg p-4 text-center`}
      whileHover={{ scale: 1.05 }}
    >
      <p className="text-lg font-bold mb-1">{count}</p>
      <p className="text-sm text-text-secondary">{title}</p>
    </motion.div>
  );
}
