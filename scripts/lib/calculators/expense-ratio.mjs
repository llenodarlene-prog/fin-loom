// Expense ratio calculator markup: two funds with the same return before fees, compared year by year.
export default function render(e, ui) {
  const o = { start: 10000, monthly: 300, years: 30, rate: 7, feeA: 0.03, feeB: 0.75 };
  const r = e.compare(o);
  const v = e.outputs(r);
  const form = `${ui.field('er-start', 'Starting investment ($)', 'min="0" max="1000000000" step="0.01" value="10000" required')}
${ui.field('er-monthly', 'Monthly contribution ($)', 'min="0" max="10000000" step="0.01" value="300"')}
${ui.field('er-years', 'Years', 'min="1" max="60" step="1" value="30" required')}
${ui.field('er-rate', 'Annual return before fees (%)', 'min="-20" max="30" step="0.1" value="7" required', 'An assumed average yearly return, not a forecast.')}
${ui.field('er-a', 'Fund A expense ratio (%)', 'min="0" max="5" step="0.01" value="0.03" required')}
${ui.field('er-b', 'Fund B expense ratio (%)', 'min="0" max="5" step="0.01" value="0.75" required')}`;
  const results = `${ui.row('Fund A ending balance', 'balanceA', v.balanceA)}${ui.row('Fund B ending balance', 'balanceB', v.balanceB)}${ui.row('Fund A total fees', 'feesA', v.feesA)}${ui.row('Fund B total fees', 'feesB', v.feesB)}${ui.row('Total contributions', 'contributions', v.contributions)}`;
  const wide = `${ui.table('Year-by-Year Comparison', ['Year', 'Fund A Balance', 'Fund A Fees to Date', 'Fund B Balance', 'Fund B Fees to Date', 'Difference'], e.tableRows(r))}
${ui.assumptions(['Both funds earn the same return before fees. The return converts to an equivalent monthly rate.', 'Each month, the fee (expense ratio ÷ 12) is taken from the balance after growth, and the contribution is added at month end.', 'Total fees count only the expense ratio. Trading costs, account fees, sales loads and taxes are not included.', 'Fees taken out also lose the growth they would have earned, so the balance gap is larger than total fees paid.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'expense-ratio', title: 'Expense Ratio Calculator', legend: 'Your Funds', form, label: 'Difference in ending balance', big: v.big, results, summary: e.summary(o, r), wide });
}
