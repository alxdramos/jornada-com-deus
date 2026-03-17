'use client';

import { useCallback } from 'react';

/** Gera ou recupera o session_id desta sessão de navegador (sessionStorage). */
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  const key = '__jornada_sid';
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

/**
 * Hook central de analytics comportamental.
 * Fire-and-forget: nunca bloqueia a UI, erros são silenciados.
 */
export function useAnalytics() {
  const trackEvent = useCallback(
    (name: string, properties: Record<string, unknown> = {}) => {
      const session_id = getSessionId();
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_name: name, properties, session_id }),
      }).catch((err) => console.warn('[analytics] erro silenciado:', err));
    },
    []
  );

  // ── Eventos tipados ────────────────────────────────────────────────────────

  const trackMeditationStarted = useCallback(
    (id: string, title: string) => trackEvent('meditation_started', { id, title }),
    [trackEvent]
  );

  const trackMeditationCompleted = useCallback(
    (id: string, title: string) => trackEvent('meditation_completed', { id, title }),
    [trackEvent]
  );

  const trackPrayerStarted = useCallback(
    (id: string, title: string) => trackEvent('prayer_started', { id, title }),
    [trackEvent]
  );

  const trackPaywallShown = useCallback(
    (source?: string) => trackEvent('paywall_shown', { source: source ?? 'unknown' }),
    [trackEvent]
  );

  const trackPurchaseClicked = useCallback(
    (plan: string) => trackEvent('purchase_clicked', { plan }),
    [trackEvent]
  );

  return {
    trackEvent,
    trackMeditationStarted,
    trackMeditationCompleted,
    trackPrayerStarted,
    trackPaywallShown,
    trackPurchaseClicked,
  };
}
