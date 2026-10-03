const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');

// Navigation: menu toggle, close on Escape or after a choice, and mark the current section.
const button = document.querySelector('.menu-button');
const nav = document.querySelector('#primary-nav');
if (button && nav) {
  const setOpen = open => { button.setAttribute('aria-expanded', String(open)); nav.dataset.open = String(open); };
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
  const here = location.pathname;
  for (const link of nav.querySelectorAll('a')) {
    const href = link.getAttribute('href');
    if (href === here || (href !== '/' && here.startsWith(href))) link.setAttribute('aria-current', 'page');
  }
}

// Header gains a shadow once the page scrolls.
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Tabs: one panel at a time, arrow keys move between tabs.
for (const group of document.querySelectorAll('[data-tabs]')) {
  const tabs = [...group.querySelectorAll('[role="tab"]')];
  const select = (tab, focus) => {
    for (const item of tabs) {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(item.getAttribute('aria-controls'));
      panel.hidden = !active;
      if (active) { panel.querySelector('[data-draw]')?.classList.remove('is-drawn'); requestAnimationFrame(() => panel.querySelector('[data-draw]')?.classList.add('is-drawn')); }
    }
    if (focus) tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (step) { event.preventDefault(); select(tabs[(index + step + tabs.length) % tabs.length], true); }
    });
  });
  group.classList.add('is-tabbed');
  for (const tab of tabs.slice(1)) document.getElementById(tab.getAttribute('aria-controls')).hidden = true;
}

// Reveal sections and draw charts as they enter the viewport.
const watched = document.querySelectorAll('[data-reveal], [data-draw]');
if (reduceMotion || !('IntersectionObserver' in window)) {
  for (const item of watched) item.classList.add('is-visible', 'is-drawn');
} else {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add(entry.target.hasAttribute('data-draw') ? 'is-drawn' : 'is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.18 });
  for (const item of watched) observer.observe(item);
}
