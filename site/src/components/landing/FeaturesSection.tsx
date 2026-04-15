'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const BRAND     = '#2D6A4F';
const BRAND_DIM = 'rgba(45,106,79,0.10)';

const moments = [
  {
    timeIcon: '🌅',
    timeLabel: 'Para começar o dia',
    title: 'Com direção e paz',
    desc: 'Abra o app de manhã e tenha em minutos um devocional, um versículo e uma oração para alinhar o dia com Deus.',
    items: ['Devocional diário com reflexão', 'Versículo do dia', 'Oração guiada em áudio'],
  },
  {
    timeIcon: '🎧',
    timeLabel: 'Para acalmar a mente',
    title: 'Em silêncio com Deus',
    desc: 'Quando você precisa desacelerar, respirar e ouvir algo que traga paz. As meditações guiadas estão prontas.',
    items: ['28 meditações guiadas', 'Áudio imersivo', 'Funciona offline'],
  },
  {
    timeIcon: '📖',
    timeLabel: 'Para crescer na fé',
    title: 'Aprofundando a caminhada',
    desc: 'A Bíblia completa, estudos aprofundados e um diário espiritual para registrar o que Deus está fazendo em você.',
    items: ['Bíblia completa (66 livros)', 'Estudos bíblicos com áudio', 'Diário espiritual pessoal'],
  },
];

export function FeaturesSection() {
  const headerRef    = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

  return (
    <section id="recursos" className="scroll-mt-16" style={{ padding: 'clamp(60px,8vw,90px) clamp(20px,6vw,80px)', background: '#F8F7F4' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
              style={{ background: BRAND_DIM, color: BRAND, padding: '5px 13px' }}
            >
              ☀️ Para cada momento
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-bold leading-snug mb-3"
            style={{
              fontFamily: 'var(--font-lora)',
              fontSize: 'clamp(24px, 3vw, 38px)',
              color: '#1F2937',
              maxWidth: 540,
            }}
          >
            Um app feito para o seu dia{' '}
            <em style={{ fontStyle: 'italic', color: BRAND }}>real</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontSize: 16,
              color: '#6B7280',
              maxWidth: 480,
              lineHeight: 1.7,
              fontFamily: 'var(--font-raleway)',
            }}
          >
            Não importa o momento: o app tem o que você precisa para se conectar com
            Deus de onde estiver.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {moments.map((m, i) => (
            <MomentCard key={m.title} moment={m} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}

function MomentCard({ moment, index }: { moment: typeof moments[0]; index: number }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.10 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative rounded-[20px] border transition-all duration-300 hover:shadow-xl group flex flex-col"
      style={{
        background: '#fff',
        borderColor: 'rgba(0,0,0,0.055)',
      }}
    >
      {/* Bottom accent line on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${BRAND}, #74C69D)` }}
      />

      <div className="p-7">
        {/* Time label */}
        <div
          className="inline-flex items-center gap-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-4"
          style={{ background: 'rgba(45,106,79,0.10)', color: BRAND, padding: '4px 11px' }}
        >
          {moment.timeIcon} {moment.timeLabel}
        </div>

        {/* Title */}
        <h3
          className="font-bold mb-2 leading-snug"
          style={{ fontFamily: 'var(--font-lora)', fontSize: 19, color: '#1F2937' }}
        >
          {moment.title}
        </h3>

        {/* Description */}
        <p
          className="mb-5 leading-relaxed"
          style={{ fontSize: 14, color: '#6B7280', fontFamily: 'var(--font-raleway)', lineHeight: 1.65 }}
        >
          {moment.desc}
        </p>

        {/* Items */}
        <ul className="flex flex-col gap-2">
          {moment.items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 font-semibold"
              style={{ fontSize: 13, color: '#1F2937', fontFamily: 'var(--font-raleway)' }}
            >
              <span
                className="shrink-0 rounded-full"
                style={{ width: 6, height: 6, background: BRAND }}
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
