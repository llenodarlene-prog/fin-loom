// Fin Loom credit card debt payoff calculator. Monthly engine: interest is balance x APR / 12, the
// payment is applied after interest, and no new charges are added. The minimum payment is either a
// fixed amount or a percent of the balance plus that month's interest, with a dollar floor. Runs
// stop when the balance reaches zero, when a payment cannot cover the interest, or at 600 months.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const CAP = 600;
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const NEVER = 'Under these assumptions the payment does not cover the monthly interest, so the balance would never be paid off. Increase the payment to see a payoff date.';
  const CAPPED = `Under these assumptions the balance would still not be paid off after ${CAP} months (50 years). Increase the payment to see a payoff date.`;

  function minimumPayment(o, balance, interest) {
    if (o.rule === 'percent') return Math.max(o.floor, balance * o.percent / 100 + interest);
    return o.minimum;
  }

  function payoff(o, extra = o.extra) {
    let balance = o.balance; let interestPaid = 0; let paid = 0; let months = 0; let never = false;
    const balances = [balance];
    const years = [];
    let year = { payments: 0, interest: 0, principal: 0 };
    while (balance > 0.005 && months < CAP) {
      const interest = balance * o.apr / 1200;
      const due = balance + interest;
      const payment = Math.min(due, minimumPayment(o, balance, interest) + extra);
      if (payment <= interest + 1e-9) { never = true; break; }
      balance = due - payment;
      if (balance < 0.005) balance = 0;
      months += 1; interestPaid += interest; paid += payment;
      year.payments += payment; year.interest += interest; year.principal += payment - interest;
      balances.push(balance);
      if (months % 12 === 0 || balance === 0) {
        years.push(Object.assign(year, { year: Math.ceil(months / 12), balance }));
        year = { payments: 0, interest: 0, principal: 0 };
      }
    }
    const capped = !never && balance > 0;
    return { months, interest: interestPaid, paid, balances, years, never, capped, done: !never && !capped };
  }

  // Month and year of the last payment, counting the first payment as next month.
  function payoffDate(start, months) {
    const index = start.year * 12 + (start.month - 1) + months;
    return `${MONTHS[index % 12]} ${Math.floor(index / 12)}`;
  }

  function span(months) {
    const y = Math.floor(months / 12); const m = months % 12;
    return [y ? `${y} year${y === 1 ? '' : 's'}` : '', m ? `${m} month${m === 1 ? '' : 's'}` : ''].filter(Boolean).join(', ') || '0 months';
  }

  function compare(o) {
    const base = payoff(o, 0);
    return [['Minimum only', 0], ['+$50/month', 50], ['+$100/month', 100], ['Custom', o.extra]].map(([name, extra]) => {
      const r = payoff(o, extra);
      return { name, extra, r, saved: base.done && r.done ? base.interest - r.interest : null };
    });
  }

  function summary(o, r, base, start) {
    if (r.never) return NEVER;
    if (r.capped) return CAPPED;
    const lead = o.extra > 0 ? `paying ${kit.money(o.extra)} extra a month` : 'paying the minimum each month';
    const saved = o.extra > 0 && base.done ? ` Compared with the minimum alone, that could save an estimated ${kit.money(base.interest - r.interest)} of interest.` : '';
    return `Under these assumptions, ${lead} could clear a ${kit.money(o.balance)} balance in ${span(r.months)}, around ${payoffDate(start, r.months)}, with an estimated ${kit.money(r.interest)} of interest.${saved}`;
  }

  function outputs(o, r, base, start) {
    const ok = r.done;
    return {
      big: ok ? `${r.months} month${r.months === 1 ? '' : 's'}` : 'Not paid off',
      date: ok ? payoffDate(start, r.months) : 'Not paid off', span: ok ? span(r.months) : 'Not paid off',
      interest: ok ? kit.money(r.interest) : 'Not available', paid: ok ? kit.money(r.paid) : 'Not available',
      saved: ok && base.done ? kit.money(base.interest - r.interest) : 'Not available',
      baseMonths: base.done ? `${base.months} months, ${kit.money(base.interest)} interest` : 'Not paid off'
    };
  }

  function chart(o) {
    const base = payoff(o, 0); const r = payoff(o);
    const length = Math.max(base.balances.length, r.balances.length);
    const pad = list => Array.from({ length }, (_, i) => (i < list.length ? list[i] : 0));
    return kit.lineChart({
      labels: Array.from({ length }, (_, i) => `Month ${i}`),
      series: [
        { key: 'value', label: 'Balance with extra payment', values: pad(r.balances) },
        { key: 'capital', label: 'Balance with minimum only', values: pad(base.balances) }
      ],
      describe: `Balance over ${length - 1} months. With the extra payment it falls to ${kit.money(r.balances[r.balances.length - 1])} after ${r.months} months; with the minimum only it falls to ${kit.money(base.balances[base.balances.length - 1])} after ${base.months} months.`
    });
  }

  function cards(o) {
    return compare(o).map(item => `<div class="finloom-calc-card"><p>${item.name}</p><strong>${item.r.done ? span(item.r.months) : 'Not paid off'}</strong><p>${item.r.done ? `${kit.money(item.r.interest)} interest` : 'Payment too low'}${item.saved !== null && item.extra > 0 ? `, saves ${kit.money(item.saved)}` : ''}</p></div>`).join('');
  }

  function tableRows(r) {
    return r.years.map(row => `<tr><th scope="row">${row.year}</th><td class="num">${kit.money(row.payments)}</td><td class="num">${kit.money(row.interest)}</td><td class="num">${kit.money(row.principal)}</td><td class="num">${kit.money(row.balance)}</td></tr>`).join('');
  }

  const engine = { CAP, NEVER, CAPPED, MONTHS, payoff, payoffDate, span, compare, summary, outputs, chart, cards, tableRows };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('credit-card-payoff', box => {
    const form = box.querySelector('form');
    const f = name => form.elements[name];
    const opt = name => (f(name).value.trim() === '' ? 0 : kit.num(f(name)));
    const now = new Date();
    const start = { year: now.getFullYear(), month: now.getMonth() + 1 };
    const run = () => {
      const o = { balance: kit.num(f('balance')), apr: kit.num(f('apr')), minimum: kit.num(f('minimum')), extra: opt('extra'), rule: form.querySelector('input[name="rule"]:checked').value, percent: opt('percent'), floor: opt('floor') };
      const ok = kit.errors(form, [
        [f('balance'), kit.range(o.balance, 1, 1e8)], [f('apr'), kit.range(o.apr, 0, 100)],
        [f('minimum'), o.rule === 'fixed' ? kit.range(o.minimum, 0.01, 1e7) : ''], [f('extra'), kit.range(o.extra, 0, 1e7)],
        [f('percent'), o.rule === 'percent' ? kit.range(o.percent, 0.1, 100) : ''], [f('floor'), o.rule === 'percent' ? kit.range(o.floor, 0, 1e6) : '']]);
      if (!ok) return;
      const r = payoff(o); const base = payoff(o, 0);
      const warning = box.querySelector('[data-warnings]');
      const note = r.never ? NEVER : r.capped ? CAPPED : '';
      warning.hidden = !note; warning.textContent = note;
      const values = outputs(o, r, base, start);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r, base, start);
      const view = chart(o); const svg = box.querySelector('svg');
      svg.innerHTML = view.svg; svg.setAttribute('aria-label', view.desc);
      box.querySelector('[data-scenarios]').innerHTML = cards(o);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
