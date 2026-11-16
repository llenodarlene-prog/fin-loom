// Fin Loom debt-to-income calculator. The CFPB defines DTI as all monthly debt payments divided by
// gross monthly income. A housing-only ratio (housing payment ÷ gross income) is shown alongside.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const DEBTS = [['housing', 'Mortgage or rent'], ['auto', 'Auto loans'], ['student', 'Student loans'], ['cards', 'Credit card minimums'], ['other', 'Other debt payments']];
  const LIMITS = { income: [1, 100000000], debt: [0, 10000000] };

  function dti(o) {
    const total = DEBTS.reduce((s, [k]) => s + (o[k] || 0), 0);
    const ratio = total / o.income;
    return { total, ratio, housing: (o.housing || 0) / o.income, leftover: o.income - total, items: DEBTS.map(([k, label]) => ({ label, value: o[k] || 0, share: (o[k] || 0) / o.income })), toTarget: t => Math.max(0, total - t / 100 * o.income) };
  }

  function summary(o, r) {
    return `Monthly debt payments of ${kit.money(r.total)} on gross monthly income of ${kit.money(o.income)} give a debt-to-income ratio of ${kit.percent(r.ratio, 1)}. Housing alone is ${kit.percent(r.housing, 1)} of income.`;
  }

  function outputs(o, r) {
    return { big: kit.percent(r.ratio, 1), total: kit.money(r.total), housing: kit.percent(r.housing, 1), leftover: `${r.leftover < 0 ? '−' : ''}${kit.money(Math.abs(r.leftover))}`, to36: kit.money(r.toTarget(36)) };
  }

  function tableRows(r) {
    return r.items.map(x => `<tr><th scope="row">${x.label}</th><td class="num">${kit.money(x.value)}</td><td class="num">${kit.percent(x.share, 1)}</td></tr>`).join('');
  }

  function check(o) {
    const m = { income: kit.range(o.income, ...LIMITS.income) };
    DEBTS.forEach(([k]) => { m[k] = kit.range(o[k], ...LIMITS.debt); });
    return m;
  }

  const engine = { DEBTS, LIMITS, dti, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('dti', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const opt = n => (f(n).value.trim() === '' ? 0 : kit.num(f(n)));
    const run = () => {
      const annual = f('period').value === 'year';
      const o = { income: annual ? kit.num(f('income')) / 12 : kit.num(f('income')) };
      DEBTS.forEach(([k]) => { o[k] = opt(k); });
      const msg = check(o);
      if (!kit.errors(form, ['income', ...DEBTS.map(([k]) => k)].map(k => [f(k), msg[k]]))) return;
      const r = dti(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
