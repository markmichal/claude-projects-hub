/* Fish.

   Hand-drawn stick fish swimming behind the Main projects cards. Mark asked
   for these knowing they cut against the rest of the site's look; they are
   here to see how it feels, and they are deliberately easy to remove. To take
   them out: delete this file and its <script> line in index.html, and the
   Fish block in styles.css. Nothing else references it.

   The look is The Chosen's fish: a few confident lines, no fill, mostly muted
   neutrals with roughly every tenth one in aqua. They sit behind the cards,
   so most of the time only a tail or a nose shows in the gaps.

   Two things that matter and are easy to get wrong:

   They belong to the BAND, not to the window. Every fish holds a y measured
   down the whole band, and the draw step shifts by how far the band has
   scrolled. So a fish stays beside the card it is next to, and rides up with
   it, rather than sitting still like wallpaper while the page moves past.

   The canvas is still only one window tall, because the band is some 4,800px
   and a canvas that size is about 100MB of pixels to clear every frame. Fish
   outside the window are skipped before any drawing happens.
*/
(function () {
  'use strict';

  var BAND = 'band-main';
  var TAU = Math.PI * 2;
  // Fish per pixel of band height, rather than a flat count. The band is
  // about 4,900px on a laptop and 12,900px on a phone, where the cards stack,
  // so a fixed number would look like a shoal on one and a few strays on the
  // other. This keeps roughly the same number on screen either way.
  var DENSITY = 480 / 4900;
  var MIN_FISH = 60;
  var MAX_FISH = 1500;

  // Muted on purpose. These sit on a pale yellow band, and anything with real
  // saturation in it read as clip art rather than as a pencil sketch.
  var NEUTRALS = [
    'rgba(120, 114, 104, 0.52)',
    'rgba(138, 130, 118, 0.48)',
    'rgba(103, 99, 92, 0.50)',
    'rgba(150, 142, 130, 0.44)'
  ];
  var AQUA = 'rgba(0, 139, 158, 0.55)';
  var EVERY_NTH_IS_AQUA = 3;

  var LINE = 3.8;          // twice the old weight

  function lessMotion() {
    return !!(window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  if (lessMotion()) return;

  var band = document.getElementById(BAND);
  if (!band) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'fish-tank';
  canvas.setAttribute('aria-hidden', 'true');
  band.insertBefore(canvas, band.firstChild);

  var ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }

  var fish = [];
  var w = 0, h = 0, bandH = 1, dpr = 1;
  var running = false, visible = false, raf = null;
  var startedAt = 0, elapsed = 0;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function makeFish(i) {
    var aqua = (i % EVERY_NTH_IS_AQUA) === (EVERY_NTH_IS_AQUA - 1);
    return {
      x: rand(-120, w + 120),
      bandY: rand(0, bandH),          // position down the WHOLE band
      size: rand(0.6, 1.5),
      dir: Math.random() < 0.5 ? 1 : -1,
      speed: rand(18, 48),            // px a second

      // Tail beat, in beats per second. The first version drove this off the
      // raw clock with a large multiplier and ended up flapping 15 to 35
      // times a second, which at 60fps is not a tail, it is a flicker.
      tailHz: rand(0.45, 0.85),
      tailPhase: rand(0, TAU),

      // Two slow vertical waves of different lengths, so the path wanders
      // instead of running dead straight or tracing an obvious sine.
      waveA: rand(10, 34), waveAHz: rand(0.025, 0.07), waveAPhase: rand(0, TAU),
      waveB: rand(4, 14),  waveBHz: rand(0.09, 0.17),  waveBPhase: rand(0, TAU),

      color: aqua ? AQUA : NEUTRALS[i % NEUTRALS.length]
    };
  }

  function wanted() {
    return Math.max(MIN_FISH, Math.min(MAX_FISH, Math.round(bandH * DENSITY)));
  }

  function stock() {
    var target = wanted();
    while (fish.length < target) fish.push(makeFish(fish.length));
    if (fish.length > target) fish.length = target;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.round(band.clientWidth));
    h = Math.max(1, Math.round(window.innerHeight));
    var newBandH = Math.max(1, Math.round(band.getBoundingClientRect().height));

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!fish.length) {
      bandH = newBandH;
      stock();
      return;
    }

    // The band changes height whenever the search box filters the list, and
    // again if the window is resized. Keep everyone proportionally where they
    // were rather than bunching them at the top, then top up or trim.
    if (newBandH !== bandH) {
      var ratio = newBandH / bandH;
      for (var i = 0; i < fish.length; i++) fish[i].bandY *= ratio;
      bandH = newBandH;
      stock();
    }
  }

  // Where a fish is right now: along the band, and how steeply it is heading.
  function placement(f) {
    var a = TAU * f.waveAHz * elapsed + f.waveAPhase;
    var b = TAU * f.waveBHz * elapsed + f.waveBPhase;
    var y = f.bandY + Math.sin(a) * f.waveA + Math.sin(b) * f.waveB;
    // Vertical speed, so the fish can point where it is actually going.
    var dy = Math.cos(a) * f.waveA * TAU * f.waveAHz +
             Math.cos(b) * f.waveB * TAU * f.waveBHz;
    return { y: y, angle: Math.atan2(dy, f.speed * 3) };
  }

  function draw(f, screenY, angle) {
    var beat = TAU * f.tailHz * elapsed + f.tailPhase;
    var flex = Math.sin(beat);
    var tail = Math.sin(beat - 0.9);

    ctx.save();
    ctx.translate(f.x, screenY);
    ctx.rotate(f.dir > 0 ? angle : -angle);
    ctx.scale(f.dir * f.size, f.size);
    ctx.strokeStyle = f.color;
    ctx.lineWidth = LINE / f.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    var ty = flex * 3.4;          // where the body meets the tail

    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.quadraticCurveTo(2, -6.9 + flex * 1.4, -11, ty);
    ctx.quadraticCurveTo(2, 6.9 + flex * 1.4, 15, 0);
    ctx.stroke();

    var sweep = tail * 5.2;
    ctx.beginPath();
    ctx.moveTo(-11, ty);
    ctx.lineTo(-20.5, ty - 6.4 + sweep);
    ctx.quadraticCurveTo(-16.5, ty + sweep * 0.3, -20.5, ty + 6.4 + sweep);
    ctx.lineTo(-11, ty);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(10, -1.9, 1.1 / f.size + 0.4, 0, TAU);
    ctx.fillStyle = f.color;
    ctx.fill();

    ctx.restore();
  }

  var last = 0;

  function frame(now) {
    raf = null;
    if (!running) return;

    if (!startedAt) startedAt = now;
    elapsed = (now - startedAt) / 1000;
    var dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
    last = now;

    ctx.clearRect(0, 0, w, h);

    // How far the band has scrolled behind the sticky canvas. This is what
    // ties a fish to the cards beside it instead of to the window.
    var offset = band.getBoundingClientRect().top - canvas.getBoundingClientRect().top;

    for (var i = 0; i < fish.length; i++) {
      var f = fish[i];

      f.x += f.dir * f.speed * dt;
      var margin = 60 * f.size;
      if (f.dir > 0 && f.x > w + margin) { f.x = -margin; f.bandY = rand(0, bandH); }
      if (f.dir < 0 && f.x < -margin) { f.x = w + margin; f.bandY = rand(0, bandH); }

      var p = placement(f);
      var screenY = p.y + offset;
      if (screenY < -70 || screenY > h + 70) continue;   // off window, skip it

      draw(f, screenY, p.angle);
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
    // Only swim when the band is on screen and the tab is in front. No reason
    // to burn a phone battery drawing fish nobody is looking at.
    if (visible && !document.hidden && !band.hidden) start();
    else stop();
  }

  resize();

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      update();
    }, { rootMargin: '150px' }).observe(band);
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
