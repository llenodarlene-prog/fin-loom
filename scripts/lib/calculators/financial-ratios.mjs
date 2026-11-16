// Financial ratio analyzer markup.
export default function render(e, ui) {
  const o = { currentAssets: 500000, cash: 120000, inventory: 150000, currentLiabilities: 250000, totalAssets: 1500000, totalLiabilities: 700000, equity: 800000, revenue: 2000000, operatingIncome: 240000, netIncome: 160000, interest: 30000 };
  const list = e.ratios(o); const v = e.outputs(o, list);
  const form = `<p class="finloom-calc-hint">Enter figures from the same reporting period, in the same units (for example, thousands of dollars).</p>
${e.FIELDS.map(([k, label]) => ui.field(`fr-${k}`, label, `min="-10000000000000" max="10000000000000" step="any" value="${o[k]}"`)).join('')}`;
  const results = `${ui.row('Quick ratio', 'quick', v.quick)}${ui.row('Debt-to-equity', 'de', v.de)}${ui.row('Interest coverage', 'coverage', v.coverage)}${ui.row('Operating margin', 'om', v.om)}${ui.row('Net margin', 'nm', v.nm)}${ui.row('Return on equity', 'roe', v.roe)}${ui.row('Return on assets', 'roa', v.roa)}`;
  const wide = `${ui.table('All Ratios', ['Ratio', 'Group', 'Value', 'Formula'], e.tableRows(list))}
${ui.assumptions(['Ratios use period-end balance sheet figures. Some analysts use averages of the opening and closing balances instead.', 'Debt-to-equity here uses total liabilities. Some sources use only interest-bearing debt, which gives a lower figure.', 'Ratios that need a zero or blank denominator show "Not available".', 'Healthy ranges differ widely by industry. Compare with the same company over time and with close peers.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'financial-ratios', title: 'Financial Ratio Analyzer', legend: 'Financial Statement Figures', form, label: 'Current ratio', big: v.big, results, summary: e.summary(o, list), wide });
}
