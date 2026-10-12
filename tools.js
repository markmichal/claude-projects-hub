/* The tools behind the projects.

   This list is NOT in the database. It changes rarely and only by editing this
   file, so there is nothing to sign in for and no second table to keep in step.
   Edit here, push, done.

   Every entry has to be backed by something real in one of Mark's project
   folders. Checked against the code on 12 October 2026. Do not add a tool he
   has only heard of.

   name   what it is called
   url    its website, so the whole tile becomes a link
   logo   file in logos/. These are single color SVGs used as a mask, so the
          file itself carries no color and the one below is painted on.
   color  the brand color, darkened where the real one would be too pale to
          read on a near white tile
   what   what the tool does for anybody, in plain words
   how    what Mark in particular does with it
   used   which projects it shows up in, named as they appear on this page
*/
window.HUB_TOOLS = [
  {
    name: 'Claude',
    url: 'https://claude.ai',
    logo: 'claude.svg',
    color: '#C25B3A',
    what: 'An AI assistant. Claude Code is the version that works with the files on your computer.',
    how: 'Where everything here starts. I describe what I want and Claude builds it, then I keep changing it by talking to it.',
    used: ['Everything on this page']
  },
  {
    name: 'Claude API',
    url: 'https://docs.claude.com',
    logo: 'claude.svg',
    color: '#8A5A46',
    what: 'The way a program, rather than a person, sends a question to Claude and gets an answer back.',
    how: 'It runs inside three of my projects: writing flash cards from a photo or a prompt, answering questions about the framework manual, and turning messy notes into tidy spreadsheet rows.',
    used: ['Flashcards app', 'Product Development Framework', 'Cru HS Legacy site']
  },
  {
    name: 'GitHub',
    url: 'https://github.com',
    logo: 'github.svg',
    color: '#181717',
    what: 'Online storage for code that keeps every version, so nothing is ever truly lost.',
    how: 'Every project lives here. Sending my work up to GitHub is the moment it goes live, so it is the one step I always do on purpose.',
    used: ['Every project']
  },
  {
    name: 'GitHub Pages',
    url: 'https://pages.github.com',
    logo: 'githubpages.svg',
    color: '#222222',
    what: 'Free website hosting built into GitHub. It turns the files in a project into a real web page.',
    how: 'It puts all my sites on the web at no cost. There is no server to run or pay for.',
    used: ['Claude Projects Hub', 'Flashcards app', 'Product Development Framework', 'Cru HS Legacy site', 'LaunchWeek site', 'GTTC revamp']
  },
  {
    name: 'GoDaddy',
    url: 'https://www.godaddy.com',
    logo: 'godaddy.svg',
    color: '#0E8A8A',
    what: 'Where you buy a web address and point it where you want it to go.',
    how: 'I own crutastic.com here and give each project its own address under it, like projects.crutastic.com.',
    used: ['Every site with a crutastic.com address']
  },
  {
    name: 'Supabase',
    url: 'https://supabase.com',
    logo: 'supabase.svg',
    color: '#1F9D63',
    what: 'A database with accounts and file storage attached. The part of an app that remembers things.',
    how: 'It holds the flash cards and everyone’s study progress, and on this site it holds the project list and the screenshots. It is also what my sign in checks.',
    used: ['Flashcards app', 'Claude Projects Hub']
  },
  {
    name: 'Google Apps Script',
    url: 'https://script.google.com',
    logo: 'googleappsscript.svg',
    color: '#1A62C4',
    what: 'Google’s way of running your own small programs inside Sheets, Docs and Drive.',
    how: 'It is the hidden half of two of my sites. It reads and writes the spreadsheet, checks the entry PIN, and keeps my API keys somewhere visitors cannot see them.',
    used: ['Cru HS Legacy site', 'Product Development Framework']
  },
  {
    name: 'Google Sheets',
    url: 'https://sheets.google.com',
    logo: 'googlesheets.svg',
    color: '#1E8E3E',
    what: 'A spreadsheet. Rows and columns anyone on the team already knows how to use.',
    how: 'On the Legacy site the spreadsheet IS the website content. Edit a row and the page changes, so nobody has to touch code to add a story.',
    used: ['Cru HS Legacy site']
  },
  {
    name: 'Google Drive',
    url: 'https://drive.google.com',
    logo: 'googledrive.svg',
    color: '#1A62C4',
    what: 'Online file storage for documents, pictures and video.',
    how: 'Every photo on the Legacy site is served straight out of a Drive folder, so I never have to upload pictures into the site itself.',
    used: ['Cru HS Legacy site']
  },
  {
    name: 'Google Docs',
    url: 'https://docs.google.com',
    logo: 'googledocs.svg',
    color: '#1A62C4',
    what: 'A word processor you can share and edit with other people.',
    how: 'The Product Development manual lives in a Doc. The question answering assistant reads that Doc, so updating the Doc updates what it knows.',
    used: ['Product Development Framework']
  },
  {
    name: 'Content Workflow by Bynder',
    url: 'https://www.bynder.com/en/products/content-workflow/',
    logo: 'contentworkflow.svg',
    color: '#464545',
    what: 'A place where teams draft, review and approve writing before it is published. Cru uses it for website content.',
    how: 'My script writes finished articles straight into it as items waiting for approval, instead of me pasting them in one at a time.',
    used: ['GoToTheCampus Content Workflow']
  },
  {
    name: 'WordPress',
    url: 'https://wordpress.org',
    logo: 'wordpress.svg',
    color: '#21759B',
    what: 'The system a very large share of the world’s websites are built on, including parts of Cru’s.',
    how: 'I do not run a WordPress site. I read content out of the live GoToTheCampus site so I could rebuild it as a test layout, which is cleaner than copying pages by hand.',
    used: ['GTTC revamp']
  },
  {
    name: 'Python',
    url: 'https://www.python.org',
    logo: 'python.svg',
    color: '#3776AB',
    what: 'A programming language that reads a lot like plain English. Popular for small scripts that do one job.',
    how: 'My one Python tool pushes articles into Cru’s content system. It is deliberately plain, with no add ons to install or keep updated.',
    used: ['GoToTheCampus Content Workflow']
  },
  {
    name: 'Node.js',
    url: 'https://nodejs.org',
    logo: 'nodedotjs.svg',
    color: '#4A7D3D',
    what: 'A way to run website code on your own computer instead of in a browser.',
    how: 'I use it for small helper scripts, like the one that checks whether this site’s project list and its database still agree.',
    used: ['Claude Projects Hub', 'Flashcards app']
  },
  {
    name: 'React',
    url: 'https://react.dev',
    logo: 'react.svg',
    color: '#0B93B9',
    what: 'A toolkit for building app screens that update as you use them.',
    how: 'The Flashcards app is built on it. It is my only project that works this way. Everything else here is plain web pages with nothing to build.',
    used: ['Flashcards app']
  },
  {
    name: 'Vite',
    url: 'https://vite.dev',
    logo: 'vite.svg',
    color: '#9135FF',
    what: 'A tool that packages an app up and makes it fast to work on while you build it.',
    how: 'It gives me a live preview of the Flashcards app while I change it, then bundles the finished version for publishing.',
    used: ['Flashcards app']
  },
  {
    name: 'TypeScript',
    url: 'https://www.typescriptlang.org',
    logo: 'typescript.svg',
    color: '#3178C6',
    what: 'Normal website code with labels added, so the computer catches mistakes before anyone sees them.',
    how: 'The Flashcards app is written in it. Every build checks the whole app for mistakes before it will publish.',
    used: ['Flashcards app']
  },
  {
    name: 'Notion',
    url: 'https://www.notion.so',
    logo: 'notion.svg',
    color: '#171717',
    what: 'Notes, documents and simple databases in one place.',
    how: 'Where I plan. The original Flashcards write up still lives there. An early version of the app pulled its cards from Notion, but Supabase replaced that.',
    used: ['Flashcards app (planning)']
  }
];
