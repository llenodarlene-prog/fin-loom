// Debt Consolidation Calculator markup.
export default function render(e, ui) {
  const o = {"b1": 8000, "r1": 24, "p1": 250, "b2": 5000, "r2": 20, "p2": 150, "b3": 3000, "r3": 18, "p3": 100, "rate": 11, "years": 4, "fee": 3};
  const r = e.calc(o); const v = e.outputs(o, r);
  const form = `${ui.field('dex-b1', 'Debt 1 balance ($)', 'min="0" max="10000000" step="0.01" value="8000"')}
${ui.field('dex-r1', 'Debt 1 rate (%)', 'min="0" max="40" step="0.01" value="24"')}
${ui.field('dex-p1', 'Debt 1 monthly payment ($)', 'min="0" max="1000000" step="0.01" value="250"')}
${ui.field('dex-b2', 'Debt 2 balance ($)', 'min="0" max="10000000" step="0.01" value="5000"')}
${ui.field('dex-r2', 'Debt 2 rate (%)', 'min="0" max="40" step="0.01" value="20"')}
${ui.field('dex-p2', 'Debt 2 monthly payment ($)', 'min="0" max="1000000" step="0.01" value="150"')}
${ui.field('dex-b3', 'Debt 3 balance ($)', 'min="0" max="10000000" step="0.01" value="3000"')}
${ui.field('dex-r3', 'Debt 3 rate (%)', 'min="0" max="40" step="0.01" value="18"')}
${ui.field('dex-p3', 'Debt 3 monthly payment ($)', 'min="0" max="1000000" step="0.01" value="100"')}
${ui.field('dex-rate', 'Consolidation loan rate (%)', 'min="0" max="40" step="0.01" value="11" required')}
${ui.field('dex-years', 'Consolidation loan term (years)', 'min="1" max="10" step="1" value="4" required')}
${ui.field('dex-fee', 'Origination fee (% of loan)', 'min="0" max="15" step="0.01" value="3"', "The loan is sized so the cash received covers all balances.")}`;
  const results = `${ui.row('Current total monthly payments', 'oldPay', v.oldPay)}${ui.row('New monthly payment', 'newPay', v.newPay)}${ui.row('Interest at current payments', 'oldInterest', v.oldInterest)}${ui.row('New loan interest and fees', 'newCost', v.newCost)}${ui.row('Time to pay off at current payments', 'oldMonths', v.oldMonths)}${ui.row('Consolidation loan amount', 'loan', v.loan)}`;
  const wide = `${ui.assumptions(["Current debts are paid at the fixed monthly payments you enter, with interest charged monthly at each rate.", "The consolidation loan is sized to cover all balances after the origination fee, with a fixed rate and term.", "New charges on paid-off cards, late fees and changes in rates are not modeled."])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'debt-consolidation', title: 'Debt Consolidation Calculator', legend: 'Your Debts and New Loan', form, label: 'Interest saved by consolidating', big: v.big, results, summary: e.summary(o, r), wide });
}
