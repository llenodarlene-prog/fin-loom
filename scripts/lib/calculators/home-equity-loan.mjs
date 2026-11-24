// Home Equity Loan Calculator markup.
export default function render(e, ui) {
  const o = {"value": 450000, "mortgage": 250000, "cltv": 85, "amount": 50000, "rate": 8.5, "years": 15};
  const r = e.calc(o); const v = e.outputs(o, r);
  const form = `${ui.field('hox-value', 'Home value ($)', 'min="10000" max="100000000" step="0.01" value="450000" required')}
${ui.field('hox-mortgage', 'Mortgage balance ($)', 'min="0" max="100000000" step="0.01" value="250000" required')}
${ui.field('hox-cltv', 'Lender maximum combined loan-to-value (%)', 'min="10" max="100" step="1" value="85" required', "Lenders set this limit. Ask for the figure that applies to you.")}
${ui.field('hox-amount', 'Loan amount you want ($)', 'min="100" max="100000000" step="0.01" value="50000" required')}
${ui.field('hox-rate', 'Interest rate (%)', 'min="0" max="30" step="0.01" value="8.5" required')}
${ui.field('hox-years', 'Loan term (years)', 'min="1" max="30" step="1" value="15" required')}`;
  const results = `${ui.row('Amount you may be able to borrow', 'available', v.available)}${ui.row('Current home equity', 'equity', v.equity)}${ui.row('Combined loan-to-value after the loan', 'newCltv', v.newCltv)}${ui.row('Total interest', 'interest', v.interest)}${ui.row('Within the CLTV limit', 'fits', v.fits)}`;
  const wide = `${ui.assumptions(["Available amount = home value \u00d7 maximum combined loan-to-value \u2212 mortgage balance.", "The payment assumes a fixed-rate loan with on-time monthly payments.", "Closing costs, appraisal fees and lender approval rules are not modeled. Your home secures the loan."])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'home-equity-loan', title: 'Home Equity Loan Calculator', legend: 'Your Home and Loan', form, label: 'Monthly payment', big: v.big, results, summary: e.summary(o, r), wide });
}
