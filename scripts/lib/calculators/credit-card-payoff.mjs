// Credit card payoff calculator markup: balance, APR, minimum, and extra payment up front; the
// minimum-payment rule under Advanced options; results, comparison cards, chart, and year table.
export default function render(e, ui) {
  const o = { balance: 5000, apr: 24, minimum: 150, extra: 100, rule: 'fixed', percent: 1, floor: 25 };
  const start = { year: 2026, month: 10 };
  const r = e.payoff(o); const base = e.payoff(o, 0);
  const v = e.outputs(o, r, base, start);
  const form = `${ui.field('ccp-balance', 'Current balance ($)', 'min="1" max="100000000" step="0.01" value="5000" required')}
${ui.field('ccp-apr', 'APR (%)', 'min="0" max="100" step="0.01" value="24" required', 'The annual percentage rate on your statement.')}
${ui.field('ccp-minimum', 'Minimum payment ($)', 'min="0.01" max="10000000" step="0.01" value="150" required', 'Used when the minimum is a fixed amount.')}
${ui.field('ccp-extra', 'Extra monthly payment ($, optional)', 'min="0" max="10000000" step="0.01" value="100"')}
${ui.advanced(`${ui.radios('rule', 'Minimum payment rule', [['fixed', 'Fixed amount'], ['percent', 'Percent of balance plus interest']], 'fixed')}
${ui.field('ccp-percent', 'Percent of balance (%)', 'min="0.1" max="100" step="0.1" value="1"', 'Used with the percent rule. Check your card agreement for the rule your issuer uses.')}
${ui.field('ccp-floor', 'Dollar floor ($)', 'min="0" max="1000000" step="0.01" value="25"', 'The lowest minimum payment under the percent rule.')}`)}`;
  const results = `${ui.row('Estimated payoff date', 'date', v.date)}${ui.row('Time to payoff', 'span', v.span)}${ui.row('Total interest', 'interest', v.interest)}${ui.row('Total paid', 'paid', v.paid)}${ui.row('Interest saved vs minimum only', 'saved', v.saved)}${ui.row('Minimum only', 'baseMonths', v.baseMonths)}`;
  const wide = `<h3 class="finloom-calc-subtitle">Payment Comparison</h3>
<div class="finloom-calc-compare" data-scenarios>${e.cards(o)}</div>
<h3 class="finloom-calc-subtitle">Balance Over Time</h3>
${ui.chart(e.chart(o), `${ui.key('value', 'With extra payment (solid)')}${ui.key('capital', 'Minimum only (dashed)')}`)}
${ui.table('Payoff by Year (With Extra Payment)', ['Year', 'Payments', 'Interest', 'Principal', 'Ending Balance'], e.tableRows(r))}
<p class="finloom-calc-note">Payoff dates count the first payment as next month. The page is prepared with October 2026 as the current month and switches to your device's date when it loads.</p>
${ui.assumptions(['No new purchases, cash advances, or balance transfers are added.', 'The APR stays constant; interest each month is the balance times APR divided by 12.', 'Every payment is made on time, so there are no late fees or penalty APRs.', 'Annual fees, promotional rates, and grace periods are not modeled.', 'Card issuers usually charge interest on the average daily balance, so statement figures can differ.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'credit-card-payoff', title: 'Credit Card Debt Payoff Calculator', form, label: 'Months to pay off', big: v.big, results, summary: e.summary(o, r, base, start), wide });
}
