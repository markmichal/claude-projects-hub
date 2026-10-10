# Claude Projects Hub

Mark's personal site: one place that lists every project he and Claude have built. Mark is not a coder. Explain every technical term the first time and go step by step.

## The design (already approved)
- Design file: `design/Main.dc.html` (a design-tool file, not the final site). Live design: https://claude.ai/artifact/SdEyAkCNo1qmriT51Birus
- Rebuild it as a normal website (plain HTML/CSS/JS or a small Vite build) that can be published on GitHub Pages.
- Use the Cru Cornerstone design system: npm package `@cruglobal/cornerstone-components` (load `cornerstone.css` plus the `cs-*` components). Docs: https://cruglobal.github.io/cornerstone-design-system/ . Fonts: Sora (headings), Inter (body). Colors: navy `--cs-color-navy`, Cru yellow, orange, cerise, purple, turquoise, cyan, green.

## What the page has
- Navy header with the title, section links and a search box (filters projects as you type).
- Hero: headline "Everything we have built, in one place." plus three count boxes (main, smaller, live).
- Cru color stripe under the hero.
- **Main projects**: cards in a grid on a pale yellow background. Each card has a colored panel holding a laptop or phone frame with a screenshot, then the title, a status badge, two plain sentences (what it is, why it exists, NO labels), and the real URL. The whole card is the link.
- **Smaller projects**: wide rows on a pale blue background, same info with a small laptop frame.
- Footer, navy.

## Owner edit mode (Mark only)
- A small gray dot fixed in the bottom-left corner opens a passcode box. No visible "login" button anywhere.
- Edit mode: drop screenshots into the device frames, edit title / link / what / why. A yellow bar says "Edit mode is on" with a Done button. Cards stop being links while editing.
- The design only saves to the browser. REAL version needs a real login and shared saving. Mark already uses Supabase, so recommend Supabase Auth (only Mark can sign in) plus a table for projects and storage for screenshots. Do not rely on a passcode in the page source.

## Project content (starter data, Mark must confirm)
1. Cru HS Legacy site (orange, laptop) - link TBD
2. LaunchWeek site (turquoise, laptop) - https://launchweek.crutastic.com
3. GoToTheCampus Content Workflow (purple, laptop) - link TBD
4. GTTC revamp (cerise, laptop) - link TBD
5. Flashcards app (yellow, PHONE) - link TBD
Smaller: Caption Cleanup (cyan), plus two empty placeholders.
The what/why sentences in the design are drafts. Pull better details from Mark's other project folders and memory, then ask him to approve.

## Rules
- Never push to GitHub without Mark saying so. `git push` is his checkpoint.
- No em dashes in any text. Plain, 6th grade wording.
