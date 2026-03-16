import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy de áudio com suporte a HTTP Range requests (streaming).
 *
 * Usado quando CDN (NEXT_PUBLIC_AUDIO_CDN_BASE) não está configurado.
 * Resolve problemas de CORS do R2 e permite seeking no player de áudio.
 *
 * HTTP Range support: essencial para:
 * - Seeking (avançar/retroceder) sem re-download
 * - PWA background playback eficiente
 * - Menor uso de memória no Vercel Edge
 */

const ALLOWED_HOSTS = new Set([
  'pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev', // meditações
  'pub-78cb2e5dd78e4d38af1ad1634018010a.r2.dev',  // orações
  'pub-512e64f14afc4afd88958694f17e3eb8.r2.dev',  // estudos
  'pub-18fa930087714513af7d60ab5d9586e7.r2.dev',  // devocionais
  'pub-aa11c4d96773425a937179cf3f39aeb2.r2.dev',  // estudos-raw
]);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Range, Content-Type',
  'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges',
};

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && ALLOWED_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function HEAD(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url || !isAllowedUrl(url)) {
    return new NextResponse(null, { status: 403 });
  }

  try {
    const upstream = await fetch(url, { method: 'HEAD' });
    const headers = new Headers(CORS_HEADERS);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Type', upstream.headers.get('Content-Type') ?? 'audio/mpeg');
    const cl = upstream.headers.get('Content-Length');
    if (cl) headers.set('Content-Length', cl);
    return new NextResponse(null, { status: 200, headers });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL é obrigatória' }, { status: 400 });
  }

  if (!isAllowedUrl(url)) {
    return NextResponse.json({ error: 'URL não permitida' }, { status: 403 });
  }

  // Encaminha o header Range para o R2 (permite seeking)
  const rangeHeader = request.headers.get('range');
  const upstreamHeaders: HeadersInit = { 'User-Agent': 'JornadaDeus-AudioProxy/1.0' };
  if (rangeHeader) upstreamHeaders['Range'] = rangeHeader;

  try {
    const upstream = await fetch(url, { method: 'GET', headers: upstreamHeaders });

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json(
        { error: `Upstream error: ${upstream.statusText}` },
        { status: upstream.status }
      );
    }

    const responseHeaders = new Headers(CORS_HEADERS);

    // Propaga headers essenciais para streaming
    for (const header of ['Content-Type', 'Content-Length', 'Content-Range', 'Accept-Ranges']) {
      const value = upstream.headers.get(header);
      if (value) responseHeaders.set(header, value);
    }

    // Garante Accept-Ranges (informa ao browser que seeking é suportado)
    if (!responseHeaders.has('Accept-Ranges')) {
      responseHeaders.set('Accept-Ranges', 'bytes');
    }

    // Cache: áudios são imutáveis — 1h no browser, 7 dias na CDN/edge
    responseHeaders.set(
      'Cache-Control',
      'public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400'
    );

    // 206 Partial Content se o upstream respondeu com range parcial
    const status = upstream.status === 206 ? 206 : 200;

    return new NextResponse(upstream.body, { status, headers: responseHeaders });
  } catch (error) {
    console.error('[api/audio] Erro ao buscar arquivo:', error);
    return NextResponse.json({ error: 'Erro ao processar requisição' }, { status: 502 });
  }
}
