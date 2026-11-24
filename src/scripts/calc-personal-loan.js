// Fin Loom personal loan calculator. Payment on the full loan amount at the stated rate; an origination
// fee deducted from the proceeds lowers the cash received, and the APR is the rate that equates the cash
// received with the payment stream (solved by bisection).
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { amount: [100, 10000000], rate: [0, 40], years: [0.5, 10], fee: [0, 15] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };
  const pv = (pay, rate, n) => { const i = rate / 1200; return i === 0 ? pay * n : pay * (1 - Math.pow(1 + i, -n)) / i; };

  function apr(cash, pay, n) {
    if (cash >= pay * n) return 0;
    let lo = 0; let hi = 200;
    for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (pv(pay, mid, n) > cash) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }

  function loan(o) {
    const n = Math.round(o.years * 12); const pay = pmt(o.amount, o.rate, n);
    const feeAmt = o.amount * o.fee / 100; const cash = o.amount - feeAmt;
    const total = pay * n;
    return { n, pay, feeAmt, cash, total, interest: total - o.amount, cost: total - cash, apr: apr(cash, pay, n), needed: o.fee < 100 ? o.amount / (1 - o.fee / 100) : null };
  }

  function summary(o, r) {
    return `A ${kit.money(o.amount)} personal loan at ${kit.number(o.rate, 2)}% for ${kit.number(o.years, 1)} years costs about ${kit.money(r.pay)} a month. A ${kit.number(o.fee, 2)}% origination fee of ${kit.money(r.feeAmt)} means you receive ${kit.money(r.cash)}, which puts the APR at about ${kit.number(r.apr, 2)}%. Total borrowing cost is ${kit.money(r.cost)}.`;
  }

  function outputs(o, r) {
    return { big: kit.money(r.pay), apr: `${kit.number(r.apr, 2)}%`, feeAmt: kit.money(r.feeAmt), cash: kit.money(r.cash), interest: kit.money(r.interest), cost: kit.money(r.cost), needed: r.needed === null ? 'Not available' : kit.money(r.needed) };
  }

  function check(o) { const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k]); return m; }

  const engine = { LIMITS, pmt, pv, apr, loan, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('personal-loan', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = loan(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
