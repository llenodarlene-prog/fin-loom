import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const e = tools['mortgage-payoff'];
const start = { year: 2026, month: 10 };
const base = { balance: 300000, apr: 6, termYears: 30, termMonths: 0, payment: 1798.65, extra: 0, lump: 0, lumpMonth: 12 };
const finite = r => [r.base.interest, r.fast.interest, r.interestSaved, ...r.fast.balances, ...r.base.balances].every(Number.isFinite);

test('scheduled payment matches the standard amortization formula', () => {
  assert.equal(e.scheduledPayment(300000, 6, 360).toFixed(2), '1798.65');
  assert.equal(e.scheduledPayment(200000, 4.5, 180).toFixed(2), '1529.99');
  assert.equal(e.scheduledPayment(120000, 0, 120), 1000);
});

test('the scheduled payment pays off on schedule and extra payments shorten the loan', () => {
  let r = e.payoff(base, start);
  assert.equal(r.base.months, 360); assert.equal(r.saved, 0);
  assert.equal(e.dateLabel(r.baseDate), 'October 2056');
  // Total interest = payments - principal (360 x 1,798.65 - 300,000, plus the final cents).
  assert.ok(Math.abs(r.base.interest - (360 * 1798.65 - 300000)) < 2);
  r = e.payoff({ ...base, extra: 300 }, start);
  // n = -ln(1 - rP/A) / ln(1 + r) = 251.5, so the 252nd payment clears it.
  assert.equal(r.fast.months, 252); assert.equal(r.saved, 108);
  assert.equal(e.span(r.saved), '9 years'); assert.equal(e.dateLabel(r.fastDate), 'October 2047');
  assert.ok(r.interestSaved > 119000 && r.interestSaved < 120500);
  assert.ok(Math.abs(r.fast.years.reduce((sum, y) => sum + y.principal, 0) - 300000) < 0.01);
  assert.equal(r.fast.years[r.fast.years.length - 1].end, 0);
  assert.ok(finite(r));
});

test('one-time payments, zero rates, short terms, and bad payments are handled', () => {
  const lump = e.payoff({ ...base, lump: 20000, lumpMonth: 1 }, start);
  assert.ok(lump.saved > 0 && lump.interestSaved > 0);
  const zero = e.payoff({ balance: 12000, apr: 0, termYears: 1, termMonths: 0, payment: 1000, extra: 500, lump: 0, lumpMonth: 1 }, start);
  assert.equal(zero.base.months, 12); assert.equal(zero.fast.months, 8); assert.equal(zero.fast.interest, 0);
  const short = e.payoff({ balance: 1000, apr: 6, termYears: 0, termMonths: 1, payment: 1005, extra: 0, lump: 0, lumpMonth: 1 }, start);
  assert.equal(short.base.months, 1);
  assert.match(e.checkPayment({ ...base, payment: 1500 }), /does not cover the first month's interest of \$1,500\.00/);
  assert.equal(e.checkPayment(base), '');
  assert.equal(e.amortize({ balance: 300000, apr: 6, payment: 1000 }).ok, false);
  const longer = e.payoff({ ...base, payment: 1700 }, start);
  assert.ok(longer.base.months > 360); assert.match(e.warnings({ ...base, payment: 1700 }, longer)[0], /longer than the remaining term of 30 years/);
  assert.match(e.summary({ ...base, extra: 300 }, e.payoff({ ...base, extra: 300 }, start)), /^Under these assumptions, adding \$300\.00 extra a month could pay off the mortgage in October 2047 instead of October 2056, 9 years sooner/);
  assert.equal(e.span(13), '1 year 1 month'); assert.equal(e.span(0), '0 months');
});
