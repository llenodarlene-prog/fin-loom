// Fin Loom crypto portfolio allocation tool: current crypto weight in a total portfolio, the change
// needed to reach a chosen target weight, and what different crypto price moves would do to the whole
// portfolio. It shows exposure only; it does not suggest any allocation.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { other: [0, 10000000000], crypto: [0, 10000000000], target: [0, 100], drop: [0, 100] };

  function allocate(o) {
    const total = o.other + o.crypto;
    const weight = total > 0 ? o.crypto / total : 0;
    const change = o.target / 100 * total - o.crypto;
    const afterDrop = o.other + o.crypto * (1 - o.drop / 100);
    return { total, weight, change, afterDrop, portfolioMove: total > 0 ? afterDrop / total - 1 : 0 };
  }

  function summary(o, r) {
    return `Crypto is ${kit.percent(r.weight, 1)} of your ${kit.money(r.total)} portfolio. Reaching ${kit.number(o.target, 1)}% would mean ${r.change >= 0 ? 'adding' : 'reducing'} about ${kit.money(Math.abs(r.change))} of crypto. If crypto fell ${kit.number(o.drop, 0)}%, the whole portfolio would fall about ${kit.percent(-r.portfolioMove, 1)}.`;
  }

  function outputs(o, r) {
    return { big: kit.percent(r.weight, 1), total: kit.money(r.total), change: `${r.change >= 0 ? 'Add ' : 'Reduce '}${kit.money(Math.abs(r.change))}`, afterDrop: kit.money(r.afterDrop), portfolioMove: `${r.portfolioMove < 0 ? '−' : '+'}${kit.percent(Math.abs(r.portfolioMove), 1)}` };
  }

  function tableRows(o) {
    const total = o.other + o.crypto;
    return [-80, -50, -25, 0, 25, 50, 100].map(c => { const v = o.other + o.crypto * (1 + c / 100); return `<tr><th scope="row">${c > 0 ? '+' : c < 0 ? '−' : ''}${Math.abs(c)}%</th><td class="num">${kit.money(v)}</td><td class="num">${total > 0 ? `${v / total - 1 < 0 ? '−' : '+'}${kit.percent(Math.abs(v / total - 1), 1)}` : '—'}</td></tr>`; }).join('');
  }

  function check(o) { const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k]); return m; }

  const engine = { LIMITS, allocate, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('crypto-allocation', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = allocate(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(o);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
