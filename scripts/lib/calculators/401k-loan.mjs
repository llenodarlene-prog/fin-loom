// 401(k) loan calculator markup.
export default function render(e, ui) {
  const o = { vested: 60000, amount: 20000, rate: 8.5, years: 5, market: 7, freq: 26, home: false };
  const r = e.loan(o); const v = e.outputs(o, r);
  const form = `${ui.field('kl-vested', 'Vested 401(k) balance ($)', 'min="0" max="100000000" step="0.01" value="60000" required')}
${ui.field('kl-amount', 'Loan amount ($)', 'min="0" max="50000" step="0.01" value="20000" required')}
${ui.field('kl-rate', 'Loan interest rate (%)', 'min="0" max="20" step="0.01" value="8.5" required', 'Set by your plan, often tied to the prime rate.')}
${ui.field('kl-years', 'Repayment term (years)', 'min="1" max="30" step="1" value="5" required')}
${ui.select('kl-freq', 'Payment frequency', [['26', 'Every two weeks'], ['12', 'Monthly'], ['52', 'Weekly'], ['4', 'Quarterly']], '26')}
<div class="finloom-calc-field"><label><input type="checkbox" name="home" id="kl-home"> Loan is for buying my main home</label></div>
${ui.advanced(ui.field('kl-market', 'Return the money would otherwise earn (%)', 'min="-10" max="20" step="0.1" value="7"', 'Used to estimate lost growth while the money is out of the market.'))}`;
  const results = `${ui.row('IRS maximum loan for this balance', 'max', v.max)}${ui.row('Interest paid back to your account', 'interest', v.interest)}${ui.row('Total repaid', 'total', v.total)}${ui.row('Number of payments', 'count', v.count)}${ui.row('Estimated lost growth', 'opportunity', v.opportunity)}`;
  const wide = `${ui.assumptions(['IRS maximum: the lesser of $50,000 or the greater of $10,000 or 50% of the vested balance. Prior loans in the last 12 months reduce the $50,000 figure.', 'Repayment must occur within 5 years in substantially equal payments made at least quarterly, unless the loan is for buying a main home.', 'Payments are level and include principal and interest. Interest goes back into your own account.', 'Lost growth assumes the borrowed money would have earned the return you enter. A loan in default is generally treated as a taxable distribution.'])}
${ui.disclaimer(true)}`;
  return ui.layout({ type: '401k-loan', title: '401(k) Loan Calculator', legend: 'Your Loan', form, label: 'Payment per period', big: v.big, results, summary: e.summary(o, r), wide });
}
