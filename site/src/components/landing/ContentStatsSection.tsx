'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const BRAND     = '#2D6A4F';
const BRAND_DIM = 'rgba(45,106,79,0.10)';

const items = [
  { emoji: '📖', bg: BRAND_DIM,                         number: '78',  label: 'Devocionais diários' },
  { emoji: '🙏', bg: 'rgba(16,185,129,0.10)',            number: '47',  label: 'Orações guiadas' },
  { emoji: '🎧', bg: 'rgba(59,130,246,0.10)',            number: '28',  label: 'Meditações com áudio' },
  { emoji: '📜', bg: 'rgba(202,138,4,0.13)',             number: '31',  label: 'Estudos bíblicos' },
  { emoji: '📕', bg: 'rgba(251,146,60,0.10)',            number: '66',  label: 'Livros da Bíblia' },
  { emoji: '✍️', bg: 'rgba(236,72,153,0.10)',            number: '∞',   label: 'Diário espiritual' },
];

export function ContentStatsSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      id="conteudo"
      className="scroll-mt-16"
      style={{ padding: 'clamp(60px,8vw,90px) clamp(20px,6vw,80px)', background: '#F8F7F4' }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div ref={ref} className="mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
              style={{
                background: BRAND_DIM,
                color: BRAND,
                padding: '5px 13px',
              }}
            >
              📚 Conteúdo
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-bold leading-snug mb-3"
            style={{
              fontFamily: 'var(--font-lora)',
              fontSize: 'clamp(24px, 3vw, 38px)',
              color: '#1F2937',
              maxWidth: 540,
            }}
          >
            Para acompanhar sua jornada{' '}
            <em style={{ fontStyle: 'italic', color: BRAND }}>todos os dias</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontSize: 16,
              color: '#6B7280',
              lineHeight: 1.7,
              maxWidth: 480,
              fontFamily: 'var(--font-raleway)',
            }}
          >
            Mais de 180 conteúdos para diferentes momentos da sua caminhada com Deus.
          </motion.p>
        </div>

        {/* Grid de números */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="flex items-center gap-3 rounded-2xl border transition-all duration-200"
              style={{
                background: '#fff',
                borderColor: 'rgba(0,0,0,0.055)',
                padding: '18px 20px',
              }}
              whileHover={{ borderColor: 'rgba(45,106,79,0.18)', boxShadow: '0 8px 24px rgba(45,106,79,0.08)' }}
            >
              <div
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{ width: 44, height: 44, background: item.bg, fontSize: 18 }}
              >
                {item.emoji}
              </div>
              <div>
                <p
                  className="font-bold leading-none"
                  style={{ fontFamily: 'var(--font-lora)', fontSize: 22, color: BRAND }}
                >
                  {item.number}
                </p>
                <p
                  className="text-xs font-semibold mt-1"
                  style={{ color: '#6B7280', fontFamily: 'var(--font-raleway)' }}
                >
                  {item.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Banner total */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="flex items-center justify-between gap-5 rounded-2xl flex-wrap"
          style={{ background: BRAND, borderRadius: 16, padding: '22px 28px' }}
        >
          <p
            className="font-semibold italic flex-1 min-w-0"
            style={{ fontFamily: 'var(--font-lora)', fontSize: 17, color: '#fff' }}
          >
            Mais de 180 conteúdos para cada momento da sua caminhada.
          </p>
          <p
            className="font-bold shrink-0"
            style={{ fontFamily: 'var(--font-lora)', fontSize: 36, color: 'rgba(255,255,255,0.9)' }}
          >
            180+
          </p>
        </motion.div>
      </div>
    </section>
  );
}
