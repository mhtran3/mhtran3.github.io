(() => {
  const dialog = document.querySelector('#story-dialog');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const automatic = new Map();
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      const state = automatic.get(entry.target);
      if (state) state.visible = entry.isIntersecting && entry.intersectionRatio >= .35;
    }
    syncMedia();
  }, { threshold: [0, .35] }) : null;

  // A programmatic pause must not be confused with the viewer's pause button.
  function pauseVideo(video) {
    if (video.paused) return;
    const state = automatic.get(video);
    if (state) state.internalPauses++;
    video.pause();
  }
  function inView(video, state) {
    return state.visible && video.isConnected && !document.hidden &&
      (!dialog?.open || dialog.contains(video));
  }
  function syncMedia() {
    for (const [video, state] of automatic) {
      if (!inView(video, state)) pauseVideo(video);
    }
    if (motion.matches) return;
    for (const [video, state] of automatic) {
      if (!inView(video, state) || !video.paused || state.userPaused || state.blocked || state.pending) continue;
      // An automatic preview never interrupts another clip the reader started.
      if ([...document.querySelectorAll('video')].some(other => other !== video && !other.paused && !other.ended) ||
          [...automatic.values()].some(other => other.pending)) continue;
      state.pending = true;
      video.muted = true;
      video.play().then(() => {
        if (!inView(video, state) || motion.matches) pauseVideo(video);
      }).catch(error => {
        // A visibility pause can abort loading; a policy rejection stays manual.
        if (error.name !== 'AbortError') state.blocked = true;
      }).finally(() => {
        state.pending = false;
        // Let a queued native pause event record reader intent before retrying.
        // A different visible clip may be waiting for this pending request.
        setTimeout(syncMedia, 0);
      });
    }
  }
  function observeMedia(root) {
    if (!observer) return; // Native controls remain the fallback.
    root.querySelectorAll('video[data-autoplay="visible"]').forEach(video => {
      if (automatic.has(video)) return;
      const state = { visible: false, userPaused: false, internalPauses: 0, pending: false, blocked: false };
      automatic.set(video, state);
      video.muted = true;
      video.addEventListener('pause', () => {
        if (state.internalPauses) state.internalPauses--;
        else if (!video.ended) state.userPaused = true;
      });
      video.addEventListener('play', () => { state.userPaused = false; });
      observer.observe(video);
    });
  }
  function releaseMedia(root) {
    root.querySelectorAll('video').forEach(video => {
      pauseVideo(video);
      observer?.unobserve(video);
      automatic.delete(video);
    });
  }
  document.addEventListener('play', event => {
    if (event.target.tagName !== 'VIDEO') return;
    document.querySelectorAll('video').forEach(video => {
      if (video !== event.target) pauseVideo(video);
    });
  }, true);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) document.querySelectorAll('video').forEach(pauseVideo);
    else syncMedia();
  });
  motion.addEventListener('change', () => {
    if (motion.matches) automatic.forEach((_state, video) => pauseVideo(video));
    else syncMedia();
  });

  if (dialog && typeof dialog.showModal === 'function') {
    const content = document.querySelector('#dialog-content');
    const closeButton = document.querySelector('#close-dialog');
    let opener = null;

    // Delegation also handles links inside cloned stories.
    document.addEventListener('click', event => {
        const link = event.target.closest?.('[data-story]');
        if (!link) return;
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const story = document.getElementById(link.dataset.story);
        if (!story) return;
        event.preventDefault();
        if (!dialog.open) opener = link;
        releaseMedia(content);
        document.querySelectorAll('video').forEach(pauseVideo);
        content.replaceChildren(...Array.from(story.children, child => child.cloneNode(true)));
        content.querySelector('h2').id = 'dialog-title';
        document.body.classList.add('dialog-open');
        if (!dialog.open) dialog.showModal();
        observeMedia(content);
        syncMedia();
        dialog.scrollTop = 0;
        closeButton.focus({ preventScroll: true });
    });
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
      // Closing a story must stop its media, including audio added in future work.
      releaseMedia(content);
      content.replaceChildren();
      document.body.classList.remove('dialog-open');
      opener?.focus({ preventScroll: true });
      syncMedia();
    });
    // Native anchors remain readable without JavaScript and for direct story links.
    function showDirectStory() {
      const id = window.location.hash.slice(1);
      if (document.getElementById(id)?.classList.contains('story')) {
        document.documentElement.classList.remove('js-ready');
      }
    }
    document.documentElement.classList.add('js-ready');
    showDirectStory();
    window.addEventListener('hashchange', showDirectStory);
  }
  // Observe only after the enhanced page has hidden its source story library.
  observeMedia(document);
})();

