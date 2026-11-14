// Fin Loom 401(k) loan calculator. IRS limit: the lesser of $50,000 or the greater of $10,000 or 50%
// of the vested balance (before the 12-month high-balance reduction for prior loans). Repayment in
// level payments over the term at the plan's rate; the projection compares the account with and
// without the loan, assuming the borrowed money would otherwise earn the market return.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { vested: [0, 100000000], amount: [0, 50000], rate: [0, 20], years: [1, 30], market: [-10, 20] };
  const FREQ = { 12: 'monthly', 26: 'every two weeks', 52: 'weekly', 4: 'quarterly' };

  const maxLoan = vested => Math.min(50000, Math.max(Math.min(10000, vested), vested * 0.5));

  function loan(o) {
    const n = o.years * o.freq; const i = o.rate / 100 / o.freq;
    const payment = i === 0 ? o.amount / n : o.amount * i / (1 - Math.pow(1 + i, -n));
    const totalPaid = payment * n; const interest = totalPaid - o.amount;
    // With the loan, interest paid goes back into the account; the lost market growth is the cost.
    const g = Math.pow(1 + o.market / 100, 1 / o.freq) - 1;
    let without = o.amount; let withLoan = 0;
    for (let k = 0; k < n; k += 1) { without *= 1 + g; withLoan = withLoan * (1 + g) + payment; }
    return { payment, totalPaid, interest, n, max: maxLoan(o.vested), over: o.amount > maxLoan(o.vested), opportunity: without - withLoan };
  }

  function summary(o, r) {
    const base = `Borrowing ${kit.money(o.amount)} at ${kit.number(o.rate, 2)}% over ${o.years} year${o.years === 1 ? '' : 's'} means ${r.n} payments of about ${kit.money(r.payment)} ${FREQ[o.freq]}, with ${kit.money(r.interest)} of interest paid back into your account.`;
    const growth = r.opportunity > 0 ? ` If the money would otherwise have earned ${kit.number(o.market, 1)}% a year, the account could end about ${kit.money(r.opportunity)} lower.` : '';
    return r.over ? `${base} Note: the IRS maximum for a ${kit.money(o.vested)} vested balance is ${kit.money(r.max)}.` : base + growth;
  }

  function outputs(o, r) {
    return { big: kit.money(r.payment), max: kit.money(r.max), interest: kit.money(r.interest), total: kit.money(r.totalPaid), count: String(r.n), opportunity: kit.money(Math.max(0, r.opportunity)) };
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: k === 'years' });
    if (!m.amount && o.amount > maxLoan(o.vested)) m.amount = `The IRS maximum for this vested balance is ${kit.money(maxLoan(o.vested))}.`;
    if (!m.years && o.years > 5 && !o.home) m.years = 'General-purpose 401(k) loans must be repaid within 5 years. Tick the home purchase box for a longer term.';
    return m;
  }

  const engine = { LIMITS, maxLoan, loan, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('401k-loan', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = { vested: kit.num(f('vested')), amount: kit.num(f('amount')), rate: kit.num(f('rate')), years: kit.num(f('years')), market: kit.num(f('market')), freq: Number(f('freq').value), home: f('home').checked };
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = loan(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
