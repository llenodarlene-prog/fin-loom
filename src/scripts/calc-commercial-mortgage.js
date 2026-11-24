// Fin Loom commercial mortgage calculator. Loan = value × loan-to-value. Payment uses the amortization period; a shorter term leaves a balloon. Debt service coverage ratio (DSCR) = net operating income ÷ yearly debt payments.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { value: [10000, 1000000000], ltv: [10, 90], rate: [0, 30], amort: [5, 40], term: [1, 40], noi: [0, 1000000000] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return b <= 0 ? 0 : i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };
  const bal = (b, rate, n, k) => { const i = rate / 1200; const p = pmt(b, rate, n); return i === 0 ? b - p * k : b * Math.pow(1 + i, k) - p * (Math.pow(1 + i, k) - 1) / i; };
  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;
  function calc(o) {
    const loan = o.value * o.ltv / 100; const n = o.amort * 12; const k = Math.min(o.term, o.amort) * 12;
    const pay = pmt(loan, o.rate, n); const annual = pay * 12;
    const balloon = o.term >= o.amort ? 0 : Math.max(bal(loan, o.rate, n, k), 0);
    return { loan, pay, annual, balloon, dscr: annual > 0 ? o.noi / annual : null, debtYield: loan > 0 ? o.noi / loan : 0, cap: o.noi / o.value };
  }
  function summary(o, r) {
    return `A ${kit.number(o.ltv, 0)}% loan on a ${kit.money(o.value)} property is ${kit.money(r.loan)}. At ${kit.number(o.rate, 3)}% amortized over ${o.amort} years, the payment is about ${kit.money(r.pay)} a month. With ${kit.money(o.noi)} of net operating income, the debt service coverage ratio is ${r.dscr === null ? 'not defined' : kit.number(r.dscr, 2)}.${r.balloon > 0 ? ` A balloon of about ${kit.money(r.balloon)} is due after ${o.term} years.` : ''}`;
  }
  function outputs(o, r) {
    return { big: r.dscr === null ? 'Not defined' : `${kit.number(r.dscr, 2)}x`, loan: kit.money(r.loan), pay: kit.money(r.pay), annual: kit.money(r.annual), balloon: kit.money(r.balloon), debtYield: `${kit.number(r.debtYield * 100, 2)}%`, cap: `${kit.number(r.cap * 100, 2)}%` };
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: ["amort", "term"].includes(k) });
    return m;
  }

  const engine = { LIMITS, pmt, bal, calc, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('commercial-mortgage', box => {
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
