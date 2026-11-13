// Fin Loom debt snowball and avalanche planner. Each month every debt accrues balance × APR / 12,
// every debt gets its minimum (or what is left of it), and the rest of the monthly budget goes to one
// target debt: the smallest balance (snowball) or the highest APR (avalanche). A paid-off debt's
// minimum rolls into the budget for the next target because the total budget stays fixed.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const SLOTS = 5;
  const CAP = 600;
  const LIMITS = { balance: [0, 10000000], apr: [0, 100], minimum: [0, 1000000], budget: [1, 10000000] };

  function order(debts, strategy) {
    const open = debts.filter(d => d.balance > 0.005);
    return open.sort(strategy === 'avalanche' ? (a, b) => b.apr - a.apr || a.balance - b.balance : (a, b) => a.balance - b.balance || b.apr - a.apr);
  }

  function run(o, strategy) {
    const debts = o.debts.map((d, i) => ({ n: i + 1, balance: d.balance, apr: d.apr, minimum: d.minimum, paidOff: null, interest: 0 })).filter(d => d.balance > 0);
    let month = 0; let interest = 0; let stuck = false;
    const totals = [debts.reduce((s, d) => s + d.balance, 0)];
    while (debts.some(d => d.balance > 0.005) && month < CAP) {
      month += 1;
      let accrued = 0;
      debts.forEach(d => { if (d.balance > 0.005) { const i = d.balance * d.apr / 1200; d.balance += i; d.interest += i; accrued += i; } });
      let cash = o.budget;
      debts.forEach(d => { if (d.balance > 0.005) { const pay = Math.min(d.minimum, d.balance, cash); d.balance -= pay; cash -= pay; } });
      for (const d of order(debts, strategy)) { if (cash <= 0) break; const pay = Math.min(cash, d.balance); d.balance -= pay; cash -= pay; }
      debts.forEach(d => { if (d.balance <= 0.005 && d.paidOff === null) { d.balance = 0; d.paidOff = month; } });
      interest += accrued;
      const total = debts.reduce((s, d) => s + d.balance, 0);
      if (total >= totals[totals.length - 1] - 1e-9) { stuck = true; break; }
      totals.push(total);
    }
    const done = !stuck && debts.every(d => d.balance <= 0.005);
    return { strategy, months: month, interest, done, stuck, capped: !done && !stuck, debts: debts.slice().sort((a, b) => (a.paidOff ?? 1e9) - (b.paidOff ?? 1e9)), totals };
  }

  function plan(o) {
    const snowball = run(o, 'snowball'); const avalanche = run(o, 'avalanche');
    const minimums = o.debts.filter(d => d.balance > 0).reduce((s, d) => s + d.minimum, 0);
    return { snowball, avalanche, chosen: o.strategy === 'avalanche' ? avalanche : snowball, minimums, extra: o.budget - minimums, total: o.debts.reduce((s, d) => s + d.balance, 0) };
  }

  const span = m => { const y = Math.floor(m / 12); const r = m % 12; return [y ? `${y} year${y === 1 ? '' : 's'}` : '', r ? `${r} month${r === 1 ? '' : 's'}` : ''].filter(Boolean).join(', ') || '0 months'; };
  const name = s => (s === 'avalanche' ? 'avalanche' : 'snowball');

  function summary(o, p) {
    const c = p.chosen;
    if (!c.done) return c.stuck ? 'Under these assumptions the monthly budget does not cover the interest and minimums, so the total balance would not fall. Increase the budget.' : 'Under these assumptions the debts would not be paid off within 50 years. Increase the budget.';
    const other = o.strategy === 'avalanche' ? p.snowball : p.avalanche;
    const diff = other.done ? other.interest - c.interest : null;
    const cmp = diff === null ? '' : Math.abs(diff) < 0.5 ? ' The other method costs about the same in this case.' : diff > 0 ? ` That is about ${kit.money(diff)} less interest than the ${name(other.strategy)} method.` : ` The ${name(other.strategy)} method would save about ${kit.money(-diff)} more interest.`;
    return `Paying ${kit.money(o.budget)} a month with the ${name(o.strategy)} method could clear ${kit.money(p.total)} of debt in ${span(c.months)}, with about ${kit.money(c.interest)} of interest.${cmp}`;
  }

  function outputs(o, p) {
    const c = p.chosen; const s = p.snowball; const a = p.avalanche;
    const res = r => (r.done ? `${span(r.months)}, ${kit.money(r.interest)} interest` : 'Not paid off');
    return {
      big: c.done ? span(c.months) : 'Not paid off', interest: c.done ? kit.money(c.interest) : 'Not available',
      minimums: kit.money(p.minimums), extra: p.extra >= 0 ? kit.money(p.extra) : 'Budget is below the minimums',
      first: c.debts[0] && c.debts[0].paidOff ? `Debt ${c.debts[0].n} in month ${c.debts[0].paidOff}` : 'Not available',
      snowball: res(s), avalanche: res(a)
    };
  }

  function tableRows(p) {
    return p.chosen.debts.map((d, i) => `<tr><th scope="row">${i + 1}</th><td>Debt ${d.n} (${kit.number(d.apr, 2)}% APR)</td><td class="num">${d.paidOff ? d.paidOff : 'Not paid off'}</td><td class="num">${kit.money(d.interest)}</td></tr>`).join('');
  }

  function check(o) {
    const msg = { budget: kit.range(o.budget, ...LIMITS.budget) };
    o.debts.forEach((d, i) => {
      const k = i + 1;
      msg[`balance${k}`] = kit.range(d.balance, ...LIMITS.balance);
      msg[`apr${k}`] = kit.range(d.apr, ...LIMITS.apr);
      msg[`minimum${k}`] = kit.range(d.minimum, ...LIMITS.minimum) || (d.balance > 0 && d.minimum <= 0 ? 'Enter the minimum payment for this debt.' : '');
    });
    if (!o.debts.some(d => d.balance > 0)) msg.balance1 = msg.balance1 || 'Enter at least one debt balance.';
    const mins = o.debts.filter(d => d.balance > 0).reduce((s, d) => s + d.minimum, 0);
    if (!msg.budget && o.budget < mins) msg.budget = `Enter at least ${kit.money(mins)}, the total of your minimum payments.`;
    return msg;
  }

  const engine = { SLOTS, CAP, LIMITS, run, plan, span, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('debt-snowball', box => {
    const form = box.querySelector('form');
    const f = n => form.elements[n];
    const opt = n => (f(n).value.trim() === '' ? 0 : kit.num(f(n)));
    const go = () => {
      const debts = [];
      for (let i = 1; i <= SLOTS; i += 1) debts.push({ balance: opt(`balance${i}`), apr: opt(`apr${i}`), minimum: opt(`minimum${i}`) });
      const checked = form.querySelector('input[name="strategy"]:checked');
      const o = { debts, budget: kit.num(f('budget')), strategy: checked ? checked.value : 'snowball' };
      const msg = check(o);
      if (!kit.errors(form, Object.keys(msg).map(k => [f(k), msg[k]]))) return;
      const p = plan(o);
      const values = outputs(o, p);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, p);
      box.querySelector('tbody').innerHTML = tableRows(p);
    };
    kit.live(form, go);
  });
})(typeof window === 'undefined' ? globalThis : window);
