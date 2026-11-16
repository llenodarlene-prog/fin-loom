// Coast FIRE calculator markup.
export default function render(e, ui) {
  const o = { age: 30, retire: 65, spending: 50000, withdraw: 4, ret: 7, inflation: 2.5, invested: 100000 };
  const r = e.coast(o); const v = e.outputs(o, r);
  const form = `${ui.field('cf-age', 'Current age', 'min="16" max="80" step="1" value="30" required')}
${ui.field('cf-retire', 'Retirement age', 'min="30" max="85" step="1" value="65" required')}
${ui.field('cf-spending', 'Annual spending in retirement ($, today\'s dollars)', 'min="1000" max="10000000" step="100" value="50000" required')}
${ui.field('cf-invested', 'Invested for retirement today ($)', 'min="0" max="1000000000" step="0.01" value="100000" required')}
${ui.field('cf-ret', 'Expected annual return (%)', 'min="-5" max="15" step="0.1" value="7" required', 'An assumption, not a forecast. Returns vary year to year.')}
${ui.field('cf-inflation', 'Expected inflation (%)', 'min="0" max="10" step="0.1" value="2.5" required')}
${ui.field('cf-withdraw', 'Withdrawal rate (%)', 'min="1" max="10" step="0.1" value="4" required', 'The share of savings you plan to withdraw in the first year of retirement.')}`;
  const results = `${ui.row('FIRE number at retirement', 'fire', v.fire)}${ui.row('Your savings projected to retirement', 'projected', v.projected)}${ui.row('Surplus or shortfall at retirement', 'gap', v.gap)}${ui.row('Real return used', 'real', v.real)}${ui.row('Years until retirement', 'years', v.years)}${ui.row('Status', 'status', v.status)}`;
  const wide = `${ui.table('Projected Savings vs Coast Target', ['Age', 'Your Savings, No New Contributions', 'Coast Target at That Age'], e.tableRows(r))}
${ui.assumptions(['All amounts are in today\'s dollars, using a real return of (1 + return) ÷ (1 + inflation) − 1.', 'FIRE number = annual spending ÷ withdrawal rate. Coast FIRE number = FIRE number ÷ (1 + real return)^years to retirement.', 'Returns are steady every year. Real markets are volatile, and a lower return or a market fall near retirement can leave a shortfall.', 'Taxes, fees, Social Security, pensions and other income are not included.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'coast-fire', title: 'Coast FIRE Calculator', legend: 'Your Plan', form, label: 'Coast FIRE number today', big: v.big, results, summary: e.summary(o, r), wide });
}
