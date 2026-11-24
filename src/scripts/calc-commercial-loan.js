// Fin Loom commercial loan calculator. The payment is based on the amortization period; if the loan term is shorter, the remaining balance is due as a balloon payment at the end of the term.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { amount: [1000, 1000000000], rate: [0, 30], amort: [1, 40], term: [1, 40] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return b <= 0 ? 0 : i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };
  const bal = (b, rate, n, k) => { const i = rate / 1200; const p = pmt(b, rate, n); return i === 0 ? b - p * k : b * Math.pow(1 + i, k) - p * (Math.pow(1 + i, k) - 1) / i; };
  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;
  function calc(o) {
    const n = o.amort * 12; const k = Math.min(o.term, o.amort) * 12;
    const pay = pmt(o.amount, o.rate, n); const balloon = o.term >= o.amort ? 0 : Math.max(bal(o.amount, o.rate, n, k), 0);
    const paid = pay * k; const interest = paid + balloon - o.amount;
    return { pay, balloon, paid, interest, total: paid + balloon };
  }
  function summary(o, r) {
    const b = r.balloon > 0 ? ` After ${o.term} years, a balloon payment of about ${kit.money(r.balloon)} is due.` : ' The loan is fully repaid over the term, so there is no balloon payment.';
    return `A ${kit.money(o.amount)} loan at ${kit.number(o.rate, 3)}% amortized over ${o.amort} years has a payment of about ${kit.money(r.pay)} a month.${b} Interest over the term is about ${kit.money(r.interest)}.`;
  }
  function outputs(o, r) {
    return { big: kit.money(r.pay), balloon: kit.money(r.balloon), paid: kit.money(r.paid), interest: kit.money(r.interest), total: kit.money(r.total) };
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: ["amort", "term"].includes(k) });
    return m;
  }

  const engine = { LIMITS, pmt, bal, calc, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('commercial-loan', box => {
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
