'use client';

import { useState, useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import { supabase } from '@/lib/supabase';

export function useOnboarding() {
  const user = useUserStore((s) => s.user);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const [isCompleting, setIsCompleting] = useState(false);

  const shouldShowOnboarding =
    !!user && !user.hasCompletedOnboarding;

  const handleComplete = useCallback(
    async (interests: string[]) => {
      setIsCompleting(true);
      try {
        // 1. Atualizar store local imediatamente (UX instantânea)
        completeOnboarding(interests);

        // 2. Persistir no Supabase em background
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          await supabase
            .from('profiles')
            .update({ has_completed_onboarding: true, interests })
            .eq('id', authUser.id);
        }
      } catch (err) {
        console.error('[useOnboarding] Erro ao salvar onboarding:', err);
        // Não reverter — store local já foi atualizado
      } finally {
        setIsCompleting(false);
      }
    },
    [completeOnboarding]
  );

  return { shouldShowOnboarding, handleComplete, isCompleting };
}
