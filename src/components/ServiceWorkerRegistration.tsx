'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

const SYNC_TAGS = ['sync-progress', 'background-sync-prayers', 'background-sync-journal'];

async function registerSyncTags() {
  try {
    const reg = await navigator.serviceWorker.ready;
    if (!('sync' in reg)) return; // Background Sync API não suportada
    await Promise.all(SYNC_TAGS.map((tag) => (reg as ServiceWorkerRegistration & { sync: { register(tag: string): Promise<void> } }).sync.register(tag)));
    console.log('[SW] Background sync tags registradas:', SYNC_TAGS);
  } catch (err) {
    // Não crítico — o path window.online/offline ainda funciona
    console.warn('[SW] Background sync não disponível:', err);
  }
}

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    let registration: ServiceWorkerRegistration | null = null;

    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        });

        // Detectar atualização disponível
        registration.addEventListener('updatefound', () => {
          const newWorker = registration!.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
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

    // Escutar mensagens do SW (background sync → despacha evento para useSyncManager)
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'BACKGROUND_SYNC') {
        window.dispatchEvent(new CustomEvent('sw-background-sync', { detail: event.data }));
      }
    };

    // Registrar sync tags quando o app fica offline
    // O SW vai dispará-las automaticamente quando a conectividade voltar
    const handleOffline = () => {
      registerSyncTags();
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    window.addEventListener('offline', handleOffline);
    register();

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
}
