// Personal loan calculator markup.
export default function render(e, ui) {
  const o = { amount: 15000, rate: 12, years: 3, fee: 5 };
  const r = e.loan(o); const v = e.outputs(o, r);
  const form = `${ui.field('pl-amount', 'Loan amount ($)', 'min="100" max="10000000" step="0.01" value="15000" required')}
${ui.field('pl-rate', 'Interest rate (%)', 'min="0" max="40" step="0.01" value="12" required')}
${ui.field('pl-years', 'Loan term (years)', 'min="0.5" max="10" step="0.5" value="3" required')}
${ui.field('pl-fee', 'Origination fee (% of loan)', 'min="0" max="15" step="0.01" value="5"', 'Many lenders deduct this from the money you receive. Check your loan offer.')}`;
  const results = `${ui.row('APR including the fee', 'apr', v.apr)}${ui.row('Origination fee', 'feeAmt', v.feeAmt)}${ui.row('Cash you receive', 'cash', v.cash)}${ui.row('Total interest', 'interest', v.interest)}${ui.row('Total borrowing cost', 'cost', v.cost)}${ui.row('Loan needed to receive the full amount', 'needed', v.needed)}`;
  const wide = `${ui.assumptions(['The payment is figured on the full loan amount at the stated interest rate.', 'The origination fee is deducted from the proceeds. Total borrowing cost = total payments − cash received.', 'APR is the rate at which the cash received equals the present value of the payments, so it includes the fee.', 'The rate is fixed and every payment is made on time. Late fees and prepayment terms are not modeled.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'personal-loan', title: 'Personal Loan Calculator', legend: 'Your Loan Offer', form, label: 'Monthly payment', big: v.big, results, summary: e.summary(o, r), wide });
}
