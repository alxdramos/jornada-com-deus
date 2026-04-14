import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'crypto';

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
 * Determina o intervalo do plano a partir do nome ou valor pago.
 * Herospark pode enviar o nome do plano ou o valor em centavos/reais.
 */
function detectPlanInterval(planName?: string, amountCents?: number): PlanInterval {
  // Tentar pelo nome do plano primeiro
  if (planName) {
    const name = planName.toLowerCase();
    if (name.includes('anual') || name.includes('annual') || name.includes('12')) return 'anual';
    if (name.includes('trimestral') || name.includes('quarterly') || name.includes('3 mes') || name.includes('3mes')) return 'trimestral';
    if (name.includes('mensal') || name.includes('monthly') || name.includes('1 mes')) return 'mensal';
  }

  // Fallback por valor (centavos ou reais — Herospark pode enviar os dois)
  if (amountCents !== undefined) {
    const valueReais = amountCents > 1000 ? amountCents / 100 : amountCents;
    if (valueReais >= 150) return 'anual';      // R$180,00
    if (valueReais >= 40)  return 'trimestral'; // R$49,90
  }

  return 'mensal'; // default
}

/**
 * Calcula expires_at a partir do intervalo.
 * Adiciona 5 dias de buffer para cobrir atrasos de renovação.
 */
function calcExpiresAt(interval: PlanInterval): string {
  const DAYS: Record<PlanInterval, number> = {
    mensal:     35,  // 30 + 5 buffer
    trimestral: 95,  // 90 + 5 buffer
    anual:      370, // 365 + 5 buffer
  };
  return new Date(Date.now() + DAYS[interval] * 24 * 60 * 60 * 1000).toISOString();
}

/** Compara strings em tempo constante para evitar timing attacks. */
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

// ─── Mapeamento de eventos ────────────────────────────────────────────────────
// Herospark pode enviar eventos em snake_case ou com outros nomes.
// Documentação: https://docs.herospark.com/webhooks

const PURCHASE_EVENTS = new Set([
  'payment.approved',
  'payment_approved',
  'purchase.approved',
  'purchase_approved',
  'subscription.activated',
  'subscription_activated',
]);

const CANCEL_EVENTS = new Set([
  'payment.canceled',
  'payment_canceled',
  'payment.refunded',
  'payment_refunded',
  'subscription.canceled',
  'subscription_canceled',
  'subscription.cancelled',
  'subscription_cancelled',
  'chargeback',
  'payment.chargeback',
]);

