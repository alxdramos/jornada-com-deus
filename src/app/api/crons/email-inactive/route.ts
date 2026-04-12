import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email';
import { inactiveD3EmailHtml, inactiveD3EmailSubject } from '@/lib/email-templates/inactive-d3';

export const maxDuration = 300;

/**
 * GET /api/crons/email-inactive
 *
 * Cron: todo dia às 13:00 UTC (10:00 BRT)
 * Envia email para usuários que não completaram nenhum dia nos últimos 3 dias.
 * Protegido por Authorization: Bearer ${CRON_SECRET} (injetado automaticamente pelo Vercel).
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

  // ── 2. Buscar usuários inativos há 3 dias ─────────────────────────────────
  // Usuários com perfil cujo last_completed_date é NULL ou < hoje - 3 dias
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const cutoffDate = threeDaysAgo.toISOString().slice(0, 10); // YYYY-MM-DD

  const { data: inactiveUsers, error } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      name,
      user_progress (
        current_streak,
        last_completed_date
      )
    `)
    .not('email', 'is', null)
    .limit(500); // processar em lotes para não sobrecarregar Resend

  if (error) {
    console.error('[cron/email-inactive] Erro ao buscar usuários:', error);
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }

  // Filtrar quem não completou nos últimos 3 dias
  const targets = (inactiveUsers ?? []).filter((u) => {
    const progress = Array.isArray(u.user_progress) ? u.user_progress[0] : u.user_progress;
    const lastDate = progress?.last_completed_date;
    return !lastDate || lastDate < cutoffDate;
  });

  // ── 3. Verificar quem já recebeu email hoje (idempotência) ────────────────
  const today = new Date().toISOString().slice(0, 10);

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const user of targets) {
    if (!user.email) continue;

    const { data: alreadySent } = await supabase
      .from('email_logs')
      .select('id')
      .eq('user_id', user.id)
      .eq('template', 'inactive-d3')
      .gte('sent_at', `${today}T00:00:00Z`)
      .maybeSingle();

    if (alreadySent) {
      skipped++;
      continue;
    }

    const progress = Array.isArray(user.user_progress) ? user.user_progress[0] : user.user_progress;
    const currentStreak = progress?.current_streak ?? 0;

    const result = await sendEmail({
      to: user.email,
      subject: inactiveD3EmailSubject(user.name ?? null),
      html: inactiveD3EmailHtml({ name: user.name ?? null, currentStreak }),
      tags: [{ name: 'template', value: 'inactive-d3' }],
    });

    if (result.success) {
      await supabase.from('email_logs').insert({
        user_id: user.id,
        email: user.email,
        template: 'inactive-d3',
        resend_id: result.id ?? null,
        metadata: { streak: currentStreak },
      });
      sent++;
    } else {
      failed++;
      console.error(`[cron/email-inactive] Falha para ${user.email}:`, result.error);
    }
  }

  console.log(`[cron/email-inactive] Concluído — enviados: ${sent}, ignorados: ${skipped}, falhas: ${failed}`);
  return NextResponse.json({ sent, skipped, failed, total: targets.length });
}
