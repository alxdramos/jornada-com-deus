import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email';
import { welcomeEmailHtml, welcomeEmailSubject } from '@/lib/email-templates/welcome';

/**
 * POST /api/email/welcome
 *
 * Triggered por Supabase Database Webhook ao inserir uma nova linha em `profiles`.
 * Protegido por X-Webhook-Secret header (configurar SUPABASE_WEBHOOK_SECRET no Vercel).
 *
 * Payload esperado: { record: { id, name, email } }
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── 1. Validação do secret ────────────────────────────────────────────────
  const secret = req.headers.get('x-webhook-secret') ?? '';
  const expectedSecret = process.env.SUPABASE_WEBHOOK_SECRET ?? '';

  if (!expectedSecret) {
    console.error('[email/welcome] SUPABASE_WEBHOOK_SECRET não configurado');
    return NextResponse.json({ error: 'Não configurado' }, { status: 500 });
  }

  if (secret !== expectedSecret) {
    console.warn('[email/welcome] Secret inválido');
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  // ── 2. Parse do payload ───────────────────────────────────────────────────
  let record: { id: string; name: string | null; email: string } | null = null;

  try {
    const body = await req.json();
    record = body?.record ?? null;
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  if (!record?.email || !record?.id) {
    return NextResponse.json({ error: 'Dados insuficientes no payload' }, { status: 400 });
  }

  // ── 3. Idempotência: verificar se welcome já foi enviado ──────────────────
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: existing } = await supabase
    .from('email_logs')
    .select('id')
    .eq('user_id', record.id)
    .eq('template', 'welcome')
    .maybeSingle();

  if (existing) {
    console.log(`[email/welcome] Welcome já enviado para ${record.email} — ignorando`);
    return NextResponse.json({ received: true, note: 'already_sent' });
  }

  // ── 4. Enviar email ───────────────────────────────────────────────────────
  const result = await sendEmail({
    to: record.email,
    subject: welcomeEmailSubject(record.name),
    html: welcomeEmailHtml({ name: record.name }),
    tags: [{ name: 'template', value: 'welcome' }],
  });

  if (!result.success) {
    console.error(`[email/welcome] Falha ao enviar para ${record.email}:`, result.error);
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // ── 5. Registrar no log ───────────────────────────────────────────────────
  await supabase.from('email_logs').insert({
    user_id: record.id,
    email: record.email,
    template: 'welcome',
    resend_id: result.id ?? null,
  });

  return NextResponse.json({ sent: true, id: result.id });
}
