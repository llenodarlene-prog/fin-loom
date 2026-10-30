// Fin Loom mortgage payoff calculator: how extra principal payments shorten a fixed-rate mortgage
// and reduce total interest. Monthly amortization at APR / 12; extra payments go to principal.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const MAX_MONTHS = 1200;

  // Scheduled payment: P x r / (1 - (1 + r)^-n), or P / n at a 0% rate.
  function scheduledPayment(balance, aprPercent, months) {
    const r = aprPercent / 1200;
    if (months <= 0) return 0;
    return r === 0 ? balance / months : balance * r / (1 - Math.pow(1 + r, -months));
  }

  // Month-by-month amortization. Month 1 is the first payment after today. The one-time payment is
  // added in its month. Returns payoff month count, total interest, yearly rows, and balances.
  function amortize(o) {
    const r = o.apr / 1200;
    let balance = o.balance; let interestTotal = 0; let paid = 0; let month = 0;
    const balances = [balance]; const years = [];
    let year = { interest: 0, principal: 0 };
    while (balance > 1e-6 && month < MAX_MONTHS) {
      month += 1;
      const interest = balance * r;
      let pay = o.payment + (o.extra || 0) + (o.lump && month === o.lumpMonth ? o.lump : 0);
      if (pay >= balance + interest) pay = balance + interest;
      if (pay <= interest && month === 1 && !(o.lump && o.lumpMonth === 1)) return { ok: false, firstInterest: interest };
      const principal = pay - interest;
      balance -= principal;
      // A payment rounded to the cent can leave a few dollars after the last scheduled month; as lenders do, the final payment absorbs a remainder under 0.5% of the payment.
      if (balance > 1e-6 && balance < Math.max(1, o.payment * 0.005)) { pay += balance; balance = 0; }
      interestTotal += interest; paid += pay;
      year.interest += interest; year.principal += pay - interest;
      balances.push(Math.max(0, balance));
      if (month % 12 === 0 || balance <= 1e-6) { years.push({ year: Math.ceil(month / 12), interest: year.interest, principal: year.principal, end: Math.max(0, balance) }); year = { interest: 0, principal: 0 }; }
    }
    return { ok: balance <= 1e-6, months: month, interest: interestTotal, paid, balances, years };
  }

  const addMonths = (start, n) => { const total = start.year * 12 + (start.month - 1) + n; return { year: Math.floor(total / 12), month: (total % 12) + 1 }; };
  const dateLabel = d => `${MONTHS[d.month - 1]} ${d.year}`;
  const span = months => {
    const y = Math.floor(months / 12); const m = months % 12;
    const parts = [];
    if (y) parts.push(`${y} year${y === 1 ? '' : 's'}`);
    if (m || !y) parts.push(`${m} month${m === 1 ? '' : 's'}`);
    return parts.join(' ');
  };

  // Compare the current schedule with the schedule including extra payments.
  function payoff(o, start) {
    const base = amortize({ balance: o.balance, apr: o.apr, payment: o.payment });
    const fast = amortize(o);
    const termMonths = o.termYears * 12 + o.termMonths;
    const scheduled = scheduledPayment(o.balance, o.apr, termMonths);
    return {
      ok: base.ok && fast.ok, base, fast, scheduled, termMonths,
      saved: base.ok && fast.ok ? base.months - fast.months : 0,
      interestSaved: base.ok && fast.ok ? base.interest - fast.interest : 0,
      baseDate: addMonths(start, base.months || 0), fastDate: addMonths(start, fast.months || 0)
    };
  }

  // Returns an inline message for the payment field, or ''.
  function checkPayment(o) {
    const firstInterest = o.balance * o.apr / 1200;
    if (o.payment <= firstInterest) return `A payment of ${kit.money(o.payment)} does not cover the first month's interest of ${kit.money(firstInterest)}, so the balance would never be paid off.`;
    return '';
  }

  function warnings(o, r) {
    const notes = [];
    if (r.ok && r.base.months > r.termMonths + 1) notes.push(`At ${kit.money(o.payment)} a month, the current schedule runs ${span(r.base.months)}, longer than the remaining term of ${span(r.termMonths)} you entered. The payment that fits the term is about ${kit.money(r.scheduled)}.`);
    if (r.ok && r.base.months < r.termMonths - 1) notes.push(`At ${kit.money(o.payment)} a month, the current schedule already ends in ${span(r.base.months)}, sooner than the remaining term of ${span(r.termMonths)} you entered.`);
    return notes;
  }

  function extraText(o) {
    const parts = [];
    if (o.extra > 0) parts.push(`${kit.money(o.extra)} extra a month`);
    if (o.lump > 0) parts.push(`a one-time ${kit.money(o.lump)} payment`);
    return parts.length ? parts.join(' and ') : 'no extra payments';
  }

  function summary(o, r) {
    if (!r.saved) return `Under these assumptions, with ${extraText(o)}, the mortgage could be paid off in ${dateLabel(r.baseDate)}, with an estimated ${kit.money(r.base.interest)} of total interest.`;
    return `Under these assumptions, adding ${extraText(o)} could pay off the mortgage in ${dateLabel(r.fastDate)} instead of ${dateLabel(r.baseDate)}, ${span(r.saved)} sooner, and save an estimated ${kit.money(r.interestSaved)} in interest.`;
  }

  function outputs(o, r) {
    return {
      big: r.saved > 0 ? `${span(r.saved)} sooner` : 'No change',
      baseDate: dateLabel(r.baseDate), fastDate: dateLabel(r.fastDate),
      baseInterest: kit.money(r.base.interest), fastInterest: kit.money(r.fast.interest),
      saved: kit.money(r.interestSaved), totalPaid: kit.money(r.fast.paid), scheduled: kit.money(r.scheduled),
      cardBase: dateLabel(r.baseDate), cardFast: dateLabel(r.fastDate), cardSaved: r.saved > 0 ? `${span(r.saved)} saved` : 'No time saved',
      cardFastLabel: `With ${extraText(o)}`
    };
  }

  // Yearly balance for both schedules, padded with zeros after payoff.
  function chart(r) {
    const years = Math.ceil(Math.max(r.base.months, r.fast.months) / 12);
    const at = (list, y) => (y * 12 < list.length ? list[y * 12] : 0);
    const labels = []; const base = []; const fast = [];
    for (let y = 0; y <= years; y += 1) { labels.push(`Year ${y}`); base.push(at(r.base.balances, y)); fast.push(at(r.fast.balances, y)); }
    return kit.lineChart({ labels, series: [{ key: 'value', label: 'Balance with extra payments', values: fast }, { key: 'capital', label: 'Balance on the current schedule', values: base }], highlight: Math.ceil(r.fast.months / 12), describe: `Mortgage balance by year. With extra payments it reaches zero after ${span(r.fast.months)}; on the current schedule it reaches zero after ${span(r.base.months)}.` });
  }

  function tableRows(r) {
    return r.fast.years.map(row => `<tr><th scope="row">${row.year}</th><td class="num">${kit.money(row.interest)}</td><td class="num">${kit.money(row.principal)}</td><td class="num">${kit.money(row.end)}</td></tr>`).join('');
  }

  const engine = { MONTHS, scheduledPayment, amortize, addMonths, dateLabel, span, payoff, checkPayment, warnings, summary, outputs, chart, tableRows };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('mortgage-payoff', node => {
    const form = node.querySelector('form');
    const f = name => form.elements[name];
    const opt = name => (f(name).value.trim() === '' ? 0 : kit.num(f(name)));
    const now = new Date();
    const start = { year: now.getFullYear(), month: now.getMonth() + 1 };
    const run = () => {
      const o = { balance: kit.num(f('balance')), apr: kit.num(f('apr')), termYears: kit.num(f('years')), termMonths: opt('months'), payment: kit.num(f('payment')), extra: opt('extra'), lump: opt('lump'), lumpMonth: f('lumpmonth').value.trim() === '' ? 1 : kit.num(f('lumpmonth')) };
      const termError = kit.range(o.termYears, 0, 50, { integer: true }) || kit.range(o.termMonths, 0, 11, { integer: true }) || (o.termYears * 12 + o.termMonths < 1 ? 'Enter a remaining term of at least one month.' : '');
      const base = [[f('balance'), kit.range(o.balance, 1, 100000000)], [f('apr'), kit.range(o.apr, 0, 30)], [f('years'), termError], [f('payment'), kit.range(o.payment, 0.01, 10000000)], [f('extra'), kit.range(o.extra, 0, 10000000)], [f('lump'), kit.range(o.lump, 0, 100000000)], [f('lumpmonth'), kit.range(o.lumpMonth, 1, 600, { integer: true })]];
      if (!kit.errors(form, base)) return;
      if (!kit.errors(form, [[f('payment'), checkPayment(o)]])) return;
      const r = payoff(o, start);
      if (!r.ok) return;
      const values = outputs(o, r);
      node.querySelectorAll('[data-out]').forEach(el => { if (el.dataset.out in values) el.textContent = values[el.dataset.out]; });
      node.querySelector('[data-summary]').textContent = summary(o, r);
      const view = chart(r); const svg = node.querySelector('svg');
      svg.innerHTML = view.svg; svg.setAttribute('aria-label', view.desc);
      node.querySelector('tbody').innerHTML = tableRows(r);
      const notes = warnings(o, r); const box = node.querySelector('[data-warnings]');
      box.hidden = notes.length === 0; box.innerHTML = notes.map(text => `<p>${text}</p>`).join('');
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
