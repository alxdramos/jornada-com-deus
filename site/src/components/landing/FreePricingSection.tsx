'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const APP_URL = 'https://app.minhajornadadiaria.com.br';
const BRAND   = '#2D6A4F';

const checks = [
  'Devocionais diários',
  'Orações guiadas',
  'Meditações com áudio',
  'Bíblia completa',
  'Diário espiritual',
  'Gamificação e Árvore da Vida',
];

export function FreePricingSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ padding: 'clamp(50px,7vw,80px) clamp(20px,6vw,80px)', background: '#EEEAE3' }}
    >
      {/* Background decoration */}
      <div
        className="absolute -top-24 -right-24 pointer-events-none"
        aria-hidden="true"
        style={{
          width: '360px', height: '360px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,106,79,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="rounded-[28px] border"
          style={{
            background: '#fff',
            borderColor: 'rgba(45,106,79,0.10)',
            padding: 'clamp(30px,5vw,52px)',
            boxShadow: '0 20px 60px rgba(45,106,79,0.10)',
          }}
        >
          {/* Icon */}
          <span style={{ fontSize: 48, display: 'block', marginBottom: 20 }} role="img" aria-label="Presente">
            🎁
          </span>

          {/* Título */}
          <h2
            className="font-bold mb-3"
            style={{
              fontFamily: 'var(--font-lora)',
              fontSize: 'clamp(22px, 2.5vw, 34px)',
              color: '#1F2937',
            }}
          >
            Comece grátis.{' '}
            <em style={{ fontStyle: 'italic', color: BRAND }}>De verdade.</em>
          </h2>

          {/* Subtítulo */}
          <p
            className="mb-7"
            style={{
              fontSize: 16,
              color: '#6B7280',
              lineHeight: 1.7,
              fontFamily: 'var(--font-raleway)',
              maxWidth: 520,
            }}
          >
            Você não precisa de cartão, não vai bater em paywall nos primeiros
            minutos e não precisa fazer nada além de abrir o app. O gratuito é real.
          </p>

          {/* Checks grid — 1 col em mobile, 2 cols em sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
            {checks.map((check) => (
              <div
                key={check}
                className="flex items-center gap-2.5 font-semibold rounded-xl border"
                style={{
                  fontSize: 14,
                  color: '#1F2937',
                  background: '#F8F7F4',
                  padding: '12px 16px',
                  borderColor: 'rgba(0,0,0,0.055)',
                  fontFamily: 'var(--font-raleway)',
                }}
              >
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={BRAND} strokeWidth="2.5" aria-hidden="true"
                  style={{ flexShrink: 0 }}
                >
                  <path d="m9 12 2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                {check}
              </div>
            ))}
          </div>

          {/* Plus upsell */}
          <div
            className="rounded-[14px] border mb-8"
            style={{
              background: 'rgba(45,106,79,0.06)',
              borderColor: 'rgba(45,106,79,0.15)',
              padding: '16px 20px',
              fontSize: 14,
              color: '#6B7280',
              lineHeight: 1.6,
              fontFamily: 'var(--font-raleway)',
            }}
          >
            <strong style={{ color: BRAND }}>Quer ir mais fundo?</strong> Dentro do app
            você encontra a versão Plus com áudios completos narrados e conteúdos
            adicionais, para quem quer se aprofundar ainda mais.
          </div>

          {/* CTA */}
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold text-white rounded-full transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: BRAND,
              padding: '16px 32px',
              fontSize: 16,
              boxShadow: '0 8px 28px rgba(45,106,79,0.30)',
              fontFamily: 'var(--font-raleway)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1B4332';
              e.currentTarget.style.boxShadow = '0 12px 36px rgba(45,106,79,0.42)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = BRAND;
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(45,106,79,0.30)';
            }}
          >
            Abrir grátis no celular ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
}
