// Stock average cost calculator markup: purchase rows (2 to 50) with add and remove buttons,
// an optional current price, price-versus-average bars, and a per-purchase breakdown table.
export default function render(e, ui) {
  const r = e.average(e.DEFAULTS, e.DEFAULT_CURRENT);
  const v = e.outputs(r);
  const form = `<div class="finloom-calc-rows" data-rows>${e.DEFAULTS.map((d, i) => e.rowHtml(i + 1, d)).join('')}</div>
<p class="finloom-calc-hint" data-row-count aria-live="polite">${e.DEFAULTS.length} of ${e.MAX_ROWS} purchases</p>
<button type="button" class="finloom-calc-button finloom-calc-button--ghost finloom-calc-add" data-add>Add purchase</button>
${ui.field('sa-current', 'Current share price ($, optional)', `min="0.0001" max="1000000" step="any" value="${e.DEFAULT_CURRENT}"`, 'Leave blank to skip the gain or loss estimate.')}`;
  const results = `${ui.row('Total shares', 'shares', v.shares)}${ui.row('Total invested (including fees)', 'invested', v.invested)}${ui.row('Total fees', 'fees', v.fees)}${ui.row('Average cost before fees', 'avgNoFees', v.avgNoFees)}${ui.row('Break-even price', 'breakEven', v.breakEven)}${ui.row('Current value', 'value', v.value)}${ui.row('Unrealized gain or loss', 'gain', v.gain)}`;
  const wide = `<h3 class="finloom-calc-subtitle">Purchase Prices Compared With Your Average</h3>
<div class="finloom-calc-bar" data-bars>${e.bars(r)}</div>
${ui.table('Purchase Breakdown', ['Purchase', 'Shares', 'Price', 'Fees', 'Cost', 'Share of Position'], e.tableRows(r))}
${ui.assumptions(['Average cost includes the fees you enter, so it equals the break-even price per share.', 'All purchases are treated as one position in the same stock, with no sales in between.', 'Stock splits, dividends, and reinvested dividends are not adjusted for.', 'Taxes are not included, and tax lots may be tracked differently by your broker.', 'The gain or loss is unrealized and changes with the market price.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'stock-average', title: 'Stock Average Cost Calculator', legend: 'Your Purchases', form, label: 'Average cost per share', big: v.big, results, summary: e.summary(r), wide });
}
