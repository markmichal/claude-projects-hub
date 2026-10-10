/* The built-in project list.
   This is what the site shows before it hears back from Supabase, and what it
   falls back to if Supabase is unreachable. Keeping it here means the page is
   never blank, even with no internet.

   id      a short name that never changes. Screenshots and saved edits are
           matched to a project by this id, so do not rename one after launch.
   device  "laptop" or "phone". Picks which frame the screenshot sits in.
   accent  the Cru color behind the frame.
   shot    file in screenshots/, or "" for an empty frame.
*/
window.HUB_PROJECTS = {
  main: [
    {
      id: 'legacy',
      title: 'Cru HS Legacy site',
      what: 'A website celebrating 60 years of Cru High School ministry, with stories and a timeline.',
      why: 'So alumni and staff have one place to remember the history and add their own story.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://highschoollegacy.crutastic.com',
      device: 'laptop',
      accent: 'var(--cs-color-orange)',
      shot: 'legacy.jpg'
    },
    {
      id: 'launchweek',
      title: 'LaunchWeek site',
      what: 'The home page for LaunchWeek, with how to take part and where to get materials.',
      why: 'So students and leaders can find everything for the week without digging through emails.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://launchweek.crutastic.com',
      device: 'laptop',
      accent: 'var(--cs-color-turquoise)',
      shot: 'launchweek.jpg'
    },
    {
      id: 'pdf-framework',
      title: 'Product Development Framework',
      what: 'A one page guide to how Cru Campus Ministry builds products, with the roles and the steps.',
      why: 'So a team can see the whole process at once instead of hunting through slide decks.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://productdevelopment.crutastic.com',
      device: 'laptop',
      accent: 'var(--cs-color-green)',
      shot: 'pdf-framework.jpg'
    },
    {
      id: 'gttc-cw',
      title: 'GoToTheCampus Content Workflow',
      what: 'A script that moves GoToTheCampus content from draft to published.',
      why: 'It saves hours of copying and pasting and cuts down on mistakes.',
      status: 'In use',
      statusVariant: 'information',
      url: '',
      device: 'laptop',
      accent: 'var(--cs-color-purple)',
      shot: ''
    },
    {
      id: 'gttc-revamp',
      title: 'GTTC revamp',
      what: 'A wireframe of a redesigned GoToTheCampus, built from the real site content.',
      why: 'To test a cleaner layout before anyone spends time building it for real.',
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
      what: 'A study app that sorts cards into Leitner boxes.',
      why: 'Cards you know well come back less often, so study time goes to what you are missing.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://flashcards.crutastic.com',
      device: 'phone',
      accent: 'var(--cs-color-brand-fill-loud)',
      shot: 'flashcards.jpg'
    }
  ],
  small: [
    {
      id: 'captions',
      title: 'Caption Cleanup',
      what: 'A page that fixes "Crew" to "Cru" and removes um and uh from caption files.',
      why: 'It saves cleaning up every caption file by hand. Runs offline in the browser.',
      status: 'Live',
      statusVariant: 'success',
      url: 'https://markmichal.github.io/caption-cleanup/',
      device: 'laptop',
      accent: 'var(--cs-color-cyan)',
      shot: 'captions.jpg'
    }
  ]
};
