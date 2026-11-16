// Crypto portfolio allocation tool markup.
export default function render(e, ui) {
  const o = { other: 90000, crypto: 10000, target: 5, drop: 50 };
  const r = e.allocate(o); const v = e.outputs(o, r);
  const form = `${ui.field('ca-other', 'Value of non-crypto investments ($)', 'min="0" max="10000000000" step="100" value="90000" required')}
${ui.field('ca-crypto', 'Value of crypto holdings ($)', 'min="0" max="10000000000" step="100" value="10000" required')}
${ui.field('ca-target', 'Target crypto share (%)', 'min="0" max="100" step="0.5" value="5" required', 'Your own choice. This tool does not suggest an allocation.')}
${ui.field('ca-drop', 'Test a crypto price fall of (%)', 'min="0" max="100" step="1" value="50" required')}`;
  const results = `${ui.row('Total portfolio', 'total', v.total)}${ui.row('Change to reach target', 'change', v.change)}${ui.row('Portfolio value after the fall', 'afterDrop', v.afterDrop)}${ui.row('Whole-portfolio change', 'portfolioMove', v.portfolioMove)}`;
  const wide = `${ui.table('Whole-Portfolio Effect of Crypto Price Moves', ['Crypto Price Move', 'Portfolio Value', 'Portfolio Change'], e.tableRows(o))}
${ui.assumptions(['Crypto share = crypto value ÷ total portfolio value.', 'Price-move scenarios change only the crypto holdings. Other investments are held at today\'s value.', 'Crypto prices are highly volatile. This tool shows exposure and does not recommend buying, selling or holding any asset.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'crypto-allocation', title: 'Crypto Portfolio Allocation Tool', legend: 'Your Portfolio', form, label: 'Current crypto share', big: v.big, results, summary: e.summary(o, r), wide });
}
