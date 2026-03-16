export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { UpdateTicketStatusBodySchema, zodErrorResponse } from '@/lib/validation/schemas';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// PATCH /api/support/tickets/[id]/status — atualizar status (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const admin = getSupabaseAdmin();

    // Verificar role admin/moderator
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.role !== 'admin' && profile?.role !== 'moderator') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { id: ticketId } = await params;
    const rawBody = await req.json();
    const parsed = UpdateTicketStatusBodySchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(zodErrorResponse(parsed.error), { status: 400 });
    }

    const { status } = parsed.data;

    const { data: updated, error } = await admin
      .from('support_tickets')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      console.error('[PATCH /api/support/tickets/[id]/status]', error);
      return NextResponse.json({ error: 'Erro ao atualizar status' }, { status: 500 });
    }

    return NextResponse.json({ ticket: updated });
  } catch (err) {
    console.error('[PATCH /api/support/tickets/[id]/status]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
