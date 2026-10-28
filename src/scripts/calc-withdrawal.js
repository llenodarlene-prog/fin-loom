// Fin Loom investment withdrawal calculator. Two modes: how long a portfolio could last at a given
// monthly withdrawal (A), and the level monthly withdrawal that would spend it down over a set
// number of years (B). Monthly engine with the equivalent monthly return (1 + annual)^(1/12) - 1.
// Withdrawals step up once a year by the withdrawal growth rate. Inflation does not change the
// cash flows; it converts balances and withdrawals into today's dollars for comparison.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const CAP_YEARS = 100;

  const monthlyRate = annualPercent => Math.pow(1 + annualPercent / 100, 1 / 12) - 1;
  const deflator = (inflationPercent, months) => Math.pow(1 + inflationPercent / 100, months / 12);

  // Month-by-month projection. Stops when the balance runs out or after capYears.
  function project(o) {
    const rate = monthlyRate(o.ret);
    const cap = (o.capYears || CAP_YEARS) * 12;
    let balance = o.balance; let withdrawn = 0; let growth = 0; let lastWithdrawal = 0;
    let depletedAt = null;
    const rows = [];
    let year = { year: 1, start: balance, withdrawals: 0, growth: 0 };

    const take = amount => {
      const paid = Math.min(amount, balance);
      balance -= paid; withdrawn += paid; year.withdrawals += paid;
      if (paid > 0) lastWithdrawal = paid;
      return paid < amount - 1e-9;
    };

    for (let month = 1; month <= cap; month += 1) {
      const planned = o.withdrawal * Math.pow(1 + o.growth / 100, Math.floor((month - 1) / 12));
      let short = false;
      if (o.timing === 'start') short = take(planned);
      const earned = balance * rate;
      balance += earned; growth += earned; year.growth += earned;
      if (o.timing !== 'start' && !short) short = take(planned);
      if (balance <= 1e-6) balance = 0;
      if (depletedAt === null && (short || (balance === 0 && month < cap))) depletedAt = month;
      const yearEnd = month % 12 === 0 || depletedAt === month;
      if (yearEnd) {
        rows.push(Object.assign(year, { end: balance, real: balance / deflator(o.inflation, month), month }));
        year = { year: year.year + 1, start: balance, withdrawals: 0, growth: 0 };
      }
      if (depletedAt !== null) break;
    }
    const months = depletedAt === null ? cap : depletedAt;
    return { rows, depletedAt, months, end: balance, withdrawn, growth, lastWithdrawal, lastReal: lastWithdrawal / deflator(o.inflation, months), firstYearRate: o.balance > 0 ? (o.withdrawal * 12) / o.balance : 0 };
  }

  // Mode B: level monthly withdrawal that spends the balance to zero over the years given.
  // End of month: P x i / (1 - (1 + i)^-n). Beginning of month divides that by (1 + i). i = 0: P / n.
  function levelWithdrawal(balance, ret, years, timing) {
    const n = years * 12; const i = monthlyRate(ret);
    if (Math.abs(i) < 1e-12) return balance / n;
    const end = balance * i / (1 - Math.pow(1 + i, -n));
    return timing === 'start' ? end / (1 + i) : end;
  }

  function duration(months) {
    const y = Math.floor(months / 12); const m = months % 12;
    return `${y} year${y === 1 ? '' : 's'}${m ? `, ${m} month${m === 1 ? '' : 's'}` : ''}`;
  }

  function run(o) {
    if (o.mode === 'b') {
      const payment = levelWithdrawal(o.balance, o.ret, o.years, o.timing);
      const sim = project({ balance: o.balance, withdrawal: payment, ret: o.ret, inflation: 0, growth: 0, timing: o.timing, capYears: o.years });
      return Object.assign(sim, { mode: 'b', payment, years: o.years });
    }
    return Object.assign(project(o), { mode: 'a' });
  }

  function outputs(o, r) {
    if (r.mode === 'b') {
      return { big: `${kit.money(r.payment)} a month`, annualB: kit.money(r.payment * 12), withdrawnB: kit.money(r.withdrawn), growthB: kit.money(r.growth), rateB: kit.percent(o.balance > 0 ? r.payment * 12 / o.balance : 0, 2) };
    }
    return {
      big: r.depletedAt === null ? `Lasts beyond ${CAP_YEARS} years` : duration(r.depletedAt),
      withdrawn: kit.money(r.withdrawn), growth: kit.money(r.growth), last: kit.money(r.lastWithdrawal),
      lastReal: kit.money(r.lastReal), rateA: kit.percent(r.firstYearRate, 2)
    };
  }

  function summary(o, r) {
    if (r.mode === 'b') return `Under these assumptions, ${kit.money(o.balance)} earning ${kit.number(o.ret, 2)}% a year could support an estimated ${kit.money(r.payment)} a month for ${o.years} year${o.years === 1 ? '' : 's'} before the balance reaches zero.`;
    if (r.depletedAt === null) return `Under these assumptions, ${kit.money(o.balance)} with withdrawals starting at ${kit.money(o.withdrawal)} a month could last beyond ${CAP_YEARS} years, with an estimated ${kit.money(r.end)} left at that point.`;
    return `Under these assumptions, ${kit.money(o.balance)} with withdrawals starting at ${kit.money(o.withdrawal)} a month could last an estimated ${duration(r.depletedAt)} before it runs out.`;
  }

  function chart(o, r) {
    const labels = ['Start', ...r.rows.map(row => `Year ${row.year}`)];
    const series = [{ key: 'value', label: 'Portfolio balance', values: [o.balance, ...r.rows.map(row => row.end)] }];
    if (r.mode === 'a') series.push({ key: 'alt', label: "Balance in today's dollars", values: [o.balance, ...r.rows.map(row => row.real)] });
    const marked = r.mode === 'a' && r.depletedAt !== null ? labels.length - 1 : null;
    const describe = r.mode === 'a' && r.depletedAt !== null
      ? `Portfolio balance falls from ${kit.money(o.balance)} to zero after an estimated ${duration(r.depletedAt)}.`
      : `Portfolio balance moves from ${kit.money(o.balance)} to ${kit.money(r.end)} over ${r.rows.length} year${r.rows.length === 1 ? '' : 's'}.`;
    return kit.lineChart({ labels, series, highlight: marked, describe });
  }

  function tableRows(r) {
    return r.rows.map(row => `<tr><th scope="row">${row.year}</th><td class="num">${kit.money(row.start)}</td><td class="num">${kit.money(row.withdrawals)}</td><td class="num">${kit.money(row.growth)}</td><td class="num">${kit.money(row.end)}</td><td class="num">${kit.money(row.real)}</td></tr>`).join('');
  }

  const engine = { CAP_YEARS, monthlyRate, project, levelWithdrawal, duration, run, outputs, summary, chart, tableRows };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('withdrawal', box => {
    const form = box.querySelector('form');
    const f = name => form.elements[name];
    const opt = name => (f(name).value.trim() === '' ? 0 : kit.num(f(name)));
    const setMode = mode => {
      f('mode').value = mode;
      box.querySelectorAll('[data-mode-button]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.modeButton === mode)));
      box.querySelectorAll('[data-mode]').forEach(el => { el.hidden = el.dataset.mode !== mode; el.style.display = el.hidden ? 'none' : ''; });
    };
    const update = () => {
      const mode = f('mode').value;
      const o = { mode, balance: kit.num(f('balance')), withdrawal: kit.num(f('withdrawal')), ret: kit.num(f('ret')), inflation: opt('inflation'), growth: opt('growth'), years: kit.num(f('years')), timing: form.querySelector('input[name="timing"]:checked').value };
      const checks = [[f('balance'), kit.range(o.balance, 1, 1e12)], [f('ret'), kit.range(o.ret, -50, 50)]];
      if (mode === 'a') checks.push([f('withdrawal'), kit.range(o.withdrawal, 1, 1e9)], [f('inflation'), kit.range(o.inflation, -10, 30)], [f('growth'), kit.range(o.growth, -50, 50)]);
      else checks.push([f('years'), kit.range(o.years, 1, 100, { integer: true })]);
      if (!kit.errors(form, checks)) return;
      const r = run(o);
      const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { if (values[el.dataset.out] !== undefined) el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-big-label]').textContent = mode === 'b' ? 'Estimated monthly withdrawal' : 'Estimated time until the money runs out';
      box.querySelector('[data-summary]').textContent = summary(o, r);
      const view = chart(o, r); const svg = box.querySelector('svg');
      svg.innerHTML = view.svg; svg.setAttribute('aria-label', view.desc);
      box.querySelector('[data-real-key]').hidden = mode === 'b';
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    box.querySelectorAll('[data-mode-button]').forEach(button => button.addEventListener('click', () => { setMode(button.dataset.modeButton); update(); }));
    form.addEventListener('reset', () => setTimeout(() => setMode('a'), 0));
    setMode(f('mode').value || 'a');
    kit.live(form, update);
  });
})(typeof window === 'undefined' ? globalThis : window);
