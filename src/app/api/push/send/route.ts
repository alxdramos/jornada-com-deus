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

// Mensagens da noite — SMART: só enviado a quem não concluiu o dia
const EVENING_MESSAGES: PushMessage[] = [
  { title: 'Ainda dá tempo! 🌙', body: 'Você ainda não completou sua jornada de hoje. Leva só 5 minutos!', url: '/?tab=hoje', tag: 'daily-evening' },
  { title: 'Não deixe para amanhã 🌟', body: 'Seu streak depende de você hoje. Complete sua jornada antes de dormir.', url: '/?tab=hoje', tag: 'daily-evening' },
  { title: 'Falta pouco! 🙏', body: 'Complete sua devocional de hoje e mantenha seu streak vivo.', url: '/?tab=hoje', tag: 'daily-evening' },
  { title: 'Antes de dormir 💙', body: 'Uma leitura rápida e uma oração. Seu dia espiritual ainda pode ser completo.', url: '/?tab=hoje', tag: 'daily-evening' },
  { title: 'Sua árvore espera você ✨', body: 'Regue sua fé hoje. Complete sua jornada e ganhe XP!', url: '/?tab=hoje', tag: 'daily-evening' },
  { title: 'Último lembrete do dia 🕊️', body: 'Não perca seu streak! Complete a jornada de hoje.', url: '/?tab=hoje', tag: 'daily-evening' },
  { title: 'Deus te espera 🌿', body: 'Reserve 5 minutos antes de dormir para sua jornada espiritual.', url: '/?tab=hoje', tag: 'daily-evening' },
];

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

// Mensagens de milestone de streak
const STREAK_MILESTONE_MESSAGES: Record<number, PushMessage> = {
  7:  { title: '7 dias seguidos! 🔥', body: 'Uma semana de fidelidade! Sua constância está transformando sua vida espiritual.', url: '/?tab=hoje', tag: 'streak-milestone' },
  14: { title: '14 dias de streak! 🌟', body: 'Duas semanas sem parar! Você está construindo um hábito espiritual sólido.', url: '/?tab=hoje', tag: 'streak-milestone' },
  21: { title: '21 dias! Hábito formado 🌳', body: 'Parabéns! 21 dias é o marco da formação de um hábito. Sua fé está florescendo!', url: '/?tab=hoje', tag: 'streak-milestone' },
  28: { title: '28 dias seguidos! 🏆', body: 'Quase um mês de dedicação diária. Você é extraordinário(a)! Continue!', url: '/?tab=hoje', tag: 'streak-milestone' },
  30: { title: 'Um mês completo! 🎉', body: '30 dias de jornada diária com Deus! Isso é transformação real.', url: '/?tab=hoje', tag: 'streak-milestone' },
  60: { title: '60 dias! Você é incrível! 🌿', body: 'Dois meses de constância espiritual. Deus vê sua dedicação!', url: '/?tab=hoje', tag: 'streak-milestone' },
  90: { title: '90 dias de fé! Lendário! 👑', body: 'Três meses sem perder um dia. Você se tornou um exemplo de fidelidade!', url: '/?tab=hoje', tag: 'streak-milestone' },
  100: { title: '100 dias! Centenário da fé! 🏅', body: 'Cem dias de jornada diária. Isso é uma conquista histórica!', url: '/?tab=hoje', tag: 'streak-milestone' },
};

const STREAK_MILESTONES = new Set(Object.keys(STREAK_MILESTONE_MESSAGES).map(Number));

interface UserProgress {
  user_id: string;
  current_streak: number;
  last_completed_date: string | null;
}

interface Subscription {
  user_id: string | null;
  endpoint: string;
  p256dh: string;
  auth_key: string;
  progress?: UserProgress | null;
}

function getPeriod(utcHour: number): Period {
  if (utcHour >= 8 && utcHour < 13) return 'morning';   // 5h–10h Brasília
  if (utcHour >= 13 && utcHour < 20) return 'afternoon'; // 10h–17h Brasília
  return 'evening';                                        // 17h+ Brasília
}

function getTodayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function getGenericMessage(period: Period): PushMessage {
  const now = new Date();
  const dayOfWeek = now.getDay();

  if (dayOfWeek === 1 && period === 'morning') return MONDAY_MORNING;
  if (dayOfWeek === 5 && period === 'evening') return FRIDAY_EVENING;
  if ((dayOfWeek === 0 || dayOfWeek === 6) && period === 'morning') return WEEKEND_MORNING;

  const messageSet =
    period === 'morning'   ? MORNING_MESSAGES :
    period === 'afternoon' ? AFTERNOON_MESSAGES :
    EVENING_MESSAGES;

  return messageSet[dayOfWeek % messageSet.length];
}

