import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('GA4 is configured for production only with a valid measurement ID', async () => {
  const config = JSON.parse(await readFile('data/analytics.json', 'utf8'));
  assert.match(config.google_tag_id, /^GTM-[A-Z0-9]{6,10}$/);
  assert.match(config.ga4_measurement_id, /^G-[A-Z0-9]{6,12}$/);
  assert.deepEqual(config.environments, ['production']);
  const base = await readFile('src/layouts/base.html', 'utf8');
  assert.ok(base.includes('<head>\n  {{ANALYTICS}}'), 'Google tag sits immediately after <head>');
});
