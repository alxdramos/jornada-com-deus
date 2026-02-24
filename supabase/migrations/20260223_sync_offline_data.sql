-- Migration: Offline Sync Tables
-- Criado em: 2026-02-23
-- Descrição: Tabelas para receber dados criados offline (orações personalizadas e notas do diário)
-- Execute no Supabase SQL Editor

-- ============================================================
-- TABELA: prayers (orações personalizadas)
-- ============================================================
create table if not exists public.prayers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text not null,
  content     text not null,
  category    text,
  local_id    text,                  -- ID local do Dexie/localStorage (ex: 'custom-1234567890')
  is_personal boolean default true,
  answered    boolean default false,
  date        timestamptz default now(),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (user_id, local_id)         -- evita duplicatas no upsert
);

-- Row Level Security: cada usuário acessa apenas suas próprias orações
alter table public.prayers enable row level security;

create policy "prayers_own_user"
  on public.prayers
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Índice para queries por user_id
create index if not exists prayers_user_id_idx on public.prayers (user_id);

-- ============================================================
-- TABELA: journal_entries (notas do diário)
-- ============================================================
create table if not exists public.journal_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  type        text not null check (type in ('anotacao', 'destaque', 'citacao', 'reflexao')),
  title       text,
  content     text not null,
  reference   text,                  -- ex: "João 3:16"
  tags        text[],
  favorite    boolean default false,
  local_id    text,                  -- ID local do Dexie/localStorage
  date        timestamptz default now(),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (user_id, local_id)
);

-- Row Level Security
alter table public.journal_entries enable row level security;

create policy "journal_entries_own_user"
  on public.journal_entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Índice para queries por user_id
create index if not exists journal_entries_user_id_idx on public.journal_entries (user_id);

-- ============================================================
-- TRIGGER: auto-atualiza updated_at
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger prayers_updated_at
  before update on public.prayers
  for each row execute procedure public.handle_updated_at();

create trigger journal_entries_updated_at
  before update on public.journal_entries
  for each row execute procedure public.handle_updated_at();
