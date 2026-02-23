'use client';

import { motion, type Variants } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Sun, Music2, BookOpen, NotebookPen, TreeDeciduous, WifiOff,
} from 'lucide-react';

const features = [
  {
    icon:  Sun,
    title: 'Devocional do Dia',
    description:
      'Versículo cuidadosamente selecionado + reflexão guiada todas as manhãs. Comece o dia com a Palavra.',
    accent: '#FB923C',
    pale:   '#FEF3E2',
    mockup: <MockupDevocional />,
  },
  {
    icon:  Music2,
    title: 'Meditação Guiada',
    description:
      'Áudios de meditação cristã com temas como paz, ansiedade, sono e motivação. Player completo offline.',
    accent: '#8B5CF6',
    pale:   '#F5F3FF',
    mockup: <MockupMeditacao />,
  },
  {
    icon:  BookOpen,
    title: 'Bíblia Offline',
    description:
      'Todos os 66 livros disponíveis sem internet. Leitura fluida, versículo favorito, busca inteligente.',
    accent: '#3B82F6',
    pale:   '#EFF6FF',
    mockup: <MockupBiblia />,
  },
  {
    icon:  NotebookPen,
    title: 'Diário de Oração',
    description:
      'Registre suas orações, gratidões e reflexões. Um diário espiritual privado e seguro.',
    accent: '#C98989',
    pale:   '#FDF2F2',
    mockup: <MockupDiario />,
  },
  {
    icon:  TreeDeciduous,
    title: 'Árvore da Vida',
    description:
      'Sua fé visualizada: a Árvore cresce com cada dia de jornada. Streaks, XP e missões espirituais.',
    accent: '#10B981',
    pale:   '#ECFDF5',
    mockup: <MockupArvore />,
  },
  {
    icon:  WifiOff,
    title: 'Modo Offline Total',
    description:
      'Instale o app no celular (PWA) e use tudo sem internet — aviões, viagens, serras e praias.',
    accent: '#6B7280',
    pale:   '#F9FAFB',
    mockup: <MockupOffline />,
  },
];

const containerVariants: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0 },
};

export function FeaturesSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="recursos" className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14" ref={ref}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-xs font-semibold tracking-widest text-[#FB923C] uppercase"
          >
            Recursos do app
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-3 text-3xl sm:text-4xl font-bold text-[#1F2937]"
          >
            O que você encontra na<br className="hidden sm:block" />
            <span className="text-[#FB923C]"> Minha Jornada Diária</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 text-[#6B7280] text-lg max-w-xl mx-auto"
          >
            Tudo que você precisa para uma vida espiritual consistente — num só app.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group rounded-2xl border border-[#E5E7EB] bg-[#FDFDFD] overflow-hidden hover:shadow-md transition-all"
              >
                {/* Mini mockup preview */}
                <div
                  className="h-36 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: feat.pale }}
                >
                  {feat.mockup}
                </div>

                {/* Conteúdo */}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: feat.pale }}
                    >
                      <Icon size={18} style={{ color: feat.accent }} />
                    </div>
                    <h3 className="font-bold text-[#1F2937] text-base">{feat.title}</h3>
                  </div>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Mini mockups para cada feature ── */
function MockupDevocional() {
  return (
    <div className="w-32 h-20 rounded-xl bg-white shadow-sm p-2 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-md bg-[#FEF3E2] flex items-center justify-center text-[7px]">☀️</div>
        <div className="h-1.5 w-16 rounded bg-[#FB923C]/20" />
      </div>
      <div className="h-1 w-full rounded bg-[#F3F4F6]" />
      <div className="h-1 w-4/5 rounded bg-[#F3F4F6]" />
      <div className="h-1 w-3/5 rounded bg-[#F3F4F6]" />
      <div className="mt-1 h-3 w-14 rounded-full bg-[#FB923C] flex items-center justify-center">
        <span className="text-white text-[5px] font-bold">LER MAIS</span>
      </div>
    </div>
  );
}

function MockupMeditacao() {
  return (
    <div className="w-32 h-20 rounded-xl bg-[#1a1035] shadow-sm p-2 flex flex-col items-center gap-1.5">
      <div className="w-10 h-12 rounded-lg bg-gradient-to-b from-[#8B5CF6] to-[#10B981] flex items-center justify-center">
        <span className="text-[12px]">🌿</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="text-[7px] text-purple-300">▶</div>
        <div className="w-14 h-0.5 bg-white/20 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-[#8B5CF6]" />
        </div>
      </div>
    </div>
  );
}

function MockupBiblia() {
  return (
    <div className="w-32 h-20 rounded-xl bg-white shadow-sm p-2">
      <div className="flex justify-between mb-1">
        <div className="h-1.5 w-10 rounded bg-[#3B82F6]/30" />
        <div className="h-1.5 w-6 rounded bg-[#EFF6FF]" />
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-1 mb-0.5">
          <div className="w-2 h-1 rounded bg-[#3B82F6]/40 shrink-0" />
          <div className={`h-1 rounded bg-[#F3F4F6] flex-1`} style={{ width: `${75 + i * 5}%` }} />
        </div>
      ))}
    </div>
  );
}

function MockupDiario() {
  return (
    <div className="w-32 h-20 rounded-xl bg-white shadow-sm p-2">
      <div className="flex items-center gap-1 mb-1.5">
        <div className="w-3 h-3 rounded bg-[#FDF2F2] flex items-center justify-center text-[6px]">📔</div>
        <div className="h-1.5 w-12 rounded bg-[#C98989]/30" />
      </div>
      <div className="space-y-0.5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-1 rounded bg-[#F3F4F6]" style={{ width: `${60 + i * 10}%` }} />
        ))}
      </div>
      <div className="mt-2 h-2.5 w-8 rounded-full bg-[#C98989] flex items-center justify-center">
        <span className="text-white text-[4px]">Salvar</span>
      </div>
    </div>
  );
}

function MockupArvore() {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        {/* Copa */}
        <div className="w-16 h-12 rounded-full bg-gradient-to-b from-[#3FDFB8] to-[#10B981] flex items-center justify-center shadow-sm">
          <span className="text-2xl">🌳</span>
        </div>
        {/* Estrelas ao redor */}
        <div className="absolute -top-1 -right-1 text-[8px]">✨</div>
        <div className="absolute top-1 -left-2 text-[7px]">⭐</div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[8px] text-[#FB923C] font-bold">🔥 7</span>
        <div className="w-14 h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
          <div className="w-3/5 h-full rounded-full bg-gradient-to-r from-[#3FDFB8] to-[#10B981]" />
        </div>
      </div>
    </div>
  );
}

function MockupOffline() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center">
        <WifiOff size={22} className="text-[#6B7280]" />
      </div>
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white shadow-sm">
        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
        <span className="text-[8px] text-[#1F2937] font-medium">Funcionando offline</span>
      </div>
    </div>
  );
}
