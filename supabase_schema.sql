-- Haebaragi Puppyhouse Dashboard Supabase schema
-- Run this in the Supabase SQL editor before using cloud sync.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.customers (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.grooming_reservations (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.adoption_consultations (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.puppies (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supply_purchases (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.accounting_entries (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.settlement_entries (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'customers',
    'grooming_reservations',
    'adoption_consultations',
    'puppies',
    'supply_purchases',
    'accounting_entries',
    'settlement_entries'
  ] loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists "%s anon select" on public.%I', table_name, table_name);
    execute format('drop policy if exists "%s anon insert" on public.%I', table_name, table_name);
    execute format('drop policy if exists "%s anon update" on public.%I', table_name, table_name);
    execute format('drop policy if exists "%s anon delete" on public.%I', table_name, table_name);
    execute format('create policy "%s anon select" on public.%I for select to anon using (true)', table_name, table_name);
    execute format('create policy "%s anon insert" on public.%I for insert to anon with check (true)', table_name, table_name);
    execute format('create policy "%s anon update" on public.%I for update to anon using (true) with check (true)', table_name, table_name);
    execute format('create policy "%s anon delete" on public.%I for delete to anon using (true)', table_name, table_name);
  end loop;
end;
$$;

create index if not exists customers_updated_at_idx on public.customers (updated_at desc);
create index if not exists grooming_reservations_updated_at_idx on public.grooming_reservations (updated_at desc);
create index if not exists adoption_consultations_updated_at_idx on public.adoption_consultations (updated_at desc);
create index if not exists puppies_updated_at_idx on public.puppies (updated_at desc);
create index if not exists supply_purchases_updated_at_idx on public.supply_purchases (updated_at desc);
create index if not exists accounting_entries_updated_at_idx on public.accounting_entries (updated_at desc);
create index if not exists settlement_entries_updated_at_idx on public.settlement_entries (updated_at desc);
