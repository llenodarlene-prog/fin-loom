// Fin Loom Social Security break-even calculator. The user enters the monthly benefit shown on their
// own Social Security statement for two claiming ages. Cumulative benefits are summed month by month
// (with an optional annual cost-of-living adjustment applied to both) to find the age at which the
// later claim's running total catches up with the earlier one.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { early: [62, 70], late: [62, 70], earlyBenefit: [1, 100000], lateBenefit: [1, 100000], cola: [0, 10], horizon: [70, 100] };

  function breakeven(o) {
    let a = 0; let b = 0; let crossAge = null; const rows = [];
    const g = o.cola / 100;
    for (let m = o.early * 12; m < o.horizon * 12; m += 1) {
      const yrs = Math.floor((m - o.early * 12) / 12);
      a += o.earlyBenefit * Math.pow(1 + g, yrs);
      if (m >= o.late * 12) b += o.lateBenefit * Math.pow(1 + g, yrs);
      if (crossAge === null && m >= o.late * 12 && b >= a) crossAge = (m + 1) / 12;
      if ((m + 1) % 12 === 0) rows.push({ age: (m + 1) / 12, early: a, late: b });
    }
    return { crossAge, early: a, late: b, rows, increase: o.lateBenefit / o.earlyBenefit - 1 };
  }

  const ageText = x => { const y = Math.floor(x + 1e-9); const mo = Math.round((x - y) * 12); return mo ? `${y} years, ${mo} months` : `${y}`; };

  function summary(o, r) {
    const base = `Claiming at ${o.late} instead of ${o.early} raises the monthly benefit from ${kit.money(o.earlyBenefit)} to ${kit.money(o.lateBenefit)}, ${kit.percent(r.increase, 1)} more.`;
    return r.crossAge ? `${base} The later claim's total catches up at about age ${ageText(r.crossAge)}. If you live past that age, waiting pays more in total under these assumptions.` : `${base} The later claim does not catch up before age ${o.horizon} under these assumptions.`;
  }

  function outputs(o, r) {
    return { big: r.crossAge ? `Age ${ageText(r.crossAge)}` : `Not before ${o.horizon}`, increase: kit.percent(r.increase, 1), early: kit.money(r.early), late: kit.money(r.late), diff: `${r.late - r.early < 0 ? '−' : ''}${kit.money(Math.abs(r.late - r.early))}` };
  }

  function tableRows(r) {
    return r.rows.filter((x, i) => i % 2 === 1 || i === r.rows.length - 1).map(x => `<tr><th scope="row">${x.age}</th><td class="num">${kit.money(x.early)}</td><td class="num">${kit.money(x.late)}</td></tr>`).join('');
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: ['early', 'late', 'horizon'].includes(k) });
    if (!m.late && !m.early && o.late <= o.early) m.late = 'Enter a later claiming age than the first one.';
    if (!m.horizon && o.horizon <= o.late) m.horizon = 'Enter an age after the later claiming age.';
    return m;
  }

  const engine = { LIMITS, breakeven, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('ss-breakeven', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = breakeven(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
