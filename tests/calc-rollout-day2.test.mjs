import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);

test('rmd: IRS Uniform Lifetime Table periods and division', () => {
  const e = tools.rmd;
  assert.equal(e.period(72), 27.4); assert.equal(e.period(73), 26.5); assert.equal(e.period(85), 16.0); assert.equal(e.period(100), 6.4); assert.equal(e.period(120), 2.0);
  assert.equal(e.TABLE.length, 49);
  const r = e.rmd({ balance: 500000, age: 73, ret: 0, years: 2 });
  near(r.rows[0].rmd, 500000 / 26.5); near(r.rows[1].balance, 500000 - 500000 / 26.5); near(r.rows[1].rmd, r.rows[1].balance / 25.5);
});

test('401k loan: IRS maximum, level payment and 5-year rule', () => {
  const e = tools['401k-loan'];
  assert.equal(e.maxLoan(60000), 30000); assert.equal(e.maxLoan(200000), 50000); assert.equal(e.maxLoan(15000), 10000);
  const r = e.loan({ vested: 60000, amount: 12000, rate: 0, years: 2, market: 0, freq: 12 });
  near(r.payment, 500); near(r.interest, 0); assert.equal(r.n, 24); near(r.opportunity, 0, 1e-6);
  assert.match(e.check({ vested: 60000, amount: 20000, rate: 5, years: 10, market: 5, home: false }).years, /within 5 years/);
  assert.equal(e.check({ vested: 60000, amount: 20000, rate: 5, years: 10, market: 5, home: true }).years, '');
  assert.match(e.check({ vested: 20000, amount: 15000, rate: 5, years: 5, market: 5 }).amount, /IRS maximum/);
});

test('student loan: amortized payment and extra payments', () => {
  const e = tools['student-loan'];
  const i = 0.065 / 12; near(e.scheduled(30000, 6.5, 10), 30000 * i / (1 - Math.pow(1 + i, -120)));
  const p = e.plan({ balance: 30000, rate: 6.5, term: 10, extra: 0 });
  assert.equal(p.base.months, 120); near(p.saved, 0);
  const f = e.plan({ balance: 30000, rate: 6.5, term: 10, extra: 100 });
  assert.ok(f.fast.months < 120 && f.saved > 0);
  assert.equal(e.plan({ balance: 1200, rate: 0, term: 1, extra: 0 }).base.months, 12);
});

test('goal planner: required deposit hits the target exactly', () => {
  const e = tools['goal-planner'];
  const g = e.goal({ name: 'x', target: 10000, months: 24, saved: 2000, monthly: 0 }, 3);
  const i = Math.pow(1.03, 1 / 12) - 1;
  near(2000 * Math.pow(1 + i, 24) + g.required * (Math.pow(1 + i, 24) - 1) / i, 10000, 1e-6);
  const z = e.goal({ name: 'z', target: 1200, months: 12, saved: 0, monthly: 100 }, 0);
  near(z.required, 100); assert.equal(z.onTrack, true);
  assert.equal(e.plan({ goals: [{ name: 'a', target: 0, months: 0, saved: 0, monthly: 0 }], apy: 0 }).goals.length, 0);
});

test('social security break-even', () => {
  const e = tools['ss-breakeven'];
  const r = e.breakeven({ early: 62, late: 67, earlyBenefit: 1400, lateBenefit: 2000, cola: 0, horizon: 95 });
  near(r.crossAge, 62 + 60 / 12 + 140 / 12, 1e-9);
  near(r.early, 1400 * 12 * 33); near(r.late, 2000 * 12 * 28);
  assert.equal(e.breakeven({ early: 62, late: 70, earlyBenefit: 1000, lateBenefit: 1001, cola: 0, horizon: 80 }).crossAge, null);
});
