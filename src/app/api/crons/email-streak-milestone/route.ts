import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email';
import { streakMilestoneEmailHtml, streakMilestoneEmailSubject, STREAK_MILESTONES } from '@/lib/email-templates/streak-d28';

export const maxDuration = 300;

/**
 * GET /api/crons/email-streak-milestone
 *
 * Cron: todo dia às 11:00 UTC (08:00 BRT)
 * Envia email de celebração para usuários que atingiram um marco de streak hoje
 * (7, 14, 21, 28, 30, 60, 90 ou 100 dias).
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── 1. Auth ───────────────────────────────────────────────────────────────
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // ── 2. Buscar usuários que completaram hoje E têm streak de marco ─────────
  const today = new Date().toISOString().slice(0, 10);

  const { data: milestoneUsers, error } = await supabase
    .from('user_progress')
    .select(`
      user_id,
      current_streak,
      last_completed_date,
      profiles (
        id,
        email,
        name
      )
    `)
    .eq('last_completed_date', today)
    .in('current_streak', [...STREAK_MILESTONES])
    .limit(500);

  if (error) {
    console.error('[cron/email-streak] Erro ao buscar usuários:', error);
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of milestoneUsers ?? []) {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    if (!profile?.email) continue;

    // Idempotência: não enviar o mesmo marco duas vezes
    const milestoneKey = `streak-milestone-${row.current_streak}`;
    const { data: alreadySent } = await supabase
      .from('email_logs')
      .select('id')
      .eq('user_id', profile.id)
      .eq('template', milestoneKey)
      .maybeSingle();

    if (alreadySent) {
      skipped++;
      continue;
    }

    const emailData = { name: profile.name ?? null, streak: row.current_streak };

    const result = await sendEmail({
      to: profile.email,
      subject: streakMilestoneEmailSubject(emailData),
      html: streakMilestoneEmailHtml(emailData),
      tags: [
        { name: 'template', value: 'streak-milestone' },
        { name: 'streak', value: String(row.current_streak) },
      ],
    });

    if (result.success) {
      await supabase.from('email_logs').insert({
        user_id: profile.id,
        email: profile.email,
        template: milestoneKey,
        resend_id: result.id ?? null,
        metadata: { streak: row.current_streak },
      });
      sent++;
    } else {
      failed++;
      console.error(`[cron/email-streak] Falha para ${profile.email}:`, result.error);
    }
  }

  console.log(`[cron/email-streak] Concluído — enviados: ${sent}, ignorados: ${skipped}, falhas: ${failed}`);
  return NextResponse.json({ sent, skipped, failed, total: (milestoneUsers ?? []).length });
}
