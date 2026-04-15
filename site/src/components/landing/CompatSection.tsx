'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const BRAND     = '#2D6A4F';
const BRAND_DIM = 'rgba(45,106,79,0.10)';

const devices = [
  {
    icon: '🍎',
    name: 'iPhone & iPad',
    desc: 'Safari → Compartilhar → Adicionar à Tela Inicial',
  },
  {
    icon: '🤖',
    name: 'Android',
    desc: 'Chrome → Menu → Adicionar à Tela Inicial',
  },
  {
    icon: '💻',
    name: 'Computador',
    desc: 'Acesse pelo navegador normalmente',
  },
];

export function CompatSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      ref={ref}
      className="scroll-mt-16 text-center"
      style={{ padding: 'clamp(60px,7vw,80px) clamp(20px,6vw,80px)', background: '#F8F7F4' }}
    >
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="mb-2"
        >
          <span
            className="inline-flex items-center gap-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
            style={{ background: BRAND_DIM, color: BRAND, padding: '5px 13px' }}
          >
            📱 Funciona no seu celular
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-bold leading-snug mb-3"
          style={{
            fontFamily: 'var(--font-lora)',
            fontSize: 'clamp(22px, 3vw, 34px)',
            color: '#1F2937',
          }}
        >
          Sem baixar na loja.{' '}
          <em style={{ fontStyle: 'italic', color: BRAND }}>Simples assim.</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-11"
          style={{
            fontSize: 16,
            color: '#6B7280',
            lineHeight: 1.7,
            fontFamily: 'var(--font-raleway)',
          }}
        >
          Abre no navegador e adiciona à tela inicial, como qualquer app normal.
        </motion.p>

        {/* Device cards — 1 col mobile, 3 cols md+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-9">
          {devices.map((device, i) => (
            <motion.div
              key={device.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.10, duration: 0.55 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="border rounded-[20px] text-left transition-all duration-200"
              style={{
                background: '#fff',
                borderColor: 'rgba(0,0,0,0.055)',
                padding: '28px 28px',
              }}
            >
              <span style={{ fontSize: 36, display: 'block', marginBottom: 12 }} role="img" aria-label={device.name}>
                {device.icon}
              </span>
              <p
                className="font-semibold mb-1.5"
                style={{ fontFamily: 'var(--font-lora)', fontSize: 16, color: '#1F2937' }}
              >
                {device.name}
              </p>
              <p
                style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, fontFamily: 'var(--font-raleway)' }}
              >
                {device.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Info box */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="inline-block text-left rounded-[14px]"
          style={{
            fontSize: 15,
            color: '#6B7280',
            lineHeight: 1.7,
            background: '#EEEAE3',
            padding: '16px 24px',
            maxWidth: 520,
            fontFamily: 'var(--font-raleway)',
          }}
        >
          <strong style={{ color: '#1F2937' }}>Funciona offline</strong> depois de instalado.
          Sincroniza automaticamente quando você voltar online. Seus dados nunca se perdem.
        </motion.p>

      </div>
    </section>
  );
}
