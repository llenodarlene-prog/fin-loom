// Auto Loan Calculator markup.
export default function render(e, ui) {
  const o = {"price": 35000, "down": 5000, "trade": 3000, "tax": 6, "fees": 500, "rate": 7, "years": 5};
  const r = e.loan(o); const v = e.outputs(o, r);
  const form = `${ui.field('al-price', 'Vehicle price ($)', 'min="100" max="100000000" step="0.01" value="35000" required')}
${ui.field('al-down', 'Down payment ($)', 'min="0" max="100000000" step="0.01" value="5000"')}
${ui.field('al-trade', 'Trade-in value ($)', 'min="0" max="100000000" step="0.01" value="3000"')}
${ui.field('al-tax', 'Sales tax rate (%)', 'min="0" max="20" step="0.001" value="6"', 'Enter your state and local rate. Use 0 if the purchase is not taxed or tax is paid separately.')}
${ui.field('al-fees', 'Fees added to the loan ($)', 'min="0" max="1000000" step="0.01" value="500"', 'Dealer documentation, title and registration fees, if financed.')}
${ui.field('al-rate', 'Interest rate (%)', 'min="0" max="40" step="0.01" value="7" required')}
${ui.field('al-years', 'Loan term (years)', 'min="0.5" max="10" step="0.5" value="5" required')}`;
  const results = `${ui.row('Amount financed', 'financed', v.financed)}${ui.row('Sales tax', 'taxAmt', v.taxAmt)}${ui.row('Total interest', 'interest', v.interest)}${ui.row('Total of loan payments', 'total', v.total)}${ui.row('Total cost including down payment', 'allIn', v.allIn)}`;
  const wide = `${ui.table('Payment and Interest by Loan Term', ['Term', 'Monthly Payment', 'Total Interest'], e.tableRows(o))}
${ui.assumptions(['Amount financed = price − down payment − trade-in + sales tax + fees added to the loan.', 'This calculator applies sales tax to the price minus any trade-in. Trade-in tax treatment varies by state, so check your state rules.', 'Monthly payment = P × i ÷ (1 − (1 + i)^−n), with a fixed rate and on-time payments.', 'Insurance, maintenance and other ownership costs are not included.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'auto-loan', title: 'Auto Loan Calculator', legend: 'Your Purchase and Loan', form, label: 'Monthly payment', big: v.big, results, summary: e.summary(o, r), wide });
}
