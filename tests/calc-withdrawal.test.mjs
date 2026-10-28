import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const e = tools.withdrawal;
const base = { mode: 'a', balance: 500000, withdrawal: 2500, ret: 5, inflation: 3, growth: 3, years: 30, timing: 'start' };

test('withdrawal mode A finds the depletion point and caps long projections', () => {
  // Zero return, no increase: $500,000 at $5,000 a month lasts exactly 100 months.
  const flat = e.run({ ...base, ret: 0, growth: 0, inflation: 0, withdrawal: 5000 });
  assert.equal(flat.depletedAt, 100);
  assert.equal(e.duration(flat.depletedAt), '8 years, 4 months');
  assert.equal(flat.withdrawn, 500000);
  // A small withdrawal against a 5% return never runs out within the 100-year cap.
  const lasting = e.run({ ...base, withdrawal: 1000, growth: 0 });
  assert.equal(lasting.depletedAt, null);
  assert.equal(lasting.rows.length, 100);
  assert.match(e.outputs(base, lasting).big, /Lasts beyond 100 years/);
  // Default example: withdrawals rising 3% a year run out in about 20 years.
  const r = e.run(base);
  assert.equal(e.outputs(base, r).big, '20 years, 5 months');
  assert.ok(Math.abs(r.withdrawn - (base.balance + r.growth)) < 1e-6);
  // Beginning-of-month withdrawals run out no later than end-of-month ones.
  assert.ok(r.depletedAt <= e.run({ ...base, timing: 'end' }).depletedAt);
  // Inflation only changes the today's-dollars figures, not the timeline.
  assert.equal(e.run({ ...base, inflation: 0 }).depletedAt, r.depletedAt);
  assert.ok(r.lastReal < r.lastWithdrawal);
  // Negative returns stay finite.
  const loss = e.run({ ...base, ret: -20 });
  assert.ok(loss.rows.every(row => Number.isFinite(row.end) && row.end >= 0));
});

test('withdrawal mode B level payment spends the balance to zero', () => {
  for (const timing of ['start', 'end']) {
    for (const ret of [5, 0, -2, 12]) {
      const r = e.run({ ...base, mode: 'b', ret, timing });
      assert.ok(Math.abs(r.end) < 1e-4, `${timing} ${ret}`);
      assert.equal(r.rows.length, 30);
    }
  }
  assert.ok(Math.abs(e.levelWithdrawal(360000, 0, 30, 'end') - 1000) < 1e-9);
  const end = e.levelWithdrawal(500000, 5, 30, 'end');
  const i = Math.pow(1.05, 1 / 12) - 1;
  assert.ok(Math.abs(end - 500000 * i / (1 - Math.pow(1 + i, -360))) < 1e-9);
  assert.ok(Math.abs(e.levelWithdrawal(500000, 5, 30, 'start') - end / (1 + i)) < 1e-9);
  assert.match(e.summary({ ...base, mode: 'b' }, e.run({ ...base, mode: 'b' })), /^Under these assumptions, \$500,000\.00 earning 5\.00% a year could support an estimated \$[\d,.]+ a month for 30 years/);
});
