/* The links on every card, kept here and nowhere else (decided 2026-11-11).

   Mark's system:
   - A project people can't open (private, or behind a sign in) gets a DEMO.
     The card shows a "Demo" tag in the top right of its colored box, the
     colored box opens the demo, and the first link says "Open the demo".
   - The real thing comes next: "Open the app", "Open the site" and so on,
     with "(private)" when only Mark can get in, or "(login)" when it needs
     a sign in.
   - A project anyone can open just says "Open the site" or "Open the app".
     A plain sign in that anyone can make (like the Flashcards app) needs no
     note and no demo.

   This file wins over the url, urlLabel, altUrl and altLabel fields in
   projects.js AND in the database, on purpose: the links stay in one place,
   and changing them never needs the database key. A project with no entry
   here falls back to those old fields.

   demo   a page on this site (like 'homebase/') or a full address.
   links  in order. label, url, and note ('private' or 'login') if needed.
   none   for a project with nothing to open: a short line saying why.
*/
window.HUB_LINKS = {
  'slideshow-creator': {
    demo: 'slideshow/',
    links: [{ label: 'Open the app', note: 'private', url: 'http://localhost:4760' }]
  },
  'home-base': {
    demo: 'homebase/',
    links: [{ label: 'Open the app', note: 'private', url: 'https://home-base.mark-michal.workers.dev' }]
  },
  'workout-app': {
    demo: 'https://workout-demo.mark-michal.workers.dev',
    links: [{ label: 'Open the app', note: 'private', url: 'https://workout-app.mark-michal.workers.dev' }]
  },
  'theme-lab': {
    demo: 'themelab/',
    links: [{ label: 'Open the app', note: 'private', url: 'https://claude.ai/artifact/EL3HEvQCFPPndjD93e1D5a' }]
  },
  'thrive-instagram': {
    demo: 'thrive/',
    links: [
      { label: 'See it on Instagram', url: 'https://www.instagram.com/thrivestudies/' },
      { label: 'Open the app', note: 'private', url: 'https://claude.ai/artifact/N7bNXdNPM9BAovq6SjJoZG' }
    ]
  },
  'design-templates': {
    demo: 'templates/',
    links: [{ label: 'Open the site', note: 'login', url: 'https://templates.crutastic.com' }]
  },
  'hub': {
    links: [{ label: 'Open the site', url: 'https://projects.crutastic.com' }]
  },
  'pdf-framework': {
    links: [{ label: 'Open the site', url: 'https://mpf.crutastic.com' }]
  },
  'flashcards': {
    links: [{ label: 'Open the app', url: 'https://flashcards.crutastic.com' }]
  },
  'flashcards-deck': {
    links: [
      { label: 'Read the slides (PDF)', url: 'files/building-the-flashcard-app.pdf' },
      { label: 'Open the live deck', note: 'private', url: 'https://claude.ai/artifact/5yVVz1FD3KZJ8uizuS2oBs' }
    ]
  },
  'gttc-revamp': {
    links: [{ label: 'Open the site', url: 'https://markmichal.github.io/gttc-revamp/' }]
  },
  'gttc-cw': {
    none: 'A script on my Mac, nothing to open'
  },
  'launchweek': {
    links: [{ label: 'Open the site', url: 'https://launchweek.crutastic.com' }]
  },
  'legacy': {
    links: [{ label: 'Open the site', url: 'https://highschoollegacy.crutastic.com' }]
  },
  'ai-hub': {
    links: [{ label: 'Open the site', url: 'https://cruglobal.github.io/Cruinnovation-ai-hub/' }]
  },
  'sound-machine': {
    links: [{ label: 'Open the app', url: 'https://sounds.crutastic.com' }]
  },
  'chs-store': {
    demo: 'store/',
    links: [{ label: 'Open the dashboard', note: 'private', url: 'https://claude.ai/artifact/Ns5y5n5Z9wULRQmTYdWmwQ' }]
  },
  'soundboard': {
    links: [{ label: 'Open the app', url: 'https://flashcards.crutastic.com/soundboard/' }]
  },
  'captions': {
    links: [{ label: 'Open the app', url: 'https://markmichal.github.io/caption-cleanup/' }]
  }
};
