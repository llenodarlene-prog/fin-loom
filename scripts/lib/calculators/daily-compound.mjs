// Daily compound interest calculator markup: balance, rate, days, and compounding frequency up
// front; recurring contributions under Advanced options; daily/monthly/annual comparison cards.
export default function render(e, ui) {
  const o = { balance: 10000, rate: 5, days: 365, periods: 365, contribution: 0, contributionFrequency: 'none' };
  const r = e.compound(o);
  const v = e.outputs(r);
  const form = `${ui.field('dci-balance', 'Starting balance ($)', 'min="0" max="1000000000" step="0.01" value="10000" required')}
${ui.field('dci-rate', 'Annual nominal rate (%)', 'min="0" max="100" step="0.01" value="5" required', 'The stated annual rate before compounding, not the APY.')}
${ui.field('dci-days', 'Number of days', 'min="1" max="36500" step="1" value="365" required', 'Time is measured as days ÷ 365.')}
${ui.select('dci-periods', 'Compounding frequency', [[365, 'Daily'], [12, 'Monthly'], [4, 'Quarterly'], [1, 'Annually']], 365)}
${ui.advanced(`${ui.field('dci-contribution', 'Recurring contribution ($, optional)', 'min="0" max="10000000" step="0.01" value="0"')}
${ui.select('dci-cfrequency', 'Contribution frequency', Object.entries(e.CONTRIBUTIONS), 'none', 'Contributions are added at the end of each day, week, or month and grow from that day.')}`)}`;
  const results = `${ui.row('Total interest', 'interest', v.interest)}${ui.row('Total contributions', 'contributions', v.contributions)}${ui.row('Effective annual yield', 'yield', v.yield)}${ui.row('Daily interest at the start', 'dailyStart', v.dailyStart)}${ui.row('Daily interest at the end', 'dailyEnd', v.dailyEnd)}`;
  const wide = `<h3 class="finloom-calc-subtitle">Daily vs Monthly vs Annual Compounding</h3>
<div class="finloom-calc-compare" data-compare>${e.compareCards(r)}</div>
<h3 class="finloom-calc-subtitle">Balance Over Time</h3>
${ui.chart(e.chart(r), `${ui.key('value', 'Balance (solid)')}${ui.key('capital', 'Starting balance plus contributions (dashed)')}`)}
${ui.table('Balance Breakdown', ['Period', 'Through Day', 'Contributions', 'Interest', 'Ending Balance'], e.tableRows(r))}
${ui.assumptions(['The rate stays constant for the whole period.', 'Time is counted as days ÷ 365, and the effect of compounding is spread evenly across each day, so results match A = P(1 + r/n)^(nt) for any number of days.', 'Contributions are added at the end of each day, week, or month (a month is 365 ÷ 12 days) and earn interest from that day.', 'Fees, taxes, withdrawals, and rate changes are not included.', 'Banks may credit interest on different schedules or use a 360-day year, so account statements can differ slightly.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'daily-compound', title: 'Daily Compound Interest Calculator', form, label: 'Ending balance', big: v.big, results, summary: e.summary(r), wide });
}
