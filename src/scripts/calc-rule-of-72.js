// Fin Loom Rule of 72 calculator: years to double ≈ 72 ÷ rate (in percent), compared with the exact
// answer ln 2 ÷ ln(1 + rate) for annual compounding, and the reverse: the rate needed to double in a
// given number of years.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { rate: [0.1, 100], years: [0.5, 100] };

  const exactYears = rate => Math.log(2) / Math.log(1 + rate / 100);
  const exactRate = years => (Math.pow(2, 1 / years) - 1) * 100;

  function rule(o) {
    return { approx: 72 / o.rate, exact: exactYears(o.rate), r70: 70 / o.rate, approxRate: 72 / o.years, exactRate: exactRate(o.years), error: 72 / o.rate - exactYears(o.rate) };
  }

  function summary(o, r) {
    return `At ${kit.number(o.rate, 2)}% a year, the Rule of 72 says money doubles in about ${kit.number(r.approx, 1)} years. The exact answer with annual compounding is ${kit.number(r.exact, 2)} years. To double in ${kit.number(o.years, 1)} years, you would need about ${kit.number(r.exactRate, 2)}% a year.`;
  }

  function outputs(o, r) {
    return { big: `${kit.number(r.approx, 1)} years`, exact: `${kit.number(r.exact, 2)} years`, r70: `${kit.number(r.r70, 1)} years`, error: `${r.error >= 0 ? '+' : '−'}${kit.number(Math.abs(r.error), 2)} years`, approxRate: `${kit.number(r.approxRate, 2)}%`, exactRate: `${kit.number(r.exactRate, 2)}%` };
  }

  function tableRows() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map(p => `<tr><th scope="row">${p}%</th><td class="num">${kit.number(72 / p, 1)}</td><td class="num">${kit.number(exactYears(p), 2)}</td></tr>`).join('');
  }

  function check(o) { return { rate: kit.range(o.rate, ...LIMITS.rate), years: kit.range(o.years, ...LIMITS.years) }; }

  const engine = { LIMITS, exactYears, exactRate, rule, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('rule-of-72', box => {
    const form = box.querySelector('form');
    const f = n => form.elements[n];
    const run = () => {
      const o = { rate: kit.num(f('rate')), years: kit.num(f('years')) };
      const msg = check(o);
      if (!kit.errors(form, ['rate', 'years'].map(k => [f(k), msg[k]]))) return;
      const r = rule(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
