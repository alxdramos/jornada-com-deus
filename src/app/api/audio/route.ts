import { NextRequest, NextResponse } from 'next/server';

/**
 * API proxy para servir áudios do Cloudflare R2
 * Evita problemas de CORS ao buscar arquivos diretamente do R2
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL é obrigatória' },
        { status: 400 }
      );
    }

    // Validar que a URL é do R2 permitido
    if (!url.includes('r2.dev')) {
      return NextResponse.json(
        { error: 'URL não permitida' },
        { status: 403 }
      );
    }

    // Buscar o arquivo do R2
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Erro ao buscar arquivo: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Obter o conteúdo como buffer
    const buffer = await response.arrayBuffer();

    // Retornar com headers CORS corretos
    const headers = new Headers();
    headers.set('Content-Type', 'audio/mpeg');
    headers.set('Content-Length', buffer.byteLength.toString());
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Cache-Control', 'public, max-age=86400'); // Cache por 24 horas

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Erro na rota de áudio:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
