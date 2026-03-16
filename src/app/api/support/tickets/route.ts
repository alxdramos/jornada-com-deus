export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { CreateTicketBodySchema, zodErrorResponse } from '@/lib/validation/schemas';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET /api/support/tickets — lista tickets do usuário autenticado
export async function GET(_req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const admin = getSupabaseAdmin();

    const { data: tickets, error } = await admin
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('[GET /api/support/tickets] query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Buscar última mensagem de cada ticket
    const ticketIds = (tickets ?? []).map((t) => t.id);
    const lastMessages: Record<string, string> = {};

    if (ticketIds.length > 0) {
      const { data: msgs } = await admin
        .from('ticket_messages')
        .select('ticket_id, message, sender_type, created_at')
        .in('ticket_id', ticketIds)
        .order('created_at', { ascending: false });

      (msgs ?? []).forEach((m) => {
        if (!lastMessages[m.ticket_id]) {
          lastMessages[m.ticket_id] =
            m.sender_type === 'admin' ? `Admin: ${m.message}` : m.message;
        }
      });
    }

    return NextResponse.json({
      tickets: (tickets ?? []).map((t) => ({
        ...t,
        last_message: lastMessages[t.id] ?? null,
      })),
    });
  } catch (err) {
    console.error('[GET /api/support/tickets]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// POST /api/support/tickets — criar novo ticket
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const rawBody = await req.json();
    const parsed = CreateTicketBodySchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(zodErrorResponse(parsed.error), { status: 400 });
    }

    const { subject, category, message } = parsed.data;

    const admin = getSupabaseAdmin();

    // Buscar dados do perfil do usuário
    const { data: profile } = await admin
      .from('profiles')
      .select('name, email, plan')
      .eq('id', user.id)
      .maybeSingle();

    // Usuários Plus recebem prioridade alta
    const priority = profile?.plan === 'plus' ? 'alta' : 'normal';

    // Criar ticket
    const { data: ticket, error: ticketError } = await admin
      .from('support_tickets')
      .insert({
        user_id: user.id,
        subject,
        category,
        priority,
        status: 'aberto',
        user_name: profile?.name ?? null,
        user_email: profile?.email ?? user.email,
        user_plan: profile?.plan ?? 'free',
      })
      .select()
      .single();

    if (ticketError) {
      console.error('[POST /api/support/tickets] ticket error:', ticketError);
      return NextResponse.json({ error: 'Erro ao criar ticket' }, { status: 500 });
    }

    // Criar primeira mensagem
    const { error: msgError } = await admin
      .from('ticket_messages')
      .insert({
        ticket_id: ticket.id,
        sender_type: 'user',
        message,
      });

    if (msgError) {
      console.error('[POST /api/support/tickets] message error:', msgError);
    }

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/support/tickets]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
