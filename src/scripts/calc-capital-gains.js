// Fin Loom capital gains tax calculator: estimated federal income tax on a single sale, tax year 2026.
// Source: Rev. Proc. 2025-32, Internal Revenue Bulletin 2025-45 (https://www.irs.gov/irb/2025-45_IRB):
// section 1(j)(2) Tables 1-4 for ordinary rates and the section 1(h) maximum 0% and 15% rate amounts.
// Long-term gains and qualified dividends are stacked on top of ordinary taxable income and taxed in
// the 0%/15%/20% bands; short-term gains are taxed as ordinary income. The tax on the gain is the
// tax with the gain minus the tax without it. NIIT, state tax, 25%/28% gains, and loss limits are not modeled.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const STATUSES = { single: 'Single', marriedJoint: 'Married filing jointly', marriedSeparate: 'Married filing separately', headOfHousehold: 'Head of household' };
  const RATES = [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37];
  // Ordinary brackets: the upper edge of each rate band below 37%. capital: maximum 0% and 15% rate amounts.
  const TAX_RULES = {
    2026: {
      single: { brackets: [12400, 50400, 105700, 201775, 256225, 640600], capital: [49450, 545500], niit: 200000 },
      marriedJoint: { brackets: [24800, 100800, 211400, 403550, 512450, 768700], capital: [98900, 613700], niit: 250000 },
      marriedSeparate: { brackets: [12400, 50400, 105700, 201775, 256225, 384350], capital: [49450, 306850], niit: 125000 },
      headOfHousehold: { brackets: [17700, 67450, 105700, 201750, 256200, 640600], capital: [66200, 579600], niit: 200000 }
    }
  };
  const YEAR = 2026;

  // Tax on ordinary taxable income, split by rate band.
  function ordinaryBands(income, rules) {
    const bands = [];
    let lower = 0;
    RATES.forEach((rate, i) => {
      const upper = i < rules.brackets.length ? rules.brackets[i] : Infinity;
      const amount = Math.max(0, Math.min(income, upper) - lower);
      bands.push({ rate, amount, tax: amount * rate });
      lower = upper;
    });
    return bands;
  }

  // Preferential income (long-term gains plus qualified dividends) stacked above ordinary income.
  function capitalBands(ordinary, preferential, rules) {
    const [zeroTop, fifteenTop] = rules.capital;
    const top = ordinary + preferential;
    const zero = Math.max(0, Math.min(top, zeroTop) - ordinary);
    const fifteen = Math.max(0, Math.min(top, fifteenTop) - Math.max(ordinary, zeroTop));
    const twenty = Math.max(0, preferential - zero - fifteen);
    return [{ rate: 0, amount: zero, tax: 0 }, { rate: 0.15, amount: fifteen, tax: fifteen * 0.15 }, { rate: 0.20, amount: twenty, tax: twenty * 0.20 }];
  }

  function totalTax(ordinary, preferential, rules) {
    const sum = list => list.reduce((total, band) => total + band.tax, 0);
    return sum(ordinaryBands(ordinary, rules)) + sum(capitalBands(ordinary, preferential, rules));
  }

  function estimate(o) {
    const rules = TAX_RULES[YEAR][o.status];
    const gain = o.proceeds - o.basis - o.fees;
    const taxable = Math.max(0, gain);
    const longTerm = o.holding === 'long';
    const base = totalTax(o.income, o.dividends, rules);
    const withGain = longTerm ? totalTax(o.income, o.dividends + taxable, rules) : totalTax(o.income + taxable, o.dividends, rules);
    const tax = withGain - base;
    // Breakdown: how much of the gain lands in each rate band.
    let breakdown;
    if (longTerm) {
      const before = capitalBands(o.income, o.dividends, rules); const after = capitalBands(o.income, o.dividends + taxable, rules);
      breakdown = after.map((band, i) => ({ rate: band.rate, amount: band.amount - before[i].amount, kind: 'Long-term rate' }));
    } else {
      const before = ordinaryBands(o.income, rules); const after = ordinaryBands(o.income + taxable, rules);
      breakdown = after.map((band, i) => ({ rate: band.rate, amount: band.amount - before[i].amount, kind: 'Ordinary rate' }));
      // Ordinary income pushed higher also moves qualified dividends between bands; that shift is part of the gain's tax.
    }
    breakdown = breakdown.filter(band => band.amount > 0.004).map(band => Object.assign(band, { tax: band.amount * band.rate }));
    const preferentialShift = tax - breakdown.reduce((total, band) => total + band.tax, 0);
    return {
      gain, taxable, longTerm, tax, base, withGain, rules, breakdown, preferentialShift: Math.abs(preferentialShift) < 0.005 ? 0 : preferentialShift,
      effective: taxable > 0 ? tax / taxable : 0, afterTax: o.proceeds - o.fees - tax,
      niitPossible: o.income + o.dividends + taxable > rules.niit
    };
  }

  function check(o) {
    return {
      income: kit.range(o.income, 0, 1e9), basis: kit.range(o.basis, 0, 1e9), proceeds: kit.range(o.proceeds, 0, 1e9),
      fees: kit.range(o.fees, 0, 1e8), dividends: kit.range(o.dividends, 0, 1e9)
    };
  }

  function summary(o, r) {
    const term = r.longTerm ? 'long-term' : 'short-term';
    if (r.gain <= 0) return `Under these assumptions, this sale produces a ${term} loss of ${kit.money(-r.gain)}, so the estimated federal tax on it is ${kit.money(0)}. Loss deduction limits and carryovers are not modeled.`;
    return `Under these assumptions, a ${term} gain of ${kit.money(r.taxable)} could add an estimated ${kit.money(r.tax)} of federal income tax for ${YEAR}, an effective rate of ${kit.percent(r.effective, 1)} on the gain, leaving about ${kit.money(r.afterTax)} after fees and that tax.`;
  }

  function outputs(o, r) {
    return {
      big: kit.money(r.tax), gain: kit.money(r.taxable), loss: r.gain < 0 ? kit.money(-r.gain) : kit.money(0),
      effective: kit.percent(r.effective, 1), afterTax: kit.money(r.afterTax), term: r.longTerm ? 'Long-term (held more than one year)' : 'Short-term (held one year or less)',
      before: kit.money(r.base), after: kit.money(r.withGain)
    };
  }

  function warnings(o, r) {
    const notes = [];
    if (r.gain < 0) notes.push('This sale is a loss. Capital loss limits ($3,000 a year against ordinary income, $1,500 if married filing separately) and carryovers are not modeled.');
    if (r.niitPossible) notes.push(`Income here exceeds the ${kit.money0(r.rules.niit)} Net Investment Income Tax threshold for this filing status. The 3.8% NIIT may apply but is not included.`);
    return notes;
  }

  function tableRows(r) {
    const rows = r.breakdown.map(band => `<tr><th scope="row">${band.kind} ${kit.percent(band.rate, 0)}</th><td class="num">${kit.money(band.amount)}</td><td class="num">${kit.money(band.tax)}</td></tr>`);
    if (r.preferentialShift) rows.push(`<tr><th scope="row">Qualified dividends pushed into higher bands</th><td class="num">n/a</td><td class="num">${kit.money(r.preferentialShift)}</td></tr>`);
    if (!rows.length) rows.push('<tr><th scope="row">No taxable gain</th><td class="num">$0.00</td><td class="num">$0.00</td></tr>');
    return rows.join('');
  }

  const engine = { YEAR, STATUSES, TAX_RULES, ordinaryBands, capitalBands, totalTax, estimate, check, summary, outputs, warnings, tableRows };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('capital-gains', node => {
    const form = node.querySelector('form');
    const f = name => form.elements[name];
    const opt = name => (f(name).value.trim() === '' ? 0 : kit.num(f(name)));
    const run = () => {
      const o = { status: f('status').value, income: kit.num(f('income')), basis: kit.num(f('basis')), proceeds: kit.num(f('proceeds')), fees: opt('fees'), dividends: opt('dividends'), holding: form.querySelector('input[name="holding"]:checked').value };
      const messages = check(o);
      if (!kit.errors(form, Object.keys(messages).map(key => [f(key), messages[key]]))) return;
      const r = estimate(o);
      const values = outputs(o, r);
      node.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      node.querySelector('[data-summary]').textContent = summary(o, r);
      node.querySelector('tbody').innerHTML = tableRows(r);
      const notes = warnings(o, r); const box = node.querySelector('[data-warnings]');
      box.hidden = !notes.length; box.innerHTML = notes.map(text => `<p>${text}</p>`).join('');
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
