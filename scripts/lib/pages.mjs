import { escapeHtml, inline } from './content.mjs';
import { renderHeroCard, renderLab } from './illustrations.mjs';
import { icon } from './icons.mjs';

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
  // The featured image links to the post; the title link carries the accessible name, so the image link is hidden from assistive tech.
  const small = String(post.image || '').replace(/-1600.(jpg|png|webp)$/, '-800.$1');
  const media = post.image ? `<a class="post-card-media" href="${escapeHtml(post.slug)}" tabindex="-1" aria-hidden="true"><img src="${escapeHtml(small)}" srcset="${escapeHtml(small)} 800w, ${escapeHtml(post.image)} 1600w" sizes="${size === 'lead' ? '(max-width: 900px) 100vw, 50vw' : '(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw'}" width="800" height="450" alt="${escapeHtml(post.image_alt || post.title)}" loading="lazy" decoding="async"></a>` : '';
  return `<article class="post-card post-card--${size}${media ? ' post-card--media' : ''}">
    ${media}<div class="post-card-body">
    <p class="meta">${label ? `<span>${escapeHtml(label)}</span>` : ''}${date ? `<time datetime="${escapeHtml(date)}">${escapeHtml(formatDate(date))}</time>` : ''}</p>
    <h3><a href="${escapeHtml(post.slug)}">${escapeHtml(post.title)}</a></h3>
    <p>${escapeHtml(post.description)}</p>
    </div>
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

// Author profile: compact hero with portrait and topics, the bio beside an at-a-glance card, then the author's live posts.
export function renderAuthor(copy, posts, nav) {
  const { photo: image } = copy;
  return `
  <section class="hero hero--compact author-hero" aria-labelledby="author-heading">
    <div class="shell author-hero-grid">
      <img class="author-photo" src="${escapeHtml(image.src)}" width="${image.width}" height="${image.height}" alt="${escapeHtml(image.alt)}" fetchpriority="high" decoding="async">
      <div class="hero-copy">
        <p class="eyebrow">${escapeHtml(copy.role)}</p>
        <h1 id="author-heading">${escapeHtml(copy.name)}</h1>
        <p>${inline(copy.intro)}</p>
        <ul class="author-topics" aria-label="Topics">${copy.topics.map(topic => `<li>${escapeHtml(topic)}</li>`).join('')}</ul>
        <div class="cta-row"><a class="button button--light" href="${escapeHtml(mailto(copy.email, copy.email_subject))}">${escapeHtml(copy.email_label)}</a></div>
      </div>
    </div>
  </section>

  <section class="band band--tint" aria-labelledby="author-bio">
    <div class="shell author-body">
      <div class="author-bio" data-reveal>
        <h2 id="author-bio">${escapeHtml(copy.bio_heading)}</h2>
        ${paragraphs(copy.bio)}
        <h3>${escapeHtml(copy.contact_heading)}</h3>
        <p>${inline(copy.contact_copy)}</p>
      </div>
      <aside class="author-facts" aria-label="At a glance" data-reveal>
        <dl>${copy.facts.map(fact => `<div><dt>${escapeHtml(fact.label)}</dt><dd>${escapeHtml(fact.value)}</dd></div>`).join('')}</dl>
      </aside>
    </div>
  </section>
