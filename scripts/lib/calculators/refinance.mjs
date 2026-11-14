// Mortgage refinance calculator markup.
export default function render(e, ui) {
  const o = { balance: 300000, rate: 7, remaining: 27, newRate: 6, term: 30, costs: 6000, roll: false };
  const r = e.refi(o); const v = e.outputs(o, r);
  const form = `${ui.field('rf-balance', 'Current loan balance ($)', 'min="1000" max="100000000" step="0.01" value="300000" required')}
${ui.field('rf-rate', 'Current interest rate (%)', 'min="0" max="20" step="0.001" value="7" required')}
${ui.field('rf-remaining', 'Years left on current loan', 'min="1" max="40" step="1" value="27" required')}
${ui.field('rf-newRate', 'New interest rate (%)', 'min="0" max="20" step="0.001" value="6" required')}
${ui.field('rf-term', 'New loan term (years)', 'min="1" max="40" step="1" value="30" required')}
${ui.field('rf-costs', 'Closing costs ($)', 'min="0" max="1000000" step="0.01" value="6000" required', 'From the Loan Estimate, including any points.')}
<div class="finloom-calc-field"><label><input type="checkbox" name="roll" id="rf-roll"> Roll closing costs into the new loan</label></div>`;
  const results = `${ui.row('Current principal and interest payment', 'oldPay', v.oldPay)}${ui.row('New principal and interest payment', 'newPay', v.newPay)}${ui.row('Monthly savings', 'savings', v.savings)}${ui.row('Interest left on current loan', 'oldInterest', v.oldInterest)}${ui.row('Interest on new loan', 'newInterest', v.newInterest)}${ui.row('Change in total payments', 'lifetime', v.lifetime)}`;
  const wide = `${ui.assumptions(['Payments are principal and interest only. Taxes, insurance and mortgage insurance are not included.', 'Break-even months = upfront closing costs ÷ monthly payment savings.', 'A longer new term can lower the payment while raising total interest. Compare total payments as well as the monthly figure.', 'Rolled-in costs add to the loan balance and are repaid with interest.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'refinance', title: 'Mortgage Refinance Calculator', legend: 'Your Current and New Loan', form, label: 'Break-even on closing costs', big: v.big, results, summary: e.summary(o, r), wide });
}
