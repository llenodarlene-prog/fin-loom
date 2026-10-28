import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const e = tools['stock-profit'];
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);

test('stock profit: gain with fees', () => {
  const r = e.profit({ buy: 50, sell: 65, shares: 100, buyFees: 5, sellFees: 5 });
  near(r.cost, 5005); near(r.proceeds, 6495); near(r.net, 1490); near(r.gross, 1500); near(r.fees, 10);
  near(r.returnPct, 1490 / 5005); near(r.breakEven, 50.1); near(r.perShare, 14.9);
});

test('stock profit: loss, zero fees, and break-even', () => {
  const loss = e.profit({ buy: 40, sell: 30, shares: 10, buyFees: 0, sellFees: 0 });
  near(loss.net, -100); near(loss.returnPct, -0.25); near(loss.breakEven, 40);
  const o = { buy: 10, sell: 10.2, shares: 50, buyFees: 5, sellFees: 5 };
  const even = e.profit(o);
  near(even.net, 0);
  assert.match(e.summary(o, even), /could break even/);
  assert.equal(e.outputs(loss).big, '−$100.00');
  assert.equal(e.outputs(loss).bigLabel, 'Net loss');
});

test('stock profit: guards and validation', () => {
  const zero = e.profit({ buy: 0, sell: 5, shares: 0, buyFees: 0, sellFees: 0 });
  assert.ok(Object.values(zero).every(Number.isFinite));
  const msg = e.check({ buy: 0, sell: NaN, shares: 0, buyFees: -1, sellFees: 0 });
  assert.equal(msg.buy, 'Enter a buy price above 0.'); assert.equal(msg.sell, 'Enter a number.');
  assert.ok(msg.shares && msg.buyFees); assert.equal(msg.sellFees, '');
  const frac = { buy: 1, sell: 1.5, shares: 2.5, buyFees: 0, sellFees: 0 };
  assert.match(e.summary(frac, e.profit(frac)), /2\.5000 shares/);
});
