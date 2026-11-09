# Claude Projects Hub: notes for any AI helper

This file is for whatever AI is helping Mark (Claude today, maybe something else later). Read NOTES.md next: it has why this exists, the decisions, the history, and the detailed how-tos (adding a project, the database, screenshots, the showcase pages, the Tools section). README.md is the public front page on GitHub (files, setup, the access audit); keep it as it is and add to it when those facts change. Copies of past conversations go in `chats/` (kept on this Mac only, never pushed).

Mark's personal site that lists every project he and Claude have built, live at https://projects.crutastic.com. Mark is not a coder: explain every technical term the first time, go step by step, plain 6th grade wording, no em dashes in any text, clickable links.

## Rules
- Never push to GitHub without Mark saying so. `git push` is his checkpoint (pushing publishes the live site).
- This repo is public. Keep private details (real sales numbers, personal info, keys, chat copies) out of every file. The anon key in `config.js` is meant to be public; the Supabase service role key must never be in this folder.
- Keep everything the page needs inside this folder (no CDN links). Mark's Mac has a content filter that silently blocks unfamiliar domains.
- Don't remove the `projects.js` layer: the page must never be blank or show a spinner.
- A card that has a database row can't be changed from `projects.js` alone; the database wins. Check before assuming a file edit will show, and change both. `node sync.js --write` drops projects that live only in the file: read the plain `node sync.js` output first and never let it delete projects.
- The live site is this repo plus the Supabase table. Never edit the old design artifact (claude.ai/artifact/SdEyAkCNo1qmriT51Birus) or `design/Main.dc.html`; they're reference only.
- `learned` is Mark's own words. Never write it for him; ask, or leave it empty.
- Mark wants everything he builds listed here, so offer it when a project reaches something worth showing. The "projects I'm working on" section was deferred (2026-10-10): raise it, don't build it.
- Tools I use: `tools.js` only (not Supabase, not editable on the page), and only tools backed by real code in one of Mark's project folders.
- Showcase pages (`homebase/`, `themelab/`, `store/`, `thrive/`): a black bar on top saying plainly what the page is, and nothing real that isn't already public. Details in NOTES.md.
- Never copy square brackets out of a Cru theme's sample text. Write real, finished words.
- Don't use Google sign in here (his content filter blocks Google auth). Email and password only.

## At the end of every work session
1. Write new decisions into NOTES.md (with the date).
2. Save a copy of the chat: `python3 ~/Projects/project-kit/save-chat.py ~/Projects/claude-projects-hub` (`chats/` is in .gitignore, so it stays on this Mac).
3. Make a save point: `git add -A && git commit -m "<what changed and why>"`. Don't push unless Mark says so.
4. Back up: `~/Projects/project-kit/backup-projects.sh ~/Projects/claude-projects-hub` (copies only what the save point tracks).
