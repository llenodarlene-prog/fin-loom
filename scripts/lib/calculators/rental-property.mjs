// Rental property calculator markup.
export default function render(e, ui) {
  const o = { price: 300000, down: 25, rate: 7, term: 30, closing: 9000, rent: 2600, vacancy: 5, taxes: 3600, insurance: 1500, hoa: 0, maintenance: 8, management: 8 };
  const r = e.rental(o); const v = e.outputs(o, r);
  const f = (k, label, attrs, hint) => ui.field(`rp-${k}`, label, `${attrs} value="${o[k]}"`, hint);
  const form = `${f('price', 'Purchase price ($)', 'min="1000" max="100000000" step="100" required')}
${f('down', 'Down payment (%)', 'min="0" max="100" step="0.5" required')}
${f('rate', 'Mortgage rate (%)', 'min="0" max="20" step="0.01" required')}
${f('term', 'Loan term (years)', 'min="1" max="40" step="1" required')}
${f('closing', 'Closing costs and repairs at purchase ($)', 'min="0" max="10000000" step="100"')}
${f('rent', 'Monthly rent ($)', 'min="0" max="1000000" step="10" required')}
${ui.advanced(`${f('vacancy', 'Vacancy rate (%)', 'min="0" max="100" step="0.5"')}
${f('taxes', 'Property taxes per year ($)', 'min="0" max="10000000" step="10"')}
${f('insurance', 'Insurance per year ($)', 'min="0" max="1000000" step="10"')}
${f('hoa', 'HOA fees per month ($)', 'min="0" max="100000" step="10"')}
${f('maintenance', 'Maintenance reserve (% of rent)', 'min="0" max="50" step="0.5"')}
${f('management', 'Property management (% of collected rent)', 'min="0" max="50" step="0.5"')}`)}`;
  const results = `${ui.row('Net operating income per year', 'noi', v.noi)}${ui.row('Cap rate', 'cap', v.cap)}${ui.row('Cash-on-cash return', 'coc', v.coc)}${ui.row('Mortgage payment per month', 'payment', v.payment)}${ui.row('Operating expenses per year', 'expenses', v.expenses)}${ui.row('Debt service coverage', 'dscr', v.dscr)}${ui.row('Cash invested', 'invested', v.invested)}`;
  const wide = `${ui.table('Yearly Income and Expenses', ['Item', 'Amount'], e.tableRows(r, o))}
${ui.assumptions(['NOI = rent after vacancy − operating expenses (taxes, insurance, HOA, maintenance, management). Mortgage payments are not operating expenses.', 'Cap rate = NOI ÷ purchase price. Cash-on-cash return = yearly cash flow ÷ (down payment + closing costs).', 'Rent, expenses and the rate are held steady. Appreciation, depreciation, taxes on rental income and selling costs are not included.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'rental-property', title: 'Rental Property Calculator', legend: 'Your Property', form, label: 'Monthly cash flow', big: v.big, results, summary: e.summary(o, r), wide });
}
