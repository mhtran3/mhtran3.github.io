(() => {
  const dialog = document.querySelector('#story-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
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
      content.querySelectorAll('video').forEach(video => video.pause());
      content.replaceChildren(...Array.from(story.children, child => child.cloneNode(true)));
      content.querySelector('h2').id = 'dialog-title';
      document.body.classList.add('dialog-open');
      if (!dialog.open) dialog.showModal();
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
    content.querySelectorAll('video').forEach(video => video.pause());
    content.replaceChildren();
    document.body.classList.remove('dialog-open');
    opener?.focus({ preventScroll: true });
  });
  // Keep attention on the requested clip, including in the direct-story view.
  document.addEventListener('play', event => {
    if (event.target.tagName !== 'VIDEO') return;
    document.querySelectorAll('video').forEach(video => {
      if (video !== event.target) video.pause();
    });
  }, true);
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
})();
