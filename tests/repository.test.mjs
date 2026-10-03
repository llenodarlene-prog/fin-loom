import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async file => JSON.parse(await readFile(file, 'utf8'));
test('tracker counts and hashes are stable', async () => {
  const [site, plan, launch, links, provenance] = await Promise.all([
    readJson('data/site.json'), readJson('data/content-plan.json'), readJson('data/launch-content-plan.json'),
    readJson('data/interlinking-plan.json'), readJson('data/tracker-provenance.json')
  ]);
  assert.equal(plan.length, 100); assert.equal(launch.length, 20); assert.equal(links.length, 20);
  assert.equal(site.tracker_sha256, provenance.sha256);
});

test('public domain and brand identity are complete', async () => {
  const site = await readJson('data/site.json');
  assert.match(site.url, /^https:\/\/[a-z0-9.-]+$/); assert.ok(site.name); assert.ok(site.tagline);
  assert.ok(site.fonts.display); assert.ok(site.fonts.body); assert.match(site.theme.ink, /^#[0-9A-F]{6}$/i);
});

test('every market series is an unedited official download with a named source', async () => {
  const market = await readJson('data/market-data.json');
  assert.ok(Object.keys(market).length >= 3);
  for (const [key, series] of Object.entries(market)) {
    for (const field of ['id', 'title', 'units', 'frequency', 'agency', 'release', 'retrieved']) assert.ok(series[field], `${key}: ${field}`);
    assert.equal(series.source_url, `https://fred.stlouisfed.org/series/${series.id}`);
    assert.match(series.retrieved, /^\d{4}-\d{2}-\d{2}$/);
    // Each stored point must appear exactly in the raw file it came from.
    const raw = new Map((await readFile(series.raw_file, 'utf8')).trim().split(/\r?\n/).slice(1).map(line => line.split(',')));
    for (const [date, value] of series.points) assert.equal(Number(raw.get(date)), value, `${key} ${date}`);
    assert.ok(series.points.at(-1)[0] <= series.retrieved, `${key}: latest observation is after the retrieval date`);
  }
});

test('designed pages show only sourced data or labeled illustrations', async () => {
  const { buildCharts } = await import('../scripts/lib/illustrations.mjs');
  const charts = buildCharts(await readJson('data/market-data.json'));
  for (const [id, chart] of Object.entries(charts)) {
    assert.ok(['data', 'illustration'].includes(chart.kind), id);
    if (chart.kind === 'data') assert.match(chart.footnote, /Source:.*fred\.stlouisfed\.org\/series\/.*Latest figure:/s, id);
    else assert.match(chart.footnote, /Assumptions:.*not a forecast/s, id);
  }
  const [home, hubs] = await Promise.all([readJson('data/home-page.json'), readJson('data/hub-pages.json')]);
  for (const id of [home.hero.chart, ...home.context.charts, ...Object.values(hubs.hubs).flatMap(hub => hub.chart_band?.charts || [])]) assert.ok(charts[id], id);
});
