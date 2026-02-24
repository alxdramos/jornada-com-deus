'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Download, Wifi, Gift, Heart } from 'lucide-react';

const APP_URL = 'https://app.minhajornadadiaria.com.br';

const perks = [
  { icon: Gift,     text: '100% gratuito' },
  { icon: Wifi,     text: 'Funciona offline' },
  { icon: Heart,    text: 'Sem anúncios' },
];

export function CTASection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="comecar" className="relative py-24 sm:py-32 overflow-hidden" ref={ref}>
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/site-cta-bg.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
        {/* gradient-cta overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3FDFB8]/85 via-[#10B981]/80 to-[#FB923C]/85" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">

        {/* Círculos decorativos de fundo */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        {/* Ícone central animado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm mb-8 shadow-lg"
        >
          <span className="text-4xl" role="img" aria-label="Muda">🌱</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5"
        >
          Pronto para começar<br />
          sua jornada?
        </motion.h2>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-white/80 text-lg max-w-lg mx-auto mb-8"
        >
          Feito com amor para transformar vidas, uma manhã de cada vez.
        </motion.p>

        {/* Perks */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          {perks.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-white/90 text-sm font-medium">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Icon size={12} className="text-white" />
              </div>
              {text}
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.5, type: 'spring', stiffness: 150 }}
        >
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-[#1F2937] font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
          >
            <Download size={22} className="text-[#10B981]" />
            Instalar Minha Jornada Diária
          </a>
        </motion.div>

        {/* Nota */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-5 text-white/60 text-xs"
        >
          Disponível como PWA para iOS, Android e Desktop · Sem necessidade de loja de apps
        </motion.p>
      </div>
    </section>
  );
}
