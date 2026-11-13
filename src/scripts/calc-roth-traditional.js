// Fin Loom Roth vs traditional IRA calculator: the same pre-tax earnings put into each account type,
// compared on after-tax value at retirement.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  // 2026 IRA contribution limit: $7,500, plus $1,100 catch-up at 50+ (IRS, November 2025 announcement).
  const IRA_2026 = 7500;
  const LIMITS = { amount: [1, 1000000], years: [1, 60], rate: [-20, 30], tax: [0, 60] };

  // Year-end contributions for `years` years at a constant return. factor = future value of $1 a year.
  function fvFactor(years, rate) {
    const r = rate / 100;
    return Math.abs(r) < 1e-12 ? years : (Math.pow(1 + r, years) - 1) / r;
  }

  function compare(o) {
    const factor = fvFactor(o.years, o.rate);
    const tradBalance = o.amount * factor;
    const tradAfterTax = tradBalance * (1 - o.retireTax / 100);
    const rothContribution = o.amount * (1 - o.nowTax / 100);
    const rothAfterTax = rothContribution * factor;
    return {
      factor, tradBalance, tradAfterTax, rothContribution, rothAfterTax,
      diff: rothAfterTax - tradAfterTax, tradTax: tradBalance - tradAfterTax,
      overLimit: o.amount > IRA_2026
    };
  }

  function summary(o, r) {
    const which = Math.abs(r.diff) < 0.005 ? 'Both accounts end with the same after-tax value' : r.diff > 0 ? `The Roth ends about ${kit.money(r.diff)} higher after tax` : `The traditional account ends about ${kit.money(-r.diff)} higher after tax`;
    return `${which} in this example. The result turns on the tax rates: a ${kit.number(o.nowTax, 1)}% rate today against ${kit.number(o.retireTax, 1)}% in retirement, with the same ${kit.number(o.rate, 1)}% assumed return in both accounts.`;
  }

  function outputs(r) {
    return {
      big: kit.money(Math.abs(r.diff)), label: r.diff >= 0 ? 'Roth advantage after tax' : 'Traditional advantage after tax',
      tradBalance: kit.money(r.tradBalance), tradAfterTax: kit.money(r.tradAfterTax), tradTax: kit.money(r.tradTax),
      rothContribution: kit.money(r.rothContribution), rothAfterTax: kit.money(r.rothAfterTax)
    };
  }

  function tableRows(o, r) {
    const line = (label, a, b) => `<tr><th scope="row">${label}</th><td class="num">${a}</td><td class="num">${b}</td></tr>`;
    return [
      line('Pre-tax earnings set aside each year', kit.money(o.amount), kit.money(o.amount)),
      line('Tax paid now on the contribution', kit.money(0), kit.money(o.amount - r.rothContribution)),
      line('Amount invested each year', kit.money(o.amount), kit.money(r.rothContribution)),
      line('Balance at retirement', kit.money(r.tradBalance), kit.money(r.rothAfterTax)),
      line('Tax paid on withdrawal', kit.money(r.tradTax), kit.money(0)),
      line('After-tax value', kit.money(r.tradAfterTax), kit.money(r.rothAfterTax))
    ].join('');
  }

  function check(o) {
    return {
      amount: kit.range(o.amount, ...LIMITS.amount), years: kit.range(o.years, ...LIMITS.years, { integer: true }),
      rate: kit.range(o.rate, ...LIMITS.rate), nowTax: kit.range(o.nowTax, ...LIMITS.tax), retireTax: kit.range(o.retireTax, ...LIMITS.tax)
    };
  }

  const engine = { IRA_2026, LIMITS, fvFactor, compare, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('roth-traditional', box => {
    const form = box.querySelector('form');
    const f = name => form.elements[name];
    const run = () => {
      const o = { amount: kit.num(f('amount')), years: kit.num(f('years')), rate: kit.num(f('rate')), nowTax: kit.num(f('now')), retireTax: kit.num(f('retire')) };
      const msg = check(o);
      if (!kit.errors(form, [[f('amount'), msg.amount], [f('years'), msg.years], [f('rate'), msg.rate], [f('now'), msg.nowTax], [f('retire'), msg.retireTax]])) return;
      const r = compare(o);
      const values = outputs(r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('.finloom-calc-label span').textContent = values.label;
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(o, r);
      const warn = box.querySelector('[data-warnings]');
      warn.hidden = !r.overLimit;
      warn.textContent = r.overLimit ? `This is above the 2026 IRA limit of ${kit.money(IRA_2026)} (${kit.money(IRA_2026 + 1100)} at age 50 or older). The comparison still runs, but you could not contribute this much to an IRA.` : '';
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
