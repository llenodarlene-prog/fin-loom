import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);

test('auto loan: trade-in reduces taxable price and amount financed', () => {
  const r = tools['auto-loan'].loan({ price: 35000, down: 5000, trade: 3000, tax: 6, fees: 500, rate: 7, years: 5 });
  near(r.taxAmt, 1920); near(r.financed, 29420); near(r.pay, 582.55, 0.01);
  assert.match(tools['auto-loan'].check({ price: 1000, down: 800, trade: 300, tax: 0, fees: 0, rate: 5, years: 3 }).down, /cannot be more/);
});

test('purchase loans: worked examples', () => {
  const cases = [['boat-loan', { price: 60000, down: 12000, trade: 0, tax: 6, fees: 500, rate: 8, years: 15 }, 52100, 497.89],
    ['motorcycle-loan', { price: 15000, down: 2000, trade: 0, tax: 6, fees: 300, rate: 9, years: 4 }, 14200, 353.37],
    ['mobile-home-loan', { price: 90000, down: 9000, trade: 0, tax: 0, fees: 1500, rate: 8.5, years: 20 }, 82500, 715.95],
    ['land-loan', { price: 80000, down: 16000, trade: 0, tax: 0, fees: 1500, rate: 8, years: 15 }, 65500, 625.95]];
  for (const [id, o, financed, pay] of cases) { const r = tools[id].loan(o); near(r.financed, financed); near(r.pay, pay, 0.01); near(r.total, r.pay * o.years * 12, 1e-6); }
});

test('land loan: credit does not reduce taxable price', () => {
  const r = tools['land-loan'].loan({ price: 10000, down: 0, trade: 1000, tax: 10, fees: 0, rate: 0, years: 1 });
  near(r.taxAmt, 1000); near(r.financed, 10000);
});
