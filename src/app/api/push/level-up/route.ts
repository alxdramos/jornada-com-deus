export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { LevelUpPushBodySchema, zodErrorResponse } from '@/lib/validation/schemas';

const LEVEL_NAMES: Record<number, string> = {
  1: 'Semente',
  2: 'Broto',
  3: 'Muda',
  4: 'Arbusto',
  5: 'Árvore Jovem',
  6: 'Árvore Crescida',
  7: 'Árvore Forte',
  8: 'Árvore Frondosa',
  9: 'Árvore Madura',
  10: 'Árvore Plena',
};

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getWebPush() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  return webpush;
}

// POST /api/push/level-up — celebração de nível, chamado pelo client após completeDay()
export async function POST(req: NextRequest) {
  // 1. Verificar autenticação
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  // 2. Validar body
  const rawBody = await req.json();
  const parsed = LevelUpPushBodySchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(zodErrorResponse(parsed.error), { status: 400 });
  }

  const { newLevel } = parsed.data;
  const levelName = LEVEL_NAMES[newLevel] ?? `Nível ${newLevel}`;

  // 3. Buscar subscription do usuário
  const supabaseAdmin = getSupabaseAdmin();
  const { data: sub } = await supabaseAdmin
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth_key')
    .eq('user_id', user.id)
    .eq('notifications_enabled', true)
    .single();

  if (!sub) {
    return NextResponse.json({ sent: false, reason: 'sem_subscription' });
  }

  // 4. Enviar push de celebração
  const payload = JSON.stringify({
    title: `Sua árvore evoluiu! 🌳`,
    body: `Parabéns! Você alcançou "${levelName}" — continue crescendo na fé!`,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    url: '/?tab=hoje',
    tag: 'level-up',
  });

  try {
    const wp = getWebPush();
    await wp.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
      payload
    );
    console.log(`[push/level-up] Enviado para ${user.email} — ${levelName}`);
    return NextResponse.json({ sent: true });
  } catch (err) {
    const error = err as { statusCode?: number };
    // Subscription expirada — remover silenciosamente
    if (error?.statusCode === 410 || error?.statusCode === 404) {
      await supabaseAdmin
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', sub.endpoint);
    }
    console.error('[push/level-up] Erro ao enviar:', err);
    return NextResponse.json({ sent: false, reason: 'erro_envio' });
  }
}
