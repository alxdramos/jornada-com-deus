'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const BRAND   = '#2D6A4F';
const BRAND_L = '#74C69D';
const GOLD    = '#CA8A04';
const GOLD_L  = '#FCD34D';
const DARK    = '#1A1714';
const DARK2   = '#231F1B';

const habitItems = [
  {
    icon: '🔥',
    title: 'Sequência diária (Streak)',
    desc: 'Não quebre sua sequência. O app te lembra com notificações carinhosas às 7h, 12h e 20h.',
  },
  {
    icon: '⭐',
    title: 'Progresso espiritual visível',
    desc: '+100 XP por dia completo. +25 XP por capítulo bíblico. Cada ação faz sua árvore crescer.',
  },
  {
    icon: '🌳',
    title: 'Árvore da Vida: 11 estágios',
    desc: 'Sua fidelidade espiritual se transforma em algo visível que cresce com você dia após dia.',
  },
  {
    icon: '🏅',
    title: 'Marcos e celebrações',
    desc: 'Mensagens especiais nos dias 7, 14, 21, 30, 60 e 90 de sequência. Você não passa em branco.',
  },
];

const treeDots = Array.from({ length: 11 }, (_, i) => ({
  filled: i < 3,
  active: i === 3,
}));

export function HabitSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: DARK, padding: 'clamp(60px,8vw,90px) clamp(20px,6vw,80px)' }}
    >
      {/* Glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute"
          style={{
            top: '-140px', right: '-140px',
            width: '480px', height: '480px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(45,106,79,0.14) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: '-80px', left: '-60px',
            width: '340px', height: '340px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(202,138,4,0.09) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Esquerda: Tree card ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="flex justify-center"
          >
            <div
              className="flex flex-col items-center gap-3 w-full"
              style={{
                maxWidth: 280,
                background: DARK2,
                border: '1px solid #3D3830',
                borderRadius: 26,
                padding: '28px 24px',
                boxShadow: '0 28px 56px rgba(0,0,0,0.38)',
              }}
            >
              {/* Tree emoji */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                style={{
                  fontSize: 76,
                  filter: 'drop-shadow(0 0 28px rgba(202,138,4,0.38))',
                }}
                aria-label="Árvore da Vida"
                role="img"
              >
                🌳
              </motion.div>

              <p
                className="font-bold tracking-widest uppercase"
                style={{ fontSize: 11, color: GOLD_L, fontFamily: 'var(--font-raleway)', letterSpacing: '0.06em' }}
              >
                Árvore da Vida
              </p>
              <p
                className="font-bold"
                style={{ fontSize: 18, color: '#F0EDE8', fontFamily: 'var(--font-lora)' }}
              >
                Nível 4: Jovem
              </p>

              {/* XP bar */}
              <div className="w-full">
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: 5, background: '#3D3830' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: '72%' } : { width: 0 }}
                    transition={{ duration: 2.4, delay: 0.4, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L})`,
                      borderRadius: 5,
                    }}
                  />
                </div>
                <p
                  className="text-center mt-1"
                  style={{ fontSize: 10, color: 'rgba(240,237,232,0.38)', fontFamily: 'var(--font-raleway)' }}
                >
                  1.350 / 2.000 XP
                </p>
              </div>

              {/* Stage dots */}
              <div className="flex gap-1.5 mt-1">
                {treeDots.map((dot, i) => (
                  <motion.div
                    key={i}
                    animate={dot.active ? { opacity: [1, 0.4, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: dot.filled
                        ? GOLD
                        : dot.active
                          ? GOLD_L
                          : '#3D3830',
                      boxShadow: dot.filled ? '0 0 5px rgba(202,138,4,0.45)' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Direita: Content ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55 }}
              className="mb-6"
            >
              <span
                className="inline-flex items-center gap-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
                style={{ background: 'rgba(45,106,79,0.18)', color: BRAND_L, padding: '5px 13px' }}
              >
                🌱 Hábito espiritual
              </span>
              <h2
                className="font-bold leading-snug"
                style={{
                  fontFamily: 'var(--font-lora)',
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  color: '#F0EDE8',
                }}
              >
                Mais do que conteúdo:{' '}
                <em style={{ fontStyle: 'italic', color: BRAND_L }}>constância</em>
              </h2>
            </motion.div>

            <div className="flex flex-col gap-3">
              {habitItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                  className="flex gap-3.5 rounded-[15px] transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    padding: '18px',
                  }}
                >
                  <span style={{ fontSize: 22, flexShrink: 0 }} aria-hidden="true">{item.icon}</span>
                  <div>
                    <h4
                      className="font-bold mb-1"
                      style={{ fontSize: 14, color: '#F0EDE8', fontFamily: 'var(--font-raleway)' }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{ fontSize: 12, color: 'rgba(240,237,232,0.52)', lineHeight: 1.48, fontFamily: 'var(--font-raleway)' }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Frase */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-7"
              style={{
                borderLeft: `3px solid ${BRAND}`,
                paddingLeft: 18,
                fontFamily: 'var(--font-lora)',
                fontStyle: 'italic',
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                color: BRAND_L,
                lineHeight: 1.6,
              }}
            >
              "Porque fé sem constância vira intenção."
            </motion.p>
          </div>

        </div>
      </div>
    </section>
  );
}
