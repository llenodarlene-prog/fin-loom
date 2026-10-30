// Fin Loom 401(k) withdrawal tax calculator: estimated tax on a traditional (pre-tax) 401(k) withdrawal, tax year 2026.
// Federal brackets: Rev. Proc. 2025-32, Internal Revenue Bulletin 2025-45 (https://www.irs.gov/irb/2025-45_IRB),
// section 1(j)(2) Tables 1-4; standard deductions from section .14 of the same revenue procedure (shown as context).
// 10% additional tax: IRS Topic 558 (https://www.irs.gov/taxtopics/tc558), early distributions before age 59½.
// 20% withholding: IRS Topic 413 (https://www.irs.gov/taxtopics/tc413), eligible rollover distributions paid to you.
// The withdrawal is taxed as ordinary income stacked on the taxable income entered; the federal tax on it is
// tax with the withdrawal minus tax without it. State tax is an optional flat rate the reader enters.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const YEAR = 2026;
  const STATUSES = { single: 'Single', marriedJoint: 'Married filing jointly', marriedSeparate: 'Married filing separately', headOfHousehold: 'Head of household' };
  const RATES = [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37];
  // Upper edge of each rate band below 37%, and the standard deduction, from Rev. Proc. 2025-32.
  const TAX_RULES = {
    2026: {
      single: { brackets: [12400, 50400, 105700, 201775, 256225, 640600], standard: 16100 },
      marriedJoint: { brackets: [24800, 100800, 211400, 403550, 512450, 768700], standard: 32200 },
      marriedSeparate: { brackets: [12400, 50400, 105700, 201775, 256225, 384350], standard: 16100 },
      headOfHousehold: { brackets: [17700, 67450, 105700, 201750, 256200, 640600], standard: 24150 }
    }
  };
  const PENALTY = 0.10;
  const WITHHOLDING = 0.20;
  const LIMITS = { income: [0, 100000000], amount: [0.01, 100000000], age: [18, 120], state: [0, 20] };

  function bands(income, rules) {
    const list = [];
    let lower = 0;
    RATES.forEach((rate, i) => {
      const upper = i < rules.brackets.length ? rules.brackets[i] : Infinity;
      const amount = Math.max(0, Math.min(income, upper) - lower);
      list.push({ rate, amount, tax: amount * rate });
      lower = upper;
    });
    return list;
  }

  const tax = (income, rules) => bands(income, rules).reduce((sum, band) => sum + band.tax, 0);

  function estimate(o) {
    const rules = TAX_RULES[YEAR][o.status];
    const before = bands(o.income, rules); const after = bands(o.income + o.amount, rules);
    const federal = tax(o.income + o.amount, rules) - tax(o.income, rules);
    const breakdown = after.map((band, i) => ({ rate: band.rate, amount: band.amount - before[i].amount })).filter(band => band.amount > 0.004).map(band => Object.assign(band, { tax: band.amount * band.rate }));
    const early = o.age < 59.5;
    const penalty = early && !o.exception ? o.amount * PENALTY : 0;
    const state = o.amount * o.stateRate / 100;
    const total = federal + penalty + state;
    return {
      rules, breakdown, federal, penalty, state, total, early,
      net: o.amount - total,
      effective: o.amount > 0 ? total / o.amount : 0,
      withholding: o.amount * WITHHOLDING,
      marginal: breakdown.length ? breakdown[breakdown.length - 1].rate : RATES[0]
    };
  }

  function check(o) {
    return {
      income: kit.range(o.income, ...LIMITS.income),
      amount: kit.range(o.amount, ...LIMITS.amount),
      age: kit.range(o.age, ...LIMITS.age),
      state: kit.range(o.stateRate, ...LIMITS.state)
    };
  }

  function summary(o, r) {
    const parts = [`federal income tax of about ${kit.money(r.federal)}`];
    if (r.penalty > 0) parts.push(`a 10% additional tax of ${kit.money(r.penalty)}`);
    if (r.state > 0) parts.push(`an estimated ${kit.money(r.state)} of state tax`);
    return `Under these assumptions, a ${kit.money(o.amount)} withdrawal in ${YEAR} could carry ${parts.join(', ')}, about ${kit.money(r.total)} in total (${kit.percent(r.effective, 1)}), leaving roughly ${kit.money(r.net)}.`;
  }

  function outputs(o, r) {
    return {
      big: kit.money(r.total), federal: kit.money(r.federal), penalty: r.penalty > 0 ? kit.money(r.penalty) : (r.early ? '$0.00 (exception applied)' : '$0.00 (age 59½ or older)'),
      state: kit.money(r.state), net: kit.money(r.net), effective: kit.percent(r.effective, 1), withholding: kit.money(r.withholding),
      netCard: kit.money(r.net), federalCard: kit.money(r.federal), penaltyCard: kit.money(r.penalty), stateCard: kit.money(r.state)
    };
  }

  // Split of the gross withdrawal, as labeled bars so meaning never depends on color alone.
  function split(o, r) {
    const parts = [['Kept after tax', r.net, ''], ['Federal income tax', r.federal, ''], ['10% additional tax', r.penalty, ' finloom-calc-bar-fill--loss'], ['State tax (estimate)', r.state, '']];
    return parts.map(([label, value, extra]) => {
      const share = o.amount > 0 ? Math.max(0, value) / o.amount : 0;
      return `<div class="finloom-calc-bar-row"><span>${label}: <strong>${kit.money(value)}</strong> (${kit.percent(share, 1)})</span><span class="finloom-calc-bar-track" aria-hidden="true"><span class="finloom-calc-bar-fill${extra}" style="width:${(share * 100).toFixed(2)}%"></span></span></div>`;
    }).join('');
  }

  function tableRows(r) {
    if (!r.breakdown.length) return '<tr><th scope="row">No federal income tax</th><td class="num">$0.00</td><td class="num">$0.00</td></tr>';
    return r.breakdown.map(band => `<tr><th scope="row">${kit.percent(band.rate, 0)} bracket</th><td class="num">${kit.money(band.amount)}</td><td class="num">${kit.money(band.tax)}</td></tr>`).join('');
  }

  const engine = { YEAR, STATUSES, TAX_RULES, PENALTY, WITHHOLDING, LIMITS, bands, tax, estimate, check, summary, outputs, split, tableRows };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('withdrawal-tax', box => {
    const form = box.querySelector('form');
    const f = name => form.elements[name];
    const opt = name => (f(name).value.trim() === '' ? 0 : kit.num(f(name)));
    const run = () => {
      const o = { status: f('status').value, income: opt('income'), amount: kit.num(f('amount')), age: kit.num(f('age')), exception: form.querySelector('input[name="exception"]:checked').value === 'yes', stateRate: opt('state') };
      const c = check(o);
      if (!kit.errors(form, [[f('income'), c.income], [f('amount'), c.amount], [f('age'), c.age], [f('state'), c.state]])) return;
      const r = estimate(o);
      const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('[data-split]').innerHTML = split(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
      box.querySelector('[data-exception-field]').hidden = !(o.age < 59.5);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
