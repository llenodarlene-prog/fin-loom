// Car Refinance Calculator markup.
export default function render(e, ui) {
  const o = {"balance": 20000, "rate": 9, "months": 48, "newRate": 6, "newMonths": 48, "fees": 200};
  const r = e.calc(o); const v = e.outputs(o, r);
  const form = `${ui.field('cax-balance', 'Current loan balance ($)', 'min="500" max="10000000" step="0.01" value="20000" required')}
${ui.field('cax-rate', 'Current interest rate (%)', 'min="0" max="40" step="0.01" value="9" required')}
${ui.field('cax-months', 'Payments left on current loan', 'min="1" max="120" step="1" value="48" required')}
${ui.field('cax-newRate', 'New interest rate (%)', 'min="0" max="40" step="0.01" value="6" required')}
${ui.field('cax-newMonths', 'New loan term (months)', 'min="6" max="120" step="1" value="48" required')}
${ui.field('cax-fees', 'Fees added to the new loan ($)', 'min="0" max="100000" step="0.01" value="200"', "Title transfer and lender fees, if rolled in.")}`;
  const results = `${ui.row('Current monthly payment', 'oldPay', v.oldPay)}${ui.row('New monthly payment', 'newPay', v.newPay)}${ui.row('Interest left on current loan', 'oldInterest', v.oldInterest)}${ui.row('Interest on new loan', 'newInterest', v.newInterest)}${ui.row('Change in total remaining payments', 'change', v.change)}`;
  const wide = `${ui.assumptions(["Both loans are fixed rate with on-time monthly payments.", "A positive monthly change means the new payment is lower. A longer new term can lower the payment while raising total cost.", "Fees rolled into the new loan are repaid with interest. Upfront fees paid in cash are not included."])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'car-refinance', title: 'Car Refinance Calculator', legend: 'Your Current and New Loan', form, label: 'Monthly payment change', big: v.big, results, summary: e.summary(o, r), wide });
}
