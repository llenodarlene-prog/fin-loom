// Fin Loom home equity loan calculator. Available equity = home value × maximum combined loan-to-value (CLTV) − mortgage balance. Payment uses the standard amortization formula.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { value: [10000, 100000000], mortgage: [0, 100000000], cltv: [10, 100], amount: [100, 100000000], rate: [0, 30], years: [1, 30] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return b <= 0 ? 0 : i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };
  const bal = (b, rate, n, k) => { const i = rate / 1200; const p = pmt(b, rate, n); return i === 0 ? b - p * k : b * Math.pow(1 + i, k) - p * (Math.pow(1 + i, k) - 1) / i; };
  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;
  function calc(o) {
    const available = Math.max(o.value * o.cltv / 100 - o.mortgage, 0);
    const n = o.years * 12; const pay = pmt(o.amount, o.rate, n);
    return { available, newCltv: (o.mortgage + o.amount) / o.value, equity: o.value - o.mortgage, pay, interest: pay * n - o.amount, fits: o.amount <= available + 1e-9 };
  }
  function summary(o, r) {
    const fit = r.fits ? 'fits within' : 'is more than';
    return `With a ${kit.money(o.value)} home and a ${kit.money(o.mortgage)} mortgage, a ${kit.number(o.cltv, 0)}% combined loan-to-value limit leaves about ${kit.money(r.available)} you could borrow. A ${kit.money(o.amount)} loan ${fit} that amount and costs about ${kit.money(r.pay)} a month at ${kit.number(o.rate, 2)}% for ${o.years} years.`;
  }
  function outputs(o, r) {
    return { big: kit.money(r.pay), available: kit.money(r.available), equity: kit.money(r.equity), newCltv: `${kit.number(r.newCltv * 100, 1)}%`, interest: kit.money(r.interest), fits: r.fits ? 'Yes' : 'No, above the limit' };
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: ["years"].includes(k) });
    return m;
  }

  const engine = { LIMITS, pmt, bal, calc, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('home-equity-loan', box => {
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
