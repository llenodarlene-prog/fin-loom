// Fin Loom 401(k) calculator. Projects a 401(k) balance from employee contributions, an employer match, salary growth and a steady return, compounded monthly.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { age: [16, 80], retire: [30, 85], salary: [1000, 10000000], balance: [0, 100000000], contrib: [0, 100], match: [0, 200], matchLimit: [0, 100], raise: [0, 20], ret: [0, 20] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return b <= 0 ? 0 : i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };
  const bal = (b, rate, n, k) => { const i = rate / 1200; const p = pmt(b, rate, n); return i === 0 ? b - p * k : b * Math.pow(1 + i, k) - p * (Math.pow(1 + i, k) - 1) / i; };
  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;
  function calc(o) {
    const years = o.retire - o.age; let b = o.balance; let s = o.salary; let mine = 0; let theirs = 0; const rows = [];
    const i = Math.pow(1 + o.ret / 100, 1 / 12) - 1;
    for (let y = 1; y <= years; y++) {
      const c = s * o.contrib / 100; const e = s * Math.min(o.contrib, o.matchLimit) / 100 * o.match / 100;
      for (let m = 0; m < 12; m++) b = b * (1 + i) + (c + e) / 12;
      mine += c; theirs += e; rows.push({ age: o.age + y, mine, theirs, balance: b }); s *= 1 + o.raise / 100;
    }
    return { years, end: b, mine, theirs, growth: b - o.balance - mine - theirs, rows };
  }
  function summary(o, r) {
    return `Contributing ${kit.number(o.contrib, 1)}% of a ${kit.money(o.salary)} salary with a ${kit.number(o.match, 0)}% match on up to ${kit.number(o.matchLimit, 1)}% of pay, and earning ${kit.number(o.ret, 1)}% a year, could grow your 401(k) to about ${kit.money(r.end)} by age ${o.retire}. That includes ${kit.money(r.mine)} from you, ${kit.money(r.theirs)} from your employer and ${kit.money(r.growth)} of investment growth.`;
  }
  function outputs(o, r) {
    return { big: kit.money(r.end), mine: kit.money(r.mine), theirs: kit.money(r.theirs), growth: kit.money(r.growth), years: `${r.years} years` };
  }

  function tableRows(o, r) {
    return r.rows.filter((x, k) => (k + 1) % 5 === 0 || k === r.rows.length - 1).map(x => `<tr><th scope="row">${x.age}</th><td class="num">${kit.money(x.mine)}</td><td class="num">${kit.money(x.theirs)}</td><td class="num">${kit.money(x.balance)}</td></tr>`).join('');
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: ["age", "retire"].includes(k) });
    if (!m.age && !m.retire && o.retire <= o.age) m.retire = 'Retirement age must be above your current age.';
    return m;
  }

  const engine = { LIMITS, pmt, bal, calc, summary, outputs, check, tableRows };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('401k', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = calc(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(o, r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
