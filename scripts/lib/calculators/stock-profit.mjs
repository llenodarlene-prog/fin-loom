// Stock profit calculator markup: buy and sell prices, shares, fees, a labeled gain/loss bar,
// and a cost-to-proceeds breakdown.
export default function render(e, ui) {
  const o = { buy: 50, sell: 65, shares: 100, buyFees: 5, sellFees: 5 };
  const r = e.profit(o);
  const v = e.outputs(r);
  const form = `${ui.field('sp-buy', 'Buy price per share ($)', 'min="0" max="1000000" step="0.01" value="50" required')}
${ui.field('sp-sell', 'Sell price per share ($)', 'min="0" max="1000000" step="0.01" value="65" required')}
${ui.field('sp-shares', 'Number of shares', 'min="0.0001" max="1000000000" step="0.0001" value="100" required', 'Fractional shares are allowed.')}
${ui.field('sp-buyfees', 'Buy fees ($)', 'min="0" max="1000000" step="0.01" value="5"', 'Commissions or other costs paid when buying. Use 0 if none.')}
${ui.field('sp-sellfees', 'Sell fees ($)', 'min="0" max="1000000" step="0.01" value="5"', 'Commissions or other costs paid when selling.')}`;
  const results = `${ui.row('Gross gain or loss (before fees)', 'gross', v.gross)}${ui.row('Total fees', 'fees', v.fees)}${ui.row('Return on cost basis', 'returnPct', v.returnPct)}${ui.row('Break-even sell price', 'breakEven', v.breakEven)}${ui.row('Net profit per share', 'perShare', v.perShare)}`;
  const wide = `<h3 class="finloom-calc-subtitle">Gain or Loss at a Glance</h3>
<div data-bars>${e.bars(r)}</div>
${ui.table('Trade Breakdown', ['Item', 'Amount'], e.tableRows(o, r))}
${ui.assumptions(['The calculation covers one purchase and one sale of the same number of shares.', 'Fees are entered as dollar amounts and added to the cost basis or subtracted from the proceeds.', 'Taxes are not included. Gains and losses on investments can be taxable, and the rate can depend on how long the shares were held.', 'Dividends received while holding the shares are not included.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'stock-profit', title: 'Stock Profit Calculator', legend: 'Your Trade', form, label: v.bigLabel, big: v.big, results, summary: e.summary(o, r), wide });
}
