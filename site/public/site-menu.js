/* AI Blocks plain pages: the More menu closes on Escape or a click outside it, and the theme button switches light and dark.
   The menu itself is a <details> element, so it opens and closes without this file. Built by scripts/lib/site-chrome.mjs. */
(() => {
  'use strict';
  const menu = document.querySelector('details.static-menu');
  if (!menu) return;
  const close = () => { if (menu.open) menu.open = false; };
  document.addEventListener('pointerdown', (event) => { if (!menu.contains(event.target)) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menu.open) { close(); menu.querySelector('summary')?.focus(); } });
  menu.addEventListener('toggle', () => { if (menu.open) menu.querySelector('nav a[href]:not([data-shell-menu-main])')?.focus({ preventScroll: true }); });
  menu.querySelector('[data-static-theme]')?.addEventListener('click', () => {
    const root = document.documentElement, next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (next === 'dark') root.dataset.theme = 'dark'; else delete root.dataset.theme;
    try { localStorage.setItem('abb:theme', next); } catch (e) { /* private mode: still switches for this visit */ }
  });
})();
