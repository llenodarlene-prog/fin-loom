// Sales tax calculator markup.
export default function render(e, ui) {
  const o = { amount: 100, rate: 8.25, mode: 'add' };
  const r = e.tax(o); const v = e.outputs(o, r);
  const form = `${ui.field('st-amount', 'Amount ($)', 'min="0" max="1000000000" step="0.01" value="100" required')}
${ui.field('st-rate', 'Combined sales tax rate (%)', 'min="0" max="30" step="0.001" value="8.25" required', 'Use your state plus local rate. Rates vary by city, county and item.')}
${ui.radios('mode', 'The amount is', [['add', 'Before tax (add tax)'], ['remove', 'Including tax (remove tax)']], 'add')}`;
  const results = `${ui.row('Price before tax', 'price', v.price)}${ui.row('Sales tax', 'tax', v.tax)}${ui.row('Total with tax', 'total', v.total)}`;
  const wide = `${ui.table('Tax by Quantity', ['Quantity', 'Price Before Tax', 'Sales Tax', 'Total'], e.tableRows(o))}
${ui.assumptions(['Add tax: tax = price × rate. Remove tax: price = total ÷ (1 + rate).', 'One rate applies to the whole amount. Some items are exempt or taxed at different rates.', 'Stores may round tax per item or per receipt, so totals can differ by a cent.'])}
${ui.disclaimer(true)}`;
  return ui.layout({ type: 'sales-tax', title: 'Sales Tax Calculator', legend: 'Your Purchase', form, label: 'Total', big: v.big, results, summary: e.summary(o, r), wide });
}
