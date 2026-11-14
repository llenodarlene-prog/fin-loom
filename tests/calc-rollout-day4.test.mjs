import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);

test('payment fees: published presets and gross-up', () => {
  const e = tools['payment-fees'];
  assert.equal(JSON.stringify(e.PRESETS['stripe-online'].slice(1)), '[2.9,0.3]');
  assert.equal(JSON.stringify(e.PRESETS['venmo-business'].slice(1)), '[1.9,0.1]');
  const r = e.fees({ amount: 100, provider: 'stripe-online', count: 10 });
  near(r.fee, 3.2); near(r.net, 96.8); near(r.charge * (1 - 0.029) - 0.3, 100);
  near(e.fees({ amount: 50, provider: 'custom', pct: 3, fixed: 0, count: 1 }).fee, 1.5);
});

test('budget planner: variance, savings rate and CSV', () => {
  const e = tools['budget-planner'];
  const o = { income: 5000, budget: { housing: 1600, food: 700, saving: 600 }, actual: { housing: 1600, food: 820, saving: 500 } };
  const r = e.budget(o);
  near(r.totalBudget, 2900); near(r.totalActual, 2920); near(r.left, 2080); assert.equal(r.over, 1);
  near(r.savingsRate, (500 + 2080) / 5000);
  const csv = e.csv(o, r); assert.match(csv, /^Category,Budget,Actual,Difference/); assert.match(csv, /"Groceries and dining",700\.00,820\.00,-120\.00/);
});

test('portfolio rebalance: trades restore targets', () => {
  const e = tools['portfolio-rebalance'];
  const r = e.analyze({ holdings: [{ name: 'A', value: 62000, target: 50 }, { name: 'B', value: 18000, target: 20 }, { name: 'C', value: 20000, target: 30 }], cash: 0, band: 5 });
  near(r.rows[0].trade, -12000); near(r.rows[1].trade, 2000); near(r.rows[2].trade, 10000); near(r.buys, r.sells); assert.equal(r.outside, 2);
  const c = e.analyze({ holdings: [{ name: 'A', value: 50, target: 50 }, { name: 'B', value: 50, target: 50 }], cash: 100, band: 5 });
  near(c.rows[0].trade, 50); near(c.sells, 0);
});

test('financial ratios: standard definitions and missing denominators', () => {
  const e = tools['financial-ratios'];
  const o = { currentAssets: 500, cash: 120, inventory: 150, currentLiabilities: 250, totalAssets: 1500, totalLiabilities: 700, equity: 800, revenue: 2000, operatingIncome: 240, netIncome: 160, interest: 30 };
  const by = n => e.ratios(o).find(r => r.name === n).value;
  near(by('Current ratio'), 2); near(by('Quick ratio'), 1.4); near(by('Interest coverage'), 8); near(by('Return on equity'), 0.2); near(by('Asset turnover'), 2000 / 1500);
  assert.equal(e.ratios({ ...o, interest: 0 }).find(r => r.name === 'Interest coverage').value, null);
});

test('card compare: yearly value', () => {
  const e = tools['card-compare'];
  const r = e.compare({ cards: [{ name: 'A', fee: 0, apr: 24, rewards: 1.5, bonus: 200 }, { name: 'B', fee: 95, apr: 22, rewards: 2, bonus: 250 }], spend: 1500, carry: 0 });
  near(r.cards[0].year1, 470); near(r.cards[1].year1, 515); near(r.cards[1].ongoing, 265); assert.equal(r.best1.name, 'B'); assert.equal(r.best2.name, 'A');
  near(e.compare({ cards: [{ name: 'A', fee: 0, apr: 20, rewards: 1, bonus: 0 }], spend: 1000, carry: 2000 }).cards[0].ongoing, 120 - 400);
});
