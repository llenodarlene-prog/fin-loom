// Fin Loom calculators: APY, savings interest, and dividend reinvestment. One engine drives the summary, chart, and table.
// Loaded only on pages that contain a calculator block. Also exported for Node tests.
(function (root) {
  'use strict';

  const LIMITS = { rate: [0, 100], balance: [0, 100000000], contribution: [0, 1000000], years: [1, 100], shares: [0, 100000000], price: [0.01, 1000000], dividend: [0, 100000], growth: [-100, 100], dripYears: [1, 50] };

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


  // Dividend reinvestment engine: a monthly simulation. Each month it (1) buys shares with a
  // beginning-of-month contribution, (2) pays the dividend in scheduled months and reinvests it
  // or keeps it as cash, (3) buys shares with an end-of-month contribution, then (4) moves the
  // price by the equivalent monthly rate (1 + annual)^(1/12) - 1. The dividend per share changes
  // once a year, after each year-end snapshot, and never falls below zero. Nothing is rounded.
  const DRIP_CEILING = 1e15;

  function dividendMonths(frequency) {
    const step = 12 / frequency;
    const months = [];
    for (let month = step; month <= 12; month += step) months.push(month);
    return months;
  }

  function dripGrowth(o) {
    const totalMonths = o.years * 12;
    const payMonths = dividendMonths(o.frequency);
    const monthlyRate = o.priceGrowth <= -100 ? -1 : Math.pow(1 + o.priceGrowth / 100, 1 / 12) - 1;
    const startValue = o.shares * o.price;
    let shares = o.shares; let price = o.price; let perShare = o.dividend;
    let cash = 0; let idle = 0; let paid = 0; let reinvested = 0; let contributions = 0; let priceZero = false;
    const rows = [];
    const blank = () => ({ dividends: 0, reinvested: 0, contributions: 0, newShares: 0 });
    let year = blank();

    // A purchase needs a positive price; otherwise the money is held as uninvested cash.
    const buy = amount => {
      if (amount <= 0) return;
      contributions += amount; year.contributions += amount;
      if (price > 0) { const bought = amount / price; shares += bought; year.newShares += bought; } else { idle += amount; priceZero = true; }
    };

    for (let month = 1; month <= totalMonths; month += 1) {
      if (o.timing === 'start') buy(o.monthly);
      if (payMonths.includes(((month - 1) % 12) + 1)) {
        const dividend = shares * perShare;
        paid += dividend; year.dividends += dividend;
        if (o.reinvest && price > 0) { const bought = dividend / price; shares += bought; reinvested += dividend; year.reinvested += dividend; year.newShares += bought; } else { cash += dividend; if (o.reinvest) priceZero = true; }
      }
      if (o.timing !== 'start') buy(o.monthly);
      price = Math.max(0, price * (1 + monthlyRate));
      if (month % 12 === 0) {
        rows.push(Object.assign(year, { year: month / 12, endShares: shares, price, dividendPerShare: perShare, income: shares * perShare * o.frequency, end: shares * price + cash + idle, cumulativeDividends: paid, capital: startValue + contributions }));
        if (month < totalMonths) perShare = Math.max(0, perShare * (1 + o.dividendGrowth / 100));
        year = blank();
      }
    }

    const last = rows[rows.length - 1];
    const capital = startValue + contributions;
    const tooLarge = !rows.every(row => Number.isFinite(row.end) && Number.isFinite(row.endShares) && row.end <= DRIP_CEILING && row.cumulativeDividends <= DRIP_CEILING);
    return { rows, shares, end: last.end, stockValue: shares * price, cash, idle, dividends: paid, reinvested, contributions, startValue, capital, growth: last.end - capital, endPrice: price, endDividend: perShare, income: last.income, yieldOnCapital: capital > 0 ? last.income / capital : 0, priceZero, tooLarge };
  }

  // Display text for the dividend calculator, shared by the server render and the browser.
  const fmt = {
    money: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    compact: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }),
    shares: new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
    percent: new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    perShare: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 4 })
  };
  const formatCurrency = value => fmt.money.format(value);
  const formatShares = value => fmt.shares.format(value);
  const formatPercent = value => fmt.percent.format(value);

  function dripSummary(o, r) {
    const span = `${o.years} year${o.years === 1 ? '' : 's'}`;
    const start = o.shares > 0 ? `your ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(o.shares)} starting shares could grow to` : 'your monthly contributions could build a position of';
    return `Under these assumptions, ${start} ${formatShares(r.shares)} shares over ${span}, producing an estimated annual dividend income of ${formatCurrency(r.income)}.`;
  }

  function dripOutputs(o, r, cashRun) {
    return {
      end: formatCurrency(r.end), shares: formatShares(r.shares), income: formatCurrency(r.income), dividends: formatCurrency(r.dividends),
      start: formatCurrency(r.startValue), contributions: formatCurrency(r.contributions), capital: formatCurrency(r.capital),
      reinvested: formatCurrency(r.reinvested), growth: formatCurrency(r.growth), price: formatCurrency(r.endPrice),
      perShare: fmt.perShare.format(r.endDividend), yoc: formatPercent(r.yieldOnCapital), cash: formatCurrency(r.cash + r.idle),
      gain: o.reinvest ? formatCurrency(r.end - cashRun.end) : formatCurrency(0)
    };
  }

  function dripRows(r) {
    return r.rows.map(row => `<tr><th scope="row">${row.year}</th><td class="num">${formatShares(row.endShares)}</td><td class="num">${formatCurrency(row.price)}</td><td class="num">${fmt.perShare.format(row.dividendPerShare)}</td><td class="num">${formatCurrency(row.dividends)}</td><td class="num">${formatCurrency(row.contributions)}</td><td class="num">${formatCurrency(row.income)}</td><td class="num">${formatCurrency(row.end)}</td></tr>`).join('');
  }

  // Responsive SVG line chart: portfolio value, contributed capital, cumulative dividends.
  function dripChart(r) {
    const w = 640; const h = 280; const pad = { l: 70, r: 16, t: 16, b: 34 };
    const series = [['value', row => row.end], ['capital', row => row.capital], ['dividends', row => row.cumulativeDividends]];
    const max = Math.max(1, ...r.rows.flatMap(row => series.map(([, get]) => get(row))));
    const n = r.rows.length;
    const x = i => pad.l + (n === 1 ? (w - pad.l - pad.r) / 2 : i * (w - pad.l - pad.r) / (n - 1));
    const y = v => h - pad.b - v / max * (h - pad.t - pad.b);
    const grid = [0, 0.25, 0.5, 0.75, 1].map(f => `<line x1="${pad.l}" x2="${w - pad.r}" y1="${y(max * f)}" y2="${y(max * f)}" class="finloom-calc-grid"/><text x="${pad.l - 8}" y="${y(max * f) + 4}" text-anchor="end" class="finloom-calc-axis">${fmt.compact.format(max * f)}</text>`).join('');
    const ticks = [...new Set([0, Math.floor((n - 1) / 2), n - 1])].map(i => `<text x="${x(i)}" y="${h - 10}" text-anchor="${n > 1 && i === 0 ? 'start' : n > 1 && i === n - 1 ? 'end' : 'middle'}" class="finloom-calc-axis">Year ${r.rows[i].year}</text>`).join('');
    const lines = series.map(([key, get]) => `<polyline class="finloom-calc-line finloom-calc-line--${key}" fill="none" points="${r.rows.map((row, i) => `${x(i)},${y(get(row))}`).join(' ')}"/>`).join('');
    const desc = `Over ${n} year${n === 1 ? '' : 's'}, portfolio value reaches ${formatCurrency(r.end)}, contributed capital reaches ${formatCurrency(r.capital)}, and cumulative dividends reach ${formatCurrency(r.dividends)}.`;
    return { svg: `<desc>${desc}</desc>${grid}${lines}${ticks}`, desc };
  }

  function dripWarnings(r) {
    const notes = [];
    if (r.tooLarge) notes.push('These assumptions produce an unrealistically large projection. Reduce the growth rate, contribution, or time period.');
    if (r.priceZero) notes.push('The share price reaches zero under these assumptions, so later dividends and contributions are held as cash instead of buying shares.');
    return notes;
  }

  function validate(name, value) {
    const [min, max] = LIMITS[name];
    if (!Number.isFinite(value)) return 'Enter a number.';
    if (value < min || value > max) return `Enter a value from ${min.toLocaleString('en-US')} to ${max.toLocaleString('en-US')}.`;
    return '';
  }

  // Shared toolkit for the calculator suite: formatting, range validation, and a responsive SVG
  // line chart. Tool files (calc-*.js) reach it through FinLoomCalc in the browser and in Node.
  const NF = (options) => new Intl.NumberFormat('en-US', options);
  const formats = {
    money: NF({ style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    money0: NF({ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    compact: NF({ style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 })
  };
  const safe = value => (Number.isFinite(value) ? value : 0);
  const kit = {
    money: value => formats.money.format(safe(value)),
    money0: value => formats.money0.format(safe(value)),
    compact: value => formats.compact.format(safe(value)),
    percent: (value, digits = 2) => NF({ style: 'percent', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(safe(value)),
    number: (value, digits = 0) => NF({ minimumFractionDigits: digits, maximumFractionDigits: digits }).format(safe(value)),
    // Returns an error message, or '' when the value is valid.
    range(value, min, max, options = {}) {
      if (!Number.isFinite(value)) return options.required === false ? '' : 'Enter a number.';
      if (options.integer && !Number.isInteger(value)) return 'Enter a whole number.';
      if (value < min || value > max) return `Enter a value from ${NF({ maximumFractionDigits: 4 }).format(min)} to ${NF({ maximumFractionDigits: 4 }).format(max)}.`;
      return '';
    },
    // Responsive line chart. series: [{ key, label, values }]. Long series are downsampled to
    // about 120 points. highlight: index into labels to mark with a point and a guide line.
    lineChart({ labels, series, yFormat = kit.compact, width = 640, height = 280, highlight = null, describe }) {
      const pad = { l: 72, r: 16, t: 16, b: 34 };
      const n = labels.length;
      const step = Math.max(1, Math.ceil(n / 120));
      const keep = [];
      for (let i = 0; i < n; i += step) keep.push(i);
      if (keep[keep.length - 1] !== n - 1) keep.push(n - 1);
      const all = series.flatMap(item => item.values.map(safe));
      const max = Math.max(1e-9, ...all); const min = Math.min(0, ...all);
      const x = i => pad.l + (n === 1 ? (width - pad.l - pad.r) / 2 : i * (width - pad.l - pad.r) / (n - 1));
      const y = v => height - pad.b - (safe(v) - min) / (max - min) * (height - pad.t - pad.b);
      const grid = [0, 0.25, 0.5, 0.75, 1].map(f => { const v = min + (max - min) * f; return `<line x1="${pad.l}" x2="${width - pad.r}" y1="${y(v)}" y2="${y(v)}" class="finloom-calc-grid"/><text x="${pad.l - 8}" y="${y(v) + 4}" text-anchor="end" class="finloom-calc-axis">${yFormat(v)}</text>`; }).join('');
      const ticks = [...new Set([0, Math.floor((n - 1) / 2), n - 1])].map(i => `<text x="${x(i)}" y="${height - 10}" text-anchor="${n > 1 && i === 0 ? 'start' : n > 1 && i === n - 1 ? 'end' : 'middle'}" class="finloom-calc-axis">${labels[i]}</text>`).join('');
      const lines = series.map(item => `<polyline class="finloom-calc-line finloom-calc-line--${item.key}" fill="none" points="${keep.map(i => `${x(i).toFixed(1)},${y(item.values[i]).toFixed(1)}`).join(' ')}"/>`).join('');
      const mark = highlight === null || highlight < 0 || highlight >= n ? '' : `<line x1="${x(highlight)}" x2="${x(highlight)}" y1="${pad.t}" y2="${height - pad.b}" class="finloom-calc-marker"/><circle cx="${x(highlight)}" cy="${y(series[0].values[highlight])}" r="5" class="finloom-calc-point"/>`;
      const desc = describe || series.map(item => `${item.label} ends at ${yFormat(item.values[n - 1])}`).join('; ') + '.';
      return { svg: `<desc>${desc}</desc>${grid}${lines}${mark}${ticks}`, desc, viewBox: `0 0 ${width} ${height}` };
    }
  };

  const engine = { kit, apy, apyGrowth, savingsGrowth, dividendMonths, dripGrowth, dripSummary, dripOutputs, dripRows, dripChart, dripWarnings, validate, LIMITS };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') { root.FinLoomCalc = kit; return; }

  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pct = value => `${(value * 100).toFixed(3)}%`;
  const num = input => input.value.trim() === '' ? NaN : Number(input.value);

  // A simple SVG line chart of ending balance by year, with a text summary for screen readers.
  function chart(svg, rows, series) {
    const w = 600; const h = 260; const pad = { l: 64, r: 16, t: 16, b: 32 };
    const values = series.map(item => rows.map(row => item.value(row)));
    const max = Math.max(...values.flat(), 1);
    const x = i => pad.l + (rows.length === 1 ? (w - pad.l - pad.r) / 2 : i * (w - pad.l - pad.r) / (rows.length - 1));
    const y = v => h - pad.b - v / max * (h - pad.t - pad.b);
    const ticks = [0, 0.5, 1].map(f => `<line x1="${pad.l}" x2="${w - pad.r}" y1="${y(max * f)}" y2="${y(max * f)}" class="finloom-calc-grid"/><text x="${pad.l - 8}" y="${y(max * f) + 4}" text-anchor="end" class="finloom-calc-axis">${money.format(max * f).replace(/\.\d+$/, '')}</text>`).join('');
    const lines = series.map((item, s) => `<polyline class="finloom-calc-line finloom-calc-line--${item.key}" fill="none" points="${values[s].map((v, i) => `${x(i)},${y(v)}`).join(' ')}"/>`).join('');
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


  function initDrip(root) {
    const form = root.querySelector('form');
    const f = name => form.elements[name];
    const opt = name => f(name).value.trim() === '' ? 0 : num(f(name));
    const parseInputs = () => ({ shares: num(f('shares')), price: num(f('price')), dividend: num(f('dividend')), frequency: Number(f('frequency').value), dividendGrowth: opt('dgrowth'), priceGrowth: opt('pgrowth'), years: num(f('years')), monthly: opt('monthly'), timing: form.querySelector('input[name="timing"]:checked').value, reinvest: form.querySelector('input[name="reinvest"]:checked').value === 'yes' });
    const validateInputs = o => errors(form, [
      [f('shares'), validate('shares', o.shares) || (o.shares === 0 && !(o.monthly > 0) ? 'Enter starting shares or a monthly contribution.' : '')],
      [f('price'), validate('price', o.price)], [f('dividend'), validate('dividend', o.dividend)],
      [f('dgrowth'), validate('growth', o.dividendGrowth)], [f('pgrowth'), validate('growth', o.priceGrowth)],
      [f('years'), Number.isInteger(o.years) ? validate('dripYears', o.years) : 'Enter whole years.'], [f('monthly'), validate('contribution', o.monthly)]]);
    const run = () => {
      const o = parseInputs();
      if (!validateInputs(o)) return;
      const r = dripGrowth(o);
      const values = dripOutputs(o, r, dripGrowth(Object.assign({}, o, { reinvest: false })));
      root.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      root.querySelector('[data-cash-row]').hidden = o.reinvest;
      root.querySelector('[data-gain-row]').hidden = !o.reinvest;
      root.querySelector('[data-summary]').textContent = dripSummary(o, r);
      const view = dripChart(r);
      const svg = root.querySelector('svg');
      svg.innerHTML = view.svg; svg.setAttribute('aria-label', view.desc);
      root.querySelector('tbody').innerHTML = dripRows(r);
      const notes = dripWarnings(r);
      const box = root.querySelector('[data-warnings]');
      box.hidden = notes.length === 0; box.innerHTML = notes.map(text => `<p>${text}</p>`).join('');
    };
    let timer;
    form.addEventListener('submit', event => { event.preventDefault(); clearTimeout(timer); run(); });
    form.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 200); });
    form.addEventListener('change', () => { clearTimeout(timer); timer = setTimeout(run, 200); });
    form.addEventListener('reset', () => { clearTimeout(timer); setTimeout(run, 0); });
    run();
  }

  // Browser half of the toolkit: input parsing, inline errors, debounced live updates, and a
  // registry each tool file calls once it loads.
  root.FinLoomCalc = Object.assign({}, kit, {
    num, errors,
    live(form, run, delay = 200) {
      let timer;
      const later = () => { clearTimeout(timer); timer = setTimeout(run, delay); };
      form.addEventListener('submit', event => { event.preventDefault(); clearTimeout(timer); run(); });
      form.addEventListener('input', later);
      form.addEventListener('change', later);
      form.addEventListener('reset', () => { clearTimeout(timer); setTimeout(run, 0); });
      run();
    },
    register(id, init) { document.querySelectorAll(`.finloom-calc[data-calculator="${id}"]`).forEach(init); }
  });

  // Sliders mirror their number box. Capture-phase listeners update the partner before the
  // calculator's own input handler reads the form.
  document.addEventListener('input', event => {
    const el = event.target;
    if (el.matches && el.matches('.finloom-calc-slider')) { const box = document.getElementById(el.dataset.for); if (box) box.value = el.value; }
    else if (el.id) { const twin = document.querySelector(`.finloom-calc-slider[data-for="${el.id}"]`); if (twin && el.value !== '') twin.value = el.value; }
  }, true);
  document.addEventListener('reset', event => { if (event.target.closest && event.target.closest('.finloom-calc')) setTimeout(() => event.target.querySelectorAll('.finloom-calc-slider').forEach(s => { const box = document.getElementById(s.dataset.for); if (box) s.value = box.value; }), 0); }, true);

  document.querySelectorAll('.finloom-calc[data-calculator="apy"]').forEach(initApy);
  document.querySelectorAll('.finloom-calc[data-calculator="savings"]').forEach(initSavings);
  document.querySelectorAll('.finloom-calc[data-calculator="drip"]').forEach(initDrip);
})(typeof window === 'undefined' ? globalThis : window);
