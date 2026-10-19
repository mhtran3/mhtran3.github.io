// Café light: the room follows the visitor's local clock, minute by minute.
// A day is a handful of hand-picked moments (dawn, noon, golden hour...). Between two
// moments, every colour and strength is blended, so the light drifts instead of switching.
// The script writes CSS custom properties; cafe.css decides what each one touches.
(() => {
  const body = document.querySelector('body.cafe-interior');
  if (!body) return;
  const root = document.documentElement;

  // [minute of day, palette]. t = table wood in shade / in sun, p = paper in shade / in sun,
  // s = sunlight colour, ss = sun strength, d = how much sun gets through the leaves,
  // l = how lit the leaves are, w = plaster wall colour.
  // Shade under leaves is cool and a little green; sun is warm. That split, and the distance
  // between the two, is what makes the patches read as light rather than as a pattern.
  const H = h => Math.round(h * 60);
  const night = { t: ['#241b14', '#3a2a1c'], p: ['#bba98a', '#ccb894'], s: '#c8904f', ss: .1, d: 0, l: .3, w: '#3d3127' };
  const blue = { t: ['#2b2622', '#4a4440'], p: ['#b9b09d', '#c8bfae'], s: '#d7a49c', ss: .25, d: 0, l: .45, w: '#5b4b3d' };
  const rise = { t: ['#342a20', '#c98d55'], p: ['#c8b799', '#ffdcac'], s: '#ffca8c', ss: .75, d: .55, l: .72, w: '#a9855c' };
  const morning = { t: ['#383022', '#d0a76a'], p: ['#cfc2a3', '#fff8e6'], s: '#fff8e4', ss: .88, d: .8, l: .95, w: '#c6a97c' };
  const noon = { t: ['#3a3022', '#caa063'], p: ['#cdbf9f', '#fff5dc'], s: '#fffbea', ss: .95, d: .85, l: 1, w: '#cdb081' };
  const afternoon = { t: ['#3b2f21', '#cd9a5a'], p: ['#ccbc9a', '#fff0d0'], s: '#ffe3ae', ss: .9, d: .85, l: .95, w: '#c7a374' };
  const golden = { t: ['#3a2b1d', '#d38a46'], p: ['#cab693', '#ffe2b2'], s: '#ffbe70', ss: .82, d: .75, l: .8, w: '#b6875b' };
  const sunset = { t: ['#30251b', '#b76a3c'], p: ['#c0aa89', '#ffcf9c'], s: '#ff9b5d', ss: .55, d: .35, l: .55, w: '#80593f' };
  const day = [
    [0, night], [H(5), night], [H(5.75), blue], [H(6.5), rise], [H(8), morning], [H(12.5), noon],
    [H(16), afternoon], [H(17.75), golden], [H(18.75), sunset], [H(19.5), blue], [H(20.5), night], [1440, night],
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
      s: mixHex(a.s, b.s, t), w: mixHex(a.w, b.w, t),
      ss: mix(a.ss, b.ss, t), d: mix(a.d, b.d, t), l: mix(a.l, b.l, t),
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
      '--dapple': p.d.toFixed(3), '--leaf-light': p.l.toFixed(3),
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
    // Choose whichever ink reads best on the plaster at this moment. Around sunrise and
    // sunset the wall passes through mid-tones where neither ink is comfortable, so the
    // plaster is nudged lighter or darker until small text clears 6.2:1 on bare plaster, leaving
    // room for leaf shade and sun patches moving across it.
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
    output.textContent = override === null ? `${text} · your time` : text;
    nowButton.hidden = override === null;
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
