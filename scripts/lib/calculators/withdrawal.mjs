// Investment withdrawal calculator markup: a mode switch (how long the money could last, or how
// much could be withdrawn), shared inputs, results for each mode, a balance chart with the
// depletion point marked, and a yearly table.
export default function render(e, ui) {
  const o = { mode: 'a', balance: 500000, withdrawal: 2500, ret: 5, inflation: 3, growth: 3, years: 30, timing: 'start' };
  const r = e.run(o);
  const v = e.outputs(o, r);
  const b = e.run({ ...o, mode: 'b' });
  const vb = e.outputs({ ...o, mode: 'b' }, b);
  const modes = [['a', 'How long will my money last?'], ['b', 'How much can I withdraw?']];
  const form = `<div class="finloom-calc-tabs" role="group" aria-label="Calculator mode">${modes.map(([key, text]) => `<button type="button" class="finloom-calc-chip" data-mode-button="${key}" aria-pressed="${key === 'a'}">${text}</button>`).join('')}</div>
<input type="hidden" name="mode" value="a">
${ui.field('wd-balance', 'Starting portfolio ($)', 'min="1" max="1000000000000" step="0.01" value="500000" required')}
<div data-mode="a">${ui.field('wd-withdrawal', 'Monthly withdrawal ($)', 'min="1" max="1000000000" step="0.01" value="2500" required', 'The first year\'s monthly amount, before any yearly increase.')}</div>
<div data-mode="b" hidden>${ui.field('wd-years', 'Years the money should last', 'min="1" max="100" step="1" value="30" required')}</div>
${ui.field('wd-ret', 'Annual return (%)', 'min="-50" max="50" step="0.1" value="5" required', 'A steady average return. This growth rate is an illustration, not a forecast.')}
${ui.radios('timing', 'Withdrawal timing', [['start', 'Beginning of month'], ['end', 'End of month']], 'start')}
<div data-mode="a">${ui.advanced(`${ui.field('wd-growth', 'Yearly withdrawal increase (%)', 'min="-50" max="50" step="0.1" value="3"', 'Raises the monthly withdrawal once a year, for example to keep pace with prices.')}${ui.field('wd-inflation', 'Inflation (%)', 'min="-10" max="30" step="0.1" value="3"', 'Used only to show balances and the last withdrawal in today\'s dollars.')}`)}</div>`;
  const A = ' data-mode="a"'; const B = ' data-mode="b" hidden style="display:none"';
  const results = `${ui.row('Total withdrawn', 'withdrawn', v.withdrawn, A)}${ui.row('Total investment growth', 'growth', v.growth, A)}${ui.row('Last monthly withdrawal', 'last', v.last, A)}${ui.row("Last withdrawal in today's dollars", 'lastReal', v.lastReal, A)}${ui.row('First-year withdrawal rate', 'rateA', v.rateA, A)}${ui.row('Annual withdrawal', 'annualB', vb.annualB, B)}${ui.row('Total withdrawn', 'withdrawnB', vb.withdrawnB, B)}${ui.row('Total investment growth', 'growthB', vb.growthB, B)}${ui.row('Withdrawal rate on starting balance', 'rateB', vb.rateB, B)}`;
  const view = e.chart(o, r);
  const wide = `<h3 class="finloom-calc-subtitle">Portfolio Balance Over Time</h3>
${ui.chart(view, `${ui.key('value', 'Portfolio balance (solid)')}<span data-real-key>${ui.key('alt', "Balance in today's dollars (dashed)")}</span><span>The point marks when the money runs out.</span>`)}
${ui.table('Year-by-Year Withdrawals', ['Year', 'Starting Balance', 'Withdrawals', 'Investment Growth', 'Ending Balance', "Ending Balance in Today's Dollars"], e.tableRows(r))}
<p class="finloom-calc-note"><strong>Sequence-of-returns risk is not modeled in this basic projection.</strong> Real returns vary from year to year, and losses early in retirement can shorten how long savings last even when the average return is the same.</p>
${ui.assumptions(['The annual return is applied evenly every month at the equivalent monthly rate.', 'Withdrawals increase once a year by the yearly withdrawal increase you enter.', 'Inflation converts figures into today\'s dollars and does not change the withdrawals themselves.', 'Projections in the first mode stop after 100 years.', 'Taxes, fees, and required minimum distributions are excluded.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'withdrawal', title: 'Investment Withdrawal Calculator', form, label: '<span data-big-label>Estimated time until the money runs out</span>', big: v.big, results, summary: e.summary(o, r), wide });
}
