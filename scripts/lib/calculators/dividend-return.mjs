// Dividend total return calculator markup: inputs, total return, a price-vs-dividends bar
// breakdown, a breakdown table, assumptions, and the disclaimer.
export default function render(e, ui) {
  const o = { buy: 50, current: 60, shares: 100, years: 3, dividend: 4.5, fees: 10, reinvest: false };
  const r = e.totalReturn(o);
  const v = e.outputs(o, r);
  const form = `${ui.field('dtr-buy', 'Purchase price per share ($)', 'min="0.01" max="1000000" step="0.01" value="50" required')}
${ui.field('dtr-current', 'Current or sale price per share ($)', 'min="0" max="1000000" step="0.01" value="60" required')}
${ui.field('dtr-shares', 'Number of shares', 'min="0.0001" max="100000000" step="0.0001" value="100" required')}
${ui.field('dtr-years', 'Holding period (years)', 'min="0.01" max="100" step="0.01" value="3" required', 'Decimals are allowed, for example 1.5 years.')}
${ui.field('dtr-dividend', 'Total dividends per share received ($)', 'min="0" max="100000" step="0.0001" value="4.50"', 'Add up every dividend per share paid while you held the shares.')}
${ui.advanced(`${ui.field('dtr-fees', 'Total fees ($)', 'min="0" max="1000000000" step="0.01" value="10"', 'Commissions or other costs to buy and sell.')}
${ui.radios('reinvest', 'Reinvest dividends', [['no', 'No, keep dividends as cash'], ['yes', 'Yes, buy more shares']], 'no')}`)}`;
  const results = `${ui.row('Total return (%)', 'pct', v.pct)}${ui.row('Price return', 'price', v.price)}${ui.row('Dividend income', 'dividends', v.dividends)}${ui.row('Annualized return', 'annualized', v.annualized)}${ui.row('Ending value', 'end', v.end)}${ui.row('Starting value (cost plus fees)', 'start', v.start)}`;
  const wide = `<h3 class="finloom-calc-subtitle">Where the Return Comes From</h3>
<div class="finloom-calc-bar" data-bars>${e.bars(r)}</div>
<p class="finloom-calc-note">Bar length shows each part's size; hatched bars and a minus sign mark costs or losses.</p>
<h3 class="finloom-calc-subtitle">Breakdown</h3>
${ui.table('Total return breakdown', ['Item', 'Amount'], e.tableRows(o, r))}
${ui.assumptions(['Starting value is the purchase cost plus fees, the full amount paid out.', 'Dividends are the total per share you enter, received on every share held.', 'With reinvestment on, dividends are assumed to buy shares at the average of the purchase and current price, and those shares are valued at the current price. Real reinvestment happens at each payment date\'s price.', 'Annualized return compounds the total return evenly over the holding period.', 'Taxes are not included. Dividends and gains can be taxable in a taxable account.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'dividend-return', title: 'Dividend Total Return Calculator', form, label: 'Total return', big: v.big, results, summary: e.summary(o, r), wide });
}
