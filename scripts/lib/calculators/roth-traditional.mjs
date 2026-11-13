// Roth vs traditional IRA calculator markup: same pre-tax earnings, compared after tax at retirement.
export default function render(e, ui) {
  const o = { amount: 7000, years: 30, rate: 6, nowTax: 22, retireTax: 12 };
  const r = e.compare(o);
  const v = e.outputs(r);
  const form = `${ui.field('rt-amount', 'Pre-tax earnings set aside each year ($)', 'min="1" max="1000000" step="1" value="7000" required', 'The traditional IRA invests all of it; the Roth invests what is left after tax.')}
${ui.field('rt-years', 'Years until retirement', 'min="1" max="60" step="1" value="30" required')}
${ui.field('rt-rate', 'Annual return (%)', 'min="-20" max="30" step="0.1" value="6" required', 'An assumed average yearly return, the same in both accounts.')}
${ui.field('rt-now', 'Tax rate today (%)', 'min="0" max="60" step="0.5" value="22" required', 'Your combined marginal rate on the money you contribute.')}
${ui.field('rt-retire', 'Tax rate in retirement (%)', 'min="0" max="60" step="0.5" value="12" required', 'Your expected rate on traditional IRA withdrawals.')}`;
  const results = `${ui.row('Traditional balance before tax', 'tradBalance', v.tradBalance)}${ui.row('Tax on traditional withdrawals', 'tradTax', v.tradTax)}${ui.row('Traditional after-tax value', 'tradAfterTax', v.tradAfterTax)}${ui.row('Roth contribution each year', 'rothContribution', v.rothContribution)}${ui.row('Roth after-tax value', 'rothAfterTax', v.rothAfterTax)}`;
  const wide = `${ui.table('Side-by-Side Comparison', ['Item', 'Traditional IRA', 'Roth IRA'], e.tableRows(o, r))}
${ui.assumptions(['Both accounts receive the same pre-tax earnings each year. The traditional IRA invests all of it with a tax deduction; the Roth invests the amount left after tax at today\'s rate.', 'Contributions are made at the end of each year and grow at the same constant return. Real returns vary.', 'The traditional balance is taxed at your retirement rate when withdrawn; qualified Roth withdrawals are tax-free.', 'Income limits for Roth contributions and deductible traditional contributions, the 2026 IRA limit of $7,500 ($8,600 at age 50 or older), state taxes, required minimum distributions and early-withdrawal penalties are not modeled.'])}
${ui.disclaimer(true)}`;
  return ui.layout({ type: 'roth-traditional', title: 'Roth vs Traditional IRA Calculator', legend: 'Your Situation', form, label: v.label, big: v.big, results, summary: e.summary(o, r), wide });
}
