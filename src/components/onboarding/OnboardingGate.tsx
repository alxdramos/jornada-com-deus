'use client';

import { AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingFlow } from './OnboardingFlow';

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { shouldShowOnboarding } = useOnboarding();

  return (
    <>
      {children}
      <AnimatePresence>
        {shouldShowOnboarding && <OnboardingFlow />}
      </AnimatePresence>
    </>
  );
}
