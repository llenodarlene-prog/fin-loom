import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const e = tools['investment-growth'];
const base = { start: 10000, monthly: 500, rate: 6, years: 20, timing: 'end', increase: 0, inflation: 0 };
const run = o => e.growth({ ...base, ...o });
const close = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);
const finite = r => r.rows.every(row => Object.values(row).every(Number.isFinite));

test('investment growth matches closed-form compound and annuity math', () => {
  // Lump sum only: 10,000 x 1.06^20.
  close(run({ monthly: 0 }).end, 10000 * Math.pow(1.06, 20));
  // End-of-month contributions: annuity with the equivalent monthly rate.
  const m = Math.pow(1.06, 1 / 12) - 1;
  const fv = 10000 * Math.pow(1.06, 20) + 500 * (Math.pow(1.06, 20) - 1) / m;
  const r = run({});
  close(r.end, fv); close(r.end, 258790.67); assert.equal(r.contributions, 130000);
  close(r.growth, r.end - 130000); close(r.contributionShare + r.growthShare, 1, 1e-12);
  // Beginning-of-month contributions earn one extra month: annuity due.
  close(run({ timing: 'start' }).end, 10000 * Math.pow(1.06, 20) + 500 * (Math.pow(1.06, 20) - 1) / m * (1 + m));
});

test('investment growth handles zero, negative, increases, inflation, and long horizons', () => {
  assert.equal(run({ rate: 0 }).end, 130000);
  assert.equal(run({ start: 0, monthly: 0 }).end, 0);
  assert.equal(run({ start: 0, monthly: 0 }).contributionShare, 0);
  const neg = run({ rate: -10 }); assert.ok(finite(neg) && neg.growth < 0);
  // A 10% annual increase makes year-2 contributions 6,600 instead of 6,000.
  close(run({ increase: 10, rate: 0 }).rows[1].contributions, 6600);
  // Inflation: real value = nominal / 1.03^20.
  const infl = run({ inflation: 3 }); close(infl.real, infl.end / Math.pow(1.03, 20));
  const long = run({ years: 100, rate: 50, monthly: 1e7, start: 1e9 }); assert.ok(finite(long) && long.tooLarge);
  assert.equal(run({}).tooLarge, false);
  assert.equal(e.scenarios(base).map(s => s.rate).join(), '4,6,8');
  assert.match(e.summary(base, run({})), /^Under these assumptions, .* could grow to \$258,790\.67 over 20 years/);
});
