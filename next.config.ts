import type { NextConfig } from "next";
import withPWA from "next-pwa";

const pwaConfig = {
  dest: "public",
  register: true,
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [
    // App shell (dashboard e rotas Next.js sem extensão)
    {
      urlPattern: /^\/($|[^.]+$)/,
      handler: "NetworkFirst" as const,
      options: {
        cacheName: "page-cache",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 horas
        },
        networkTimeoutSeconds: 3,
      },
    },
    // HTML pages
    {
      urlPattern: /^\/.*\.html?$/i,
      handler: "NetworkFirst" as const,
      options: {
        cacheName: "html-cache",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 horas
        },
      },
    },
    // API routes
    {
      urlPattern: /^\/api\//i,
      handler: "NetworkFirst" as const,
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutos
        },
      },
    },
    // Images
    {
      urlPattern: /^https:\/\/(.*).(?:googleusercontent|cloudflare|r2\.dev)/i,
      handler: "CacheFirst" as const,
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
        },
      },
    },
    // Fontes
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com/i,
      handler: "CacheFirst" as const,
      options: {
        cacheName: "font-cache",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
        },
      },
    },
    // CSS/JS estáticos
    {
      urlPattern: /\.(?:css|js)$/i,
      handler: "StaleWhileRevalidate" as const,
      options: {
        cacheName: "static-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 dias
        },
      },
    },
    // Fallback: tudo que não combinou
    {
      urlPattern: /^(?!.*\.(?:js|css|png|jpg|jpeg|svg|gif|ico|woff|woff2)$)/i,
      handler: "NetworkFirst" as const,
      options: {
        cacheName: "default-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 horas
        },
      },
    },
  ],
};

const nextConfig: NextConfig = {
  // turbopack: {}, // Desabilitado - usando SWC compiler
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(pwaConfig)(nextConfig);
