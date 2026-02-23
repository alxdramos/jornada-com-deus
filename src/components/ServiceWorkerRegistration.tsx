'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    let registration: ServiceWorkerRegistration | null = null;

    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none', // Sempre buscar versão atualizada do SW
        });

        // Detectar atualização disponível
        registration.addEventListener('updatefound', () => {
          const newWorker = registration!.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nova versão disponível — avisar usuário
              toast.info('Atualização disponível', {
                description: 'Recarregue para usar a nova versão.',
                action: {
                  label: 'Recarregar',
                  onClick: () => window.location.reload(),
                },
                duration: 10000,
              });
            }
          });
        });
      } catch (err) {
        console.error('[SW] Falha ao registrar service worker:', err);
      }
    };

    // Escutar mensagens do SW (background sync)
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'BACKGROUND_SYNC') {
        // Disparar evento custom para componentes que precisam sincronizar
        window.dispatchEvent(new CustomEvent('sw-background-sync', { detail: event.data }));
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    register();

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  return null;
}
