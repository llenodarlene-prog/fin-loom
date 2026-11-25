// Commercial Loan Calculator markup.
export default function render(e, ui) {
  const o = {"amount": 1000000, "rate": 7.5, "amort": 25, "term": 10};
  const r = e.calc(o); const v = e.outputs(o, r);
  const form = `${ui.field('cox-amount', 'Loan amount ($)', 'min="1000" max="1000000000" step="0.01" value="1000000" required')}
${ui.field('cox-rate', 'Interest rate (%)', 'min="0" max="30" step="0.001" value="7.5" required')}
${ui.field('cox-amort', 'Amortization period (years)', 'min="1" max="40" step="1" value="25" required', "The schedule used to set the payment.")}
${ui.field('cox-term', 'Loan term (years)', 'min="1" max="40" step="1" value="10" required', "When the remaining balance is due.")}`;
  const results = `${ui.row('Balloon payment at the end of the term', 'balloon', v.balloon)}${ui.row('Total of monthly payments', 'paid', v.paid)}${ui.row('Interest over the term', 'interest', v.interest)}${ui.row('Total paid including balloon', 'total', v.total)}`;
  const wide = `${ui.assumptions(["The payment is set by the amortization period. If the term is shorter, the remaining balance is due as a balloon.", "The rate is fixed and payments are monthly and on time.", "Fees, prepayment penalties and refinancing of the balloon are not modeled."])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'commercial-loan', title: 'Commercial Loan Calculator', legend: 'Your Loan', form, label: 'Monthly payment', big: v.big, results, summary: e.summary(o, r), wide });
}
