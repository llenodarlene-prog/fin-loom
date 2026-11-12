import assert from 'node:assert/strict';
import test from 'node:test';
import { publicationState, publishClock, publishDate, wentLiveThisHour } from '../scripts/lib/schedule.mjs';

test('publish_time keeps a post scheduled until that UTC time on its date', () => {
  const post = { draft: false, published: '2026-11-12', publish_time: '15:00' };
  assert.equal(publicationState(post, '2026-11-12', '14:59'), 'scheduled');
  assert.equal(publicationState(post, '2026-11-12', '15:00'), 'live');
  assert.equal(publicationState(post, '2026-11-13', '00:00'), 'live');
  assert.equal(publicationState({ draft: false, published: '2026-11-12' }, '2026-11-12', '00:00'), 'live');
  assert.throws(() => publicationState({ draft: false, published: '2026-11-12', publish_time: '3pm' }, '2026-11-12', '12:00'), /HH:MM/);
});

test('publish clock defaults to UTC time and to end of day for a date preview', () => {
  assert.equal(publishClock({}, new Date('2026-11-12T14:05:00Z')), '14:05');
  assert.equal(publishClock({ PUBLISH_DATE: '2026-11-12' }), '23:59');
  assert.equal(publishClock({ PUBLISH_DATE: '2026-11-12', PUBLISH_TIME: '05:00' }), '05:00');
  assert.throws(() => publishClock({ PUBLISH_TIME: '25:00' }), /HH:MM/);
});

test('an hourly run deploys each timed post once', () => {
  const post = { draft: false, published: '2026-11-12', publish_time: '10:00' };
  assert.equal(wentLiveThisHour(post, '2026-11-12', '09:05'), false);
  assert.equal(wentLiveThisHour(post, '2026-11-12', '10:05'), true);
  assert.equal(wentLiveThisHour(post, '2026-11-12', '11:05'), false);
  assert.equal(wentLiveThisHour({ draft: false, published: '2026-11-12' }, '2026-11-12', '00:07'), true);
  assert.equal(wentLiveThisHour({ draft: false, published: '2026-11-12' }, '2026-11-12', '01:07'), false);
});

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
