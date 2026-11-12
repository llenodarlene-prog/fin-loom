// Publication schedule. A post is live in production only when it is not a draft and its `published`
// date has arrived. The date is a calendar day in UTC, the same clock GitHub's scheduled workflow uses.
// An optional `publish_time` (HH:MM, UTC) spreads posts through the day: on its publication date the post
// stays scheduled until that time. Without it, a post goes live at the start of its date.
// PUBLISH_DATE (YYYY-MM-DD) overrides "today" so a build can be previewed for a given day; PUBLISH_TIME
// (HH:MM) overrides the clock. A PUBLISH_DATE preview without PUBLISH_TIME shows the end of that day.
const dateOnly = /^\d{4}-\d{2}-\d{2}$/;
const clockOnly = /^([01]\d|2[0-3]):[0-5]\d$/;

export function publishDate(env = process.env, now = new Date()) {
  const override = String(env.PUBLISH_DATE || '').trim();
  if (override) {
    if (!dateOnly.test(override) || new Date(`${override}T00:00:00Z`).toISOString().slice(0, 10) !== override) throw new Error(`PUBLISH_DATE must be a real YYYY-MM-DD date, got "${override}"`);
    return override;
  }
  return now.toISOString().slice(0, 10);
}

export function publishClock(env = process.env, now = new Date()) {
  const override = String(env.PUBLISH_TIME || '').trim();
  if (override) {
    if (!clockOnly.test(override)) throw new Error(`PUBLISH_TIME must be HH:MM (UTC), got "${override}"`);
    return override;
  }
  if (String(env.PUBLISH_DATE || '').trim()) return '23:59';
  return now.toISOString().slice(11, 16);
}

export function publishTime(metadata) {
  const value = String(metadata.publish_time || '').trim();
  if (!value) return '';
  if (!clockOnly.test(value)) throw new Error(`publish_time must be HH:MM (UTC), got "${value}"`);
  return value;
}

// "draft" is not approved, "scheduled" is approved and waiting for its date and time, "live" is published.
export function publicationState(metadata, today, clock = publishClock()) {
  if (metadata.draft === true) return 'draft';
  const published = String(metadata.published || '').trim();
  if (!dateOnly.test(published)) return 'live';
  if (published > today) return 'scheduled';
  if (published === today && publishTime(metadata) > clock) return 'scheduled';
  return 'live';
}

// True when a post went live in the hour before `clock` on `today`, so an hourly job deploys it once.
export function wentLiveThisHour(metadata, today, clock) {
  if (publicationState(metadata, today, clock) !== 'live' || String(metadata.published || '').trim() !== today) return false;
  const minutes = value => Number(value.slice(0, 2)) * 60 + Number(value.slice(3, 5));
  return minutes(publishTime(metadata) || '00:00') > minutes(clock) - 60;
}
