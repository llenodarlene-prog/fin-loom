// Publication schedule. A post is live in production only when it is not a draft and its `published`
// date has arrived. The date is a calendar day in UTC, the same clock GitHub's scheduled workflow uses.
// PUBLISH_DATE (YYYY-MM-DD) overrides "today" so a build can be previewed for a given day.
const dateOnly = /^\d{4}-\d{2}-\d{2}$/;

export function publishDate(env = process.env, now = new Date()) {
  const override = String(env.PUBLISH_DATE || '').trim();
  if (override) {
    if (!dateOnly.test(override) || new Date(`${override}T00:00:00Z`).toISOString().slice(0, 10) !== override) throw new Error(`PUBLISH_DATE must be a real YYYY-MM-DD date, got "${override}"`);
    return override;
  }
  return now.toISOString().slice(0, 10);
}

// "draft" is not approved, "scheduled" is approved and waiting for its date, "live" is published.
export function publicationState(metadata, today) {
  if (metadata.draft === true) return 'draft';
  const published = String(metadata.published || '').trim();
  return dateOnly.test(published) && published > today ? 'scheduled' : 'live';
}
