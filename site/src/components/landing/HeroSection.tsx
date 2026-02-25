'use client';

import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
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

export function HeroSection() {
  return (
    <section
      id="hero"
      className="gradient-hero min-h-screen flex flex-col justify-center pt-20 pb-16 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Texto ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6 text-center lg:text-left"
          >
            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight text-[#1F2937]"
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
              com a Palavra, oração e reflexão.
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
              className="flex items-center gap-3 pt-2 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                {['#FB923C','#10B981','#C98989','#3FDFB8','#F97316'].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: c }}
                  >
                    {['M','A','L','G','R'][i]}
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
          </motion.div>

          {/* ── Mockups ── */}
          <div className="relative flex justify-center items-center h-[480px] sm:h-[540px] lg:h-[620px] w-full">

            {/* Glow de fundo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#FB923C]/10 blur-3xl" />
              <div className="absolute w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-[#10B981]/10 blur-2xl translate-x-16 translate-y-8" />
            </div>

            {/* Phone 2 — Estudo Bíblico (esq/atrás) — oculto no mobile */}
            <PhoneMockup
              className="absolute z-20 hidden sm:block"
              style={{ left: '2%', top: '10%', transform: 'scale(0.80)', transformOrigin: 'top left', opacity: 0.88 }}
              delay={0.2}
              floatOffset={12}
              imageSrc="/images/mockup-estudo-biblico.png"
              imageAlt="Estudo Bíblico"
            />

            {/* Phone 1 — Oração (centro/frente) */}
            <PhoneMockup
              className="absolute z-30"
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -52%)' }}
              delay={0}
              floatOffset={-14}
              imageSrc="/images/mockup-oracao-prayer.png"
              imageAlt="Oração"
            />

            {/* Phone 3 — Bíblia (dir/atrás) — oculto no mobile */}
            <PhoneMockup
              className="absolute z-20 hidden sm:block"
              style={{ right: '2%', top: '18%', transform: 'scale(0.80)', transformOrigin: 'top right', opacity: 0.88 }}
              delay={0.35}
              floatOffset={18}
              imageSrc="/images/mockup-biblia-scripture.png"
              imageAlt="Bíblia"
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex flex-col items-center gap-2 mt-10"
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

/* ── Phone frame com imagem real ── */
function PhoneMockup({
  imageSrc, imageAlt, delay, floatOffset, className, style,
}: {
  imageSrc: string;
  imageAlt: string;
  delay: number;
  floatOffset: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: [0, floatOffset, 0],
        scale: 1,
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
      className={className}
      style={style}
    >
      {/* Frame do telefone */}
      <div className="w-[180px] h-[360px] rounded-[32px] bg-[#1F2937] p-[6px] shadow-2xl shadow-black/30">
        {/* Tela */}
        <div className="w-full h-full rounded-[28px] overflow-hidden bg-[#1F2937] relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#1F2937] rounded-b-xl z-10" />
          {/* Imagem real */}
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover object-top"
            sizes="180px"
          />
        </div>
      </div>
    </motion.div>
  );
}
