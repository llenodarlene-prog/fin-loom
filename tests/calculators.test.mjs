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

test('dividend reinvestment engine matches the worked example and models cash, growth, and contributions', () => {
  const base = { shares: 100, price: 50, dividend: 0.5, frequency: 4, dividendGrowth: 0, priceGrowth: 0, years: 5, monthly: 0, reinvest: true };
  const r = engine.dripGrowth(base);
  assert.equal(r.shares.toFixed(3), '122.019');
  assert.equal(r.end.toFixed(2), '6100.95');
  assert.equal(r.income.toFixed(2), '244.04');
  assert.equal(r.rows.length, 5);
  const cash = engine.dripGrowth({ ...base, reinvest: false });
  assert.equal(cash.shares, 100);
  assert.equal(cash.end.toFixed(2), '6000.00');
  assert.ok(engine.dripGrowth({ ...base, dividendGrowth: 4 }).income > r.income);
  assert.ok(engine.dripGrowth({ ...base, dividendGrowth: -50 }).income < r.income);
  assert.equal(engine.dripGrowth({ ...base, monthly: 100 }).contributions, 6000);
  assert.equal(engine.validate('price', 0), 'Enter a value from 0.01 to 1,000,000.');
});
