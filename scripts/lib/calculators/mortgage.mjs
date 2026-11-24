// Mortgage Calculator markup.
export default function render(e, ui) {
  const o = {"price": 400000, "down": 10, "rate": 6.5, "years": 30, "tax": 1.1, "insurance": 1800, "hoa": 0, "pmi": 0.5};
  const r = e.calc(o); const v = e.outputs(o, r);
  const form = `${ui.field('mox-price', 'Home price ($)', 'min="10000" max="100000000" step="0.01" value="400000" required')}
${ui.field('mox-down', 'Down payment (%)', 'min="0" max="100" step="0.1" value="10" required')}
${ui.field('mox-rate', 'Interest rate (%)', 'min="0" max="20" step="0.001" value="6.5" required')}
${ui.field('mox-years', 'Loan term (years)', 'min="5" max="40" step="1" value="30" required')}
${ui.field('mox-tax', 'Property tax (% of price per year)', 'min="0" max="10" step="0.01" value="1.1"', "Check your county or the listing for the actual tax bill.")}
${ui.field('mox-insurance', 'Homeowners insurance ($ per year)', 'min="0" max="100000" step="0.01" value="1800"')}
${ui.field('mox-hoa', 'HOA dues ($ per month)', 'min="0" max="100000" step="0.01" value="0"')}
${ui.field('mox-pmi', 'PMI rate (% of loan per year)', 'min="0" max="5" step="0.01" value="0.5"', "Applied only when the down payment is under 20%. Ask your lender for your rate.")}`;
  const results = `${ui.row('Principal and interest', 'pi', v.pi)}${ui.row('Property tax', 'taxM', v.taxM)}${ui.row('Homeowners insurance', 'insM', v.insM)}${ui.row('PMI', 'pmiM', v.pmiM)}${ui.row('HOA dues', 'hoa', v.hoa)}${ui.row('Loan amount', 'loan', v.loan)}${ui.row('Total interest over the loan', 'interest', v.interest)}`;
  const wide = `${ui.assumptions(["Principal and interest use the standard amortization formula with a fixed rate.", "Property tax and insurance are spread evenly over 12 months. Actual bills vary by location and policy.", "PMI is applied at the rate you enter while the down payment is under 20%. It is shown for the first year and does not drop off in this estimate.", "Closing costs are not included."])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'mortgage', title: 'Mortgage Calculator', legend: 'Your Home and Loan', form, label: 'Total monthly payment', big: v.big, results, summary: e.summary(o, r), wide });
}
