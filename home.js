(() => {
  const dialog = document.querySelector('#story-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const content = document.querySelector('#dialog-content');
  const closeButton = document.querySelector('#close-dialog');
  let opener = null;

  document.querySelectorAll('[data-story]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const story = document.getElementById(link.dataset.story);
      if (!story) return;
      event.preventDefault();
      opener = link;
      content.replaceChildren(...Array.from(story.children, child => child.cloneNode(true)));
      content.querySelector('h2').id = 'dialog-title';
      document.body.classList.add('dialog-open');
      dialog.showModal();
      dialog.scrollTop = 0;
      closeButton.focus({ preventScroll: true });
    });
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    opener?.focus({ preventScroll: true });
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
})();
