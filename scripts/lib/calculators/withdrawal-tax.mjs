// 401(k) withdrawal tax calculator markup: filing status, taxable income, withdrawal, age, the 10% exception,
// an optional state rate, then the gross-to-net split, bracket table, assumptions, and the tax disclaimer.
export default function render(e, ui) {
  const o = { status: 'single', income: 50000, amount: 20000, age: 50, exception: false, stateRate: 0 };
  const r = e.estimate(o);
  const v = e.outputs(o, r);
  const statuses = Object.entries(e.STATUSES);
  const std = e.TAX_RULES[e.YEAR];
  const form = `<p class="finloom-calc-tax-year"><strong>Tax year ${e.YEAR}</strong> federal rates (IRS Rev. Proc. 2025-32).</p>
${ui.select('wt-status', 'Filing status', statuses, o.status)}
${ui.field('wt-income', 'Other taxable income ($)', 'min="0" max="100000000" step="1" value="50000"', `Taxable income after deductions, not counting this withdrawal. The ${e.YEAR} standard deduction is $16,100 for single filers, $32,200 for joint filers, and $24,150 for heads of household.`)}
${ui.field('wt-amount', 'Withdrawal amount ($)', 'min="0.01" max="100000000" step="0.01" value="20000" required', 'A taxable withdrawal from a traditional (pre-tax) 401(k).')}
${ui.field('wt-age', 'Age at withdrawal', 'min="18" max="120" step="0.5" value="50" required', 'Before age 59½, a 10% additional tax generally applies.')}
<div data-exception-field>${ui.radios('exception', 'Does an exception to the 10% additional tax apply?', [['no', 'No'], ['yes', 'Yes, for example separation from service after age 55']], 'no')}</div>
${ui.advanced(ui.field('wt-state', 'State income tax rate (%, optional)', 'min="0" max="20" step="0.1" value="0"', 'A flat estimate you enter. Leave at 0 to show federal tax only.'))}`;
  const results = `${ui.row('Federal income tax on the withdrawal', 'federal', v.federal)}${ui.row('10% additional tax', 'penalty', v.penalty)}${ui.row('State tax (your estimate)', 'state', v.state)}${ui.row('Amount kept after tax', 'net', v.net)}${ui.row('Effective rate on the withdrawal', 'effective', v.effective)}${ui.row('Mandatory 20% federal withholding', 'withholding', v.withholding)}`;
  const wide = `<h3 class="finloom-calc-subtitle">Where the Withdrawal Goes</h3>
<div class="finloom-calc-bar" data-split>${e.split(o, r)}</div>
<p class="finloom-calc-note">The 20% withholding is a prepayment the plan sends to the IRS when it pays a rollover-eligible distribution to you. Your actual tax is settled on your return, so you could owe more or get some back.</p>
<h3 class="finloom-calc-subtitle">How the Withdrawal Is Taxed</h3>
${ui.table('Withdrawal by Tax Bracket', ['Federal Bracket', 'Portion of Withdrawal', 'Tax'], e.tableRows(r))}
<p class="finloom-calc-note">${e.YEAR} single brackets: 10% to $${std.single.brackets[0].toLocaleString('en-US')}, 12% to $${std.single.brackets[1].toLocaleString('en-US')}, 22% to $${std.single.brackets[2].toLocaleString('en-US')}, 24% to $${std.single.brackets[3].toLocaleString('en-US')}, 32% to $${std.single.brackets[4].toLocaleString('en-US')}, 35% to $${std.single.brackets[5].toLocaleString('en-US')}, then 37%. Source: IRS Rev. Proc. 2025-32.</p>
${ui.assumptions(['Uses 2026 federal income tax brackets from IRS Rev. Proc. 2025-32 for the filing status you choose.', 'The withdrawal is a taxable distribution from a traditional (pre-tax) 401(k), taxed as ordinary income on top of the taxable income you enter.', 'Roth 401(k) withdrawals, after-tax contributions, and rollovers are not modeled.', 'The 10% additional tax applies before age 59½ unless you mark an exception; the calculator does not test whether an exception qualifies.', 'State tax uses the flat rate you enter; local taxes, credits, and other income effects are excluded.'])}
${ui.disclaimer(true)}`;
  return ui.layout({ type: 'withdrawal-tax', title: '401(k) Withdrawal Tax Calculator', legend: 'Your Withdrawal', form, label: 'Estimated total tax on the withdrawal', big: v.big, results, summary: e.summary(o, r), wide });
}
