import { escapeHtml, inline } from './content.mjs';
import { renderHeroCard, renderLab } from './illustrations.mjs';

// Designed pages render from the copy files in data/. Copy strings may use inline Markdown (links, bold).
const paragraphs = (items = [], className = '') => items.map(text => `<p${className ? ` class="${className}"` : ''}>${inline(text)}</p>`).join('');

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
const pick = (charts, ids, source) => ids.map(id => { if (!charts[id]) throw new Error(`${source}: unknown chart "${id}"`); return charts[id]; });
const mailto = (email, subject) => `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;

// Dark band with copy on the left and the chart module on the right.
const chartBand = ({ eyebrow, heading, copy }, panels, id) => `
  <section class="band band--dark" aria-labelledby="${id}">
    <div class="shell lab-layout">
      <header class="band-head" data-reveal>
        <p class="eyebrow">${escapeHtml(eyebrow)}</p>
        <h2 id="${id}">${escapeHtml(heading)}</h2>
        ${paragraphs(copy)}
      </header>
      <div data-reveal>${renderLab(panels)}</div>
    </div>
  </section>`;

const cardGrid = (cards, render) => `<div class="coverage-grid" data-reveal="stagger">${cards.map(card => `<article class="coverage-card">${render(card)}</article>`).join('')}</div>`;

export function renderHome(copy, posts, nav, charts) {
  const { hero, intro, coverage, context, decisions, latest, closing } = copy;
  // The primary button points at published research once any exists; drafts never appear here.
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
      <div class="hero-chart">${renderHeroCard(pick(charts, [hero.chart], 'data/home-page.json')[0])}</div>
    </div>
    <div class="shell"><ul class="hero-index" aria-label="Coverage">${coverage.cards.map(card => `<li><a href="${escapeHtml(card.url)}">${escapeHtml(card.label)}</a></li>`).join('')}</ul></div>
  </section>

  <section class="feature feature--intro" aria-labelledby="intro-heading">
    ${photo(intro.image, { sizes: '100vw' })}
    <div class="shell"><div class="feature-panel glass" data-reveal>
      <h2 id="intro-heading">${escapeHtml(intro.heading)}</h2>
      ${paragraphs(intro.copy)}
    </div></div>
  </section>
${chartBand(context, pick(charts, context.charts, 'data/home-page.json'), 'context-heading')}
  <section class="band band--tint" id="coverage" aria-labelledby="coverage-heading">
    <div class="shell">
      <header class="band-head" data-reveal><h2 id="coverage-heading">${escapeHtml(coverage.heading)}</h2><p>${escapeHtml(coverage.intro)}</p></header>
      ${cardGrid(coverage.cards, card => `<h3><a href="${escapeHtml(card.url)}">${escapeHtml(card.label)}</a></h3>
          <p>${escapeHtml(card.text)}</p>
          <span class="arrow-link" aria-hidden="true">${escapeHtml(card.link)}</span>`)}
    </div>
  </section>

  <section class="band" aria-labelledby="decisions-heading">
    <div class="shell">
      <header class="band-head" data-reveal><h2 id="decisions-heading">${escapeHtml(decisions.heading)}</h2>${paragraphs(decisions.copy)}</header>
      <ul class="distinctions" data-reveal="stagger">
        ${decisions.points.map(point => `<li><h3>${escapeHtml(point.title)}</h3><p>${escapeHtml(point.text)}</p></li>`).join('')}
      </ul>
    </div>
  </section>
${posts.length ? `
  <section class="band band--rule" id="latest" aria-labelledby="latest-heading">
    <div class="shell">
      <header class="band-head"><h2 id="latest-heading">${escapeHtml(latest.heading)}</h2></header>
      ${postList(posts.slice(0, latest.limit), nav)}
    </div>
  </section>` : ''}
  <section class="band band--tint closing" aria-labelledby="closing-heading">
    <div class="shell closing-inner" data-reveal>
      <h2 id="closing-heading">${escapeHtml(closing.heading)}</h2>
      ${paragraphs(closing.copy)}
      <a class="button button--primary" href="${escapeHtml(closing.cta.url)}">${escapeHtml(closing.cta.label)}</a>
    </div>
  </section>`;
}

