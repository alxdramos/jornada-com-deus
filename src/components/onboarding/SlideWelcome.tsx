import Image from 'next/image';
import { motion } from 'framer-motion';

export function SlideWelcome() {
  return (
    <div className="relative flex flex-col h-full">
      {/* Imagem de fundo */}
      <div className="relative flex-1 min-h-0 overflow-hidden rounded-b-3xl">
        <Image
          src="/images/onboarding/onboarding-welcome.png"
          alt="Caminho espiritual"
          fill
          className="object-cover"
          priority
        />
        {/* Gradiente forte na base para garantir legibilidade do texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80" />
      </div>

      {/* Conteúdo sobreposto */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <p className="text-3xl mb-1">🌿</p>
        <h1 className="text-2xl font-bold text-white mb-3 leading-tight drop-shadow-md">
          Sua jornada<br />começa aqui
        </h1>
        <p className="text-sm text-white/85 leading-relaxed max-w-xs mx-auto drop-shadow-sm">
          Um espaço diário de paz, fé e crescimento espiritual — feito para você criar um hábito com Deus.
        </p>
      </motion.div>
    </div>
  );
}
