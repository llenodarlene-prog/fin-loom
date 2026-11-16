import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);

test('dti matches the CFPB example', () => {
  const r = tools.dti.dti({ income: 6000, housing: 1500, auto: 100, student: 0, cards: 400, other: 0 });
  near(r.total, 2000); near(r.ratio, 1 / 3); near(r.housing, 0.25); near(r.toTarget(30), 200); near(r.toTarget(36), 0);
});

test('balance transfer: fee added, promo then go-to rate', () => {
  const e = tools['balance-transfer'];
  const r = e.compare({ balance: 6000, apr: 24, payment: 300, fee: 3, promo: 0, months: 15, goto: 24 });
  near(r.fee, 180); near(r.move.atPromoEnd, 6180 - 15 * 300); near(r.clearInPromo, 6180 / 15);
  assert.ok(r.savings > 0 && r.stay.done && r.move.done);
  const flat = e.compare({ balance: 1200, apr: 0, payment: 100, fee: 0, promo: 0, months: 0, goto: 0 });
  assert.equal(flat.stay.months, 12); near(flat.savings, 0);
  assert.ok(e.compare({ balance: 10000, apr: 30, payment: 100, fee: 0, promo: 30, months: 0, goto: 30 }).stay.never);
});

test('refinance: payments and break-even', () => {
  const e = tools.refinance;
  const i = 0.06 / 12; near(e.pmt(300000, 6, 30), 300000 * i / (1 - Math.pow(1 + i, -360)));
  const r = e.refi({ balance: 300000, rate: 7, remaining: 27, newRate: 6, term: 30, costs: 6000, roll: false });
  near(r.breakEven, 6000 / (r.oldPay - r.newPay));
  const rolled = e.refi({ balance: 300000, rate: 7, remaining: 27, newRate: 6, term: 30, costs: 6000, roll: true });
  near(rolled.newPay, e.pmt(306000, 6, 30)); assert.equal(rolled.breakEven, 0);
  assert.equal(e.refi({ balance: 100000, rate: 5, remaining: 10, newRate: 6, term: 10, costs: 1000, roll: false }).breakEven, null);
});

test('position size: long, short and whole shares', () => {
  const e = tools['position-size'];
  const r = e.size({ account: 25000, risk: 1, entry: 50, stop: 47.5, target: 57.5 });
  assert.equal(r.shares, 100); near(r.rr, 3); near(r.profit, 750); assert.equal(r.long, true);
  const s = e.size({ account: 10000, risk: 2, entry: 30, stop: 33, target: 0 });
  assert.equal(s.shares, 66); assert.equal(s.long, false); assert.equal(s.rr, null);
  assert.match(e.check({ account: 1000, risk: 1, entry: 10, stop: 10, target: 0 }).stop, /differ/);
});

test('sales tax add and remove are inverses', () => {
  const e = tools['sales-tax'];
  const a = e.tax({ amount: 100, rate: 8.25, mode: 'add' }); near(a.tax, 8.25); near(a.total, 108.25);
  const r = e.tax({ amount: 108.25, rate: 8.25, mode: 'remove' }); near(r.price, 100); near(r.tax, 8.25);
});
