// Investment growth calculator markup: beginner inputs up front, timing, contribution increase,
// and inflation under Advanced options; results, scenario cards, chart, and year table.
export default function render(e, ui) {
  const o = { start: 10000, monthly: 500, rate: 6, years: 20, timing: 'end', increase: 0, inflation: 0 };
  const r = e.growth(o);
  const v = e.outputs(o, r);
  const form = `${ui.field('grow-start', 'Starting investment ($)', 'min="0" max="1000000000" step="0.01" value="10000" required')}
${ui.field('grow-monthly', 'Monthly contribution ($)', 'min="0" max="10000000" step="0.01" value="500"')}
${ui.field('grow-rate', 'Annual return (%)', 'min="-50" max="50" step="0.1" value="6" required', 'An assumed average yearly return, not a forecast.')}
${ui.field('grow-years', 'Years', 'min="1" max="100" step="1" value="20" required')}
${ui.advanced(`${ui.radios('timing', 'Contribution timing', [['start', 'Beginning of month'], ['end', 'End of month']], 'end')}
${ui.field('grow-increase', 'Annual contribution increase (%)', 'min="0" max="50" step="0.1" value="0"', 'Raises the monthly contribution once a year.')}
${ui.field('grow-inflation', 'Inflation rate (%)', 'min="0" max="20" step="0.1" value="0"', 'Used only for the inflation-adjusted value.')}`)}`;
  const results = `${ui.row('Total contributions', 'contributions', v.contributions)}${ui.row('Investment growth', 'growth', v.growth)}${ui.row('Inflation-adjusted ending value', 'real', v.real)}${ui.row('Share from contributions', 'contributionShare', v.contributionShare)}${ui.row('Share from growth', 'growthShare', v.growthShare)}`;
  const wide = `<h3 class="finloom-calc-subtitle">Scenario Comparison</h3>
<p class="finloom-calc-note">Illustrative rates chosen by Fin Loom: your return 2 percentage points lower and higher. They are not forecasts.</p>
<div class="finloom-calc-compare" data-scenarios>${e.cards(o)}</div>
<h3 class="finloom-calc-subtitle">Contributions vs Growth</h3>
${ui.chart(e.chart(r), `${ui.key('value', 'Balance (solid)')}${ui.key('capital', 'Total contributions (dashed)')}`)}
${ui.table('Year-by-Year Growth', ['Year', 'Contributions That Year', 'Total Contributions', 'Investment Growth', 'Ending Balance', 'Inflation-Adjusted Balance'], e.tableRows(r))}
${ui.assumptions(['The return is a constant average; real returns vary from year to year and can be negative.', 'The annual return converts to an equivalent monthly rate, (1 + r)^(1/12) - 1.', 'Contribution increases apply once a year, starting in year 2.', 'Fees, taxes, and withdrawals are not included.', 'The inflation-adjusted value divides the ending balance by (1 + inflation) for each year.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'investment-growth', title: 'Investment Growth Calculator', form, label: 'Estimated ending balance', big: v.big, results, summary: e.summary(o, r), wide });
}
