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

// Tools hub: live search and category filters.
(() => {
  const hub = document.querySelector('[data-tools-hub]');
  if (!hub) return;
  const input = hub.querySelector('[data-tools-search]');
  const chips = [...hub.querySelectorAll('[data-filter]')];
  let filter = 'all';
  const apply = () => {
    const query = input.value.trim().toLowerCase();
    let shown = 0;
    hub.querySelectorAll('[data-group]').forEach(group => {
      let groupShown = 0;
      group.querySelectorAll('[data-tool]').forEach(card => {
        const match = (filter === 'all' || group.dataset.group === filter) && (!query || card.dataset.search.includes(query));
        card.hidden = !match; if (match) groupShown += 1;
      });
      group.hidden = groupShown === 0; shown += groupShown;
    });
    hub.querySelector('[data-tools-count]').textContent = `${shown} calculator${shown === 1 ? '' : 's'}`;
    hub.querySelector('[data-tools-empty]').hidden = shown > 0;
  };
  input.addEventListener('input', apply);
  chips.forEach(chip => chip.addEventListener('click', () => {
    filter = chip.dataset.filter;
    chips.forEach(other => other.setAttribute('aria-pressed', String(other === chip)));
    apply();
  }));
})();

// FAQ hubs: search across questions and answers, topic chips, and popular-question jumps.
(() => {
  const hub = document.querySelector('[data-faq-hub]');
  if (!hub) return;
  const input = hub.querySelector('[data-faq-search]');
  const chips = [...hub.querySelectorAll('[data-faq-filter]')];
  let filter = 'all';
  const apply = () => {
    const query = input.value.trim().toLowerCase();
    let shown = 0;
    hub.querySelectorAll('[data-faq-topic]').forEach(topic => {
      let topicShown = 0;
      topic.querySelectorAll('[data-faq-q]').forEach(item => {
        const match = (filter === 'all' || topic.dataset.faqTopic === filter) && (!query || item.dataset.search.includes(query));
        item.hidden = !match;
        if (match) topicShown += 1;
        if (query && match) item.open = true;
      });
      topic.hidden = topicShown === 0;
      shown += topicShown;
    });
    hub.querySelector('[data-faq-count]').textContent = `${shown} question${shown === 1 ? '' : 's'}`;
    hub.querySelector('[data-faq-empty]').hidden = shown > 0;
  };
  input.addEventListener('input', apply);
  chips.forEach(chip => chip.addEventListener('click', () => {
    filter = chip.dataset.faqFilter;
    chips.forEach(other => other.setAttribute('aria-pressed', String(other === chip)));
    apply();
  }));
  const openTarget = id => { const item = document.getElementById(id); if (item && item.tagName === 'DETAILS') { item.hidden = false; item.closest('[data-faq-topic]').hidden = false; item.open = true; } };
  hub.querySelectorAll('[data-faq-jump]').forEach(link => link.addEventListener('click', () => openTarget(link.dataset.faqJump)));
  if (location.hash) openTarget(location.hash.slice(1));
})();
