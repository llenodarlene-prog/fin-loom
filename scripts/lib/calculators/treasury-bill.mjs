// Treasury bill calculator markup: face value, discount rate or price, days to maturity.
export default function render(e, ui) {
  const o = { face: 1000, mode: 'rate', rate: 4, price: 98, days: 182, year: 365 };
  const r = e.bill(o); const v = e.outputs(o, r);
  const form = `${ui.field('tb-face', 'Face value ($)', 'min="100" max="100000000" step="100" value="1000" required', 'Bills are sold in $100 increments. You receive this amount at maturity.')}
${ui.radios('mode', 'I know the', [['rate', 'Discount rate'], ['price', 'Price per $100']], 'rate')}
${ui.field('tb-rate', 'Discount rate (%)', 'min="0" max="25" step="0.001" value="4"', 'Used when "Discount rate" is selected.')}
${ui.field('tb-price', 'Price per $100 of face value', 'min="50" max="100" step="0.000001" value="98"', 'Used when "Price per $100" is selected.')}
${ui.field('tb-days', 'Days to maturity', 'min="1" max="366" step="1" value="182" required', 'Common terms: 28, 42, 56, 91, 119, 182 or 364 days.')}
${ui.select('tb-year', 'Days in the year for the investment rate', [['365', '365'], ['366', '366 (leap year)']], '365')}`;
  const results = `${ui.row('Price per $100', 'price', v.price)}${ui.row('Discount rate', 'discount', v.discount)}${ui.row('Investment rate (coupon equivalent)', 'investment', v.investment)}${ui.row('Interest earned', 'interest', v.interest)}${ui.row('Paid at maturity', 'proceeds', v.proceeds)}`;
  const wide = `${ui.table('Same Discount Rate Across Common Terms', ['Term', 'Cost', 'Interest', 'Investment Rate'], e.tableRows(o))}
${ui.assumptions(['Price per $100 = 100 × (1 − discount rate × days ÷ 360), as TreasuryDirect publishes.', 'Investment rate for bills of up to half a year = ((100 − price) ÷ price) × (days in year ÷ days). Longer bills use Treasury\'s quadratic formula.', 'Treasury rounds prices at auction, so actual amounts can differ by cents.', 'Taxes on the interest are not included. Check current IRS and TreasuryDirect guidance for how bill income is taxed.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'treasury-bill', title: 'Treasury Bill Calculator', legend: 'Your Bill', form, label: 'Cost of the bill', big: v.big, results, summary: e.summary(o, r), wide });
}
