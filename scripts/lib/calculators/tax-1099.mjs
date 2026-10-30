// 1099 tax calculator markup: 1099 income, expenses, filing status, W-2 wages, and an optional flat
// state rate, with the set-aside percentage, the federal and state parts, quarterly amount, bars, and
// a step-by-step breakdown. Tax year 2026.
export default function render(e, ui) {
  const o = { income: 60000, expenses: 10000, status: 'single', wages: 0, stateRate: 0 };
  const r = e.estimate(o);
  const v = e.outputs(o, r);
  const form = `<p class="finloom-calc-tax-year"><strong>Tax year ${e.YEAR}</strong> federal rates (Rev. Proc. 2025-32).</p>
${ui.field('t99-income', '1099 income ($)', 'min="0" max="1000000000" step="0.01" value="60000" required', 'Total freelance, contract, or gig income for the year.')}
${ui.field('t99-expenses', 'Business expenses ($)', 'min="0" max="1000000000" step="0.01" value="10000"', 'Ordinary and necessary costs of the work.')}
${ui.select('t99-status', 'Filing status', Object.entries(e.STATUSES), o.status)}
${ui.advanced(`${ui.field('t99-wages', 'W-2 wages this year ($)', 'min="0" max="1000000000" step="0.01" value="0"', 'Other job income. It uses up part of the standard deduction and the lower brackets.')}
${ui.field('t99-state', 'State income tax rate (%, optional)', 'min="0" max="20" step="0.01" value="0"', 'A flat rate applied to net 1099 income. Real state rules vary.')}`)}`;
  const results = `${ui.row('Net 1099 income', 'net', v.net)}${ui.row('Total federal tax on it', 'federal', v.federal)}${ui.row('Self-employment tax', 'se', v.se)}${ui.row('Federal income tax increase', 'incomeTax', v.incomeTax)}${ui.row('Additional Medicare Tax', 'additional', v.additional)}${ui.row('State tax', 'state', v.state)}${ui.row('Kept after these taxes', 'afterTax', v.afterTax)}${ui.row('Quarterly set-aside (total ÷ 4)', 'quarterly', v.quarterly)}${ui.row('Top federal bracket reached', 'marginal', v.marginal)}`;
  const wide = `<h3 class="finloom-calc-subtitle">Where Net 1099 Income Goes</h3>
<div class="finloom-calc-bar" data-bars>${e.bars(r)}</div>
${ui.table('Step-by-Step Estimate', ['Step', 'Amount'], e.tableRows(o, r))}
<p class="finloom-calc-note">The quarterly figure divides the annual estimate by four. Actual estimated-tax due dates and safe-harbor rules differ and can depend on last year's tax. Sources: IRS Rev. Proc. 2025-32 (2026 brackets and standard deduction), Topics 554, 560, and 751.</p>
${ui.assumptions(['Uses 2026 federal brackets and the standard deduction for the filing status; itemized deductions, credits, and dependents are not modeled.', 'The qualified business income (QBI) deduction is not included, so federal income tax may be overstated for eligible businesses.', 'Self-employment tax uses 92.35% of net earnings, the $184,500 Social Security wage base reduced by W-2 wages, and the $400 minimum.', 'Half of the self-employment tax is deducted before figuring income tax.', 'State tax is a flat rate on net 1099 income; real state and local rules vary.', 'Tax already withheld from W-2 wages is not counted.'])}
${ui.disclaimer(true)}`;
  return ui.layout({ type: 'tax-1099', title: '1099 Tax Calculator', legend: 'Your 1099 Income', form, label: 'Set aside about', big: v.big, results, summary: e.summary(o, r), wide });
}
