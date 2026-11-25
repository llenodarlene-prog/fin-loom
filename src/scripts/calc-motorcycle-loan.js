// Fin Loom motorcycle loan calculator. Amount financed = price − down payment − trade-in + sales tax (if financed) +
// fees. Monthly payment uses the standard amortization formula P × i ÷ (1 − (1 + i)^−n).
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { price: [100, 100000000], down: [0, 100000000], trade: [0, 100000000], tax: [0, 20], fees: [0, 1000000], rate: [0, 40], years: [0.5, 10] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return b <= 0 ? 0 : i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };

  function loan(o) {
    const taxable = Math.max(o.price - (true ? o.trade : 0), 0);
    const taxAmt = taxable * o.tax / 100;
    const financed = Math.max(o.price - o.down - o.trade + taxAmt + o.fees, 0);
    const n = Math.round(o.years * 12); const pay = pmt(financed, o.rate, n);
    const total = pay * n;
    return { taxAmt, financed, n, pay, total, interest: total - financed, allIn: total + o.down + o.trade };
  }

  function summary(o, r) {
    return `Financing ${kit.money(r.financed)} on a ${kit.money(o.price)} purchase at ${kit.number(o.rate, 2)}% for ${kit.number(o.years, 1)} years costs about ${kit.money(r.pay)} a month. You would pay ${kit.money(r.interest)} in interest, and the purchase would cost ${kit.money(r.allIn)} in total, counting your down payment${o.trade > 0 ? ' and trade-in' : ''}.`;
  }

  function outputs(o, r) {
    return { big: kit.money(r.pay), financed: kit.money(r.financed), taxAmt: kit.money(r.taxAmt), interest: kit.money(r.interest), total: kit.money(r.total), allIn: kit.money(r.allIn) };
  }

  function tableRows(o) {
    return [2, 3, 4, 5, 6].map(y => { const r = loan({ ...o, years: y }); return `<tr><th scope="row">${y} years</th><td class="num">${kit.money(r.pay)}</td><td class="num">${kit.money(r.interest)}</td></tr>`; }).join('');
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k]);
    if (!m.down && !m.price && !m.trade && o.down + o.trade > o.price) m.down = 'The down payment and trade-in cannot be more than the price.';
    return m;
  }

  const engine = { LIMITS, pmt, loan, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('motorcycle-loan', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = loan(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(o);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
