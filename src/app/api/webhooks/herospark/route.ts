import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'crypto';
import { herosparkWebhookLimiter } from '@/lib/rate-limit';

// ─── Supabase ────────────────────────────────────────────────────────────────

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type PlanInterval = 'mensal' | 'trimestral' | 'anual';

/**
 * Formato do payload Herospark (campos são Liquid templates preenchidos pelo Herospark):
 * {
 *   "event": "Purchase",
 *   "value": "19.90",           ← já em reais (offer_price / 100)
 *   "offer_id": "xxx",
 *   "buyer_name": "João Silva",
 *   "buyer_email": "joao@email.com",
 *   "buyer_phone": "11999999999",
 *   "buyer_document": "123.456.789-00",
 *   "offer_title": "Jornada Plus — Mensal"
 * }
 */
interface HerosparkPayload {
  event: string;
  value?: string | number;
  offer_id?: string;
  buyer_name?: string;
  buyer_email?: string;
  buyer_phone?: string;
  buyer_document?: string;
  offer_title?: string;
}

// ─── Plano: detectar pelo título da oferta ou pelo valor ─────────────────────

function detectPlanInterval(offerTitle?: string, valueReais?: number): PlanInterval {
  if (offerTitle) {
    const t = offerTitle.toLowerCase();
    if (t.includes('anual') || t.includes('annual') || t.includes('12')) return 'anual';
    if (t.includes('trimestral') || t.includes('quarterly') || t.includes('3 mes') || t.includes('trim')) return 'trimestral';
    if (t.includes('mensal') || t.includes('monthly') || t.includes('mes')) return 'mensal';
  }
  // Fallback por valor em reais
  if (valueReais !== undefined) {
    if (valueReais >= 150) return 'anual';      // R$180
    if (valueReais >= 40)  return 'trimestral'; // R$49,90
  }
  return 'mensal'; // default
}

/**
 * Calcula a data de expiração com 5 dias de buffer para cobrir atrasos de renovação.
 * Mensal = 35 dias | Trimestral = 95 dias | Anual = 370 dias
 */
function calcExpiresAt(interval: PlanInterval): string {
  const DAYS: Record<PlanInterval, number> = {
    mensal:     35,
    trimestral: 95,
    anual:      370,
  };
  return new Date(Date.now() + DAYS[interval] * 24 * 60 * 60 * 1000).toISOString();
}

