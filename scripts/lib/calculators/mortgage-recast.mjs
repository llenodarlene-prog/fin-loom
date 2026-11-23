// Mortgage recast calculator markup.
export default function render(e, ui) {
  const o = { balance: 300000, rate: 6.5, remaining: 25, lump: 50000, fee: 250 };
  const r = e.recast(o); const v = e.outputs(o, r);
  const form = `${ui.field('mr-balance', 'Current loan balance ($)', 'min="1000" max="100000000" step="0.01" value="300000" required')}
${ui.field('mr-rate', 'Interest rate (%)', 'min="0" max="20" step="0.001" value="6.5" required')}
${ui.field('mr-remaining', 'Years left on the loan', 'min="1" max="40" step="0.5" value="25" required')}
${ui.field('mr-lump', 'Lump-sum principal payment ($)', 'min="0" max="100000000" step="0.01" value="50000" required', 'Lenders that offer recasts often set a minimum lump sum.')}
${ui.field('mr-fee', 'Recast fee ($)', 'min="0" max="100000" step="0.01" value="250"', 'Ask your servicer. Fees and eligibility vary.')}`;
  const results = `${ui.row('Current principal and interest payment', 'oldPay', v.oldPay)}${ui.row('Monthly savings', 'savings', v.savings)}${ui.row('Balance after lump sum', 'newBalance', v.newBalance)}${ui.row('Interest saved over the remaining term', 'saved', v.saved)}${ui.row('Interest saved after the fee', 'net', v.net)}${ui.row('Months to recover the fee', 'feeMonths', v.feeMonths)}`;
  const wide = `${ui.assumptions(['A recast keeps the same rate and remaining term and re-amortizes the lower balance, so the payment falls.', 'Payments are principal and interest only. Taxes, insurance and mortgage insurance are not included.', 'Interest saved compares total remaining interest before and after the lump sum. Most of the saving comes from the lump sum itself, which a regular extra payment would also produce.', 'Not every loan can be recast. Check with your servicer.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'mortgage-recast', title: 'Mortgage Recast Calculator', legend: 'Your Loan and Lump Sum', form, label: 'New monthly payment after recast', big: v.big, results, summary: e.summary(o, r), wide });
}
