// Fin Loom CAGR calculator: compound annual growth rate = (ending ÷ beginning)^(1 ÷ years) − 1, with
// the steady path that rate implies and the total change over the period.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { begin: [0.01, 1000000000000], end: [0, 1000000000000], years: [0.1, 100] };

  function cagr(o) {
    const rate = Math.pow(o.end / o.begin, 1 / o.years) - 1;
    const rows = [];
    const whole = Math.floor(o.years);
    for (let y = 0; y <= whole; y += 1) rows.push({ year: y, value: o.begin * Math.pow(1 + rate, y) });
    if (whole !== o.years) rows.push({ year: o.years, value: o.end });
    return { rate, total: o.end / o.begin - 1, gain: o.end - o.begin, doubling: rate > 0 ? Math.log(2) / Math.log(1 + rate) : null, rows };
  }

  function summary(o, r) {
    return `Growing from ${kit.money(o.begin)} to ${kit.money(o.end)} over ${kit.number(o.years, o.years % 1 ? 1 : 0)} years is a compound annual growth rate of ${kit.percent(r.rate, 2)}. The total change was ${kit.percent(r.total, 1)}.`;
  }

  function outputs(o, r) {
    return { big: kit.percent(r.rate, 2), total: kit.percent(r.total, 2), gain: `${r.gain < 0 ? '−' : ''}${kit.money(Math.abs(r.gain))}`, doubling: r.doubling ? `${kit.number(r.doubling, 1)} years` : 'Does not double at this rate' };
  }

  function tableRows(r) {
    return r.rows.map(x => `<tr><th scope="row">${kit.number(x.year, x.year % 1 ? 1 : 0)}</th><td class="num">${kit.money(x.value)}</td></tr>`).join('');
  }

  function check(o) {
    return { begin: kit.range(o.begin, ...LIMITS.begin), end: kit.range(o.end, ...LIMITS.end), years: kit.range(o.years, ...LIMITS.years) };
  }

  const engine = { LIMITS, cagr, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('cagr', box => {
    const form = box.querySelector('form');
    const f = n => form.elements[n];
    const run = () => {
      const o = { begin: kit.num(f('begin')), end: kit.num(f('end')), years: kit.num(f('years')) };
      const msg = check(o);
      if (!kit.errors(form, ['begin', 'end', 'years'].map(k => [f(k), msg[k]]))) return;
      const r = cagr(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
