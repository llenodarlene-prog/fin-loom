// Fin Loom required minimum distribution calculator. RMD for a year = prior December 31 balance ÷ the
// distribution period for the owner's age that year from IRS Publication 590-B, Appendix B, Table III
// (Uniform Lifetime). The projection grows the remaining balance at an assumed return each year.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  // Ages 72 to 120 (120 and over use 2.0).
  const TABLE = [27.4, 26.5, 25.5, 24.6, 23.7, 22.9, 22.0, 21.1, 20.2, 19.4, 18.5, 17.7, 16.8, 16.0, 15.2, 14.4, 13.7, 12.9, 12.2, 11.5, 10.8, 10.1, 9.5, 8.9, 8.4, 7.8, 7.3, 6.8, 6.4, 6.0, 5.6, 5.2, 4.9, 4.6, 4.3, 4.1, 3.9, 3.7, 3.5, 3.4, 3.3, 3.1, 3.0, 2.9, 2.8, 2.7, 2.5, 2.3, 2.0];
  const LIMITS = { balance: [0, 1000000000], age: [72, 120], ret: [-10, 15], years: [1, 30] };
  const period = age => TABLE[Math.min(Math.max(age, 72), 120) - 72];

  function rmd(o) {
    const rows = []; let balance = o.balance;
    for (let i = 0; i < o.years && o.age + i <= 120; i += 1) {
      const age = o.age + i; const p = period(age); const dist = balance / p;
      rows.push({ age, balance, period: p, rmd: dist, pct: 1 / p });
      balance = (balance - dist) * (1 + o.ret / 100);
    }
    return { first: rows[0], rows };
  }

  function summary(o, r) {
    const f = r.first;
    return `At age ${o.age}, the IRS Uniform Lifetime Table gives a distribution period of ${kit.number(f.period, 1)}. Dividing a ${kit.money(o.balance)} prior year-end balance by ${kit.number(f.period, 1)} gives a required minimum distribution of about ${kit.money(f.rmd)}, or ${kit.percent(f.pct, 2)} of the balance.`;
  }

  function outputs(o, r) {
    const f = r.first;
    return { big: kit.money(f.rmd), period: kit.number(f.period, 1), pct: kit.percent(f.pct, 2), monthly: kit.money(f.rmd / 12), total: kit.money(r.rows.reduce((s, x) => s + x.rmd, 0)) };
  }

  function tableRows(r) {
    return r.rows.map(x => `<tr><th scope="row">${x.age}</th><td class="num">${kit.money(x.balance)}</td><td class="num">${kit.number(x.period, 1)}</td><td class="num">${kit.money(x.rmd)}</td></tr>`).join('');
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: k === 'age' || k === 'years' }); return m;
  }

  const engine = { TABLE, LIMITS, period, rmd, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('rmd', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = rmd(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
