import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createRateLimiter } from '@/lib/rate-limit';

const analyticsLimiter = createRateLimiter(120, 60, '@jornada/analytics');

export async function POST(request: NextRequest) {
  // Fire-and-forget: sempre retorna 200 para não quebrar o app
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const rl = await analyticsLimiter.check(ip);
    if (!rl.success) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body.event_name !== 'string' || !body.event_name.trim()) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const { event_name, properties = {}, session_id = null } = body as {
      event_name: string;
      properties?: Record<string, unknown>;
      session_id?: string | null;
    };

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // Criar cliente SSR para obter user_id da sessão (se autenticado)
    const response = NextResponse.json({ ok: true });
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    // Inserir via service role (bypassa RLS de select, usa policy de insert)
    const { createClient } = await import('@supabase/supabase-js');
    const adminClient = createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    await adminClient.from('analytics_events').insert({
      user_id: user?.id ?? null,
      event_name: event_name.trim(),
      properties,
      session_id: session_id ?? null,
    });

    return response;
  } catch (err) {
    // Silencia erros — nunca quebrar o app por analytics
    console.warn('[analytics/track] erro silenciado:', err);
    return NextResponse.json({ ok: true });
  }
}
