'use client';

import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Star, BookOpen, Music2, TreeDeciduous, NotebookPen } from 'lucide-react';
import Image from 'next/image';

const APP_URL = 'https://app.minhajornadadiaria.com.br';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0 },
};

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

const avatars = [
  { letter: 'M', color: '#FB923C' },
  { letter: 'A', color: '#10B981' },
  { letter: 'L', color: '#C98989' },
  { letter: 'G', color: '#3FDFB8' },
  { letter: 'R', color: '#F97316' },
];

const floatingChips = [
  { icon: BookOpen,      label: 'Bíblia Completa',  color: '#3B82F6', pale: '#EFF6FF', delay: 0.9 },
  { icon: Music2,        label: 'Meditação Guiada', color: '#8B5CF6', pale: '#F5F3FF', delay: 1.05 },
  { icon: TreeDeciduous, label: 'Árvore da Vida',   color: '#10B981', pale: '#ECFDF5', delay: 1.2 },
  { icon: NotebookPen,   label: 'Diário de Oração', color: '#C98989', pale: '#FDF2F2', delay: 1.35 },
];

export function HeroSection() {
  return (
    <section
      id="hero"
      className="gradient-hero min-h-screen flex flex-col justify-center pt-20 pb-12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">

          {/* ── Col esquerda: Texto ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6 text-center lg:text-left"
          >
            {/* Badge pill */}
            <motion.div variants={fadeUp} className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3E2] border border-[#FB923C]/30 text-[#FB923C] text-xs font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] animate-pulse" />
                Devocional · Meditação · Bíblia · Oração
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.06] tracking-tight text-[#1F2937]"
            >
              Minha{' '}
              <span className="text-[#FB923C]">Jornada</span>
              <br />
              Diária com Deus
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-[#6B7280] leading-relaxed max-w-md mx-auto lg:mx-0"
            >
              Encontre paz no seu dia a dia. Transforme seus momentos
              com a Palavra, oração e reflexão guiada.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#FB923C] hover:bg-[#F97316] text-white font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Começar minha jornada
                <ArrowRight size={18} />
              </a>
              <a
                href="#recursos"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border border-[#E5E7EB] bg-white hover:bg-[#FAF9F6] text-[#1F2937] font-medium text-base transition-all duration-200"
              >
                Conhecer os recursos
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 pt-1 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                {avatars.map((a, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: a.color }}
                  >
                    {a.letter}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-[#FB923C] text-[#FB923C]" />
                  ))}
                </div>
                <p className="text-xs text-[#6B7280]">+2.400 pessoas em jornada</p>
              </div>
            </motion.div>

            {/* Feature chips — mobile list */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-2 justify-center lg:hidden"
            >
              {floatingChips.map((chip) => {
                const Icon = chip.icon;
                return (
                  <div
                    key={chip.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] shadow-sm"
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center"
                      style={{ backgroundColor: chip.pale }}
                    >
                      <Icon size={11} style={{ color: chip.color }} />
                    </div>
                    <span className="text-xs font-medium text-[#4B5563]">{chip.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* ── Col direita: Mockups ── */}
          <div className="relative flex justify-center items-center h-[460px] sm:h-[560px] lg:h-[660px] xl:h-[700px] w-full">

            {/* Glow de fundo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 sm:w-96 sm:h-96 lg:w-[440px] lg:h-[440px] rounded-full bg-[#FB923C]/10 blur-3xl" />
              <div className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#10B981]/10 blur-2xl translate-x-16 translate-y-8" />
            </div>

            {/* Phone 2 — Estudo Bíblico (esq/atrás) */}
            <PhoneMockup
              className="absolute z-20 hidden sm:block"
              positionClass="left-0 top-[8%]"
              sizeClass="w-[168px] h-[336px] lg:w-[190px] lg:h-[380px]"
              delay={0.2}
              floatOffset={10}
              imageSrc="/images/mockup-estudo-biblico.png"
              imageAlt="Estudo Bíblico"
              scale={0.9}
              opacity={0.85}
            />

            {/* Phone 1 — Oração (centro/frente) */}
            <PhoneMockup
              className="absolute z-30"
              positionClass="left-1/2 top-1/2 -translate-x-1/2 -translate-y-[52%]"
              sizeClass="w-[200px] h-[400px] lg:w-[224px] lg:h-[448px] xl:w-[240px] xl:h-[480px]"
              delay={0}
              floatOffset={-14}
              imageSrc="/images/mockup-oracao-prayer.png"
              imageAlt="Oração"
              scale={1}
              opacity={1}
            />

            {/* Phone 3 — Bíblia (dir/atrás) */}
            <PhoneMockup
              className="absolute z-20 hidden sm:block"
              positionClass="right-0 top-[16%]"
              sizeClass="w-[168px] h-[336px] lg:w-[190px] lg:h-[380px]"
              delay={0.35}
              floatOffset={18}
              imageSrc="/images/mockup-biblia-scripture.png"
              imageAlt="Bíblia"
              scale={0.9}
              opacity={0.85}
            />

            {/* Floating chips — desktop only */}
            {floatingChips.map((chip, i) => {
              const Icon = chip.icon;
              const positions = [
                'right-[-10px] top-[18%]',
                'right-[-24px] top-[48%]',
                'right-[-8px] bottom-[18%]',
                'left-[-24px] top-[38%]',
              ];
              return (
                <motion.div
                  key={chip.label}
                  initial={{ opacity: 0, x: i < 3 ? 16 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: chip.delay, duration: 0.45 }}
                  className={`absolute hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white shadow-lg border border-[#E5E7EB] z-40 ${positions[i]}`}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: chip.pale }}
                  >
                    <Icon size={14} style={{ color: chip.color }} />
                  </div>
                  <span className="text-xs font-semibold text-[#1F2937] whitespace-nowrap">
                    {chip.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="flex flex-col items-center gap-2 mt-8"
      >
        <p className="text-xs text-[#9CA3AF]">Role para conhecer</p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border-2 border-[#D1D5DB] flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 rounded-full bg-[#9CA3AF]" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Phone frame ── */
function PhoneMockup({
  imageSrc, imageAlt, delay, floatOffset, className, positionClass, sizeClass, scale, opacity,
}: {
  imageSrc: string;
  imageAlt: string;
  delay: number;
  floatOffset: number;
  className?: string;
  positionClass: string;
  sizeClass: string;
  scale: number;
  opacity: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{
        opacity,
        y: [0, floatOffset, 0],
        scale,
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale:   { duration: 0.6, delay },
        y: {
          repeat: Infinity,
          duration: 4 + delay,
          ease: 'easeInOut',
          delay,
        },
      }}
      className={`${className} ${positionClass}`}
    >
      <div className={`${sizeClass} rounded-[32px] bg-[#1F2937] p-[6px] shadow-2xl shadow-black/30`}>
        <div className="w-full h-full rounded-[28px] overflow-hidden bg-[#1F2937] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#1F2937] rounded-b-xl z-10" />
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover object-top"
            sizes="240px"
          />
        </div>
      </div>
    </motion.div>
  );
}
