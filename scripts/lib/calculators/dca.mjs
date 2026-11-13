// Dollar-cost averaging calculator markup: equal purchases along a hypothetical price path,
// compared with a lump sum at the first price.
export default function render(e, ui) {
  const o = { amount: 500, periods: 12, start: 100, dip: 20, end: 100 };
  const r = e.dca(o);
  const v = e.outputs(r);
  const form = `${ui.field('dca-amount', 'Amount per purchase ($)', 'min="1" max="10000000" step="0.01" value="500" required')}
${ui.field('dca-periods', 'Number of purchases', 'min="2" max="120" step="1" value="12" required', 'For example, 12 monthly purchases.')}
${ui.field('dca-start', 'Price at first purchase ($)', 'min="0.01" max="1000000" step="0.01" value="100" required')}
${ui.field('dca-dip', 'Largest price drop along the way (%)', 'min="0" max="95" step="1" value="20"', 'The price falls by this much at the middle purchase. Use 0 for no dip.')}
${ui.field('dca-end', 'Price at last purchase ($)', 'min="0.01" max="1000000" step="0.01" value="100" required')}`;
  const results = `${ui.row('Total invested', 'invested', v.invested)}${ui.row('Gain or loss', 'gain', v.gain)}${ui.row('Average cost per share', 'avgCost', v.avgCost)}${ui.row('Average price paid over the period', 'avgPrice', v.avgPrice)}${ui.row('Shares bought', 'shares', v.shares)}${ui.row('Lump sum at first price, ending value', 'lumpValue', v.lumpValue)}${ui.row('Difference vs lump sum', 'diff', v.diff)}`;
  const wide = `${ui.table('Purchase-by-Purchase Results', ['Purchase', 'Price', 'Shares Bought', 'Total Shares', 'Total Invested', 'Value at That Price'], e.tableRows(r))}
${ui.assumptions(['The price path is hypothetical: a straight-line fall to the low at the middle purchase, then a straight-line move to the ending price. Real prices move unpredictably.', 'Each purchase invests the same dollar amount, and fractional shares are allowed.', 'The lump sum invests the same total at the first purchase price and is valued at the ending price.', 'Fees, taxes, dividends and interest on cash waiting to be invested are not included.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'dca', title: 'Dollar-Cost Averaging Calculator', legend: 'Your Purchases', form, label: 'Ending value of your purchases', big: v.big, results, summary: e.summary(o, r), wide });
}
