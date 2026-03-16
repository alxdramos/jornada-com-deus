export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { AddTicketMessageBodySchema, zodErrorResponse } from '@/lib/validation/schemas';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET /api/support/tickets/[id]/messages — listar mensagens de um ticket
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id: ticketId } = await params;
    const admin = getSupabaseAdmin();

    // Verificar role do usuário
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const isAdmin =
      profile?.role === 'admin' || profile?.role === 'moderator';

    // Se não for admin, garantir que o ticket pertence ao usuário
    if (!isAdmin) {
      const { data: ticket } = await admin
        .from('support_tickets')
        .select('user_id')
        .eq('id', ticketId)
        .maybeSingle();

      if (ticket?.user_id !== user.id) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
      }
    }

    const { data: messages, error } = await admin
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[GET /api/support/tickets/[id]/messages]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ messages: messages ?? [] });
  } catch (err) {
    console.error('[GET /api/support/tickets/[id]/messages]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// POST /api/support/tickets/[id]/messages — adicionar mensagem
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id: ticketId } = await params;
    const rawBody = await req.json();
    const parsed = AddTicketMessageBodySchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(zodErrorResponse(parsed.error), { status: 400 });
    }

    const { message } = parsed.data;
    const admin = getSupabaseAdmin();

    // Verificar role do usuário
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const isAdmin =
      profile?.role === 'admin' || profile?.role === 'moderator';
    const senderType = isAdmin ? 'admin' : 'user';

    // Se não for admin, verificar posse do ticket e se não está fechado
    if (!isAdmin) {
      const { data: ticket } = await admin
        .from('support_tickets')
        .select('user_id, status')
        .eq('id', ticketId)
        .maybeSingle();

      if (ticket?.user_id !== user.id) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
      }

      if (ticket?.status === 'fechado') {
        return NextResponse.json({ error: 'Ticket fechado' }, { status: 400 });
      }
    }

    const { data: newMessage, error } = await admin
      .from('ticket_messages')
      .insert({
        ticket_id: ticketId,
        sender_type: senderType,
        message,
      })
      .select()
      .single();

    if (error) {
      console.error('[POST /api/support/tickets/[id]/messages]', error);
      return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 });
    }

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/support/tickets/[id]/messages]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
