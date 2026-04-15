'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const APP_URL = 'https://app.minhajornadadiaria.com.br';
const BRAND   = '#2D6A4F';
const BRAND_L = '#74C69D';

const notes = [
  'Grátis para começar',
  'Sem cartão de crédito',
  'Funciona offline',
  'Sem cadastro obrigatório',
];

export function CTASection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="comecar"
      ref={ref}
      className="relative overflow-hidden scroll-mt-16 text-center"
      style={{ background: '#1A1714', padding: 'clamp(70px,10vw,110px) clamp(20px,6vw,80px)' }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(45,106,79,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-5"
        >
          <span
            className="inline-block rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(45,106,79,0.20)', color: BRAND_L, padding: '5px 13px' }}
          >
            🌿 Comece agora
          </span>
        </motion.div>

        {/* Título */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-bold leading-snug mb-4"
          style={{
            fontFamily: 'var(--font-lora)',
            fontSize: 'clamp(28px, 3.5vw, 46px)',
            color: '#F0EDE8',
          }}
        >
          Comece seu momento com Deus{' '}
          <em style={{ fontStyle: 'italic', color: BRAND_L }}>hoje</em>
        </motion.h2>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.55 }}
          style={{
            fontSize: 17,
            color: 'rgba(240,237,232,0.60)',
            maxWidth: 480,
            margin: '0 auto 42px',
            lineHeight: 1.7,
            fontFamily: 'var(--font-raleway)',
          }}
        >
          Leva menos de 1 minuto para estar dentro do app, ouvindo a primeira
          oração ou abrindo o devocional do dia.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.35, duration: 0.5, type: 'spring', stiffness: 150 }}
        >
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 font-bold text-white rounded-full transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: BRAND,
              padding: '18px 40px',
              fontSize: 17,
              boxShadow: '0 10px 36px rgba(45,106,79,0.45)',
              fontFamily: 'var(--font-raleway)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 16px 50px rgba(45,106,79,0.60)';
              e.currentTarget.style.background = '#1B4332';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 36px rgba(45,106,79,0.45)';
              e.currentTarget.style.background = BRAND;
            }}
          >
            Abrir grátis no celular
            <span aria-hidden="true">→</span>
          </a>

          <p
            className="mt-3.5 text-xs"
            style={{ color: 'rgba(240,237,232,0.45)', fontFamily: 'var(--font-raleway)' }}
          >
            Abre no navegador e você instala como app em segundos.
          </p>
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          {notes.map((note, i) => (
            <span key={note}>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-medium"
                style={{ color: 'rgba(240,237,232,0.55)', fontFamily: 'var(--font-raleway)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" style={{ color: BRAND_L, flexShrink: 0 }}>
                  <path d="m9 12 2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                {note}
              </span>
              {i < notes.length - 1 && (
                <span
                  className="hidden sm:inline"
                  style={{ color: 'rgba(240,237,232,0.20)', marginLeft: 12, fontSize: 16 }}
                  aria-hidden="true"
                >
                  ·
                </span>
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
