import assert from 'node:assert/strict';
import test from 'node:test';
import { publicationState, publishDate } from '../scripts/lib/schedule.mjs';

test('a post is live only when approved and its publication date has arrived', () => {
  assert.equal(publicationState({ draft: true, published: '2026-10-01' }, '2026-10-12'), 'draft');
  assert.equal(publicationState({ draft: false, published: '2026-10-13' }, '2026-10-12'), 'scheduled');
  assert.equal(publicationState({ draft: false, published: '2026-10-12' }, '2026-10-12'), 'live');
  assert.equal(publicationState({ draft: false, published: '2026-10-04' }, '2026-10-12'), 'live');
});

test('publish date defaults to the UTC day and accepts only real override dates', () => {
  assert.equal(publishDate({}, new Date('2026-10-12T23:30:00Z')), '2026-10-12');
  assert.equal(publishDate({ PUBLISH_DATE: '2026-10-13' }), '2026-10-13');
  assert.throws(() => publishDate({ PUBLISH_DATE: '2026-02-30' }), /real YYYY-MM-DD/);
  assert.throws(() => publishDate({ PUBLISH_DATE: 'tomorrow' }), /real YYYY-MM-DD/);
});
