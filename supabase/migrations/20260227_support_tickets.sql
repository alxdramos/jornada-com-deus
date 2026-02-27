-- ============================================================
-- Sistema de Suporte — Tickets e Mensagens
-- ============================================================

-- Tabela principal de tickets
CREATE TABLE public.support_tickets (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject     TEXT        NOT NULL,
  category    TEXT        NOT NULL DEFAULT 'outro'
              CHECK (category IN ('pagamento', 'acesso', 'tecnico', 'feedback', 'outro')),
  priority    TEXT        NOT NULL DEFAULT 'normal'
              CHECK (priority IN ('normal', 'alta')),
  status      TEXT        NOT NULL DEFAULT 'aberto'
              CHECK (status IN ('aberto', 'aguardando', 'resolvido', 'fechado')),
  user_name   TEXT,
  user_email  TEXT,
  user_plan   TEXT        DEFAULT 'free',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mensagens do ticket (thread de conversa)
CREATE TABLE public.ticket_messages (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id   UUID        NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_type TEXT        NOT NULL CHECK (sender_type IN ('user', 'admin')),
  message     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_support_tickets_user_id     ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_status      ON public.support_tickets(status);
CREATE INDEX idx_support_tickets_created_at  ON public.support_tickets(created_at DESC);
CREATE INDEX idx_ticket_messages_ticket_id   ON public.ticket_messages(ticket_id);

-- Trigger: atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_support_ticket_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_support_ticket_updated_at();

-- Trigger: atualizar updated_at do ticket quando nova mensagem for adicionada
CREATE OR REPLACE FUNCTION update_ticket_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.support_tickets
  SET updated_at = NOW(),
      status = CASE
        WHEN NEW.sender_type = 'admin' THEN 'aguardando'
        WHEN NEW.sender_type = 'user' AND (SELECT status FROM public.support_tickets WHERE id = NEW.ticket_id) = 'aguardando' THEN 'aberto'
        ELSE (SELECT status FROM public.support_tickets WHERE id = NEW.ticket_id)
      END
  WHERE id = NEW.ticket_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ticket_messages_update_ticket
  AFTER INSERT ON public.ticket_messages
  FOR EACH ROW EXECUTE FUNCTION update_ticket_on_new_message();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.support_tickets  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages  ENABLE ROW LEVEL SECURITY;

-- support_tickets: usuário lê/cria/atualiza apenas seus tickets
CREATE POLICY "support_tickets_user_select"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "support_tickets_user_insert"
  ON public.support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "support_tickets_user_update"
  ON public.support_tickets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ticket_messages: usuário lê mensagens dos seus tickets
CREATE POLICY "ticket_messages_user_select"
  ON public.ticket_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets
      WHERE id = ticket_messages.ticket_id
        AND user_id = auth.uid()
    )
  );

-- ticket_messages: usuário insere apenas mensagens dos seus tickets
CREATE POLICY "ticket_messages_user_insert"
  ON public.ticket_messages FOR INSERT
  WITH CHECK (
    sender_type = 'user' AND
    EXISTS (
      SELECT 1 FROM public.support_tickets
      WHERE id = ticket_messages.ticket_id
        AND user_id = auth.uid()
    )
  );

-- Realtime para atualizações em tempo real
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_messages;
