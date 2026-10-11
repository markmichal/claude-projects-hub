-- Claude Projects Hub: add the "created" and "what I learned" columns
--
-- Run this once, the same way as hub_setup.sql:
-- Supabase dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe to run more than once.
--
-- Until this runs, the site still shows both of these correctly, because they
-- come from projects.js. But editing the "What I learned" text on the page
-- cannot save without somewhere to put it.

alter table public.hub_projects
  add column if not exists learned text not null default '';

alter table public.hub_projects
  add column if not exists created date;
