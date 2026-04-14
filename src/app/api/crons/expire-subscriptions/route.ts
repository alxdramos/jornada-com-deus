import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 60;

/**
 * GET /api/crons/expire-subscriptions
 *
 * Cron: todo dia às 06:00 UTC (03:00 BRT)
 * Verifica assinaturas com expires_at no passado e status=active,
 * marca como 'expired', e o trigger sync_profile_plan atualiza profiles.plan → 'free'.
 *
 * Protegido por Authorization: Bearer ${CRON_SECRET}
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date().toISOString();

  // ── Buscar assinaturas ativas vencidas ────────────────────────────────────
  const { data: expired, error: fetchError } = await supabase
    .from('subscriptions')
    .select('id, user_id, plan_interval, expires_at')
    .eq('status', 'active')
    .lt('expires_at', now);

  if (fetchError) {
    console.error('[cron/expire-subscriptions] Erro ao buscar expiradas:', fetchError);
    return NextResponse.json({ error: 'Erro ao buscar assinaturas' }, { status: 500 });
  }

  if (!expired || expired.length === 0) {
    console.log('[cron/expire-subscriptions] Nenhuma assinatura expirada encontrada.');
    return NextResponse.json({ expired: 0 });
  }

  console.log(`[cron/expire-subscriptions] ${expired.length} assinatura(s) a expirar`);

  // ── Marcar como expired em lote ───────────────────────────────────────────
  // O trigger trg_sync_profile_plan cuida de atualizar profiles.plan → 'free'
  const ids = expired.map((s) => s.id);

  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      status: 'expired',
      updated_at: now,
    })
    .in('id', ids);

  if (updateError) {
    console.error('[cron/expire-subscriptions] Erro ao expirar:', updateError);
    return NextResponse.json({ error: 'Erro ao expirar assinaturas' }, { status: 500 });
  }

  // ── Log detalhado ─────────────────────────────────────────────────────────
  expired.forEach((s) => {
    console.log(`[cron/expire-subscriptions] Expirado — user: ${s.user_id} | intervalo: ${s.plan_interval} | expires_at: ${s.expires_at}`);
  });

  console.log(`[cron/expire-subscriptions] ✅ ${expired.length} assinatura(s) expirada(s) com sucesso`);
  return NextResponse.json({ expired: expired.length, ids });
}
