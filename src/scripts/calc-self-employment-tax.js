// Fin Loom self-employment tax calculator, tax year 2026. Follows Schedule SE (Form 1040):
// SE tax is 15.3% (12.4% Social Security + 2.9% Medicare) of 92.35% of net earnings from
// self-employment, and none is due when that amount is under $400 (IRS Topic 554; Schedule SE
// instructions). The Social Security part stops at the 2026 wage base of $184,500, reduced by W-2
// wages already taxed for Social Security (IRS Topic 751; Publication 15 (2026)). The 0.9% Additional
// Medicare Tax applies to SE income above $200,000 ($250,000 married filing jointly, $125,000 married
// filing separately), with the threshold reduced by Medicare wages (IRS Topic 560; Form 8959).
// Half of the SE tax (not the Additional Medicare Tax) is deductible in figuring AGI (Topic 554).
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const YEAR = 2026;
  const SE = { factor: 0.9235, minimum: 400, socialSecurity: 0.124, medicare: 0.029, additional: 0.009, wageBase: 184500 };
  const STATUSES = { single: 'Single', marriedJoint: 'Married filing jointly', marriedSeparate: 'Married filing separately', headOfHousehold: 'Head of household' };
  const ADDITIONAL_THRESHOLD = { single: 200000, marriedJoint: 250000, marriedSeparate: 125000, headOfHousehold: 200000 };

  // Schedule SE for one person. wages: W-2 wages already subject to Social Security and Medicare.
  // Schedule SE rounds each line to the cent.
  const cents = value => Math.round(value * 100) / 100;

  function selfEmploymentTax(net, status, wages = 0) {
    const subject = Math.max(0, net) * SE.factor;
    const owes = subject >= SE.minimum;
    const room = Math.max(0, SE.wageBase - wages);
    const socialBase = owes ? Math.min(subject, room) : 0;
    const socialSecurity = cents(socialBase * SE.socialSecurity);
    const medicare = owes ? cents(subject * SE.medicare) : 0;
    const threshold = Math.max(0, ADDITIONAL_THRESHOLD[status] - wages);
    const additionalBase = owes ? Math.max(0, subject - threshold) : 0;
    const additional = cents(additionalBase * SE.additional);
    const seTax = socialSecurity + medicare;
    return { net, subject, owes, room, socialBase, socialSecurity, medicare, additionalBase, additional, threshold, seTax, deductible: seTax / 2, effective: net > 0 ? seTax / net : 0, wageBaseReached: owes && subject > room };
  }

  function check(o) {
    return { net: kit.range(o.net, 0, 1e9), wages: kit.range(o.wages, 0, 1e9) };
  }

  function summary(o, r) {
    if (!r.owes) return `Under these assumptions, ${kit.money(o.net)} of net self-employment earnings puts ${kit.money(r.subject)} under Schedule SE, which is below the $400 minimum, so no self-employment tax is estimated for ${YEAR}.`;
    return `Under these assumptions, ${kit.money(o.net)} of net self-employment earnings could mean about ${kit.money(r.seTax)} of self-employment tax for ${YEAR}, an effective rate of ${kit.percent(r.effective, 2)}. Half of it, ${kit.money(r.deductible)}, could be deducted when figuring adjusted gross income.`;
  }

  function outputs(o, r) {
    return {
      big: kit.money(r.seTax), social: kit.money(r.socialSecurity), medicare: kit.money(r.medicare), additional: kit.money(r.additional),
      deductible: kit.money(r.deductible), effective: kit.percent(r.effective, 2), subject: kit.money(r.subject)
    };
  }

  function warnings(o, r) {
    const notes = [];
    if (r.wageBaseReached) notes.push(`Social Security tax stops at the ${YEAR} wage base of ${kit.money0(SE.wageBase)}${o.wages > 0 ? `, reduced here by ${kit.money0(o.wages)} of W-2 wages` : ''}, so only ${kit.money(r.socialBase)} of these earnings carries the 12.4% part.`);
    if (r.additional > 0) notes.push(`The 0.9% Additional Medicare Tax applies above ${kit.money0(ADDITIONAL_THRESHOLD[o.status])} for this filing status. It is shown separately because it is not part of the deductible half.`);
    if (!r.owes && o.net > 0) notes.push('Net earnings times 92.35% are under $400, so Schedule SE generally is not required for self-employment tax.');
    return notes;
  }

  // Bars: the share of each tax part, with text labels so meaning never depends on color.
  function bars(r) {
    const parts = [['Social Security (12.4%)', r.socialSecurity], ['Medicare (2.9%)', r.medicare], ['Additional Medicare (0.9%)', r.additional]];
    const max = Math.max(1, ...parts.map(([, value]) => value));
    return parts.map(([label, value]) => `<div class="finloom-calc-bar-row"><span>${label}: <strong>${kit.money(value)}</strong></span><span class="finloom-calc-bar-track" aria-hidden="true"><span class="finloom-calc-bar-fill" style="left:0;width:${(value / max * 100).toFixed(1)}%"></span></span></div>`).join('');
  }

  function tableRows(o, r) {
    const rows = [
      ['Net earnings from self-employment', kit.money(Math.max(0, o.net))],
      ['Times 92.35% (amount subject to SE tax)', kit.money(r.subject)],
      [`Social Security room under the ${kit.money0(SE.wageBase)} wage base`, kit.money(r.room)],
      ['Earnings taxed for Social Security', kit.money(r.socialBase)],
      ['Social Security tax at 12.4%', kit.money(r.socialSecurity)],
      ['Medicare tax at 2.9%', kit.money(r.medicare)],
      ['Self-employment tax', kit.money(r.seTax)],
      ['Deductible half of SE tax', kit.money(r.deductible)],
      ['Additional Medicare Tax at 0.9% (separate)', kit.money(r.additional)]
    ];
    return rows.map(([label, value]) => `<tr><th scope="row">${label}</th><td class="num">${value}</td></tr>`).join('');
  }

  const engine = { YEAR, SE, STATUSES, ADDITIONAL_THRESHOLD, selfEmploymentTax, check, summary, outputs, warnings, bars, tableRows };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('self-employment-tax', node => {
    const form = node.querySelector('form');
    const f = name => form.elements[name];
    const run = () => {
      const o = { net: kit.num(f('net')), status: f('status').value, wages: f('wages').value.trim() === '' ? 0 : kit.num(f('wages')) };
      const messages = check(o);
      if (!kit.errors(form, Object.keys(messages).map(key => [f(key), messages[key]]))) return;
      const r = selfEmploymentTax(o.net, o.status, o.wages);
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
