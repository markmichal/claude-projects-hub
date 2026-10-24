/* The built-in project list.
   This is what the site shows before it hears back from Supabase, and what it
   falls back to if Supabase is unreachable. Keeping it here means the page is
   never blank, even with no internet.

   ORDER MATTERS: newest first. A new project goes at the TOP of its list and
   everything else slides down. The `created` date is what that order is based
   on, so keep the two in step.

   `created` is the date Mark wants shown, which is usually when he started a
   project. The Flashcards app is the exception: he worked on it from August to
   October and October is the date that feels right to him, so that is what it
   says. His call, not a rule to correct.

   id       a short name that never changes. Screenshots and saved edits are
            matched to a project by this id, so do not rename one after launch.
   created  YYYY-MM-DD, taken from when the GitHub repo was made.
   device   "laptop" or "phone". Picks which frame the screenshot sits in.
   accent   the Cru color behind the frame.
   shot     file in screenshots/, or "" for an empty frame.
   learned  what Mark took away from building it. His words.
*/
window.HUB_PROJECTS = {
  main: [
    {
      id: 'theme-lab',
      title: 'Cru Theme Lab',
      created: '2026-10-22',
      what: 'A place to see all my Cru branded themes as a slide deck, a wide video and a vertical video. I rank them, archive the ones I do not like, and grab a prompt plus a sample PDF to use one.',
      why: 'My slide themes were scattered and hit or miss. Ranking them shows Claude what I like, so each new round of themes gets closer, and the best ones can become skills.',
      learned: 'That I can make and rank themes to help me make better slide decks and videos.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://claude.ai/artifact/EL3HEvQCFPPndjD93e1D5a',
      urlLabel: 'Open Theme Lab (Cru sign in)',
      device: 'laptop',
      accent: 'var(--cs-color-brand-fill-loud)',
      shot: ''
    },
    {
      id: 'thrive-instagram',
      title: 'Thrive Instagram',
      created: '2026-10-16',
      what: 'Instagram posts for Thrive Studies that make themselves. Claude drafts each month from the real studies, I approve them on one review page, and they post on their own every Monday and Thursday.',
      why: 'The Thrive account sat quiet for a year. Student leaders need steady help leading their groups, and I did not have time to make posts by hand.',
      learned: '',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://claude.ai/artifact/N7bNXdNPM9BAovq6SjJoZG',
      urlLabel: 'Open the review page (Cru sign in)',
      altUrl: 'https://www.instagram.com/thrivestudies/',
      altLabel: 'See it on Instagram',
      device: 'laptop',
      accent: 'var(--cs-color-navy)',
      shot: 'thrive-instagram.jpg'
    },
    {
      id: 'design-templates',
      title: 'Design Templates',
      created: '2026-10-15',
      what: 'A free gallery of Canva templates from Cru Creative 1 Media. Volunteers tap a design and get their own copy in Canva. Designers add new ones from a simple manager, with no spreadsheet editing.',
      why: 'Movements without Canva Enterprise had no easy way to get our designs. Now they can browse by event and make a design their own in a minute.',
      learned: 'This has been a long-term problem, and this fixed it in a couple of hours. AI makes simple solutions possible for problems that were hard to solve before.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://templates.crutastic.com',
      device: 'laptop',
      accent: 'var(--cs-color-cyan)',
      shot: 'design-templates.jpg'
    },
    {
      id: 'hub',
      title: 'Claude Projects Hub',
      created: '2026-10-10',
      what: 'This site. Every project in one place, with a link, a short note on each, and what I learned building it.',
      why: 'So I can find the things I have made, and show someone without digging back through old messages.',
      learned: 'That a site can have a real login, so I can edit it from the site itself instead of asking Claude for every small change.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://projects.crutastic.com',
      device: 'laptop',
      accent: 'var(--cs-color-lemon-50)',
      shot: 'hub.jpg'
    },
    {
      id: 'pdf-framework',
      title: 'Product Development Framework',
      created: '2026-10-09',
      what: 'A one page guide to how Cru Campus Ministry builds products, with the roles and the steps.',
      why: 'So a team can see the whole process at once instead of hunting through slide decks.',
      learned: 'Connected Claude to ChatGPT to make better images, and built a chat bot that answers questions straight from the document.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://productdevelopment.crutastic.com',
      device: 'laptop',
      accent: 'var(--cs-color-green)',
      shot: 'pdf-framework.jpg'
    },
    {
      id: 'flashcards',
      title: 'Flashcards app',
      created: '2026-10-08',
      what: 'A study app that sorts cards into Leitner boxes.',
      why: 'Cards you know well come back less often, so study time goes to what you are missing.',
      learned: 'That I can build a web app fairly easily. I learned to use Supabase to hold the content, and that Claude Design can make characters, sounds and animations.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://flashcards.crutastic.com',
      device: 'phone',
      accent: 'var(--cs-color-brand-fill-loud)',
      shot: 'flashcards.jpg'
    },
    {
      id: 'flashcards-deck',
      title: 'Building the Flashcard App (slides)',
      created: '2026-10-06',
      what: 'A nine slide deck walking through how the Flashcards app got built, the tools behind it and what surprised me.',
      why: 'So the team could see how it came together, not just that it exists.',
      learned: 'That I can make a whole slide deck just by talking it through with Claude. I do not think I will ever build one by hand again.',
      status: 'Live',
      statusVariant: 'success',
      url: 'files/building-the-flashcard-app.pdf',
      urlLabel: 'Read the slides (PDF)',
      altUrl: 'https://claude.ai/artifact/5yVVz1FD3KZJ8uizuS2oBs',
      altLabel: 'Open the live deck (Cru sign in)',
      device: 'laptop',
      accent: 'var(--cs-color-navy)',
      shot: 'flashcards-deck.jpg'
    },
    {
      id: 'gttc-revamp',
      title: 'GTTC revamp',
      created: '2026-09-10',
      what: 'A wireframe of a redesigned GoToTheCampus, built from the real site content.',
      why: 'To test a cleaner layout before anyone spends time building it for real.',
      learned: 'That I can clone a website pretty easily.',
      status: 'Prototype',
      statusVariant: 'warning',
      url: 'https://markmichal.github.io/gttc-revamp/',
      device: 'laptop',
      accent: 'var(--cs-color-cerise)',
      shot: 'gttc-revamp.jpg'
    },
    {
      id: 'gttc-cw',
      title: 'GoToTheCampus Content Workflow',
      created: '2026-07-17',
      what: 'A script that moves GoToTheCampus content from draft to published.',
      why: 'It saves hours of copying and pasting and cuts down on mistakes.',
      learned: 'My first time working with an outside API. The key sits in a .env file on my Mac, so it never goes up to GitHub.',
      status: 'In use',
      statusVariant: 'information',
      url: '',
      device: 'laptop',
      accent: 'var(--cs-color-purple)',
      shot: ''
    },
    {
      id: 'launchweek',
      title: 'LaunchWeek site',
      created: '2026-07-13',
      what: 'The home page for LaunchWeek, with how to take part and where to get materials.',
      why: 'So students and leaders can find everything for the week without digging through emails.',
      learned: 'That I can build a whole site from my phone. I took a picture of a flyer and Claude turned it into this.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://launchweek.crutastic.com',
      device: 'laptop',
      accent: 'var(--cs-color-turquoise)',
      shot: 'launchweek.jpg'
    },
    {
      id: 'legacy',
      title: 'Cru HS Legacy site',
      created: '2026-06-10',
      what: 'A website celebrating 60 years of Cru High School ministry, with stories and a timeline.',
      why: 'So alumni and staff have one place to remember the history and add their own story.',
      learned: 'My introduction to GitHub. The content lives in a spreadsheet and Apps Script moves it onto the site, and I learned to use the API for the entry forms.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://highschoollegacy.crutastic.com',
      device: 'laptop',
      accent: 'var(--cs-color-orange)',
      shot: 'legacy.jpg'
    },
    {
      id: 'ai-hub',
      title: 'Cru Innovation AI Hub',
      created: '2026-05-04',
      what: 'A guide to using Claude and Gemini at work, with a side by side comparison, tips and training.',
      why: 'So the Innovation team can get going with AI without needing a computer science degree first.',
      learned: 'My first website build. I learned I could make a whole site, and change it later, just by talking to Claude instead of editing it myself.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://markmichal.github.io/Cruinnovation-ai-hub/',
      device: 'laptop',
      accent: 'var(--cs-color-cyan)',
      shot: 'ai-hub.jpg'
    }
  ],
  small: [
    {
      id: 'sound-machine',
      title: 'Sound Machine',
      created: '2026-10-16',
      what: 'An iPhone style sound board with 12 big photo buttons and real recorded sounds, like applause, a drumroll and a sad trombone.',
      why: 'A fun tool for events and meetings that fits on one phone screen. Every sound and photo is free to use, with credits.',
      learned: 'I made an idea parking lot in Notion. I talk an idea through with Claude by voice in the car or on a run and park it there. When I get home, Claude Code picks it up and builds it. Now my ideas turn into action even when I am away from my desk.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://sounds.crutastic.com',
      device: 'phone',
      accent: 'var(--cs-color-pink-60)',
      shot: 'sound-machine.jpg'
    },
    {
      id: 'chs-store',
      title: 'CHS Cru Store sales dashboard',
      created: '2026-10-11',
      what: 'A live dashboard of CHS sales, reorders, spending and profit from the Cru Store reports, with sections for Soularium cards and THE FOUR bands.',
      why: 'So we can see how sales are going, what to reorder, and what we actually make on each product.',
      learned: 'That I can put together a dashboard that keeps me on top of what we sell, and tells me what to do next.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://claude.ai/artifact/Ns5y5n5Z9wULRQmTYdWmwQ',
      urlLabel: 'Open the dashboard (Cru sign in)',
      device: 'laptop',
      accent: 'var(--cs-color-green)',
      shot: 'chs-store.jpg'
    },
    {
      id: 'soundboard',
      title: 'Sound Board',
      created: '2026-10-06',
      what: 'A board of 20 sound effect buttons, like an airhorn, a rimshot and applause. You can install it as an app on your desktop.',
      why: 'A quick, fun tool for events and meetings. It works offline, and every sound is made by the browser, so there are no files to manage.',
      learned: 'I wanted to see if I could make a quick app from my phone with just one prompt, during a break at an event. This is what came out.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://flashcards.crutastic.com/soundboard/',
      device: 'laptop',
      accent: 'var(--cs-color-orange)',
      shot: 'soundboard.jpg'
    },
    {
      id: 'captions',
      title: 'Caption Cleanup',
      created: '2026-09-25',
      what: 'A page that fixes "Crew" to "Cru" and removes um and uh from caption files.',
      why: 'It saves cleaning up every caption file by hand. Runs offline in the browser.',
      learned: 'That I can make simple web tools that solve a real problem for people.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://markmichal.github.io/caption-cleanup/',
      device: 'laptop',
      accent: 'var(--cs-color-cyan)',
      shot: 'captions.jpg'
    }
  ]
};
