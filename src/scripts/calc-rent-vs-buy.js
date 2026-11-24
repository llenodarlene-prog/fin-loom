// Fin Loom rent vs buy calculator. Compares the net cost of renting and buying over a set period. Buying cost = payments, tax, insurance, maintenance and selling costs minus home equity at the end. Renting cost = rent paid minus growth on the money not spent on a down payment.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { rent: [0, 1000000], rentGrowth: [0, 20], price: [10000, 100000000], down: [0, 100], rate: [0, 20], years: [1, 30], tax: [0, 10], upkeep: [0, 10], growth: [-10, 20], invest: [0, 20], sell: [0, 15] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return b <= 0 ? 0 : i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };
  const bal = (b, rate, n, k) => { const i = rate / 1200; const p = pmt(b, rate, n); return i === 0 ? b - p * k : b * Math.pow(1 + i, k) - p * (Math.pow(1 + i, k) - 1) / i; };
  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;
  function calc(o) {
    const loan = o.price * (1 - o.down / 100); const pay = pmt(loan, o.rate, 360); const months = o.years * 12;
    let rentPaid = 0; let rentM = o.rent; let ownCost = 0; let value = o.price;
    for (let m = 1; m <= months; m++) {
      rentPaid += rentM; if (m % 12 === 0) rentM *= 1 + o.rentGrowth / 100;
      ownCost += pay + value * (o.tax + o.upkeep) / 1200; value *= Math.pow(1 + o.growth / 100, 1 / 12);
    }
    const left = Math.max(bal(loan, o.rate, 360, Math.min(months, 360)), 0);
    const downAmt = o.price - loan; const equity = value * (1 - o.sell / 100) - left;
    const buyNet = downAmt + ownCost - equity;
    const opp = downAmt * (Math.pow(1 + o.invest / 100, o.years) - 1);
    const rentNet = rentPaid - opp;
    return { pay, rentPaid, ownCost, value, equity, buyNet, rentNet, opp, diff: rentNet - buyNet };
  }
  function summary(o, r) {
    const w = r.diff > 0 ? 'buying costs less' : 'renting costs less';
    return `Over ${o.years} years, the net cost of renting is about ${kit.money(r.rentNet)} and the net cost of buying is about ${kit.money(r.buyNet)}, so ${w} by about ${kit.money(Math.abs(r.diff))} under these assumptions. Results are sensitive to home price growth, investment returns and how long you stay.`;
  }
  function outputs(o, r) {
    return { big: r.diff > 0 ? 'Buying' : 'Renting', rentNet: kit.money(r.rentNet), buyNet: kit.money(r.buyNet), diff: kit.money(Math.abs(r.diff)), pay: kit.money(r.pay), value: kit.money(r.value), equity: kit.money(r.equity) };
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: ["years"].includes(k) });
    return m;
  }

  const engine = { LIMITS, pmt, bal, calc, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('rent-vs-buy', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = calc(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
