import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);

test('treasury bill: matches TreasuryDirect worked examples', () => {
  const e = tools['treasury-bill'];
  near(e.priceFromRate(0.8, 28), 99.937778, 1e-6);
  near(e.rateFromPrice(99.937778, 28), 0.8, 1e-4);
  near(e.investmentRate(99.937778, 28, 366), 0.814, 5e-4);
  near(e.investmentRate(92.265, 364, 365), 8.237, 5e-4);
  near(1000 * e.priceFromRate(0.145, 182) / 100, 999.27, 0.005);
  const r = e.bill({ face: 1000, mode: 'rate', rate: 4, days: 182, year: 365 });
  near(r.cost, 979.7777778, 1e-6); near(r.interest, 1000 - r.cost);
  assert.match(e.check({ face: 150, mode: 'rate', rate: 4, days: 91 }).face, /\$100 increments/);
});

test('coast fire: FIRE number, coast target and projection', () => {
  const e = tools['coast-fire'];
  const r = e.coast({ age: 30, retire: 65, spending: 50000, withdraw: 4, ret: 7, inflation: 2.5, invested: 100000 });
  const real = 1.07 / 1.025 - 1;
  near(r.fire, 1250000); near(r.target, 1250000 / Math.pow(1 + real, 35), 1e-6); near(r.projected, 100000 * Math.pow(1 + real, 35), 1e-6);
  assert.equal(r.reached, false);
  assert.match(e.check({ age: 50, retire: 45, spending: 1e4, withdraw: 4, ret: 5, inflation: 2, invested: 0 }).retire, /above your current age/);
});

test('cagr and rule of 72', () => {
  const c = tools.cagr.cagr({ begin: 10000, end: 18000, years: 5 });
  near(c.rate, Math.pow(1.8, 0.2) - 1); near(c.rows[5].value, 18000, 1e-6);
  near(tools.cagr.cagr({ begin: 100, end: 50, years: 2 }).rate, Math.sqrt(0.5) - 1);
  const r = tools['rule-of-72'].rule({ rate: 8, years: 10 });
  near(r.approx, 9); near(r.exact, Math.log(2) / Math.log(1.08)); near(r.exactRate, (Math.pow(2, 0.1) - 1) * 100);
});

test('dividend yield and income', () => {
  const r = tools['dividend-yield'].yieldCalc({ price: 50, dividend: 0.5, frequency: 4, invest: 10000 });
  near(r.annual, 2); near(r.yield, 0.04); near(r.shares, 200); near(r.income, 400); near(r.perPayment, 100);
});
