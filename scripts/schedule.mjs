import { appendFile, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { readContent } from './lib/content.mjs';
import { publicationState, publishDate } from './lib/schedule.mjs';

// Publishing scheduler.
//   npm run schedule          lists every post with its planned slot and state on PUBLISH_DATE (default: today, UTC)
//   npm run schedule -- due   reports whether any approved post goes live on that day; the scheduled
//                             workflow uses it to decide whether to start a production deploy.
// A slot comes from `scheduled_publish` in the content plan. Approval is `draft: false` with `published`
// set to that slot, merged to main after QA. Production still deploys only through its approval gate.
const mode = process.argv[2] || 'list';
if (!['list', 'due'].includes(mode)) { console.error('usage: node scripts/schedule.mjs [list|due]'); process.exit(2); }
const today = publishDate();
const readJson = async file => JSON.parse(await readFile(file, 'utf8'));
const plans = [...await readJson('data/launch-content-plan.json'), ...(await readJson('data/supplementary-content-plan.json').catch(() => ({ records: [] }))).records];
const files = (await readdir('content/posts')).filter(file => file.endsWith('.md')).sort();
const rows = [], problems = [];
for (const name of files) {
  const file = path.join('content/posts', name);
  const { metadata } = await readContent(file);
  const plan = plans.find(item => `${item.type}:${item.content_number}` === metadata.tracker_id);
  const slot = String(plan?.scheduled_publish || '').trim();
  const published = String(metadata.published || '').trim();
  const state = publicationState(metadata, today);
  if (state !== 'draft' && slot && published > today && published !== slot) problems.push(`${file}: published ${published} differs from its scheduled slot ${slot}`);
  if (state === 'draft' && slot && slot <= today) problems.push(`${file}: slot ${slot} has arrived but the post is still a draft (not approved)`);
  rows.push({ id: metadata.tracker_id, slot: slot || '-', published: published || '-', state, slug: metadata.slug });
}
rows.sort((a, b) => a.slot.localeCompare(b.slot) || a.id.localeCompare(b.id));
const goingLive = rows.filter(row => row.state === 'live' && row.published === today);

if (mode === 'due') {
  const due = goingLive.length > 0;
  console.log(due ? `${goingLive.length} post(s) go live on ${today}: ${goingLive.map(row => row.slug).join(', ')}` : `Nothing goes live on ${today}.`);
  for (const message of problems) console.log(`WARNING: ${message}`);
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `due=${due}\n`);
} else {
  console.log(`Publishing schedule as of ${today} (UTC)\n`);
  const widths = ['id', 'slot', 'published', 'state'].map(key => Math.max(key.length, ...rows.map(row => row[key].length)));
  const line = values => values.map((value, i) => value.padEnd(widths[i] ?? 0)).join('  ');
  console.log(line(['id', 'slot', 'published', 'state', 'slug']));
  for (const row of rows) console.log(line([row.id, row.slot, row.published, row.state, row.slug]));
  for (const message of problems) console.log(`\nWARNING: ${message}`);
}
