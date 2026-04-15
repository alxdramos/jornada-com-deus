'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const BRAND     = '#2D6A4F';
const BRAND_DIM = 'rgba(45,106,79,0.10)';

const steps = [
  {
    number:  1,
    title:   'Abra no navegador',
    desc:    'Acesse app.minhajornadadiaria.com.br no celular. Funciona em qualquer dispositivo: Android, iPhone ou computador.',
  },
  {
    number:  2,
    title:   'Instale como app',
    desc:    'Toque em "Adicionar à tela inicial" no seu navegador. Aparece no celular igual a um app normal, sem passar pela loja.',
  },
  {
    number:  3,
    title:   'Comece agora',
    desc:    'Escolha oração, devocional ou meditação. Em menos de 1 minuto você já está no seu momento com Deus.',
  },
];

export function JourneySection() {
  const headerRef    = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

  return (
    <section
      id="como-funciona"
      className="scroll-mt-16"
      style={{ padding: 'clamp(60px,8vw,90px) clamp(20px,6vw,80px)', background: '#EEEAE3' }}
    >
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
              ⚡ Em 3 passos
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
            Leva menos de 1 minuto para{' '}
            <em style={{ fontStyle: 'italic', color: BRAND }}>começar</em>
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
            Sem instalação complicada. Sem cadastro obrigatório. É só abrir e entrar.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.10, duration: 0.55 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="relative rounded-[20px] border transition-all duration-250"
              style={{ background: '#fff', borderColor: 'rgba(0,0,0,0.055)', padding: 30 }}
            >
              {/* Number */}
              <div
                className="flex items-center justify-center font-bold rounded-full mb-5"
                style={{
                  width: 44, height: 44,
                  background: BRAND,
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'var(--font-lora)',
                  boxShadow: '0 6px 18px rgba(45,106,79,0.30)',
                }}
              >
                {step.number}
              </div>

              {/* Arrow connector — só desktop */}
              {i < steps.length - 1 && (
                <div
                  className="absolute hidden sm:flex items-center justify-center rounded-full"
                  style={{
                    top: '50%', right: -18,
                    transform: 'translateY(-50%)',
                    width: 36, height: 36,
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,0.08)',
                    color: BRAND,
                    fontSize: 14,
                    zIndex: 2,
                  }}
                  aria-hidden="true"
                >
                  →
                </div>
              )}

              <h3
                className="font-bold mb-2"
                style={{ fontFamily: 'var(--font-lora)', fontSize: 17, color: '#1F2937' }}
              >
                {step.title}
              </h3>
              <p
                style={{ fontSize: 14, lineHeight: 1.65, color: '#6B7280', fontFamily: 'var(--font-raleway)' }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Promise */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="inline-block font-semibold italic rounded-[14px]"
            style={{
              fontFamily: 'var(--font-lora)',
              fontSize: 18,
              color: BRAND,
              background: BRAND_DIM,
              border: '1px solid rgba(45,106,79,0.15)',
              padding: '20px 32px',
            }}
          >
            Em menos de 1 minuto, você já está no seu momento com Deus.
          </motion.p>
        </div>

      </div>
    </section>
  );
}
