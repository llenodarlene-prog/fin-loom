import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const e = tools['stock-average'];

test('stock average cost: totals, average, break-even, and gain', () => {
  // 100 at $50 + 50 at $40 = $7,000 for 150 shares, $46.6667 average.
  let r = e.average([{ shares: 100, price: 50, fees: 0 }, { shares: 50, price: 40, fees: 0 }], 45);
  assert.equal(r.shares, 150); assert.equal(r.invested, 7000);
  assert.ok(Math.abs(r.average - 46.666666666) < 1e-6);
  assert.equal(r.value, 6750); assert.equal(r.gain, -250);
  // Fees raise the average and break-even: (1000 + 5) + (1000 + 5) over 30 shares.
  r = e.average([{ shares: 10, price: 100, fees: 5 }, { shares: 20, price: 50, fees: 5 }], null);
  assert.equal(r.fees, 10); assert.equal(r.invested, 2010);
  assert.equal(r.average, 67); assert.equal(r.averageBeforeFees, 2000 / 30); assert.equal(r.breakEven, 67);
  assert.equal(r.gain, null); assert.equal(e.outputs(r).gain, 'Enter a current price');
  // Fractional shares and decimals keep full precision.
  r = e.average([{ shares: 0.5, price: 123.45, fees: 0 }, { shares: 1.25, price: 99.99, fees: 0.99 }], 110);
  assert.ok(Math.abs(r.invested - (61.725 + 124.9875 + 0.99)) < 1e-9);
  // A zero-share row adds nothing but its fees.
  r = e.average([{ shares: 10, price: 10, fees: 0 }, { shares: 0, price: 0, fees: 0 }], null);
  assert.equal(r.average, 10);
  assert.match(e.summary(e.average(e.DEFAULTS, 45)), /^Under these purchases, your 150 shares cost an estimated \$7,000\.00 in total, an average of \$46\.67 per share including fees\. At \$45\.00 a share, the position could show an unrealized loss of \$250\.00 \(-3\.6%\)\.$/);
  assert.equal(e.MIN_ROWS, 2); assert.equal(e.MAX_ROWS, 50);
  assert.match(e.rowHtml(7), /id="sa-shares-7"[\s\S]*for="sa-price-7"[\s\S]*Remove purchase 7/);
});
