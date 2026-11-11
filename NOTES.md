# Claude Projects Hub: project notes

One page that lists every project Mark has built with Claude, each with a screenshot, a link, what it is, why he made it and what he learned. Live at https://projects.crutastic.com. GitHub repo: markmichal/claude-projects-hub (public). README.md has the file list, setup steps and the access audit.

## Why Mark built this
From the hub's own card for itself: "So I can find the things I have made, and show someone without digging back through old messages." What he learned: "That a site can have a real login, so I can edit it from the site itself instead of asking Claude for every small change."

## How to run it
- `python3 -m http.server 4891` in this folder (or the `hub` entry in `.claude/launch.json`), then open http://localhost:4891.
- Publishing: GitHub Pages from `main`. Pages caches for 10 minutes; tell Mark to use Cmd+Shift+R.

## Decisions
- 2026-10-10: Plain HTML, CSS and JS with no build step; everything vendored into the folder. Supabase holds edits made on the page; `projects.js` is the safety net. Email and password sign in only. "Projects I'm working on" section deferred.
- 2026-10-11: The old design artifact was renamed "Projects Hub: original mockup (not the live site)" after another session edited it by mistake.
- 2026-10-12: "Tools I use" section added, kept in `tools.js` only. Vercel, Cru Cornerstone, Homebrew, the gh CLI and the AI Hub's recommended tools are left off on purpose (reasons below).
- 2026-10-29: Page brought to life (hero entrance, counting numbers, cards on scroll, birds that perch, tool ribbon). `sync.js --write` found to drop file-only projects: never let it delete.
- 2026-11-04: Access audit re-checked against the live links (in README.md). Public "what this is" pages for the projects nobody else can open (Home Base, Theme Lab, Cru Store with made-up numbers, Thrive). Mark's call: leave the Legacy site password setting as it is. Bracket rule written down.
- 2026-11-09: Slideshow Creator card added (Mark's ask: "add Kate's birthday video"). Named for the tool, not Kate; no family photos or child's name on this public site. Screenshot is the app's home page with Kate's project card hidden. No public link (runs only on his Mac). `learned` left empty for Mark. File only, no database row yet.
- 2026-11-11: **Link system (Mark's design).** Every card's links live in `links.js`, which beats the url fields in `projects.js` and the database. A project people can't open gets a demo: a "Demo" tag in the top right of its colored box, the colored box opens the demo, and the first link is "Open the demo". Then the real thing: "Open the app" / "Open the site" / "Open the dashboard", with "(private)" when only Mark gets in or "(login)" when it needs a sign in. Open projects just say "Open the site" or "Open the app". A plain sign in anyone can make (Flashcards) gets no note and no demo. Design Templates' live site is marked "(login)" for now because it may get one.
- 2026-11-11: New demo pages `templates/` (the gallery closed on 2026-11-10; uses its intro video with "Creative 1 Media" taken out: the label at 0:15 now reads "Created by Cru", and the small "From Cru Creative 1 Media" line on the gallery page at 1:13 to 1:19 now reads "From Cru") and `slideshow/` (46 second film plus the real screens, shown with a made-up sample project so no family photo is ever public; film source is in `~/AI Projects/slideshow-creator/explainer-film`). Mark: no "Creative 1 Media" anywhere on this site, say "created by Cru".
- 2026-11-11: "Product Development Framework" is now "Ministry Product Framework" (mpf.crutastic.com), with new wording and a new screenshot. Its database row still had the old title and text, so it must be changed there too (edit mode, or the service key).

## Ideas for later
- A "projects I'm working on" section for unfinished work (Mark floated it, deferred 2026-10-10; raise it, don't build it).

## History
- 2026-10-10: Built, set up (Supabase table, email sign in, edit mode tested) and published.
- 2026-10-11 to 10-16: Cru Store dashboard, Tools I use, Sound Board, Design Templates, Sound Machine added.
- 2026-10-24 to 10-29: Thrive Instagram, Theme Lab, Workout App (renamed Daily), Home Base added; page animation.
- 2026-11-03 to 11-05: Thrive walkthrough with explainer film, public showcase pages, access audit, AI Hub link moved to its CruGlobal address.
- 2026-11-09: Project kit added (AGENTS.md, NOTES.md, save points, backup to Drive). The old CLAUDE.md text is kept word for word below.

---

# Detailed working notes (moved from CLAUDE.md on 2026-11-09)

Mark's personal site: one place that lists every project he and Claude have built.
Mark is not a coder. Explain every technical term the first time and go step by step.

Built and committed on 10 October 2026. (Since published at projects.crutastic.com.)
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

## The "what this is" pages

Projects only Mark can open (or that are closed), so each has a public page here instead:

- `thrive/` the Thrive review page, with a 49 second film
- `homebase/` Home Base, with a 32 second film and a tappable demo
- `themelab/` all thirteen slide themes, with every slide
- `store/` the Cru Store dashboard, with invented numbers
- `templates/` Design Templates, with its intro video (Creative 1 Media taken out)
- `slideshow/` Slideshow Creator, with a 46 second film and screens from a made-up sample project

`showcase.css` is the shared look for the last three. `thrive/` keeps its own
copy on purpose: it is a working sample with buttons that respond, not a
showcase, and Mark has already approved how it looks.

Rules these pages follow, and should keep following:

- **A black bar at the top saying plainly what the page is.** "This one is
  just for me", or for the store page, that every number is made up.
- **Nothing real that is not already public.** The store page invents every
  figure but keeps the real product names, since those are public Cru
  products. Home Base's demo invents every idea. The Theme Lab page shows the
  real designs, because designs are the thing worth showing and none of them
  are private.
- **The ranking on the Theme Lab page is real**, read from the Lab's own
  database (`board/state`) on 4 Nov 2026. It is a snapshot. Re-read it before
  trusting it again, and do not invent an order.
- `homebase/app.css` is a copy of the app's own stylesheet, and
  `homebase/demo.html` copies its markup. If the app's look changes, copy
  both again. The demo runs in a frame of its own so the app's CSS cannot
  touch the page around it.

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
- **A card already in the database cannot be changed from `projects.js`.**
  Hit on 4 Nov: the store card's link was changed in the file and the live
  site kept the old one, because `chs-store` has a database row and rows win.
  `home-base`, `theme-lab` and `thrive-instagram` have no row, so the file
  decides for them. Check with
  `curl -s "<supabaseUrl>/rest/v1/hub_projects?select=id" -H "apikey: <anon key from config.js>"`
  before assuming a file edit will show up.
- **Never copy square brackets out of a Cru theme.** The theme sample slides
  write placeholder text as `[Bold Title Here.]`, where the brackets only mean
  "your words go here". They are not part of any theme's design. On 4 Nov a
  film and a page both shipped with brackets around every headline because the
  look was copied straight off the samples. Write real, finished words.
  The Theme Lab's own "Use this theme" button hands over a prompt containing
  `Topic: [ ]`, `Audience: [ ]`, `Message: [ ]`, which is where the habit comes
  from, so strip those before using it.
- No em dashes in any text. Plain, 6th grade wording.
