import { readFile } from 'node:fs/promises';

const base = String(process.env.SMOKE_URL || '').replace(/\/$/, '');
if (!/^https:\/\//.test(base)) throw new Error('SMOKE_URL must be HTTPS');
const site = JSON.parse(await readFile('data/site.json', 'utf8'));
const expectedBrand = String(process.env.SMOKE_BRAND || site.name);
const expectedRobots = String(process.env.SMOKE_EXPECT_ROBOTS || 'noindex');
// Canonicals always point at the approved production domain in data/site.json, including on staging.
const canonicalBase = String(process.env.SMOKE_CANONICAL_URL || site.url).replace(/\/$/, '');
if (expectedRobots === 'noindex' && base === canonicalBase) throw new Error('refusing a noindex smoke test against the production domain');
const home = await fetch(`${base}/`);
if (!home.ok) throw new Error(`/: HTTP ${home.status}`);
const html = await home.text();
if (expectedBrand && !html.includes(expectedBrand)) throw new Error('/: expected brand name not found');
if (!html.includes(`<link rel="canonical" href="${canonicalBase}/">`)) throw new Error('/: canonical mismatch');
if (!html.includes(`<meta name="robots" content="${expectedRobots}`)) throw new Error(`/: expected ${expectedRobots} robots directive`);
if (expectedRobots === 'noindex' && !/noindex/i.test(home.headers.get('x-robots-tag') || '')) throw new Error('/: X-Robots-Tag noindex header is missing');
for (const route of ['/robots.txt', '/sitemap.xml']) {
  const response = await fetch(`${base}${route}`);
  if (!response.ok) throw new Error(`${route}: HTTP ${response.status}`);
  const text = await response.text();
  if (route === '/sitemap.xml') {
    if (!text.includes('<urlset')) throw new Error('/sitemap.xml: not a sitemap');
    if (base !== canonicalBase && text.includes(`<loc>${base}/`)) throw new Error('/sitemap.xml: lists non-canonical URLs');
    // Only an indexable production build is required to list the home page; drafts never appear in a sitemap.
    if (expectedRobots === 'index' && !text.includes(`<loc>${canonicalBase}/</loc>`)) throw new Error('/sitemap.xml: canonical home URL not found');
  }
}
const missing = await fetch(`${base}/__smoke-test-missing-page__`);
if (missing.status !== 404) throw new Error(`/404 behavior: expected HTTP 404, received ${missing.status}`);
console.log(`Smoke test passed for ${base}`);
