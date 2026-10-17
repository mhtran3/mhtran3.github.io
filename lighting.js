(() => {
  const body = document.querySelector('body.cafe-interior');
  const control = document.querySelector('.lighting-control');
  const select = document.querySelector('#cafe-lighting');
  if (!body || !control || !select) return;

  const status = document.querySelector('#lighting-status');
  const theme = document.querySelector('meta[name="theme-color"]');
  const colors = { day: '#7a6248', dusk: '#69513f', night: '#49392e' };
  let preference = 'auto';
  let timer = null;

  function stopTimer() {
    clearTimeout(timer);
    timer = null;
  }

  function update() {
    stopTimer();
    const now = new Date();
    const hour = now.getHours();
    const automatic = hour >= 7 && hour < 17 ? 'day'
      : hour >= 5 && hour < 20 ? 'dusk' : 'night';
    const mode = preference === 'auto' ? automatic : preference;
    if (body.dataset.light !== mode) body.dataset.light = mode;
    if (theme && theme.content !== colors[mode]) theme.content = colors[mode];
    if (select.value !== preference) select.value = preference;
    const label = preference === 'auto' ? 'Your local time' : 'Preview';
    if (status && status.textContent !== label) status.textContent = label;
    // Align to the device's next minute and re-read its clock after every wake.
    if (!document.hidden) {
      timer = setTimeout(update, 60000 - now.getSeconds() * 1000 - now.getMilliseconds());
    }
  }

  select.addEventListener('change', () => {
    preference = ['auto', 'day', 'dusk', 'night'].includes(select.value) ? select.value : 'auto';
    update();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopTimer();
    else update();
  });
  window.addEventListener('pagehide', stopTimer);
  window.addEventListener('pageshow', update);
  update();
  control.hidden = false;
})();
