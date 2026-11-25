// Loan payment calculator markup.
export default function render(e, ui) {
  const o = { amount: 25000, rate: 8, years: 5 };
  const r = e.schedule(o); const v = e.outputs(o, r);
  const form = `${ui.field('lp-amount', 'Loan amount ($)', 'min="100" max="100000000" step="0.01" value="25000" required')}
${ui.field('lp-rate', 'Annual interest rate (%)', 'min="0" max="40" step="0.01" value="8" required')}
${ui.field('lp-years', 'Loan term (years)', 'min="0.5" max="40" step="0.5" value="5" required')}`;
  const results = `${ui.row('Number of payments', 'payments', v.payments)}${ui.row('Total of payments', 'total', v.total)}${ui.row('Total interest', 'interest', v.interest)}${ui.row('Interest share of total paid', 'share', v.share)}`;
  const wide = `${ui.table('Loan Paydown by Year', ['Year', 'Principal Paid to Date', 'Interest Paid to Date', 'Remaining Balance'], e.tableRows(r))}
${ui.assumptions(['Monthly payment = P × i ÷ (1 − (1 + i)^−n), with i = annual rate ÷ 12 and n = number of monthly payments.', 'The rate is fixed and every payment is made on time.', 'Fees, insurance and taxes are not included. A loan\'s APR can be higher than its interest rate when fees apply.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'loan-payment', title: 'Loan Payment Calculator', legend: 'Your Loan', form, label: 'Monthly payment', big: v.big, results, summary: e.summary(o, r), wide });
}
