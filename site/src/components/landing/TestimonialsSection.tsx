'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const BRAND = '#2D6A4F';

const testimonials = [
  {
    name:      'Mariana Costa',
    role:      'Estudante de Teologia',
    initials:  'M',
    color:     '#FB923C',
    stars:     5,
    text: 'Depois de 30 dias consecutivos usando o app, minha ansiedade diminuiu muito e minha fé cresceu de uma forma que não esperava. A Árvore da Vida me motiva a não quebrar a sequência!',
  },
  {
    name:      'André Lopes',
    role:      'Pastor e pai de família',
    initials:  'A',
    color:     '#2D6A4F',
    stars:     5,
    text: 'Como pastor, fico feliz de indicar um app que une tecnologia e espiritualidade com tanto cuidado. As meditações guiadas em áudio são um diferencial incrível.',
  },
  {
    name:      'Gabriela Torres',
    role:      'Enfermeira, cristã há 15 anos',
    initials:  'G',
    color:     '#74C69D',
    stars:     5,
    text: 'Nos plantões noturnos, quando o Wi-Fi some, o app continua funcionando. Ter a Bíblia completa disponível a qualquer hora mudou minha rotina espiritual completamente.',
  },
  {
    name:      'Ricardo Melo',
    role:      'Empresário e líder de célula',
    initials:  'R',
    color:     '#CA8A04',
    stars:     5,
    text: 'O design é tão bonito e sereno que dá prazer abrir o app de manhã. Em 3 semanas já virou hábito antes do café. Recomendo para toda a minha célula!',
  },
];

export function TestimonialsSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      id="depoimentos"
      className="scroll-mt-16"
      style={{ padding: 'clamp(60px,8vw,90px) clamp(20px,6vw,80px)', background: '#F8F7F4' }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14" ref={ref}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: BRAND, fontFamily: 'var(--font-raleway)' }}
          >
            Depoimentos Reais
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-3 font-bold leading-tight"
            style={{
              fontFamily: 'var(--font-lora)',
              fontSize: 'clamp(26px, 3vw, 38px)',
              color: '#1F2937',
            }}
          >
            Vidas transformadas,{' '}
            <em style={{ fontStyle: 'italic', color: BRAND }}>dia a dia</em>
          </motion.h2>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-8"
          >
            {[
              { value: '+2.400', label: 'usuários ativos' },
              { value: '4.9★',  label: 'avaliação média' },
              { value: '94%',   label: 'mantêm o hábito' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-sm">
                <span
                  className="font-bold text-base"
                  style={{ fontFamily: 'var(--font-lora)', color: BRAND }}
                >
                  {s.value}
                </span>
                <span style={{ color: '#9CA3AF', fontFamily: 'var(--font-raleway)' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative overflow-hidden flex flex-col rounded-2xl border shadow-sm hover:shadow-lg transition-all"
              style={{
                background: '#fff',
                borderColor: '#E5E7EB',
                padding: 20,
              }}
            >
              {/* Decorative quote */}
              <Quote
                size={44}
                className="absolute top-3 right-3 opacity-[0.05] text-[#1F2937]"
                aria-hidden="true"
              />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.stars)].map((_, si) => (
                  <Star key={si} size={13} style={{ fill: '#CA8A04', color: '#CA8A04' }} />
                ))}
              </div>

              {/* Text */}
              <p
                className="text-sm leading-relaxed flex-1 mb-5"
                style={{ color: '#4B5563', fontFamily: 'var(--font-raleway)' }}
              >
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-2.5 mt-auto">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                  style={{ backgroundColor: t.color, fontFamily: 'var(--font-raleway)' }}
                >
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <p
                    className="font-semibold text-xs truncate"
                    style={{ fontFamily: 'var(--font-lora)', color: '#1F2937' }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-[11px] leading-snug"
                    style={{ color: '#9CA3AF', fontFamily: 'var(--font-raleway)', overflowWrap: 'break-word' }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>

              {/* Verified */}
              <div
                className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium"
                style={{ color: BRAND, fontFamily: 'var(--font-raleway)' }}
              >
                <span
                  className="w-3 h-3 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(45,106,79,0.10)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND }} />
                </span>
                Usuário verificado
              </div>

              {/* Color accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: t.color, opacity: 0.4 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
