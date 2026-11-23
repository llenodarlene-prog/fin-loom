// Fin Loom salary to hourly calculator. Hourly pay = annual salary ÷ (paid hours per week × paid weeks
// per year). Also shows daily, weekly, biweekly and monthly equivalents, and an effective hourly rate
// for the hours actually worked after paid days off.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { salary: [1, 100000000], hours: [1, 100], days: [1, 7], weeks: [1, 52], pto: [0, 260] };

  function convert(o) {
    const paidHours = o.hours * o.weeks;
    const hourly = o.salary / paidHours;
    const dayHours = o.hours / o.days;
    const workedHours = Math.max(paidHours - o.pto * dayHours, 0);
    return { hourly, daily: hourly * dayHours, weekly: o.salary / o.weeks, biweekly: o.salary / o.weeks * 2, monthly: o.salary / 12, paidHours, workedHours, effective: workedHours > 0 ? o.salary / workedHours : null };
  }

  function summary(o, r) {
    const eff = r.effective === null ? '' : ` After ${kit.number(o.pto, 0)} paid days off, the pay per hour actually worked is about ${kit.money(r.effective)}.`;
    return `A salary of ${kit.money(o.salary)} for ${kit.number(o.hours, 1)} hours a week over ${kit.number(o.weeks, 0)} paid weeks works out to about ${kit.money(r.hourly)} an hour, before taxes.${eff}`;
  }

  function outputs(o, r) {
    return { big: kit.money(r.hourly), daily: kit.money(r.daily), weekly: kit.money(r.weekly), biweekly: kit.money(r.biweekly), monthly: kit.money(r.monthly), paidHours: kit.number(r.paidHours, 0), effective: r.effective === null ? 'Not available' : kit.money(r.effective) };
  }

  function tableRows(o) {
    return [30000, 40000, 50000, 60000, 75000, 100000, 125000, 150000].map(s => `<tr><th scope="row">${kit.money(s)}</th><td class="num">${kit.money(s / (o.hours * o.weeks))}</td><td class="num">${kit.money(s / 12)}</td></tr>`).join('');
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k]);
    if (!m.pto && !m.days && !m.weeks && o.pto > o.days * o.weeks) m.pto = 'Paid days off cannot be more than the paid workdays in a year.';
    return m;
  }

  const engine = { LIMITS, convert, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('salary-hourly', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = convert(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(o);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
