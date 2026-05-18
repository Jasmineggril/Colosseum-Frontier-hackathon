-- Run this SQL in the Supabase SQL editor to create the `dreams` table
-- Requires `pgcrypto` extension for gen_random_uuid()
create extension if not exists pgcrypto;

create table if not exists public.dreams (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  dream_text text not null,
  analysis jsonb,
  category text,
  created_at timestamptz default now() not null
);

grant select, insert, update, delete on public.dreams to authenticated;
