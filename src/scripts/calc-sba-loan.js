// Fin Loom SBA loan calculator. Monthly payment from the standard amortization formula on the loan amount plus any financed fees, with the total cost of borrowing.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { amount: [1000, 100000000], rate: [0, 30], years: [1, 30], fee: [0, 10], other: [0, 1000000] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return b <= 0 ? 0 : i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };
  const bal = (b, rate, n, k) => { const i = rate / 1200; const p = pmt(b, rate, n); return i === 0 ? b - p * k : b * Math.pow(1 + i, k) - p * (Math.pow(1 + i, k) - 1) / i; };
  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;
  function calc(o) {
    const feeAmt = o.amount * o.fee / 100; const principal = o.amount + feeAmt + o.other; const n = o.years * 12;
    const pay = pmt(principal, o.rate, n); const total = pay * n;
    return { feeAmt, principal, pay, total, interest: total - principal, cost: total - o.amount };
  }
  function summary(o, r) {
    return `Borrowing ${kit.money(o.amount)} with ${kit.money(r.feeAmt + o.other)} of financed fees at ${kit.number(o.rate, 2)}% for ${o.years} years costs about ${kit.money(r.pay)} a month. Total borrowing cost, including interest and fees, is about ${kit.money(r.cost)}.`;
  }
  function outputs(o, r) {
    return { big: kit.money(r.pay), feeAmt: kit.money(r.feeAmt), principal: kit.money(r.principal), interest: kit.money(r.interest), cost: kit.money(r.cost) };
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: ["years"].includes(k) });
    return m;
  }

  const engine = { LIMITS, pmt, bal, calc, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('sba-loan', box => {
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
