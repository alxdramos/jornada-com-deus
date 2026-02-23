'use client';

import { motion, type Variants } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { HeartCrack, BookOpen, TreeDeciduous, Leaf } from 'lucide-react';

const cards = [
  {
    icon: HeartCrack,
    tag: 'O Problema',
    title: 'Dias corridos, distância de Deus',
    description:
      'A vida agitada consome nosso tempo e nos afasta do que realmente importa. Falta constância, falta método, falta um lugar tranquilo para encontrar a Deus.',
    accent: '#C98989',
    pale:   '#FDF2F2',
  },
  {
    icon: BookOpen,
    tag: 'A Solução',
    title: 'Devocional diário simples e bonito',
    description:
      'Versículo do dia, reflexão guiada e meditações em áudio — tudo num só lugar. Poucos minutos que transformam a manhã inteira.',
    accent: '#FB923C',
    pale:   '#FEF3E2',
  },
  {
    icon: TreeDeciduous,
    tag: 'O Crescimento',
    title: 'Hábitos que florescem',
    description:
      'Streaks de sequência, Árvore da Vida que cresce com você, XP espiritual e missões diárias. A gamificação a serviço da fé.',
    accent: '#10B981',
    pale:   '#ECFDF5',
  },
  {
    icon: Leaf,
    tag: 'O Resultado',
    title: 'Paz, intimidade e transformação real',
    description:
      'Após semanas de jornada, os usuários relatam menos ansiedade, mais foco e uma sensação genuína de intimidade com Deus.',
    accent: '#3FDFB8',
    pale:   '#F0FDF9',
  },
];

const containerVariants: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0 },
};

export function ProblemSolutionSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="jornada" className="py-20 sm:py-28 bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14" ref={ref}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-xs font-semibold tracking-widest text-[#10B981] uppercase"
          >
            A jornada de transformação
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-3 text-3xl sm:text-4xl font-bold text-[#1F2937]"
          >
            Do problema à paz em 4 passos
          </motion.h2>
        </div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.tag}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Número + ícone */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: card.pale }}
                  >
                    <Icon size={20} style={{ color: card.accent }} />
                  </div>
                  <span
                    className="text-3xl font-black opacity-10"
                    style={{ color: card.accent }}
                  >
                    0{i + 1}
                  </span>
                </div>

                {/* Tag */}
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: card.accent }}
                >
                  {card.tag}
                </span>

                {/* Conteúdo */}
                <div>
                  <h3 className="font-bold text-[#1F2937] text-base leading-snug mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
