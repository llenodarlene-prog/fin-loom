// Net worth calculator markup: assets and debts by category with an SCF 2025 comparison by age.
export default function render(e, ui) {
  const o = { age: 'a35', cash: 15000, investments: 20000, retirement: 60000, home: 350000, vehicles: 18000, other: 0, mortgage: 280000, auto: 12000, student: 15000, cards: 3000, loans: 0 };
  const r = e.worth(o);
  const v = e.outputs(o, r);
  const input = ([key, label]) => ui.field(`nw-${key}`, `${label} ($)`, `min="0" max="1000000000" step="0.01" value="${o[key]}"`);
  const ages = Object.entries(e.SCF).map(([k, [label]]) => [k, label]);
  const form = `${ui.select('nw-age', 'Age of the oldest adult in the household', ages, o.age, 'Used only to show the Federal Reserve benchmark for that age group.')}
<p class="finloom-calc-hint"><strong>Assets</strong></p>${e.ASSETS.map(input).join('')}
<p class="finloom-calc-hint"><strong>Debts</strong></p>${e.DEBTS.map(input).join('')}`;
  const results = `${ui.row('Total assets', 'assets', v.assets)}${ui.row('Total debts', 'debts', v.debts)}${ui.row('Home equity', 'equity', v.equity)}${ui.row('Cash and taxable investments', 'liquid', v.liquid)}${ui.row('Debt as a share of assets', 'ratio', v.ratio)}${ui.row('2025 median for your age group', 'median', v.median)}${ui.row('2025 mean for your age group', 'mean', v.mean)}`;
  const wide = `${ui.table('Balance Sheet by Category', ['Category', 'Type', 'Amount', 'Share of Total'], e.tableRows(r))}
${ui.assumptions(['Net worth = total assets − total debts, using the values you enter for one date.', 'Enter the home at its estimated market value and the mortgage balance separately, so home equity is not counted twice.', 'Benchmarks are 2025 Survey of Consumer Finances family figures in 2025 dollars, grouped by the age of the survey reference person. They describe families, not individuals, and are not targets.', 'Retirement accounts are shown before taxes. Taxes and penalties on withdrawals are not included.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'net-worth', title: 'Net Worth Calculator', legend: 'Your Balance Sheet', form, label: 'Your net worth', big: v.big, results, summary: e.summary(o, r), wide });
}