// Seal comparison: one position moves the line through both seals. On touch, only a sideways
// drag or a tap moves it, so scrolling past never does. The range input handles keyboards.
document.querySelectorAll('.compare').forEach(compare => {
  const range = compare.querySelector('.cmp-range');
  const set = value => {
    const cut = Math.min(100, Math.max(0, value)), whole = Math.round(cut);
    compare.style.setProperty('--cut', `${cut}%`);
    range.value = whole;
    range.setAttribute('aria-valuetext', `${whole}% as given, ${100 - whole}% restored`);
  };
  range.addEventListener('input', () => set(+range.value));
  compare.querySelectorAll('.seal-cmp').forEach(seal => {
    const place = e => { const box = seal.getBoundingClientRect(); set((e.clientX - box.left) / box.width * 100); };
    seal.addEventListener('pointerdown', down => {
      if (down.button) return;
      let drag = down.pointerType === 'mouse';
      if (drag) { down.preventDefault(); place(down); }
      seal.setPointerCapture(down.pointerId);
      const move = e => { if (drag ||= Math.abs(e.clientX - down.clientX) > 6) place(e); };
      const end = e => {
        if (!drag && e.type === 'pointerup') place(e);   // a tap moves the line there
        seal.removeEventListener('pointermove', move);
        seal.removeEventListener('pointerup', end);
        seal.removeEventListener('pointercancel', end);
      };
      seal.addEventListener('pointermove', move);
      seal.addEventListener('pointerup', end);
      seal.addEventListener('pointercancel', end);
    });
  });
  compare.classList.add('compare-ready');
  set(+range.value);
});
// Papers on the table: each turns by its --tilt. Its outline is a clip-path polygon sized to the
// paper (recomputed when it resizes, never on scroll), so the light inside stays fixed to the room
// while the words turn. Narrow screens get a gentler turn. Papers off screen switch their light off.
(() => {
  const papers = document.querySelectorAll('.pp');
  if (!papers.length || !('ResizeObserver' in window)) return;
  const narrow = window.matchMedia('(max-width: 860px)');
  function shape(pp) {
    const tilt = parseFloat(getComputedStyle(pp).getPropertyValue('--tilt')) || 0;
    const turn = narrow.matches ? tilt * .35 : tilt;
    const s = Math.abs(Math.sin(turn * Math.PI / 180));
    const w = pp.offsetWidth, h = pp.offsetHeight;
    const a = h * s, b = w * s;   // how far each corner moves along its edge
    pp.style.setProperty('--clip', turn >= 0
      ? `polygon(${a}px 0, 100% ${b}px, calc(100% - ${a}px) 100%, 0 calc(100% - ${b}px))`
      : `polygon(0 ${b}px, calc(100% - ${a}px) 0, 100% calc(100% - ${b}px), ${a}px 100%)`);
    pp.style.setProperty('--a', `${a}px`);
    pp.style.setProperty('--b', `${b}px`);
    pp.style.setProperty('--turn', `${turn}deg`);
  }
  const resize = new ResizeObserver(entries => entries.forEach(e => shape(e.target)));
  papers.forEach(pp => resize.observe(pp));
  narrow.addEventListener('change', () => papers.forEach(shape));
  if ('IntersectionObserver' in window) {
    const seen = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('is-away', !e.isIntersecting)),
      { rootMargin: '25% 0px' });
    papers.forEach(pp => seen.observe(pp));
  }
})();
