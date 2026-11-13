// Fin Loom emergency fund calculator: a savings target from essential monthly expenses, the gap from
// current savings, and how many months regular deposits (with optional interest) take to close it.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { expenses: [1, 1000000], months: [1, 24], saved: [0, 100000000], deposit: [0, 1000000], apy: [0, 20] };
  const MAX_MONTHS = 600;

  // Each month: balance grows at the monthly equivalent of the APY, then the deposit is added.
  function plan(o) {
    const target = o.expenses * o.months;
    const shortfall = Math.max(0, target - o.saved);
    const rate = Math.pow(1 + o.apy / 100, 1 / 12) - 1;
    const rows = [];
    let balance = o.saved; let month = 0; let deposits = 0;
    while (balance < target && month < MAX_MONTHS && (o.deposit > 0 || rate > 0 && balance > 0)) {
      month += 1;
      balance = balance * (1 + rate) + o.deposit;
      deposits += o.deposit;
      if (month % 3 === 0 || balance >= target) rows.push({ month, balance, progress: Math.min(1, balance / target) });
    }
    const reached = balance >= target;
    return { target, shortfall, reached: o.saved >= target || reached, monthsToGoal: o.saved >= target ? 0 : reached ? month : null, deposits, interest: reached ? balance - o.saved - deposits : 0, rows, covered: o.saved / o.expenses, progress: Math.min(1, o.saved / target) };
  }

  const duration = m => (m < 12 ? `${m} month${m === 1 ? '' : 's'}` : `${m} months (about ${kit.number(m / 12, 1)} years)`);

  function summary(o, r) {
    const base = `Covering ${o.months} months of ${kit.money(o.expenses)} in essential expenses means a target of ${kit.money(r.target)}.`;
    if (r.monthsToGoal === 0) return `${base} Your current savings of ${kit.money(o.saved)} already meet it.`;
    if (r.monthsToGoal === null) return `${base} You are ${kit.money(r.shortfall)} short. Add a monthly deposit to see when you could reach it.`;
    return `${base} You are ${kit.money(r.shortfall)} short. Saving ${kit.money(o.deposit)} a month, you could reach it in about ${duration(r.monthsToGoal)}.`;
  }

  function outputs(o, r) {
    return {
      big: kit.money(r.target), shortfall: kit.money(r.shortfall),
      covered: `${kit.number(r.covered, 1)} months`, progress: kit.percent(r.progress, 0),
      time: r.monthsToGoal === 0 ? 'Goal already met' : r.monthsToGoal === null ? 'Not reached at this deposit' : duration(r.monthsToGoal),
      interest: kit.money(r.interest)
    };
  }

  function tableRows(r) {
    return r.rows.map(row => `<tr><th scope="row">${row.month}</th><td class="num">${kit.money(row.balance)}</td><td class="num">${kit.percent(row.progress, 0)}</td></tr>`).join('');
  }

  function check(o) {
    return {
      expenses: kit.range(o.expenses, ...LIMITS.expenses), months: kit.range(o.months, ...LIMITS.months, { integer: true }),
      saved: kit.range(o.saved, ...LIMITS.saved), deposit: kit.range(o.deposit, ...LIMITS.deposit), apy: kit.range(o.apy, ...LIMITS.apy)
    };
  }

  const engine = { LIMITS, MAX_MONTHS, plan, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('emergency-fund', box => {
    const form = box.querySelector('form');
    const f = name => form.elements[name];
    const opt = name => (f(name).value.trim() === '' ? 0 : kit.num(f(name)));
    const run = () => {
      const o = { expenses: kit.num(f('expenses')), months: kit.num(f('months')), saved: opt('saved'), deposit: opt('deposit'), apy: opt('apy') };
      const msg = check(o);
      if (!kit.errors(form, ['expenses', 'months', 'saved', 'deposit', 'apy'].map(k => [f(k), msg[k]]))) return;
      const r = plan(o);
      const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
