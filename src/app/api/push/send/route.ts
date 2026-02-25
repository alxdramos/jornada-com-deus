import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

function getSupabase() {
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

// Mensagens rotativas — uma por dia da semana
const DAILY_MESSAGES = [
  { title: 'Bom dia! 🌅', body: 'Comece sua jornada com Deus. Ele já está te esperando.' },
  { title: 'Bom dia! ✨', body: 'Cada manhã é uma nova graça. Abra seu devocional de hoje.' },
  { title: 'Bom dia! 🙏', body: 'Ore, leia e cresça. Sua árvore da fé está crescendo!' },
  { title: 'Bom dia! 📖', body: 'A Palavra de Deus ilumina o caminho. Leia seu versículo do dia.' },
  { title: 'Bom dia! 🕊️', body: 'Paz e graça para você. Cultive sua jornada espiritual hoje.' },
  { title: 'Bom dia! 🌿', body: 'Um dia de cada vez com Deus. Sua jornada te espera!' },
  { title: 'Bom dia! ⭐', body: 'Continue o seu streak! Seus hábitos espirituais estão crescendo.' },
];

function getTodayMessage() {
  const dayOfWeek = new Date().getDay(); // 0 (dom) a 6 (sáb)
  return DAILY_MESSAGES[dayOfWeek];
}

async function sendNotifications(req: NextRequest) {
  // Validar CRON_SECRET (Vercel injeta Authorization: Bearer <secret>)
  const authHeader = req.headers.get('authorization');
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedSecret) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    // Buscar todas as subscriptions ativas
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth_key')
      .eq('notifications_enabled', true);

    if (error) {
      console.error('[push/send] Erro ao buscar subscriptions:', error);
      return NextResponse.json({ error: 'Erro ao buscar subscriptions' }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ sent: 0, message: 'Nenhuma subscription ativa' });
    }

    const { title, body } = getTodayMessage();
    const payload = JSON.stringify({
      title,
      body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      url: '/',
      tag: 'daily-reminder',
    });

    const wp = getWebPush();
    // Enviar para todos — coletar expiradas para limpeza
    const expiredEndpoints: string[] = [];
    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        wp.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth_key },
          },
          payload
        )
      )
    );

    results.forEach((result, i) => {
      if (result.status === 'rejected') {
        const err = result.reason as { statusCode?: number };
        // 410 Gone ou 404 = subscription expirada/inválida
        if (err?.statusCode === 410 || err?.statusCode === 404) {
          expiredEndpoints.push(subscriptions[i].endpoint);
        } else {
          console.error('[push/send] Erro ao enviar:', err);
        }
      }
    });

    // Limpar subscriptions expiradas
    if (expiredEndpoints.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', expiredEndpoints);
    }

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    console.log(`[push/send] Enviadas: ${sent}/${subscriptions.length}. Expiradas removidas: ${expiredEndpoints.length}`);

    return NextResponse.json({
      sent,
      total: subscriptions.length,
      expired_removed: expiredEndpoints.length,
    });
  } catch (err) {
    console.error('[push/send] Erro geral:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// Vercel Cron chama via GET — POST disponível para testes manuais
export const GET = sendNotifications;
export const POST = sendNotifications;
