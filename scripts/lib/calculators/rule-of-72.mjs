// Rule of 72 calculator markup.
export default function render(e, ui) {
  const o = { rate: 8, years: 10 };
  const r = e.rule(o); const v = e.outputs(o, r);
  const form = `${ui.field('r72-rate', 'Annual rate of return (%)', 'min="0.1" max="100" step="0.1" value="8" required')}
${ui.field('r72-years', 'Years you want money to double in', 'min="0.5" max="100" step="0.5" value="10" required')}`;
  const results = `${ui.row('Exact years to double', 'exact', v.exact)}${ui.row('Rule of 70 estimate', 'r70', v.r70)}${ui.row('Rule of 72 error', 'error', v.error)}${ui.row('Rate to double (Rule of 72)', 'approxRate', v.approxRate)}${ui.row('Rate to double (exact)', 'exactRate', v.exactRate)}`;
  const wide = `${ui.table('Rule of 72 vs Exact Doubling Time', ['Annual Rate', 'Rule of 72 (Years)', 'Exact (Years)'], e.tableRows())}
${ui.assumptions(['Rule of 72: years to double ≈ 72 ÷ annual rate in percent.', 'Exact doubling time with annual compounding = ln 2 ÷ ln(1 + rate).', 'The rate is assumed steady every year. Fees, taxes and inflation are not included.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'rule-of-72', title: 'Rule of 72 Calculator', legend: 'Your Rate', form, label: 'Years to double (Rule of 72)', big: v.big, results, summary: e.summary(o, r), wide });
}
