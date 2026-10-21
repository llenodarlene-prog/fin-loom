// Fin Loom calculators: APY and savings interest. One engine drives the summary, chart, and table.
// Loaded only on pages that contain a calculator block. Also exported for Node tests.
(function (root) {
  'use strict';

  const LIMITS = { rate: [0, 100], balance: [0, 100000000], contribution: [0, 1000000], years: [1, 100] };

  // APY = (1 + r / n)^n - 1, with r as a decimal.
  function apy(ratePercent, periods) {
    const r = ratePercent / 100;
    return Math.pow(1 + r / periods, periods) - 1;
  }

  // Year-by-year growth of a single deposit at a constant APY.
  function apyGrowth(ratePercent, periods, balance, years) {
    const yieldRate = apy(ratePercent, periods);
    const rows = [];
    let current = balance;
    for (let year = 1; year <= years; year += 1) {
      const start = current;
      current = start * (1 + yieldRate);
      rows.push({ year, start, interest: current - start, end: current });
    }
    return { apy: yieldRate, rows, interest: current - balance, end: current };
  }

  // Monthly savings engine. APY is already an effective annual rate, so the monthly rate is
  // (1 + APY)^(1/12) - 1, never APY / 12.
  function savingsGrowth(balance, apyPercent, monthly, years, timing) {
    const monthlyRate = Math.pow(1 + apyPercent / 100, 1 / 12) - 1;
    const rows = [];
    let current = balance;
    let contributions = 0;
    for (let year = 1; year <= years; year += 1) {
      const start = current;
      let added = 0;
      let interest = 0;
      for (let month = 0; month < 12; month += 1) {
        if (timing === 'start') { current += monthly; added += monthly; }
        const earned = current * monthlyRate;
        current += earned; interest += earned;
        if (timing !== 'start') { current += monthly; added += monthly; }
      }
      contributions += added;
      rows.push({ year, start, contributions: added, interest, end: current });
    }
    const interest = current - balance - contributions;
    return { rows, end: current, contributions, interest, interestShare: current > 0 ? interest / current : 0 };
  }

  function validate(name, value) {
    const [min, max] = LIMITS[name];
    if (!Number.isFinite(value)) return 'Enter a number.';
    if (value < min || value > max) return `Enter a value from ${min.toLocaleString('en-US')} to ${max.toLocaleString('en-US')}.`;
    return '';
  }

  const engine = { apy, apyGrowth, savingsGrowth, validate, LIMITS };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pct = value => `${(value * 100).toFixed(3)}%`;
  const num = input => input.value.trim() === '' ? NaN : Number(input.value);

  // A simple SVG line chart of ending balance by year, with a text summary for screen readers.
  function chart(svg, rows, series) {
    const w = 600; const h = 260; const pad = { l: 64, r: 16, t: 16, b: 32 };
    const max = Math.max(...rows.map(row => row.end), 1);
    const x = i => pad.l + (rows.length === 1 ? (w - pad.l - pad.r) / 2 : i * (w - pad.l - pad.r) / (rows.length - 1));
    const y = v => h - pad.b - v / max * (h - pad.t - pad.b);
    const ticks = [0, 0.5, 1].map(f => `<line x1="${pad.l}" x2="${w - pad.r}" y1="${y(max * f)}" y2="${y(max * f)}" class="finloom-calc-grid"/><text x="${pad.l - 8}" y="${y(max * f) + 4}" text-anchor="end" class="finloom-calc-axis">${money.format(max * f).replace(/\.\d+$/, '')}</text>`).join('');
    const lines = series.map(item => `<polyline class="finloom-calc-line finloom-calc-line--${item.key}" fill="none" points="${rows.map((row, i) => `${x(i)},${y(item.value(row))}`).join(' ')}"/>`).join('');
    const labels = rows.length > 1 ? [0, rows.length - 1].map(i => `<text x="${x(i)}" y="${h - 8}" text-anchor="middle" class="finloom-calc-axis">Year ${rows[i].year}</text>`).join('') : `<text x="${x(0)}" y="${h - 8}" text-anchor="middle" class="finloom-calc-axis">Year 1</text>`;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = ticks + lines + labels;
  }

  function table(body, rows, columns) {
    body.innerHTML = rows.map(row => `<tr>${columns.map((key, i) => i === 0 ? `<th scope="row">${row[key]}</th>` : `<td class="num">${money.format(row[key])}</td>`).join('')}</tr>`).join('');
  }

  function wire(form, run) {
    const update = event => { if (event) event.preventDefault(); run(); };
    form.addEventListener('submit', update);
    form.addEventListener('input', () => run());
    form.addEventListener('reset', () => setTimeout(run, 0));
    run();
  }

  function errors(form, checks) {
    let ok = true;
    for (const [input, message] of checks) {
      const slot = form.querySelector(`[data-error-for="${input.id}"]`);
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (slot) slot.textContent = message;
      if (message) ok = false;
    }
    return ok;
  }

  function initApy(root) {
    const form = root.querySelector('form');
    const f = name => form.elements[name];
    const out = name => root.querySelector(`[data-out="${name}"]`);
    wire(form, () => {
      const rate = num(f('rate')); const periods = Number(f('periods').value);
      const balance = f('balance').value.trim() === '' ? 10000 : num(f('balance'));
      const years = f('years').value.trim() === '' ? 1 : num(f('years'));
      if (!errors(form, [[f('rate'), validate('rate', rate)], [f('balance'), validate('balance', balance)], [f('years'), Number.isInteger(years) ? validate('years', years) : 'Enter whole years.']])) return;
      const result = apyGrowth(rate, periods, balance, years);
      out('apy').textContent = pct(result.apy);
      out('rate').textContent = `${rate.toFixed(3)}%`;
      out('frequency').textContent = f('periods').selectedOptions[0].textContent;
      out('difference').textContent = `${((result.apy - rate / 100) * 100).toFixed(3)} percentage points`;
      out('interest1').textContent = money.format(result.rows[0].interest);
      out('end1').textContent = money.format(result.rows[0].end);
      out('interestN').textContent = money.format(result.interest);
      out('endN').textContent = money.format(result.end);
      out('years').textContent = String(years);
      root.querySelector('[data-multi]').hidden = years === 1;
      chart(root.querySelector('svg'), result.rows, [{ key: 'balance', value: row => row.end }]);
      table(root.querySelector('tbody'), result.rows, ['year', 'start', 'interest', 'end']);
      root.querySelector('[data-summary]').textContent = `A ${rate}% rate compounded ${f('periods').selectedOptions[0].textContent.toLowerCase()} gives an APY of ${pct(result.apy)}. ${money.format(balance)} grows to ${money.format(result.end)} after ${years} year${years === 1 ? '' : 's'}.`;
    });
  }

  function initSavings(root) {
    const form = root.querySelector('form');
    const f = name => form.elements[name];
    const out = name => root.querySelector(`[data-out="${name}"]`);
    wire(form, () => {
      const balance = num(f('balance')); const rate = num(f('apy')); const monthly = f('monthly').value.trim() === '' ? 0 : num(f('monthly'));
      const years = num(f('years')); const timing = form.querySelector('input[name="timing"]:checked').value;
      if (!errors(form, [[f('balance'), validate('balance', balance)], [f('apy'), validate('rate', rate)], [f('monthly'), validate('contribution', monthly)], [f('years'), Number.isInteger(years) ? validate('years', years) : 'Enter whole years.']])) return;
      const result = savingsGrowth(balance, rate, monthly, years, timing);
      out('end').textContent = money.format(result.end);
      out('start').textContent = money.format(balance);
      out('contributions').textContent = money.format(result.contributions);
      out('interest').textContent = money.format(result.interest);
      out('share').textContent = `${(result.interestShare * 100).toFixed(1)}%`;
      let paid = balance;
      chart(root.querySelector('svg'), result.rows, [{ key: 'balance', value: row => row.end }, { key: 'contributions', value: row => (paid += row.contributions) }]);
      table(root.querySelector('tbody'), result.rows, ['year', 'start', 'contributions', 'interest', 'end']);
      root.querySelector('[data-summary]').textContent = `${money.format(balance)} plus ${money.format(monthly)} a month at ${rate}% APY grows to ${money.format(result.end)} after ${years} year${years === 1 ? '' : 's'}, including ${money.format(result.interest)} of interest.`;
    });
  }

  document.querySelectorAll('.finloom-calc[data-calculator="apy"]').forEach(initApy);
  document.querySelectorAll('.finloom-calc[data-calculator="savings"]').forEach(initSavings);
})(typeof window === 'undefined' ? globalThis : window);
