// Portfolio allocation and rebalancing analyzer markup.
export default function render(e, ui) {
  const d = [['U.S. stock fund', 62000, 50], ['International stock fund', 18000, 20], ['Bond fund', 20000, 30], ['', 0, 0], ['', 0, 0], ['', 0, 0]];
  const o = { holdings: d.map(([name, value, target]) => ({ name: name || 'Holding', value, target })), cash: 0, band: 5 };
  const r = e.analyze(o); const v = e.outputs(o, r);
  const h = (i, [name, value, target]) => `<p class="finloom-calc-hint"><strong>Holding ${i}</strong></p><div class="finloom-calc-field"><label for="pr-name${i}">Name</label><input id="pr-name${i}" name="name${i}" type="text" maxlength="30" value="${ui.esc(name)}"></div><div class="finloom-calc-pair">${ui.field(`pr-value${i}`, 'Current value ($)', `min="0" max="10000000000" step="0.01"${value ? ` value="${value}"` : ''}`)}${ui.field(`pr-target${i}`, 'Target weight (%)', `min="0" max="100" step="0.1"${value ? ` value="${target}"` : ''}`)}</div>`;
  const form = `${d.slice(0, 3).map((x, i) => h(i + 1, x)).join('')}
${ui.advanced(`${d.slice(3).map((x, i) => h(i + 4, x)).join('')}
${ui.field('pr-cash', 'New cash to invest ($)', 'min="0" max="10000000000" step="0.01" value="0"')}
${ui.field('pr-band', 'Flag drift larger than (percentage points)', 'min="0" max="50" step="0.5" value="5"')}`)}`;
  const results = `${ui.row('Target weights total', 'targetSum', v.targetSum)}${ui.row('Holdings outside the drift band', 'outside', v.outside)}${ui.row('Total to buy', 'buys', v.buys)}${ui.row('Total to sell', 'sells', v.sells)}${ui.row('Largest position', 'largest', v.largest)}`;
  const wide = `${ui.table('Rebalancing Worksheet', ['Holding', 'Value', 'Current Weight', 'Target', 'Drift', 'Trade to Target'], e.tableRows(r))}
${ui.assumptions(['Current weight = holding value ÷ total portfolio value. Drift = current weight − target weight.', 'Trade to target = target weight × (portfolio value + new cash) − current value.', 'Values are what you enter for one date. Live prices are not used.', 'Selling in a taxable account can create capital gains. Trading costs and taxes are not included, and this worksheet does not recommend any investment.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'portfolio-rebalance', title: 'Portfolio Allocation and Rebalancing Analyzer', legend: 'Your Holdings', form, label: 'Portfolio value', big: v.big, results, summary: e.summary(o, r), wide });
}
