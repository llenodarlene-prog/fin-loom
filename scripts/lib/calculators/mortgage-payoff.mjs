// Mortgage payoff calculator markup: balance, rate, remaining term, payment, extra payments,
// payoff-date comparison cards, a balance chart for both schedules, and a yearly amortization table.
// The server render uses October 2026 as the starting month; the browser uses the reader's date.
export default function render(e, ui) {
  const start = { year: 2026, month: 10 };
  const scheduled = Math.round(e.scheduledPayment(300000, 6, 360) * 100) / 100;
  const o = { balance: 300000, apr: 6, termYears: 30, termMonths: 0, payment: scheduled, extra: 300, lump: 0, lumpMonth: 12 };
  const r = e.payoff(o, start);
  const v = e.outputs(o, r);
  const form = `${ui.field('mp-balance', 'Remaining mortgage balance ($)', 'min="1" max="100000000" step="0.01" value="300000" required')}
${ui.field('mp-apr', 'Interest rate (APR, %)', 'min="0" max="30" step="0.001" value="6" required')}
${ui.field('mp-years', 'Remaining term (years)', 'min="0" max="50" step="1" value="30" required')}
${ui.field('mp-months', 'Remaining term (extra months)', 'min="0" max="11" step="1" value="0"', 'For example, 27 years and 4 months left.')}
${ui.field('mp-payment', 'Current monthly payment, principal and interest ($)', `min="0.01" max="10000000" step="0.01" value="${scheduled.toFixed(2)}" required`, 'Exclude escrow for property taxes and insurance. The default is the scheduled payment for the inputs above.')}
${ui.field('mp-extra', 'Extra monthly payment ($)', 'min="0" max="10000000" step="0.01" value="300"', 'Added to principal every month.')}
${ui.advanced(`${ui.field('mp-lump', 'One-time extra payment ($)', 'min="0" max="100000000" step="0.01" value="0"')}
${ui.field('mp-lumpmonth', 'Month of the one-time payment', 'min="1" max="600" step="1" value="12"', 'Counted from your next payment: 1 is next month, 12 is a year from now.')}`)}`;
  const results = `${ui.row('Current payoff date', 'baseDate', v.baseDate)}${ui.row('New payoff date', 'fastDate', v.fastDate)}${ui.row('Total interest without extra payments', 'baseInterest', v.baseInterest)}${ui.row('Total interest with extra payments', 'fastInterest', v.fastInterest)}${ui.row('Interest saved', 'saved', v.saved)}${ui.row('Total paid with extra payments', 'totalPaid', v.totalPaid)}`;
  const card = (label, key, labelKey) => `<div class="finloom-calc-card"><p${labelKey ? ` data-out="${labelKey}"` : ''}>${labelKey ? v[labelKey] : label}</p><strong><output data-out="${key}">${v[key]}</output></strong></div>`;
  const view = e.chart(r);
  const wide = `<div class="finloom-calc-compare">${card('Current payoff', 'cardBase')}${card('', 'cardFast', 'cardFastLabel')}${card('Time saved', 'cardSaved')}</div>
<h3 class="finloom-calc-subtitle">Balance Over Time</h3>
${ui.chart(view, `${ui.key('value', 'With extra payments (solid)')}${ui.key('capital', 'Current schedule (dashed)')}`)}
${ui.table('Yearly Amortization With Extra Payments', ['Year', 'Interest Paid', 'Principal Paid', 'Ending Balance'], e.tableRows(r))}
${ui.assumptions(['The interest rate is fixed for the rest of the loan and interest is charged monthly at the APR divided by 12.', 'Payments cover principal and interest only; escrow for property taxes, insurance, and mortgage insurance is excluded.', 'Every extra payment goes straight to principal, and the loan has no prepayment penalty.', 'Dates count from next month, the first payment after today, and assume every payment is made on time.', 'Taxes, including any mortgage interest deduction, are not included.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'mortgage-payoff', title: 'Mortgage Payoff Calculator', legend: 'Your Mortgage', form, label: 'Paid off', big: v.big, results, summary: e.summary(o, r), wide });
}
