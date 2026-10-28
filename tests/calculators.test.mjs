import test from 'node:test';
import assert from 'node:assert/strict';
import { engine } from '../scripts/lib/calculators.mjs';
const pct = value => Math.round(value * 100000) / 1000;

test('APY engine matches the brief test cases', () => {
  assert.equal(pct(engine.apy(4, 1)), 4);
  assert.equal(pct(engine.apy(4, 12)), 4.074);
  assert.equal(pct(engine.apy(4, 365)), 4.081);
  assert.equal(pct(engine.apy(5, 12)), 5.116);
  assert.equal(pct(engine.apy(0, 12)), 0);
  const growth = engine.apyGrowth(4, 12, 10000, 3);
  assert.equal(growth.rows.length, 3);
  assert.equal(Number(growth.rows[0].end.toFixed(2)), 10407.42);
  assert.ok(Number.isFinite(growth.end));
});

test('savings engine uses the effective monthly rate, never APY / 12', () => {
  const oneYear = engine.savingsGrowth(10000, 5, 0, 1, 'end');
  assert.equal(Number(oneYear.end.toFixed(2)), 10500);
  const fiveYears = engine.savingsGrowth(10000, 5, 500, 5, 'end');
  assert.equal(Number(fiveYears.end.toFixed(2)), 46669.68);
  assert.equal(fiveYears.contributions, 30000);
  assert.equal(Number(fiveYears.rows.at(-1).end.toFixed(2)), Number(fiveYears.end.toFixed(2)));
  assert.ok(engine.savingsGrowth(10000, 5, 500, 5, 'start').end > fiveYears.end);
  const zero = engine.savingsGrowth(0, 0, 0, 1, 'end');
  assert.equal(zero.end, 0); assert.equal(zero.interestShare, 0);
});

test('validation rejects out-of-range and non-numeric input', () => {
  assert.equal(engine.validate('rate', 4), '');
  assert.ok(engine.validate('rate', 101));
  assert.ok(engine.validate('years', 0));
  assert.ok(engine.validate('balance', NaN));
  assert.equal(engine.validate('contribution', 0), '');
});

test('dividend reinvestment engine passes the development brief test cases', () => {
  const base = { shares: 100, price: 50, dividend: 0, frequency: 4, dividendGrowth: 0, priceGrowth: 0, years: 10, monthly: 0, timing: 'end', reinvest: true };
  const run = o => engine.dripGrowth({ ...base, ...o });
  const finite = r => r.rows.every(row => Object.values(row).every(Number.isFinite));
  // 1. No dividend, no growth.
  let r = run({});
  assert.equal(r.shares, 100); assert.equal(r.end, 5000); assert.equal(r.dividends, 0);
  // 2. No reinvestment: dividends are kept as cash and counted in the combined value.
  r = run({ dividend: 0.5, years: 1, reinvest: false });
  assert.equal(r.dividends, 200); assert.equal(r.shares, 100); assert.equal(r.stockValue, 5000); assert.equal(r.end, 5200);
  // 3. Reinvestment at a constant price compounds past 104 shares.
  const reinvested = run({ dividend: 0.5, years: 1 });
  assert.ok(reinvested.shares > 104);
  // 4. Monthly contributions only.
  r = run({ shares: 0, years: 1, monthly: 100 });
  assert.equal(r.contributions, 1200); assert.ok(Math.abs(r.shares - 24) < 1e-9);
  // 5. Negative price growth stays finite.
  r = run({ dividend: 0.5, priceGrowth: -10, years: 30, monthly: 50 });
  assert.ok(finite(r)); assert.ok(r.endPrice < 50);
  // 6. Dividend cuts decline each year and never go below zero.
  r = run({ dividend: 0.5, dividendGrowth: -20, years: 5 });
  const perShare = r.rows.map(row => row.dividendPerShare);
  assert.ok(perShare.every((d, i) => i === 0 || d < perShare[i - 1])); assert.ok(perShare.every(d => d >= 0));
  assert.equal(run({ dividend: 0.5, dividendGrowth: -100, years: 3 }).rows[2].dividendPerShare, 0);
  // 7. Zero starting shares are valid with a contribution.
  assert.ok(run({ shares: 0, monthly: 200, dividend: 0.5 }).shares > 0);
  // 8. A 50-year projection runs quickly.
  const t = Date.now(); r = run({ dividend: 0.5, dividendGrowth: 3, priceGrowth: 4, years: 50, monthly: 500, frequency: 12 });
  assert.ok(Date.now() - t < 100); assert.equal(r.rows.length, 50); assert.ok(finite(r));
  // 9. The reinvestment toggle changes shares, income, and value.
  const off = run({ dividend: 0.5, years: 1, reinvest: false });
  assert.ok(reinvested.shares > off.shares && reinvested.income > off.income && reinvested.end !== off.end);
  // 10. Fractional shares are kept at full precision: $25 at $80 buys 0.3125 shares.
  r = engine.dripGrowth({ shares: 50, price: 80, dividend: 0.5, frequency: 1, dividendGrowth: 0, priceGrowth: 0, years: 1, monthly: 0, timing: 'end', reinvest: true });
  assert.equal(r.shares - 50, 0.3125);
  // Price falling to zero stops purchases, holds cash, and never produces Infinity.
  r = run({ dividend: 0.5, priceGrowth: -100, years: 2, monthly: 10 });
  assert.ok(r.priceZero && finite(r)); assert.equal(r.endPrice, 0);
  // Monthly price growth uses the equivalent monthly rate: 12 months of 4% lands on exactly 4%.
  assert.ok(Math.abs(run({ priceGrowth: 4, years: 1 }).endPrice - 52) < 1e-9);
  // Beginning-of-month contributions earn the dividend sooner than end-of-month ones.
  assert.ok(run({ shares: 0, dividend: 0.5, monthly: 100, timing: 'start', years: 1 }).shares > run({ shares: 0, dividend: 0.5, monthly: 100, years: 1 }).shares);
  // Unrealistic projections are flagged.
  assert.ok(run({ priceGrowth: 100, years: 50, monthly: 1000000, shares: 100000000, price: 1000000 }).tooLarge);
  assert.match(engine.dripSummary(base, run({ dividend: 0.5 })), /^Under these assumptions, your 100 starting shares could grow to [\d,.]+ shares over 10 years, producing an estimated annual dividend income of \$[\d,.]+\.$/);
  assert.equal(engine.dividendMonths(4).join(), "3,6,9,12"); assert.equal(engine.dividendMonths(2).join(), "6,12");
});
