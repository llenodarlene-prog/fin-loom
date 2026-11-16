// CAGR calculator markup.
export default function render(e, ui) {
  const o = { begin: 10000, end: 18000, years: 5 };
  const r = e.cagr(o); const v = e.outputs(o, r);
  const form = `${ui.field('cg-begin', 'Beginning value ($)', 'min="0.01" max="1000000000000" step="0.01" value="10000" required')}
${ui.field('cg-end', 'Ending value ($)', 'min="0" max="1000000000000" step="0.01" value="18000" required')}
${ui.field('cg-years', 'Number of years', 'min="0.1" max="100" step="0.1" value="5" required')}`;
  const results = `${ui.row('Total change', 'total', v.total)}${ui.row('Gain or loss', 'gain', v.gain)}${ui.row('Years to double at this rate', 'doubling', v.doubling)}`;
  const wide = `${ui.table('Value at a Steady CAGR', ['Year', 'Value'], e.tableRows(r))}
${ui.assumptions(['CAGR = (ending value ÷ beginning value)^(1 ÷ years) − 1.', 'CAGR describes the steady rate that links two values. The real path may have risen and fallen along the way.', 'Contributions and withdrawals during the period are not handled. Use beginning and ending values with no money added or removed.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'cagr', title: 'CAGR Calculator', legend: 'Your Values', form, label: 'Compound annual growth rate', big: v.big, results, summary: e.summary(o, r), wide });
}
