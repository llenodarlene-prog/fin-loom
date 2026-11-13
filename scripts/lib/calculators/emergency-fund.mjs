// Emergency fund calculator markup: essential expenses, months of cover, savings and deposits.
export default function render(e, ui) {
  const o = { expenses: 3000, months: 6, saved: 5000, deposit: 500, apy: 0 };
  const r = e.plan(o);
  const v = e.outputs(o, r);
  const form = `${ui.field('ef-expenses', 'Essential monthly expenses ($)', 'min="1" max="1000000" step="0.01" value="3000" required', 'Housing, utilities, food, insurance, transport and minimum debt payments.')}
${ui.field('ef-months', 'Months of expenses to cover', 'min="1" max="24" step="1" value="6" required')}
${ui.field('ef-saved', 'Current emergency savings ($)', 'min="0" max="100000000" step="0.01" value="5000"')}
${ui.field('ef-deposit', 'Monthly deposit ($)', 'min="0" max="1000000" step="0.01" value="500"')}
${ui.advanced(ui.field('ef-apy', 'Savings APY (%)', 'min="0" max="20" step="0.01" value="0"', 'Optional. Interest is added monthly at the equivalent monthly rate.'))}`;
  const results = `${ui.row('Amount still needed', 'shortfall', v.shortfall)}${ui.row('Months covered today', 'covered', v.covered)}${ui.row('Progress toward target', 'progress', v.progress)}${ui.row('Time to reach target', 'time', v.time)}${ui.row('Interest earned on the way', 'interest', v.interest)}`;
  const wide = `${ui.table('Savings Progress', ['Month', 'Balance', 'Progress'], e.tableRows(r))}
${ui.assumptions(['Target = essential monthly expenses × months of cover.', 'Each month the balance earns the monthly equivalent of the APY, then the deposit is added.', 'Deposits and the APY stay the same until the target is reached. The projection stops at 50 years.', 'No withdrawals, taxes or fees are included. Expenses can change over time, so review the target each year.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'emergency-fund', title: 'Emergency Fund Calculator', legend: 'Your Expenses and Savings', form, label: 'Emergency fund target', big: v.big, results, summary: e.summary(o, r), wide });
}
