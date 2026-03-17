import { NextRequest, NextResponse } from 'next/server';
import { searchQuerySchema } from '@/lib/validation/schemas';
import { zodErrorResponse } from '@/lib/validation/schemas';
import type { SearchResult } from '@/types/search';
import { ORACOES } from '@/data/oracoes';
import { MEDITACOES } from '@/data/meditacoes';
import { ESTUDOS } from '@/data/estudos';

// ─── In-memory rate limiter (10 req / 10s per IP) ────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 10_000 });
    return true;
  }

  if (entry.count >= 10) return false;

  entry.count++;
  return true;
}

// ─── Scoring helpers ──────────────────────────────────────────────────────────
function score(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t.startsWith(q)) return 3;
  if (t.includes(q)) return 2;
  // partial word match
  const words = q.split(/\s+/).filter(Boolean);
  const matched = words.filter((w) => t.includes(w));
  if (matched.length > 0) return matched.length;
  return 0;
}

function totalScore(title: string, description: string, query: string): number {
  // Title matches score higher than description matches
  const titleScore = score(title, query) * 2;
  const descScore = score(description, query);
  return titleScore + descScore;
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Rate limiting
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Muitas requisições. Tente novamente em alguns segundos.' },
      { status: 429, headers: { 'Retry-After': '10' } }
    );
  }

  // Validate query params
  const { searchParams } = req.nextUrl;
  const raw = {
    q: searchParams.get('q') ?? '',
    limit: searchParams.get('limit') ?? undefined,
  };

  const parsed = searchQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(zodErrorResponse(parsed.error), { status: 400 });
  }

  const { q, limit } = parsed.data;

  // ── Build result set ─────────────────────────────────────────────────────

  const results: Array<SearchResult & { _score: number }> = [];

  // Search orações
  for (const o of ORACOES) {
    const s = totalScore(o.titulo, o.texto ?? '', q);
    if (s > 0) {
      results.push({
        id: o.id,
        type: 'oracao',
        title: o.titulo,
        description: o.texto?.slice(0, 120) + '...',
        category: o.theme ?? undefined,
        imageUrl: o.imagem?.background
          ? `https://pub-78cb2e5dd78e4d38af1ad1634018010a.r2.dev/${o.imagem.background}`
          : undefined,
        audioUrl: o.audioUrl,
        _score: s,
      });
    }
  }

  // Search meditações
  for (const m of MEDITACOES) {
    const s = totalScore(m.title, m.description ?? '', q);
    if (s > 0) {
      results.push({
        id: m.id,
        type: 'meditacao',
        title: m.title,
        description: m.description?.slice(0, 120) + '...',
        category: m.category,
        imageUrl: m.image,
        audioUrl: m.audioUrl,
        _score: s,
      });
    }
  }

  // Search estudos
  for (const e of ESTUDOS) {
    const s = totalScore(e.title, e.text ?? '', q);
    if (s > 0) {
      results.push({
        id: e.id,
        type: 'estudo',
        title: e.title,
        description: e.text?.slice(0, 120) + '...',
        category: e.category,
        audioUrl: e.audioUrl,
        _score: s,
      });
    }
  }

  // Sort by relevance score (desc)
  results.sort((a, b) => b._score - a._score);

  // Strip internal _score field and apply limit
  const final: SearchResult[] = results.slice(0, limit).map(({ _score: _, ...rest }) => rest);

  return NextResponse.json({
    results: final,
    total: final.length,
    query: q,
  });
}
