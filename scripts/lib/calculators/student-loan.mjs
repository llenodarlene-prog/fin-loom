// Student loan payoff calculator markup.
export default function render(e, ui) {
  const o = { balance: 30000, rate: 6.5, term: 10, extra: 100 };
  const p = e.plan(o); const v = e.outputs(o, p);
  const form = `${ui.field('sl-balance', 'Loan balance ($)', 'min="1" max="10000000" step="0.01" value="30000" required')}
${ui.field('sl-rate', 'Interest rate (%)', 'min="0" max="30" step="0.01" value="6.5" required')}
${ui.field('sl-term', 'Repayment term (years)', 'min="1" max="30" step="1" value="10" required', 'Ten years matches the federal standard repayment plan.')}
${ui.field('sl-extra', 'Extra monthly payment ($)', 'min="0" max="100000" step="0.01" value="100"')}`;
  const results = `${ui.row('Total interest at the scheduled payment', 'interest', v.interest)}${ui.row('Time to pay off with extra payment', 'time', v.time)}${ui.row('Interest with extra payment', 'fastInterest', v.fastInterest)}${ui.row('Interest saved', 'saved', v.saved)}${ui.row('Paid off sooner by', 'sooner', v.sooner)}`;
  const wide = `${ui.table('Payoff by Year With Extra Payment', ['Year', 'Interest Paid to Date', 'Remaining Balance'], e.tableRows(p))}
${ui.assumptions(['Monthly interest = balance × rate ÷ 12. The scheduled payment pays the loan off in equal monthly amounts over the term.', 'The extra payment goes entirely to principal every month. Confirm with your servicer how extra payments are applied.', 'Income-driven repayment, forgiveness, deferment, forbearance and rate changes are not modeled.', 'Taxes, including any student loan interest deduction, are not included.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'student-loan', title: 'Student Loan Payoff Calculator', legend: 'Your Loan', form, label: 'Scheduled monthly payment', big: v.big, results, summary: e.summary(o, p), wide });
}
