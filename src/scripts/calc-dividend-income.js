// Fin Loom dividend income planner: projects yearly dividend income from a portfolio, a starting
// yield, annual dividend growth, yearly contributions and optional reinvestment, and the portfolio
// size needed for a target income at the starting yield. Share prices are held flat so the projection
// isolates dividends; that is a simplification, not a forecast.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { portfolio: [0, 1000000000], yield: [0.01, 20], growth: [-20, 20], contribution: [0, 10000000], years: [1, 50], target: [0, 100000000] };

  function plan(o) {
    let value = o.portfolio; let y = o.yield / 100; const rows = []; let total = 0;
    for (let yr = 1; yr <= o.years; yr += 1) {
      const income = value * y; total += income;
      rows.push({ year: yr, value, income, yieldOnStart: value > 0 ? income / Math.max(o.portfolio, 1e-9) : 0 });
      value += o.contribution + (o.reinvest ? income : 0);
      y *= 1 + o.growth / 100;
    }
    const needed = o.target / (o.yield / 100);
    const hit = rows.find(r => r.income >= o.target);
    return { rows, first: rows[0].income, last: rows[rows.length - 1].income, total, needed, hitYear: o.target > 0 && hit ? hit.year : null };
  }

  function summary(o, r) {
    const base = `At a ${kit.number(o.yield, 2)}% yield, ${kit.money(o.portfolio)} produces about ${kit.money(r.first)} of dividends in year one. With ${kit.number(o.growth, 1)}% yearly dividend growth${o.contribution ? ` and ${kit.money(o.contribution)} added each year` : ''}${o.reinvest ? ', reinvesting dividends' : ''}, income reaches about ${kit.money(r.last)} in year ${o.years}.`;
    return o.target > 0 ? `${base} A ${kit.money(o.target)} income goal needs about ${kit.money(r.needed)} at today's yield${r.hitYear ? `, which this plan reaches in year ${r.hitYear}` : ''}.` : base;
  }

  function outputs(o, r) {
    return { big: kit.money(r.first), last: kit.money(r.last), total: kit.money(r.total), needed: o.target > 0 ? kit.money(r.needed) : 'No goal entered', hit: o.target > 0 ? (r.hitYear ? `Year ${r.hitYear}` : `Not within ${o.years} years`) : 'No goal entered', monthly: kit.money(r.last / 12) };
  }

  function tableRows(r) {
    return r.rows.filter((x, i) => i < 3 || (i + 1) % 5 === 0 || i === r.rows.length - 1).map(x => `<tr><th scope="row">${x.year}</th><td class="num">${kit.money(x.value)}</td><td class="num">${kit.money(x.income)}</td></tr>`).join('');
  }

  function check(o) { const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: k === 'years' }); return m; }

  const engine = { LIMITS, plan, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('dividend-income', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = { reinvest: f('reinvest').checked }; Object.keys(LIMITS).forEach(k => { o[k] = f(k).value.trim() === '' ? 0 : kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = plan(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