${posts.length ? `
  <section class="band" aria-labelledby="author-posts">
    <div class="shell">
      <header class="band-head" data-reveal><h2 id="author-posts">${escapeHtml(copy.posts_heading)}</h2></header>
      <div class="post-grid">${posts.slice(0, copy.posts_limit || 6).map(post => postCard(post, nav)).join('')}</div>
    </div>
  </section>` : ''}`;
}

// Tools hub: icon cards grouped by category, with a search box and category filter chips.
export function renderTools(copy) {
  const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const total = copy.categories.reduce((n, c) => n + c.tools.length, 0);
  return `
  <section class="hero hero--compact tools-hero" aria-labelledby="tools-heading">
    <div class="shell hero-copy hero-copy--wide">
      <p class="eyebrow">${icon('calculator')} ${escapeHtml(copy.eyebrow)}</p>
      <h1 id="tools-heading">${escapeHtml(copy.heading)}</h1>
      ${paragraphs(copy.intro)}
    </div>
  </section>
  <section class="band band--tint" data-tools-hub aria-label="Calculator directory">
    <div class="shell">
      <div class="tools-controls">
        <label class="tools-search"><span class="sr-only">${escapeHtml(copy.search_label)}</span>${icon('search')}<input type="search" placeholder="${escapeHtml(copy.search_label)}" data-tools-search autocomplete="off"></label>
        <div class="tools-filters" role="group" aria-label="Filter by category">
          <button type="button" class="tools-chip" aria-pressed="true" data-filter="all">${icon('adjustments-horizontal')}All <span>${total}</span></button>
          ${copy.categories.map(c => `<button type="button" class="tools-chip" aria-pressed="false" data-filter="${slug(c.name)}">${icon(c.icon)}${escapeHtml(c.name)} <span>${c.tools.length}</span></button>`).join('')}
        </div>
        <p class="tools-count" data-tools-count aria-live="polite">${total} calculators</p>
      </div>
      ${copy.categories.map(c => `<div class="tools-group" data-group="${slug(c.name)}">
        <h2 class="tools-group-title">${icon(c.icon)}${escapeHtml(c.name)}</h2>
        <ul class="tools-grid">${c.tools.map(t => `<li class="tools-card" data-tool data-search="${escapeHtml(`${t.title} ${t.text} ${c.name}`.toLowerCase())}">
          <a href="${escapeHtml(t.url)}"><span class="tools-card-icon">${icon(t.icon)}</span><span class="tools-card-body"><strong>${escapeHtml(t.title)}</strong><span>${escapeHtml(t.text)}</span></span><span class="tools-card-go" aria-hidden="true">${icon('arrow-up-right')}</span></a>
        </li>`).join('')}</ul>
      </div>`).join('')}
      <p class="tools-empty" data-tools-empty hidden>No calculators match that search.</p>
    </div>
  </section>
  <div class="shell rows rows--single"><section class="row" aria-labelledby="tools-how"><div class="row-head"><h2 id="tools-how">${escapeHtml(copy.how_heading)}</h2></div><div class="row-body">${paragraphs(copy.how)}</div></section></div>`;
}

// FAQ hub: popular questions, a search box, topic chips, and accordion answers whose text stays in
// the HTML. Answer blocks are paragraphs (inline Markdown), { list: [...] }, or { table: { head, rows } }.
const faqBlock = block => {
  if (typeof block === 'string') return `<p>${inline(block)}</p>`;
  if (block.list) return `<ul class="faq-list">${block.list.map(item => `<li>${inline(item)}</li>`).join('')}</ul>`;
  if (block.table) return `<div class="table-wrap"><table class="faq-table"><thead><tr>${block.table.head.map(h => `<th scope="col">${escapeHtml(h)}</th>`).join('')}</tr></thead><tbody>${block.table.rows.map(row => `<tr>${row.map((cell, i) => i === 0 ? `<th scope="row">${escapeHtml(cell)}</th>` : `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  return '';
};
export const faqPlainAnswer = q => q.a.map(block => typeof block === 'string' ? block : block.list ? block.list.join(' ') : block.table.rows.map(row => row.join(': ')).join('; ')).join(' ').replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

export function renderFaq(copy) {
  const all = copy.topics.flatMap(topic => topic.questions.map(q => ({ ...q, topic })));
  const byId = Object.fromEntries(all.map(q => [q.id, q]));
  const updated = new Date(`${copy.updated}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  return `
  <section class="hero hero--compact faq-hero" aria-labelledby="faq-heading">
    <div class="shell hero-copy hero-copy--wide">
      <p class="eyebrow">${icon('help-circle')} ${escapeHtml(copy.eyebrow)}</p>
      <h1 id="faq-heading">${escapeHtml(copy.heading)}</h1>
      ${paragraphs(copy.intro)}
      <p class="faq-meta">${icon('calendar')} Updated ${escapeHtml(updated)} <span aria-hidden="true">·</span> ${icon('user-check')} Reviewed by ${escapeHtml(copy.reviewer)} <span aria-hidden="true">·</span> ${all.length} questions</p>
    </div>
  </section>
  <section class="band band--tint" data-faq-hub aria-label="Questions and answers">
    <div class="shell faq-shell">
      <div class="faq-popular" aria-labelledby="faq-popular-title">
        <h2 id="faq-popular-title" class="faq-section-title">${icon('flame')} Popular Questions</h2>
        <ul class="faq-popular-list">${copy.popular.map(id => `<li><a href="#${id}" data-faq-jump="${id}">${icon('arrow-up-right')}<span>${escapeHtml(byId[id].q)}</span></a></li>`).join('')}</ul>
      </div>
      <div class="tools-controls faq-controls">
        <label class="tools-search"><span class="sr-only">${escapeHtml(copy.search_label)}</span>${icon('search')}<input type="search" placeholder="${escapeHtml(copy.search_label)}" data-faq-search autocomplete="off"></label>
        <div class="tools-filters" role="group" aria-label="Filter by topic">
          <button type="button" class="tools-chip" aria-pressed="true" data-faq-filter="all">${icon('adjustments-horizontal')}All <span>${all.length}</span></button>
          ${copy.topics.map(t => `<button type="button" class="tools-chip" aria-pressed="false" data-faq-filter="${t.id}">${icon(t.icon)}${escapeHtml(t.name)} <span>${t.questions.length}</span></button>`).join('')}
        </div>
        <p class="tools-count" data-faq-count aria-live="polite">${all.length} questions</p>
      </div>
      ${copy.topics.map(t => `<div class="faq-topic" data-faq-topic="${t.id}" id="${t.id}">
        <h2 class="faq-topic-title"><span class="faq-topic-icon">${icon(t.icon)}</span><span>${escapeHtml(t.name)}</span></h2>
        <p class="faq-topic-intro">${escapeHtml(t.intro)}</p>
        ${t.questions.map(q => `<details class="faq-item" id="${q.id}" data-faq-q data-search="${escapeHtml(`${q.q} ${faqPlainAnswer(q)}`.toLowerCase())}">
          <summary><h3>${escapeHtml(q.q)}</h3><span class="faq-chevron" aria-hidden="true">${icon('chevron-down')}</span></summary>
          <div class="faq-answer">${q.a.map(faqBlock).join('')}</div>
        </details>`).join('')}
      </div>`).join('')}
      <p class="tools-empty" data-faq-empty hidden>No questions match that search. Try a shorter word.</p>
    </div>
  </section>
  <section class="band" aria-labelledby="faq-tools">
    <div class="shell">
      <h2 id="faq-tools" class="faq-section-title">${icon('calculator')} Related Calculators</h2>
      <ul class="tools-grid faq-tools-grid">${copy.tools.map(t => `<li class="tools-card"><a href="${escapeHtml(t.url)}"><span class="tools-card-icon">${icon(t.icon)}</span><span class="tools-card-body"><strong>${escapeHtml(t.title)}</strong></span><span class="tools-card-go" aria-hidden="true">${icon('arrow-up-right')}</span></a></li>`).join('')}</ul>
      <h2 class="faq-section-title faq-sources-title">${icon('book')} Sources</h2>
      <ul class="faq-sources">${copy.sources.map(([title, url]) => `<li><a href="${escapeHtml(url)}" rel="noopener">${escapeHtml(title)}</a></li>`).join('')}</ul>
    </div>
  </section>`;
}
