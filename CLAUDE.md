# Claude Projects Hub

Mark's personal site: one place that lists every project he and Claude have built.
Mark is not a coder. Explain every technical term the first time and go step by step.

Built and committed on 10 October 2026. Not yet pushed or published.
Read `README.md` for how the files fit together and the setup steps.

## What it is now

A plain HTML, CSS and JS site. No build step, no npm install, no framework.
Open `index.html` through a local server and it runs.

- `index.html` the shape of the page
- `styles.css` all the looks
- `app.js` all the behavior
- `projects.js` the project list that ships with the site
- `tools.js` the "Tools I use" list at the foot of the page
- `logos/` one single color SVG per tool
- `config.js` which Supabase project to talk to, and which email may edit
- `supabase/hub_setup.sql` run once to create the table and the rules

Everything it needs is vendored into this folder: Cornerstone
(`cornerstone/`), the Sora and Inter fonts (`assets/fonts.css`) and the
Supabase library (`vendor/supabase.js`). Keep it that way. Mark's Mac runs a
content filter that silently blocks domains it has not seen, so a site that
pulls from a CDN can break for him while working for everyone else.

`design/Main.dc.html` is the original approved design. Reference only.

## Adding or changing a project

Everything lives in `projects.js`. The fields are documented at the top of it.

- **Order is newest first, worked out from `created` at render time.** Set the
  date correctly and the position follows; the array order in the file does not
  decide anything. `created` is the date Mark wants shown, usually when he
  started something; where he overrules that, his date wins. A project with no
  date sits at the end.
- **Once a project exists in the database, editing `projects.js` alone changes
  nothing on the live site.** The database wins by design. Change both, or the
  page and the file will disagree and it will look like a bug.
- **`node sync.js`** says whether the file and the database differ;
  **`node sync.js --write`** rewrites `projects.js` from the database. Needs no
  keys, reads only what any visitor can. Use it after editing on the site, and
  any time the two might have drifted.
  **Careful (found 2026-10-29):** `--write` makes the file match the database
  exactly, so it DROPS every project that lives only in the file. Several recent
  projects (Home Base, Daily, Theme Lab, Thrive Instagram and more) have no
  database row yet. Read the plain `node sync.js` output and the diff before
  writing, and never let it delete projects. Writing to the database still needs the
  service role key, so that direction stays a Claude job.

## Do not edit the old design artifact

https://claude.ai/artifact/SdEyAkCNo1qmriT51Birus is the original mockup. It
froze with five starter projects and publishes nowhere. Renamed on 2026-10-11
to "Projects Hub: original mockup (not the live site)" so the name says so.

On 2026-10-11 another session added a project to it instead of to this repo,
and Mark saw a hub with five projects and wondered why his change was missing.
The live site is this repo plus the Supabase table. Nothing else.
- **`learned`** is Mark's own words about what building it taught him. His
  voice, not a summary. Leave it empty rather than inventing one; the block is
  skipped when there is nothing to say.
- **`url`** may be a full address or a path on this site like
  `files/slides.pdf`. A first segment with no dot in it is treated as a path.
- **`urlLabel`** replaces the link text when a bare path would read badly.
- **`altUrl` and `altLabel`** add a second link. A card with two links is NOT
  clickable as a whole: the overlay would swallow the second link, and nesting
  links is wrong for screen readers. Both become real links instead.
- **`files/`** holds things people download or open directly. Prefer a file
  published here over linking somewhere that needs a login. Cru's Claude
  workspace has public artifact sharing switched off, so an artifact link only
  opens for people signed in there.

Screenshots: capture at 1440x900 with headless Chrome, then
`sips -s format jpeg -s formatOptions 82 -Z 900`. Chrome never exits on its
own, so poll for the file and kill it. A page that loads inside a frame (like
templates.crutastic.com) finishes after `--screenshot` fires and comes out
blank: drive Chrome over `--remote-debugging-port` instead and wait about 12
seconds before capturing. Anything needing a login has to come
from Mark, either as a file or dropped in through edit mode.

