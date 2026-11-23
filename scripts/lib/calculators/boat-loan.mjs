// Boat Loan Calculator markup.
export default function render(e, ui) {
  const o = {"price": 60000, "down": 12000, "trade": 0, "tax": 6, "fees": 500, "rate": 8, "years": 15};
  const r = e.loan(o); const v = e.outputs(o, r);
  const form = `${ui.field('bl-price', 'Boat price ($)', 'min="100" max="100000000" step="0.01" value="60000" required')}
${ui.field('bl-down', 'Down payment ($)', 'min="0" max="100000000" step="0.01" value="12000"')}
${ui.field('bl-trade', 'Trade-in value ($)', 'min="0" max="100000000" step="0.01" value="0"')}
${ui.field('bl-tax', 'Sales tax rate (%)', 'min="0" max="20" step="0.001" value="6"', 'Enter your state and local rate. Use 0 if the purchase is not taxed or tax is paid separately.')}
${ui.field('bl-fees', 'Fees added to the loan ($)', 'min="0" max="1000000" step="0.01" value="500"', 'Registration, title and lender fees, if financed.')}
${ui.field('bl-rate', 'Interest rate (%)', 'min="0" max="40" step="0.01" value="8" required')}
${ui.field('bl-years', 'Loan term (years)', 'min="0.5" max="20" step="0.5" value="15" required')}`;
  const results = `${ui.row('Amount financed', 'financed', v.financed)}${ui.row('Sales tax', 'taxAmt', v.taxAmt)}${ui.row('Total interest', 'interest', v.interest)}${ui.row('Total of loan payments', 'total', v.total)}${ui.row('Total cost including down payment', 'allIn', v.allIn)}`;
  const wide = `${ui.table('Payment and Interest by Loan Term', ['Term', 'Monthly Payment', 'Total Interest'], e.tableRows(o))}
${ui.assumptions(['Amount financed = price − down payment − credit + sales tax + fees added to the loan.', 'This calculator applies sales tax to the price minus any trade-in. Trade-in tax treatment varies by state, so check your state rules.', 'Monthly payment = P × i ÷ (1 − (1 + i)^−n), with a fixed rate and on-time payments.', 'Insurance, maintenance and other ownership costs are not included.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'boat-loan', title: 'Boat Loan Calculator', legend: 'Your Purchase and Loan', form, label: 'Monthly payment', big: v.big, results, summary: e.summary(o, r), wide });
}
