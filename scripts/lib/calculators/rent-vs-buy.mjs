// Rent vs Buy Calculator markup.
export default function render(e, ui) {
  const o = {"rent": 2200, "rentGrowth": 3, "price": 400000, "down": 20, "rate": 6.5, "years": 7, "tax": 1.1, "upkeep": 1, "growth": 3, "invest": 5, "sell": 6};
  const r = e.calc(o); const v = e.outputs(o, r);
  const form = `${ui.field('rex-rent', 'Monthly rent ($)', 'min="0" max="1000000" step="0.01" value="2200" required')}
${ui.field('rex-rentGrowth', 'Yearly rent increase (%)', 'min="0" max="20" step="0.1" value="3"')}
${ui.field('rex-price', 'Home price ($)', 'min="10000" max="100000000" step="0.01" value="400000" required')}
${ui.field('rex-down', 'Down payment (%)', 'min="0" max="100" step="0.1" value="20" required')}
${ui.field('rex-rate', 'Mortgage rate (%)', 'min="0" max="20" step="0.001" value="6.5" required', "A 30-year fixed loan is assumed.")}
${ui.field('rex-years', 'Years you expect to stay', 'min="1" max="30" step="1" value="7" required')}
${ui.field('rex-tax', 'Property tax and insurance (% of value per year)', 'min="0" max="10" step="0.01" value="1.1"')}
${ui.field('rex-upkeep', 'Maintenance (% of value per year)', 'min="0" max="10" step="0.1" value="1"')}
${ui.field('rex-growth', 'Yearly home price change (%)', 'min="-10" max="20" step="0.1" value="3"', "An assumption, not a forecast.")}
${ui.field('rex-invest', 'Return on money not used for a down payment (%)', 'min="0" max="20" step="0.1" value="5"', "An assumption, not a forecast.")}
${ui.field('rex-sell', 'Selling costs (% of sale price)', 'min="0" max="15" step="0.1" value="6"', "Agent commissions and closing costs when you sell.")}`;
  const results = `${ui.row('Net cost of renting', 'rentNet', v.rentNet)}${ui.row('Net cost of buying', 'buyNet', v.buyNet)}${ui.row('Difference', 'diff', v.diff)}${ui.row('Monthly principal and interest', 'pay', v.pay)}${ui.row('Home value at the end', 'value', v.value)}${ui.row('Equity after selling costs', 'equity', v.equity)}`;
  const wide = `${ui.assumptions(["Buying net cost = down payment + mortgage payments + tax, insurance and maintenance \u2212 equity after selling costs at the end.", "Renting net cost = rent paid \u2212 growth the down payment could have earned if invested instead.", "Closing costs at purchase, tax deductions and differences in monthly cash flow beyond the down payment are not modeled.", "Home price growth and investment returns are assumptions, not forecasts. Small changes can flip the result."])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'rent-vs-buy', title: 'Rent vs Buy Calculator', legend: 'Your Rent and Home Assumptions', form, label: 'Lower net cost over your stay', big: v.big, results, summary: e.summary(o, r), wide });
}
