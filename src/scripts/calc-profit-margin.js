// Fin Loom profit margin calculator. Gross profit = price − cost. Margin = profit ÷ price. Markup =
// profit ÷ cost. Price for a target margin = cost ÷ (1 − target margin).
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { cost: [0, 1000000000], price: [0.01, 1000000000], units: [1, 100000000], target: [0, 99] };

  function margin(o) {
    const profit = o.price - o.cost;
    return { profit, margin: profit / o.price, markup: o.cost > 0 ? profit / o.cost : null, revenue: o.price * o.units, totalCost: o.cost * o.units, totalProfit: profit * o.units, targetPrice: o.cost / (1 - o.target / 100) };
  }

  const pct = v => v === null ? 'Not defined' : `${kit.number(v * 100, 2)}%`;
  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;

  function summary(o, r) {
    const mk = r.markup === null ? '' : ` and a ${pct(r.markup)} markup on cost`;
    return `Selling at ${kit.money(o.price)} with a cost of ${kit.money(o.cost)} leaves ${signed(r.profit)} of gross profit per unit, a ${pct(r.margin)} margin${mk}. To reach a ${kit.number(o.target, 1)}% margin, the price would need to be about ${kit.money(r.targetPrice)}.`;
  }

  function outputs(o, r) {
    return { big: pct(r.margin), profit: signed(r.profit), markup: pct(r.markup), revenue: kit.money(r.revenue), totalProfit: signed(r.totalProfit), targetPrice: kit.money(r.targetPrice) };
  }

  function tableRows(o) {
    return [10, 20, 25, 30, 40, 50, 60].map(t => `<tr><th scope="row">${t}%</th><td class="num">${kit.money(o.cost / (1 - t / 100))}</td><td class="num">${kit.number(t / (100 - t) * 100, 1)}%</td></tr>`).join('');
  }

  function check(o) { const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: k === 'units' }); return m; }

  const engine = { LIMITS, margin, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('profit-margin', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = margin(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(o);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
