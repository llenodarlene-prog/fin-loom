import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);

test('car refinance: payment and total change', () => {
  const r = tools['car-refinance'].calc({ balance: 20000, rate: 9, months: 48, newRate: 6, newMonths: 48, fees: 200 });
  near(r.oldPay, 497.70, 0.01); near(r.newPay, 474.40, 0.01); near(r.change, 1118.56, 0.01);
});

test('home equity loan: CLTV limit and payment', () => {
  const r = tools['home-equity-loan'].calc({ value: 450000, mortgage: 250000, cltv: 85, amount: 50000, rate: 8.5, years: 15 });
  near(r.available, 132500); near(r.pay, 492.37, 0.01); assert.equal(r.fits, true);
  assert.equal(tools['home-equity-loan'].calc({ value: 100000, mortgage: 90000, cltv: 80, amount: 5000, rate: 5, years: 5 }).available, 0);
});

test('interest-only loan: payment jump and extra interest', () => {
  const e = tools['interest-only-loan'];
  const r = e.calc({ amount: 400000, rate: 7, ioYears: 10, years: 30 });
  near(r.ioPay, 2333.33, 0.01); near(r.amPay, 3101.20, 0.01); assert.ok(r.extra > 0);
  assert.match(e.check({ amount: 1000, rate: 5, ioYears: 10, years: 10 }).ioYears, /shorter/);
});

test('roi: total and annualized', () => {
  const r = tools.roi.calc({ cost: 10000, extra: 500, final: 14000, years: 3 });
  near(r.roi, 3500 / 10500); near(r.annual, Math.pow(14000 / 10500, 1 / 3) - 1);
});

test('commercial loan: balloon equals remaining balance', () => {
  const e = tools['commercial-loan'];
  const r = e.calc({ amount: 1000000, rate: 7.5, amort: 25, term: 10 });
  near(r.pay, 7389.91, 0.01); near(r.balloon, 797175.11, 0.05);
  near(e.calc({ amount: 1000000, rate: 7.5, amort: 25, term: 25 }).balloon, 0);
});
