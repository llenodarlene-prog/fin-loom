// Hub-and-spoke silo rules (SEO, AEO & GEO Site SOP, step 4). Only body links count: category hubs,
// menus, and the Resources list carry no topical context. Rules apply to posts that are live today, so a
// scheduled spoke is not required until its publish date, and the pillar must link it from that day on.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { readContent } from './lib/content.mjs';
import { publicationState, publishDate } from './lib/schedule.mjs';

const walk = async dir => (await Promise.all((await readdir(dir, { withFileTypes: true })).map(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]))).flat();
const today = publishDate();
const plan = JSON.parse(await readFile('data/supplementary-content-plan.json', 'utf8'));
const silos = new Map(plan.links.map(item => [item.url_slug, item]));
const failures = [];
const fail = message => failures.push(message);
const linkPattern = /(?<!!)\[[^\]]+\]\((\/[^)#?\s]+\/?)(?:#[^)]+)?\)/g;

const posts = [];
for (const file of (await walk('content/posts')).filter(item => item.endsWith('.md'))) {
  const { metadata, body } = await readContent(file);
  if (publicationState(metadata, today) !== 'live') continue;
  const silo = silos.get(metadata.slug);
  if (!silo) continue;
  const contextual = body.split(/^##\s+Resources\s*$/m)[0];
  posts.push({ file, slug: metadata.slug, silo, links: new Set([...contextual.matchAll(linkPattern)].map(match => match[1])) });
}
const live = new Set(posts.map(post => post.slug));
for (const post of posts) {
  const { silo } = post;
  if (!['Hub', 'Supporting', 'Bridge', 'Commercial Support'].includes(silo.silo_role)) fail(`${post.file}: silo_role must be Hub, Supporting, Bridge, or Commercial Support`);
  if (!silo.pillar || silo.pillar.split('/')[1] !== post.slug.split('/')[1]) fail(`${post.file}: pillar must sit in the same silo folder`);
  const postLinks = [...post.links].filter(href => silos.has(href));
  if (silo.silo_role === 'Hub') {
    if (silo.pillar !== post.slug) fail(`${post.file}: a Hub is its own silo's pillar`);
    for (const spoke of posts.filter(item => item !== post && item.silo.pillar === post.slug)) if (!post.links.has(spoke.slug)) fail(`${post.file}: pillar must link in its body to live spoke ${spoke.slug}`);
  } else {
    if (live.has(silo.pillar) && !post.links.has(silo.pillar)) fail(`${post.file}: spoke must link in its body to its pillar ${silo.pillar}`);
    if (postLinks.length < 2 || postLinks.length > 3) fail(`${post.file}: spokes carry 2 to 3 internal post links; found ${postLinks.length}`);
  }
  const inbound = posts.filter(item => item !== post && item.links.has(post.slug)).length;
  if (inbound < 2) fail(`${post.file}: needs body links from at least 2 other live posts; found ${inbound}`);
}
for (const pillar of new Set(posts.map(post => post.silo.pillar))) if (!posts.some(post => post.slug === pillar && post.silo.silo_role === 'Hub')) fail(`pillar ${pillar} is not a live Hub post`);
if (failures.length) { console.error(failures.map(message => `ERROR: ${message}`).join('\n')); process.exit(1); }
console.log(`Silo checks passed for ${posts.length} live posts across ${new Set(posts.map(post => post.silo.pillar)).size} pillars.`);
