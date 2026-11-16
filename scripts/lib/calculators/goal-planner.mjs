// Financial goal planner markup.
export default function render(e, ui) {
  const defaults = [['Emergency fund', 15000, 24, 5000, 300], ['Home down payment', 40000, 60, 8000, 400], ['', 0, 0, 0, 0], ['', 0, 0, 0, 0]];
  const o = { goals: defaults.map(([name, target, months, saved, monthly]) => ({ name, target, months, saved, monthly })), apy: 3 };
  const p = e.plan(o); const v = e.outputs(o, p);
  const g = (k, [name, target, months, saved, monthly]) => `<p class="finloom-calc-hint"><strong>Goal ${k}</strong></p><div class="finloom-calc-field"><label for="gp-name${k}">Goal name</label><input id="gp-name${k}" name="name${k}" type="text" maxlength="40" value="${ui.esc(name)}"></div><div class="finloom-calc-pair">${ui.field(`gp-target${k}`, 'Target ($)', `min="0" max="100000000" step="0.01"${target ? ` value="${target}"` : ''}`)}${ui.field(`gp-months${k}`, 'Months to deadline', `min="0" max="600" step="1"${target ? ` value="${months}"` : ''}`)}</div><div class="finloom-calc-pair">${ui.field(`gp-saved${k}`, 'Saved so far ($)', `min="0" max="100000000" step="0.01"${target ? ` value="${saved}"` : ''}`)}${ui.field(`gp-monthly${k}`, 'Planned monthly deposit ($)', `min="0" max="1000000" step="0.01"${target ? ` value="${monthly}"` : ''}`)}</div>`;
  const form = `${defaults.slice(0, 2).map((d, i) => g(i + 1, d)).join('')}
${ui.advanced(defaults.slice(2).map((d, i) => g(i + 3, d)).join(''))}
${ui.field('gp-apy', 'Savings APY for all goals (%)', 'min="0" max="20" step="0.01" value="3"')}`;
  const results = `${ui.row('Total you plan to save each month', 'planned', v.planned)}${ui.row('Planned minus required', 'diff', v.diff)}${ui.row('Goals on track', 'onTrack', v.onTrack)}`;
  const wide = `${ui.table('Goal Progress', ['Goal', 'Target', 'Progress Today', 'Required Monthly', 'Status'], e.tableRows(p))}
${ui.assumptions(['Required monthly deposit = (target − savings grown at the APY) ÷ the growth factor of a monthly deposit over the months left.', 'Savings and deposits earn the monthly equivalent of the APY. Deposits are made at the end of each month.', 'Each goal is funded separately. Taxes, fees and changes to targets are not included.', 'Goal names stay in your browser and are not sent anywhere.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'goal-planner', title: 'Financial Goal Planner', legend: 'Your Goals', form, label: 'Total monthly savings needed', big: v.big, results, summary: e.summary(o, p), wide });
}
