import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email';
import { postTrialEmailHtml, postTrialEmailSubject } from '@/lib/email-templates/post-trial';

export const maxDuration = 300;

/**
 * GET /api/crons/email-post-trial
 *
 * Cron: todo dia às 12:00 UTC (09:00 BRT)
 * Envia email de renovação para assinaturas Plus expirando em 7, 3 e 1 dia(s),
 * e para assinaturas que expiraram hoje.
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

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  // Janelas de notificação (dias antes da expiração)
  const NOTIFY_WINDOWS = [7, 3, 1, 0]; // 0 = expirou hoje

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const daysLeft of NOTIFY_WINDOWS) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + daysLeft);
    const targetDateStr = targetDate.toISOString().slice(0, 10);

    // Buscar assinaturas ativas que expiram nessa data
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select(`
        user_id,
        expires_at,
        profiles (
          id,
          email,
          name
        )
      `)
      .eq('status', 'active')
      .gte('expires_at', `${targetDateStr}T00:00:00Z`)
      .lt('expires_at', `${targetDateStr}T23:59:59Z`)
      .limit(200);

    if (error) {
      console.error(`[cron/email-post-trial] Erro ao buscar (janela ${daysLeft}d):`, error);
      continue;
    }

    const templateKey = `post-trial-d${daysLeft}`;

    for (const sub of subscriptions ?? []) {
      const profile = Array.isArray(sub.profiles) ? sub.profiles[0] : sub.profiles;
      if (!profile?.email) continue;

      // Idempotência: não enviar o mesmo aviso duas vezes no mesmo dia
      const { data: alreadySent } = await supabase
        .from('email_logs')
        .select('id')
        .eq('user_id', profile.id)
        .eq('template', templateKey)
        .gte('sent_at', `${today}T00:00:00Z`)
        .maybeSingle();

      if (alreadySent) {
        skipped++;
        continue;
      }

      const emailData = { name: profile.name ?? null, expiresInDays: daysLeft };

      const result = await sendEmail({
        to: profile.email,
        subject: postTrialEmailSubject(emailData),
        html: postTrialEmailHtml(emailData),
        tags: [
          { name: 'template', value: 'post-trial' },
          { name: 'days-left', value: String(daysLeft) },
        ],
      });

      if (result.success) {
        await supabase.from('email_logs').insert({
          user_id: profile.id,
          email: profile.email,
          template: templateKey,
          resend_id: result.id ?? null,
          metadata: { expiresInDays: daysLeft, expires_at: sub.expires_at },
        });
        sent++;
      } else {
        failed++;
        console.error(`[cron/email-post-trial] Falha para ${profile.email}:`, result.error);
      }
    }
  }

  console.log(`[cron/email-post-trial] Concluído — enviados: ${sent}, ignorados: ${skipped}, falhas: ${failed}`);
  return NextResponse.json({ sent, skipped, failed });
}
