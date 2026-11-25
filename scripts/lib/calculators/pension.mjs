// Pension Calculator markup.
export default function render(e, ui) {
  const o = {"monthly": 2500, "lump": 400000, "years": 25, "ret": 5, "cola": 0};
  const r = e.calc(o); const v = e.outputs(o, r);
  const form = `${ui.field('pex-monthly', 'Monthly pension ($)', 'min="1" max="1000000" step="0.01" value="2500" required')}
${ui.field('pex-lump', 'Lump-sum offer ($)', 'min="1" max="100000000" step="0.01" value="400000" required')}
${ui.field('pex-years', 'Years you expect to receive payments', 'min="1" max="50" step="1" value="25" required', "Life expectancy is uncertain. Try several values.")}
${ui.field('pex-ret', 'Return you could earn on the lump sum (%)', 'min="0" max="20" step="0.1" value="5" required', "An assumption, not a forecast.")}
${ui.field('pex-cola', 'Yearly pension increase (%)', 'min="0" max="10" step="0.1" value="0"', "Use 0 if your pension has no cost-of-living adjustment.")}`;
  const results = `${ui.row('Total pension payments', 'total', v.total)}${ui.row('Pension value minus lump sum', 'diff', v.diff)}${ui.row('Return the lump sum needs to match', 'breakeven', v.breakeven)}`;
  const wide = `${ui.assumptions(["Present value discounts each monthly payment at the return you enter. Increases are applied once a year.", "Taxes, survivor benefits, the pension plan\u2019s financial strength and inflation are not modeled.", "The break-even return is the rate at which the lump sum could pay the same stream for the years entered."])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'pension', title: 'Pension Calculator', legend: 'Your Pension Offer', form, label: 'Value of the pension today', big: v.big, results, summary: e.summary(o, r), wide });
}
