export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

type Period = 'morning' | 'afternoon' | 'evening';

interface PushMessage {
  title: string;
  body: string;
  url: string;
  tag: string;
}

// Mensagens da manhã (cron 10h UTC = 7h Brasília) — abre TabHoje
const MORNING_MESSAGES: PushMessage[] = [
  { title: 'Bom dia! 🌅', body: 'Comece sua jornada com Deus. Ele já está te esperando.', url: '/?tab=hoje', tag: 'daily-morning' },
  { title: 'Bom dia! ✨', body: 'Cada manhã é uma nova graça. Sua devocional do dia te espera.', url: '/?tab=hoje', tag: 'daily-morning' },
  { title: 'Bom dia! 🙏', body: 'Ore, leia e cresça. Sua árvore da fé está crescendo!', url: '/?tab=hoje', tag: 'daily-morning' },
  { title: 'Bom dia! 📖', body: 'A Palavra de Deus ilumina o caminho. Leia seu versículo do dia.', url: '/?tab=hoje', tag: 'daily-morning' },
  { title: 'Bom dia! 🕊️', body: 'Paz e graça para você. Comece o dia com espiritualidade.', url: '/?tab=hoje', tag: 'daily-morning' },
  { title: 'Bom dia! 🌿', body: 'Um dia de cada vez com Deus. Sua jornada de hoje te espera!', url: '/?tab=hoje', tag: 'daily-morning' },
  { title: 'Bom dia! ⭐', body: 'Continue o seu streak! Seus hábitos espirituais estão crescendo.', url: '/?tab=hoje', tag: 'daily-morning' },
];

// Mensagens da tarde (cron 15h UTC = 12h Brasília) — abre Meditações
const AFTERNOON_MESSAGES: PushMessage[] = [
  { title: 'Pausa espiritual 🕊️', body: '5 minutos de meditação podem mudar seu dia. Que tal uma pausa?', url: '/?tab=meditacoes', tag: 'daily-afternoon' },
  { title: 'Momento de paz 🌿', body: 'No meio do dia agitado, respire. Uma meditação te espera.', url: '/?tab=meditacoes', tag: 'daily-afternoon' },
  { title: 'Almoço + fé 🙏', body: 'Que tal meditar por alguns minutos antes de retomar o trabalho?', url: '/?tab=meditacoes', tag: 'daily-afternoon' },
  { title: 'Recarga espiritual ✨', body: 'Sua mente precisa descansar em Deus. Experimente uma meditação.', url: '/?tab=meditacoes', tag: 'daily-afternoon' },
  { title: 'Pausa com Deus 💙', body: 'Meditação guiada de 5 a 10 minutos. Você merece esse momento.', url: '/?tab=meditacoes', tag: 'daily-afternoon' },
  { title: 'Respire em paz 🌸', body: 'Deixe a meditação renovar suas forças para o resto do dia.', url: '/?tab=meditacoes', tag: 'daily-afternoon' },
  { title: 'Meio do dia com Deus ☀️', body: 'Uma pausa espiritual agora é o melhor presente que você pode se dar.', url: '/?tab=meditacoes', tag: 'daily-afternoon' },
];

// Mensagens da noite (cron 23h UTC = 20h Brasília) — abre Orações
const EVENING_MESSAGES: PushMessage[] = [
  { title: 'Reflexão da noite 🌙', body: 'Antes de dormir, leve uma palavra de Deus no coração.', url: '/?tab=oracoes', tag: 'daily-evening' },
  { title: 'Boa noite! 🌟', body: 'Encerre o dia em oração. Deus ouve cada pedido do seu coração.', url: '/?tab=oracoes', tag: 'daily-evening' },
  { title: 'Momento de oração 🙏', body: 'O dia está terminando. Que tal agradecer e orar antes de descansar?', url: '/?tab=oracoes', tag: 'daily-evening' },
  { title: 'Noite abençoada 💙', body: 'Uma oração noturna transforma o descanso em bênção.', url: '/?tab=oracoes', tag: 'daily-evening' },
  { title: 'Feche o dia com fé ✨', body: 'Deixe suas preocupações nas mãos de Deus antes de dormir.', url: '/?tab=oracoes', tag: 'daily-evening' },
  { title: 'Paz para a noite 🕊️', body: 'Você cuidou de tantas coisas hoje. Agora cuide da sua alma.', url: '/?tab=oracoes', tag: 'daily-evening' },
  { title: 'Até amanhã! 🌿', body: 'Descanse em paz. Deus vela sobre você durante a noite.', url: '/?tab=oracoes', tag: 'daily-evening' },
];

function getPeriod(utcHour: number): Period {
  if (utcHour >= 8 && utcHour < 13) return 'morning';   // 5h–10h Brasília
  if (utcHour >= 13 && utcHour < 20) return 'afternoon'; // 10h–17h Brasília
  return 'evening';                                        // 17h+ Brasília
}

// Mensagens especiais de segunda-feira (motivação para a semana)
const MONDAY_MORNING: PushMessage = {
  title: 'Nova semana com Deus! 🌱',
  body: 'Segunda-feira é recomeço. Comece sua semana com fé e propósito.',
  url: '/?tab=hoje',
  tag: 'daily-morning',
};

// Mensagem especial de sexta-feira (encerra a semana)
const FRIDAY_EVENING: PushMessage = {
  title: 'Fim de semana abençoado 🙏',
  body: 'Você chegou à sexta! Ore e agradeça pelas bênçãos da semana.',
  url: '/?tab=oracoes',
  tag: 'daily-evening',
};

// Mensagens especiais de fim de semana (domingo/sábado — estudos bíblicos)
const WEEKEND_MORNING: PushMessage = {
  title: 'Fim de semana na Palavra 📖',
  body: 'Aproveite o tempo livre para aprofundar na Bíblia. Um estudo te espera.',
  url: '/?tab=estudos',
  tag: 'daily-morning',
};

function getTodayMessage(): PushMessage {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const dayOfWeek = now.getDay(); // 0 (dom), 1 (seg) … 6 (sáb)
  const period = getPeriod(utcHour);

  // Mensagens especiais por dia/período
  if (dayOfWeek === 1 && period === 'morning') return MONDAY_MORNING;
  if (dayOfWeek === 5 && period === 'evening') return FRIDAY_EVENING;
  if ((dayOfWeek === 0 || dayOfWeek === 6) && period === 'morning') return WEEKEND_MORNING;

  const messageSet =
    period === 'morning'   ? MORNING_MESSAGES   :
    period === 'afternoon' ? AFTERNOON_MESSAGES :
    EVENING_MESSAGES;

  return messageSet[dayOfWeek % messageSet.length];
}

async function handlePush(req: NextRequest) {
  // Validar CRON_SECRET (Vercel injeta Authorization: Bearer <secret>)
  const authHeader = req.headers.get('authorization');
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedSecret) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  console.log('[push/send] Rota executada em dynamic mode -', new Date().toISOString());

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

    const { title, body, url, tag } = getTodayMessage();
    const payload = JSON.stringify({
      title,
      body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      url,
      tag,
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
    const period = getPeriod(new Date().getUTCHours());
    console.log(`[push/send] Período: ${period} | Enviadas: ${sent}/${subscriptions.length}. Expiradas removidas: ${expiredEndpoints.length}`);

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

export const GET = handlePush;
export const POST = handlePush;
