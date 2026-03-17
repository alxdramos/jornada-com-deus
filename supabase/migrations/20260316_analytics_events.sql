-- Analytics Events — rastreamento comportamental (A10)
-- Armazena eventos de interação do usuário para análise no painel admin.

create table if not exists analytics_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  event_name  text not null,
  properties  jsonb not null default '{}',
  session_id  text,
  created_at  timestamptz not null default now()
);

-- Índices para queries do painel admin
create index if not exists analytics_events_name_time_idx
  on analytics_events (event_name, created_at desc);

create index if not exists analytics_events_user_time_idx
  on analytics_events (user_id, created_at desc)
  where user_id is not null;

-- RLS
alter table analytics_events enable row level security;

-- Qualquer usuário (incluindo anon) pode inserir eventos
create policy "analytics_insert_public"
  on analytics_events for insert
  to anon, authenticated
  with check (true);

-- Leitura apenas via service_role (painel admin)
-- Nenhuma policy de select para authenticated/anon = acesso negado por padrão
