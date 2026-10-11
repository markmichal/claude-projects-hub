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
own, so poll for the file and kill it. Anything needing a login has to come
from Mark, either as a file or dropped in through edit mode.

Mark wants **everything he builds listed here**, so offer it whenever a project
reaches something worth showing. Never write the `learned` note for him; ask.
He has floated a "projects I'm working on" section for unfinished work and
deferred it on 2026-10-10, so raise it, do not build it.

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
