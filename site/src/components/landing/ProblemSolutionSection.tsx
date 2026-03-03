'use client';

import { motion, type Variants } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { HeartCrack, BookOpen, TreeDeciduous, Leaf, ArrowRight } from 'lucide-react';

const cards = [
  {
    icon:        HeartCrack,
    tag:         'O Problema',
    title:       'Dias corridos, distância de Deus',
    description: 'A vida agitada consome nosso tempo e nos afasta do que realmente importa. Falta constância, falta método, falta um lugar tranquilo para encontrar a Deus.',
    accent:      '#C98989',
    pale:        '#FDF2F2',
    image:       '/images/site-ps-problema.png',
  },
  {
    icon:        BookOpen,
    tag:         'A Solução',
    title:       'Devocional diário simples e bonito',
    description: 'Versículo do dia, reflexão guiada e meditações em áudio — tudo num só lugar. Poucos minutos que transformam a manhã inteira.',
    accent:      '#FB923C',
    pale:        '#FEF3E2',
    image:       '/images/site-ps-solucao.png',
  },
  {
    icon:        TreeDeciduous,
    tag:         'O Crescimento',
    title:       'Hábitos que florescem',
    description: 'Streaks de sequência, Árvore da Vida que cresce com você, XP espiritual e missões diárias. A gamificação a serviço da fé.',
    accent:      '#10B981',
    pale:        '#ECFDF5',
    image:       '/images/site-ps-crescimento.png',
  },
  {
    icon:        Leaf,
    tag:         'O Resultado',
    title:       'Paz, intimidade e transformação real',
    description: 'Após semanas de jornada, os usuários relatam menos ansiedade, mais foco e uma sensação genuína de intimidade com Deus.',
    accent:      '#3FDFB8',
    pale:        '#F0FDF9',
    image:       '/images/site-ps-resultado.png',
  },
];

const containerVariants: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export function ProblemSolutionSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="jornada" className="py-24 sm:py-32 bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16" ref={ref}>
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
            className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937] leading-tight"
          >
            Do problema à paz em 4 passos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 text-[#6B7280] text-lg max-w-lg mx-auto leading-relaxed"
          >
            Uma transformação simples, consistente e profunda — começando com 5 minutos por dia.
          </motion.p>
        </div>

        {/* Cards: 1-col mobile → 2-col tablet → 4-col desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.tag}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 sm:h-52 overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.tag}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Step number */}
                  <div
                    className="absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-lg"
                    style={{ backgroundColor: card.accent }}
                  >
                    {i + 1}
                  </div>

                  {/* Connector arrow — desktop only (not last card) */}
                  {i < cards.length - 1 && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden xl:flex">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white"
                        style={{ backgroundColor: card.accent }}
                      >
                        <ArrowRight size={11} className="text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  {/* Tag + icon */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: card.pale }}
                    >
                      <Icon size={15} style={{ color: card.accent }} />
                    </div>
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: card.accent }}
                    >
                      {card.tag}
                    </span>
                  </div>

                  {/* Conteúdo */}
                  <div>
                    <h3 className="font-bold text-[#1F2937] text-base leading-snug mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Accent bar */}
                  <div
                    className="mt-auto h-0.5 w-8 rounded-full"
                    style={{ backgroundColor: card.accent }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
