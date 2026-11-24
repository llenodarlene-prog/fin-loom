import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);

test('pension: present value and break-even return', () => {
  const e = tools.pension;
  const r = e.calc({ monthly: 2500, lump: 400000, years: 25, ret: 5, cola: 0 });
  near(r.total, 750000); near(r.pv, 432422.57, 0.01);
  near(e.calc({ monthly: 2500, lump: r.pv, years: 25, ret: 5, cola: 0 }).breakeven, 5, 1e-6);
});

test('sba loan: financed fees', () => {
  const r = tools['sba-loan'].calc({ amount: 250000, rate: 10, years: 10, fee: 2, other: 2500 });
  near(r.principal, 257500); near(r.pay, 3402.88, 0.01); near(r.cost, r.total - 250000);
});

test('commercial mortgage: DSCR and debt yield', () => {
  const r = tools['commercial-mortgage'].calc({ value: 2000000, ltv: 70, rate: 7, amort: 25, term: 10, noi: 160000 });
  near(r.loan, 1400000); near(r.pay, 9894.91, 0.01); near(r.dscr, 160000 / r.annual); near(r.debtYield, 160000 / 1400000);
});

test('business valuation: two methods', () => {
  const e = tools['business-valuation'];
  const r = e.calc({ earnings: 250000, multiple: 3, ret: 20, growth: 3, cash: 50000, debt: 100000 });
  near(r.byMultiple, 750000); near(r.eqMultiple, 700000); near(r.byCap, 257500 / 0.17, 1e-6);
  assert.equal(e.calc({ earnings: 1, multiple: 1, ret: 5, growth: 5, cash: 0, debt: 0 }).byCap, null);
});

test('options profit: call and put at expiration', () => {
  const e = tools['options-profit'];
  const c = e.calc({ kind: 'call', strike: 100, premium: 4, contracts: 1, price: 110, fees: 1 });
  near(c.profit, 599); near(c.breakeven, 104.01); assert.equal(c.maxGain, null);
  const p = e.calc({ kind: 'put', strike: 100, premium: 4, contracts: 2, price: 120, fees: 0 });
  near(p.profit, -800); near(p.breakeven, 96);
});
