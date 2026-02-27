import { motion } from 'framer-motion';
import { BookOpen, Headphones, TreePine, PenLine } from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    title: 'Orações',
    desc: 'Momentos guiados de oração para cada dia',
  },
  {
    icon: Headphones,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    title: 'Meditações',
    desc: 'Áudio meditativo para renovar sua mente',
  },
  {
    icon: BookOpen,
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    title: 'Estudos Bíblicos',
    desc: 'Mergulhe na Palavra com profundidade',
  },
  {
    icon: TreePine,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    title: 'Jornada da Árvore',
    desc: 'Cultive seu crescimento espiritual dia a dia',
  },
  {
    icon: PenLine,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    title: 'Diário Espiritual',
    desc: 'Registre reflexões e destacados da Bíblia',
  },
];

export function SlideFeatures() {
  return (
    <div className="flex flex-col h-full px-6 pt-8 pb-4">
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-3xl mb-2">✨</p>
        <h2 className="text-2xl font-bold text-foreground mb-2">Tudo que você precisa</h2>
        <p className="text-sm text-muted-foreground">Ferramentas para nutrir sua fé todo dia</p>
      </motion.div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {FEATURES.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.title}
              className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${feat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{feat.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
