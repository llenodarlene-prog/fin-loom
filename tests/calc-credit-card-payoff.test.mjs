import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const e = tools['credit-card-payoff'];
const base = { balance: 5000, apr: 24, minimum: 200, extra: 0, rule: 'fixed', percent: 1, floor: 25 };
const finite = r => [r.months, r.interest, r.paid, ...r.balances].every(Number.isFinite);

test('credit card payoff matches the closed-form amortization', () => {
  // $5,000 at 2% a month with $200 payments: n = ln(200 / (200 - 100)) / ln(1.02) = 35.003, so 35 full
  // payments and a small 36th.
  const r = e.payoff(base);
  assert.equal(r.months, 36);
  assert.ok(Math.abs(r.paid - 7000.56) < 0.01);
  assert.ok(Math.abs(r.interest - (r.paid - 5000)) < 1e-6);
  assert.equal(r.balances[r.balances.length - 1], 0);
  // Year rows add up to the totals.
  assert.ok(Math.abs(r.years.reduce((sum, row) => sum + row.interest, 0) - r.interest) < 1e-6);
  assert.equal(r.years.length, 3);
});

test('zero APR, extra payments, and the comparison cards', () => {
  const zero = e.payoff({ ...base, apr: 0 });
  assert.equal(zero.months, 25); assert.equal(zero.interest, 0); assert.equal(zero.paid, 5000);
  const d = { ...base, minimum: 150, extra: 100 };
  const withExtra = e.payoff(d); const minOnly = e.payoff(d, 0);
  assert.equal(withExtra.months, 26); assert.equal(minOnly.months, 56);
  assert.ok(withExtra.interest < minOnly.interest);
  const cards = e.compare(d);
  assert.equal(cards.map(c => c.name).join(), 'Minimum only,+$50/month,+$100/month,Custom');
  assert.ok(cards[1].r.months < cards[0].r.months && cards[2].r.months < cards[1].r.months);
  assert.equal(cards[0].saved, 0);
});

test('payments that do not cover interest, the 600-month cap, and the percent rule', () => {
  // 2% of $5,000 is $100 of interest; a $100 payment never reduces the balance.
  const never = e.payoff({ ...base, minimum: 100 });
  assert.ok(never.never && !never.done); assert.equal(never.months, 0);
  assert.equal(e.outputs(base, never, never, { year: 2026, month: 10 }).big, 'Not paid off');
  assert.equal(e.summary(base, never, never, { year: 2026, month: 10 }), e.NEVER);
  // A large balance with a barely sufficient payment hits the cap.
  const capped = e.payoff({ ...base, balance: 1e7, apr: 12, minimum: 100001 });
  assert.ok(capped.capped && capped.months === e.CAP && finite(capped));
  // Percent of balance plus interest with a $25 floor always pays down and finishes.
  const pct = e.payoff({ ...base, rule: 'percent', percent: 1, floor: 25 });
  assert.ok(pct.done && finite(pct)); assert.ok(pct.months > 36);
});

test('payoff dates, spans, summary, and markup', () => {
  assert.equal(e.payoffDate({ year: 2026, month: 10 }, 26), 'December 2028');
  assert.equal(e.payoffDate({ year: 2026, month: 10 }, 3), 'January 2027');
  assert.equal(e.span(26), '2 years, 2 months'); assert.equal(e.span(12), '1 year'); assert.equal(e.span(1), '1 month');
  const d = { ...base, minimum: 150, extra: 100 };
  assert.match(e.summary(d, e.payoff(d), e.payoff(d, 0), { year: 2026, month: 10 }), /^Under these assumptions, paying \$100\.00 extra a month could clear a \$5,000\.00 balance in 2 years, 2 months, around December 2028/);
  const html = e.chart(d).svg + e.cards(d) + e.tableRows(e.payoff(d));
  assert.ok(!/NaN|Infinity|undefined/.test(html));
});
