// Fin Loom 1099 tax calculator, tax year 2026: estimated tax on self-employment (1099) income.
// SE tax follows Schedule SE: 15.3% of 92.35% of net earnings, none under $400, Social Security part
// capped at the $184,500 wage base less W-2 wages (IRS Topics 554 and 751; Publication 15 (2026)).
// Additional Medicare Tax 0.9% above $200,000 / $250,000 MFJ / $125,000 MFS (Topic 560). Income tax
// uses the 2026 brackets and standard deduction from Rev. Proc. 2025-32 (IRB 2025-45): the increase
// is tax on (W-2 + net SE income - half of SE tax - standard deduction) minus tax on W-2 income alone.
// The qualified business income (QBI) deduction, credits, and itemized deductions are not modeled.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const YEAR = 2026;
  const SE = { factor: 0.9235, minimum: 400, socialSecurity: 0.124, medicare: 0.029, additional: 0.009, wageBase: 184500 };
  const STATUSES = { single: 'Single', marriedJoint: 'Married filing jointly', marriedSeparate: 'Married filing separately', headOfHousehold: 'Head of household' };
  const RATES = [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37];
  const RULES = {
    single: { brackets: [12400, 50400, 105700, 201775, 256225, 640600], deduction: 16100, additional: 200000 },
    marriedJoint: { brackets: [24800, 100800, 211400, 403550, 512450, 768700], deduction: 32200, additional: 250000 },
    marriedSeparate: { brackets: [12400, 50400, 105700, 201775, 256225, 384350], deduction: 16100, additional: 125000 },
    headOfHousehold: { brackets: [17700, 67450, 105700, 201750, 256200, 640600], deduction: 24150, additional: 200000 }
  };

  function incomeTax(taxable, rules) {
    let lower = 0; let tax = 0;
    RATES.forEach((rate, i) => {
      const upper = i < rules.brackets.length ? rules.brackets[i] : Infinity;
      tax += Math.max(0, Math.min(taxable, upper) - lower) * rate;
      lower = upper;
    });
    return tax;
  }

  function marginalRate(taxable, rules) {
    const i = rules.brackets.findIndex(edge => taxable <= edge);
    return RATES[i === -1 ? RATES.length - 1 : i];
  }

  // Schedule SE rounds each line to the cent.
  const cents = value => Math.round(value * 100) / 100;

  function selfEmploymentTax(net, status, wages) {
    const subject = Math.max(0, net) * SE.factor;
    const owes = subject >= SE.minimum;
    const room = Math.max(0, SE.wageBase - wages);
    const socialSecurity = owes ? cents(Math.min(subject, room) * SE.socialSecurity) : 0;
    const medicare = owes ? cents(subject * SE.medicare) : 0;
    const additional = owes ? cents(Math.max(0, subject - Math.max(0, RULES[status].additional - wages)) * SE.additional) : 0;
    return { subject, owes, socialSecurity, medicare, additional, seTax: socialSecurity + medicare };
  }

  function estimate(o) {
    const rules = RULES[o.status];
    const net = Math.max(0, o.income - o.expenses);
    const se = selfEmploymentTax(net, o.status, o.wages);
    const half = se.seTax / 2;
    const taxableBefore = Math.max(0, o.wages - rules.deduction);
    const taxableAfter = Math.max(0, o.wages + net - half - rules.deduction);
    const incomeTaxIncrease = incomeTax(taxableAfter, rules) - incomeTax(taxableBefore, rules);
    const federal = se.seTax + se.additional + incomeTaxIncrease;
    const state = net * o.stateRate / 100;
    const total = federal + state;
    return {
      rules, net, se, half, taxableBefore, taxableAfter, incomeTaxIncrease, federal, state, total,
      setAside: net > 0 ? total / net : 0, afterTax: net - total, quarterly: total / 4, marginal: marginalRate(taxableAfter, rules)
    };
  }

  function check(o) {
    return {
      income: kit.range(o.income, 0, 1e9), expenses: kit.range(o.expenses, 0, 1e9) || (o.expenses > o.income ? 'Expenses above income create a loss; enter expenses up to your 1099 income.' : ''),
      wages: kit.range(o.wages, 0, 1e9), stateRate: kit.range(o.stateRate, 0, 20)
    };
  }

  function summary(o, r) {
    if (r.net <= 0) return `Under these assumptions there is no net self-employment income, so no extra tax is estimated for ${YEAR}.`;
    return `Under these assumptions, ${kit.money(r.net)} of net 1099 income could add about ${kit.money(r.total)} of tax for ${YEAR}${o.stateRate > 0 ? ', including state tax' : ''}, so setting aside about ${kit.percent(r.setAside, 0)} of it, or ${kit.money(r.quarterly)} a quarter, would cover the estimate.`;
  }

  function outputs(o, r) {
    return {
      big: `${kit.percent(r.setAside, 1)}`, net: kit.money(r.net), federal: kit.money(r.federal), se: kit.money(r.se.seTax),
      incomeTax: kit.money(r.incomeTaxIncrease), additional: kit.money(r.se.additional), state: kit.money(r.state),
      afterTax: kit.money(r.afterTax), quarterly: kit.money(r.quarterly), marginal: kit.percent(r.marginal, 0)
    };
  }

  function warnings(o, r) {
    const notes = [];
    if (r.net > 0 && !r.se.owes) notes.push('Net earnings times 92.35% are under $400, so no self-employment tax is estimated.');
    if (r.se.additional > 0) notes.push('The 0.9% Additional Medicare Tax applies and is included in the federal total.');
    if (o.wages + r.net > r.rules.additional) notes.push('At this income, the Net Investment Income Tax and other phase-outs can also apply; they are not modeled.');
    return notes;
  }

  // Where each dollar of net 1099 income goes, with text labels.
  function bars(r) {
    const parts = [['Self-employment tax', r.se.seTax + r.se.additional], ['Federal income tax increase', r.incomeTaxIncrease], ['State tax (flat rate)', r.state], ['Kept after these taxes', Math.max(0, r.afterTax)]];
    const base = Math.max(1, r.net);
    return parts.map(([label, value]) => `<div class="finloom-calc-bar-row"><span>${label}: <strong>${kit.money(value)}</strong> (${kit.percent(r.net > 0 ? value / base : 0, 1)})</span><span class="finloom-calc-bar-track" aria-hidden="true"><span class="finloom-calc-bar-fill" style="left:0;width:${Math.min(100, value / base * 100).toFixed(1)}%"></span></span></div>`).join('');
  }

  function tableRows(o, r) {
    const rows = [
      ['1099 income', kit.money(o.income)], ['Business expenses', kit.money(o.expenses)], ['Net self-employment income', kit.money(r.net)],
      ['Self-employment tax (15.3% of 92.35%, capped Social Security)', kit.money(r.se.seTax)], ['Additional Medicare Tax', kit.money(r.se.additional)],
      ['Deductible half of SE tax', kit.money(r.half)], [`${YEAR} standard deduction`, kit.money(r.rules.deduction)],
      ['Taxable income before 1099 income', kit.money(r.taxableBefore)], ['Taxable income with 1099 income', kit.money(r.taxableAfter)],
      ['Federal income tax increase', kit.money(r.incomeTaxIncrease)], ['State tax at the flat rate entered', kit.money(r.state)], ['Total estimated tax', kit.money(r.total)]
    ];
    return rows.map(([label, value]) => `<tr><th scope="row">${label}</th><td class="num">${value}</td></tr>`).join('');
  }

  const engine = { YEAR, SE, STATUSES, RULES, incomeTax, marginalRate, selfEmploymentTax, estimate, check, summary, outputs, warnings, bars, tableRows };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('tax-1099', node => {
    const form = node.querySelector('form');
    const f = name => form.elements[name];
    const opt = name => (f(name).value.trim() === '' ? 0 : kit.num(f(name)));
    const run = () => {
      const o = { income: kit.num(f('income')), expenses: opt('expenses'), status: f('status').value, wages: opt('wages'), stateRate: opt('state') };
      const messages = check(o);
      const fields = { income: 'income', expenses: 'expenses', wages: 'wages', stateRate: 'state' };
      if (!kit.errors(form, Object.keys(messages).map(key => [f(fields[key]), messages[key]]))) return;
      const r = estimate(o);
      const values = outputs(o, r);
      node.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      node.querySelector('[data-summary]').textContent = summary(o, r);
      node.querySelector('[data-bars]').innerHTML = bars(r);
      node.querySelector('tbody').innerHTML = tableRows(o, r);
      const notes = warnings(o, r); const box = node.querySelector('[data-warnings]');
      box.hidden = !notes.length; box.innerHTML = notes.map(text => `<p>${text}</p>`).join('');
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
