// Fin Loom daily compound interest calculator. A = P(1 + r/n)^(nt) with t = days / 365.
// The engine steps day by day with the equivalent daily growth factor (1 + r/n)^(n/365), so a
// balance with no contributions lands exactly on the formula for any day count, and each
// contribution grows from the day it is added. Nothing is rounded until display.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const FREQUENCIES = { 365: 'daily', 12: 'monthly', 4: 'quarterly', 1: 'annually' };
  const CONTRIBUTIONS = { none: 'No contributions', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };
  const CEILING = 1e15;

  // Day numbers (1-based) on which a contribution is added, at the end of that day.
  function isContributionDay(day, frequency) {
    if (frequency === 'daily') return true;
    if (frequency === 'weekly') return day % 7 === 0;
    if (frequency === 'monthly') return Math.floor(day * 12 / 365) > Math.floor((day - 1) * 12 / 365);
    return false;
  }

  function compound(o) {
    const n = o.periods;
    const r = o.rate / 100;
    const growth = Math.pow(1 + r / n, n / 365);
    const contribution = o.contributionFrequency === 'none' ? 0 : o.contribution;
    let balance = o.balance; let added = 0;
    const balances = [o.balance];
    for (let day = 1; day <= o.days; day += 1) {
      balance *= growth;
      if (contribution > 0 && isContributionDay(day, o.contributionFrequency)) { balance += contribution; added += contribution; }
      balances.push(balance);
    }
    const interest = balance - o.balance - added;
    return {
      inputs: o, balances, end: balance, contributions: added, interest,
      effectiveYield: Math.pow(1 + r / n, n) - 1,
      dailyStart: o.balance * (growth - 1), dailyEnd: balance * (growth - 1),
      tooLarge: !Number.isFinite(balance) || balance > CEILING
    };
  }

  // The same inputs at daily, monthly, and annual compounding.
  function compare(o) {
    return [365, 12, 1].map(periods => ({ periods, label: FREQUENCIES[periods], result: compound(Object.assign({}, o, { periods })) }));
  }

  // Breakdown rows: by day for up to 31 days, by month (365/12-day blocks) up to two years, else by year.
  function breakdown(r) {
    const days = r.inputs.days;
    const unit = days <= 31 ? ['Day', 1] : days < 730 ? ['Month', 365 / 12] : ['Year', 365];
    const rows = [];
    let previous = 0; let contributed = 0;
    for (let k = 1; previous < days; k += 1) {
      const endDay = Math.min(days, Math.round(k * unit[1]));
      let added = 0;
      for (let day = previous + 1; day <= endDay; day += 1) if (r.inputs.contributionFrequency !== 'none' && r.inputs.contribution > 0 && isContributionDay(day, r.inputs.contributionFrequency)) added += r.inputs.contribution;
      contributed += added;
      const start = r.balances[previous]; const end = r.balances[endDay];
      rows.push({ label: `${unit[0]} ${k}`, endDay, start, contributions: added, interest: end - start - added, end, totalContributions: contributed });
      previous = endDay;
    }
    return rows;
  }

  // Amounts past the ceiling show as a phrase so a runaway projection never prints dozens of digits.
  const money = value => (value > CEILING ? 'More than $1 quadrillion' : kit.money(value));
  const axis = value => (value > CEILING ? '> $1Q' : kit.compact(value));

  const span = days => `${kit.number(days)} day${days === 1 ? '' : 's'}`;

  function summary(r) {
    const o = r.inputs;
    const extra = r.contributions > 0 ? ` with ${money(r.contributions)} of contributions` : '';
    return `Under these assumptions, ${money(o.balance)} at a ${kit.number(o.rate, 2)}% rate compounded ${FREQUENCIES[o.periods]}${extra} could grow to ${money(r.end)} after ${span(o.days)}, including an estimated ${money(r.interest)} of interest.`;
  }

  function outputs(r) {
    return {
      big: money(r.end), interest: money(r.interest), contributions: money(r.contributions),
      yield: kit.percent(r.effectiveYield, 3), dailyStart: money(r.dailyStart), dailyEnd: money(r.dailyEnd)
    };
  }

  function compareCards(r) {
    return compare(r.inputs).map(item => `<div class="finloom-calc-card"><p>Compounded ${item.label}${item.periods === r.inputs.periods ? ' (selected)' : ''}</p><strong>${money(item.result.end)}</strong><p>${money(item.result.interest)} interest; ${kit.percent(item.result.effectiveYield, 3)} effective yield</p></div>`).join('');
  }

  function chart(r) {
    const labels = r.balances.map((_, day) => `Day ${kit.number(day)}`);
    const contributed = [];
    let total = r.inputs.balance;
    r.balances.forEach((_, day) => { if (day > 0 && r.inputs.contributionFrequency !== 'none' && r.inputs.contribution > 0 && isContributionDay(day, r.inputs.contributionFrequency)) total += r.inputs.contribution; contributed.push(total); });
    return kit.lineChart({
      labels, yFormat: axis,
      series: [{ key: 'value', label: 'Balance', values: r.balances }, { key: 'capital', label: 'Starting balance plus contributions', values: contributed }],
      describe: `Balance over ${span(r.inputs.days)}, rising from ${money(r.inputs.balance)} to ${money(r.end)}, against ${money(r.inputs.balance + r.contributions)} of starting balance plus contributions.`
    });
  }

  function tableRows(r) {
    return breakdown(r).map(row => `<tr><th scope="row">${row.label}</th><td class="num">${kit.number(row.endDay)}</td><td class="num">${money(row.contributions)}</td><td class="num">${money(row.interest)}</td><td class="num">${money(row.end)}</td></tr>`).join('');
  }

  function warnings(r) {
    return r.tooLarge ? ['These assumptions produce an unrealistically large projection. Reduce the rate, contribution, or number of days.'] : [];
  }

  const engine = { FREQUENCIES, CONTRIBUTIONS, isContributionDay, compound, compare, breakdown, summary, outputs, compareCards, chart, tableRows, warnings };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('daily-compound', box => {
    const form = box.querySelector('form');
    const f = name => form.elements[name];
    const optional = name => (f(name).value.trim() === '' ? 0 : kit.num(f(name)));
    const run = () => {
      const o = { balance: kit.num(f('balance')), rate: kit.num(f('rate')), days: kit.num(f('days')), periods: Number(f('periods').value), contribution: optional('contribution'), contributionFrequency: f('cfrequency').value };
      const ok = kit.errors(form, [[f('balance'), kit.range(o.balance, 0, 1e9)], [f('rate'), kit.range(o.rate, 0, 100)], [f('days'), kit.range(o.days, 1, 36500, { integer: true })], [f('contribution'), kit.range(o.contribution, 0, 1e7)]]);
      if (!ok) return;
      const r = compound(o);
      const values = outputs(r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(r);
      box.querySelector('[data-compare]').innerHTML = compareCards(r);
      const view = chart(r); const svg = box.querySelector('svg');
      svg.innerHTML = view.svg; svg.setAttribute('aria-label', view.desc);
      box.querySelector('tbody').innerHTML = tableRows(r);
      const notes = warnings(r); const slot = box.querySelector('[data-warnings]');
      slot.hidden = notes.length === 0; slot.innerHTML = notes.map(text => `<p>${text}</p>`).join('');
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
