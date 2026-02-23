'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function MissionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="missao" className="py-20 sm:py-28 gradient-mission" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">

        {/* Ícone decorativo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
            <SproutIcon />
          </div>
        </motion.div>

        {/* Versículo */}
        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-6"
        >
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2937] leading-snug italic">
            "Portanto, ide, fazei discípulos de todas as nações,
            batizando-os em nome do Pai, do Filho e do Espírito Santo."
          </p>
          <footer className="mt-4 text-[#FB923C] font-semibold text-lg">
            Mateus 28:19
          </footer>
        </motion.blockquote>

        {/* Divisor */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-16 h-0.5 bg-gradient-to-r from-[#3FDFB8] to-[#FB923C] mx-auto my-8 rounded-full origin-left"
        />

        {/* Missão */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg sm:text-xl text-[#6B7280] leading-relaxed max-w-2xl mx-auto"
        >
          Nossa missão é ajudar você a crescer como discípulo todos os dias,
          onde quer que esteja. Uma jornada simples, bonita e transformadora —
          da Palavra até o coração.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="grid grid-cols-3 gap-6 mt-12 max-w-lg mx-auto"
        >
          {[
            { value: '66', label: 'Livros da Bíblia' },
            { value: '30+', label: 'Meditações guiadas' },
            { value: '100%', label: 'Gratuito e offline' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-[#FB923C]">{stat.value}</p>
              <p className="text-xs text-[#9CA3AF] mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
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
