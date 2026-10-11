/* The built-in project list.
   This is what the site shows before it hears back from Supabase, and what it
   falls back to if Supabase is unreachable. Keeping it here means the page is
   never blank, even with no internet.

   ORDER MATTERS: newest first. A new project goes at the TOP of its list and
   everything else slides down. The `created` date is what that order is based
   on, so keep the two in step.

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
      accent: 'var(--cs-color-mint-50)',
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
      id: 'flashcards',
      title: 'Flashcards app',
      created: '2026-08-10',
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
