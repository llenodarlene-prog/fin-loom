// Fin Loom car refinance calculator. Compares the payment and remaining interest on the current auto loan with a new loan for the same balance plus any fees rolled in.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { balance: [500, 10000000], rate: [0, 40], months: [1, 120], newRate: [0, 40], newMonths: [6, 120], fees: [0, 100000] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return b <= 0 ? 0 : i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };
  const bal = (b, rate, n, k) => { const i = rate / 1200; const p = pmt(b, rate, n); return i === 0 ? b - p * k : b * Math.pow(1 + i, k) - p * (Math.pow(1 + i, k) - 1) / i; };
  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;
  function calc(o) {
    const oldPay = pmt(o.balance, o.rate, o.months); const principal = o.balance + o.fees;
    const newPay = pmt(principal, o.newRate, o.newMonths);
    const oldInterest = oldPay * o.months - o.balance; const newInterest = newPay * o.newMonths - principal;
    return { oldPay, newPay, savings: oldPay - newPay, oldInterest, newInterest, change: oldPay * o.months - newPay * o.newMonths };
  }
  function summary(o, r) {
    return `Refinancing ${kit.money(o.balance)} from ${kit.number(o.rate, 2)}% with ${o.months} payments left to ${kit.number(o.newRate, 2)}% over ${o.newMonths} months changes the payment from ${kit.money(r.oldPay)} to ${kit.money(r.newPay)}. Total remaining payments ${r.change >= 0 ? 'fall' : 'rise'} by about ${kit.money(Math.abs(r.change))}, including ${kit.money(o.fees)} of fees added to the loan.`;
  }
  function outputs(o, r) {
    return { big: signed(r.savings), oldPay: kit.money(r.oldPay), newPay: kit.money(r.newPay), oldInterest: kit.money(r.oldInterest), newInterest: kit.money(r.newInterest), change: signed(r.change) };
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: ["months", "newMonths"].includes(k) });
    return m;
  }

  const engine = { LIMITS, pmt, bal, calc, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('car-refinance', box => {
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
