'use client';

import { useState, useCallback } from 'react';
import { ActivityType, GamificationState, GAMIFICATION_CONFIG } from '@/types/gamification';

export function useGamification() {
  const [progress, setProgress] = useState<GamificationState | null>(null);
  const [loading, setLoading] = useState(false);

  const trackActivity = useCallback(async (activityType: ActivityType, amount: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch('/api/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityType,
          amount,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Atualizar estado local
        if (progress) {
          setProgress({
            ...progress,
            ...result.updatedProgress,
          });
        }

        return result;
      }
    } catch (error) {
      console.error('Erro ao rastrear atividade:', error);
    } finally {
      setLoading(false);
    }
  }, [progress]);

  return {
    progress,
    loading,
    trackActivity,
  };
}
