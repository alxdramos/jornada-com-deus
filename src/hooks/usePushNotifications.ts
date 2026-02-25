'use client';

import { useState, useEffect, useCallback } from 'react';

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

interface UsePushNotificationsReturn {
  permission: PermissionState;
  isSubscribed: boolean;
  isLoading: boolean;
  subscribe: (userId?: string) => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  isSupported: boolean;
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; i++) {
    view[i] = rawData.charCodeAt(i);
  }
  return buffer;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [permission, setPermission] = useState<PermissionState>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isSupported =
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window;

  // Verificar estado inicial
  useEffect(() => {
    if (!isSupported) {
      setPermission('unsupported');
      return;
    }

    setPermission(Notification.permission as PermissionState);

    // Verificar se já existe subscription ativa
    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((sub) => {
        setIsSubscribed(!!sub);
      });
    });
  }, [isSupported]);

  const subscribe = useCallback(
    async (userId?: string): Promise<boolean> => {
      if (!isSupported) return false;

      setIsLoading(true);
      try {
        // 1. Pedir permissão ao browser
        const result = await Notification.requestPermission();
        setPermission(result as PermissionState);

        if (result !== 'granted') return false;

        // 2. Obter registration do SW
        const registration = await navigator.serviceWorker.ready;

        // 3. Criar subscription no browser
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });

        // 4. Salvar no backend
        const res = await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: subscription.toJSON(), userId }),
        });

        if (!res.ok) {
          await subscription.unsubscribe();
          return false;
        }

        setIsSubscribed(true);
        return true;
      } catch (err) {
        console.error('[usePushNotifications] Erro ao subscrever:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isSupported]
  );

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        setIsSubscribed(false);
        return true;
      }

      // Remover do backend
      await fetch('/api/push/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      // Cancelar no browser
      await subscription.unsubscribe();
      setIsSubscribed(false);
      return true;
    } catch (err) {
      console.error('[usePushNotifications] Erro ao cancelar:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  return { permission, isSubscribed, isLoading, subscribe, unsubscribe, isSupported };
}
