'use client';

import { motion, type Variants } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import {
  Sun, Music2, BookOpen, NotebookPen, TreeDeciduous, Bell,
} from 'lucide-react';

const features = [
  {
    icon:        Sun,
    title:       'Devocional do Dia',
    description: 'Versículo cuidadosamente selecionado + reflexão guiada todas as manhãs. Comece o dia com a Palavra e transforme sua rotina espiritual.',
    accent:      '#FB923C',
    pale:        '#FEF3E2',
    image:       '/images/site-feature-devocional.png',
  },
  {
    icon:        Music2,
    title:       'Meditação Guiada',
    description: 'Áudios de meditação cristã com temas como paz, ansiedade, sono e motivação. Player completo com controle de velocidade e timer.',
    accent:      '#8B5CF6',
    pale:        '#F5F3FF',
    image:       '/images/site-feature-meditacao.png',
  },
  {
    icon:        BookOpen,
    title:       'Bíblia Completa',
    description: 'Todos os 66 livros à disposição. Leitura fluida, versículos favoritos e busca inteligente para aprofundar sua fé.',
    accent:      '#3B82F6',
    pale:        '#EFF6FF',
    image:       '/images/site-feature-biblia.png',
  },
  {
    icon:        NotebookPen,
    title:       'Diário de Oração',
    description: 'Registre suas orações, gratidões e reflexões. Um diário espiritual privado e seguro, sempre à mão.',
    accent:      '#C98989',
    pale:        '#FDF2F2',
    image:       '/images/site-feature-diario.png',
  },
  {
    icon:        TreeDeciduous,
    title:       'Árvore da Vida',
    description: 'Sua fé visualizada: a Árvore cresce com cada dia de jornada. Streaks, XP e missões espirituais que tornam o hábito irresistível.',
    accent:      '#10B981',
    pale:        '#ECFDF5',
    image:       '/images/site-feature-arvore.png',
  },
  {
    icon:        Bell,
    title:       'Lembretes Diários',
    description: 'Configure notificações personalizadas para manter sua rotina espiritual. Lembretes gentis que convidam você a pausar e se conectar com Deus.',
    accent:      '#F59E0B',
    pale:        '#FFFBEB',
    image:       '/images/site-feature-offline.png',
  },
];

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

/* Primeiras 3 features: layout alternado (showcase) no desktop */
const SHOWCASE = features.slice(0, 3);
/* Últimas 3: grid de cards */
const CARDS    = features.slice(3);

export function FeaturesSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

  return (
    <section id="recursos" className="py-24 sm:py-32 bg-white scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-20" ref={headerRef}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            className="text-xs font-semibold tracking-widest text-[#FB923C] uppercase"
          >
            Recursos do app
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937] leading-tight"
          >
            O que você encontra na
            <br className="hidden sm:block" />
            <span className="text-[#FB923C]"> Minha Jornada Diária</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-5 text-[#6B7280] text-lg max-w-xl mx-auto leading-relaxed"
          >
            Tudo que você precisa para uma vida espiritual consistente — num só app.
          </motion.p>
        </div>

        {/* ── Showcase alternado — desktop ── */}
        <div className="hidden lg:flex flex-col gap-20 mb-20">
          {SHOWCASE.map((feat, i) => {
            const Icon = feat.icon;
            const isEven = i % 2 === 0;
            return (
              <ShowcaseRow key={feat.title} feat={feat} Icon={Icon} imageLeft={!isEven} index={i} />
            );
          })}
        </div>

        {/* ── Grid de cards — mobile (todos) + desktop (últimos 3) ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mobile: mostra todos os features como cards */}
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <FeatureCard key={feat.title + '-card'} feat={feat} Icon={Icon} index={i} mobileOnly={i < 3} />
            );
          })}
        </div>

      </div>
    </section>
  );
}

/* Linha de showcase alternada — apenas desktop */
function ShowcaseRow({
  feat, Icon, imageLeft, index,
}: {
  feat: typeof features[0];
  Icon: React.ElementType;
  imageLeft: boolean;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.05 }}
      className={`flex items-center gap-12 xl:gap-20 ${imageLeft ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Texto */}
      <div className="flex-1">
        <div
          className="inline-flex items-center gap-3 px-4 py-2 rounded-xl mb-6"
          style={{ backgroundColor: feat.pale }}
        >
          <Icon size={20} style={{ color: feat.accent }} />
          <span className="font-semibold text-sm" style={{ color: feat.accent }}>
            {feat.title}
          </span>
        </div>
        <h3 className="text-2xl xl:text-3xl font-bold text-[#1F2937] leading-snug mb-4">
          {feat.title}
        </h3>
        <p className="text-[#6B7280] text-lg leading-relaxed max-w-md">
          {feat.description}
        </p>
        <div className="mt-6 w-12 h-1 rounded-full" style={{ backgroundColor: feat.accent }} />
      </div>

      {/* Imagem */}
      <div className="w-[45%] xl:w-[42%] shrink-0">
        <div className="relative h-72 xl:h-80 rounded-2xl overflow-hidden shadow-xl border border-[#E5E7EB] group">
          <Image
            src={feat.image}
            alt={feat.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 1280px) 45vw, 580px"
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{ background: `linear-gradient(135deg, ${feat.accent}33, transparent)` }}
          />
          {/* Step badge */}
          <div
            className="absolute top-4 left-4 w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg"
            style={{ backgroundColor: feat.accent }}
          >
            {index + 1}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* Card padrão */
function FeatureCard({
  feat, Icon, index, mobileOnly,
}: {
  feat: typeof features[0];
  Icon: React.ElementType;
  index: number;
  mobileOnly: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={{ delay: (index % 3) * 0.08 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`group rounded-2xl border border-[#E5E7EB] bg-[#FDFDFD] overflow-hidden hover:shadow-lg transition-all duration-300 ${mobileOnly ? 'lg:hidden' : ''}`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={feat.image}
          alt={feat.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: feat.pale }}
          >
            <Icon size={20} style={{ color: feat.accent }} />
          </div>
          <h3 className="font-bold text-[#1F2937] text-base leading-snug">{feat.title}</h3>
        </div>
        <p className="text-sm text-[#6B7280] leading-relaxed">{feat.description}</p>
      </div>
    </motion.div>
  );
}
