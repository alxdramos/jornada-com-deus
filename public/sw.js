// Service Worker - Jornada com Deus PWA
// Estratégias: CacheFirst (assets/R2), NetworkFirst (bible-api), offline fallback

const CACHE_VERSION = 'v2';
const STATIC_CACHE  = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const AUDIO_CACHE   = `audio-${CACHE_VERSION}`;
const API_CACHE     = `api-${CACHE_VERSION}`;
const IMAGE_CACHE   = `images-${CACHE_VERSION}`;

// App shell mínima para funcionar offline
const APP_SHELL = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon.ico',
];

// ─── INSTALL: precache app shell ──────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE: limpar caches antigos ──────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, AUDIO_CACHE, API_CACHE, IMAGE_CACHE];

  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !validCaches.includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ─── HELPERS: estratégias de cache ────────────────────────────────────────────

/**
 * CacheFirst — responde do cache; se não tem, busca na rede e armazena.
 * Ideal para assets imutáveis (áudio R2, imagens, _next/static).
 */
async function cacheFirst(request, cacheName, maxAgeSeconds = 60 * 60 * 24 * 30) {
  const cache    = await caches.open(cacheName);
  const cached   = await cache.match(request);

  if (cached) {
    const fetchedAt = cached.headers.get('sw-fetched-at');
    const age       = fetchedAt ? (Date.now() - Number(fetchedAt)) / 1000 : 0;
    if (!fetchedAt || age < maxAgeSeconds) return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      // Clonar e adicionar timestamp para controle de expiração
      const headers  = new Headers(response.headers);
      headers.set('sw-fetched-at', String(Date.now()));
      const clone    = new Response(await response.clone().arrayBuffer(), {
        status:     response.status,
        statusText: response.statusText,
        headers,
      });
      await cache.put(request, clone);
    }
    return response;
  } catch {
    if (cached) return cached; // Fallback para cache expirado se offline
    throw new Error('Offline e sem cache disponível');
  }
}

/**
 * NetworkFirst — busca na rede primeiro; fallback para cache se offline.
 * Ideal para Bible API e dados dinâmicos.
 */
async function networkFirst(request, cacheName, maxAgeSeconds = 60 * 60 * 24 * 7) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response.ok) {
      const headers = new Headers(response.headers);
      headers.set('sw-fetched-at', String(Date.now()));
      const clone   = new Response(await response.clone().arrayBuffer(), {
        status:     response.status,
        statusText: response.statusText,
        headers,
      });
      await cache.put(request, clone);
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error('Offline e sem cache disponível para ' + request.url);
  }
}

/**
 * StaleWhileRevalidate — responde do cache enquanto atualiza em background.
 * Ideal para HTML dinâmico e assets secundários.
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache      = await caches.open(cacheName);
  const cached     = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached || fetchPromise;
}

/**
 * NavigationFirst — NetworkFirst para pages com fallback para /offline.
 */
async function navigationFirst(request) {
  const cache = await caches.open(DYNAMIC_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;

    // Fallback para página offline
    const offline = await caches.match('/offline');
    return offline || new Response('Você está offline.', {
      status:  503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

// ─── FETCH: roteamento por domínio/path ───────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url         = new URL(request.url);

  // Ignorar: chrome-extension, devtools, hot-reload
  if (
    url.protocol !== 'https:' && url.protocol !== 'http:' ||
    url.pathname.startsWith('/_next/webpack-hmr') ||
    url.pathname.includes('__nextjs') ||
    request.method !== 'GET'
  ) {
    return;
  }

  // ── R2 Cloudflare: áudios e imagens (CacheFirst 30 dias) ────────────────────
  if (url.hostname.includes('r2.dev') || url.hostname.includes('pub-561f3fcecd8945ba90a5b9c1683fac22')) {
    event.respondWith(cacheFirst(request, AUDIO_CACHE, 60 * 60 * 24 * 30));
    return;
  }

  // ── Google avatares (CacheFirst 7 dias) ─────────────────────────────────────
  if (url.hostname === 'lh3.googleusercontent.com') {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, 60 * 60 * 24 * 7));
    return;
  }

  // ── Bible API / audio proxy (NetworkFirst 7 dias) ───────────────────────────
  if (
    url.pathname.startsWith('/api/bible') ||
    url.pathname.startsWith('/api/audio') ||
    url.hostname.includes('bible-api') ||
    url.hostname.includes('api.bible')
  ) {
    event.respondWith(networkFirst(request, API_CACHE, 60 * 60 * 24 * 7));
    return;
  }

  // ── Outras APIs locais: não cachear (autenticação, mutações) ────────────────
  if (url.pathname.startsWith('/api/')) {
    return; // Deixar passar sem cache
  }

  // ── Next.js static (imutável, CacheFirst 1 ano) ─────────────────────────────
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, 60 * 60 * 24 * 365));
    return;
  }

  // ── Next.js image optimization ──────────────────────────────────────────────
  if (url.pathname.startsWith('/_next/image')) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, 60 * 60 * 24 * 30));
    return;
  }

  // ── Navegação (pages) — NetworkFirst + fallback offline ─────────────────────
  if (request.mode === 'navigate') {
    event.respondWith(navigationFirst(request));
    return;
  }

  // ── Demais requests — StaleWhileRevalidate ───────────────────────────────────
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});

// ─── BACKGROUND SYNC: fila de requests offline ────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-prayers' || event.tag === 'background-sync-journal') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) =>
          client.postMessage({ type: 'BACKGROUND_SYNC', tag: event.tag })
        );
      })
    );
  }
});

// ─── PUSH NOTIFICATIONS (placeholder) ─────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json().catch(() => ({ title: 'Jornada com Deus', body: event.data.text() }));

  event.waitUntil(
    data.then((payload) =>
      self.registration.showNotification(payload.title || 'Jornada com Deus', {
        body:    payload.body || 'Novo conteúdo disponível.',
        icon:    '/icon-192x192.png',
        badge:   '/icon-192x192.png',
        vibrate: [200, 100, 200],
        data:    payload,
      })
    )
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const focused = clients.find((c) => c.focus);
      if (focused) return focused.focus();
      return self.clients.openWindow('/');
    })
  );
});
