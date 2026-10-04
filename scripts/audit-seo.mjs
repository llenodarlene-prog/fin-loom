import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// Reports the SEO elements and image hygiene of every built page. Read-only: it prints a table and
// exits non-zero when a page or image misses a requirement. Run after `npm run build`.
const dist = 'dist';
const site = JSON.parse(await readFile('data/site.json', 'utf8'));
const assets = JSON.parse(await readFile('data/assets.json', 'utf8'));
async function walk(dir) { const entries = await readdir(dir, { withFileTypes: true }); return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]))).flat(); }
const pick = (html, pattern) => html.match(pattern)?.[1] ?? '';
const problems = [];
const rows = [];
const genericName = /(^|\/)(img|image|photo|picture|screenshot|untitled|chatgpt|dsc|pxl)[-_ ]?\d*[^/]*$|\s|[A-Z]|%20/;
for (const file of (await walk(dist)).filter(item => item.endsWith('.html')).sort()) {
  const html = await readFile(file, 'utf8');
  const rel = path.relative(dist, file).replaceAll(path.sep, '/');
  const route = rel === 'index.html' ? '/' : `/${rel.replace(/index\.html$/, '')}`;
  const fail = message => problems.push(`${route}: ${message}`);
  const title = pick(html, /<title>([^<]*)<\/title>/), description = pick(html, /<meta name="description" content="([^"]*)">/);
  const canonical = pick(html, /<link rel="canonical" href="([^"]*)">/);
  const schema = JSON.parse(pick(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/) || '{}');
  const types = (schema['@graph'] || [schema]).map(item => item['@type']).filter(Boolean);
  const isPost = types.some(type => ['Article', 'BlogPosting'].includes(type));
  if (!title) fail('missing title'); else if (title.replace(/&amp;/g, '&').length > 70) fail(`title is ${title.length} characters`);
  if (description.length < 40 || description.length > 180) fail(`meta description is ${description.length} characters`);
  if (canonical !== `${site.url}${route}`) fail(`canonical is ${canonical}`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail('needs exactly one h1');
  for (const [name, pattern] of Object.entries({ 'og:title': /property="og:title" content="[^"]+"/, 'og:description': /property="og:description" content="[^"]+"/, 'og:url': /property="og:url" content="[^"]+"/, 'og:type': /property="og:type" content="[^"]+"/, 'og:site_name': /property="og:site_name" content="[^"]+"/, 'og:image': /property="og:image" content="[^"]+"/, 'twitter:card': /name="twitter:card" content="[^"]+"/, 'twitter:title': /name="twitter:title" content="[^"]+"/, 'html lang': /<html lang="[a-zA-Z-]+"/, viewport: /name="viewport"/, robots: /name="robots" content="[^"]+"/ })) if (!pattern.test(html)) fail(`missing ${name}`);
  if (!types.length) fail('missing structured data');
  if (isPost) {
    if (!types.includes('BreadcrumbList')) fail('post is missing BreadcrumbList structured data');
    if (!/<nav class="breadcrumb"/.test(html)) fail('post is missing the visible breadcrumb');
    if (!/class="post-featured"/.test(html)) fail('post has no hero image');
    const article = (schema['@graph'] || []).find(item => ['Article', 'BlogPosting'].includes(item['@type']));
    if (!article?.image) fail('post structured data has no image');
    if (/## Frequently Asked Questions|<h2>Frequently Asked Questions<\/h2>/.test(html) && !types.includes('FAQPage')) fail('post has an FAQ section but no FAQPage structured data');
  }
  let images = 0;
  for (const tag of html.match(/<img\b[^>]*>/g) || []) {
    images += 1;
    const src = pick(tag, /\ssrc="([^"]*)"/), alt = pick(tag, /\salt="([^"]*)"/);
    if (alt.trim().length < 3) fail(`image ${src} has no descriptive alt text`);
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) fail(`image ${src} has no width and height`);
    if (genericName.test(src.replace(/^\/assets\//, ''))) fail(`image ${src} does not have a descriptive lowercase hyphenated file name`);
    if (src.startsWith('/assets/') && !assets.some(item => item.path === src)) fail(`image ${src} is not registered in data/assets.json`);
  }
  rows.push({ route, title: title.replace(/&amp;/g, '&').length, description: description.length, schema: types.join('+'), images });
}
for (const asset of assets) {
  if (genericName.test(asset.path.replace(/^\/assets\//, ''))) problems.push(`asset ${asset.path}: file name is not descriptive, lowercase, and hyphenated`);
  if (!asset.alt_guidance || asset.alt_guidance.trim().length < 3) problems.push(`asset ${asset.path}: missing alt guidance`);
}
console.log('route | title chars | description chars | structured data | images');
for (const row of rows) console.log(`${row.route} | ${row.title} | ${row.description} | ${row.schema} | ${row.images}`);
console.log(`\nAudited ${rows.length} pages and ${assets.length} registered images.`);
if (problems.length) { console.error(`\n${problems.length} problem(s):\n${problems.map(item => `- ${item}`).join('\n')}`); process.exit(1); }
console.log('Every page has a title, meta description, canonical, Open Graph and Twitter tags, structured data, and one h1. Every image has a descriptive file name, alt text, and dimensions.');
