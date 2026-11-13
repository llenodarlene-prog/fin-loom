// Debt snowball and avalanche planner markup: up to five debts, a monthly budget and a strategy.
export default function render(e, ui) {
  const defaults = [[1500, 9.9, 50], [6000, 24.9, 180], [9000, 7.5, 200], [0, 0, 0], [0, 0, 0]];
  const o = { debts: defaults.map(([balance, apr, minimum]) => ({ balance, apr, minimum })), budget: 650, strategy: 'snowball' };
  const p = e.plan(o);
  const v = e.outputs(o, p);
  const debt = (i, [balance, apr, minimum]) => `<p class="finloom-calc-hint"><strong>Debt ${i}</strong></p><div class="finloom-calc-pair">${ui.field(`ds-balance${i}`, 'Balance ($)', `min="0" max="10000000" step="0.01"${balance ? ` value="${balance}"` : ''}`)}${ui.field(`ds-apr${i}`, 'APR (%)', `min="0" max="100" step="0.01"${balance ? ` value="${apr}"` : ''}`)}</div>${ui.field(`ds-minimum${i}`, 'Minimum payment ($)', `min="0" max="1000000" step="0.01"${balance ? ` value="${minimum}"` : ''}`)}`;
  const form = `${defaults.slice(0, 3).map((d, i) => debt(i + 1, d)).join('')}
${ui.advanced(defaults.slice(3).map((d, i) => debt(i + 4, d)).join(''))}
${ui.field('ds-budget', 'Total monthly payment budget ($)', 'min="1" max="10000000" step="0.01" value="650" required', 'At least the sum of your minimum payments. Anything above it goes to the target debt.')}
${ui.radios('strategy', 'Payoff method', [['snowball', 'Snowball: smallest balance first'], ['avalanche', 'Avalanche: highest APR first']], 'snowball')}`;
  const results = `${ui.row('Estimated interest', 'interest', v.interest)}${ui.row('Total of minimum payments', 'minimums', v.minimums)}${ui.row('Extra going to the target debt', 'extra', v.extra)}${ui.row('First debt paid off', 'first', v.first)}${ui.row('Snowball result', 'snowball', v.snowball)}${ui.row('Avalanche result', 'avalanche', v.avalanche)}`;
  const wide = `${ui.table('Payoff Order', ['Order', 'Debt', 'Paid Off in Month', 'Interest Paid'], e.tableRows(p))}
${ui.assumptions(['Each month every debt accrues balance × APR ÷ 12, then gets its minimum payment.', 'The rest of the budget goes to one target: the smallest balance for snowball, or the highest APR for avalanche. Ties go to the other rule.', 'The total budget stays the same, so when a debt is paid off its minimum rolls into the next target.', 'No new charges, fees, promotional rates or rate changes are included. The projection stops at 50 years.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'debt-snowball', title: 'Debt Snowball and Avalanche Calculator', legend: 'Your Debts', form, label: 'Time to pay off all debts', big: v.big, results, summary: e.summary(o, p), wide });
}