// ─── Rate limiting simples in-memory ─────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  // ── 1. Rate limiting ──────────────────────────────────────────────────────
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too Many Requests' }, {
      status: 429,
      headers: { 'Retry-After': '60' },
    });
  }

  // ── 2. Ler body ───────────────────────────────────────────────────────────
  let rawBody: string;
  let payload: Record<string, unknown>;

  try {
    rawBody = await req.text();
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Bad Request — payload inválido' }, { status: 400 });
  }

  // ── 3. Validar token de segurança do Herospark ────────────────────────────
  // Herospark envia o token no body (campo "token" ou "secret") ou no header
  // Authorization. Verificamos todas as possibilidades.
  const expectedToken = process.env.HEROSPARK_WEBHOOK_SECRET ?? '';

  if (!expectedToken) {
    console.error('[herospark/webhook] HEROSPARK_WEBHOOK_SECRET não configurado');
    return NextResponse.json({ error: 'Webhook não configurado' }, { status: 500 });
  }

  const receivedToken =
    (payload.token as string) ??
    (payload.secret as string) ??
    req.headers.get('x-herospark-token') ??
    req.headers.get('authorization')?.replace('Bearer ', '') ??
    '';

  if (!receivedToken || !timingSafeCompare(receivedToken, expectedToken)) {
    console.warn('[herospark/webhook] Token inválido — IP:', ip);
    // Logar payload para debug (ajuda a entender o formato real do Herospark)
    console.log('[herospark/webhook] Payload recebido (token inválido):', JSON.stringify(payload).slice(0, 500));
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  // ── 4. Extrair campos do payload Herospark ────────────────────────────────
  // Herospark tem variações de campo — suportamos múltiplos formatos
  const event = String(
    payload.event ??
    payload.type ??
    payload.action ??
    ''
  ).toLowerCase();

  // Email do comprador (múltiplos caminhos)
  const buyerEmail = (
    (payload.customer_email as string) ??
    ((payload.customer as Record<string, unknown>)?.email as string) ??
    ((payload.data as Record<string, unknown>)?.customer_email as string) ??
    ((payload.buyer as Record<string, unknown>)?.email as string) ??
    ''
  ).toLowerCase().trim();

  // ID da transação / pedido (para idempotência)
  const orderId = String(
    payload.order_id ??
    payload.transaction_id ??
    payload.payment_id ??
    ((payload.sale as Record<string, unknown>)?.id) ??
    ''
  );

  // ID da assinatura
  const subscriptionId = String(
    payload.subscription_id ??
    ((payload.subscription as Record<string, unknown>)?.id) ??
    ''
  );

  // Nome do plano
  const planName = String(
    payload.plan_name ??
    payload.plan ??
    ((payload.subscription as Record<string, unknown>)?.plan) ??
    ((payload.plan as Record<string, unknown>)?.name) ??
    ''
  );

  // Valor pago (pode vir em centavos ou reais)
  const rawAmount =
    (payload.amount as number) ??
    (payload.value as number) ??
    ((payload.sale as Record<string, unknown>)?.value as number) ??
    0;

  // Produto
  const productId = String(payload.product_id ?? payload.product ?? '');

  const supabase = getSupabase();

  // ── 5. Logar evento completo (para diagnóstico inicial) ───────────────────
  console.log(`[herospark/webhook] Evento: "${event}" | Email: "${buyerEmail}" | Plano: "${planName}" | Valor: ${rawAmount}`);

  // ── 6. Validar campos obrigatórios ────────────────────────────────────────
  if (!event) {
    console.warn('[herospark/webhook] Evento ausente no payload');
    return NextResponse.json({ error: 'evento ausente' }, { status: 400 });
  }

  if (!buyerEmail) {
    console.warn('[herospark/webhook] Email do comprador ausente');
    // Logar para auditoria
    void supabase.from('hotmart_webhook_logs').insert({
      event: `herospark:${event}`,
      hotmart_transaction: orderId || null,
      buyer_email: null,
      payload,
      processed: false,
      error: 'buyer_email_missing',
    });
    return NextResponse.json({ received: true, warning: 'sem_email' });
  }

  // ── 7. Idempotência ────────────────────────────────────────────────────────
  if (orderId) {
    const { data: existingLog } = await supabase
      .from('hotmart_webhook_logs')
      .select('id, processed')
      .eq('hotmart_transaction', orderId)
      .eq('processed', true)
      .maybeSingle();

    if (existingLog) {
      console.log(`[herospark/webhook] Transação duplicada ignorada: ${orderId}`);
      return NextResponse.json({ received: true, note: 'already_processed' });
    }
  }

  // ── 8. Log do evento ──────────────────────────────────────────────────────
  const { error: logErr } = await supabase.from('hotmart_webhook_logs').insert({
    event: `herospark:${event}`,
    hotmart_transaction: orderId || null,
    buyer_email: buyerEmail,
    payload,
    processed: false,
  });
  if (logErr) console.error('[herospark/webhook] Erro ao logar:', logErr);

  // ── 9. Ignorar eventos desconhecidos ──────────────────────────────────────
  const isPurchaseEvent = PURCHASE_EVENTS.has(event);
  const isCancelEvent = CANCEL_EVENTS.has(event);

  if (!isPurchaseEvent && !isCancelEvent) {
    console.log('[herospark/webhook] Evento não processado:', event);
    return NextResponse.json({ received: true, note: 'evento_ignorado' });
  }

  // ── 10. Buscar usuário no Supabase ────────────────────────────────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, name')
    .eq('email', buyerEmail)
    .maybeSingle();

  if (!profile?.id) {
    console.warn(`[herospark/webhook] Usuário não encontrado: ${buyerEmail}`);
    if (orderId) {
      await supabase
        .from('hotmart_webhook_logs')
        .update({ error: 'user_not_found' })
        .eq('hotmart_transaction', orderId);
    }
    return NextResponse.json({ received: true, warning: 'user_not_found' });
  }

  const userId = profile.id;

  // ── 11. Processar evento ──────────────────────────────────────────────────
  try {
    if (isPurchaseEvent) {
      const planInterval = detectPlanInterval(planName, rawAmount);
      const expiresAt = calcExpiresAt(planInterval);

      const { error: upsertError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan: 'plus',
          plan_interval: planInterval,
          status: 'active',
          hotmart_subscription_id: subscriptionId || null,
          hotmart_transaction: orderId || null,
          product_id: productId || null,
          price_paid: rawAmount > 1000 ? rawAmount / 100 : rawAmount, // normaliza centavos
          currency: 'BRL',
          starts_at: new Date().toISOString(),
          expires_at: expiresAt,
          canceled_at: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (upsertError) {
        console.error('[herospark/webhook] Erro ao criar subscription:', upsertError);
        return NextResponse.json({ error: 'Erro ao processar subscription' }, { status: 500 });
      }

      console.log(`[herospark/webhook] ✅ Plano ativado — user: ${userId} | intervalo: ${planInterval} | expira: ${expiresAt}`);

    } else {
      // Cancelamento / reembolso / chargeback
      const newStatus = event.includes('refund') ? 'refunded' :
                        event.includes('chargeback') ? 'chargeback' : 'canceled';

      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: newStatus,
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('[herospark/webhook] Erro ao cancelar subscription:', updateError);
        return NextResponse.json({ error: 'Erro ao atualizar subscription' }, { status: 500 });
      }

      console.log(`[herospark/webhook] ❌ Plano cancelado — user: ${userId} | status: ${newStatus}`);
    }

    // ── 12. Marcar log como processado ─────────────────────────────────────
    if (orderId) {
      await supabase
        .from('hotmart_webhook_logs')
        .update({ processed: true })
        .eq('hotmart_transaction', orderId);
    }

    return NextResponse.json({
      received: true,
      event,
      action: isPurchaseEvent ? 'activated' : 'canceled',
    });

  } catch (err) {
    console.error('[herospark/webhook] Erro interno:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// GET — health check + informações de configuração
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'herospark-webhook',
    configured: !!process.env.HEROSPARK_WEBHOOK_SECRET,
    purchase_events: [...PURCHASE_EVENTS],
    cancel_events: [...CANCEL_EVENTS],
  });
}
