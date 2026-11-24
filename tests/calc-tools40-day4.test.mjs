import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);

test('mortgage: PITI with PMI under 20% down', () => {
  const r = tools.mortgage.calc({ price: 400000, down: 10, rate: 6.5, years: 30, tax: 1.1, insurance: 1800, hoa: 0, pmi: 0.5 });
  near(r.pi, 2275.44, 0.01); near(r.pmiM, 150); near(r.total, 2942.11, 0.01);
  assert.equal(tools.mortgage.calc({ price: 400000, down: 20, rate: 6.5, years: 30, tax: 0, insurance: 0, hoa: 0, pmi: 0.5 }).pmiM, 0);
});

test('home affordability: price reproduces the housing cap', () => {
  const o = { income: 100000, debts: 500, down: 40000, rate: 6.5, years: 30, tax: 1.1, insurance: 1800, front: 28, back: 36 };
  const r = tools['home-affordability'].calc(o);
  near(r.maxHousing, 100000 / 12 * 0.28); near(r.pi + r.price * 1.1 / 1200 + 150, r.maxHousing, 1e-6); assert.equal(r.limit, 'housing');
});

test('rent vs buy: components add up', () => {
  const r = tools['rent-vs-buy'].calc({ rent: 2200, rentGrowth: 3, price: 400000, down: 20, rate: 6.5, years: 7, tax: 1.1, upkeep: 1, growth: 3, invest: 5, sell: 6 });
  near(r.diff, r.rentNet - r.buyNet); near(r.opp, 80000 * (Math.pow(1.05, 7) - 1), 1e-6);
});

test('debt consolidation: savings and too-low payment', () => {
  const e = tools['debt-consolidation'];
  const r = e.calc({ b1: 8000, r1: 24, p1: 250, b2: 5000, r2: 20, p2: 150, b3: 3000, r3: 18, p3: 100, rate: 11, years: 4, fee: 3 });
  near(r.loan, 16000 / 0.97); near(r.newPay, 426.32, 0.01); assert.ok(r.saved > 0);
  assert.equal(e.calc({ b1: 10000, r1: 24, p1: 100, b2: 0, r2: 0, p2: 0, b3: 0, r3: 0, p3: 0, rate: 10, years: 3, fee: 0 }).ok, false);
});

test('401k: one-year projection with match', () => {
  const r = tools['401k'].calc({ age: 30, retire: 31, salary: 100000, balance: 0, contrib: 10, match: 50, matchLimit: 6, raise: 0, ret: 0 });
  near(r.mine, 10000); near(r.theirs, 3000); near(r.end, 13000, 1e-6);
});
