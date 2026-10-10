# Claude Projects Hub

One page that lists every project Mark has built with Claude.
Live at **https://projects.crutastic.com**

## What is in this folder

| File or folder | What it does |
|---|---|
| `index.html` | The page itself. The shape of it, with no content filled in. |
| `styles.css` | All the looks: colors, spacing, the laptop and phone frames. |
| `app.js` | All the behavior: drawing the cards, search, sign in, saving. |
| `projects.js` | **The project list.** Edit this to change what shows up with no database involved. |
| `config.js` | Which Supabase project to talk to, and which email may edit. |
| `screenshots/` | The pictures inside the laptop and phone frames. |
| `cornerstone/` | The Cru Cornerstone design system, saved as plain files. |
| `assets/fonts.css` | Sora and Inter, baked right into the file. |
| `vendor/supabase.js` | The Supabase library, saved as a plain file. |
| `supabase/hub_setup.sql` | Run once to set up the database. See below. |
| `CNAME` | Tells GitHub Pages the address is projects.crutastic.com. |
| `design/Main.dc.html` | The original approved design. Kept for reference, not used by the site. |

Nothing here needs building, bundling or installing. It is plain files that a
browser can open. Everything the page needs is inside this folder, so nothing
can break because an outside site went down or got blocked.

## Two ways to change the project list

**The simple way:** edit `projects.js` and push. Good for adding a project.

**The website way:** click the small gray dot in the bottom left corner, sign in,
and edit right on the page. Those changes go into Supabase, so everyone sees them.

If both exist, Supabase wins. The list in `projects.js` is the safety net: it is
what shows up while the page waits on Supabase, and what shows up if Supabase is
empty, slow or unreachable. The page is never blank.

## First time setup

### 1. Set up the database (once)

1. Open your Supabase dashboard and pick the project the Flashcards app uses.
2. Go to **SQL Editor**, click **New query**.
3. Open `supabase/hub_setup.sql`, copy all of it, paste it in, click **Run**.

That creates a table called `hub_projects`, a picture folder called
`hub-screenshots`, and the rules about who may change what.

### 2. Turn on email sign in

Checked on 10 October 2026: email sign in is currently **off** in that Supabase
project, because the Flashcards app only uses Google. The hub needs it on.

1. Supabase dashboard, **Authentication**, then **Sign In / Providers**.
2. Find **Email** in the list and switch it on. Save.

### 3. Give yourself a password

Your account probably has no password yet, since you have been signing in with
Google.

1. Supabase dashboard, **Authentication**, **Users**.
2. Find `mark.michal@cru.org`, click the three dots at the end of the row, choose
   **Reset password**, and follow the email that arrives.

If no account with that email exists yet, use **Add user** on that same page and
create one with a password.

### 4. Turn on GitHub Pages

1. Push this folder to a GitHub repo named `claude-projects-hub`.
2. Repo **Settings**, **Pages**. Source: **Deploy from a branch**, branch `main`,
   folder `/ (root)`.
3. Under **Custom domain**, type `projects.crutastic.com` and save.
4. At whoever runs crutastic.com, add a **CNAME** record:
   name `projects`, value `markmichal.github.io`.
5. Wait a few minutes, then check **Enforce HTTPS** on that same Pages page.

### 5. Allow the new address on your Mac

Your Mac's content filter quietly blocks web addresses it has not seen. Add
`projects.crutastic.com` to the allowed list, or the site may just never load
for you while working fine for everyone else.

## About that key in config.js

`config.js` has a Supabase web address and a long key in it, and both get
published. That is on purpose and it is safe. Supabase calls it the "anon" or
"publishable" key, and every visitor's browser needs it just to say hello.

What protects the data is the rules in `hub_setup.sql`. They say anyone may
**read** the project list, and only an account with your email may **change** it.
So someone copying the key out of the page can see exactly what the page already
shows them, and nothing more.

The dangerous key is the **service role** key. It is not in this folder, it is
not on GitHub, and it should stay that way.

Changing `ownerEmail` in `config.js` does not grant anyone anything. The database
checks the email on its own side too. To really change who can edit, change the
email in `hub_setup.sql` and run it again.

## Working on it locally

The page loads files next to it, which browsers block when you just double click
the HTML file. Run a tiny local server instead:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in a browser. Press Ctrl+C in the terminal to stop.

## House rules

- Never `git push` without Mark saying so.
- No em dashes anywhere in the text.
- Plain words, around a 6th grade reading level.
