import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);

test('dca: price path, shares and average cost', () => {
  const e = tools.dca;
  const o = { amount: 500, periods: 12, start: 100, dip: 20, end: 100 };
  const prices = e.path(o);
  near(prices[0], 100); near(prices[5], 80); near(prices[11], 100);
  const r = e.dca(o);
  const shares = prices.reduce((s, p) => s + 500 / p, 0);
  near(r.shares, shares); near(r.invested, 6000); near(r.avgCost, 6000 / shares); near(r.lumpValue, 6000);
  assert.ok(r.value > r.lumpValue, 'buying through a dip that recovers beats the lump sum here');
  const flat = e.dca({ amount: 100, periods: 4, start: 50, dip: 0, end: 50 });
  near(flat.diff, 0); near(flat.avgCost, 50);
  assert.equal(e.check({ amount: 0, periods: 1.5, start: 1, dip: 99, end: 1 }).periods, 'Enter a whole number.');
});

test('expense ratio: zero fees match the annuity formula and higher fees cost more', () => {
  const e = tools['expense-ratio'];
  const none = e.grow({ start: 0, monthly: 100, years: 1, rate: 0 }, 0);
  near(none.balance, 1200); near(none.fees, 0);
  const g = Math.pow(1.07, 1 / 12) - 1;
  let b = 1000; for (let m = 0; m < 12; m += 1) { b = b * (1 + g) * (1 - 0.01 / 12); }
  near(e.grow({ start: 1000, monthly: 0, years: 1, rate: 7 }, 1).balance, b);
  const r = e.compare({ start: 10000, monthly: 300, years: 30, rate: 7, feeA: 0.03, feeB: 0.75 });
  assert.ok(r.gap > 0 && r.b.fees > r.a.fees);
  assert.ok(r.gap > r.feeGap, 'the balance gap includes lost growth on fees');
});

test('401(k) match: formula, unclaimed match and 2026 limit', () => {
  const e = tools['401k-match'];
  const r = e.match({ salary: 75000, contrib: 4, match: 50, cap: 6, over50: false });
  near(r.yours, 3000); near(r.employer, 1500); near(r.fullMatch, 2250); near(r.missed, 750);
  const full = e.match({ salary: 75000, contrib: 10, match: 50, cap: 6, over50: false });
  near(full.employer, 2250); near(full.missed, 0);
  const high = e.match({ salary: 400000, contrib: 10, match: 100, cap: 3, over50: false });
  assert.equal(high.capped, true); near(high.yours, 24500); near(high.employer, 12000);
  near(e.match({ salary: 400000, contrib: 10, match: 0, cap: 0, over50: true }).yours, 32500);
});

test('roth vs traditional: equal tax rates give equal results', () => {
  const e = tools['roth-traditional'];
  const r = e.compare({ amount: 7000, years: 30, rate: 6, nowTax: 22, retireTax: 12 });
  near(r.tradBalance, 7000 * (Math.pow(1.06, 30) - 1) / 0.06); near(r.tradAfterTax, r.tradBalance * 0.88);
  near(r.rothAfterTax, 5460 * (Math.pow(1.06, 30) - 1) / 0.06);
  assert.ok(r.diff < 0);
  near(e.compare({ amount: 5000, years: 20, rate: 5, nowTax: 24, retireTax: 24 }).diff, 0);
  near(e.fvFactor(10, 0), 10);
  assert.equal(e.compare({ amount: 9000, years: 1, rate: 0, nowTax: 0, retireTax: 0 }).overLimit, true);
});

test('cd interest: maturity, early withdrawal and validation', () => {
  const e = tools['cd-interest'];
  const r = e.cd({ deposit: 10000, apy: 4, term: 12, penalty: 3, early: 0 });
  near(r.interest, 400); near(r.maturity, 10400); assert.equal(r.early, false);
  const early = e.cd({ deposit: 10000, apy: 4, term: 12, penalty: 3, early: 6 });
  near(early.earnedEarly, 10000 * (Math.sqrt(1.04) - 1)); near(early.penaltyCost, 10000 * (Math.pow(1.04, 0.25) - 1));
  const loss = e.cd({ deposit: 10000, apy: 4, term: 24, penalty: 6, early: 1 });
  assert.ok(loss.earlyNet < 0);
  assert.match(e.check({ deposit: 1, apy: 1, term: 12, penalty: 3, early: 12 }).early, /before the end/);
  assert.ok(Object.values(e.outputs(r)).every(v => !/NaN|Infinity|undefined/.test(v)));
});
