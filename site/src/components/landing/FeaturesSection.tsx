'use client';

import { motion, type Variants } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import {
  Sun, Music2, BookOpen, NotebookPen, TreeDeciduous, WifiOff,
} from 'lucide-react';

const features = [
  {
    icon:   Sun,
    title:  'Devocional do Dia',
    description:
      'Versículo cuidadosamente selecionado + reflexão guiada todas as manhãs. Comece o dia com a Palavra.',
    accent: '#FB923C',
    pale:   '#FEF3E2',
    image:  '/images/site-feature-devocional.png',
  },
  {
    icon:   Music2,
    title:  'Meditação Guiada',
    description:
      'Áudios de meditação cristã com temas como paz, ansiedade, sono e motivação. Player completo offline.',
    accent: '#8B5CF6',
    pale:   '#F5F3FF',
    image:  '/images/site-feature-meditacao.png',
  },
  {
    icon:   BookOpen,
    title:  'Bíblia Offline',
    description:
      'Todos os 66 livros disponíveis sem internet. Leitura fluida, versículo favorito, busca inteligente.',
    accent: '#3B82F6',
    pale:   '#EFF6FF',
    image:  '/images/site-feature-biblia.png',
  },
  {
    icon:   NotebookPen,
    title:  'Diário de Oração',
    description:
      'Registre suas orações, gratidões e reflexões. Um diário espiritual privado e seguro.',
    accent: '#C98989',
    pale:   '#FDF2F2',
    image:  '/images/site-feature-diario.png',
  },
  {
    icon:   TreeDeciduous,
    title:  'Árvore da Vida',
    description:
      'Sua fé visualizada: a Árvore cresce com cada dia de jornada. Streaks, XP e missões espirituais.',
    accent: '#10B981',
    pale:   '#ECFDF5',
    image:  '/images/site-feature-arvore.png',
  },
  {
    icon:   WifiOff,
    title:  'Modo Offline Total',
    description:
      'Instale o app no celular (PWA) e use tudo sem internet — aviões, viagens, serras e praias.',
    accent: '#6B7280',
    pale:   '#F9FAFB',
    image:  '/images/site-feature-offline.png',
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
    <section id="recursos" className="py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-16" ref={ref}>
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
            className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937] leading-tight"
          >
            O que você encontra na<br className="hidden sm:block" />
            <span className="text-[#FB923C]"> Minha Jornada Diária</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-5 text-[#6B7280] text-lg max-w-xl mx-auto leading-relaxed"
          >
            Tudo que você precisa para uma vida espiritual consistente — num só app.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group rounded-2xl border border-[#E5E7EB] bg-[#FDFDFD] overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Image preview */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={feat.image}
                    alt={feat.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: feat.pale }}
                    >
                      <Icon size={20} style={{ color: feat.accent }} />
                    </div>
                    <h3 className="font-bold text-[#1F2937] text-base leading-snug">{feat.title}</h3>
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

