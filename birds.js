/* Birds.

   Every so often a bird flies in, lands on the top edge of something on the
   page as if it were a roof, sits there, says something, and leaves. It can
   perch on a card, on the top of a laptop or phone in a screenshot, or on a
   heading.

   Depth: things lower down the page sit in front of things above them. A bird
   is appended INTO the card it lands on, and each card gets a z-index from its
   position in the list, so a bird perched low passes in front of the cards
   above it and behind the ones below. That is the whole trick; there is no
   separate depth bookkeeping.

   Self-contained, like the fish before it. To remove: delete this file, its
   <script> line in index.html, and the Birds block in styles.css.
*/
(function () {
  'use strict';

  function lessMotion() {
    return !!(window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  if (lessMotion()) return;

  // Five songbirds. Colours are picked from the real birds rather than from
  // the site palette, because the point is that they look like birds.
  var SPECIES = [
    { id: 'cardinal', body: '#b5342a', wing: '#8f271f', belly: '#cf5a4a',
      beak: '#efa72c', face: '#2b2320', eye: '#1b1412', crest: true,
      calls: ['cheer cheer', 'birdy birdy birdy', 'chip!'] },
    { id: 'jay', body: '#4a7fb5', wing: '#35618f', belly: '#eaf0f6',
      beak: '#2b2b2b', face: null, eye: '#14181c', crest: true,
      calls: ['jay! jay!', 'caw', 'thief! thief!'] },
    { id: 'robin', body: '#6e6356', wing: '#564d43', belly: '#c4603a',
      beak: '#e0bf4c', face: null, eye: '#171310', crest: false,
      calls: ['cheerily', 'cheer-up', 'tut tut tut'] },
    { id: 'goldfinch', body: '#e0bd34', wing: '#2c2a26', belly: '#efdd8c',
      beak: '#df8457', face: null, eye: '#171310', crest: false,
      calls: ['per-chik-o-ree', 'tweet tweet', 'po-ta-to-chip'] },
    { id: 'sparrow', body: '#8b7560', wing: '#6a5949', belly: '#d7ccbc',
      beak: '#4a4038', face: null, eye: '#171310', crest: false,
      calls: ['chirp chirp', 'cheep!', 'chirrup'] }
  ];

  var W = 210, H = 164;          // the drawing's own grid
  var BIRD_H = 52;               // how tall it lands on the page, in px
  var BIRD_W = Math.round(BIRD_H * W / H);

  var MIN_GAP = 5500, MAX_GAP = 12000;   // between arrivals
  var MAX_AT_ONCE = 3;

  var living = [];
  var timer = null;
  var watching = false;

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rand(a, b) { return a + Math.random() * (b - a); }

  // One bird, side on, perched, facing right. Built from songbird
  // proportions rather than from a blob: head about two fifths of the body
  // depth with a dip at the nape so it reads as a head; a short conical beak;
  // a full breast carried forward and low; the tail starting at the rump and
  // angling down about thirty degrees, roughly as long as the body; and short
  // legs, since a perched songbird stands low.
  function art(sp) {
    var crest = sp.crest
      ? '<path d="M138 40 C 142 14, 156 6, 168 12 C 158 20, 152 32, 150 46 Z" fill="' + sp.body + '"/>'
      : '';
    var face = sp.face
      ? '<path d="M170 58 C 180 62, 182 74, 176 84 C 166 82, 160 72, 162 62 Z" fill="' + sp.face + '"/>'
      : '';
    return '' +
    '<svg class="bird-art" viewBox="0 0 ' + W + ' ' + H + '" width="' + BIRD_W + '" height="' + BIRD_H + '" aria-hidden="true">' +

      // Tail: a flat fan off the rump, angled down behind.
      '<path class="bird-tail" d="M80 104 C 60 110, 38 120, 14 133 L 23 150 C 47 139, 68 128, 84 117 Z" fill="' + sp.wing + '"/>' +

      // Legs. Short, thin, with a forward and a back toe on each.
      '<g stroke="' + sp.beak + '" stroke-width="4" stroke-linecap="round" fill="none">' +
        '<path d="M116 126 L 114 152"/>' +
        '<path d="M138 124 L 139 152"/>' +
      '</g>' +
      '<g stroke="' + sp.beak + '" stroke-width="3.2" stroke-linecap="round" fill="none">' +
        '<path d="M114 152 L 126 158"/><path d="M114 152 L 103 157"/>' +
        '<path d="M139 152 L 151 158"/><path d="M139 152 L 128 157"/>' +
      '</g>' +

      // Body, nape dip, crown and forehead in one outline.
      '<path d="M76 120 C 60 110, 58 88, 72 74 ' +
              'C 88 54, 108 44, 128 42 ' +
              'C 138 34, 154 32, 164 43 ' +
              'C 173 52, 178 62, 177 72 ' +
              'C 176 90, 169 106, 157 116 ' +
              'C 143 127, 123 132, 105 132 ' +
              'C 91 132, 82 127, 76 120 Z" fill="' + sp.body + '"/>' +

      // Breast and belly, carried forward and low.
      '<path d="M177 74 C 176 92, 168 108, 156 117 ' +
              'C 142 127, 122 132, 105 132 ' +
              'C 96 132, 89 130, 84 127 ' +
              'C 104 120, 132 110, 152 96 ' +
              'C 165 87, 173 80, 177 74 Z" fill="' + sp.belly + '" opacity="0.95"/>' +

      face +
      crest +

      // Folded wing, pointing back toward the tail.
      '<path class="bird-wing" d="M94 72 C 116 60, 142 64, 153 80 ' +
              'C 149 100, 126 114, 98 111 ' +
              'C 83 101, 82 81, 94 72 Z" fill="' + sp.wing + '"/>' +
      // Primaries, a darker tip laid over the wing.
      '<path d="M101 108 C 92 112, 84 116, 76 120 L 82 126 C 92 121, 100 116, 106 112 Z" fill="' + sp.wing + '"/>' +

      // Short conical beak, open slightly at the line.
      '<path d="M175 62 L 205 73 L 174 82 Z" fill="' + sp.beak + '"/>' +
      '<path d="M175 72 L 204 73" stroke="' + sp.eye + '" stroke-width="1.6" opacity="0.45"/>' +

      '<circle cx="161" cy="62" r="4.6" fill="' + sp.eye + '"/>' +
      '<circle cx="162.6" cy="60.4" r="1.4" fill="#ffffff" opacity="0.9"/>' +
    '</svg>';
  }

  // Everything a bird could stand on that is on screen right now. Each entry
  // is the element whose TOP edge is the roof, plus the positioned card it
  // lives in, which is what the bird gets appended to.
  function perches() {
    var out = [];
    var holders = document.querySelectorAll('.card-wrap, .tool');

    for (var i = 0; i < holders.length; i++) {
      var holder = holders[i];
      if (holder.offsetParent === null) continue;

      // Lower down the page means nearer the front.
      holder.style.zIndex = String(5 + i);

      var hr = holder.getBoundingClientRect();
      if (hr.bottom < 80 || hr.top > window.innerHeight - 60) continue;

      // The card itself, plus a few things inside it worth standing on.
      var roofs = [holder];
      var inside = holder.querySelectorAll('.card-media, .card-title, .row-title, .tool-name, .laptop-lid, .phone');
      for (var j = 0; j < inside.length; j++) roofs.push(inside[j]);

      for (var k = 0; k < roofs.length; k++) {
        var r = roofs[k].getBoundingClientRect();
        if (r.width < 70) continue;
        if (r.top < 70 || r.top > window.innerHeight - 70) continue;   // room to land
        out.push({ holder: holder, holderRect: hr, roof: r });
      }
    }
    return out;
  }

  function remove(bird) {
    var at = living.indexOf(bird);
    if (at !== -1) living.splice(at, 1);
    if (bird.el && bird.el.parentNode) bird.el.parentNode.removeChild(bird.el);
    if (bird.timers) bird.timers.forEach(clearTimeout);
  }

  function land() {
    var spots = perches();
    if (!spots.length) return;
    var spot = pick(spots);
    var sp = pick(SPECIES);

    // Where on that roof, and which way the bird faces.
    var fromLeft = Math.random() < 0.5;
    var alongRoof = rand(0.15, 0.85);
    var x = (spot.roof.left - spot.holderRect.left) + spot.roof.width * alongRoof - BIRD_W / 2;
    var y = (spot.roof.top - spot.holderRect.top) - BIRD_H + 2;   // feet on the edge

    var el = document.createElement('div');
    el.className = 'bird is-flying';
    el.style.left = Math.round(x) + 'px';
    el.style.top = Math.round(y) + 'px';
    el.style.width = BIRD_W + 'px';
    el.style.height = BIRD_H + 'px';

    // Comes in from off the side of the window, a little above the perch.
    var dx = fromLeft ? -(spot.holderRect.left + x + BIRD_W + 120)
                      : (window.innerWidth - spot.holderRect.left - x + 120);
    el.style.setProperty('--fx', Math.round(dx) + 'px');
    el.style.setProperty('--fy', Math.round(rand(-150, -70)) + 'px');
    el.style.setProperty('--fr', (fromLeft ? -1 : 1) * rand(6, 14) + 'deg');

    el.innerHTML =
      '<div class="bird-body"' + (fromLeft ? '' : ' data-facing="left"') + '>' + art(sp) + '</div>' +
      '<div class="bird-call" hidden>' + pick(sp.calls) + '</div>';

    spot.holder.appendChild(el);

    var bird = { el: el, timers: [] };
    living.push(bird);

    var flight = 1500;
    bird.timers.push(setTimeout(function () {
      el.classList.remove('is-flying');
      el.classList.add('is-perched');
    }, flight));

    // A beat after landing, it says something.
    bird.timers.push(setTimeout(function () {
      var call = el.querySelector('.bird-call');
      if (call) { call.hidden = false; call.classList.add('show'); }
    }, flight + rand(700, 1600)));

    bird.timers.push(setTimeout(function () {
      var call = el.querySelector('.bird-call');
      if (call) call.classList.remove('show');
    }, flight + 3400));

    // Then off it goes.
    var stay = rand(5000, 11000);
    bird.timers.push(setTimeout(function () {
      el.classList.remove('is-perched');
      el.classList.add('is-leaving', 'is-flying');
    }, flight + stay));
    bird.timers.push(setTimeout(function () { remove(bird); }, flight + stay + 1500));
  }

  function tick() {
    timer = null;
    if (!document.hidden && watching && living.length < MAX_AT_ONCE) land();
    schedule();
  }

  function schedule() {
    if (timer) return;
    timer = setTimeout(tick, rand(MIN_GAP, MAX_GAP));
  }

  function stop() {
    if (timer) { clearTimeout(timer); timer = null; }
    while (living.length) remove(living[0]);
  }

  // Only while there is something on screen to land on.
  var main = document.querySelector('main');
  if ('IntersectionObserver' in window && main) {
    new IntersectionObserver(function (entries) {
      watching = entries[0].isIntersecting;
      if (watching) schedule(); else stop();
    }).observe(main);
  } else {
    watching = true;
    schedule();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else schedule();
  });

  // The search box redraws the cards, which throws away any bird standing on
  // one. Clear out the leftovers so their timers do not fire into nothing.
  document.addEventListener('input', function () {
    for (var i = living.length - 1; i >= 0; i--) {
      if (!living[i].el.isConnected) remove(living[i]);
    }
  });

  // First arrival comes quickly, so it is clear the page does this at all.
  timer = setTimeout(tick, 2600);
})();
