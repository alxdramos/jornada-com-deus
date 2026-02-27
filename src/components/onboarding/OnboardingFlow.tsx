'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useUserStore } from '@/stores/userStore';
import { SlideWelcome } from './SlideWelcome';
import { SlideFeatures } from './SlideFeatures';
import { SlideNotifications } from './SlideNotifications';
import { SlideInterests } from './SlideInterests';
import { useOnboarding } from '@/hooks/useOnboarding';

const TOTAL_SLIDES = 4;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);

  const user = useUserStore((s) => s.user);
  const { handleComplete, isCompleting } = useOnboarding();
  const { permission, subscribe, isLoading: notifLoading } = usePushNotifications();

  const goNext = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_SLIDES - 1));
  }, []);

  const handleNotifEnable = useCallback(async () => {
    await subscribe(user?.email);
    goNext();
  }, [subscribe, user, goNext]);

  const handleNotifSkip = useCallback(() => {
    goNext();
  }, [goNext]);

  const handleToggleInterest = useCallback((id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const handleFinish = useCallback(async () => {
    await handleComplete(interests.length > 0 ? interests : ['fe']);
  }, [handleComplete, interests]);

  const isLastSlide = step === TOTAL_SLIDES - 1;
  const canProceed = isLastSlide ? interests.length > 0 : true;

  const getCtaLabel = () => {
    if (isLastSlide) return isCompleting ? 'Entrando...' : 'Começar minha jornada 🌿';
    if (step === 0) return 'Explorar o app';
    return 'Continuar';
  };

  const showCta = !(step === 2); // Slide de notificações tem seus próprios botões

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pt-safe pt-4 pb-2 px-6">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <motion.div
            key={i}
            className="h-1.5 rounded-full bg-amber-200 dark:bg-amber-800/40 overflow-hidden"
            animate={{ width: i <= step ? 28 : 8 }}
            transition={{ duration: 0.3 }}
          >
            {i <= step && (
              <motion.div
                className="h-full bg-amber-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.4 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {step === 0 && <SlideWelcome />}
            {step === 1 && <SlideFeatures />}
            {step === 2 && (
              <SlideNotifications
                onEnable={handleNotifEnable}
                onSkip={handleNotifSkip}
                isLoading={notifLoading}
                permission={permission}
              />
            )}
            {step === 3 && (
              <SlideInterests
                selected={interests}
                onToggle={handleToggleInterest}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA button */}
      {showCta && (
        <div className="px-6 pb-safe pb-8 pt-2">
          <motion.button
            onClick={isLastSlide ? handleFinish : goNext}
            disabled={!canProceed || isCompleting}
            className={`
              w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2
              transition-all duration-200 active:scale-95
              ${canProceed
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-200 dark:shadow-amber-900/30'
                : 'bg-muted text-muted-foreground cursor-not-allowed'}
            `}
            whileTap={canProceed ? { scale: 0.97 } : {}}
          >
            {isCompleting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {getCtaLabel()}
                {!isLastSlide && <ChevronRight className="w-4 h-4" />}
              </>
            )}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
