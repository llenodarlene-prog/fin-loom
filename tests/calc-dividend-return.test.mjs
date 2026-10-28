import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const e = tools['dividend-return'];
const base = { buy: 50, current: 60, shares: 100, years: 3, dividend: 4.5, fees: 10, reinvest: false };
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-6, `${a} != ${b}`);

test('dividend total return follows the brief formulas', () => {
  const r = e.totalReturn(base);
  near(r.priceGain, 1000); near(r.dividends, 450); near(r.total, 1440);
  near(r.start, 5010); near(r.end, 6450);
  near(r.totalPct, 1440 / 5010);
  near(r.annualized, Math.pow(6450 / 5010, 1 / 3) - 1);
  assert.equal(e.outputs(base, r).big, '$1,440.00');
});

test('reinvestment buys shares at the average of purchase and current price', () => {
  const r = e.totalReturn({ ...base, reinvest: true });
  near(r.extraShares, 450 / 55); near(r.dividendValue, (450 / 55) * 60); near(r.end, 6000 + (450 / 55) * 60);
});

test('losses, zero ending value, and fractional years are handled', () => {
  const loss = e.totalReturn({ ...base, current: 30, dividend: 0 });
  near(loss.total, -2010); assert.ok(loss.annualized < 0);
  assert.match(e.outputs(base, loss).big, /^−\$2,010\.00$/);
  const zero = e.totalReturn({ ...base, current: 0, dividend: 0, fees: 0 });
  assert.equal(zero.annualized, null); assert.equal(e.outputs(base, zero).annualized, 'Not available');
  const half = e.totalReturn({ ...base, years: 0.5, fees: 0 });
  near(half.annualized, Math.pow(6450 / 5000, 2) - 1);
  assert.doesNotMatch(e.summary(base, zero) + e.bars(zero) + e.tableRows(base, zero), /NaN|Infinity|undefined/);
});

test('validation ranges', () => {
  const m = e.check({ ...base, buy: 0, shares: NaN, years: 0 });
  assert.ok(m.buy && m.shares && m.years); assert.equal(m.current, '');
});
