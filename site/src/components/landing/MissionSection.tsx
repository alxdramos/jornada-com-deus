'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
  { value: '66',   label: 'Livros da Bíblia',    emoji: '📖' },
  { value: '30+',  label: 'Meditações guiadas',   emoji: '🎧' },
  { value: '100%', label: 'Gratuito e offline',   emoji: '🌐' },
];

export function MissionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="missao" className="py-24 sm:py-32 gradient-mission scroll-mt-16" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Layout: stacked on mobile, 2-col on desktop */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-20 xl:gap-28">

          {/* ── Col esquerda: Ícone + Versículo + Missão ── */}
          <div className="flex-1 text-center lg:text-left">

            {/* Ícone */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="flex justify-center lg:justify-start mb-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                <SproutIcon />
              </div>
            </motion.div>

            {/* Versículo */}
            <motion.blockquote
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-8"
            >
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2937] leading-snug italic">
                "Portanto, ide, fazei discípulos de todas as nações,
                batizando-os em nome do Pai, do Filho e do Espírito Santo."
              </p>
              <footer className="mt-5 text-[#FB923C] font-semibold text-xl">
                Mateus 28:19
              </footer>
            </motion.blockquote>

            {/* Divisor */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-20 h-0.5 bg-gradient-to-r from-[#3FDFB8] to-[#FB923C] mb-8 rounded-full origin-left mx-auto lg:mx-0"
            />

            {/* Missão */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-[#4B5563] leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Nossa missão é ajudar você a crescer como discípulo todos os dias,
              onde quer que esteja. Uma jornada simples, bonita e transformadora —
              da Palavra até o coração.
            </motion.p>
          </div>

          {/* ── Col direita: Stats cards ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-16 lg:mt-0 lg:w-72 xl:w-80 shrink-0"
          >
            {/* Mobile: 3 cols; Desktop: stacked cards */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-5 lg:p-6 text-center lg:text-left lg:flex lg:items-center lg:gap-5 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow duration-300"
                >
                  <span className="text-3xl hidden lg:block">{stat.emoji}</span>
                  <div>
                    <p className="text-3xl lg:text-4xl font-bold text-[#FB923C] leading-none">
                      {stat.value}
                    </p>
                    <p className="text-xs lg:text-sm text-[#6B7280] mt-1.5 font-medium leading-snug">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: extra card de destaque */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="hidden lg:flex mt-5 items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#FEF3E2] to-[#ECFDF5] border border-[#FB923C]/20"
            >
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-xl">🌱</span>
              </div>
              <div>
                <p className="font-semibold text-[#1F2937] text-sm">Jornada que floresce</p>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                  Cada dia é um passo no seu crescimento espiritual.
                </p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function SproutIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 24V12" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
      <path d="M14 16 C14 11 8 8 8 8 C8 8 8 14 14 16Z" fill="#10B981"/>
      <path d="M14 16 C14 11 20 8 20 8 C20 8 20 14 14 16Z" fill="#3FDFB8"/>
      <circle cx="14" cy="24" r="2" fill="#10B981" opacity="0.3"/>
    </svg>
  );
}
