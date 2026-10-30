/* Fish.

   Hand-drawn stick fish swimming behind the Main projects cards. Mark asked
   for these knowing they cut against the rest of the site's look; they are
   here to see how it feels, and they are deliberately easy to remove. To take
   them out: delete this file and its <script> line in index.html. Nothing
   else references it.

   The look is The Chosen's fish: a few confident lines, no fill, mostly muted
   neutrals with roughly every tenth one in aqua. They sit behind the cards,
   so most of the time only a tail or a nose shows in the gaps.
*/
(function () {
  'use strict';

  var BAND = 'band-main';

  // Muted on purpose. These sit on a pale yellow band, and anything with real
  // saturation in it read as clip art rather than as a pencil sketch.
  var NEUTRALS = [
    'rgba(120, 114, 104, 0.52)',
    'rgba(138, 130, 118, 0.48)',
    'rgba(103, 99, 92, 0.50)',
    'rgba(150, 142, 130, 0.44)'
  ];
  var AQUA = 'rgba(0, 139, 158, 0.55)';
  var EVERY_NTH_IS_AQUA = 10;

  var COUNT = 16;

  function lessMotion() {
    return !!(window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  if (lessMotion()) return;

  var band = document.getElementById(BAND);
  if (!band || !band.getContext && !document.createElement('canvas').getContext) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'fish-tank';
  canvas.setAttribute('aria-hidden', 'true');
  band.insertBefore(canvas, band.firstChild);

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var fish = [];
  var w = 0, h = 0, dpr = 1;
  var running = false, visible = false, raf = null;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function makeFish(i) {
    var aqua = (i % EVERY_NTH_IS_AQUA) === (EVERY_NTH_IS_AQUA - 1);
    return {
      // Spread across the band, biased away from dead centre where the cards
      // are densest, so something actually shows in the gaps.
      x: rand(-80, w + 80),
      y: rand(0.04, 0.96) * h,
      size: rand(0.75, 1.65),
      dir: Math.random() < 0.5 ? 1 : -1,
      speed: rand(11, 26),            // pixels a second, before size
      phase: rand(0, Math.PI * 2),
      wobble: rand(0.7, 1.5),
      color: aqua ? AQUA : NEUTRALS[i % NEUTRALS.length]
    };
  }

  function resize() {
    // One window, not the whole band. The canvas sticks, so this tank travels
    // down the band with the reader.
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.round(band.clientWidth));
    h = Math.max(1, Math.round(window.innerHeight));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!fish.length) {
      for (var i = 0; i < COUNT; i++) fish.push(makeFish(i));
    } else {
      // Keep them inside the band when it changes height, which it does every
      // time the search box filters the list.
      for (var j = 0; j < fish.length; j++) {
        if (fish[j].y > h) fish[j].y = rand(0.1, 0.9) * h;
      }
    }
  }

  // One fish, drawn as a few strokes. The body flexes and the tail sweeps a
  // beat behind it, which is what reads as swimming rather than sliding.
  function draw(f, t) {
    var beat = t * 0.0042 * f.speed * f.wobble + f.phase;
    var flex = Math.sin(beat * 2);
    var tail = Math.sin(beat * 2 - 0.9);

    ctx.save();
    ctx.translate(f.x, f.y + Math.sin(beat) * 2.5 * f.size);
    ctx.scale(f.dir * f.size, f.size);
    ctx.strokeStyle = f.color;
    ctx.lineWidth = 1.9 / f.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    var ty = flex * 3.4;          // where the body meets the tail

    // Body: one closed outline, nose to tail and back, bending with the beat.
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.quadraticCurveTo(2, -6.6 + flex * 1.6, -11, ty);
    ctx.quadraticCurveTo(2, 6.6 + flex * 1.6, 15, 0);
    ctx.stroke();

    // Tail: two strokes out to the tips, with a soft curve closing them.
    var sweep = tail * 5.2;
    var topTip = ty - 6.4 + sweep;
    var botTip = ty + 6.4 + sweep;
    ctx.beginPath();
    ctx.moveTo(-11, ty);
    ctx.lineTo(-20.5, topTip);
    ctx.quadraticCurveTo(-16.5, ty + sweep * 0.3, -20.5, botTip);
    ctx.lineTo(-11, ty);
    ctx.stroke();

    // Eye.
    ctx.beginPath();
    ctx.arc(10, -1.7, 0.85 / f.size + 0.5, 0, Math.PI * 2);
    ctx.fillStyle = f.color;
    ctx.fill();

    ctx.restore();
  }

  var last = 0;

  function frame(now) {
    raf = null;
    if (!running) return;

    var dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
    last = now;

    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < fish.length; i++) {
      var f = fish[i];
      f.x += f.dir * f.speed * f.size * dt;
      // Off one side, back on the other, at a fresh depth. Over a minute this
      // reads as a loose school wandering through rather than a loop.
      var margin = 60 * f.size;
      if (f.dir > 0 && f.x > w + margin) { f.x = -margin; f.y = rand(0.05, 0.95) * h; }
      if (f.dir < 0 && f.x < -margin) { f.x = w + margin; f.y = rand(0.05, 0.95) * h; }
      draw(f, now);
    }

    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  function update() {
    // Only swim when the band is on screen and the tab is in front. There is
    // no reason to burn a phone battery drawing fish nobody is looking at.
    if (visible && !document.hidden && !band.hidden) start();
    else stop();
  }

  resize();

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      update();
    }, { rootMargin: '120px' }).observe(band);
  } else {
    visible = true;
    update();
  }

  document.addEventListener('visibilitychange', update);

  window.addEventListener('resize', resize);
  if ('ResizeObserver' in window) {
    new ResizeObserver(function () { resize(); }).observe(band);
  }
})();
