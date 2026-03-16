import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PushSubscribeBodySchema, PushUnsubscribeBodySchema, zodErrorResponse } from '@/lib/validation/schemas';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// POST /api/push/subscribe — salva ou atualiza subscription
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = PushSubscribeBodySchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(zodErrorResponse(parsed.error), { status: 400 });
    }

    const { subscription, userId } = parsed.data;

    const supabase = getSupabase();
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          user_id: userId ?? null,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth_key: subscription.keys.auth,
          notifications_enabled: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'endpoint' }
      );

    if (error) {
      console.error('[push/subscribe] Supabase error:', error);
      return NextResponse.json({ error: 'Erro ao salvar subscription' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[push/subscribe] Erro:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// DELETE /api/push/subscribe — remove subscription
export async function DELETE(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = PushUnsubscribeBodySchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(zodErrorResponse(parsed.error), { status: 400 });
    }

    const { endpoint } = parsed.data;

    const supabase = getSupabase();
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint);

    if (error) {
      console.error('[push/subscribe] Erro ao deletar:', error);
      return NextResponse.json({ error: 'Erro ao remover subscription' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[push/subscribe] Erro:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
