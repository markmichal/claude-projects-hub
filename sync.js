#!/usr/bin/env node
/* Pull the live project list out of the database and rewrite projects.js.
 *
 *   node sync.js          see what differs, change nothing
 *   node sync.js --write  rewrite projects.js to match the database
 *
 * Why this exists: the site keeps the list in two places on purpose. The
 * database is what visitors see. projects.js ships with the site so the page
 * is never blank if the database is slow, empty or unreachable. Editing the
 * site writes to the database only, so the two drift apart. This puts them
 * back together instead of making you do it by hand.
 *
 * Only reads public data, so it needs no keys and no sign in.
 */

const fs = require('fs');
const path = require('path');

const cfg = fs.readFileSync(path.join(__dirname, 'config.js'), 'utf8');
const pick = (k) => (cfg.match(new RegExp(k + ":\\s*'([^']*)'")) || [])[1];
const URL = pick('supabaseUrl');
const KEY = pick('supabaseAnonKey');

const FIELDS = [
  ['id', 'id'], ['title', 'title'], ['created', 'created'],
  ['what', 'what'], ['why', 'why'], ['learned', 'learned'],
  ['status', 'status'], ['statusVariant', 'status_variant'],
  ['url', 'url'], ['urlLabel', 'url_label'],
  ['altUrl', 'alt_url'], ['altLabel', 'alt_label'],
  ['device', 'device'], ['accent', 'accent'], ['shot', 'shot']
];

function quote(s) {
  return "'" + String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function render(p) {
  const lines = FIELDS
    // Leave out the optional ones when empty, so cards stay easy to read.
    .filter(([js]) => !['urlLabel', 'altUrl', 'altLabel'].includes(js) || p[js])
    .map(([js]) => '      ' + js + ': ' + quote(p[js]));
  return '    {\n' + lines.join(',\n') + '\n    }';
}

(async () => {
  const res = await fetch(URL + '/rest/v1/hub_projects?select=*', {
    headers: { apikey: KEY, Authorization: 'Bearer ' + KEY }
  });
  if (!res.ok) {
    console.error('Could not read the database:', res.status, await res.text());
    process.exit(1);
  }
  const rows = await res.json();
  if (!rows.length) {
    console.error('The database is empty. Nothing to pull, and overwriting would lose the list.');
    process.exit(1);
  }

  // Newest first, same rule the page uses.
  const byNewest = (a, b) => String(b.created || '').localeCompare(String(a.created || ''));
  const grouped = { main: [], small: [] };
  rows.sort(byNewest).forEach((r) => {
    const p = {};
    FIELDS.forEach(([js, col]) => { p[js] = r[col] == null ? '' : r[col]; });
    (grouped[r.section] || grouped.main).push(p);
  });

  const header = fs.readFileSync(path.join(__dirname, 'projects.js'), 'utf8')
    .split('window.HUB_PROJECTS')[0];
  const out = header + 'window.HUB_PROJECTS = {\n' +
    '  main: [\n' + grouped.main.map(render).join(',\n') + '\n  ],\n' +
    '  small: [\n' + grouped.small.map(render).join(',\n') + '\n  ]\n' +
    '};\n';

  const current = fs.readFileSync(path.join(__dirname, 'projects.js'), 'utf8');
  if (out === current) {
    console.log('Already in step. ' + rows.length + ' projects, nothing to change.');
    return;
  }

  if (process.argv.includes('--write')) {
    fs.writeFileSync(path.join(__dirname, 'projects.js'), out);
    console.log('Rewrote projects.js from the database: ' +
      grouped.main.length + ' main, ' + grouped.small.length + ' smaller.');
    console.log('Check it with git diff, then commit and push.');
  } else {
    console.log('These differ. ' + rows.length + ' projects in the database.');
    console.log('Run  node sync.js --write  to rewrite projects.js to match.');
  }
})();