/** Comparação de string em tempo constante (anti timing-attack). */
function timingSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  // ── 1. Rate limiting distribuído (Upstash Redis) ──────────────────────────
  const rl = await herosparkWebhookLimiter.check(ip);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too Many Requests' }, {
      status: 429,
      headers: { 'Retry-After': '60' },
    });
  }

  // ── 2. Ler e parsear body ─────────────────────────────────────────────────
  let payload: HerosparkPayload;
  try {
    const raw = await req.text();
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  // ── 3. Validar token de segurança ─────────────────────────────────────────
  // O token é passado como query param na URL configurada no Herospark:
  //   https://app.minhajornadadiaria.com.br/api/webhooks/herospark?token=SEU_TOKEN
  const expectedToken = process.env.HEROSPARK_WEBHOOK_SECRET ?? '';

  if (!expectedToken) {
    console.error('[herospark] HEROSPARK_WEBHOOK_SECRET não configurado');
    return NextResponse.json({ error: 'Webhook não configurado' }, { status: 500 });
  }

  const receivedToken =
    req.nextUrl.searchParams.get('token') ??
    req.headers.get('x-herospark-token') ??
    '';

  if (!receivedToken || !timingSafeCompare(receivedToken, expectedToken)) {
    console.warn('[herospark] Token inválido — IP:', ip);
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  // ── 4. Extrair campos do payload ──────────────────────────────────────────
  const event      = (payload.event ?? '').trim();
  const buyerEmail = (payload.buyer_email ?? '').toLowerCase().trim();
  const buyerName  = payload.buyer_name ?? null;
  const offerId    = payload.offer_id ?? null;
  const offerTitle = payload.offer_title ?? '';
  const valueReais = payload.value !== undefined ? parseFloat(String(payload.value)) : 0;

  console.log(`[herospark] Evento: "${event}" | Email: "${buyerEmail}" | Oferta: "${offerTitle}" | Valor: R$${valueReais}`);

  // ── 5. Apenas Purchase é processado (por agora) ───────────────────────────
  if (event !== 'Purchase') {
    console.log(`[herospark] Evento ignorado: ${event}`);
    return NextResponse.json({ received: true, note: 'evento_ignorado' });
  }

  // ── 6. Email obrigatório ──────────────────────────────────────────────────
  if (!buyerEmail) {
    console.warn('[herospark] buyer_email ausente');
    return NextResponse.json({ received: true, warning: 'sem_email' });
  }

  const supabase = getSupabase();

  // ── 7. Idempotência — evitar ativação dupla no mesmo dia ─────────────────
  // Herospark não envia transaction_id, então usamos buyer_email + offer_id + data
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const idempotencyKey = `herospark:${buyerEmail}:${offerId ?? 'nooffer'}:${today}`;

  const { data: dupLog } = await supabase
    .from('hotmart_webhook_logs')
    .select('id')
    .eq('hotmart_transaction', idempotencyKey)
    .eq('processed', true)
    .maybeSingle();

  if (dupLog) {
    console.log(`[herospark] Compra duplicada ignorada: ${idempotencyKey}`);
    return NextResponse.json({ received: true, note: 'already_processed' });
  }

  // ── 8. Log do evento ──────────────────────────────────────────────────────
  const { error: logErr } = await supabase.from('hotmart_webhook_logs').insert({
    event: `herospark:Purchase`,
    hotmart_transaction: idempotencyKey,
    buyer_email: buyerEmail,
    payload: payload as unknown as Record<string, unknown>,
    processed: false,
  });
  if (logErr) console.error('[herospark] Erro ao logar:', logErr);

  // ── 9. Buscar usuário ─────────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', buyerEmail)
    .maybeSingle();

  if (!profile?.id) {
    console.warn(`[herospark] Usuário não encontrado: ${buyerEmail}`);
    await supabase
      .from('hotmart_webhook_logs')
      .update({ error: 'user_not_found' })
      .eq('hotmart_transaction', idempotencyKey);
    return NextResponse.json({ received: true, warning: 'user_not_found' });
  }

  const userId = profile.id;

  // ── 10. Detectar plano e calcular expiração ───────────────────────────────
  const planInterval = detectPlanInterval(offerTitle, valueReais);
  const expiresAt = calcExpiresAt(planInterval);

  // ── 11. Ativar assinatura (upsert — renova se já existia) ─────────────────
  const { error: upsertError } = await supabase
    .from('subscriptions')
    .upsert({
      user_id:       userId,
      plan:          'plus',
      plan_interval: planInterval,
      status:        'active',
      product_id:    offerId ?? null,
      price_paid:    isNaN(valueReais) ? 0 : valueReais,
      currency:      'BRL',
      starts_at:     new Date().toISOString(),
      expires_at:    expiresAt,
      canceled_at:   null,
      updated_at:    new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (upsertError) {
    console.error('[herospark] Erro ao ativar subscription:', upsertError);
    return NextResponse.json({ error: 'Erro ao ativar plano' }, { status: 500 });
  }

  // ── 12. Marcar log como processado ────────────────────────────────────────
  await supabase
    .from('hotmart_webhook_logs')
    .update({ processed: true })
    .eq('hotmart_transaction', idempotencyKey);

  console.log(`[herospark] ✅ Plano ativado — user: ${userId} | intervalo: ${planInterval} | expira: ${expiresAt} | oferta: "${offerTitle}"`);

  // ── 13. Email de confirmação (fire-and-forget) ────────────────────────────
  // Importar dinamicamente para não bloquear a resposta
  Promise.resolve().then(async () => {
    try {
      const { sendEmail } = await import('@/lib/email');
      const { subscriptionConfirmedEmailHtml, subscriptionConfirmedEmailSubject } =
        await import('@/lib/email-templates/subscription-confirmed');

      await sendEmail({
        to: buyerEmail,
        subject: subscriptionConfirmedEmailSubject(),
        html: subscriptionConfirmedEmailHtml({
          name: buyerName,
          planInterval,
          expiresAt,
        }),
        tags: [{ name: 'template', value: 'subscription-confirmed' }],
      });
    } catch (err) {
      console.error('[herospark] Falha ao enviar email de confirmação:', err);
    }
  });

  return NextResponse.json({
    received: true,
    event: 'Purchase',
    plan: planInterval,
    expires_at: expiresAt,
  });
}

// GET — health check
export async function GET(req: NextRequest) {
  const configured = !!process.env.HEROSPARK_WEBHOOK_SECRET;
  return NextResponse.json({
    status: 'ok',
    endpoint: 'herospark-webhook',
    configured,
    webhook_url_example: 'https://app.minhajornadadiaria.com.br/api/webhooks/herospark?token=SEU_TOKEN',
    expected_payload: {
      event: 'Purchase',
      value: '19.90',
      offer_id: 'xxx',
      buyer_name: 'João Silva',
      buyer_email: 'joao@email.com',
      buyer_phone: '11999999999',
      buyer_document: '123.456.789-00',
      offer_title: 'Jornada Plus — Mensal',
    },
    plan_detection: {
      mensal: 'offer_title contém "mensal" ou value < R$40',
      trimestral: 'offer_title contém "trimestral" ou value entre R$40-R$149',
      anual: 'offer_title contém "anual" ou value >= R$150',
    },
  });
}
