'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Download, Wifi, Gift, Heart, CheckCircle2 } from 'lucide-react';

const APP_URL = 'https://app.minhajornadadiaria.com.br';

const perks = [
  { icon: Gift,  text: '100% gratuito' },
  { icon: Wifi,  text: 'Funciona offline' },
  { icon: Heart, text: 'Sem anúncios' },
];

const checks = [
  'Devocional diário com versículo e reflexão',
  'Bíblia offline com todos os 66 livros',
  'Meditações em áudio e diário de oração',
  'Gamificação espiritual — Árvore da Vida',
];

export function CTASection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="comecar" className="relative py-24 sm:py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/site-cta-bg.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#3FDFB8]/88 via-[#10B981]/82 to-[#FB923C]/88" />
      </div>

      {/* Círculos decorativos */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Desktop: 2 colunas | Mobile: centrado */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 xl:gap-24">

          {/* ── Col esquerda: Conteúdo ── */}
          <div className="flex-1 text-center lg:text-left">

            {/* Ícone animado */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-18 h-18 rounded-3xl bg-white/20 backdrop-blur-sm mb-7 shadow-lg"
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
              Pronto para começar
              <br />
              sua jornada?
            </motion.h2>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-white/85 text-lg max-w-lg mx-auto lg:mx-0 mb-7"
            >
              Feito com amor para transformar vidas, uma manhã de cada vez.
            </motion.p>

            {/* Checks — desktop */}
            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="hidden lg:flex flex-col gap-2.5 mb-8"
            >
              {checks.map((c) => (
                <li key={c} className="flex items-center gap-3 text-white/90 text-sm font-medium">
                  <CheckCircle2 size={17} className="text-white shrink-0" />
                  {c}
                </li>
              ))}
            </motion.ul>

            {/* Perks — mobile */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8 lg:mb-8"
            >
              {perks.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/90 text-sm font-medium lg:hidden">
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
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-[#1F2937] font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
              >
                <Download size={22} className="text-[#10B981]" />
                Instalar Gratuitamente
              </a>
            </motion.div>

            {/* Nota */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="mt-4 text-white/60 text-xs text-center lg:text-left"
            >
              Disponível como PWA para iOS, Android e Desktop · Sem necessidade de loja de apps
            </motion.p>
          </div>

          {/* ── Col direita: Phone mockup — apenas desktop ── */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="hidden lg:flex lg:w-72 xl:w-80 shrink-0 justify-center items-end pt-8"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              {/* Phone frame */}
              <div className="w-[220px] h-[440px] xl:w-[240px] xl:h-[480px] rounded-[36px] bg-white/20 backdrop-blur-sm p-[6px] shadow-2xl shadow-black/20 border border-white/30">
                <div className="w-full h-full rounded-[32px] overflow-hidden bg-[#1F2937] relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#1F2937] rounded-b-xl z-10" />
                  <Image
                    src="/images/mockup-oracao-prayer.png"
                    alt="App Minha Jornada Diária"
                    fill
                    className="object-cover object-top"
                    sizes="240px"
                  />
                </div>
              </div>

              {/* Badge flutuante sob o phone */}
              <div className="mt-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-4 py-3 text-center">
                <p className="text-white font-semibold text-sm">🌱 Comece hoje</p>
                <p className="text-white/70 text-xs mt-0.5">Grátis para sempre</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
