'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';

const APP_URL = 'https://app.minhajornadadiaria.com.br';

const BRAND     = '#2D6A4F';
const BRAND_L   = '#74C69D';
const BRAND_DIM = 'rgba(45,106,79,0.10)';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.10 } },
};

const chips = [
  { emoji: '📱', label: 'Funciona offline' },
  { emoji: '🔔', label: 'Lembretes diários' },
  { emoji: '🌿', label: 'Sem cadastro obrigatório' },
];

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative hero-landscape-fix"
      style={{
        minHeight: '100vh',
        background: '#F8F7F4',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute"
          style={{
            top: '-180px', right: '-180px',
            width: '640px', height: '640px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${BRAND_DIM} 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: '-80px', left: '-80px',
            width: '480px', height: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(202,138,4,0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-screen py-28 lg:py-0">

          {/* ── Col esquerda: Copy ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6 text-center lg:text-left"
          >
            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-bold leading-[1.13] tracking-tight"
              style={{
                fontFamily: 'var(--font-lora)',
                fontSize: 'clamp(32px, 4vw, 52px)',
                color: '#1F2937',
              }}
            >
              Seu momento com Deus,{' '}
              <em style={{ fontStyle: 'italic', color: BRAND }}>todos os dias</em>
              {', direto no seu celular.'}
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              variants={fadeUp}
              className="leading-relaxed max-w-lg mx-auto lg:mx-0"
              style={{
                fontSize: 'clamp(15px, 1.8vw, 18px)',
                color: '#6B7280',
                fontFamily: 'var(--font-raleway)',
              }}
            >
              Orações, meditações e devocionais guiados para você começar e terminar
              o dia com paz, mesmo na correria.
            </motion.p>

            {/* Proof */}
            <motion.p
              variants={fadeUp}
              className="font-bold text-sm"
              style={{ color: BRAND, fontFamily: 'var(--font-raleway)' }}
            >
              Comece grátis. Sem cartão. Sem complicação.
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeUp}>
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 font-bold text-white rounded-full transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${BRAND}, #40916C)`,
                  padding: '17px 34px',
                  fontSize: 16,
                  boxShadow: '0 10px 32px rgba(45,106,79,0.35)',
                  fontFamily: 'var(--font-raleway)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 16px 44px rgba(45,106,79,0.45)';
                  e.currentTarget.style.background = '#1B4332';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 32px rgba(45,106,79,0.35)';
                  e.currentTarget.style.background = `linear-gradient(135deg, ${BRAND}, #40916C)`;
                }}
              >
                Começar agora no celular
                <span aria-hidden="true" className="transition-transform duration-200">→</span>
              </a>

              <p
                className="mt-2.5 text-xs flex items-center gap-1.5 justify-center lg:justify-start"
                style={{ color: '#9CA3AF', fontFamily: 'var(--font-raleway)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ color: BRAND, flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
                </svg>
                Abre no navegador e você instala como app em segundos.
              </p>
            </motion.div>

            {/* Chips */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {chips.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full"
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,0.06)',
                    padding: '6px 12px',
                    color: '#6B7280',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    fontFamily: 'var(--font-raleway)',
                  }}
                >
                  {chip.emoji} {chip.label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Col direita: Phone mockup ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.16, ease: 'easeOut' }}
            className="relative flex justify-center items-center order-first lg:order-last"
            style={{ padding: '24px 0' }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <div
                style={{
                  width: '320px', height: '320px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, rgba(45,106,79,0.14) 0%, transparent 70%)`,
                }}
              />
            </div>

            {/* Phone frame */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="relative z-10"
            >
              <div
                className="relative"
                style={{
                  width: 'clamp(200px, 28vw, 268px)',
                  height: 'clamp(418px, 58vw, 560px)',
                  background: '#1A1714',
                  borderRadius: 42,
                  padding: 14,
                  boxShadow: '0 40px 80px rgba(0,0,0,0.28), 0 0 0 2px rgba(255,255,255,0.09)',
                  transform: 'rotate(2.5deg)',
                  transition: 'transform 0.3s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'rotate(0deg) scale(1.02)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'rotate(2.5deg)'; }}
              >
                {/* Notch */}
                <div
                  className="mx-auto mb-2"
                  style={{ width: 76, height: 22, background: '#0d0b09', borderRadius: '0 0 14px 14px' }}
                />
                {/* Screen */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    background: '#1A1714',
                    borderRadius: 30,
                    height: 'calc(100% - 46px)',
                  }}
                >
                  <Image
                    src="/images/mockup-telainicial.png"
                    alt="Tela do app Minha Jornada Diária"
                    fill
                    className="object-cover object-top"
                    sizes="268px"
                    priority
                  />
                </div>
              </div>

              {/* Badge esquerda */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute flex items-center gap-2 font-bold rounded-[13px] shadow-lg"
                style={{
                  left: -48,
                  top: '22%',
                  background: '#fff',
                  padding: '9px 13px',
                  fontSize: 11,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 8px 28px rgba(0,0,0,0.13)',
                  color: '#1F2937',
                }}
              >
                <span style={{ fontSize: 18 }}>🔥</span>
                <div style={{ lineHeight: 1.3 }}>
                  <b style={{ display: 'block', fontSize: 13 }}>14 dias</b>
                  <span style={{ fontSize: 10, color: '#6B7280', fontWeight: 500 }}>de sequência</span>
                </div>
              </motion.div>

              {/* Badge direita */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="absolute flex items-center gap-2 font-bold rounded-[13px] shadow-lg"
                style={{
                  right: -48,
                  bottom: '24%',
                  background: '#fff',
                  padding: '9px 13px',
                  fontSize: 11,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 8px 28px rgba(0,0,0,0.13)',
                  color: '#1F2937',
                }}
              >
                <span style={{ fontSize: 18 }}>🌳</span>
                <div style={{ lineHeight: 1.3 }}>
                  <b style={{ display: 'block', fontSize: 13 }}>Nível 4</b>
                  <span style={{ fontSize: 10, color: '#6B7280', fontWeight: 500 }}>Árvore desbloqueada</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
