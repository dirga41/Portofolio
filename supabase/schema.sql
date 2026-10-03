-- Jalankan seluruh file ini sekali di Supabase → SQL Editor → New query → Run.

create extension if not exists "pgcrypto";

-- 1) PROFILE (selalu satu baris, id = 1)
create table if not exists public.profile (
  id                int primary key default 1 check (id = 1),
  name              text not null default '',
  roles             text[] not null default '{}',
  bio               text not null default '',
  avatar_url        text not null default '',
  whatsapp          text not null default '',
  email             text not null default '',
  location          text not null default '',
  available         boolean not null default true,
  availability_text text not null default 'Open for work',
  socials           jsonb not null default '{}'::jsonb,
  updated_at        timestamptz not null default now()
);

-- 2) PROJECTS
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text not null default '',
  live_url    text not null default '',
  repo_url    text not null default '',
  image_url   text not null default '',
  tags        text[] not null default '{}',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- 3) SKILLS
create table if not exists public.skills (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  category   text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Row Level Security: publik hanya boleh membaca.
-- Semua penulisan dilakukan server Next.js memakai service_role key (melewati RLS).
alter table public.profile  enable row level security;
alter table public.projects enable row level security;
alter table public.skills   enable row level security;

drop policy if exists "public read profile"  on public.profile;
drop policy if exists "public read projects" on public.projects;
drop policy if exists "public read skills"   on public.skills;
create policy "public read profile"  on public.profile  for select using (true);
create policy "public read projects" on public.projects for select using (true);
create policy "public read skills"   on public.skills   for select using (true);

-- Baris profil awal (isi lengkapnya dari /admin)
insert into public.profile (id) values (1) on conflict (id) do nothing;

-- Storage bucket publik untuk foto profil & gambar projek
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;
