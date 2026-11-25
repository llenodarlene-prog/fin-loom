// Commercial Mortgage Calculator markup.
export default function render(e, ui) {
  const o = {"value": 2000000, "ltv": 70, "rate": 7, "amort": 25, "term": 10, "noi": 160000};
  const r = e.calc(o); const v = e.outputs(o, r);
  const form = `${ui.field('cox-value', 'Property value ($)', 'min="10000" max="1000000000" step="0.01" value="2000000" required')}
${ui.field('cox-ltv', 'Loan-to-value (%)', 'min="10" max="90" step="0.5" value="70" required')}
${ui.field('cox-rate', 'Interest rate (%)', 'min="0" max="30" step="0.001" value="7" required')}
${ui.field('cox-amort', 'Amortization period (years)', 'min="5" max="40" step="1" value="25" required')}
${ui.field('cox-term', 'Loan term (years)', 'min="1" max="40" step="1" value="10" required')}
${ui.field('cox-noi', 'Net operating income ($ per year)', 'min="0" max="1000000000" step="0.01" value="160000" required', "Rental income minus operating expenses, before debt payments.")}`;
  const results = `${ui.row('Loan amount', 'loan', v.loan)}${ui.row('Monthly payment', 'pay', v.pay)}${ui.row('Yearly debt service', 'annual', v.annual)}${ui.row('Balloon at end of term', 'balloon', v.balloon)}${ui.row('Debt yield', 'debtYield', v.debtYield)}${ui.row('Cap rate on value', 'cap', v.cap)}`;
  const wide = `${ui.assumptions(["DSCR = net operating income \u00f7 yearly principal and interest payments. Lenders set their own minimum DSCR and maximum LTV.", "Debt yield = net operating income \u00f7 loan amount. Cap rate = net operating income \u00f7 property value.", "The rate is fixed. Fees, reserves and variable-rate terms are not modeled."])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'commercial-mortgage', title: 'Commercial Mortgage Calculator', legend: 'Your Property and Loan', form, label: 'Debt service coverage ratio', big: v.big, results, summary: e.summary(o, r), wide });
}
