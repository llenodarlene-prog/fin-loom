// Fin Loom home affordability calculator. The maximum monthly housing payment is the lower of income × the housing ratio and income × the total debt ratio minus other debts. The price follows from that payment, the down payment, the rate, taxes and insurance.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { income: [1000, 100000000], debts: [0, 1000000], down: [0, 100000000], rate: [0, 20], years: [5, 40], tax: [0, 10], insurance: [0, 100000], front: [10, 60], back: [10, 70] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return b <= 0 ? 0 : i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };
  const bal = (b, rate, n, k) => { const i = rate / 1200; const p = pmt(b, rate, n); return i === 0 ? b - p * k : b * Math.pow(1 + i, k) - p * (Math.pow(1 + i, k) - 1) / i; };
  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;
  function calc(o) {
    const m = o.income / 12; const n = o.years * 12;
    const maxHousing = Math.max(Math.min(m * o.front / 100, m * o.back / 100 - o.debts), 0);
    const i = o.rate / 1200; const factor = i === 0 ? 1 / n : i / (1 - Math.pow(1 + i, -n));
    // housing = (price − down) × factor + price × tax/1200 + insurance/12  →  solve for price
    const price = Math.max((maxHousing - o.insurance / 12 + o.down * factor) / (factor + o.tax / 1200), 0);
    const loan = Math.max(price - o.down, 0);
    return { maxHousing, price, loan, pi: pmt(loan, o.rate, n), limit: m * o.front / 100 <= m * o.back / 100 - o.debts ? 'housing' : 'debt' };
  }
  function summary(o, r) {
    return `With ${kit.money(o.income)} of yearly income and ${kit.money(o.debts)} of monthly debt payments, a ${kit.number(o.front, 0)}% housing ratio and ${kit.number(o.back, 0)}% total debt ratio allow about ${kit.money(r.maxHousing)} a month for housing. With ${kit.money(o.down)} down at ${kit.number(o.rate, 3)}%, that supports a home price of about ${kit.money(r.price)}. The ${r.limit === 'housing' ? 'housing' : 'total debt'} ratio is the limit here.`;
  }
  function outputs(o, r) {
    return { big: kit.money(r.price), maxHousing: kit.money(r.maxHousing), loan: kit.money(r.loan), pi: kit.money(r.pi), limit: r.limit === 'housing' ? 'Housing ratio' : 'Total debt ratio' };
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: ["years"].includes(k) });
    return m;
  }

  const engine = { LIMITS, pmt, bal, calc, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('home-affordability', box => {
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
