// Fin Loom business valuation calculator. Two simple methods: an earnings multiple (earnings × multiple) and capitalized earnings (next year’s earnings ÷ (required return − growth)). Equity value adds cash and subtracts debt.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { earnings: [1, 10000000000], multiple: [0.5, 50], ret: [1, 50], growth: [-10, 20], cash: [0, 10000000000], debt: [0, 10000000000] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return b <= 0 ? 0 : i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };
  const bal = (b, rate, n, k) => { const i = rate / 1200; const p = pmt(b, rate, n); return i === 0 ? b - p * k : b * Math.pow(1 + i, k) - p * (Math.pow(1 + i, k) - 1) / i; };
  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;
  function calc(o) {
    const byMultiple = o.earnings * o.multiple;
    const capOk = o.ret > o.growth; const byCap = capOk ? o.earnings * (1 + o.growth / 100) / ((o.ret - o.growth) / 100) : null;
    return { byMultiple, byCap, eqMultiple: byMultiple + o.cash - o.debt, eqCap: byCap === null ? null : byCap + o.cash - o.debt, implied: byCap === null ? null : byCap / o.earnings };
  }
  function summary(o, r) {
    const cap = r.byCap === null ? ' Capitalized earnings need a required return above the growth rate.' : ` Capitalizing earnings at a ${kit.number(o.ret, 1)}% required return and ${kit.number(o.growth, 1)}% growth gives about ${kit.money(r.byCap)}, an implied multiple of ${kit.number(r.implied, 2)}.`;
    return `At ${kit.number(o.multiple, 2)} times ${kit.money(o.earnings)} of earnings, the business is worth about ${kit.money(r.byMultiple)} before cash and debt.${cap} These are rough estimates for planning, not an appraisal.`;
  }
  function outputs(o, r) {
    return { big: kit.money(r.byMultiple), eqMultiple: signed(r.eqMultiple), byCap: r.byCap === null ? 'Not available' : kit.money(r.byCap), eqCap: r.eqCap === null ? 'Not available' : signed(r.eqCap), implied: r.implied === null ? 'Not available' : `${kit.number(r.implied, 2)}x` };
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: [].includes(k) });
    return m;
  }

  const engine = { LIMITS, pmt, bal, calc, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('business-valuation', box => {
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
