// Debt-to-income calculator markup.
export default function render(e, ui) {
  const o = { income: 6000, housing: 1500, auto: 100, student: 0, cards: 400, other: 0 };
  const r = e.dti(o); const v = e.outputs(o, r);
  const form = `${ui.field('dti-income', 'Gross income before taxes ($)', 'min="1" max="100000000" step="0.01" value="6000" required')}
${ui.radios('period', 'That income is', [['month', 'Per month'], ['year', 'Per year']], 'month')}
${e.DEBTS.map(([k, label]) => ui.field(`dti-${k}`, `${label} ($ per month)`, `min="0" max="10000000" step="0.01" value="${o[k]}"`)).join('')}`;
  const results = `${ui.row('Total monthly debt payments', 'total', v.total)}${ui.row('Housing as a share of income', 'housing', v.housing)}${ui.row('Income left after debt payments', 'leftover', v.leftover)}${ui.row('Reduction needed to reach 36%', 'to36', v.to36)}`;
  const wide = `${ui.table('Debt Payments as a Share of Gross Income', ['Payment', 'Monthly Amount', 'Share of Income'], e.tableRows(r))}
${ui.assumptions(['DTI = total monthly debt payments ÷ gross monthly income, as the CFPB defines it.', 'Annual income is divided by 12. Gross income is before taxes and other deductions.', 'Lenders set their own DTI limits and may count debts differently, for example including property taxes and insurance in housing.', 'The 36% figure is shown only as a reference point, not a lending rule.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'dti', title: 'Debt-to-Income Ratio Calculator', legend: 'Your Income and Debts', form, label: 'Debt-to-income ratio', big: v.big, results, summary: e.summary(o, r), wide });
}
