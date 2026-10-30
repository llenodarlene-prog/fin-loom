import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const e = tools['withdrawal-tax'];
const base = { status: 'single', income: 50000, amount: 20000, age: 50, exception: false, stateRate: 0 };
const run = o => e.estimate({ ...base, ...o });
const near = (a, b) => assert.ok(Math.abs(a - b) < 0.005, `${a} != ${b}`);

test('401(k) withdrawal tax matches hand calculations from the 2026 brackets', () => {
  // Single, $50,000 taxable + $20,000: $400 at 12% and $19,600 at 22% = $4,360; 10% additional tax $2,000.
  let r = run({});
  near(r.federal, 4360); near(r.penalty, 2000); near(r.total, 6360); near(r.net, 13640); near(r.withholding, 4000);
  assert.equal(r.breakdown.length, 2); near(r.effective, 0.318);
  // IRS table check: single tax at $50,400 is $5,800; at $105,700 it is $5,800 + 22% x $55,300 = $17,966.
  near(e.tax(50400, e.TAX_RULES[2026].single), 5800); near(e.tax(105700, e.TAX_RULES[2026].single), 17966);
  // Exception and age 59½ remove the 10% additional tax.
  near(run({ exception: true }).penalty, 0); near(run({ age: 59.5 }).penalty, 0); near(run({ age: 59 }).penalty, 2000);
  // Married filing jointly: $80,000 + $30,000 = $20,800 at 12% and $9,200 at 22%.
  r = run({ status: 'marriedJoint', income: 80000, amount: 30000, age: 65 });
  near(r.federal, 20800 * 0.12 + 9200 * 0.22); near(r.penalty, 0);
  // Head of household from zero income: $17,700 at 10% + $2,300 at 12%.
  near(run({ status: 'headOfHousehold', income: 0, amount: 20000, age: 62 }).federal, 1770 + 276);
  // State estimate is a flat share of the withdrawal.
  near(run({ stateRate: 5 }).state, 1000);
  // Very large withdrawals reach 37% and stay finite.
  r = run({ income: 1000000, amount: 1000000, age: 70 });
  near(r.federal, 370000); assert.ok(Number.isFinite(r.total));
});

test('validation and text', () => {
  assert.equal(e.check({ ...base, amount: 0 }).amount, 'Enter a value from 0.01 to 100,000,000.');
  assert.equal(e.check({ ...base, age: NaN }).age, 'Enter a number.');
  assert.equal(e.check({ ...base, stateRate: 25 }).state, 'Enter a value from 0 to 20.');
  assert.deepEqual(Object.values(e.check(base)).filter(Boolean), []);
  assert.match(e.summary(base, run({})), /^Under these assumptions, a \$20,000\.00 withdrawal in 2026 could carry federal income tax of about \$4,360\.00, a 10% additional tax of \$2,000\.00, about \$6,360\.00 in total \(31\.8%\), leaving roughly \$13,640\.00\.$/);
  assert.equal(e.TAX_RULES[2026].single.standard, 16100); assert.equal(e.TAX_RULES[2026].marriedJoint.standard, 32200); assert.equal(e.TAX_RULES[2026].headOfHousehold.standard, 24150);
});