Mark wants **everything he builds listed here**, so offer it whenever a project
reaches something worth showing. Never write the `learned` note for him; ask.
He has floated a "projects I'm working on" section for unfinished work and
deferred it on 2026-10-10, so raise it, do not build it.

## The Tools I use section

`tools.js` holds it, and nothing else does. Deliberately **not** in Supabase and
**not** editable on the page: it changes rarely, a second table would be one
more thing to keep in step, and Mark edits it by asking. The band hides itself
in edit mode so nobody clicks at something that will not respond. Search covers
it along with the projects.

Every entry has to be backed by real code in one of Mark's project folders,
checked at the time it was added. Do not add a tool he has only mentioned. The
list was built on 2026-10-12 from a sweep of every project folder; the honest
findings worth keeping were that **no site has analytics of any kind** and
**there is no CI**, publishing is GitHub Pages' own branch publishing.

Deliberately left off, with reasons: Vercel (he researched it for cru-hs-60th
and chose to stay on Pages), Cru Cornerstone (Cru's own, not third party, and no
brand logo exists for it), Homebrew and the `gh` CLI (local machine setup), and
the AI tools listed as recommendations on the Cru Innovation AI Hub, which are
things he published for his team rather than things he builds with.

Logos are single color SVGs in `logos/`, taken from Simple Icons and used as a
CSS mask so one file can be painted any color. `contentworkflow.svg` is
hand-drawn because Bynder's Content Workflow has no Simple Icons entry; it is a
generic mark, not their real logo. Pale brand colors (Supabase green, React
cyan, GoDaddy teal) are darkened in `tools.js` so they read on a near white
tile. To add a tool:
`curl -sf https://cdn.jsdelivr.net/npm/simple-icons@16.35.0/icons/<slug>.svg -o logos/<slug>.svg`
and get its color from `https://cdn.simpleicons.org/<slug>`.

## The two layers of content, and why

`projects.js` is drawn immediately on load. Then Supabase is asked for a saved
list, and if one comes back it replaces what is on screen.

Do not remove the `projects.js` layer. It is what makes the page work with an
empty database, a slow network, or Supabase blocked. The page should never be
blank and should never show a spinner.

## Owner edit mode

The gray dot in the bottom left corner opens an email and password sign in.
Signing in as `ownerEmail` turns on edit mode: drop screenshots into the device
frames, edit title, link, what and why. Changes save to Supabase, so everyone
sees them.

Security lives in `supabase/hub_setup.sql`, not in the page. Anyone may read,
only Mark's email may write. The anon key in `config.js` is meant to be public.
Changing `ownerEmail` in `config.js` grants nobody anything, because the
database checks the email on its own side too.

## Setup: all done as of 2026-10-10

Email sign in is on, `hub_projects` and `hub-screenshots` exist, Mark has a
password, and edit mode has been tested end to end (signed in, dropped a
screenshot, it uploaded and survived a reload).

Still true and worth keeping in mind:

- **Do not use Google sign in here.** His content filter blocks Google auth in
  every browser on his Mac. Email and password goes over fetch, which works.
- **Supabase does not add an 'email' identity** when an account that started
  with Google gains a password. His account still reports only `google` even
  though the password works. Never use the identity list to decide whether a
  password exists.
- **Setting a password** happens on the hub itself, via the Change password
  button in the edit bar, or by arriving on a reset link. The Supabase
  dashboard's "Send password recovery" is a dead end: it points at the Site
  URL, which is the Flashcards app, and that app has no password form.
- **Adding a column** to `hub_projects` leaves existing rows holding its
  default. The merge then applies that blank over the good value from
  `projects.js`, which looks like a bug in the page and is not. Backfill the
  rows, or have Mark sign in, which rewrites every row in full.
- **GitHub Pages caches for 10 minutes.** After a push, a normal reload serves
  the old file. Check with `curl -H "Cache-Control: no-cache"`, and tell Mark
  to use Cmd+Shift+R.

## Rules

- Never push to GitHub without Mark saying so. `git push` is his checkpoint.
- No em dashes in any text. Plain, 6th grade wording.
