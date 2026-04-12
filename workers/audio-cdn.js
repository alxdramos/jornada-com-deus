/**
 * Cloudflare Worker — Audio CDN para Jornada com Deus
 *
 * Deploy:
 *   1. wrangler deploy workers/audio-cdn.js --name jornada-audio-cdn
 *   2. Em Workers > Triggers > Custom Domains: adicionar audio.minhajornadadiaria.com.br
 *   3. Configurar NEXT_PUBLIC_AUDIO_CDN_BASE=https://audio.minhajornadadiaria.com.br
 *
 * Funcionamento:
 *   - O Worker roteia pelo prefixo do arquivo para o bucket R2 correto
 *   - Adiciona headers CORS, Cache-Control e Range support
 *   - Cloudflare cache automaticamente na edge (sem custo adicional de R2 egress)
 *
 * Mapeamento de buckets:
 *   Med_* → pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev (meditações)
 *   Ora_* → pub-78cb2e5dd78e4d38af1ad1634018010a.r2.dev (orações)
 *   Est_* → pub-512e64f14afc4afd88958694f17e3eb8.r2.dev (estudos)
 *   Dev_* → pub-18fa930087714513af7d60ab5d9586e7.r2.dev (devocionais)
 */

const BUCKET_MAP = {
  'Med_': 'https://pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev',
  'Ora_': 'https://pub-78cb2e5dd78e4d38af1ad1634018010a.r2.dev',
  'Est_': 'https://pub-512e64f14afc4afd88958694f17e3eb8.r2.dev',
  'Dev_': 'https://pub-18fa930087714513af7d60ab5d9586e7.r2.dev',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Range, Content-Type',
  'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges',
  'Access-Control-Max-Age': '86400',
};

/**
 * Determina o bucket R2 baseado no prefixo do arquivo.
 * @param {string} filename - Nome do arquivo (ex: Med_20260217181219_878.mp3)
 * @returns {string|null} URL base do bucket ou null se não reconhecido
 */
function getBucketUrl(filename) {
  for (const [prefix, bucketUrl] of Object.entries(BUCKET_MAP)) {
    if (filename.startsWith(prefix)) {
      return bucketUrl;
    }
  }
  return null;
}

const audioCdnHandler = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Responde preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Extrai o nome do arquivo da URL (ex: /Med_xxx.mp3 → Med_xxx.mp3)
    const filename = url.pathname.replace(/^\/+/, '');

    if (!filename || !filename.endsWith('.mp3')) {
      return new Response('Not Found', { status: 404 });
    }

    const bucketBase = getBucketUrl(filename);
    if (!bucketBase) {
      return new Response('Not Found — prefixo desconhecido', { status: 404 });
    }

    const r2Url = `${bucketBase}/${filename}`;

    // Encaminha Range header para suporte a seeking
    const upstreamHeaders = {};
    const rangeHeader = request.headers.get('Range');
    if (rangeHeader) {
      upstreamHeaders['Range'] = rangeHeader;
    }

    // Cache na edge do Cloudflare (7 dias)
    const cacheControl = 'public, max-age=604800, stale-while-revalidate=86400';

    try {
      const upstream = await fetch(r2Url, {
        method: request.method,
        headers: upstreamHeaders,
        cf: {
          // Instrui o Cloudflare a cachear a resposta na edge
          cacheEverything: true,
          cacheTtl: 604800, // 7 dias
        },
      });

      if (!upstream.ok && upstream.status !== 206) {
        return new Response(`Upstream error: ${upstream.status}`, {
          status: upstream.status,
        });
      }

      const responseHeaders = new Headers(CORS_HEADERS);

      // Propaga headers de streaming
      for (const header of ['Content-Type', 'Content-Length', 'Content-Range', 'Accept-Ranges']) {
        const value = upstream.headers.get(header);
        if (value) responseHeaders.set(header, value);
      }

      if (!responseHeaders.has('Accept-Ranges')) {
        responseHeaders.set('Accept-Ranges', 'bytes');
      }

      responseHeaders.set('Cache-Control', cacheControl);
      responseHeaders.set('X-Audio-Bucket', filename.substring(0, 3)); // Med, Ora, Est, Dev

      const status = upstream.status === 206 ? 206 : 200;

      return new Response(upstream.body, { status, headers: responseHeaders });
    } catch (err) {
      console.error('[audio-cdn] Erro:', err);
      return new Response('Bad Gateway', { status: 502 });
    }
  },
};

export default audioCdnHandler;
