'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
  { value: '+2.400', label: 'em jornada',           emoji: '✨' },
  { value: '4.9★',  label: 'avaliação',             emoji: '⭐' },
  { value: '30+',   label: 'meditações em áudio',   emoji: '🎧' },
  { value: '66',    label: 'livros da Bíblia',       emoji: '📖' },
  { value: '94%',   label: 'mantêm o hábito',       emoji: '🌱' },
];

export function SocialProofBar() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      className="border-y border-[#E5E7EB] bg-white"
      ref={ref}
      aria-label="Números do app"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="flex flex-wrap items-center justify-center gap-y-5 gap-x-8 sm:gap-x-12 lg:gap-x-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xl leading-none">{stat.emoji}</span>
                <span
                  className="text-2xl font-bold text-[#7C3AED]"
                  style={{ fontFamily: 'var(--font-lora)' }}
                >
                  {stat.value}
                </span>
              </div>
              <p
                className="text-[11px] text-[#9CA3AF] font-medium uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
