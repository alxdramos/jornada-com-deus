'use client';

import { motion, type Variants } from 'framer-motion';
import {
  Star, ArrowRight
} from 'lucide-react';

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ── Texto ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
          >
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECFDF5] text-[#10B981] text-xs font-semibold border border-[#10B981]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                PWA Gratuito · Funciona Offline
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-[#1F2937]"
            >
              Minha{' '}
              <span className="text-[#FB923C]">Jornada</span>
              <br />
              Diária com Deus
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-[#6B7280] leading-relaxed max-w-md"
            >
              Encontre paz no seu dia a dia. Transforme seus momentos
              com a Palavra, oração e reflexão.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FB923C] hover:bg-[#F97316] text-white font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Começar minha jornada
                <ArrowRight size={18} />
              </a>
              <a
                href="#recursos"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-[#E5E7EB] bg-white hover:bg-[#FAF9F6] text-[#1F2937] font-medium text-base transition-all duration-200"
              >
                Conhecer os recursos
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {['#FB923C','#10B981','#C98989','#3FDFB8','#F97316'].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
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
          <div className="relative flex justify-center items-center h-[520px] lg:h-[600px]">
            {/* Glow de fundo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 rounded-full bg-[#FB923C]/10 blur-3xl" />
              <div className="absolute w-48 h-48 rounded-full bg-[#10B981]/10 blur-2xl translate-x-20 translate-y-10" />
            </div>

            {/* Phone 1 — Hoje (centro/frente) */}
            <PhoneMockup
              className="absolute z-30"
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              delay={0}
              floatOffset={-14}
              screen={<ScreenHoje />}
            />

            {/* Phone 2 — Meditação (esq/atrás) */}
            <PhoneMockup
              className="absolute z-20 scale-[0.82] opacity-90"
              style={{ left: '4%', top: '12%' }}
              delay={0.15}
              floatOffset={10}
              screen={<ScreenMeditacao />}
            />

            {/* Phone 3 — Bíblia (dir/atrás) */}
            <PhoneMockup
              className="absolute z-20 scale-[0.82] opacity-90"
              style={{ right: '4%', top: '20%' }}
              delay={0.3}
              floatOffset={16}
              screen={<ScreenBiblia />}
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
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
  screen, delay, floatOffset, className, style
}: {
  screen: React.ReactNode;
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
          delay: delay,
        },
      }}
      className={className}
      style={style}
    >
      {/* Frame do telefone */}
      <div className="w-[180px] h-[360px] rounded-[32px] bg-[#1F2937] p-[6px] shadow-2xl">
        {/* Tela */}
        <div className="w-full h-full rounded-[28px] overflow-hidden bg-white relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#1F2937] rounded-b-xl z-10" />
          {screen}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Tela "Hoje" ── */
function ScreenHoje() {
  return (
    <div className="w-full h-full bg-[#FAF9F6] flex flex-col pt-7">
      {/* Header */}
      <div className="px-3 pb-2">
        <p className="text-[7px] text-[#9CA3AF]">Segunda, 24 Fev</p>
        <p className="text-[10px] font-bold text-[#1F2937]">Bom dia, Alexandre ☀️</p>
      </div>
      {/* Streak */}
      <div className="mx-3 mb-2 rounded-xl bg-gradient-to-r from-[#FB923C] to-[#F97316] p-2 text-white">
        <p className="text-[6px] opacity-80">🔥 Sequência</p>
        <p className="text-[11px] font-bold">7 dias seguidos</p>
      </div>
      {/* Versículo do dia */}
      <div className="mx-3 mb-2 rounded-xl border border-[#E5E7EB] bg-white p-2">
        <p className="text-[6px] text-[#FB923C] font-semibold">VERSÍCULO DO DIA</p>
        <p className="text-[7px] text-[#1F2937] leading-relaxed mt-0.5">
          "Posso tudo naquele que me fortalece."
        </p>
        <p className="text-[6px] text-[#9CA3AF] mt-1">Filipenses 4:13</p>
      </div>
      {/* Cards rápidos */}
      <div className="mx-3 grid grid-cols-2 gap-1.5">
        {[
          { icon: '🙏', label: 'Oração', color: '#C98989' },
          { icon: '🎵', label: 'Meditação', color: '#10B981' },
          { icon: '📖', label: 'Bíblia', color: '#3B82F6' },
          { icon: '📔', label: 'Diário', color: '#FB923C' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg p-1.5 flex items-center gap-1"
            style={{ backgroundColor: item.color + '20' }}
          >
            <span className="text-[9px]">{item.icon}</span>
            <span className="text-[6px] font-medium text-[#1F2937]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Tela "Meditação" ── */
function ScreenMeditacao() {
  return (
    <div className="w-full h-full bg-[#1a1035] flex flex-col pt-7 items-center">
      <p className="text-[7px] text-[#9CA3AF] mb-1">Meditação</p>
      {/* Capa */}
      <div className="w-20 h-24 rounded-xl bg-gradient-to-b from-[#8B5CF6] to-[#10B981] flex items-center justify-center mb-2 shadow-lg">
        <span className="text-2xl">🌿</span>
      </div>
      <p className="text-[9px] text-white font-semibold text-center px-2">Paz que Excede</p>
      <p className="text-[6px] text-[#9CA3AF] mt-0.5">5 min • Paz e Tranquilidade</p>
      {/* Progress */}
      <div className="w-24 mt-3 flex flex-col items-center gap-1.5">
        <div className="w-full h-0.5 bg-white/20 rounded-full overflow-hidden">
          <div className="w-2/5 h-full bg-[#FB923C] rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[8px] text-white/50">1:54</span>
          {/* Play */}
          <div className="w-7 h-7 rounded-full bg-[#FB923C] flex items-center justify-center shadow">
            <span className="text-white text-[8px] ml-0.5">▶</span>
          </div>
          <span className="text-[8px] text-white/50">5:00</span>
        </div>
      </div>
    </div>
  );
}

/* ── Tela "Bíblia" ── */
function ScreenBiblia() {
  return (
    <div className="w-full h-full bg-white flex flex-col pt-7">
      <div className="px-3 flex items-center justify-between mb-2">
        <div>
          <p className="text-[8px] font-bold text-[#1F2937]">João 3</p>
          <p className="text-[6px] text-[#9CA3AF]">Novo Testamento</p>
        </div>
        <span className="text-[6px] bg-[#E0F2FE] text-[#3B82F6] px-1.5 py-0.5 rounded-full font-medium">NVI</span>
      </div>
      <div className="px-3 space-y-1.5 overflow-hidden">
        {[
          { v: '14', t: '"Como Moisés levantou a serpente no deserto..."' },
          { v: '15', t: '"...para que todo o que nele crer tenha a vida eterna."' },
          { v: '16', t: '"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito..."' },
        ].map((item) => (
          <div key={item.v} className="flex gap-1.5">
            <span className="text-[6px] font-bold text-[#FB923C] w-3 shrink-0 pt-0.5">{item.v}</span>
            <p className="text-[6px] text-[#4B5563] leading-relaxed">{item.t}</p>
          </div>
        ))}
      </div>
      {/* Bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-white border-t border-[#F3F4F6] flex items-center justify-around px-2">
        {['☀️','🔍','📖','🙏','👤'].map((icon, i) => (
          <span key={i} className={`text-[10px] ${i === 2 ? 'scale-125' : 'opacity-40'}`}>{icon}</span>
        ))}
      </div>
    </div>
  );
}
