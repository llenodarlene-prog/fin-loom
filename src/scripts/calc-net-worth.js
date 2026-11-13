// Fin Loom net worth calculator: total assets minus total liabilities by category, with an optional
// comparison to the Federal Reserve's 2025 Survey of Consumer Finances family net worth by age
// (Table 2 of "Changes in U.S. Family Finances from 2022 to 2025", 2025 dollars).
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const ASSETS = [['cash', 'Cash and savings'], ['investments', 'Taxable investments'], ['retirement', 'Retirement accounts'], ['home', 'Home value'], ['vehicles', 'Vehicles'], ['other', 'Other assets']];
  const DEBTS = [['mortgage', 'Mortgage'], ['auto', 'Auto loans'], ['student', 'Student loans'], ['cards', 'Credit cards'], ['loans', 'Other debts']];
  const SCF = {
    all: ['All families', 215900, 1241500], u35: ['Under 35', 33000, 135400], a35: ['35 to 44', 155600, 681900], a45: ['45 to 54', 253700, 1244500],
    a55: ['55 to 64', 411900, 1878000], a65: ['65 to 74', 431300, 1897600], a75: ['75 and older', 504900, 1962200]
  };
  const MAX = 1000000000;

  function worth(o) {
    const assets = ASSETS.map(([k, label]) => ({ key: k, label, value: o[k] || 0 }));
    const debts = DEBTS.map(([k, label]) => ({ key: k, label, value: o[k] || 0 }));
    const totalAssets = assets.reduce((s, a) => s + a.value, 0);
    const totalDebts = debts.reduce((s, d) => s + d.value, 0);
    const net = totalAssets - totalDebts;
    const homeEquity = (o.home || 0) - (o.mortgage || 0);
    const liquid = (o.cash || 0) + (o.investments || 0);
    const group = SCF[o.age] || SCF.all;
    return { assets, debts, totalAssets, totalDebts, net, homeEquity, liquid, debtRatio: totalAssets > 0 ? totalDebts / totalAssets : null, group: { label: group[0], median: group[1], mean: group[2] } };
  }

  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;

  function summary(o, r) {
    const cmp = r.net >= r.group.median ? 'above' : 'below';
    return `Your assets of ${kit.money(r.totalAssets)} minus debts of ${kit.money(r.totalDebts)} give a net worth of ${signed(r.net)}. That is ${cmp} the 2025 Federal Reserve median of ${kit.money(r.group.median)} for families in the ${r.group.label.toLowerCase()} group, which counts whole families rather than individuals.`;
  }

  function outputs(o, r) {
    return {
      big: signed(r.net), assets: kit.money(r.totalAssets), debts: kit.money(r.totalDebts),
      equity: signed(r.homeEquity), liquid: kit.money(r.liquid),
      ratio: r.debtRatio === null ? 'No assets entered' : kit.percent(r.debtRatio, 1),
      median: kit.money(r.group.median), mean: kit.money(r.group.mean)
    };
  }

  function tableRows(r) {
    const line = (item, kind, total) => `<tr><th scope="row">${item.label}</th><td>${kind}</td><td class="num">${kit.money(item.value)}</td><td class="num">${total > 0 ? kit.percent(item.value / total, 1) : '—'}</td></tr>`;
    return r.assets.map(a => line(a, 'Asset', r.totalAssets)).join('') + r.debts.map(d => line(d, 'Debt', r.totalDebts)).join('');
  }

  function check(o) {
    const msg = {};
    [...ASSETS, ...DEBTS].forEach(([k]) => { msg[k] = kit.range(o[k], 0, MAX); });
    return msg;
  }

  const engine = { ASSETS, DEBTS, SCF, worth, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('net-worth', box => {
    const form = box.querySelector('form');
    const f = name => form.elements[name];
    const opt = name => (f(name).value.trim() === '' ? 0 : kit.num(f(name)));
    const keys = [...ASSETS, ...DEBTS].map(([k]) => k);
    const run = () => {
      const o = { age: f('age').value };
      keys.forEach(k => { o[k] = opt(k); });
      const msg = check(o);
      if (!kit.errors(form, keys.map(k => [f(k), msg[k]]))) return;
      const r = worth(o);
      const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
