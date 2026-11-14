// Budget planner and expense tracker markup.
export default function render(e, ui) {
  const b = { housing: 1600, utilities: 250, food: 700, transport: 400, insurance: 350, debt: 300, saving: 600, fun: 300, misc: 200 };
  const a = { housing: 1600, utilities: 270, food: 820, transport: 360, insurance: 350, debt: 300, saving: 500, fun: 380, misc: 150 };
  const o = { income: 5000, budget: b, actual: a };
  const r = e.budget(o); const v = e.outputs(o, r);
  const form = `${ui.field('bp-income', 'Monthly take-home income ($)', 'min="0" max="10000000" step="0.01" value="5000" required')}
${e.CATS.map(([k, label]) => `<p class="finloom-calc-hint"><strong>${label}</strong></p><div class="finloom-calc-pair">${ui.field(`bp-b${k}`, 'Budget ($)', `min="0" max="10000000" step="0.01" value="${b[k]}"`)}${ui.field(`bp-a${k}`, 'Actual ($)', `min="0" max="10000000" step="0.01" value="${a[k]}"`)}</div>`).join('')}`;
  const results = `${ui.row('Total budgeted', 'totalBudget', v.totalBudget)}${ui.row('Total spent', 'totalActual', v.totalActual)}${ui.row('Income not yet budgeted', 'unbudgeted', v.unbudgeted)}${ui.row('Savings rate', 'savingsRate', v.savingsRate)}${ui.row('Categories over budget', 'over', v.over)}`;
  const wide = `${ui.table('Budget vs Actual', ['Category', 'Budget', 'Actual', 'Difference', 'Share of Income'], e.tableRows(r))}
<p><button type="button" class="finloom-calc-button finloom-calc-button--ghost" data-csv>Download as CSV</button></p>
${ui.assumptions(['Difference = budget − actual. A negative difference means the category is over budget.', 'Savings rate = (actual savings + income left unspent) ÷ take-home income.', 'Your numbers stay in your browser. Nothing is stored or sent, and the CSV file is created on your device.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'budget-planner', title: 'Budget Planner and Expense Tracker', legend: 'Your Month', form, label: 'Left after spending', big: v.big, results, summary: e.summary(o, r), wide });
}
