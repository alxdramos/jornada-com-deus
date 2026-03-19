'use client';

import { useReportWebVitals } from 'next/dist/client/web-vitals';
import * as Sentry from '@sentry/nextjs';

/**
 * B14 — Web Vitals tracking → Sentry
 * Captura CLS, LCP, INP, FCP, TTFB e reporta os degradados ao Sentry.
 * Só envia métricas com rating 'needs-improvement' ou 'poor' para evitar ruído.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== 'production') return;
    if (metric.rating === 'good') return;

    Sentry.captureEvent({
      message: `Web Vital: ${metric.name} = ${Math.round(metric.value)}`,
      level: metric.rating === 'poor' ? 'warning' : 'info',
      tags: {
        'web_vital.name': metric.name,
        'web_vital.rating': metric.rating,
      },
      extra: {
        value: metric.value,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      },
    });
  });

  return null;
}
