import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);

test('iban: Central Bank of Kosovo worked example', () => {
  const e = tools['iban-checker'];
  assert.equal(e.check('XK05 1212 0123 4567 8906').valid, true);
  assert.equal(e.check('xk05-1212-0123-4567-8906').valid, true);
  const bad = e.check('XK06 1212 0123 4567 8906'); assert.equal(bad.valid, false); assert.equal(bad.expected, '05');
  assert.equal(e.check('12AB').valid, false); assert.equal(e.check('').valid, false);
});

test('bank fees: yearly cost net of interest', () => {
  const e = tools['bank-fees'];
  const u = { atmUses: 2, overdrafts: 1, wires: 1, balance: 5000 };
  const a = e.account({ monthly: 12, atm: 3, overdraft: 35, wire: 30, other: 0, apy: 0.01, waived: false }, u);
  near(a.fees, 144 + 72 + 35 + 30); near(a.net, 281 - 0.5);
  near(e.account({ monthly: 12, atm: 0, overdraft: 0, wire: 0, other: 0, apy: 0, waived: true }, u).fees, 0);
});

test('rental property: NOI, cap rate and cash flow', () => {
  const e = tools['rental-property'];
  const o = { price: 300000, down: 25, rate: 7, term: 30, closing: 9000, rent: 2600, vacancy: 5, taxes: 3600, insurance: 1500, hoa: 0, maintenance: 8, management: 8 };
  const r = e.rental(o);
  near(r.effective, 31200 * 0.95); near(r.expenses, 3600 + 1500 + 31200 * 0.08 + 29640 * 0.08); near(r.noi, 29640 - r.expenses); near(r.cap, r.noi / 300000);
  near(r.cashFlow, r.noi - r.payment * 12); near(r.invested, 84000); near(r.coc, r.cashFlow / 84000);
  assert.equal(e.rental({ ...o, down: 100 }).dscr, null);
});

test('crypto profit and allocation', () => {
  const p = tools['crypto-profit'].profit({ invest: 1000, buy: 50000, sell: 60000, buyFee: 0.5, sellFee: 0.5 });
  near(p.coins, 995 / 50000); near(p.proceeds, 0.0199 * 60000 * 0.995); near(p.gain, p.proceeds - 1000);
  near(tools['crypto-profit'].profit({ invest: 1000, buy: 50000, sell: p.breakEven, buyFee: 0.5, sellFee: 0.5 }).gain, 0, 1e-6);
  const a = tools['crypto-allocation'].allocate({ other: 90000, crypto: 10000, target: 5, drop: 50 });
  near(a.weight, 0.1); near(a.change, -5000); near(a.portfolioMove, -0.05);
});

test('dividend income: year one and goal', () => {
  const e = tools['dividend-income'];
  const r = e.plan({ portfolio: 100000, yield: 4, growth: 0, contribution: 0, years: 3, target: 8000, reinvest: false });
  near(r.first, 4000); near(r.last, 4000); near(r.total, 12000); near(r.needed, 200000); assert.equal(r.hitYear, null);
  const g = e.plan({ portfolio: 100000, yield: 4, growth: 0, contribution: 0, years: 2, target: 0, reinvest: true });
  near(g.rows[1].income, 104000 * 0.04);
});
