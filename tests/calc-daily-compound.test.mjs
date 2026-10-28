import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const e = tools['daily-compound'];
const base = { balance: 10000, rate: 5, days: 365, periods: 365, contribution: 0, contributionFrequency: 'none' };
const run = o => e.compound({ ...base, ...o });
const close = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} vs ${b}`);
const formula = (p, rate, n, days) => p * Math.pow(1 + rate / 100 / n, n * days / 365);

test('daily compound engine matches A = P(1 + r/n)^(nt) with t = days / 365', () => {
  close(run({}).end, formula(10000, 5, 365, 365));
  assert.equal(run({}).end.toFixed(2), '10512.67');
  assert.equal(run({ periods: 12 }).end.toFixed(2), '10511.62');
  assert.equal(run({ periods: 1 }).end.toFixed(2), '10500.00');
  for (const [n, days] of [[365, 100], [12, 45], [4, 1000], [1, 7]]) close(run({ periods: n, days }).end, formula(10000, 5, n, days));
  close(run({}).effectiveYield, Math.pow(1 + 0.05 / 365, 365) - 1);
  assert.equal(run({ periods: 1 }).effectiveYield.toFixed(6), '0.050000');
  close(run({}).dailyStart, 10000 * (Math.pow(1 + 0.05 / 365, 1) - 1));
  assert.ok(run({}).dailyEnd > run({}).dailyStart);
});

test('contributions add on schedule and grow from their deposit day', () => {
  const monthly = run({ contribution: 100, contributionFrequency: 'monthly' });
  assert.equal(monthly.contributions, 1200);
  close(monthly.end, monthly.contributions + monthly.interest + 10000);
  // Hand check: each month-end deposit grows for the days left in the year.
  const growth = Math.pow(1 + 0.05 / 365, 1);
  let expected = formula(10000, 5, 365, 365);
  for (let day = 1; day <= 365; day += 1) if (e.isContributionDay(day, 'monthly')) expected += 100 * Math.pow(growth, 365 - day);
  close(monthly.end, expected);
  assert.equal(run({ contribution: 10, contributionFrequency: 'daily' }).contributions, 3650);
  assert.equal(run({ contribution: 10, contributionFrequency: 'weekly' }).contributions, 520);
  assert.equal(run({ contribution: 100, contributionFrequency: 'none' }).contributions, 0);
});

test('QA cases: zero inputs, maximums, decimals, long horizons, and comparison', () => {
  const zero = run({ balance: 0 });
  assert.equal(zero.end, 0); assert.equal(zero.interest, 0);
  const flat = run({ rate: 0, contribution: 50, contributionFrequency: 'weekly' });
  assert.equal(flat.interest, 0); assert.equal(flat.end, 10000 + 52 * 50);
  close(run({ balance: 1234.56, rate: 3.75, days: 90 }).end, formula(1234.56, 3.75, 365, 90));
  const long = run({ days: 36500, contribution: 100, contributionFrequency: 'monthly' });
  assert.ok(Number.isFinite(long.end) && !long.tooLarge && long.balances.length === 36501);
  const extreme = run({ balance: 1e9, rate: 100, days: 36500, contribution: 1e7, contributionFrequency: 'daily' });
  assert.ok(extreme.tooLarge); assert.deepEqual(e.warnings(extreme).length, 1);
  const rows = e.compare(base);
  assert.equal(rows.map(row => row.periods).join(), '365,12,1');
  assert.ok(rows[0].result.end > rows[1].result.end && rows[1].result.end > rows[2].result.end);
  assert.equal(e.breakdown(run({ days: 20 })).length, 20);
  assert.equal(e.breakdown(run({ days: 365 })).length, 12);
  assert.equal(e.breakdown(run({ days: 3650 })).length, 10);
  const last = e.breakdown(run({ days: 400 })).pop();
  assert.equal(last.endDay, 400);
  assert.match(e.summary(run({})), /^Under these assumptions, \$10,000\.00 at a 5\.00% rate compounded daily could grow to \$10,512\.67 after 365 days, including an estimated \$512\.67 of interest\.$/);
  assert.ok(!/NaN|Infinity|undefined/.test(e.tableRows(run({ balance: 0, rate: 0 })) + e.compareCards(run({ balance: 0 })) + e.chart(run({ balance: 0, days: 1 })).svg));
});
