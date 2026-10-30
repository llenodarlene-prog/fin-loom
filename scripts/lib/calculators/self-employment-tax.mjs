// Self-employment tax calculator markup: net earnings, filing status, and W-2 wages, with the SE tax,
// its Social Security and Medicare parts, the deductible half, bars, and a Schedule SE breakdown. Tax year 2026.
export default function render(e, ui) {
  const o = { net: 50000, status: 'single', wages: 0 };
  const r = e.selfEmploymentTax(o.net, o.status, o.wages);
  const v = e.outputs(o, r);
  const form = `<p class="finloom-calc-tax-year"><strong>Tax year ${e.YEAR}</strong> rates (Social Security wage base ${ui.esc(`$${e.SE.wageBase.toLocaleString('en-US')}`)}).</p>
${ui.field('se-net', 'Net self-employment earnings ($)', 'min="0" max="1000000000" step="0.01" value="50000" required', '1099 or business income minus business expenses (Schedule C profit).')}
${ui.select('se-status', 'Filing status', Object.entries(e.STATUSES), o.status, 'Filing status only changes the Additional Medicare Tax threshold.')}
${ui.field('se-wages', 'W-2 wages this year ($, optional)', 'min="0" max="1000000000" step="0.01" value="0"', 'Wages already taxed for Social Security reduce the room left under the wage base.')}`;
  const results = `${ui.row('Social Security part (12.4%)', 'social', v.social)}${ui.row('Medicare part (2.9%)', 'medicare', v.medicare)}${ui.row('Additional Medicare Tax (0.9%, separate)', 'additional', v.additional)}${ui.row('Deductible half of SE tax', 'deductible', v.deductible)}${ui.row('Effective SE tax rate on net earnings', 'effective', v.effective)}${ui.row('Earnings subject to SE tax (92.35%)', 'subject', v.subject)}`;
  const wide = `<h3 class="finloom-calc-subtitle">Where the Tax Comes From</h3>
<div class="finloom-calc-bar" data-bars>${e.bars(r)}</div>
${ui.table('Schedule SE Breakdown', ['Step', 'Amount'], e.tableRows(o, r))}
<p class="finloom-calc-note">Sources: IRS Topic 554 (92.35%, the $400 minimum, and the deductible half), Topic 751 and Publication 15 (2026) for the $184,500 Social Security wage base, and Topic 560 for Additional Medicare Tax thresholds.</p>
${ui.assumptions(['Uses 2026 rates: 12.4% Social Security up to the $184,500 wage base and 2.9% Medicare on all SE earnings, applied to 92.35% of net earnings.', 'No SE tax is estimated when net earnings times 92.35% are under $400.', 'W-2 wages are assumed to be fully subject to Social Security and Medicare tax.', 'The Additional Medicare Tax is shown separately and is not part of the deductible half.', 'Income tax, state tax, the optional methods, church employee income, and farm income rules are not modeled.'])}
${ui.disclaimer(true)}`;
  return ui.layout({ type: 'self-employment-tax', title: 'Self-Employment Tax Calculator', legend: 'Your Earnings', form, label: 'Estimated self-employment tax', big: v.big, results, summary: e.summary(o, r), wide });
}