function selectMessage(sub: Subscription, period: Period): PushMessage {
  // Streak milestone overrides generic message
  if (sub.progress && STREAK_MILESTONES.has(sub.progress.current_streak)) {
    return STREAK_MILESTONE_MESSAGES[sub.progress.current_streak];
  }
  return getGenericMessage(period);
}

async function handlePush(req: NextRequest) {
  // Validar CRON_SECRET (Vercel injeta Authorization: Bearer <secret>)
  const authHeader = req.headers.get('authorization');
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedSecret) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  console.log('[push/send] Rota executada em dynamic mode -', new Date().toISOString());

  const supabase = getSupabase();
  const period = getPeriod(new Date().getUTCHours());
  const todayUTC = getTodayUTC();

  try {
    // 1. Buscar todas as subscriptions ativas
    const { data: rawSubs, error: subsError } = await supabase
      .from('push_subscriptions')
      .select('user_id, endpoint, p256dh, auth_key')
      .eq('notifications_enabled', true);

    if (subsError) {
      console.error('[push/send] Erro ao buscar subscriptions:', subsError);
      return NextResponse.json({ error: 'Erro ao buscar subscriptions' }, { status: 500 });
    }

    if (!rawSubs || rawSubs.length === 0) {
      return NextResponse.json({ sent: 0, message: 'Nenhuma subscription ativa' });
    }

    // 2. Buscar progresso dos usuários com user_id linkado
    const linkedUserIds = [...new Set(rawSubs.filter(s => s.user_id).map(s => s.user_id as string))];

    const progressMap = new Map<string, UserProgress>();

    if (linkedUserIds.length > 0) {
      const { data: progressRows } = await supabase
        .from('user_progress')
        .select('user_id, current_streak, last_completed_date')
        .in('user_id', linkedUserIds);

      if (progressRows) {
        for (const p of progressRows) {
          progressMap.set(p.user_id, p as UserProgress);
        }
      }
    }

    // 3. Montar subscriptions com contexto de progresso
    const subscriptions: Subscription[] = rawSubs.map(sub => ({
      ...sub,
      progress: sub.user_id ? (progressMap.get(sub.user_id) ?? null) : null,
    }));

    // 4. Para período noturno: filtrar apenas quem NÃO completou hoje
    const toNotify = period === 'evening'
      ? subscriptions.filter(sub => {
          if (!sub.progress) return true; // Sem dados → enviar (sem info suficiente para suprimir)
          return sub.progress.last_completed_date !== todayUTC;
        })
      : subscriptions;

    if (toNotify.length === 0) {
      console.log(`[push/send] Período: ${period} | Todos já concluíram hoje. Nenhum push enviado.`);
      return NextResponse.json({ sent: 0, total: rawSubs.length, skipped_completed: rawSubs.length });
    }

    // 5. Enviar notificações (mensagem personalizada por usuário)
    const wp = getWebPush();
    const expiredEndpoints: string[] = [];

    const results = await Promise.allSettled(
      toNotify.map((sub) => {
        const msg = selectMessage(sub, period);
        const payload = JSON.stringify({
          title: msg.title,
          body: msg.body,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          url: msg.url,
          tag: msg.tag,
        });
        return wp.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
          payload
        );
      })
    );

    results.forEach((result, i) => {
      if (result.status === 'rejected') {
        const err = result.reason as { statusCode?: number };
        if (err?.statusCode === 410 || err?.statusCode === 404) {
          expiredEndpoints.push(toNotify[i].endpoint);
        } else {
          console.error('[push/send] Erro ao enviar:', err);
        }
      }
    });

    // 6. Limpar subscriptions expiradas
    if (expiredEndpoints.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', expiredEndpoints);
    }

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const skippedCompleted = rawSubs.length - toNotify.length;
    console.log(`[push/send] Período: ${period} | Enviadas: ${sent}/${rawSubs.length} | Puladas (já concluíram): ${skippedCompleted} | Expiradas removidas: ${expiredEndpoints.length}`);

    return NextResponse.json({
      sent,
      total: rawSubs.length,
      skipped_completed: skippedCompleted,
      expired_removed: expiredEndpoints.length,
    });
  } catch (err) {
    console.error('[push/send] Erro geral:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export const GET = handlePush;
export const POST = handlePush;
