// Profit margin calculator markup.
export default function render(e, ui) {
  const o = { cost: 60, price: 100, units: 500, target: 50 };
  const r = e.margin(o); const v = e.outputs(o, r);
  const form = `${ui.field('pm-cost', 'Cost per unit ($)', 'min="0" max="1000000000" step="0.01" value="60" required', 'What it costs to make or buy one unit.')}
${ui.field('pm-price', 'Selling price per unit ($)', 'min="0.01" max="1000000000" step="0.01" value="100" required')}
${ui.field('pm-units', 'Units sold', 'min="1" max="100000000" step="1" value="500" required')}
${ui.field('pm-target', 'Target margin (%)', 'min="0" max="99" step="0.1" value="50"')}`;
  const results = `${ui.row('Gross profit per unit', 'profit', v.profit)}${ui.row('Markup on cost', 'markup', v.markup)}${ui.row('Total revenue', 'revenue', v.revenue)}${ui.row('Total gross profit', 'totalProfit', v.totalProfit)}${ui.row('Price for target margin', 'targetPrice', v.targetPrice)}`;
  const wide = `${ui.table('Price Needed for Each Margin at Your Cost', ['Target Margin', 'Selling Price', 'Equivalent Markup'], e.tableRows(o))}
${ui.assumptions(['Gross profit = selling price − cost. Margin = gross profit ÷ selling price. Markup = gross profit ÷ cost.', 'Price for a target margin = cost ÷ (1 − target margin).', 'This is gross margin. Operating costs, taxes and interest are not included, so net margin will be lower.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'profit-margin', title: 'Profit Margin Calculator', legend: 'Your Product', form, label: 'Gross profit margin', big: v.big, results, summary: e.summary(o, r), wide });
}
