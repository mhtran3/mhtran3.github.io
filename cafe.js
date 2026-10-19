// Things to touch in the café: the trombone lamp's pull cord, the table lamp, the drinks.
// Every interaction is a real button, so it works with a keyboard and a screen reader too.
// The slow details (coffee cooling, the matcha glass sweating) only appear if you linger.
(() => {
  const body = document.body;
  if (!window.cafeLight) return;
  const status = document.querySelector('#cafe-status');
  const say = text => { if (status) { status.textContent = ''; requestAnimationFrame(() => { status.textContent = text; }); } };
  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ——— The sun on the table ———
  // The light layers are plain markup (see index.html); the paper's copy is pinned to the screen
  // and clipped to the sheet, so it needs no script while you scroll. This only starts every copy
  // of a patch, and the branch that shapes it, on the same clock, so the sun on the paper and on
  // the wood moves as one.
  requestAnimationFrame(() => {
    document.querySelectorAll('.fleck, .bough').forEach(el => el.getAnimations().forEach(a => { a.startTime = 0; }));
  });

  // ——— Lamps ———
  const cord = document.querySelector('.lamp-cord');
  const pull = document.querySelector('.cord-pull');
  const tableLamp = document.querySelector('.counter .table-lamp');
  function syncLamps() {
    pull?.setAttribute('aria-pressed', String(cafeLight.isOn('wall')));
    tableLamp?.setAttribute('aria-pressed', String(cafeLight.isOn('table')));
  }
  document.addEventListener('cafe:light', syncLamps);
  syncLamps();

  function swing() {
    if (still()) return;
    cord.classList.remove('swing', 'nudge'); void cord.offsetWidth; cord.classList.add('swing');
  }
  function switchWallLamp() {
    const on = cafeLight.toggle('wall');
    say(on ? 'Wall lamp on.' : 'Wall lamp off.');
  }

  if (cord && pull) {
    // Dragging: the cord stretches with the pointer, up to a point. Let go past the click
    // point and the lamp switches; either way the weight springs back and the cord swings.
    let startY = null, distance = 0, dragged = false;
    const setPull = px => cord.style.setProperty('--pull', `${px}px`);
    pull.addEventListener('pointerdown', e => {
      startY = e.clientY; distance = 0; dragged = false;
      pull.setPointerCapture(e.pointerId);
      cord.classList.add('dragging');
    });
    pull.addEventListener('pointermove', e => {
      if (startY === null) return;
      distance = Math.max(0, Math.min(34, (e.clientY - startY) * .8));
      if (distance > 3) dragged = true;
      setPull(distance);
    });
    const release = () => {
      if (startY === null) return;
      cord.classList.remove('dragging');
      if (dragged && distance > 14) switchWallLamp();
      startY = null; setPull(0);
      if (dragged) swing();
    };
    pull.addEventListener('pointerup', release);
    pull.addEventListener('pointercancel', () => { dragged = false; release(); });
    // A plain click or a key press gives the cord one short tug.
    pull.addEventListener('click', () => {
      if (dragged) { dragged = false; return; }
      setPull(18); setTimeout(() => setPull(0), 140);
      switchWallLamp(); swing();
    });
    // Brushing past the cord only stirs it, and not every time you pass.
    let lastNudge = 0;
    pull.addEventListener('pointerenter', () => {
      if (startY !== null || still() || cord.classList.contains('swing') || Date.now() - lastNudge < 6000) return;
      lastNudge = Date.now();
      cord.classList.remove('nudge'); void cord.offsetWidth; cord.classList.add('nudge');
    });
  }

  tableLamp?.addEventListener('click', () => {
    const on = cafeLight.toggle('table');
    say(on ? 'Table lamp on.' : 'Table lamp off.');
  });

  // ——— The serving door: push it and it swings through, then settles. ———
  const door = document.querySelector('.counter-door');
  door?.addEventListener('click', () => {
    if (still()) return;
    door.classList.remove('swinging'); void door.offsetWidth; door.classList.add('swinging');
  });
  door?.addEventListener('animationend', () => door.classList.remove('swinging'));

  // ——— Drinks ———
  const drinks = document.querySelector('.counter-drinks .drinks');
  if (drinks) {
    const q = s => drinks.querySelector(s);
    const matcha = q('.matcha'), level = q('.matcha-level'), ice = q('.ice'), sweat = q('.condensation');
    const coffee = q('.coffee'), foam = q('.foam'), dome = q('.foam-dome'), dust = q('.foam-top');
    const che = q('.che'), cheLevel = q('.che-level');
    const cubes = [...drinks.querySelectorAll('.che .jelly rect, .che .rubies rect')].reverse();
    const sips = { matcha: 0, coffee: 0, che: 0 };
    const full = { matcha: 5, coffee: 3, che: 4 };

    function bob(el) {
      if (still()) return;
      el.classList.remove('sipping'); void el.getBoundingClientRect(); el.classList.add('sipping');
    }
    function drawMatcha() {
      // The top of the drink drops toward the bottom of the glass with each sip.
      const t = sips.matcha / full.matcha;
      level.style.transform = `translateY(${(t * 122).toFixed(1)}px)`;
      ice.style.opacity = t >= 1 ? 1 : 0;
    }
    function drawCoffee() {
      // The whipped egg goes first, then the dark coffee under it, then an empty cup.
      const t = sips.coffee / full.coffee;
      dome.style.opacity = dust.style.opacity = t > 0 ? 0 : 1;
      foam.style.fill = t >= 1 ? '#e7e0d1' : t > .5 ? '#6e4429' : t > 0 ? '#c9984f' : '';
      foam.style.transform = `translateY(${t * 2}px) scale(${1 - t * .14})`;
      coffee.classList.toggle('empty', t >= 1);
    }
    function drawChe() {
      // Each spoonful lowers the coconut milk and takes a few pieces of jelly with it.
      const t = sips.che / full.che;
      cheLevel.style.transform = `translateY(${(t * 86).toFixed(1)}px)`;
      cubes.forEach((cube, i) => { cube.style.opacity = i < Math.round(cubes.length * t) ? 0 : 1; });
    }
    let cooling, sweating;
    function warmUp() {
      coffee.classList.remove('cooled');
      clearTimeout(cooling);
      cooling = setTimeout(() => coffee.classList.add('cooled'), 4 * 60e3);
    }
    function chill() {
      sweat.style.opacity = 0;
      clearTimeout(sweating);
      sweating = setTimeout(() => { sweat.style.opacity = .8; }, 3 * 60e3);
    }
    function take(name, el, draw, refresh, lines) {
      if (sips[name] >= full[name]) { sips[name] = 0; draw(); refresh?.(); say(lines.refill); return; }
      sips[name]++; draw(); bob(el);
      const left = full[name] - sips[name];
      say(left === 0 ? lines.last : left <= 1 ? lines.low : lines.sip);
    }
    document.querySelector('.sip-matcha')?.addEventListener('click', () => take('matcha', matcha, drawMatcha, chill,
      { sip: 'A sip of iced matcha latte.', low: 'A sip of matcha. Not much left.', last: 'The last sip of matcha. Just ice left.', refill: 'A fresh iced matcha latte.' }));
    document.querySelector('.sip-coffee')?.addEventListener('click', () => {
      take('coffee', coffee, drawCoffee, warmUp, {
        sip: coffee.classList.contains('cooled') ? 'A sip of egg coffee. It has gone a little cold.' : 'A sip of egg coffee.',
        low: 'A sip of egg coffee, mostly coffee now.', last: 'The last of the egg coffee.', refill: 'A fresh egg coffee, warm again.' });
    });
    document.querySelector('.sip-che')?.addEventListener('click', () => take('che', che, drawChe, null,
      { sip: 'A spoonful of chè: pandan jelly and coconut milk.', low: 'A spoonful of chè. Nearly gone.', last: 'The last spoonful of chè.', refill: 'Another glass of chè.' }));
    drawMatcha(); drawCoffee(); drawChe(); warmUp(); chill();
  }

  // ——— Espresso: pull a shot. The lever comes down, the needle climbs, the cup fills. ———
  const machine = document.querySelector('.counter-espresso .espresso');
  const pullShot = document.querySelector('.pull-shot');
  if (machine && pullShot) {
    let busy = false;
    pullShot.addEventListener('click', () => {
      if (busy) return;
      busy = true;
      // A fresh cup each time: empty it instantly, then pull.
      machine.classList.add('reset'); machine.classList.remove('pulled'); void machine.getBoundingClientRect();
      machine.classList.remove('reset');
      requestAnimationFrame(() => {
        machine.classList.add('pulling');
        say('Pulling a shot of espresso.');
        setTimeout(() => {
          machine.classList.remove('pulling'); machine.classList.add('pulled');
          say('A shot of espresso, with crema.');
          busy = false;
        }, still() ? 200 : 2800);
      });
    });
  }

  // ——— The dog (waiting for Michael's drawings) ———
  // Expected: <img data-pose="awake">, optional data-pose="blink" and data-pose="nap".
  // He blinks now and then; after a few quiet minutes he naps until someone interacts.
  const dog = document.querySelector('.counter-dog');
  if (dog && dog.querySelector('img[data-pose="awake"]')) {
    const poses = name => dog.dataset.pose = name;
    let napTimer;
    const wake = () => { if (dog.dataset.pose === 'nap') poses('awake'); clearTimeout(napTimer); napTimer = setTimeout(() => poses('nap'), 5 * 60e3); };
    poses('awake'); wake();
    if (dog.querySelector('img[data-pose="blink"]')) {
      (function blink() {
        setTimeout(() => {
          if (dog.dataset.pose === 'awake' && !still()) { poses('blink'); setTimeout(() => dog.dataset.pose === 'blink' && poses('awake'), 160); }
          blink();
        }, 3500 + Math.random() * 6000);
      })();
    }
    ['pointerdown', 'keydown', 'scroll'].forEach(type => addEventListener(type, wake, { passive: true }));
  }

  body.classList.add('cafe-ready');
})();
