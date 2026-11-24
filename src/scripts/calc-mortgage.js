// Fin Loom mortgage calculator. Principal and interest from the standard amortization formula, plus monthly property tax, homeowners insurance, HOA dues and private mortgage insurance (PMI) when the down payment is under 20%.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { price: [10000, 100000000], down: [0, 100], rate: [0, 20], years: [5, 40], tax: [0, 10], insurance: [0, 100000], hoa: [0, 100000], pmi: [0, 5] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return b <= 0 ? 0 : i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };
  const bal = (b, rate, n, k) => { const i = rate / 1200; const p = pmt(b, rate, n); return i === 0 ? b - p * k : b * Math.pow(1 + i, k) - p * (Math.pow(1 + i, k) - 1) / i; };
  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;
  function calc(o) {
    const loan = o.price * (1 - o.down / 100); const n = o.years * 12;
    const pi = pmt(loan, o.rate, n); const taxM = o.price * o.tax / 100 / 12; const insM = o.insurance / 12;
    const pmiM = o.down < 20 ? loan * o.pmi / 100 / 12 : 0;
    return { loan, downAmt: o.price - loan, pi, taxM, insM, pmiM, hoa: o.hoa, total: pi + taxM + insM + pmiM + o.hoa, interest: pi * n - loan };
  }
  function summary(o, r) {
    return `A ${kit.money(o.price)} home with ${kit.number(o.down, 1)}% down means a ${kit.money(r.loan)} loan. At ${kit.number(o.rate, 3)}% for ${o.years} years, principal and interest is about ${kit.money(r.pi)} a month. With taxes, insurance${r.pmiM > 0 ? ', PMI' : ''} and HOA dues, the total monthly payment is about ${kit.money(r.total)}.`;
  }
  function outputs(o, r) {
    return { big: kit.money(r.total), pi: kit.money(r.pi), taxM: kit.money(r.taxM), insM: kit.money(r.insM), pmiM: kit.money(r.pmiM), hoa: kit.money(r.hoa), loan: kit.money(r.loan), interest: kit.money(r.interest) };
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: ["years"].includes(k) });
    return m;
  }

  const engine = { LIMITS, pmt, bal, calc, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('mortgage', box => {
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
