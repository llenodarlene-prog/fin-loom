import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);

test('emergency fund: target, shortfall and months to goal', () => {
  const e = tools['emergency-fund'];
  const r = e.plan({ expenses: 3000, months: 6, saved: 5000, deposit: 500, apy: 0 });
  near(r.target, 18000); near(r.shortfall, 13000); assert.equal(r.monthsToGoal, 26); near(r.interest, 0);
  const met = e.plan({ expenses: 1000, months: 3, saved: 5000, deposit: 0, apy: 0 });
  assert.equal(met.monthsToGoal, 0); near(met.shortfall, 0);
  const never = e.plan({ expenses: 1000, months: 3, saved: 0, deposit: 0, apy: 0 });
  assert.equal(never.monthsToGoal, null);
  const withRate = e.plan({ expenses: 3000, months: 6, saved: 5000, deposit: 500, apy: 4 });
  assert.ok(withRate.monthsToGoal <= 26 && withRate.interest > 0);
  // Month-by-month check of the first period with interest.
  const m = Math.pow(1.04, 1 / 12) - 1;
  near(withRate.rows[0].balance, ((5000 * (1 + m) + 500) * (1 + m) + 500) * (1 + m) + 500);
  assert.equal(e.check({ expenses: 0, months: 1.5, saved: 0, deposit: 0, apy: 0 }).months, 'Enter a whole number.');
});

test('credit utilization: per card, overall and pay-down', () => {
  const e = tools['credit-utilization'];
  const r = e.utilization({ cards: [{ limit: 5000, balance: 1200 }, { limit: 3000, balance: 900 }, { limit: 0, balance: 0 }], target: 30 });
  near(r.overall, 2100 / 8000); near(r.payDown, 0); assert.equal(r.cards.length, 2);
  near(r.cards[0].ratio, 0.24); near(r.cards[1].ratio, 0.3);
  const high = e.utilization({ cards: [{ limit: 2000, balance: 1800 }, { limit: 8000, balance: 1000 }], target: 10 });
  near(high.payDown, 2800 - 1000); near(high.cards[0].payDown, 1600); near(high.cards[1].payDown, 200);
  assert.equal(high.highest.n, 1); assert.equal(high.over, 2);
  const noLimit = e.utilization({ cards: [{ limit: 0, balance: 500 }], target: 30 });
  assert.equal(noLimit.overall, null); assert.equal(noLimit.cards[0].ratio, null);
  assert.match(e.check({ cards: [{ limit: 0, balance: 0 }], target: 30 }).limit1, /at least one card/);
});

test('net worth: totals, equity and SCF benchmark', () => {
  const e = tools['net-worth'];
  const o = { age: 'a35', cash: 15000, investments: 20000, retirement: 60000, home: 350000, vehicles: 18000, other: 0, mortgage: 280000, auto: 12000, student: 15000, cards: 3000, loans: 0 };
  const r = e.worth(o);
  near(r.totalAssets, 463000); near(r.totalDebts, 310000); near(r.net, 153000); near(r.homeEquity, 70000); near(r.liquid, 35000);
  assert.equal(r.group.median, 155600); assert.equal(e.SCF.all[1], 215900);
  const neg = e.worth({ age: 'u35', student: 40000 });
  near(neg.net, -40000); assert.equal(neg.debtRatio, null);
  assert.match(e.outputs({}, neg).big, /^−\$40,000\.00$/);
});
