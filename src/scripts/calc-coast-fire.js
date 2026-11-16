// Fin Loom Coast FIRE calculator. Works in today's dollars with a real return
// r = (1 + nominal) / (1 + inflation) − 1. FIRE number = annual spending ÷ withdrawal rate; the Coast
// FIRE number today = FIRE number ÷ (1 + r)^years, the amount that could grow to the FIRE number by the
// retirement age with no further contributions.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { age: [16, 80], retire: [30, 85], spending: [1000, 10000000], withdraw: [1, 10], ret: [-5, 15], inflation: [0, 10], invested: [0, 1000000000] };

  function coast(o) {
    const years = o.retire - o.age;
    const r = (1 + o.ret / 100) / (1 + o.inflation / 100) - 1;
    const fire = o.spending / (o.withdraw / 100);
    const target = fire / Math.pow(1 + r, years);
    const projected = o.invested * Math.pow(1 + r, years);
    const rows = [];
    for (let y = 0; y <= years; y += 1) if (y % 5 === 0 || y === years) rows.push({ age: o.age + y, balance: o.invested * Math.pow(1 + r, y), needed: fire / Math.pow(1 + r, years - y) });
    return { years, real: r, fire, target, projected, gap: projected - fire, reached: o.invested >= target, rows };
  }

  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;

  function summary(o, r) {
    const base = `To spend ${kit.money(o.spending)} a year at a ${kit.number(o.withdraw, 1)}% withdrawal rate, you would need about ${kit.money(r.fire)} at age ${o.retire}, in today's dollars. Your Coast FIRE number today is ${kit.money(r.target)}.`;
    return r.reached ? `${base} Your ${kit.money(o.invested)} already meets it under these assumptions, so it could grow to the goal without new contributions.` : `${base} You are ${kit.money(r.target - o.invested)} short of coasting under these assumptions.`;
  }

  function outputs(o, r) {
    return { big: kit.money(r.target), fire: kit.money(r.fire), projected: kit.money(r.projected), gap: signed(r.gap), real: kit.percent(r.real, 2), status: r.reached ? 'Coast FIRE reached' : `${kit.money(r.target - o.invested)} to go`, years: `${r.years} years` };
  }

  function tableRows(r) {
    return r.rows.map(x => `<tr><th scope="row">${x.age}</th><td class="num">${kit.money(x.balance)}</td><td class="num">${kit.money(x.needed)}</td></tr>`).join('');
  }

  function check(o) {
    const m = {};
    for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: k === 'age' || k === 'retire' });
    if (!m.retire && !m.age && o.retire <= o.age) m.retire = 'Enter a retirement age above your current age.';
    return m;
  }

  const engine = { LIMITS, coast, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('coast-fire', box => {
    const form = box.querySelector('form');
    const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = coast(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
