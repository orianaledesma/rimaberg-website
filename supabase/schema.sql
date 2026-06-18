-- ─────────────────────────────────────────────────────────────────────────
-- RIMA BERG — Supabase schema
-- ─────────────────────────────────────────────────────────────────────────
-- Run once in the Supabase SQL editor (or `supabase db push`). Idempotent.
--
-- Two tables back the /admin panel:
--   · products      — the catalogue (replaces the static CSV/TS data)
--   · site_content  — editable text overrides layered over messages/*.json
--
-- Plus a public Storage bucket `product-images` for uploads.
--
-- Access model: the public site reads with the ANON key (RLS allows SELECT of
-- published rows); the /admin panel writes with the SERVICE ROLE key from
-- server actions (bypasses RLS). The service role key never reaches the client.
-- ─────────────────────────────────────────────────────────────────────────

-- ── Products ──────────────────────────────────────────────────────────────
create table if not exists public.products (
  id               text primary key,              -- url slug + stable id
  name_en          text not null default '',
  name_lt          text not null default '',
  code             text not null default '',      -- studio hallmark, e.g. "Au/0133"
  category         text not null,                 -- earrings|rings|pendants|engagement|carrousel
  status           text not null default 'onRequest', -- onRequest|madeToOrder|soldOut
  images           jsonb not null default '[]'::jsonb, -- ordered array of image paths/urls
  material_en      text not null default '',
  material_lt      text not null default '',
  stones_en        text not null default '',
  stones_lt        text not null default '',
  sizes_en         text not null default '',
  sizes_lt         text not null default '',
  lead_time_en     text not null default '',
  lead_time_lt     text not null default '',
  description_en   text not null default '',
  description_lt   text not null default '',
  featured         boolean not null default false,
  is_new           boolean not null default false,
  hide_description boolean not null default false,
  published        boolean not null default true, -- admin can hide a piece without deleting it
  sort_order       integer not null default 0,    -- controls listing order
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_sort_idx on public.products (sort_order, created_at);

-- ── Editable site text ────────────────────────────────────────────────────
-- One row per (namespace, key, locale). Only keys the admin actually changes
-- are stored; everything else falls back to messages/*.json at request time.
create table if not exists public.site_content (
  namespace   text not null,
  key         text not null,
  locale      text not null,                       -- 'en' | 'lt'
  value       text not null default '',
  updated_at  timestamptz not null default now(),
  primary key (namespace, key, locale)
);

-- ── updated_at trigger ──────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch before update on public.site_content
  for each row execute function public.touch_updated_at();

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.products enable row level security;
alter table public.site_content enable row level security;

-- Public (anon) may read published products and all content overrides.
-- Writes are server-side only via the service role key, which bypasses RLS.
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products
  for select using (published = true);

drop policy if exists "site_content public read" on public.site_content;
create policy "site_content public read" on public.site_content
  for select using (true);

-- ── Storage bucket for uploaded images ──────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Public read of the bucket; uploads/deletes happen via the service role.
drop policy if exists "product-images public read" on storage.objects;
create policy "product-images public read" on storage.objects
  for select using (bucket_id = 'product-images');
