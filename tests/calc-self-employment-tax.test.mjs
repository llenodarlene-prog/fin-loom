import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const se = tools['self-employment-tax'];
const t99 = tools['tax-1099'];
const near = (a, b, tol = 0.005) => assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);
const finite = obj => Object.values(obj).every(v => typeof v !== 'number' || Number.isFinite(v));

test('self-employment tax follows Schedule SE at 2026 rates', () => {
  assert.equal(se.SE.wageBase, 184500);
  const r = se.selfEmploymentTax(50000, 'single', 0);
  near(r.subject, 46175);
  near(r.socialSecurity, 5725.70);
  near(r.medicare, 1339.08);
  near(r.seTax, 7064.78);
  near(r.deductible, 3532.39);
  near(r.additional, 0);
  // The $400 minimum applies to net earnings times 92.35%.
  assert.equal(se.selfEmploymentTax(433, 'single').owes, false);
  assert.equal(se.selfEmploymentTax(434, 'single').owes, true);
  near(se.selfEmploymentTax(0, 'single').seTax, 0);
});

test('wage base and W-2 wages cap the Social Security part', () => {
  const big = se.selfEmploymentTax(300000, 'single', 0);
  near(big.socialSecurity, 184500 * 0.124);
  near(big.medicare, 300000 * 0.9235 * 0.029);
  near(big.additional, (300000 * 0.9235 - 200000) * 0.009);
  assert.ok(big.wageBaseReached);
  // W-2 wages of $150,000 leave $34,500 of room under the wage base.
  const mixed = se.selfEmploymentTax(50000, 'single', 150000);
  near(mixed.socialSecurity, 34500 * 0.124);
  near(mixed.medicare, 1339.08);
  // Wages above the base leave no Social Security part; Additional Medicare threshold drops by wages.
  const capped = se.selfEmploymentTax(50000, 'marriedJoint', 200000);
  near(capped.socialSecurity, 0);
  // MFJ threshold of $250,000 less $200,000 of wages leaves $50,000, above the $46,175 subject to SE tax.
  near(capped.additional, 0);
  near(se.selfEmploymentTax(100000, 'marriedSeparate', 100000).additional, (92350 - 25000) * 0.009);
  assert.ok(finite(se.selfEmploymentTax(1e9, 'headOfHousehold', 1e9)));
});

test('1099 estimate adds SE tax and the income tax increase after the deductible half and standard deduction', () => {
  assert.equal(t99.RULES.single.deduction, 16100);
  assert.equal(t99.RULES.marriedJoint.deduction, 32200);
  assert.equal(t99.RULES.headOfHousehold.deduction, 24150);
  const r = t99.estimate({ income: 60000, expenses: 10000, status: 'single', wages: 0, stateRate: 0 });
  near(r.se.seTax, 7064.78);
  near(r.taxableAfter, 50000 - 3532.39 - 16100);
  near(r.incomeTaxIncrease, 1240 + (30367.61 - 12400) * 0.12);
  near(r.total, 7064.78 + 3396.11);
  near(r.quarterly, r.total / 4);
  near(r.setAside, r.total / 50000, 1e-9);
  // W-2 wages push 1099 income into higher brackets and reduce SE Social Security room.
  const withJob = t99.estimate({ income: 60000, expenses: 10000, status: 'single', wages: 80000, stateRate: 5 });
  assert.ok(withJob.incomeTaxIncrease > r.incomeTaxIncrease);
  near(withJob.state, 2500);
  // Bracket edges match Rev. Proc. 2025-32.
  near(t99.incomeTax(50400, t99.RULES.single), 5800);
  near(t99.incomeTax(100800, t99.RULES.marriedJoint), 11600);
  // Zero and loss inputs stay finite and show nothing owed.
  const zero = t99.estimate({ income: 0, expenses: 0, status: 'single', wages: 0, stateRate: 0 });
  near(zero.total, 0); assert.equal(zero.setAside, 0);
  assert.ok(t99.check({ income: 100, expenses: 200, wages: 0, stateRate: 0 }).expenses);
  assert.ok(finite(t99.estimate({ income: 1e9, expenses: 0, status: 'marriedSeparate', wages: 1e9, stateRate: 20 })));
  assert.match(t99.summary({ stateRate: 0 }, r), /^Under these assumptions, \$50,000\.00 of net 1099 income could add about \$10,460\.89/);
});
