import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHmac, timingSafeEqual } from 'crypto';
import { timingSafeCompare, detectPlanInterval, calcExpiresAt, type PlanInterval } from './utils';
import { HotmartWebhookPayloadSchema } from '@/lib/validation/schemas';
import { hotmartWebhookLimiter } from '@/lib/rate-limit';

// ─── Supabase ────────────────────────────────────────────────────────────────

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Verifica assinatura HMAC-SHA256 opcional.
 * Ativado quando HOTMART_WEBHOOK_SECRET está configurado.
 * O header esperado é X-Hotmart-Signature (formato: sha256=<hex>).
 */
function verifyHmacSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  try {
    const expected = 'sha256=' + createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('hex');

    const bufExpected = Buffer.from(expected, 'utf8');
    const bufProvided = Buffer.from(signatureHeader, 'utf8');

    if (bufExpected.length !== bufProvided.length) return false;
    return timingSafeEqual(bufExpected, bufProvided);
  } catch {
    return false;
  }
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

const HANDLED_EVENTS = [
  'PURCHASE_COMPLETE',
  'PURCHASE_APPROVED',
  'PURCHASE_CANCELED',
  'PURCHASE_REFUNDED',
  'PURCHASE_CHARGEBACK',
  'SUBSCRIPTION_CANCELLATION',
] as const;

