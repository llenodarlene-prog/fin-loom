// Inflation calculator markup: amount, start and end year with optional months, quick presets,
// before/after cards, a CPI chart, and the CPI table for the selected years.
export default function render(e, ui) {
  const start = { year: 2000, month: 0 }; const end = { year: e.LAST.year, month: e.LAST.month };
  const r = e.inflate(100, start, end);
  const v = e.outputs(r);
  const months = [['', 'Annual average'], ...e.MONTHS.map((name, i) => [i + 1, name])];
  const presets = [['2000', '2000 to today'], ['2010', '2010 to today'], ['2020', '2020 to today'], ['custom', 'Custom']];
  const form = `<div class="finloom-calc-presets" role="group" aria-label="Quick presets">${presets.map(([key, text]) => `<button type="button" class="finloom-calc-chip" data-preset="${key}" aria-pressed="${key === '2000'}">${text}</button>`).join('')}</div>
${ui.field('infl-amount', 'Amount ($)', 'min="0.01" max="1000000000000" step="0.01" value="100" required')}
${ui.field('infl-startyear', 'Start year', `min="${e.FIRST_YEAR}" max="${e.LAST.year}" step="1" value="2000" required`)}
${ui.select('infl-startmonth', 'Start month (optional)', months, '')}
${ui.field('infl-endyear', 'End year', `min="${e.FIRST_YEAR}" max="${e.LAST.year}" step="1" value="${e.LAST.year}" required`, `Today means ${e.MONTHS[e.LAST.month - 1]} ${e.LAST.year}, the latest published month.`)}
${ui.select('infl-endmonth', 'End month (optional)', months, e.LAST.month, 'Leave a month blank to use that year\'s annual average.')}`;
  const results = `${ui.row('Cumulative inflation', 'cumulative', v.cumulative)}${ui.row('Purchasing-power change', 'power', v.power)}${ui.row('Average annual inflation', 'average', v.average)}${ui.row('Start CPI-U', 'startCpi', v.startCpi)}${ui.row('End CPI-U', 'endCpi', v.endCpi)}`;
  const view = e.chart(r);
  const wide = `<div class="finloom-calc-compare"><div class="finloom-calc-card"><p>Before</p><strong><output data-out="before">${v.before}</output></strong></div><div class="finloom-calc-card"><p>After</p><strong><output data-out="after">${v.after}</output></strong></div></div>
<h3 class="finloom-calc-subtitle">CPI-U Over the Selected Years</h3>
${ui.chart(view, ui.key('value', 'CPI-U annual average (solid line); the point marks the end year'))}
${ui.table('CPI-U by Year', ['Year', 'CPI-U Annual Average', 'Annual Change'], e.tableRows(r))}
<p class="finloom-calc-note">* Partial year. 2025 averages 11 months because BLS published no October 2025 index; ${e.LAST.year} averages January to ${e.MONTHS[e.LAST.month - 1]}. Source: U.S. Bureau of Labor Statistics, CPI-U, U.S. city average, all items, not seasonally adjusted (1982-84 = 100), via FRED series CPIAUCNS.</p>
${ui.assumptions(['The calculator uses the national CPI-U, which reflects average urban consumer prices, not any one household\'s spending.', 'Annual figures are averages of the published monthly index; choosing months uses those single months.', 'Results show equivalent buying power, not what any specific item cost.', 'Taxes, wages, and investment returns are not included.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'inflation', title: 'Inflation Calculator', form, label: 'Equivalent value', big: v.big, results, summary: e.summary(r), wide });
}
