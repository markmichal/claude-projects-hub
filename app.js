/* Claude Projects Hub

   How this page works, in order:

   1. Draw the project list that shipped with the site (projects.js). The page
      is useful immediately, with no waiting and no internet needed.
   2. Ask Supabase for a saved list. If one comes back, redraw with it. If
      Supabase is slow, blocked or empty, the page just keeps what it has.
   3. The gray dot in the corner opens a sign in box. Signing in with the owner
      account turns on edit mode.
   4. In edit mode, every change is written back to Supabase, so the next
      visitor sees it too.
*/

(function () {
  'use strict';

  var CFG = window.HUB_CONFIG || {};
  var SEED = window.HUB_PROJECTS || { main: [], small: [] };
  var TABLE = 'hub_projects';
  var BUCKET = 'hub-screenshots';

  // ---- state -------------------------------------------------------------

  var state = {
    main: clone(SEED.main),
    small: clone(SEED.small),
    query: '',
    editing: false,
    user: null
  };

  var sb = null;          // the Supabase client, once it is ready
  var saveTimers = {};    // one delay timer per project, so typing does not spam the database

  function clone(x) { return JSON.parse(JSON.stringify(x || [])); }
  function $(id) { return document.getElementById(id); }

  // ---- drawing -----------------------------------------------------------

  // Browsers treat text put on a page with innerHTML as code. Everything that
  // came from the database goes through this first so it stays plain text.
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function tidyUrl(url) {
    var u = (url || '').trim();
    if (!u) return '';
    if (/^[a-z][a-z0-9+.-]*:/i.test(u) || u.indexOf('//') === 0) return u;
    // A path on this site, like files/slides.pdf, must stay a path. Only a
    // bare domain gets https:// put in front, and a domain has a dot before
    // its first slash.
    var firstSegment = u.split('/')[0];
    if (firstSegment.indexOf('.') === -1) return u;
    return 'https://' + u;
  }

  function shownUrl(url) {
    var u = (url || '').trim();
    if (!u) return 'Link coming soon';
    return u.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  }

  // A second link, for when the main one does not suit everybody. Used by the
  // slide deck: the card opens a PDF anyone can read, and this opens the live
  // deck for people signed in at Cru. It sits above the whole-card link, or
  // the card would swallow the click.
  function altLinkHtml(p) {
    if (!p.altUrl) return '';
    return '<a class="alt-link" href="' + esc(tidyUrl(p.altUrl)) + '" target="_blank" rel="noopener">' +
      '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none"' +
      ' stroke="currentColor" stroke-width="2"><path d="M5 11 11 5M6 5h5v5"/></svg>' +
      esc(p.altLabel || 'Another way in') +
    '</a>';
  }

  function matches(p, q) {
    if (!q) return true;
    return [p.title, p.what, p.why, p.url].join(' ').toLowerCase().indexOf(q) !== -1;
  }

  function frameHtml(p) {
    var inner =
      '<div class="drop' + (state.editing ? ' editable' : '') + '" data-drop="' + esc(p.id) + '">' +
        (state.editing
          ? '<input class="sr" type="file" accept="image/*" data-file="' + esc(p.id) + '"' +
            ' aria-label="Choose a screenshot of ' + esc(p.title) + '">'
          : '') +
        (p.shot
          // If a picture is missing or blocked, hide it rather than showing a
          // broken image icon inside the frame.
          ? '<img src="' + esc(shotSrc(p.shot)) + '" alt="Screenshot of ' + esc(p.title) + '"' +
            ' onerror="this.remove()">'
          : '') +
        (state.editing && !p.shot
          ? '<svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none"' +
            ' stroke="currentColor" stroke-width="2">' +
            '<path d="M14 20V8M9 13l5-5 5 5M5 22h18"/></svg><span>Drop a screenshot here</span>'
          : '') +
      '</div>';

    if (p.device === 'phone') {
      return '<div class="phone"><div class="phone-screen">' + inner + '</div></div>';
    }
    return '<div class="laptop">' +
             '<div class="laptop-lid"><div class="laptop-screen">' + inner + '</div></div>' +
             '<div class="laptop-base"></div>' +
           '</div>';
  }

  // A screenshot is either a file that shipped with the site or a full web
  // address from Supabase storage.
  function shotSrc(shot) {
    return /^https?:\/\//i.test(shot) ? shot : 'screenshots/' + shot;
  }

  function fieldsHtml(p, rows) {
    return '<div class="fields">' +
      '<cs-input size="s" label="Title" value="' + esc(p.title) + '" data-edit="title" data-id="' + esc(p.id) + '"></cs-input>' +
      '<cs-input size="s" label="Link (web address)" placeholder="https://" value="' + esc(p.url) + '" data-edit="url" data-id="' + esc(p.id) + '"></cs-input>' +
      '<cs-textarea size="s" rows="' + rows + '" label="What is it?" value="' + esc(p.what) + '" data-edit="what" data-id="' + esc(p.id) + '"></cs-textarea>' +
      '<cs-textarea size="s" rows="' + rows + '" label="Why does it exist?" value="' + esc(p.why) + '" data-edit="why" data-id="' + esc(p.id) + '"></cs-textarea>' +
      '<cs-textarea size="s" rows="' + rows + '" label="What I learned" value="' + esc(p.learned || '') + '" data-edit="learned" data-id="' + esc(p.id) + '"></cs-textarea>' +
    '</div>';
  }

  var MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

  function niceDate(iso) {
    var m = /^(\d{4})-(\d{2})/.exec(iso || '');
    if (!m) return '';
    return MONTHS[parseInt(m[2], 10) - 1] + ' ' + m[1];
  }

  // "What I learned" block. Skipped entirely when there is nothing to say,
  // so a project without a note just does not show one.
  function learnedHtml(p) {
    if (!p.learned) return '';
    return '<div class="learned">' +
      '<span class="learned-label">What I learned</span>' +
      '<span class="learned-text">' + esc(p.learned) + '</span>' +
    '</div>';
  }

  function linkHtml(p) {
    var live = !!(p.url || '').trim();
    var label = esc(p.urlLabel || shownUrl(p.url));
    // Cards with a second link are not clickable as a whole, so this one has
    // to be a real link rather than a label the card sits under.
    var inner = (live && p.altUrl)
      ? '<a class="urlline url-live real-link" href="' + esc(tidyUrl(p.url)) + '"' +
        ' target="_blank" rel="noopener">' + label + '</a>'
      : '<span class="urlline ' + (live ? 'url-live' : 'url-none') + '">' + label + '</span>';
    return '<div class="card-link">' +
      '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none"' +
      ' stroke="var(--cs-color-text-link)" stroke-width="2"><path d="M5 11 11 5M6 5h5v5"/></svg>' +
      inner +
    '</div>' + altLinkHtml(p);
  }

  // The whole card is a link, unless we are editing. Editing a card you cannot
  // click into would be impossible.
  function stretchHtml(p) {
    var url = tidyUrl(p.url);
    if (state.editing || !url || p.altUrl) return '';
    return '<a class="stretch" href="' + esc(url) + '" target="_blank" rel="noopener"' +
           ' aria-label="Open ' + esc(p.title) + ' at ' + esc(shownUrl(p.url)) + '"></a>';
  }

  function mainCard(p) {
    var linkable = !state.editing && !!(p.url || '').trim() && !p.altUrl;
    return '<div class="card-wrap' + (linkable ? ' is-link' : '') + '">' +
      '<cs-card class="card" appearance="filled-outlined" has-media>' +
        '<div slot="media" class="card-media" style="background: ' + esc(p.accent) + '">' +
          frameHtml(p) +
        '</div>' +
        (state.editing ? fieldsHtml(p, 3) :
          '<div class="card-body">' +
            '<div class="card-head">' +
              '<div class="card-heading">' +
                '<h3 class="card-title">' + esc(p.title) + '</h3>' +
                '<span class="card-date">' + esc(niceDate(p.created)) + '</span>' +
              '</div>' +
              '<cs-badge variant="' + esc(p.statusVariant || 'neutral') + '" appearance="filled" pill>' + esc(p.status) + '</cs-badge>' +
            '</div>' +
            '<p class="card-what">' + esc(p.what) + '</p>' +
            '<p class="card-why">' + esc(p.why) + '</p>' +
            learnedHtml(p) +
            linkHtml(p) +
          '</div>') +
      '</cs-card>' +
      stretchHtml(p) +
    '</div>';
  }

  function smallRow(p) {
    var linkable = !state.editing && !!(p.url || '').trim();
    return '<div class="card-wrap' + (linkable ? ' is-link' : '') + '">' +
      '<div class="row">' +
        '<div class="row-media" style="background: ' + esc(p.accent) + '">' + frameHtml(p) + '</div>' +
        (state.editing ? fieldsHtml(p, 2) :
          '<div class="row-body">' +
            '<span class="row-title">' + esc(p.title) + '</span>' +
            '<span class="card-date">' + esc(niceDate(p.created)) + '</span>' +
            '<span>' + esc(p.what) + '</span>' +
            '<span class="row-why">' + esc(p.why) + '</span>' +
            learnedHtml(p) +
            '<span class="urlline ' + (linkable ? 'url-live' : 'url-none') + '">' + esc(shownUrl(p.url)) + '</span>' +
          '</div>') +
      '</div>' +
      stretchHtml(p) +
    '</div>';
  }

  function render() {
    var q = state.query.trim().toLowerCase();
    var main = state.main.filter(function (p) { return matches(p, q); });
    var small = state.small.filter(function (p) { return matches(p, q); });

    $('main-grid').innerHTML = main.map(mainCard).join('');
    $('small-rows').innerHTML = small.map(smallRow).join('');

    $('band-main').hidden = main.length === 0;
    $('band-small').hidden = small.length === 0;
    $('noresults').hidden = main.length + small.length > 0;

    // Counts always show the real totals, not the filtered ones.
    $('count-main').textContent = state.main.length;
    $('count-small').textContent = state.small.length;
    $('count-live').textContent = state.main.concat(state.small)
      .filter(function (p) { return p.status === 'Live'; }).length;

    $('editbar').hidden = !state.editing;
    $('edithelp').hidden = !state.editing;
    $('owner-dot').hidden = state.editing || !$('signin').hidden;
  }

  // ---- finding and changing a project ------------------------------------

  function findProject(id) {
    var all = state.main.concat(state.small);
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  function setField(id, field, value) {
    var p = findProject(id);
    if (!p) return;
    p[field] = value;
    queueSave(p);
  }

  function note(text) {
    var el = $('savestate');
    if (el) el.textContent = text;
  }

  // Wait until typing stops before writing, so one sentence is one save.
  function queueSave(p) {
    if (!sb) { note('Saved on this computer only. Not signed in to the database.'); return; }
    note('Saving...');
    clearTimeout(saveTimers[p.id]);
    saveTimers[p.id] = setTimeout(function () { saveProject(p); }, 700);
  }

  function saveProject(p) {
    if (!sb) return Promise.resolve();
    return sb.from(TABLE).upsert(toRow(p), { onConflict: 'id' }).then(function (res) {
      note(res.error ? 'Could not save: ' + res.error.message : 'Saved');
      if (res.error) console.error('[hub] save failed', res.error);
    });
  }

  function toRow(p) {
    return {
      id: p.id,
      section: state.main.indexOf(p) !== -1 ? 'main' : 'small',
      position: positionOf(p),
      title: p.title,
      what: p.what,
      why: p.why,
      learned: p.learned || '',
      created: p.created || null,
      url_label: p.urlLabel || '',
      alt_url: p.altUrl || '',
      alt_label: p.altLabel || '',
      url: p.url,
      status: p.status,
      status_variant: p.statusVariant,
      device: p.device,
      accent: p.accent,
      shot: p.shot
    };
  }

  function positionOf(p) {
    var list = state.main.indexOf(p) !== -1 ? state.main : state.small;
    return list.indexOf(p);
  }

  function fromRow(r) {
    var o = {
      id: r.id, title: r.title, what: r.what, why: r.why, url: r.url || '',
      status: r.status, statusVariant: r.status_variant, device: r.device,
      accent: r.accent, shot: r.shot || ''
    };
    // Only carry across columns the database actually has. If a column is
    // missing, the value that shipped with the site must survive rather than
    // being overwritten with a blank.
    if (r.learned !== undefined) o.learned = r.learned || '';
    if (r.created !== undefined) o.created = r.created || '';
    if (r.url_label !== undefined) o.urlLabel = r.url_label || '';
    if (r.alt_url !== undefined) o.altUrl = r.alt_url || '';
    if (r.alt_label !== undefined) o.altLabel = r.alt_label || '';
    return o;
  }

  // ---- screenshots --------------------------------------------------------

  // Shrink a dropped picture before it goes anywhere. A phone screenshot can be
  // several megabytes, and nobody needs that to fill a small frame.
  function shrink(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error('Could not read that file.')); };
      reader.onload = function () {
        var img = new Image();
        img.onerror = function () { reject(new Error('That file is not a picture.')); };
        img.onload = function () {
          var scale = Math.min(1, 900 / img.width);
          var canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(function (blob) {
            blob ? resolve(blob) : reject(new Error('Could not shrink that picture.'));
          }, 'image/jpeg', 0.85);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function takeScreenshot(id, file) {
    if (!state.editing || !file) return;
    if (!file.type || file.type.indexOf('image/') !== 0) {
      note('That file is not a picture.');
      return;
    }
    note('Shrinking the picture...');
    shrink(file).then(function (blob) {
      if (!sb) {
        // Signed out, so show it locally and say plainly that it is not saved.
        var p = findProject(id);
        if (p) { p.shot = URL.createObjectURL(blob); render(); }
        note('Showing here only. Not signed in to the database.');
        return;
      }
      note('Uploading...');
      var path = id + '-' + Date.now() + '.jpg';
      return sb.storage.from(BUCKET)
        .upload(path, blob, { contentType: 'image/jpeg', upsert: true })
        .then(function (res) {
          if (res.error) throw res.error;
          var pub = sb.storage.from(BUCKET).getPublicUrl(path);
          var p = findProject(id);
          if (!p) return;
          p.shot = pub.data.publicUrl;
          render();
          return saveProject(p);
        });
    }).catch(function (err) {
      console.error('[hub] screenshot failed', err);
      note('Could not save that picture: ' + (err.message || 'unknown problem'));
    });
  }

  // ---- Supabase -----------------------------------------------------------

  function startSupabase() {
    if (!CFG.supabaseUrl || !CFG.supabaseAnonKey) {
      console.warn('[hub] No Supabase settings in config.js. Running on the built in list.');
      return;
    }
    if (!window.supabase || !window.supabase.createClient) {
      console.warn('[hub] The Supabase library did not load. Running on the built in list.');
      return;
    }
    sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);

    sb.auth.getSession().then(function (res) {
      setUser(res.data && res.data.session ? res.data.session.user : null);
    });
    sb.auth.onAuthStateChange(function (event, session) {
      // Arriving on a one-time reset link. Supabase has already turned the
      // token in the address bar into a short lived session; all that is left
      // is choosing the password.
      if (event === 'PASSWORD_RECOVERY') showSetPass(true);
      setUser(session ? session.user : null);
    });

    // The event above can fire before this code runs, so check the address
    // bar too rather than relying on the timing. Supabase puts the token in
    // the hash on one flow and the query string on another, so look at both.
    if (/type=recovery/.test(window.location.hash + window.location.search)) {
      showSetPass(true);
    }

    loadProjects();
  }

  function loadProjects() {
    if (!sb) return;
    sb.from(TABLE).select('*').order('position', { ascending: true }).then(function (res) {
      if (res.error) {
        console.warn('[hub] Could not read the saved list, keeping the built in one.', res.error);
        return;
      }
      var rows = res.data || [];
      if (!rows.length) return;   // nothing saved yet, keep the built in list
      state.main = mergeSection('main', rows);
      state.small = mergeSection('small', rows);
      render();
    });
  }

  // Combine the built in list with whatever the database holds.
  //
  // The database never replaces the built in list wholesale. Saving one
  // project writes one row, and letting one row stand for the whole site
  // would wipe every other project off the page. So: start from what shipped
  // with the site, let a matching database row override it, then append any
  // project the database knows about that the shipped list does not.
  function mergeSection(section, rows) {
    var byId = {};
    rows.forEach(function (r) { byId[r.id] = r; });

    var seeded = clone(SEED[section] || []);
    var known = {};
    var out = seeded.map(function (p) {
      known[p.id] = true;
      var row = byId[p.id];
      return row ? Object.assign({}, p, fromRow(row)) : p;
    });

    rows
      .filter(function (r) { return r.section === section && !known[r.id]; })
      .forEach(function (r) { out.push(fromRow(r)); });

    return byNewest(out);
  }

  // Newest first, worked out from the dates rather than the order things
  // happen to sit in. The built in list and the database each carry their own
  // idea of order, and merging them let the two disagree: a project whose date
  // moved kept its old slot. Sorting on the date itself cannot drift, because
  // the date is the rule. Anything without one keeps its place at the end.
  function byNewest(list) {
    return list
      .map(function (p, i) { return { p: p, i: i }; })
      .sort(function (a, b) {
        var da = a.p.created || '', db = b.p.created || '';
        if (!da && !db) return a.i - b.i;
        if (!da) return 1;
        if (!db) return -1;
        if (da === db) return a.i - b.i;
        return da < db ? 1 : -1;
      })
      .map(function (x) { return x.p; });
  }

  // Once editing starts, write the whole list so the database holds every
  // project rather than only the ones that happen to have been touched.
  function seedDatabase() {
    if (!sb) return;
    var rows = state.main.map(toRow).concat(state.small.map(toRow));
    sb.from(TABLE).upsert(rows, { onConflict: 'id' }).then(function (res) {
      if (res.error) console.warn('[hub] Could not save the starting list.', res.error);
    });
  }

  function isOwner(user) {
    if (!user || !user.email || !CFG.ownerEmail) return false;
    return user.email.toLowerCase() === CFG.ownerEmail.toLowerCase();
  }


  function setUser(user) {
    state.user = user;
    // Being signed in is not the same as being allowed. The database enforces
    // this too, so a changed line in config.js gains nobody anything.
    if (!isOwner(user)) state.editing = false;
    render();
  }

  // ---- setting a password -------------------------------------------------

  function showSetPass(show) {
    var box = $('setpass');
    if (!box) return;
    box.hidden = !show;
    $('setpass-msg').hidden = true;
    if (show) {
      $('signin').hidden = true;
      var first = $('pass1');
      if (first && first.focus) first.focus();
    }
  }

  function setPassMsg(text) {
    var el = $('setpass-msg');
    el.textContent = text;
    el.hidden = false;
  }

  function savePassword() {
    var a = csValue($('pass1'));
    var b = csValue($('pass2'));
    if (a.length < 8) { setPassMsg('Use at least 8 characters.'); return; }
    if (a !== b) { setPassMsg('The two passwords do not match.'); return; }
    if (!sb) { setPassMsg('The database is not reachable right now.'); return; }

    setPassMsg('Saving...');
    sb.auth.updateUser({ password: a }).then(function (res) {
      if (res.error) { setPassMsg(plainError(res.error.message)); return; }
      // Take the one time token out of the address bar so it is not left
      // sitting in history or copied into a message by accident.
      try {
        window.history.replaceState(null, '', window.location.pathname);
      } catch (err) {}
      showSetPass(false);
      if (isOwner(res.data.user)) {
        state.editing = true;
        render();
        seedDatabase();
        note('Password saved');
      }
    });
  }

  // ---- sign in box --------------------------------------------------------

  function csValue(el) {
    // Cornerstone inputs keep their text on the element itself.
    if (!el) return '';
    if (typeof el.value === 'string') return el.value;
    var inner = el.querySelector && el.querySelector('input, textarea');
    return inner ? inner.value : '';
  }

  function showSignin(show) {
    $('signin').hidden = !show;
    $('owner-dot').hidden = show;
    $('owner-dot').setAttribute('aria-expanded', show ? 'true' : 'false');
    $('signin-msg').hidden = true;
    if (show) {
      var email = $('signin-email');
      if (email && email.focus) email.focus();
    } else {
      $('owner-dot').focus();
    }
  }

  function signinError(text) {
    var el = $('signin-msg');
    el.textContent = text;
    el.hidden = false;
  }

  // Supabase error text is written for developers. Say it plainly instead.
  function plainError(msg) {
    var m = (msg || '').toLowerCase();
    if (m.indexOf('email logins are disabled') !== -1) {
      return 'Email sign in is switched off in Supabase. Turn on the Email provider under Authentication, Sign In / Providers.';
    }
    if (m.indexOf('invalid login credentials') !== -1) {
      return 'That email and password do not match an account.';
    }
    if (m.indexOf('email not confirmed') !== -1) {
      return 'That account still needs its email confirmed.';
    }
    if (m.indexOf('failed to fetch') !== -1 || m.indexOf('network') !== -1) {
      return 'Could not reach the database. Check the internet connection.';
    }
    return 'That did not work: ' + msg;
  }

  function doSignin() {
    var email = csValue($('signin-email')).trim();
    var pass = csValue($('signin-pass'));
    if (!email || !pass) { signinError('Type your email and password.'); return; }
    if (!sb) { signinError('The database is not reachable right now.'); return; }

    signinError('Signing in...');
    sb.auth.signInWithPassword({ email: email, password: pass }).then(function (res) {
      if (res.error) { signinError(plainError(res.error.message)); return; }
      if (!isOwner(res.data.user)) {
        signinError('That account cannot edit this site.');
        sb.auth.signOut();
        return;
      }
      state.editing = true;
      showSignin(false);
      render();
      seedDatabase();
      note('Signed in');
    });
  }

  function stopEditing() {
    state.editing = false;
    render();
    if (sb) sb.auth.signOut();
  }

  // ---- wiring -------------------------------------------------------------

  function onEditInput(e) {
    var el = e.target.closest ? e.target.closest('[data-edit]') : null;
    if (!el) return;
    setField(el.getAttribute('data-id'), el.getAttribute('data-edit'), csValue(el));
  }

  function wire() {
    var search = $('search');
    search.addEventListener('input', function () {
      state.query = csValue(search);
      render();
    });

    $('owner-dot').addEventListener('click', function () {
      // Already signed in from a previous visit, so skip asking again.
      if (isOwner(state.user)) {
        state.editing = true;
        render();
        seedDatabase();
        note('Signed in');
        return;
      }
      showSignin(true);
    });
    $('signin-cancel').addEventListener('click', function () { showSignin(false); });
    $('signin-go').addEventListener('click', doSignin);
    $('signin').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doSignin();
      if (e.key === 'Escape') showSignin(false);
    });
    $('done-editing').addEventListener('click', stopEditing);

    $('change-pass').addEventListener('click', function () { showSetPass(true); });
    $('pass-save').addEventListener('click', savePassword);
    $('setpass').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') savePassword();
    });

    // One listener on the page handles every card, including cards drawn later.
    document.addEventListener('input', onEditInput);

    document.addEventListener('change', function (e) {
      var el = e.target.closest ? e.target.closest('[data-file]') : null;
      if (!el) return;
      takeScreenshot(el.getAttribute('data-file'), el.files && el.files[0]);
      el.value = '';
    });

    document.addEventListener('dragover', function (e) {
      var drop = e.target.closest ? e.target.closest('.drop.editable') : null;
      if (!drop) return;
      e.preventDefault();
      drop.classList.add('dragover');
    });
    document.addEventListener('dragleave', function (e) {
      var drop = e.target.closest ? e.target.closest('.drop.editable') : null;
      if (drop) drop.classList.remove('dragover');
    });
    document.addEventListener('drop', function (e) {
      var drop = e.target.closest ? e.target.closest('.drop.editable') : null;
      if (!drop) return;
      e.preventDefault();
      drop.classList.remove('dragover');
      takeScreenshot(drop.getAttribute('data-drop'), e.dataTransfer && e.dataTransfer.files[0]);
    });
  }

  render();
  wire();
  startSupabase();
})();
