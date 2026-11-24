// SBA Loan Calculator markup.
export default function render(e, ui) {
  const o = {"amount": 250000, "rate": 10, "years": 10, "fee": 2, "other": 2500};
  const r = e.calc(o); const v = e.outputs(o, r);
  const form = `${ui.field('sbx-amount', 'Loan amount ($)', 'min="1000" max="100000000" step="0.01" value="250000" required')}
${ui.field('sbx-rate', 'Interest rate (%)', 'min="0" max="30" step="0.01" value="10" required', "SBA-backed loans can have fixed or variable rates. Use the rate in your offer.")}
${ui.field('sbx-years', 'Loan term (years)', 'min="1" max="30" step="1" value="10" required', "Terms depend on the loan program and what the money is used for.")}
${ui.field('sbx-fee', 'Guarantee fee (% of loan, if financed)', 'min="0" max="10" step="0.01" value="2"', "Enter the fee from your lender. Use 0 if you pay it upfront.")}
${ui.field('sbx-other', 'Other financed fees ($)', 'min="0" max="1000000" step="0.01" value="2500"', "Packaging or closing fees added to the loan.")}`;
  const results = `${ui.row('Guarantee fee', 'feeAmt', v.feeAmt)}${ui.row('Total financed', 'principal', v.principal)}${ui.row('Total interest', 'interest', v.interest)}${ui.row('Total cost of borrowing', 'cost', v.cost)}`;
  const wide = `${ui.assumptions(["The payment uses a fixed rate and equal monthly payments over the term.", "Fees you enter are added to the loan and repaid with interest. Program rules, fee levels and rate caps are set by the SBA and your lender, so confirm them in your loan offer.", "Variable rates, prepayment penalties and collateral requirements are not modeled."])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'sba-loan', title: 'SBA Loan Calculator', legend: 'Your Loan', form, label: 'Monthly payment', big: v.big, results, summary: e.summary(o, r), wide });
}
