// Fin Loom investment growth calculator. Monthly engine: the annual return becomes the equivalent
// monthly rate (1 + r)^(1/12) - 1; contributions go in at the start or end of each month and can
// rise once a year; an optional inflation rate converts the ending balance to today's dollars.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const SPREAD = 2;
  const CEILING = 1e15;
  const TOO_LARGE = 'These assumptions produce an unrealistically large projection. Reduce the return, contribution, or time period.';

  function growth(o) {
    const monthlyRate = o.rate <= -100 ? -1 : Math.pow(1 + o.rate / 100, 1 / 12) - 1;
    let balance = o.start; let contribution = o.monthly; let added = o.start;
    const rows = [];
    for (let year = 1; year <= o.years; year += 1) {
      if (year > 1) contribution *= 1 + o.increase / 100;
      let yearAdded = 0;
      for (let month = 0; month < 12; month += 1) {
        if (o.timing === 'start') { balance += contribution; yearAdded += contribution; }
        balance *= 1 + monthlyRate;
        if (o.timing !== 'start') { balance += contribution; yearAdded += contribution; }
      }
      added += yearAdded;
      rows.push({ year, contributions: yearAdded, totalContributions: added, growth: balance - added, balance, real: balance / Math.pow(1 + o.inflation / 100, year) });
    }
    const last = rows[rows.length - 1];
    return { rows, tooLarge: !rows.every(row => Number.isFinite(row.balance) && Math.abs(row.balance) <= CEILING), end: last.balance, contributions: added, growth: last.balance - added, real: last.real, contributionShare: last.balance > 0 ? added / last.balance : 0, growthShare: last.balance > 0 ? (last.balance - added) / last.balance : 0 };
  }

  // Illustrative scenarios: the entered return, and that return 2 percentage points lower and higher.
  function scenarios(o) {
    return [['Conservative', o.rate - SPREAD], ['Base', o.rate], ['Higher-return', o.rate + SPREAD]].map(([name, rate]) => ({ name, rate, end: growth(Object.assign({}, o, { rate })).end }));
  }

  function summary(o, r) {
    return `Under these assumptions, ${kit.money(o.start)} plus ${kit.money(o.monthly)} a month at an estimated ${kit.number(o.rate, 2)}% annual return could grow to ${kit.money(r.end)} over ${o.years} year${o.years === 1 ? '' : 's'}, with ${kit.money(r.growth)} coming from investment growth.`;
  }

  function outputs(o, r) {
    return {
      big: kit.money(r.end), contributions: kit.money(r.contributions), growth: kit.money(r.growth), real: kit.money(r.real),
      contributionShare: kit.percent(r.contributionShare, 1), growthShare: kit.percent(r.growthShare, 1)
    };
  }

  function chart(r) {
    return kit.lineChart({ labels: r.rows.map(row => `Year ${row.year}`), series: [
      { key: 'value', label: 'Balance', values: r.rows.map(row => row.balance) },
      { key: 'capital', label: 'Total contributions', values: r.rows.map(row => row.totalContributions) }
    ], describe: `Over ${r.rows.length} years, the balance reaches ${kit.money(r.end)} and total contributions reach ${kit.money(r.contributions)}; the gap between the lines is investment growth.` });
  }

  function cards(o) {
    return scenarios(o).map(item => `<div class="finloom-calc-card"><p>${item.name} (${kit.number(item.rate, 2)}%)</p><strong>${kit.money(item.end)}</strong></div>`).join('');
  }

  function tableRows(r) {
    return r.rows.map(row => `<tr><th scope="row">${row.year}</th><td class="num">${kit.money(row.contributions)}</td><td class="num">${kit.money(row.totalContributions)}</td><td class="num">${kit.money(row.growth)}</td><td class="num">${kit.money(row.balance)}</td><td class="num">${kit.money(row.real)}</td></tr>`).join('');
  }

  const engine = { SPREAD, CEILING, TOO_LARGE, growth, scenarios, summary, outputs, chart, cards, tableRows };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('investment-growth', box => {
    const form = box.querySelector('form');
    const f = name => form.elements[name];
    const opt = name => (f(name).value.trim() === '' ? 0 : kit.num(f(name)));
    const run = () => {
      const o = { start: kit.num(f('start')), monthly: opt('monthly'), rate: kit.num(f('rate')), years: kit.num(f('years')), timing: form.querySelector('input[name="timing"]:checked').value, increase: opt('increase'), inflation: opt('inflation') };
      const ok = kit.errors(form, [
        [f('start'), kit.range(o.start, 0, 1e9)], [f('monthly'), kit.range(o.monthly, 0, 1e7)], [f('rate'), kit.range(o.rate, -50, 50)],
        [f('years'), kit.range(o.years, 1, 100, { integer: true })], [f('increase'), kit.range(o.increase, 0, 50)], [f('inflation'), kit.range(o.inflation, 0, 20)]]);
      if (!ok) return;
      const r = growth(o);
      const warning = box.querySelector('[data-warnings]');
      warning.hidden = !r.tooLarge; warning.textContent = r.tooLarge ? TOO_LARGE : '';
      if (r.tooLarge) return;
      const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      const view = chart(r); const svg = box.querySelector('svg');
      svg.innerHTML = view.svg; svg.setAttribute('aria-label', view.desc);
      box.querySelector('[data-scenarios]').innerHTML = cards(o);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
