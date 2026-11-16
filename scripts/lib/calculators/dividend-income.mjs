// Dividend income planner markup.
export default function render(e, ui) {
  const o = { portfolio: 100000, yield: 3.5, growth: 5, contribution: 6000, years: 20, target: 12000, reinvest: true };
  const r = e.plan(o); const v = e.outputs(o, r);
  const form = `${ui.field('di-portfolio', 'Portfolio value today ($)', 'min="0" max="1000000000" step="100" value="100000" required')}
${ui.field('di-yield', 'Dividend yield (%)', 'min="0.01" max="20" step="0.01" value="3.5" required')}
${ui.field('di-growth', 'Yearly dividend growth (%)', 'min="-20" max="20" step="0.1" value="5" required', 'An assumption. Dividends can be cut as well as raised.')}
${ui.field('di-contribution', 'Added each year ($)', 'min="0" max="10000000" step="100" value="6000"')}
${ui.field('di-years', 'Years to project', 'min="1" max="50" step="1" value="20" required')}
${ui.field('di-target', 'Yearly income goal ($, optional)', 'min="0" max="100000000" step="100" value="12000"')}
<div class="finloom-calc-field"><label><input type="checkbox" name="reinvest" id="di-reinvest" checked> Reinvest dividends</label></div>`;
  const results = `${ui.row('Income in the final year', 'last', v.last)}${ui.row('Monthly equivalent in the final year', 'monthly', v.monthly)}${ui.row('Total dividends over the period', 'total', v.total)}${ui.row('Portfolio needed for the goal at today\'s yield', 'needed', v.needed)}${ui.row('Goal reached', 'hit', v.hit)}`;
  const wide = `${ui.table('Projected Dividend Income', ['Year', 'Portfolio Value', 'Dividends'], e.tableRows(r))}
${ui.assumptions(['Year 1 income = portfolio × yield. Each year the yield on cost grows by the dividend growth rate, and contributions and any reinvested dividends are added.', 'Share prices are held flat to isolate dividend income. Real prices rise and fall.', 'Dividends are not guaranteed. Taxes and fees are not included.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'dividend-income', title: 'Dividend Income Planner', legend: 'Your Plan', form, label: 'Dividend income in year one', big: v.big, results, summary: e.summary(o, r), wide });
}
