// Dividend yield calculator markup.
export default function render(e, ui) {
  const o = { price: 50, dividend: 0.5, frequency: 4, invest: 10000 };
  const r = e.yieldCalc(o); const v = e.outputs(o, r);
  const form = `${ui.field('dy-price', 'Share price ($)', 'min="0.01" max="1000000" step="0.01" value="50" required')}
${ui.field('dy-dividend', 'Dividend per payment ($ per share)', 'min="0" max="100000" step="0.0001" value="0.5" required')}
${ui.select('dy-frequency', 'Payments per year', [['12', 'Monthly (12)'], ['4', 'Quarterly (4)'], ['2', 'Semiannual (2)'], ['1', 'Annual (1)']], '4')}
${ui.field('dy-invest', 'Amount to invest ($, optional)', 'min="0" max="1000000000" step="0.01" value="10000"')}`;
  const results = `${ui.row('Annual dividend per share', 'annual', v.annual)}${ui.row('Shares bought', 'shares', v.shares)}${ui.row('Annual dividend income', 'income', v.income)}${ui.row('Income per payment', 'perPayment', v.perPayment)}`;
  const wide = `${ui.table('Yield if the Price Changes', ['Price Move', 'Share Price', 'Dividend Yield'], e.tableRows(o))}
${ui.assumptions(['Dividend yield = annual dividends per share ÷ share price.', 'Annual dividend = dividend per payment × payments per year. Special dividends are not included.', 'Dividends are not guaranteed and can be cut or stopped. Taxes, fees and reinvestment are not included.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'dividend-yield', title: 'Dividend Yield Calculator', legend: 'Your Stock', form, label: 'Dividend yield', big: v.big, results, summary: e.summary(o, r), wide });
}
