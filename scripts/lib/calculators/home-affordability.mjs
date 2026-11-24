// Home Affordability Calculator markup.
export default function render(e, ui) {
  const o = {"income": 100000, "debts": 500, "down": 40000, "rate": 6.5, "years": 30, "tax": 1.1, "insurance": 1800, "front": 28, "back": 36};
  const r = e.calc(o); const v = e.outputs(o, r);
  const form = `${ui.field('hox-income', 'Gross yearly income ($)', 'min="1000" max="100000000" step="0.01" value="100000" required')}
${ui.field('hox-debts', 'Other monthly debt payments ($)', 'min="0" max="1000000" step="0.01" value="500"', "Car, student loan, card minimums and similar.")}
${ui.field('hox-down', 'Down payment ($)', 'min="0" max="100000000" step="0.01" value="40000"')}
${ui.field('hox-rate', 'Interest rate (%)', 'min="0" max="20" step="0.001" value="6.5" required')}
${ui.field('hox-years', 'Loan term (years)', 'min="5" max="40" step="1" value="30" required')}
${ui.field('hox-tax', 'Property tax (% of price per year)', 'min="0" max="10" step="0.01" value="1.1"')}
${ui.field('hox-insurance', 'Homeowners insurance ($ per year)', 'min="0" max="100000" step="0.01" value="1800"')}
${ui.field('hox-front', 'Housing payment ratio (% of income)', 'min="10" max="60" step="1" value="28" required', "The share of gross income you are willing to spend on housing. Lenders set their own limits.")}
${ui.field('hox-back', 'Total debt ratio (% of income)', 'min="10" max="70" step="1" value="36" required', "Housing plus other debts as a share of gross income.")}`;
  const results = `${ui.row('Maximum monthly housing payment', 'maxHousing', v.maxHousing)}${ui.row('Loan amount', 'loan', v.loan)}${ui.row('Principal and interest', 'pi', v.pi)}${ui.row('Limiting ratio', 'limit', v.limit)}`;
  const wide = `${ui.assumptions(["Maximum housing payment = the lower of income \u00d7 housing ratio and income \u00d7 total debt ratio \u2212 other debts, using monthly gross income.", "Housing payment includes principal, interest, property tax and insurance. PMI, HOA dues and closing costs are not included.", "The ratios are inputs you choose. Lender limits vary by loan type and borrower, so treat this as a planning estimate."])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'home-affordability', title: 'Home Affordability Calculator', legend: 'Your Income and Loan', form, label: 'Estimated home price you can afford', big: v.big, results, summary: e.summary(o, r), wide });
}
