import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);

test('salary to hourly: paid hours and hours worked', () => {
  const r = tools['salary-hourly'].convert({ salary: 60000, hours: 40, days: 5, weeks: 52, pto: 15 });
  near(r.hourly, 60000 / 2080); near(r.monthly, 5000); near(r.effective, 60000 / (2080 - 120));
  assert.match(tools['salary-hourly'].check({ salary: 1, hours: 40, days: 5, weeks: 1, pto: 10 }).pto, /cannot be more/);
});

test('profit margin: margin, markup and target price', () => {
  const r = tools['profit-margin'].margin({ cost: 60, price: 100, units: 500, target: 50 });
  near(r.margin, 0.4); near(r.markup, 40 / 60); near(r.targetPrice, 120); near(r.totalProfit, 20000);
  assert.equal(tools['profit-margin'].margin({ cost: 0, price: 10, units: 1, target: 0 }).markup, null);
});

test('mortgage recast: lower payment over the same term', () => {
  const e = tools['mortgage-recast'];
  const r = e.recast({ balance: 300000, rate: 6.5, remaining: 25, lump: 50000, fee: 250 });
  near(r.oldPay, 2025.62, 0.01); near(r.newPay, 1688.02, 0.01); near(r.net, r.saved - 250);
  assert.match(e.check({ balance: 1000, rate: 5, remaining: 10, lump: 1000, fee: 0 }).lump, /less than/);
});

test('loan payment: amortization matches the standard formula', () => {
  const r = tools['loan-payment'].schedule({ amount: 25000, rate: 8, years: 5 });
  near(r.pay, 506.91, 0.01); near(r.interest, 5414.59, 0.01); near(r.rows.at(-1).balance, 0, 1e-6);
  near(tools['loan-payment'].schedule({ amount: 1200, rate: 0, years: 1 }).pay, 100);
});

test('personal loan: APR includes the origination fee', () => {
  const e = tools['personal-loan'];
  const r = e.loan({ amount: 15000, rate: 12, years: 3, fee: 5 });
  near(r.pay, 498.21, 0.01); near(r.cash, 14250); near(r.apr, 15.61, 0.01);
  near(e.loan({ amount: 15000, rate: 12, years: 3, fee: 0 }).apr, 12, 1e-6);
});
