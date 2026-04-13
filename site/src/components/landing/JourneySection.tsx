'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const steps = [
  {
    number:      '01',
    tag:         'O Problema',
    title:       'A vida agitada afasta você de Deus',
    description: 'Dias corridos, falta de constância, sem um lugar tranquilo para encontrar a Deus. Sabemos como é difícil manter uma rotina espiritual no meio do caos.',
    accent:      '#C98989',
    pale:        '#FDF2F2',
    image:       '/images/site-ps-problema.png',
  },
  {
    number:      '02',
    tag:         'A Solução',
    title:       'Devocional simples e bonito em 5 minutos',
    description: 'Versículo do dia, reflexão e meditação em áudio — tudo integrado. Poucos minutos que transformam a manhã inteira e criam um hábito duradouro.',
    accent:      '#FB923C',
    pale:        '#FEF3E2',
    image:       '/images/site-ps-solucao.png',
  },
  {
    number:      '03',
    tag:         'O Crescimento',
    title:       'Hábitos que florescem com gamificação',
    description: 'Streaks de sequência, Árvore da Vida que cresce com você, XP espiritual e missões diárias. A gamificação a serviço da fé — sem superficialidade.',
    accent:      '#10B981',
    pale:        '#ECFDF5',
    image:       '/images/site-ps-crescimento.png',
  },
  {
    number:      '04',
    tag:         'O Resultado',
    title:       'Paz, intimidade e transformação real',
    description: 'Após semanas de jornada, nossos usuários relatam menos ansiedade, mais foco e uma genuína intimidade com Deus. Uma transformação que começa dentro.',
    accent:      '#7C3AED',
    pale:        '#F5F3FF',
    image:       '/images/site-ps-resultado.png',
  },
];

export function JourneySection() {
  const headerRef    = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

  return (
    <section id="jornada" className="py-24 sm:py-32 bg-white scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-20" ref={headerRef}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            className="text-xs font-semibold tracking-widest text-[#10B981] uppercase"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Como Funciona
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F0B1E] leading-tight"
            style={{ fontFamily: 'var(--font-lora)' }}
          >
            Da inquietação à paz
            <br className="hidden sm:block" />
            <span className="italic text-[#10B981]"> em 4 passos</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-5 text-[#6B7280] text-lg max-w-lg mx-auto leading-relaxed"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Uma transformação simples, consistente e profunda — 5 minutos por dia.
          </motion.p>
        </div>

        {/* Steps — alternating layout desktop */}
        <div className="flex flex-col gap-16 lg:gap-20">
          {steps.map((step, i) => (
            <StepRow key={step.tag} step={step} index={i} />
          ))}
        </div>

        {/* Bottom verse */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20 text-center"
        >
          <p
            className="text-xl sm:text-2xl lg:text-3xl font-bold italic text-[#0F0B1E] leading-snug max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-lora)' }}
          >
            "Portanto, ide, fazei discípulos de todas as nações..."
          </p>
          <footer
            className="mt-4 text-[#7C3AED] font-semibold"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Mateus 28:19
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}

function StepRow({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const imageLeft = index % 2 !== 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.05 }}
      className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16 xl:gap-20 ${imageLeft ? 'lg:flex-row-reverse' : ''}`}
    >
      {/* Image */}
      <div className="w-full lg:w-[45%] xl:w-[42%] shrink-0">
        <div className="relative h-60 sm:h-72 lg:h-80 rounded-2xl overflow-hidden shadow-lg border border-[#E5E7EB] group">
          <Image
            src={step.image}
            alt={step.tag}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{ background: `linear-gradient(135deg, ${step.accent}44, transparent)` }}
          />
          {/* Step badge */}
          <div
            className="absolute top-4 left-4 px-3 py-1.5 rounded-xl font-black text-white text-sm shadow-lg"
            style={{ backgroundColor: step.accent, fontFamily: 'var(--font-raleway)' }}
          >
            {step.number}
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="flex-1">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl mb-5"
          style={{ backgroundColor: step.pale }}
        >
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: step.accent, fontFamily: 'var(--font-raleway)' }}
          >
            {step.tag}
          </span>
        </div>

        <h3
          className="text-2xl xl:text-3xl font-bold text-[#0F0B1E] leading-snug mb-4"
          style={{ fontFamily: 'var(--font-lora)' }}
        >
          {step.title}
        </h3>

        <p
          className="text-[#6B7280] text-lg leading-relaxed max-w-md"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          {step.description}
        </p>

        <div
          className="mt-6 w-12 h-1 rounded-full"
          style={{ backgroundColor: step.accent }}
        />
      </div>
    </motion.div>
  );
}
