import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createResearchScaffold } from './lib/workflow.mjs';

// Imports the owner's supplementary blog posts from the local working folder as drafts and applies the
// mechanical part of the editing pass. A post that already exists in content/posts is left untouched,
// so hand-finished posts are never overwritten. Nothing here publishes: every post stays draft: true
// until its research record is verified and it passes `npm run check:content`.
const root = 'FinLoom Files/03 Blogs';
const folders = { 'For Use the Bitcoin Backlink': 'Use The Bitcoin', 'For Stoxcraft Backlink': 'Stoxcraft', 'For Webtribunal Backlink': 'WebTribunal' };
const sections = { '/money-banking/': 'Money & Banking', '/investing/': 'Investing', '/markets-stocks/': 'Markets & Stocks', '/fintech/': 'Fintech', '/payments/': 'Payments', '/crypto/': 'Crypto & Digital Assets' };
// Owner's schedule of 2026-10-04: seven posts that day, eight the next. A plan, not a publication record.
const schedule = number => number <= 7 ? '2026-10-04' : '2026-10-05';
const small = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'via', 'vs', 'with']);
const isBullet = line => /^[-*]\s+/.test(line);

// Fragment bullet lists ("- spreads;") are folded into the sentence that introduces them. Every item is kept.
function foldFragmentLists(text) {
  const lines = text.split('\n'), out = [];
  const resourcesAt = lines.findIndex(line => /^##\s+Resources\s*$/.test(line));
  let folded = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!isBullet(lines[i]) || (resourcesAt >= 0 && i > resourcesAt)) { out.push(lines[i]); continue; }
    let j = i; while (j < lines.length && isBullet(lines[j])) j++;
    const items = lines.slice(i, j);
    if (items.some(item => /^[-*]\s+\*\*[^*]+\*\*/.test(item))) { out.push(...items); i = j - 1; continue; }
    let k = out.length - 1; while (k >= 0 && !out[k].trim()) k--;
    const intro = k >= 0 ? out[k] : '';
    let conjunction = 'and';
    const clean = items.map(item => item.replace(/^[-*]\s+/, '').trim().replace(/[;.?]$/, '').trim());
    const parts = clean.map((item, n) => {
      const lead = item.match(/^(and|or)\s+(.*)$/i);
      if (lead) { if (n === clean.length - 1) conjunction = lead[1].toLowerCase(); return lead[2]; }
      const tail = item.match(/^(.*?);?\s+(and|or)$/i);
      if (tail) { if (n === clean.length - 2) conjunction = tail[2].toLowerCase(); return tail[1]; }
      return item;
    });
    const separator = parts.some(part => part.includes(',')) ? '; ' : ', ';
    const lower = item => /^[A-Z][a-z]+\b/.test(item) && !/^(I|Bitcoin|Ethereum|SEC|FTC|FBI|FDIC|DeFi|ETF|DAO|NFT|AI|PayPal|Venmo|Google|Alphabet|Amazon|Apple|Microsoft|Meta|YouTube|AWS|Uniswap|U\.S\.)\b/.test(item) ? item[0].toLowerCase() + item.slice(1) : item;
    const listed = parts.map(lower);
    const joined = listed.length === 1 ? listed[0] : listed.length === 2 ? `${listed[0]} ${conjunction} ${listed[1]}` : `${listed.slice(0, -1).join(separator)}${separator}${conjunction} ${listed.at(-1)}`;
    if (/:$/.test(intro) && !/^#|^\|/.test(intro)) {
      const stem = intro.replace(/:$/, '');
      const flows = /\b(include|includes|including|are|is|by|because|when|if|through|from|as|on|about|whether|for|with|of|to|that|like|consider|check|compare|ask|review|see|be|may|can|could|should|means|covers|cover|involves|involve|requires|require|shows|show|has|have|was|were|than|into|at|in|confirm|define|examine|monitor|track)$/i.test(stem);
      out[k] = flows ? `${stem} ${joined}.` : `${stem}: ${joined}.`;
      while (out.length && !out.at(-1).trim()) out.pop();
    } else out.push(`${joined[0].toUpperCase()}${joined.slice(1)}.`);
    folded += items.length; i = j - 1;
  }
  return { text: out.join('\n').replace(/\n{3,}/g, '\n\n'), folded };
}

