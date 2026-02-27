import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Captura 100% das transações em dev, 10% em prod para não explodir a cota
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session Replay: 10% das sessões normais, 100% das sessões com erro
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,      // mantém texto visível (app não tem dados sensíveis PII no UI)
      blockAllMedia: false,
    }),
  ],

  // Não envia erros em desenvolvimento
  enabled: process.env.NODE_ENV === "production",

  // Ignora erros esperados / ruído
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    "Non-Error promise rejection captured",
    /^Network Error/,
    /^ChunkLoadError/,
    "AbortError",
  ],

  beforeSend(event) {
    // Filtra erros de extensões do browser
    if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
      (f) => f.filename?.includes("chrome-extension://") || f.filename?.includes("moz-extension://")
    )) {
      return null;
    }
    return event;
  },
});
