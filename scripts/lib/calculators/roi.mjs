// ROI Calculator markup.
export default function render(e, ui) {
  const o = {"cost": 10000, "extra": 500, "final": 14000, "years": 3};
  const r = e.calc(o); const v = e.outputs(o, r);
  const form = `${ui.field('rox-cost', 'Amount invested ($)', 'min="0.01" max="1000000000" step="0.01" value="10000" required')}
${ui.field('rox-extra', 'Other costs ($)', 'min="0" max="1000000000" step="0.01" value="500"', "Fees, upkeep or other money put in.")}
${ui.field('rox-final', 'Final value or amount returned ($)', 'min="0" max="1000000000" step="0.01" value="14000" required')}
${ui.field('rox-years', 'Holding period (years)', 'min="0.1" max="100" step="0.1" value="3" required')}`;
  const results = `${ui.row('Total cost', 'total', v.total)}${ui.row('Net gain or loss', 'gain', v.gain)}${ui.row('Annualized ROI', 'annual', v.annual)}`;
  const wide = `${ui.assumptions(["ROI = (final value \u2212 total cost) \u00f7 total cost.", "Annualized ROI = (final value \u00f7 total cost)^(1 \u00f7 years) \u2212 1, which assumes the money was all invested at the start.", "Taxes and inflation are not included. Cash flows received along the way are not modeled separately."])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'roi', title: 'ROI Calculator', legend: 'Your Investment', form, label: 'Return on investment', big: v.big, results, summary: e.summary(o, r), wide });
}
