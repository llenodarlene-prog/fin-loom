import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const e = tools['capital-gains'];
const sale = o => e.estimate({ status: 'single', income: 40000, basis: 0, proceeds: 20000, fees: 0, dividends: 0, holding: 'long', ...o });
const near = (a, b) => assert.ok(Math.abs(a - b) < 0.005, `${a} != ${b}`);

test('2026 thresholds match Rev. Proc. 2025-32', () => {
  const rules = e.TAX_RULES[2026];
  assert.equal(rules.single.capital.join(), '49450,545500');
  assert.equal(rules.marriedJoint.capital.join(), '98900,613700');
  assert.equal(rules.marriedSeparate.capital.join(), '49450,306850');
  assert.equal(rules.headOfHousehold.capital.join(), '66200,579600');
  // Table amounts at each bracket edge (Tables 1-4).
  near(e.totalTax(50400, 0, rules.single), 5800);
  near(e.totalTax(640600, 0, rules.single), 192979.25);
  near(e.totalTax(100800, 0, rules.marriedJoint), 11600);
  near(e.totalTax(768700, 0, rules.marriedJoint), 206583.5);
  near(e.totalTax(384350, 0, rules.marriedSeparate), 103291.75);
  near(e.totalTax(67450, 0, rules.headOfHousehold), 7740);
  near(e.totalTax(640600, 0, rules.headOfHousehold), 191171);
});

test('long-term gains stack on ordinary income in the 0/15/20 bands', () => {
  const r = sale({});
  near(r.tax, 1582.5);
  assert.equal(r.breakdown.map(b => `${b.rate}:${b.amount}`).join(), '0:9450,0.15:10550');
  near(sale({ income: 0, proceeds: 49450 }).tax, 0);
  near(sale({ income: 600000, proceeds: 10000 }).tax, 2000);
  // Qualified dividends are stacked first: with $9,450 of them, the whole $20,000 gain is taxed at 15%.
  near(sale({ dividends: 9450 }).tax, 3000);
});

test('short-term gains are taxed at ordinary rates', () => {
  near(sale({ holding: 'short' }).tax, 10400 * 0.12 + 9600 * 0.22);
  near(e.estimate({ status: 'marriedJoint', income: 200000, basis: 5000, proceeds: 25000, fees: 0, dividends: 0, holding: 'short' }).tax, 11400 * 0.22 + 8600 * 0.24);
  // A short-term gain that raises ordinary income also pushes qualified dividends out of the 0% band.
  const r = sale({ holding: 'short', dividends: 5000, income: 40000, proceeds: 5000 });
  near(r.tax, 5000 * 0.12 + 5000 * 0.15 - 4450 * 0.15);
});

test('losses, fees, and edge cases', () => {
  const loss = sale({ basis: 30000 });
  assert.equal(loss.tax, 0); assert.equal(loss.taxable, 0); assert.ok(loss.gain < 0);
  assert.match(e.summary({}, loss), /loss of \$10,000\.00/);
  assert.equal(sale({ fees: 500 }).taxable, 19500);
  near(sale({ fees: 500 }).afterTax, 20000 - 500 - sale({ fees: 500 }).tax);
  assert.ok(sale({ income: 300000 }).niitPossible);
  for (const status of Object.keys(e.STATUSES)) for (const holding of ['long', 'short']) {
    const r = e.estimate({ status, income: 123456, basis: 1000, proceeds: 99999, fees: 10, dividends: 2000, holding });
    assert.ok(Number.isFinite(r.tax) && r.tax > 0 && r.effective < 0.38);
  }
});