// Standard order: main sections, then a closing section if one exists, then FAQ, then Resources.
function reorder(text) {
  const parts = text.split(/\n(?=## )/), head = parts.shift();
  const take = pattern => { const i = parts.findIndex(part => pattern.test(part)); return i < 0 ? null : parts.splice(i, 1)[0].trim(); };
  const faq = take(/^## Frequently Asked Questions\b/), resources = take(/^## Resources\b/);
  const closing = take(/^## (Final Perspective|The Bottom Line|Bottom Line|Final Takeaway|Conclusion)\b/);
  return [head.trim(), ...parts.map(part => part.trim()), closing, faq, resources].filter(Boolean).join('\n\n');
}

const existing = new Set((await readdir('content/posts')).filter(name => name.endsWith('.md')).map(name => name.match(/^blog-s(\d+)-/)?.[1]).filter(Boolean));
const plan = JSON.parse(await readFile('data/supplementary-content-plan.json', 'utf8'));
await mkdir('content/research', { recursive: true });
const summary = [];
for (const [folder, site] of Object.entries(folders)) {
  for (const name of (await readdir(path.join(root, folder))).filter(file => /^\d{2}_.+\.md$/.test(file) && !file.startsWith('00_')).sort()) {
    const number = Number(name.slice(0, 2)), id = `S${number}`;
    const record = plan.records.find(item => item.content_number === id);
    if (record) record.scheduled_publish = schedule(number);
    if (existing.has(String(number))) { summary.push(`${id}: already in content/posts, left untouched`); continue; }
    const raw = (await readFile(path.join(root, folder, name), 'utf8')).replace(/\r\n/g, '\n');
    const field = label => raw.match(new RegExp(`^${label}:\\s*(.+)$`, 'm'))?.[1].trim() || '';
    const start = raw.search(/^# \S/m);
    if (start < 0) throw new Error(`${name}: no H1 found`);
    let body = raw.slice(start).replace(/<!--[\s\S]*?-->/g, '').trim();
    const links = [...body.matchAll(/\]\(https:\/\/finloom\.org(\/[^)]*)\)/g)].map(match => match[1]);
    if (links.length !== 1 || !sections[links[0]]) throw new Error(`${name}: expected one link to a Fin Loom section, found ${links.join(', ') || 'none'}`);
    body = body.replace(/\]\(https:\/\/finloom\.org(\/[^)]*)\)/g, ']($1)');
    // Supplied chart images are not used. Charts are redrawn from verified data in data/charts.json.
    const removedImages = (body.match(/^!\[[^\]]*\]\([^)]*\)\s*$/gm) || []).length;
    body = body.replace(/^!\[[^\]]*\]\([^)]*\)\s*$\n?/gm, '').replace(/^\*Chart note: (.+)\*\s*$/gm, '$1');
    body = reorder(body);
    const { text, folded } = foldFragmentLists(body);
    body = text
      .replace(/^- \*\*([^*]+):\*\*/gm, (match, lead) => `- **${lead.split(' ').map((word, i) => i > 0 && small.has(word.toLowerCase()) ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1)).join(' ')}:**`)
      .replace(/^(## Key Takeaways)\n\n(- \*\*)/m, '$1\n\nThe main points are summarized below.\n\n$2')
      .replace(/^(## Frequently Asked Questions)\n\n(### )/m, '$1\n\nShort answers to the questions readers ask most often.\n\n$2')
      .replace(/^- ([^\[\n][^\n]*?):? (https?:\/\/\S+)$/gm, (match, label, url) => `- [${label.replace(/[“”"]/g, '').replace(/[,:]\s*$/, '').trim()}](${url})`);
    const title = body.match(/^# (.+)$/m)[1].trim();
    const leaf = (field('Slug').split('/').filter(Boolean).at(-1) || name.slice(3, -3).replaceAll('_', '-')).toLowerCase();
    const slug = `${links[0]}${leaf}/`;
    const words = body.replace(/[#*_`>\[\]()|]/g, ' ').trim().split(/\s+/).length;
    const entry = { type: 'Blog', content_number: id, working_title: title, primary_keyword: field('Primary Keyword'), secondary_keywords: field('Secondary Keywords').replaceAll(',', ';'), cluster: sections[links[0]], intent: 'Informational',
      status: 'Ready for Source Verification', url_slug: slug, seo_title: field('SEO Title'), meta_description: field('Meta Description'), max_words: Math.ceil(words / 100) * 100 + 100,
      link_placement_site: site, source_file: `${root}/${folder}/${name}`, scheduled_publish: schedule(number) };
    for (const key of ['primary_keyword', 'seo_title', 'meta_description']) if (!entry[key]) throw new Error(`${name}: missing ${key}`);
    const silo = { type: 'Blog', content_number: id, url_slug: slug, primary_silo_hub: links[0], approved_outbound_targets: [links[0]] };
    plan.records.push(entry); plan.links.push(silo);
    const research = `content/research/blog-${id.toLowerCase()}.json`;
    const metadata = { title, seo_title: entry.seo_title, description: entry.meta_description, slug, type: 'blog', schema: 'BlogPosting', draft: true, tracker_id: `Blog:${id}`, primary_keyword: entry.primary_keyword,
      secondary_keywords: entry.secondary_keywords, cluster: entry.cluster, approved_internal_links: links[0], research_record: research, link_placement_site: site, charts_pending: removedImages,
      ai_exceptions: '', ai_exception_reason: '', author: '', published: '', modified: '' };
    await writeFile(`content/posts/blog-s${number}-${leaf}.md`, ['---', ...Object.entries(metadata).map(([key, value]) => `${key}: ${value}`), '---', '', body, ''].join('\n'));
    await writeFile(research, JSON.stringify(createResearchScaffold(entry, silo, metadata), null, 2) + '\n');
    summary.push(`${id}: ${slug} | ${words} words | folded ${folded} bullets | ${removedImages} supplied chart image(s) removed | scheduled ${entry.scheduled_publish}`);
  }
}
plan.records.sort((a, b) => Number(a.content_number.slice(1)) - Number(b.content_number.slice(1)));
plan.links.sort((a, b) => Number(a.content_number.slice(1)) - Number(b.content_number.slice(1)));
await writeFile('data/supplementary-content-plan.json', JSON.stringify(plan, null, 2) + '\n');
console.log(summary.join('\n'));
