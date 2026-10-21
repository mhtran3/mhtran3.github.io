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
// while the words turn. A folded pamphlet also gets the outline of its inside page, splayed a little
// from the fold, and the shadow its lifted cover casts on it; a note folded twice gets the layers
// beneath it. Narrow screens get a gentler turn. Papers off screen switch their light off.
(() => {
  const papers = [...document.querySelectorAll('.pp')];
  if (!papers.length || !('ResizeObserver' in window)) return;
  const narrow = window.matchMedia('(max-width: 860px)');
  const M = 14;   // the shadow and inside-page layers are drawn in a box this much larger all round
  const poly = (pts, o = 0) => `polygon(${pts.map(([x, y]) => `${(x + o).toFixed(1)}px ${(y + o).toFixed(1)}px`).join(', ')})`;
  function shape(pp) {
    const tilt = parseFloat(getComputedStyle(pp).getPropertyValue('--tilt')) || 0;
    const turn = narrow.matches ? tilt * .35 : tilt;
    const s = Math.abs(Math.sin(turn * Math.PI / 180));
    const w = pp.offsetWidth, h = pp.offsetHeight;
    const a = h * s, b = w * s;   // how far each corner moves along its edge
    const [tl, tr, br, bl] = turn >= 0 ? [[a, 0], [w, b], [w - a, h], [0, h - b]] : [[0, b], [w - a, 0], [w, h - b], [a, h]];
    // The paper's own directions: u along the top edge, v down the fold.
    const unit = (p, q) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [(q[0] - p[0]) / d, (q[1] - p[1]) / d]; };
    const u = unit(tl, tr), v = unit(tl, bl);
    const at = (p, du, dv) => [p[0] + du * u[0] + dv * v[0], p[1] + du * u[1] + dv * v[1]];
    let outline = [tl, tr, br, bl], outer = outline;
    if (pp.classList.contains('pp--quarter')) {
      // Folded twice, down the left and across the top. The layers inside stay within those folds and
      // fan out toward the open corner, each out of line with the next; where the folds meet, the corner
      // is blunted by the bulk of paper wrapped inside it.
      outline = [at(tl, 0, 3.5), at(tl, 1, 1), at(tl, 3.5, 0), tr, br, bl];
      const layers = [
        [[.5, .5], [.6, .3], [2.6, 2.2], [.4, .7]],
        [[.5, .5], [1.1, .4], [4.2, 4.8], [.5, 1.1]],
        [[.5, .5], [.8, .5], [6.4, 5.6], [.6, 1.5]],
      ];
      const corners = [tl, tr, br, bl];
      layers.forEach((offsets, i) => pp.style.setProperty(i ? `--back-clip-${i + 1}` : '--back-clip',
        poly(corners.map((c, j) => at(c, ...offsets[j])), M)));
      outer = [...outline.slice(0, 3), at(tr, 1.1, .5), at(br, 6.4, 5.6), at(bl, .6, 1.5)];
      pp.style.setProperty('--lift-clip', poly([tl, at(tr, .5, .5), at(br, 2.5, 2.5), at(bl, .5, .5)], M));
    } else if (pp.querySelector(':scope > .pp-back')) {
      const n = papers.indexOf(pp), wide = 6 + n % 3 * 1.5, low = 5 + (n + 1) % 3 * 1.5;
      // The inside page is joined to the cover at the fold and fans out toward the open corner.
      outer = [at(tl, .5, 0), at(tr, 2, -.3), at(br, wide, low), at(bl, .5, 1.2)];
      pp.style.setProperty('--back-clip', poly(outer, M));
      pp.style.setProperty('--lift-clip', poly([at(tl, 0, 1), at(tr, 1.5, 2), at(br, wide * .7, low * .75), at(bl, 0, 1.5)], M));
    }
    pp.style.setProperty('--clip', poly(outline));
    pp.style.setProperty('--outer-clip', poly(outer, M));
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
