-- Claude Projects Hub: add the newer columns
--
-- Run this in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe to run as many times as you like. It only adds what is missing.
--
-- `learned` and `created` may already be there from the first time you ran
-- this. The last three are newer and are NOT there yet. Until they are,
-- editing a project on the live site cannot save, because the page tries to
-- store fields the table has no room for.

alter table public.hub_projects
  add column if not exists learned text not null default '';

alter table public.hub_projects
  add column if not exists created date;

-- Replaces the link text when the raw address would read badly,
-- for example "Read the slides (PDF)" instead of a file path.
alter table public.hub_projects
  add column if not exists url_label text not null default '';

-- A second link on a card, with its own label. Used by the slide deck:
-- the main link is a PDF anyone can open, this one is the live deck.
alter table public.hub_projects
  add column if not exists alt_url text not null default '';

alter table public.hub_projects
  add column if not exists alt_label text not null default '';
