import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Hotmart webhook events we handle
const HANDLED_EVENTS = [
  'PURCHASE_COMPLETE',
  'PURCHASE_APPROVED',
  'PURCHASE_CANCELED',
  'PURCHASE_REFUNDED',
  'PURCHASE_CHARGEBACK',
  'SUBSCRIPTION_CANCELLATION',
] as const;

type HotmartEvent = (typeof HANDLED_EVENTS)[number];

interface HotmartWebhookPayload {
  id: string;
  creation_date: number;
  event: string;
  version: string;
  data: {
    product?: {
      id: string | number;
      name: string;
    };
    purchase?: {
      transaction: string;
      order_date?: string;
      approved_date?: string;
      status: string;
      payment?: {
        value: number;
        currency_value: string;
        type: string;
      };
    };
    buyer?: {
      name: string;
      email: string;
    };
    subscription?: {
      subscriber?: {
        code: string;
      };
      plan?: {
        name: string;
      };
      status?: string;
    };
  };
}

type PlanInterval = 'mensal' | 'trimestral' | 'anual';

// Detecta o intervalo do plano pelo nome que o produtor configurou na Hotmart
function detectPlanInterval(planName?: string): PlanInterval {
  if (!planName) return 'mensal';
  const name = planName.toLowerCase();
  if (name.includes('anual') || name.includes('annual') || name.includes('12')) return 'anual';
  if (name.includes('trimestral') || name.includes('quarterly') || name.includes('3 mes') || name.includes('3mes')) return 'trimestral';
  return 'mensal';
}

// Calcula expires_at com margem de 5 dias por segurança
function calcExpiresAt(interval: PlanInterval): string {
  const DAYS: Record<PlanInterval, number> = {
    mensal: 35,        // 30 + 5
    trimestral: 95,    // 90 + 5
    anual: 370,        // 365 + 5
  };
  return new Date(Date.now() + DAYS[interval] * 24 * 60 * 60 * 1000).toISOString();
}

// POST /api/webhooks/hotmart — recebe eventos do Hotmart
export async function POST(req: NextRequest) {
  try {
    // 1. Validar HOTTOK (token de segurança Hotmart)
    const hottok = req.headers.get('hottok') ?? req.headers.get('hotmart-hottok');
    const expectedHottok = process.env.HOTMART_HOTTOK;

    if (!expectedHottok) {
      console.error('[hotmart/webhook] HOTMART_HOTTOK não configurado');
      return NextResponse.json({ error: 'Webhook não configurado' }, { status: 500 });
    }

    if (!hottok || hottok !== expectedHottok) {
      console.warn('[hotmart/webhook] HOTTOK inválido:', hottok?.slice(0, 8) + '...');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 2. Parsear payload
    const payload: HotmartWebhookPayload = await req.json();
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

    // 3. Log do webhook
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

    // 4. Processar evento
    if (!buyerEmail) {
      console.warn('[hotmart/webhook] Evento sem email do comprador:', event);
      return NextResponse.json({ received: true, warning: 'sem email' });
    }

    // Buscar usuário pelo email
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', buyerEmail)
      .maybeSingle();

    if (!profile?.id) {
      // Usuário ainda não tem conta — log e aguarda (pode criar conta depois)
      console.warn('[hotmart/webhook] Usuário não encontrado para email:', buyerEmail);
      // Atualizar log como não processado (usuário não existe ainda)
      await supabase
        .from('hotmart_webhook_logs')
        .update({ error: 'user_not_found' })
        .eq('hotmart_transaction', transaction ?? '')
        .eq('buyer_email', buyerEmail);
      return NextResponse.json({ received: true, warning: 'user_not_found' });
    }

    const userId = profile.id;

    // Processar por tipo de evento
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

      default:
        console.log('[hotmart/webhook] Evento não processado:', event);
        return NextResponse.json({ received: true, note: 'evento_ignorado' });
    }

    // Upsert na tabela subscriptions
    const isNewSubscription = ['PURCHASE_COMPLETE', 'PURCHASE_APPROVED'].includes(event);

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

    // Marcar log como processado
    if (transaction) {
      await supabase
        .from('hotmart_webhook_logs')
        .update({ processed: true })
        .eq('hotmart_transaction', transaction)
        .eq('buyer_email', buyerEmail);
    }

    console.log(`[hotmart/webhook] Evento ${event} processado para ${buyerEmail} → status: ${newStatus} | intervalo: ${planInterval ?? 'n/a'}`);
    return NextResponse.json({ received: true, event, status: newStatus });
  } catch (err) {
    console.error('[hotmart/webhook] Erro interno:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// GET — health check (útil para verificar se o endpoint está no ar)
export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: 'hotmart-webhook' });
}
