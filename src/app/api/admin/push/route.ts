export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import { createSupabaseServerClient } from '@/lib/supabase-server';

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

// POST /api/admin/push — disparo manual de notificação pelo painel admin
export async function POST(req: NextRequest) {
  // 1. Verificar sessão Supabase
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  // 2. Verificar role admin
  const supabaseAdmin = getSupabaseAdmin();
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }

  // 3. Ler título e corpo da requisição
  const { title, body } = await req.json() as { title: string; body: string };

  if (!title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'Título e corpo são obrigatórios' }, { status: 400 });
  }

  console.log(`[admin/push] Disparo manual por ${user.email} — "${title}"`);

  // 4. Buscar todas as subscriptions ativas
  const { data: subscriptions, error } = await supabaseAdmin
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth_key')
    .eq('notifications_enabled', true);

  if (error) {
    console.error('[admin/push] Erro ao buscar subscriptions:', error);
    return NextResponse.json({ error: 'Erro ao buscar subscriptions' }, { status: 500 });
  }

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0, total: 0, message: 'Nenhuma subscription ativa' });
  }

  const payload = JSON.stringify({
    title: title.trim(),
    body: body.trim(),
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    url: '/',
    tag: 'admin-broadcast',
  });

  const wp = getWebPush();
  const expiredEndpoints: string[] = [];

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      wp.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
        payload
      )
    )
  );

  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      const err = result.reason as { statusCode?: number };
      if (err?.statusCode === 410 || err?.statusCode === 404) {
        expiredEndpoints.push(subscriptions[i].endpoint);
      } else {
        console.error('[admin/push] Erro ao enviar:', err);
      }
    }
  });

  if (expiredEndpoints.length > 0) {
    await supabaseAdmin
      .from('push_subscriptions')
      .delete()
      .in('endpoint', expiredEndpoints);
  }

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  console.log(`[admin/push] Enviadas: ${sent}/${subscriptions.length}. Expiradas removidas: ${expiredEndpoints.length}`);

  return NextResponse.json({
    sent,
    total: subscriptions.length,
    expired_removed: expiredEndpoints.length,
  });
}
