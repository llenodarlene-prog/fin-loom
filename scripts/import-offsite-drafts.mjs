import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Imports off-site placement articles as review drafts. These are written for other publications and
// link back to Fin Loom. They are never Fin Loom content: each stays `draft: true`, so it is shown on
// staging for review and is excluded from every production build, listing, sitemap, and feed.
// Usage: node scripts/import-offsite-drafts.mjs  (reads the owner's local working folder)
const root = 'FinLoom Files/03 Blogs';
const items = [
  { site: 'Use The Bitcoin', folder: 'For Use the Bitcoin Backlink', file: '01_crypto_airdrop_risk.md', slug: 'crypto-airdrop-risk', images: { 'assets/crypto_scam_inflows_chainalysis.png': '/assets/images/offsite/crypto-scam-inflows-chainalysis.png' } },
  { site: 'Stoxcraft', folder: 'For Stoxcraft Backlink', file: '06_crypto_vs_stocks.md', slug: 'crypto-vs-stocks-risk-reward-comparison', images: {} }
];
const siteSlug = name => name.toLowerCase().replaceAll(' ', '-');
await mkdir('content/offsite', { recursive: true });
for (const item of items) {
  const raw = (await readFile(path.join(root, item.folder, item.file), 'utf8')).replace(/\r\n/g, '\n');
  const field = name => raw.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1].trim() || '';
  const start = raw.search(/^# \S/m);
  if (start < 0) throw new Error(`${item.file}: no H1 found`);
  let body = raw.slice(start).replace(/<!--[\s\S]*?-->/g, '').trim();
  const title = body.match(/^# (.+)$/m)[1].trim();
  const finloomLinks = [...body.matchAll(/\]\(https:\/\/finloom\.org(\/[^)]*)\)/g)].map(match => match[1]);
  if (finloomLinks.length !== 1) throw new Error(`${item.file}: expected exactly one Fin Loom link, found ${finloomLinks.length}`);
  // On Fin Loom's own staging site the backlink is an internal link.
  body = body.replace(/\]\(https:\/\/finloom\.org(\/[^)]*)\)/g, ']($1)');
  for (const [from, to] of Object.entries(item.images)) {
    if (!body.includes(`(${from})`)) throw new Error(`${item.file}: image ${from} not found`);
    body = body.replaceAll(`(${from})`, `(${to})`);
  }
  const notice = `> **Off-Site Draft**\n> Written for publication on ${item.site}, with one link back to Fin Loom (${finloomLinks[0]}). It is shown here for review only and is not Fin Loom content. Its figures have not had their publication-day recheck.`;
  body = body.replace(/^(# .+)$/m, `$1\n\n${notice}`);
  const metadata = {
    title, seo_title: field('SEO Title'), description: field('Meta Description'), slug: `/offsite-drafts/${siteSlug(item.site)}/${item.slug}/`,
    type: 'offsite', schema: 'WebPage', draft: true, target_site: item.site, target_slug: field('Slug') || 'not stated in the source file',
    primary_keyword: field('Primary Keyword'), finloom_link: finloomLinks[0], source_file: `${root}/${item.folder}/${item.file}`
  };
  for (const key of ['seo_title', 'description', 'primary_keyword']) if (!metadata[key]) throw new Error(`${item.file}: missing ${key}`);
  const target = `content/offsite/${siteSlug(item.site)}-${item.slug}.md`;
  await writeFile(target, ['---', ...Object.entries(metadata).map(([key, value]) => `${key}: ${value}`), '---', '', body, ''].join('\n'));
  console.log(`${target}: ${body.split(/\s+/).length} words, links to ${finloomLinks[0]}`);
}