// About: each section declares a layout so the page alternates between image splits, tiles, and bands.
const aboutList = (section, className) => section.list ? `<ul class="${className}">${section.list.map(item => `<li>${inline(item)}</li>`).join('')}</ul>` : '';
const aboutLayouts = {
  split: (section, id) => `
  <section class="band" aria-labelledby="${id}">
    <div class="shell split${section.side === 'right' ? ' split--reverse' : ''}">
      <div class="split-media" data-reveal>${photo(section.image, { sizes: '(max-width: 900px) 100vw, 46vw' })}</div>
      <div class="split-copy" data-reveal>
        <h2 id="${id}">${escapeHtml(section.heading)}</h2>
        ${paragraphs(section.copy)}
        ${aboutList(section, 'line-list')}
        ${paragraphs(section.after)}
      </div>
    </div>
  </section>`,
  tiles: (section, id) => `
  <section class="band band--tint" aria-labelledby="${id}">
    <div class="shell">
      <header class="band-head" data-reveal><h2 id="${id}">${escapeHtml(section.heading)}</h2>${paragraphs(section.copy)}</header>
      ${section.list ? `<ul class="tiles" data-reveal="stagger">${section.list.map(item => `<li>${inline(item)}</li>`).join('')}</ul>` : ''}
      <div class="band-foot" data-reveal>${paragraphs(section.after)}</div>
    </div>
  </section>`,
  dark: (section, id) => `
  <section class="band band--dark" aria-labelledby="${id}">
    <div class="shell lab-layout">
      <header class="band-head" data-reveal>
        <h2 id="${id}">${escapeHtml(section.heading)}</h2>
        ${paragraphs(section.copy)}
        ${paragraphs(section.after)}
      </header>
      ${section.list ? `<ul class="source-ladder glass" data-reveal="stagger">${section.list.map(item => `<li>${inline(item)}</li>`).join('')}</ul>` : ''}
    </div>
  </section>`,
  feature: (section, id) => `
  <section class="feature" aria-labelledby="${id}">
    ${photo(section.image, { sizes: '100vw' })}
    <div class="shell"><div class="feature-panel glass" data-reveal>
      <h2 id="${id}">${escapeHtml(section.heading)}</h2>
      ${paragraphs(section.copy)}
    </div></div>
  </section>`,
  card: (section, id) => `
  <section class="band" aria-labelledby="${id}">
    <div class="shell"><div class="notice" data-reveal>
      <h2 id="${id}">${escapeHtml(section.heading)}</h2>
      ${paragraphs(section.copy)}
    </div></div>
  </section>`
};

