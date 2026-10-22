// Café light: follows the visitor's clock, blending between hand-picked moments of the day.
// Writes CSS custom properties; cafe.css decides what each one touches.
(() => {
  const body = document.querySelector('body.cafe-interior');
  if (!body) return;
  const root = document.documentElement;

  // Painted the way a painter handles the day: warm light against cool shade. Low sun is orange and
  // its shadows lean violet; night is a cool, moonlit room that the lamps warm in pools; dawn starts
  // lavender and turns rose before the light goes clean and pale. Noon stays nearly neutral.
  // t = table in shade / sun, p = paper in shade / sun, s = sunlight, ss = sun strength,
  // d = sun through the leaves, l = how lit the leaves are, w = plaster wall,
  // sh = the colour of shadows, lh / ls = the leaves' hue shift (degrees) and saturation.
  const H = h => Math.round(h * 60);
  const night = { t: ['#161b26', '#33405a'], p: ['#a9adb6', '#c4c9d6'], s: '#9db2e0', ss: .1, d: 0, l: .32, w: '#2b3140', sh: '#060a18', lh: 14, ls: .5 };
  const dawn = { t: ['#1e2434', '#55638a'], p: ['#b2b3bf', '#d4cfe0'], s: '#b9aee0', ss: .25, d: 0, l: .45, w: '#4d5470', sh: '#0c1030', lh: 10, ls: .62 };
  const rise = { t: ['#2d2933', '#dc9a7c'], p: ['#c2b8b4', '#ffdccb'], s: '#ffb39a', ss: .72, d: .55, l: .72, w: '#ad857c', sh: '#1c1030', lh: -4, ls: .9 };
  const morning = { t: ['#302f2e', '#d3b07c'], p: ['#cbc5b6', '#fffaec'], s: '#fff6dd', ss: .88, d: .8, l: .95, w: '#c6b293', sh: '#10121c', lh: 0, ls: 1 };
  const noon = { t: ['#3a3022', '#caa063'], p: ['#cdbf9f', '#fff5dc'], s: '#fffbea', ss: .95, d: .85, l: 1, w: '#cdb081', sh: '#0c0804', lh: 0, ls: 1 };
  const afternoon = { t: ['#3a2e24', '#d29c5a'], p: ['#ccbc9c', '#fff0cc'], s: '#ffe0a4', ss: .9, d: .85, l: .95, w: '#c9a270', sh: '#120a0a', lh: -3, ls: 1.05 };
  const golden = { t: ['#2e2530', '#e18a3e'], p: ['#c2b0a0', '#ffd9a2'], s: '#ffad55', ss: .85, d: .78, l: .85, w: '#c58650', sh: '#1e1030', lh: -9, ls: 1.15 };
  const sunset = { t: ['#291f2d', '#cf5f32'], p: ['#bba9a5', '#ffc196'], s: '#ff7e45', ss: .6, d: .4, l: .6, w: '#8f5244', sh: '#22103a', lh: -14, ls: 1.2 };
  const dusk = { t: ['#1f1e30', '#6b5684'], p: ['#b0abb8', '#d8c8dc'], s: '#c99ccc', ss: .22, d: 0, l: .42, w: '#4f4562', sh: '#140c2a', lh: 8, ls: .66 };
  const day = [
    [0, night], [H(5), night], [H(5.75), dawn], [H(6.5), rise], [H(8), morning], [H(12.5), noon],
    [H(16), afternoon], [H(17.75), golden], [H(18.75), sunset], [H(19.5), dusk], [H(20.5), night], [1440, night],
  ];

  // Colour blending happens in OKLab, where halfway between two colours looks halfway.
  const lin = c => (c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  const gam = c => (c <= .0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - .055);
  function toLab(hex) {
    const [r, g, b] = [1, 3, 5].map(i => lin(parseInt(hex.slice(i, i + 2), 16) / 255));
    const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b);
    const m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b);
    const s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
    return [.2104542553 * l + .793617785 * m - .0040720468 * s, 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, .0259040371 * l + .7827717662 * m - .808675766 * s];
  }
  function toHex([L, a, b]) {
    const l = (L + .3963377774 * a + .2158037573 * b) ** 3;
    const m = (L - .1055613458 * a - .0638541728 * b) ** 3;
    const s = (L - .0894841775 * a - 1.291485548 * b) ** 3;
    const rgb = [4.0767416621 * l - 3.3077115913 * m + .2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s, -.0041960863 * l - .7034186147 * m + 1.707614701 * s];
    return '#' + rgb.map(c => Math.round(Math.min(1, Math.max(0, gam(c))) * 255).toString(16).padStart(2, '0')).join('');
  }
  const mixHex = (a, b, t) => toHex(toLab(a).map((v, i) => v + (toLab(b)[i] - v) * t));
  const mix = (a, b, t) => a + (b - a) * t;
  const ease = t => t * t * (3 - 2 * t);
  const luminance = hex => { const [r, g, b] = [1, 3, 5].map(i => lin(parseInt(hex.slice(i, i + 2), 16) / 255)); return .2126 * r + .7152 * g + .0722 * b; };
  const contrast = (x, y) => (Math.max(x, y) + .05) / (Math.min(x, y) + .05);

  function paletteAt(minute) {
    let i = 0;
    while (day[i + 1][0] <= minute && i < day.length - 2) i++;
    const [m0, a] = day[i], [m1, b] = day[i + 1];
    const t = ease((minute - m0) / (m1 - m0 || 1));
    return {
      t: a.t.map((c, k) => mixHex(c, b.t[k], t)), p: a.p.map((c, k) => mixHex(c, b.p[k], t)),
      s: mixHex(a.s, b.s, t), w: mixHex(a.w, b.w, t), sh: mixHex(a.sh, b.sh, t),
      ss: mix(a.ss, b.ss, t), d: mix(a.d, b.d, t), l: mix(a.l, b.l, t), lh: mix(a.lh, b.lh, t), ls: mix(a.ls, b.ls, t),
    };
  }

  // The sun rises on the left at 6:00 and sets on the right at 18:45.
  function sunAt(minute) {
    const t = (minute - 360) / (1125 - 360);
    const altitude = Math.sin(Math.PI * Math.min(1, Math.max(0, t)));
    const daylight = Math.min(1, Math.max(0, (Math.sin(Math.PI * t) + .12) / .5));
    return { x: mix(12, 88, Math.min(1, Math.max(0, t))), y: mix(78, 8, altitude), altitude, daylight: t < -.1 || t > 1.1 ? 0 : daylight };
  }

  // Lamps follow the light unless a visitor has pulled a cord or clicked a lamp.
  const lamps = { wall: null, table: null };
  let override = null; // minute of day chosen on the slider, or null for the real clock
  let current = 0, timer = null;

  function apply() {
    const now = new Date();
    const minute = override ?? now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    current = minute;
    const p = paletteAt(minute), sun = sunAt(minute);
    const dark = 1 - sun.daylight;
    const autoOn = dark > .45;
    const wall = lamps.wall ?? autoOn, table = lamps.table ?? autoOn;
    const lampLight = (wall ? .6 : 0) + (table ? .4 : 0);
    const v = {
      '--sun': p.s, '--sun-at': `${sun.x.toFixed(1)}% ${sun.y.toFixed(1)}%`, '--sun-strength': p.ss.toFixed(3),
      '--dapple': p.d.toFixed(3), '--leaf-light': p.l.toFixed(3), '--leaf-hue': `${p.lh.toFixed(1)}deg`, '--leaf-sat': p.ls.toFixed(3),
      '--shadow-ink': p.sh,
      '--table-shade': p.t[0], '--table-lit': p.t[1], '--paper-shade': p.p[0], '--paper-lit': p.p[1],
      '--wall-lamp': wall ? 1 : 0, '--table-lamp': table ? 1 : 0,
      // Lamplight pools on the table; it only shows once the room is darker than the lamp.
      '--pool': (lampLight * (.12 + .88 * dark)).toFixed(3),
      // Shadows fall away from the sun; long when it is low, short at noon. After dark,
      // the wall lamp at the upper right becomes the light that casts them.
      '--shadow-x': `${mix(wall ? -6 : 0, (50 - sun.x) * .32, sun.daylight).toFixed(1)}px`,
      '--shadow-y': `${mix(wall ? 12 : 8, 6 + 14 * (1 - sun.altitude), sun.daylight).toFixed(1)}px`,
      '--shadow-alpha': mix(wall || table ? .32 : .18, .26 + .18 * sun.altitude, sun.daylight).toFixed(3),
      // Paper warms under low sun and under lamps; a few percent, never enough to hurt contrast.
      '--surface-tint': mixHex(p.s, '#ffb45e', Math.min(1, dark * lampLight * 1.4)),
      '--tint-amt': `${(3 + 8 * (1 - sun.altitude) * sun.daylight + 7 * dark * lampLight).toFixed(1)}%`,
      '--plaster': p.w, '--downlight': (.25 + .75 * dark).toFixed(3),
      // The skylight's leaf pattern slides a little across the day as the sun moves over it.
      '--sky-shift': `${((sun.x - 50) * 2.4).toFixed(1)}px`,
      '--dark': dark.toFixed(3), '--daylit': sun.daylight.toFixed(3),
    };
    // Rim light: the edge of each paper that faces the light catches a thin highlight. Low sun rakes
    // across from its side (left in the morning, right in the evening); overhead sun leaves almost none.
    // After dark the wall lamp, up on the right, takes over.
    const rake = (1 - sun.altitude) ** 1.2 * sun.daylight * p.ss;
    const lampRim = dark * (wall ? .95 : 0) + dark * (table ? .3 : 0);
    const rimSum = rake + lampRim || 1;
    const sunSide = Math.max(-1, Math.min(1, (50 - sun.x) / 34));
    v['--rim'] = Math.min(1, rake * 1.6 + lampRim).toFixed(3);
    v['--rim-x'] = ((sunSide * rake + -.75 * lampRim) / rimSum).toFixed(3);
    v['--rim-y'] = ((.45 * rake + .65 * lampRim) / rimSum).toFixed(3);
    v['--rim-color'] = mixHex(mixHex(p.s, '#fff6e6', .35), '#ffc77a', lampRim / rimSum);
    // Bloom: low sun scatters, so at sunrise and sunset the sun patches get a soft warm halo.
    v['--bloom'] = Math.min(1, (1 - sun.altitude) ** 1.4 * sun.daylight * p.ss * 1.7).toFixed(3);
    // Pick the ink that reads best on the plaster; around sunrise and sunset, nudge the plaster
    // until small text clears 6.2:1.
    const darkInk = contrast(luminance(p.w), luminance('#2b2219')) >= contrast(luminance(p.w), luminance('#fff3e2'));
    const ink = darkInk ? '#2b2219' : '#fff3e2';
    let wallLab = toLab(p.w);
    for (let i = 0; i < 40 && contrast(luminance(toHex(wallLab)), luminance(ink)) < 6.2; i++) wallLab[0] += darkInk ? .01 : -.01;
    p.w = toHex(wallLab); v['--plaster'] = p.w;
    Object.assign(v, darkInk
      ? { '--wall-ink': '#2b2219', '--wall-muted': '#3f3226', '--wall-line': '#5b473466', '--wall-halo': p.w + 'cc' }
      : { '--wall-ink': '#fff3e2', '--wall-muted': '#f0dcc1', '--wall-line': '#e8cfae55', '--wall-halo': p.w + 'cc' });
    for (const [k, val] of Object.entries(v)) body.style.setProperty(k, val);
    body.dataset.light = sun.daylight > .6 ? 'day' : sun.daylight > .15 ? 'dusk' : 'night';
    body.classList.toggle('wall-lamp-on', wall);
    body.classList.toggle('table-lamp-on', table);
    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.content = '#1c1712';
    document.dispatchEvent(new CustomEvent('cafe:light', { detail: { minute, wall, table, daylight: sun.daylight } }));
  }

  function schedule() {
    clearTimeout(timer);
    if (!document.hidden && override === null) timer = setTimeout(() => { apply(); schedule(); }, 30000);
  }

  // Public hooks for the lamps' switches (cafe.js) and the time slider below.
  window.cafeLight = {
    toggle(name) { lamps[name] = !(lamps[name] ?? body.classList.contains(`${name}-lamp-on`)); apply(); return lamps[name]; },
    isOn: name => body.classList.contains(`${name}-lamp-on`),
  };

  const control = document.querySelector('.lighting-control');
  const slider = document.querySelector('#cafe-time');
  const output = document.querySelector('#cafe-time-label');
  const nowButton = document.querySelector('#cafe-now');
  const label = m => new Date(2000, 0, 1, Math.floor(m / 60) % 24, Math.floor(m % 60)).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  function syncControl() {
    if (!slider) return;
    if (override === null) slider.value = Math.round(current);
    const text = label(current);
    slider.setAttribute('aria-valuetext', text);
    output.textContent = text;
    // "your time" and "Back to now" share one slot of fixed width, so switching between them
    // never moves anything else in the header.
    control.classList.toggle('is-live', override === null);
  }
  if (slider) {
    slider.addEventListener('input', () => { override = Number(slider.value); apply(); syncControl(); schedule(); });
    nowButton.addEventListener('click', () => { override = null; apply(); syncControl(); schedule(); slider.focus(); });
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) apply(); syncControl(); schedule(); });
  window.addEventListener('pageshow', () => { apply(); syncControl(); schedule(); });
  apply(); syncControl(); schedule();
  if (control) control.hidden = false;
  // Enable fades only after the first, instant placement has been drawn.
  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add('light-ready')));

  // Eye candy: one switch for every ambient movement (branches, light, steam). The choice is
  // remembered in this browser only; people who ask their device for less motion start still.
  const candy = document.querySelector('.eye-candy');
  if (candy) {
    let stored = null;
    try { stored = localStorage.getItem('cafe-eye-candy'); } catch (e) { /* storage unavailable */ }
    const set = on => {
      body.classList.toggle('still', !on);
      candy.setAttribute('aria-pressed', String(on));
      try { localStorage.setItem('cafe-eye-candy', on ? 'on' : 'off'); } catch (e) { /* not remembered */ }
    };
    body.classList.toggle('still', stored === 'off');
    candy.setAttribute('aria-pressed', String(stored !== 'off'));
    candy.addEventListener('click', () => set(body.classList.contains('still')));
    candy.hidden = false;
  }
})();
