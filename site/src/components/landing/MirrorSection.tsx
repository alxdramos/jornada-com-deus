'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function MirrorSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: '#1A1714', padding: 'clamp(60px,8vw,90px) clamp(20px,6vw,80px)' }}
    >
      {/* Decorative glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 70% 50%, rgba(45,106,79,0.13) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-2xl relative z-10">
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-flex items-center gap-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
            style={{
              background: 'rgba(45,106,79,0.18)',
              color: '#74C69D',
              padding: '4px 12px',
            }}
          >
            📍 Você se reconhece aqui?
          </span>
        </motion.div>

        {/* Título */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-bold leading-snug mb-7"
          style={{
            fontFamily: 'var(--font-lora)',
            fontSize: 'clamp(26px, 3vw, 38px)',
            color: '#F0EDE8',
          }}
        >
          Se manter constante com Deus{' '}
          <em style={{ fontStyle: 'italic', color: '#74C69D' }}>nem sempre é simples.</em>
        </motion.h2>

        {/* Corpo */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.55 }}
          className="leading-relaxed mb-7"
          style={{
            fontSize: 'clamp(15px, 1.8vw, 17px)',
            color: 'rgba(240,237,232,0.65)',
            fontFamily: 'var(--font-raleway)',
          }}
        >
          Tem dias em que você quer parar, orar, ouvir algo que acalme, mas a rotina
          engole. Você começa… para… tenta voltar… e sente que nunca consegue manter
          constância.
        </motion.p>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.55 }}
          className="mb-7"
          style={{
            borderLeft: '3px solid #74C69D',
            paddingLeft: 20,
            fontFamily: 'var(--font-lora)',
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 2vw, 18px)',
            color: '#F0EDE8',
            lineHeight: 1.5,
          }}
        >
          "Não é falta de fé. É falta de um caminho simples."
        </motion.blockquote>

        {/* Resposta */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.55 }}
          style={{
            fontSize: 'clamp(15px, 1.8vw, 17px)',
            color: 'rgba(240,237,232,0.75)',
            fontFamily: 'var(--font-raleway)',
            lineHeight: 1.72,
          }}
        >
          Por isso criamos o Minha Jornada Diária:{' '}
          <strong style={{ color: '#F0EDE8' }}>
            um app que te ajuda a voltar, um dia de cada vez.
          </strong>{' '}
          Sem culpa. Sem pressão. Com um caminho claro e acolhedor para o seu momento
          com Deus.
        </motion.p>
      </div>
    </section>
  );
}
