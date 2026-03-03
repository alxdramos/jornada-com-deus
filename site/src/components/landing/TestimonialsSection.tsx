'use client';

import { motion, type Variants } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name:     'Mariana Costa',
    role:     'Estudante de Teologia',
    initials: 'M',
    color:    '#FB923C',
    stars:    5,
    text:     'Depois de 30 dias consecutivos usando o app, minha ansiedade diminuiu muito e minha fé cresceu de uma forma que eu não esperava. A Árvore da Vida me motiva a não quebrar a sequência!',
  },
  {
    name:     'André Lopes',
    role:     'Pastor e pai de família',
    initials: 'A',
    color:    '#10B981',
    stars:    5,
    text:     'Como pastor, fico feliz de indicar um app que une tecnologia e espiritualidade com tanto cuidado. As meditações guiadas em áudio são um diferencial incrível para quem está começando.',
  },
  {
    name:     'Gabriela Torres',
    role:     'Enfermeira, cristã há 15 anos',
    initials: 'G',
    color:    '#8B5CF6',
    stars:    5,
    text:     'Nos plantões noturnos, quando o Wi-Fi some, o app continua funcionando offline. Ter a Bíblia completa disponível a qualquer hora mudou minha rotina espiritual completamente.',
  },
  {
    name:     'Ricardo Melo',
    role:     'Empresário e líder de célula',
    initials: 'R',
    color:    '#C98989',
    stars:    5,
    text:     'O design é tão bonito e sereno que dá prazer abrir o app de manhã. Em 3 semanas já virou hábito antes do café. Recomendo para toda a minha célula!',
  },
];

const containerVariants: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export function TestimonialsSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="depoimentos" className="py-24 sm:py-32 bg-[#FAF9F6] scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16" ref={ref}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-xs font-semibold tracking-widest text-[#10B981] uppercase"
          >
            Depoimentos reais
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937] leading-tight"
          >
            Vidas transformadas dia a dia
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 text-[#6B7280] text-lg max-w-lg mx-auto"
          >
            Histórias de quem fez da Jornada um hábito diário de fé.
          </motion.p>

          {/* Stats de prova social */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-8"
          >
            {[
              { value: '+2.400', label: 'usuários ativos' },
              { value: '4.9★',  label: 'avaliação média' },
              { value: '94%',   label: 'mantêm o hábito' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-sm">
                <span className="font-bold text-[#FB923C] text-base">{s.value}</span>
                <span className="text-[#9CA3AF]">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Cards: 1-col mobile, 2-col tablet, 4-col desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col"
            >
              {/* Quote decorativo */}
              <Quote
                size={40}
                className="absolute top-3 right-3 opacity-[0.06] text-[#1F2937]"
                aria-hidden="true"
              />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} size={13} className="fill-[#FB923C] text-[#FB923C]" />
                ))}
              </div>

              {/* Texto */}
              <p className="text-[#4B5563] leading-relaxed text-sm flex-1 mb-5">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Autor */}
              <div className="flex items-center gap-2.5 mt-auto">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                  style={{ backgroundColor: t.color }}
                >
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#1F2937] text-xs truncate">{t.name}</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">{t.role}</p>
                </div>
              </div>

              {/* Badge verificado */}
              <div className="mt-3 inline-flex items-center gap-1 text-[10px] text-[#10B981] font-medium">
                <span className="w-3 h-3 rounded-full bg-[#ECFDF5] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                </span>
                Usuário verificado
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
