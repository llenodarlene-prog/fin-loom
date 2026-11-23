// Motorcycle Loan Calculator markup.
export default function render(e, ui) {
  const o = {"price": 15000, "down": 2000, "trade": 0, "tax": 6, "fees": 300, "rate": 9, "years": 4};
  const r = e.loan(o); const v = e.outputs(o, r);
  const form = `${ui.field('ml-price', 'Motorcycle price ($)', 'min="100" max="100000000" step="0.01" value="15000" required')}
${ui.field('ml-down', 'Down payment ($)', 'min="0" max="100000000" step="0.01" value="2000"')}
${ui.field('ml-trade', 'Trade-in value ($)', 'min="0" max="100000000" step="0.01" value="0"')}
${ui.field('ml-tax', 'Sales tax rate (%)', 'min="0" max="20" step="0.001" value="6"', 'Enter your state and local rate. Use 0 if the purchase is not taxed or tax is paid separately.')}
${ui.field('ml-fees', 'Fees added to the loan ($)', 'min="0" max="1000000" step="0.01" value="300"', 'Dealer, title and registration fees, if financed.')}
${ui.field('ml-rate', 'Interest rate (%)', 'min="0" max="40" step="0.01" value="9" required')}
${ui.field('ml-years', 'Loan term (years)', 'min="0.5" max="10" step="0.5" value="4" required')}`;
  const results = `${ui.row('Amount financed', 'financed', v.financed)}${ui.row('Sales tax', 'taxAmt', v.taxAmt)}${ui.row('Total interest', 'interest', v.interest)}${ui.row('Total of loan payments', 'total', v.total)}${ui.row('Total cost including down payment', 'allIn', v.allIn)}`;
  const wide = `${ui.table('Payment and Interest by Loan Term', ['Term', 'Monthly Payment', 'Total Interest'], e.tableRows(o))}
${ui.assumptions(['Amount financed = price − down payment − credit + sales tax + fees added to the loan.', 'This calculator applies sales tax to the price minus any trade-in. Trade-in tax treatment varies by state, so check your state rules.', 'Monthly payment = P × i ÷ (1 − (1 + i)^−n), with a fixed rate and on-time payments.', 'Insurance, maintenance and other ownership costs are not included.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'motorcycle-loan', title: 'Motorcycle Loan Calculator', legend: 'Your Purchase and Loan', form, label: 'Monthly payment', big: v.big, results, summary: e.summary(o, r), wide });
}
