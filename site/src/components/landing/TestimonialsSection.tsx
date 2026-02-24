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
  show:   { opacity: 1, y: 0 },
};

export function TestimonialsSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="depoimentos" className="py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

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
        </div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid sm:grid-cols-2 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
            >
              {/* Quote decorativo */}
              <Quote
                size={48}
                className="absolute top-4 right-4 opacity-5 text-[#1F2937]"
                aria-hidden="true"
              />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-[#FB923C] text-[#FB923C]"
                  />
                ))}
              </div>

              {/* Texto */}
              <p className="text-[#4B5563] leading-relaxed text-base mb-5">
                "{t.text}"
              </p>

              {/* Autor */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-[#1F2937] text-sm">{t.name}</p>
                  <p className="text-xs text-[#9CA3AF]">{t.role}</p>
                </div>
                <div className="ml-auto text-[10px] text-[#9CA3AF] bg-[#F9FAFB] px-2 py-1 rounded-full border border-[#E5E7EB]">
                  Usuário da Minha Jornada Diária
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
