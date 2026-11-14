// Social Security break-even calculator markup.
export default function render(e, ui) {
  const o = { early: 62, late: 67, earlyBenefit: 1400, lateBenefit: 2000, cola: 0, horizon: 95 };
  const r = e.breakeven(o); const v = e.outputs(o, r);
  const form = `${ui.field('ss-early', 'First claiming age', 'min="62" max="70" step="1" value="62" required')}
${ui.field('ss-earlyBenefit', 'Monthly benefit at that age ($)', 'min="1" max="100000" step="1" value="1400" required', 'Use the estimate on your own Social Security statement.')}
${ui.field('ss-late', 'Later claiming age', 'min="62" max="70" step="1" value="67" required')}
${ui.field('ss-lateBenefit', 'Monthly benefit at the later age ($)', 'min="1" max="100000" step="1" value="2000" required')}
${ui.advanced(`${ui.field('ss-cola', 'Annual cost-of-living adjustment (%)', 'min="0" max="10" step="0.1" value="0"', 'Applied to both options each year after claiming. Zero keeps amounts in today\'s dollars.')}
${ui.field('ss-horizon', 'Compare totals up to age', 'min="70" max="100" step="1" value="95"')}`)}`;
  const results = `${ui.row('Benefit increase from waiting', 'increase', v.increase)}${ui.row('Total if claimed early (to horizon)', 'early', v.early)}${ui.row('Total if claimed later (to horizon)', 'late', v.late)}${ui.row('Difference at horizon', 'diff', v.diff)}`;
  const wide = `${ui.table('Cumulative Benefits by Age', ['Age', 'Claimed Early', 'Claimed Later'], e.tableRows(r))}
${ui.assumptions(['Benefits are the monthly amounts you enter, taken from your own Social Security statement.', 'Totals add each month\'s benefit from the claiming age, with any cost-of-living adjustment applied once a year to both options.', 'Taxes, Medicare premiums, spousal and survivor benefits, the earnings test and investment of early benefits are not included.', 'Break-even age shows when totals match. Your own health, other income and family situation are part of the decision too.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'ss-breakeven', title: 'Social Security Break-Even Calculator', legend: 'Your Benefit Estimates', form, label: 'Break-even age', big: v.big, results, summary: e.summary(o, r), wide });
}
