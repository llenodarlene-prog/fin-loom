import { escapeHtml, inline } from './content.mjs';
import { buildIllustrations, renderHeroCard, renderLab } from './illustrations.mjs';

// Designed pages render from the copy files in data/. Copy strings may use inline Markdown (links, bold).
const paragraphs = (items = [], className = '') => items.map(text => `<p${className ? ` class="${className}"` : ''}>${inline(text)}</p>`).join('');
const index = number => String(number).padStart(2, '0');

// Editorial photography, served at two widths. The first image on a page loads eagerly.
export function photo(image, { eager = false, sizes }) {
  return `<img src="${escapeHtml(image.src)}" srcset="${escapeHtml(image.small)} 800w, ${escapeHtml(image.src)} ${image.width}w" sizes="${sizes}" width="${image.width}" height="${image.height}" alt="${escapeHtml(image.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

const sectionLabel = (slug, nav) => {
  const root = `/${String(slug).split('/').filter(Boolean)[0] || ''}/`;
  return nav.primary.find(item => item.url === root)?.label || '';
};
const formatDate = value => {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
};
export function postCard(post, nav, { size = 'standard' } = {}) {
  const date = post.modified || post.published;
  const label = sectionLabel(post.slug, nav);
  return `<article class="post-card post-card--${size}">
    <p class="meta">${label ? `<span>${escapeHtml(label)}</span>` : ''}${date ? `<time datetime="${escapeHtml(date)}">${escapeHtml(formatDate(date))}</time>` : ''}</p>
    <h3><a href="${escapeHtml(post.slug)}">${escapeHtml(post.title)}</a></h3>
    <p>${escapeHtml(post.description)}</p>
  </article>`;
}
const postList = (posts, nav) => `<div class="post-grid">${posts.map((post, i) => postCard(post, nav, { size: i === 0 ? 'lead' : 'standard' })).join('')}</div>`;
const arrowLink = (url, label, className = 'arrow-link') => `<a class="${className}" href="${escapeHtml(url)}">${escapeHtml(label)}</a>`;

export function renderHome(copy, posts, nav) {
  const { hero, intro, coverage, context, decisions, latest, closing } = copy;
  // The primary button points at published research once any exists; drafts never appear here.
  const illustrations = buildIllustrations();
  const primary = posts.length ? { label: hero.primary_cta.label, url: hero.primary_cta.url } : { label: hero.primary_cta.fallback_label, url: hero.primary_cta.fallback_url };
  return `
  <section class="hero" aria-labelledby="home-heading">
    <div class="shell hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">${escapeHtml(hero.eyebrow)}</p>
        <h1 id="home-heading">${escapeHtml(hero.heading)}</h1>
        ${paragraphs(hero.copy)}
        <div class="cta-row">
          <a class="button button--light" href="${escapeHtml(primary.url)}">${escapeHtml(primary.label)}</a>
          <a class="button button--ghost" href="${escapeHtml(hero.secondary_cta.url)}">${escapeHtml(hero.secondary_cta.label)}</a>
        </div>
      </div>
      <div class="hero-media">${photo(hero.image, { eager: true, sizes: '(max-width: 900px) 100vw, 46vw' })}${renderHeroCard(illustrations)}</div>
    </div>
    <div class="shell"><ul class="hero-index" aria-label="Coverage">${coverage.cards.map((card, i) => `<li><a href="${escapeHtml(card.url)}"><span>${index(i + 1)}</span>${escapeHtml(card.label)}</a></li>`).join('')}</ul></div>
  </section>

  <section class="band" aria-labelledby="intro-heading">
    <div class="shell statement" data-reveal>
      <h2 id="intro-heading">${escapeHtml(intro.heading)}</h2>
      <div class="statement-copy">${paragraphs(intro.copy)}</div>
    </div>
  </section>

  <section class="band band--tint" id="coverage" aria-labelledby="coverage-heading">
    <div class="shell">
      <header class="band-head" data-reveal><h2 id="coverage-heading">${escapeHtml(coverage.heading)}</h2><p>${escapeHtml(coverage.intro)}</p></header>
      <div class="coverage-grid" data-reveal="stagger">
        ${coverage.cards.map((card, i) => `<article class="coverage-card">
          <p class="card-index">${index(i + 1)}</p>
          <h3><a href="${escapeHtml(card.url)}">${escapeHtml(card.label)}</a></h3>
          <p>${escapeHtml(card.text)}</p>
          <span class="arrow-link" aria-hidden="true">${escapeHtml(card.link)}</span>
        </article>`).join('')}
      </div>
    </div>
  </section>

  <section class="band band--dark" aria-labelledby="context-heading">
    <div class="shell lab-layout">
      <header class="band-head" data-reveal>
        <p class="eyebrow">${escapeHtml(context.eyebrow)}</p>
        <h2 id="context-heading">${escapeHtml(context.heading)}</h2>
        ${paragraphs(context.copy)}
      </header>
      <div data-reveal>${renderLab(illustrations)}</div>
    </div>
  </section>

  <section class="band" aria-labelledby="decisions-heading">
    <div class="shell">
      <header class="band-head" data-reveal><h2 id="decisions-heading">${escapeHtml(decisions.heading)}</h2>${paragraphs(decisions.copy)}</header>
      <ol class="distinctions" data-reveal="stagger">
        ${decisions.points.map((point, i) => `<li><span class="card-index">${index(i + 1)}</span><h3>${escapeHtml(point.title)}</h3><p>${escapeHtml(point.text)}</p></li>`).join('')}
      </ol>
    </div>
  </section>
${posts.length ? `
  <section class="band" id="latest" aria-labelledby="latest-heading">
    <div class="shell">
      <header class="band-head"><h2 id="latest-heading">${escapeHtml(latest.heading)}</h2></header>
      ${postList(posts.slice(0, latest.limit), nav)}
    </div>
  </section>` : ''}
  <section class="band band--tint closing" aria-labelledby="closing-heading">
    <div class="shell closing-inner" data-reveal>
      <h2 id="closing-heading">${escapeHtml(closing.heading)}</h2>
      ${paragraphs(closing.copy)}
      ${arrowLink(closing.cta.url, closing.cta.label, 'button button--primary')}
    </div>
  </section>`;
}

export function renderAbout(copy) {
  const { hero, sections, disclaimer } = copy;
  return `
  <section class="page-hero" aria-labelledby="about-heading">
    <div class="shell page-hero-grid">
      <div>
        <p class="eyebrow">${escapeHtml(hero.eyebrow)}</p>
        <h1 id="about-heading">${escapeHtml(hero.heading)}</h1>
        ${paragraphs(hero.copy)}
      </div>
      <div class="page-hero-media">${photo(hero.image, { eager: true, sizes: '(max-width: 900px) 100vw, 44vw' })}</div>
    </div>
  </section>

  <div class="shell rows">
    ${sections.map((section, i) => `<section class="row" data-reveal aria-labelledby="about-${i + 1}">
      <div class="row-head"><p class="card-index">${index(i + 1)}</p><h2 id="about-${i + 1}">${escapeHtml(section.heading)}</h2></div>
      <div class="row-body">
        ${paragraphs(section.copy)}
        ${section.list ? `<ul class="${section.list_style === 'lines' ? 'line-list' : 'tick-list'}">${section.list.map(item => `<li>${inline(item)}</li>`).join('')}</ul>` : ''}
        ${paragraphs(section.after)}
      </div>
    </section>`).join('')}
  </div>

  <section class="band band--dark" aria-labelledby="disclaimer-heading">
    <div class="shell statement">
      <h2 id="disclaimer-heading">${escapeHtml(disclaimer.heading)}</h2>
      <div class="statement-copy">${paragraphs(disclaimer.copy)}</div>
    </div>
  </section>`;
}

// Category hub: hero, what the section covers, two short editorial notes, then published research under the hub's slug.
export function renderHub(hub, shared, posts, nav) {
  return `
  <section class="page-hero" aria-labelledby="hub-heading">
    <div class="shell page-hero-grid">
      <div>
        <p class="eyebrow">${escapeHtml(shared.eyebrow)} <span>${index(hub.index)}</span></p>
        <h1 id="hub-heading">${escapeHtml(hub.heading)}</h1>
        ${paragraphs(hub.copy)}
      </div>
      <div class="page-hero-media">${photo(hub.image, { eager: true, sizes: '(max-width: 900px) 100vw, 44vw' })}<p class="media-chip glass"><strong>${index(hub.index)}</strong> of ${index(shared.total)} ${escapeHtml(shared.chip_label)}</p></div>
    </div>
  </section>

  <section class="band band--tint" aria-labelledby="topics-heading">
    <div class="shell topics">
      <h2 id="topics-heading">${escapeHtml(shared.topics_heading)}</h2>
      <ul class="chips" data-reveal="stagger">${hub.topics.map(topic => `<li>${escapeHtml(topic)}</li>`).join('')}</ul>
    </div>
  </section>

  <div class="shell notes" data-reveal="stagger">
    ${hub.sections.map(section => `<section class="note"><h2>${escapeHtml(section.heading)}</h2>${paragraphs(section.copy)}</section>`).join('')}
  </div>

  <section class="band band--rule" id="research" aria-labelledby="hub-latest-heading">
    <div class="shell">
      <header class="band-head"><h2 id="hub-latest-heading">${escapeHtml(shared.latest_heading.replace('{section}', hub.heading))}</h2></header>
      ${posts.length ? postList(posts, nav) : `<p class="empty-state">${escapeHtml(shared.empty_state)}</p>`}
    </div>
  </section>`;
}

// The address comes from the mailto link in content/pages/contact.md, the same place the release gate checks.
export function contactEmail(body, source) {
  const email = body.match(/mailto:([^)\s"]+@[^)\s"]+)/)?.[1];
  if (!email) throw new Error(`${source}: contact page body must contain a mailto: address`);
  return email;
}

const mailto = (email, subject) => `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;

export function renderContact(copy, email) {
  return `
  <section class="page-hero page-hero--plain" aria-labelledby="contact-heading">
    <div class="shell contact">
      <p class="eyebrow">${escapeHtml(copy.eyebrow)}</p>
      <h1 id="contact-heading">${escapeHtml(copy.heading)}</h1>
      <p class="lede">${escapeHtml(copy.intro)}</p>
      <a class="email-card" href="${escapeHtml(mailto(email))}">
        <span class="card-index">${escapeHtml(copy.email_label)}</span>
        <span class="email-address">${escapeHtml(email)}</span>
      </a>
    </div>
  </section>
  <section class="band band--tint" aria-labelledby="enquiries-heading">
    <div class="shell">
      <header class="band-head"><h2 id="enquiries-heading">${escapeHtml(copy.enquiries_heading)}</h2></header>
      <div class="coverage-grid" data-reveal="stagger">
        ${copy.enquiries.map((item, i) => `<article class="coverage-card">
          <p class="card-index">${index(i + 1)}</p>
          <h3><a href="${escapeHtml(mailto(email, item.title))}">${escapeHtml(item.title)}</a></h3>
          <p>${escapeHtml(item.text)}</p>
        </article>`).join('')}
      </div>
      <p class="contact-note">${escapeHtml(copy.note)}</p>
    </div>
  </section>`;
}
