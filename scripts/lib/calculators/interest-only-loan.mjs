// Interest-Only Loan Calculator markup.
export default function render(e, ui) {
  const o = {"amount": 400000, "rate": 7, "ioYears": 10, "years": 30};
  const r = e.calc(o); const v = e.outputs(o, r);
  const form = `${ui.field('inx-amount', 'Loan amount ($)', 'min="1000" max="100000000" step="0.01" value="400000" required')}
${ui.field('inx-rate', 'Interest rate (%)', 'min="0" max="30" step="0.001" value="7" required')}
${ui.field('inx-ioYears', 'Interest-only period (years)', 'min="1" max="15" step="1" value="10" required')}
${ui.field('inx-years', 'Total loan term (years)', 'min="2" max="40" step="1" value="30" required')}`;
  const results = `${ui.row('Payment after the interest-only period', 'amPay', v.amPay)}${ui.row('Payment increase', 'jump', v.jump)}${ui.row('Fully amortizing payment from the start', 'full', v.full)}${ui.row('Total interest', 'interest', v.interest)}${ui.row('Extra interest vs amortizing loan', 'extra', v.extra)}`;
  const wide = `${ui.assumptions(["The rate is fixed for the whole term. Many interest-only loans have adjustable rates, which this calculator does not model.", "During the interest-only period, no principal is repaid.", "After that period, the full balance is repaid in equal payments over the remaining term.", "Taxes and insurance are not included."])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'interest-only-loan', title: 'Interest-Only Loan Calculator', legend: 'Your Loan', form, label: 'Interest-only monthly payment', big: v.big, results, summary: e.summary(o, r), wide });
}
