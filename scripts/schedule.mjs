import { appendFile, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { readContent } from './lib/content.mjs';
import { publicationState, publishClock, publishDate, publishTime, wentLiveThisHour } from './lib/schedule.mjs';

// Publishing scheduler.
//   npm run schedule          lists every post with its planned slot and state on PUBLISH_DATE (default: today, UTC)
//   npm run schedule -- due   reports whether any approved post goes live on that day; the scheduled
//                             workflow uses it to decide whether to start a production deploy.
// A slot comes from `scheduled_publish` in the content plan. Approval is `draft: false` with `published`
// set to that slot, merged to main after QA. Production still deploys only through its approval gate.
const mode = process.argv[2] || 'list';
if (!['list', 'due'].includes(mode)) { console.error('usage: node scripts/schedule.mjs [list|due]'); process.exit(2); }
const today = publishDate();
const clock = publishClock();
const readJson = async file => JSON.parse(await readFile(file, 'utf8'));
const plans = [...await readJson('data/launch-content-plan.json'), ...(await readJson('data/supplementary-content-plan.json').catch(() => ({ records: [] }))).records];
// Posts and dated pages (tools scheduled with a `published` date) both count toward a deploy.
const pageFiles = (await readdir('content/pages')).filter(file => file.endsWith('.md')).map(file => path.join('content/pages', file));
const files = [...(await readdir('content/posts')).filter(file => file.endsWith('.md')).map(file => path.join('content/posts', file)), ...pageFiles].sort();
const rows = [], problems = [];
for (const file of files) {
  const { metadata } = await readContent(file);
  if (file.startsWith('content/pages') && !/^\d{4}-\d{2}-\d{2}$/.test(String(metadata.published || '').trim())) continue;
  const plan = plans.find(item => `${item.type}:${item.content_number}` === metadata.tracker_id);
  const slot = String(plan?.scheduled_publish || '').trim();
  const published = String(metadata.published || '').trim();
  const state = publicationState(metadata, today, clock);
  if (state !== 'draft' && slot && published > today && published !== slot) problems.push(`${file}: published ${published} differs from its scheduled slot ${slot}`);
  if (state === 'draft' && slot && slot <= today) problems.push(`${file}: slot ${slot} has arrived but the post is still a draft (not approved)`);
  rows.push({ id: metadata.tracker_id || `Page:${metadata.slug}`, slot: slot || '-', published: published ? `${published}${publishTime(metadata) ? ' ' + publishTime(metadata) : ''}` : '-', state, slug: metadata.slug, due: wentLiveThisHour(metadata, today, clock) });
}
rows.sort((a, b) => a.slot.localeCompare(b.slot) || a.id.localeCompare(b.id));
const goingLive = rows.filter(row => row.due);

if (mode === 'due') {
  const due = goingLive.length > 0;
  console.log(due ? `${goingLive.length} post(s) went live by ${today} ${clock} UTC: ${goingLive.map(row => row.slug).join(', ')}` : `Nothing went live in the hour before ${today} ${clock} UTC.`);
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
