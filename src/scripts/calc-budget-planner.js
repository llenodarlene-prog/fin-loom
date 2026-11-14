// Fin Loom budget planner with expense tracking: monthly income, a budget and an actual amount for
// each category, budget-versus-actual variances, a savings rate and a CSV export built in the browser.
// Nothing is stored or sent anywhere.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const CATS = [['housing', 'Housing'], ['utilities', 'Utilities'], ['food', 'Groceries and dining'], ['transport', 'Transportation'], ['insurance', 'Insurance and health'], ['debt', 'Debt payments'], ['saving', 'Savings and investing'], ['fun', 'Personal and fun'], ['misc', 'Other']];
  const LIMITS = { income: [0, 10000000], amount: [0, 10000000] };

  function budget(o) {
    const rows = CATS.map(([k, label]) => { const b = o.budget[k] || 0; const a = o.actual[k] || 0; return { key: k, label, budget: b, actual: a, variance: b - a, share: o.income > 0 ? a / o.income : 0 }; });
    const tb = rows.reduce((s, r) => s + r.budget, 0); const ta = rows.reduce((s, r) => s + r.actual, 0);
    const saved = (o.actual.saving || 0) + Math.max(0, o.income - ta);
    return { rows, totalBudget: tb, totalActual: ta, unbudgeted: o.income - tb, left: o.income - ta, savingsRate: o.income > 0 ? saved / o.income : 0, over: rows.filter(r => r.variance < 0).length };
  }

  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;

  function summary(o, r) {
    return `With ${kit.money(o.income)} of take-home income, you budgeted ${kit.money(r.totalBudget)} and spent ${kit.money(r.totalActual)}. That leaves ${signed(r.left)}${r.over ? `, and ${r.over} categor${r.over === 1 ? 'y is' : 'ies are'} over budget` : ''}.`;
  }

  function outputs(o, r) {
    return { big: signed(r.left), totalBudget: kit.money(r.totalBudget), totalActual: kit.money(r.totalActual), unbudgeted: signed(r.unbudgeted), savingsRate: kit.percent(r.savingsRate, 1), over: `${r.over} of ${CATS.length}` };
  }

  function tableRows(r) {
    return r.rows.map(x => `<tr><th scope="row">${x.label}</th><td class="num">${kit.money(x.budget)}</td><td class="num">${kit.money(x.actual)}</td><td class="num">${signed(x.variance)}</td><td class="num">${kit.percent(x.share, 1)}</td></tr>`).join('');
  }

  function csv(o, r) {
    const q = v => `"${String(v).replace(/"/g, '""')}"`;
    return ['Category,Budget,Actual,Difference', ...r.rows.map(x => [q(x.label), x.budget.toFixed(2), x.actual.toFixed(2), x.variance.toFixed(2)].join(',')), ['"Total"', r.totalBudget.toFixed(2), r.totalActual.toFixed(2), (r.totalBudget - r.totalActual).toFixed(2)].join(','), ['"Income"', o.income.toFixed(2), '', ''].join(',')].join('\n');
  }

  function check(o) {
    const m = { income: kit.range(o.income, ...LIMITS.income) };
    CATS.forEach(([k]) => { m[`b${k}`] = kit.range(o.budget[k], ...LIMITS.amount); m[`a${k}`] = kit.range(o.actual[k], ...LIMITS.amount); });
    return m;
  }

  const engine = { CATS, LIMITS, budget, summary, outputs, tableRows, csv, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('budget-planner', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const opt = n => (f(n).value.trim() === '' ? 0 : kit.num(f(n)));
    let last = null;
    const run = () => {
      const o = { income: opt('income'), budget: {}, actual: {} };
      CATS.forEach(([k]) => { o.budget[k] = opt(`b${k}`); o.actual[k] = opt(`a${k}`); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(msg).map(k => [f(k), msg[k]]))) return;
      const r = budget(o); const values = outputs(o, r); last = [o, r];
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    const btn = box.querySelector('[data-csv]');
    if (btn) btn.addEventListener('click', () => {
      if (!last) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv(...last)], { type: 'text/csv' }));
      a.download = 'finloom-budget.csv'; document.body.appendChild(a); a.click(); a.remove();
    });
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
