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

interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

interface TestPushBody {
  subscription: { endpoint: string; keys: PushSubscriptionKeys };
  title?: string;
  body?: string;
}

// POST /api/admin/push/test — envia notificação push somente para o admin (auto-teste)
export async function POST(req: NextRequest) {
  // 1. Verificar sessão
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

  // 3. Ler dados
  const { subscription, title, body } = await req.json() as TestPushBody;

  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return NextResponse.json({ error: 'Subscription inválida' }, { status: 400 });
  }

  const testTitle = title?.trim() || '🧪 Teste de notificação';
  const testBody = body?.trim() || 'Notificação de teste enviada com sucesso pelo painel admin!';

  const payload = JSON.stringify({
    title: testTitle,
    body: testBody,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    url: '/',
    tag: 'admin-test',
  });

  console.log(`[admin/push/test] Teste enviado por ${user.email}`);

  try {
    const wp = getWebPush();
    await wp.sendNotification(
      { endpoint: subscription.endpoint, keys: subscription.keys },
      payload
    );
    return NextResponse.json({ sent: true });
  } catch (err) {
    const pushErr = err as { statusCode?: number; message?: string };
    if (pushErr?.statusCode === 410 || pushErr?.statusCode === 404) {
      return NextResponse.json(
        { error: 'Subscription expirada. Reative as notificações e tente novamente.' },
        { status: 410 }
      );
    }
    console.error('[admin/push/test] Erro:', err);
    return NextResponse.json({ error: 'Falha ao enviar notificação de teste' }, { status: 500 });
  }
}
