-- Claude Projects Hub: one time database setup
--
-- Run this once in Supabase. Dashboard -> SQL Editor -> New query -> paste all
-- of this -> Run. It is safe to run again later; nothing here destroys data.
--
-- Before you run it, change the email on line 63 if yours is different, and make
-- sure it matches ownerEmail in config.js.

-- ---------------------------------------------------------------------------
-- 1. The table that holds the projects
-- ---------------------------------------------------------------------------

create table if not exists public.hub_projects (
  id              text primary key,
  section         text not null default 'main' check (section in ('main', 'small')),
  position        integer not null default 0,
  title           text not null default '',
  what            text not null default '',
  why             text not null default '',
  learned         text not null default '',
  created         date,
  url             text not null default '',
  status          text not null default '',
  status_variant  text not null default 'neutral',
  device          text not null default 'laptop' check (device in ('laptop', 'phone')),
  accent          text not null default '',
  shot            text not null default '',
  updated_at      timestamptz not null default now()
);

-- Keep updated_at honest without anyone having to remember it.
create or replace function public.hub_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists hub_projects_touch on public.hub_projects;
create trigger hub_projects_touch
  before update on public.hub_projects
  for each row execute function public.hub_touch();

-- ---------------------------------------------------------------------------
-- 2. Who is allowed to do what
--
-- Row Level Security means "check every single row against a rule." With it
-- on, nothing is allowed unless a rule below says so. This is what makes it
-- safe to publish the anon key in config.js.
-- ---------------------------------------------------------------------------

alter table public.hub_projects enable row level security;

-- Is the person making this request the owner? Used by the rules below.
create or replace function public.hub_is_owner()
returns boolean
language sql
stable
set search_path = ''
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = lower('mark.michal@cru.org');
$$;

-- Anyone, signed in or not, may read. It is a public website.
drop policy if exists hub_read on public.hub_projects;
create policy hub_read on public.hub_projects
  for select using (true);

-- Only the owner may add, change or remove.
drop policy if exists hub_insert on public.hub_projects;
create policy hub_insert on public.hub_projects
  for insert with check (public.hub_is_owner());

drop policy if exists hub_update on public.hub_projects;
create policy hub_update on public.hub_projects
  for update using (public.hub_is_owner()) with check (public.hub_is_owner());

drop policy if exists hub_delete on public.hub_projects;
create policy hub_delete on public.hub_projects
  for delete using (public.hub_is_owner());

-- ---------------------------------------------------------------------------
-- 3. Where screenshots live
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('hub-screenshots', 'hub-screenshots', true)
on conflict (id) do update set public = true;

-- Anyone may look at a screenshot. Only the owner may put one there,
-- replace it or remove it.
drop policy if exists hub_shots_read on storage.objects;
create policy hub_shots_read on storage.objects
  for select using (bucket_id = 'hub-screenshots');

drop policy if exists hub_shots_insert on storage.objects;
create policy hub_shots_insert on storage.objects
  for insert with check (bucket_id = 'hub-screenshots' and public.hub_is_owner());

drop policy if exists hub_shots_update on storage.objects;
create policy hub_shots_update on storage.objects
  for update using (bucket_id = 'hub-screenshots' and public.hub_is_owner())
  with check (bucket_id = 'hub-screenshots' and public.hub_is_owner());

drop policy if exists hub_shots_delete on storage.objects;
create policy hub_shots_delete on storage.objects
  for delete using (bucket_id = 'hub-screenshots' and public.hub_is_owner());