export function renderAbout(copy) {
  const { hero, sections, disclaimer, closing } = copy;
  return `
  <section class="page-hero page-hero--about" aria-labelledby="about-heading">
    <div class="shell page-hero-grid">
      <div>
        <p class="eyebrow">${escapeHtml(hero.eyebrow)}</p>
        <h1 id="about-heading">${escapeHtml(hero.heading)}</h1>
        ${paragraphs(hero.copy)}
        <div class="cta-row"><a class="button button--primary" href="#about-1">${escapeHtml(sections[0].heading)}</a></div>
      </div>
      <div class="page-hero-media">
        ${photo(hero.image, { eager: true, sizes: '(max-width: 900px) 100vw, 44vw' })}
        <blockquote class="hero-quote glass">${escapeHtml(hero.quote)}</blockquote>
      </div>
    </div>
  </section>
${sections.map((section, i) => {
    const render = aboutLayouts[section.layout];
    if (!render) throw new Error(`data/about-page.json: unknown layout "${section.layout}" for ${section.heading}`);
    return render(section, `about-${i + 1}`);
  }).join('')}
  <section class="band band--dark" aria-labelledby="disclaimer-heading">
    <div class="shell statement" data-reveal>
      <h2 id="disclaimer-heading">${escapeHtml(disclaimer.heading)}</h2>
      <div class="statement-copy">${paragraphs(disclaimer.copy)}</div>
    </div>
  </section>

  <section class="band band--tint closing" aria-labelledby="about-closing">
    <div class="shell closing-inner" data-reveal>
      <h2 id="about-closing">${escapeHtml(closing.heading)}</h2>
      ${paragraphs(closing.copy)}
      <div class="cta-row cta-row--center">${closing.links.map((link, i) => `<a class="button ${i === 0 ? 'button--primary' : 'button--outline'}" href="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a>`).join('')}</div>
    </div>
  </section>`;
}

// Category hub: hero, what the section covers, two editorial notes, an optional chart band, then published research.
export function renderHub(hub, shared, posts, nav, charts) {
  return `
  <section class="page-hero" aria-labelledby="hub-heading">
    <div class="shell page-hero-grid">
      <div>
        <p class="eyebrow">${escapeHtml(shared.eyebrow)}</p>
        <h1 id="hub-heading">${escapeHtml(hub.heading)}</h1>
        ${paragraphs(hub.copy)}
        <div class="cta-row"><a class="button button--primary" href="#research">${escapeHtml(shared.research_link.replace('{section}', hub.heading))}</a></div>
      </div>
      <div class="page-hero-media">${photo(hub.image, { eager: true, sizes: '(max-width: 900px) 100vw, 44vw' })}</div>
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
${hub.chart_band ? chartBand(hub.chart_band, pick(charts, hub.chart_band.charts, 'data/hub-pages.json'), 'chart-heading') : ''}
  <section class="band${hub.chart_band ? '' : ' band--rule'}" id="research" aria-labelledby="hub-latest-heading">
    <div class="shell">
      <header class="band-head"><h2 id="hub-latest-heading">${escapeHtml(shared.latest_heading.replace('{section}', hub.heading))}</h2></header>
      ${posts.length ? postList(posts, nav) : `<p class="empty-state">${escapeHtml(shared.empty_state)}</p>`}
    </div>
  </section>

  <section class="band band--tint" aria-labelledby="more-heading">
    <div class="shell">
      <header class="band-head"><h2 id="more-heading">${escapeHtml(shared.more_heading)}</h2></header>
      <ul class="section-links" data-reveal="stagger">${nav.primary.filter(item => shared.sections.includes(item.url) && item.label !== hub.heading).map(item => `<li><a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a></li>`).join('')}</ul>
    </div>
  </section>`;
}

// The address comes from the mailto link in content/pages/contact.md, the same place the release gate checks.
export function contactEmail(body, source) {
  const email = body.match(/mailto:([^)\s"]+@[^)\s"]+)/)?.[1];
  if (!email) throw new Error(`${source}: page body must contain a mailto: address`);
  return email;
}

const emailCard = (label, email, subject) => `<a class="email-card" href="${escapeHtml(mailto(email, subject))}">
        <span class="email-label">${escapeHtml(label)}</span>
        <span class="email-address">${escapeHtml(email)}</span>
      </a>`;

export function renderContact(copy, email) {
  return `
  <section class="page-hero page-hero--plain" aria-labelledby="contact-heading">
    <div class="shell contact">
      <p class="eyebrow">${escapeHtml(copy.eyebrow)}</p>
      <h1 id="contact-heading">${escapeHtml(copy.heading)}</h1>
      <p class="lede">${escapeHtml(copy.intro)}</p>
      ${emailCard(copy.email_label, email)}
    </div>
  </section>
  <section class="band band--tint" aria-labelledby="enquiries-heading">
    <div class="shell">
      <header class="band-head" data-reveal><h2 id="enquiries-heading">${escapeHtml(copy.enquiries_heading)}</h2></header>
      ${cardGrid(copy.enquiries, item => `<h3><a href="${escapeHtml(item.url || mailto(email, item.title))}">${escapeHtml(item.title)}</a></h3>
          <p>${escapeHtml(item.text)}</p>
          <span class="arrow-link" aria-hidden="true">${escapeHtml(item.link || copy.enquiry_link)}</span>`)}
      <p class="contact-note">${escapeHtml(copy.note)}</p>
    </div>
  </section>`;
}

// Partner With Us: the ways to work with the publication, the standards every partnership meets, and how to start.
export function renderPartner(copy, email) {
  return `
  <section class="hero hero--compact" aria-labelledby="partner-heading">
    <div class="shell hero-copy hero-copy--wide">
      <p class="eyebrow">${escapeHtml(copy.eyebrow)}</p>
      <h1 id="partner-heading">${escapeHtml(copy.heading)}</h1>
      ${paragraphs(copy.intro)}
      <div class="cta-row"><a class="button button--light" href="${escapeHtml(mailto(email, copy.subject))}">${escapeHtml(copy.cta)}</a></div>
    </div>
  </section>

  <section class="band band--tint" aria-labelledby="options-heading">
    <div class="shell">
      <header class="band-head" data-reveal><h2 id="options-heading">${escapeHtml(copy.options_heading)}</h2><p>${escapeHtml(copy.options_intro)}</p></header>
      ${cardGrid(copy.options, item => `<h3><a href="${escapeHtml(mailto(email, item.title))}">${escapeHtml(item.title)}</a></h3>
          <p>${escapeHtml(item.text)}</p>
          <span class="arrow-link" aria-hidden="true">${escapeHtml(copy.option_link)}</span>`)}
    </div>
  </section>

  <div class="shell rows rows--single">
    <section class="row" data-reveal aria-labelledby="standards-heading">
      <div class="row-head"><h2 id="standards-heading">${escapeHtml(copy.standards_heading)}</h2></div>
      <div class="row-body">
        ${paragraphs(copy.standards_intro)}
        <dl class="standards">${copy.standards.map(item => `<div><dt>${escapeHtml(item.title)}</dt><dd>${escapeHtml(item.text)}</dd></div>`).join('')}</dl>
      </div>
    </section>
  </div>

  <section class="band band--dark" aria-labelledby="start-heading">
    <div class="shell statement" data-reveal>
      <h2 id="start-heading">${escapeHtml(copy.start_heading)}</h2>
      <div class="statement-copy">
        ${paragraphs(copy.start_copy)}
        <ul class="tick-list tick-list--dark">${copy.start_list.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        ${emailCard(copy.email_label, email, copy.subject)}
      </div>
    </div>
  </section>`;
}
