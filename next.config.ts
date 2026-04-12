import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // web-push é CommonJS — não pode ser bundlado pelo Next.js; deve rodar como módulo externo
  serverExternalPackages: ['web-push'],

  images: {
    formats: ["image/avif", "image/webp"],
    // Tamanhos usados em TreeGrowthVisual: 32px (timeline), 56px (compact), 176px (modal)
    // Sem estes valores, Next.js usaria 256px para imagens de 176px → geração mais lenta
    imageSizes: [32, 56, 176, 352],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        // Service Worker deve ter escopo máximo e sem cache de arquivo
        source: "/sw.js",
        headers: [
          { key: "Cache-Control",               value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed",       value: "/" },
          { key: "X-Content-Type-Options",       value: "nosniff" },
        ],
      },
      {
        // Manifest sem cache agressivo
        source: "/manifest.json",
        headers: [
          { key: "Cache-Control",               value: "public, max-age=0, must-revalidate" },
          { key: "Content-Type",                value: "application/manifest+json" },
        ],
      },
      {
        // Headers gerais de segurança para todas as rotas
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",             value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options",       value: "nosniff" },
          { key: "Referrer-Policy",              value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",           value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security",    value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            // 'unsafe-inline' em script-src é necessário para o Next.js App Router (hydration inline scripts)
            // 'unsafe-inline' em style-src é necessário para Tailwind CSS
            // worker-src blob: é necessário para o Service Worker
            // wss://*.supabase.co é necessário para o Realtime WebSocket
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://browser.sentry-cdn.com https://accounts.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://lh3.googleusercontent.com https://*.r2.dev https://images.unsplash.com",
              // media-src: R2 direto + CDN customizado (hardcoded para não depender de env no build)
              "media-src 'self' blob: https://*.r2.dev https://audio.minhajornadadiaria.com.br",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.sentry.io https://browser.sentry-cdn.com https://accounts.google.com",
              "worker-src 'self' blob:",
              "frame-src https://accounts.google.com",
              "manifest-src 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // Sentry organization e project slugs (configurar no Vercel)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Auth token para upload de source maps durante o build
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Silencia output do Sentry no build local (só mostra no CI)
  silent: process.env.NODE_ENV !== "production",

  // Faz upload de source maps maiores para erros mais precisos
  widenClientFileUpload: true,

  // Tunel: roteia requests Sentry pelo Next.js → bypassa ad-blockers
  tunnelRoute: "/monitoring-tunnel",

  // Remove logs do Sentry do bundle de produção (menor bundle)
  disableLogger: true,

  // Source maps: deleta após upload (não fica no bundle final)
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