type HotmartEvent = (typeof HANDLED_EVENTS)[number];
type HotmartWebhookPayload = import('@/lib/validation/schemas').HotmartWebhookPayload;

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── 1. Rate limiting ──────────────────────────────────────────────────────
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  const rl = await hotmartWebhookLimiter.check(ip);
  if (!rl.success) {
    console.warn(`[hotmart/webhook] Rate limit excedido para IP: ${ip}`);
    return NextResponse.json(
      { error: 'Too Many Requests' },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': String(rl.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(rl.reset / 1000)),
        },
      }
    );
  }

  // ── 2. Leitura do raw body (necessária para HMAC) ─────────────────────────
  let rawBody: string;
  let payload: HotmartWebhookPayload;

  try {
    rawBody = await req.text();
    const parsed = HotmartWebhookPayloadSchema.safeParse(JSON.parse(rawBody));
    if (!parsed.success) {
      console.warn('[hotmart/webhook] Payload inválido:', parsed.error.issues);
      return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }
    payload = parsed.data;
  } catch {
    console.warn('[hotmart/webhook] Payload inválido (não é JSON)');
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }

  // ── 3. Validação HOTTOK (timing-safe) ────────────────────────────────────
  const hottok = req.headers.get('hottok') ?? req.headers.get('hotmart-hottok') ?? '';
  const expectedHottok = process.env.HOTMART_HOTTOK ?? '';

  if (!expectedHottok) {
    console.error('[hotmart/webhook] HOTMART_HOTTOK não configurado');
    return NextResponse.json({ error: 'Webhook não configurado' }, { status: 500 });
  }

  if (!hottok || !timingSafeCompare(hottok, expectedHottok)) {
    console.warn('[hotmart/webhook] HOTTOK inválido — IP:', ip);
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  // ── 4. Validação HMAC-SHA256 (opcional — ativa com HOTMART_WEBHOOK_SECRET) ─
  const webhookSecret = process.env.HOTMART_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signatureHeader = req.headers.get('x-hotmart-signature') ?? '';
    if (!signatureHeader) {
      console.warn('[hotmart/webhook] HMAC esperado mas ausente — IP:', ip);
      return NextResponse.json({ error: 'Assinatura ausente' }, { status: 401 });
    }
    if (!verifyHmacSignature(rawBody, signatureHeader, webhookSecret)) {
      console.warn('[hotmart/webhook] Assinatura HMAC inválida — IP:', ip);
      return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
    }
  }

  // ── 5. Extrair campos do payload ──────────────────────────────────────────
  try {
    const event = payload.event as HotmartEvent;
    const supabase = getSupabase();

    const buyerEmail = payload.data?.buyer?.email?.toLowerCase().trim();
    const transaction = payload.data?.purchase?.transaction;
    const subscriptionCode = payload.data?.subscription?.subscriber?.code;
    const pricePaid = payload.data?.purchase?.payment?.value ?? 0;
    const currency = payload.data?.purchase?.payment?.currency_value ?? 'BRL';
    const productId = String(payload.data?.product?.id ?? '');
    const planName = payload.data?.subscription?.plan?.name;
    const planInterval = detectPlanInterval(planName);

    // ── 6. Idempotência: bloquear reprocessamento de transações já confirmadas ─
    if (transaction) {
      const { data: existingLog } = await supabase
        .from('hotmart_webhook_logs')
        .select('id, processed')
        .eq('hotmart_transaction', transaction)
        .eq('processed', true)
        .maybeSingle();

      if (existingLog) {
        console.log(`[hotmart/webhook] Transação duplicada ignorada: ${transaction}`);
        return NextResponse.json({ received: true, note: 'already_processed' });
      }
    }

    // ── 7. Log do evento ──────────────────────────────────────────────────
    const { error: logError } = await supabase.from('hotmart_webhook_logs').insert({
      event,
      hotmart_transaction: transaction,
      buyer_email: buyerEmail,
      payload,
      processed: false,
    });

    if (logError) {
      console.error('[hotmart/webhook] Erro ao logar evento:', logError);
    }

    // ── 8. Validação de evento conhecido ──────────────────────────────────
    if (!(HANDLED_EVENTS as readonly string[]).includes(event)) {
      console.log('[hotmart/webhook] Evento não processado:', event);
      return NextResponse.json({ received: true, note: 'evento_ignorado' });
    }

    // ── 9. Buyer obrigatório para eventos de pagamento ────────────────────
    if (!buyerEmail) {
      console.warn('[hotmart/webhook] Evento sem email do comprador:', event);
      return NextResponse.json({ received: true, warning: 'sem_email' });
    }

    // ── 10. Buscar usuário ────────────────────────────────────────────────
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', buyerEmail)
      .maybeSingle();

    if (!profile?.id) {
      console.warn('[hotmart/webhook] Usuário não encontrado para o email recebido');
      if (transaction) {
        await supabase
          .from('hotmart_webhook_logs')
          .update({ error: 'user_not_found' })
          .eq('hotmart_transaction', transaction)
          .eq('buyer_email', buyerEmail);
      }
      return NextResponse.json({ received: true, warning: 'user_not_found' });
    }

    const userId = profile.id;

    // ── 11. Processar evento ──────────────────────────────────────────────
    let subscriptionData: Record<string, unknown> = {};
    let newStatus: string = 'inactive';

    switch (event) {
      case 'PURCHASE_COMPLETE':
      case 'PURCHASE_APPROVED':
        newStatus = 'active';
        subscriptionData = {
          user_id: userId,
          plan: 'plus',
          plan_interval: planInterval,
          status: 'active',
          hotmart_subscription_id: subscriptionCode ?? null,
          hotmart_transaction: transaction,
          product_id: productId,
          price_paid: pricePaid,
          currency,
          starts_at: new Date().toISOString(),
          expires_at: calcExpiresAt(planInterval),
          canceled_at: null,
          updated_at: new Date().toISOString(),
        };
        break;

      case 'PURCHASE_CANCELED':
      case 'SUBSCRIPTION_CANCELLATION':
        newStatus = 'canceled';
        subscriptionData = {
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        break;

      case 'PURCHASE_REFUNDED':
        newStatus = 'refunded';
        subscriptionData = {
          status: 'refunded',
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        break;

      case 'PURCHASE_CHARGEBACK':
        newStatus = 'chargeback';
        subscriptionData = {
          status: 'chargeback',
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        break;
    }

    // ── 12. Upsert/Update subscriptions ──────────────────────────────────
    const isNewSubscription = event === 'PURCHASE_COMPLETE' || event === 'PURCHASE_APPROVED';

    if (isNewSubscription) {
      const { error: upsertError } = await supabase
        .from('subscriptions')
        .upsert(subscriptionData, { onConflict: 'user_id' });

      if (upsertError) {
        console.error('[hotmart/webhook] Erro ao criar subscription:', upsertError);
        return NextResponse.json({ error: 'Erro ao processar subscription' }, { status: 500 });
      }
    } else {
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('user_id', userId);

      if (updateError) {
        console.error('[hotmart/webhook] Erro ao atualizar subscription:', updateError);
        return NextResponse.json({ error: 'Erro ao atualizar subscription' }, { status: 500 });
      }
    }

    // ── 13. Marcar log como processado ────────────────────────────────────
    if (transaction) {
      await supabase
        .from('hotmart_webhook_logs')
        .update({ processed: true })
        .eq('hotmart_transaction', transaction)
        .eq('buyer_email', buyerEmail);
    }

    console.log(`[hotmart/webhook] Evento ${event} processado → status: ${newStatus} | intervalo: ${planInterval}`);
    return NextResponse.json({ received: true, event, status: newStatus });

  } catch (err) {
    console.error('[hotmart/webhook] Erro interno:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// GET — health check
export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: 'hotmart-webhook' });
}
