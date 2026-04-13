/**
 * Utilitário CDN para resolução de URLs de áudio.
 *
 * Em produção com CDN configurado (NEXT_PUBLIC_AUDIO_CDN_BASE):
 *   R2: https://pub-xxx.r2.dev/Med_xyz.mp3
 *   CDN: https://audio.minhajornadadiaria.com.br/Med_xyz.mp3
 *
 * Sem CDN: usa o proxy /api/audio (comportamento atual).
 *
 * Para configurar o CDN:
 * 1. Deploy workers/audio-cdn.js no Cloudflare Workers
 * 2. Adicionar custom domain (ex: audio.minhajornadadiaria.com.br)
 * 3. Configurar NEXT_PUBLIC_AUDIO_CDN_BASE=https://audio.minhajornadadiaria.com.br
 */

const CDN_BASE = process.env.NEXT_PUBLIC_AUDIO_CDN_BASE ?? '';

/**
 * Mapeia os IDs dos buckets R2 para nomes semânticos (para logs).
 * Usados pelo Cloudflare Worker para rotear ao bucket correto.
 */
export const R2_BUCKET_MAP: Record<string, string> = {
  'pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev': 'meditacoes',
  'pub-78cb2e5dd78e4d38af1ad1634018010a.r2.dev': 'oracoes',
  'pub-512e64f14afc4afd88958694f17e3eb8.r2.dev': 'estudos',
  'pub-18fa930087714513af7d60ab5d9586e7.r2.dev': 'devocionais',
  'pub-aa11c4d96773425a937179cf3f39aeb2.r2.dev': 'estudos-raw',
};

/**
 * Resolve uma URL de áudio R2 para a URL final:
 * - Com CDN configurado: https://audio.minhajornadadiaria.com.br/Med_xxx.mp3
 * - Sem CDN: /api/audio?url=... (proxy Vercel com Range support)
 *
 * @param r2Url - URL original do R2 (https://pub-xxx.r2.dev/arquivo.mp3)
 */
export function resolveAudioUrl(r2Url: string | undefined): string {
  if (!r2Url) return '';

  // CDN configurado: redireciona para CDN custom (ex: audio.minhajornadadiaria.com.br)
  if (CDN_BASE) {
    try {
      const url = new URL(r2Url);
      const filename = url.pathname.split('/').filter(Boolean).pop() ?? '';
      return `${CDN_BASE.replace(/\/$/, '')}/${filename}`;
    } catch {
      // URL inválida — fallback para R2 direto
    }
  }

  // Sem CDN: usa R2 direto.
  // <audio> elements não têm restrição de CORS — R2 suporta Range requests nativamente.
  return r2Url;
}

/**
 * Verifica se uma URL é de um bucket R2 conhecido.
 */
export function isR2Url(url: string): boolean {
  return url.includes('.r2.dev');
}

/**
 * Verifica se CDN está configurado (para lógica condicional de UI).
 */
export function isCdnConfigured(): boolean {
  return CDN_BASE.length > 0;
}
