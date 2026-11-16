// Payment processing fee calculator markup.
export default function render(e, ui) {
  const o = { amount: 100, provider: 'stripe-online', pct: 2.9, fixed: 0.3, count: 200 };
  const r = e.fees(o); const v = e.outputs(o, r);
  const form = `${ui.field('pf-amount', 'Payment amount ($)', 'min="0.01" max="10000000" step="0.01" value="100" required')}
${ui.select('pf-provider', 'Processor and payment type', Object.entries(e.PRESETS).map(([k, [label, pct, fixed]]) => [k, pct === null ? label : `${label} (${pct}% + $${fixed.toFixed(2)})`]), o.provider, 'Standard published U.S. rates, checked November 14, 2026. Your account may have different pricing.')}
${ui.advanced(`${ui.field('pf-pct', 'Custom percentage fee (%)', 'min="0" max="20" step="0.01" value="2.9"', 'Used when "Custom rate" is selected, for example for Square or a negotiated rate.')}
${ui.field('pf-fixed', 'Custom fixed fee per transaction ($)', 'min="0" max="100" step="0.01" value="0.30"')}
${ui.field('pf-count', 'Transactions per month', 'min="1" max="1000000" step="1" value="200"')}`)}`;
  const results = `${ui.row('You receive', 'net', v.net)}${ui.row('Effective fee rate', 'effective', v.effective)}${ui.row('Charge this to net the full amount', 'charge', v.charge)}${ui.row('Monthly fees at this volume', 'monthlyFees', v.monthlyFees)}${ui.row('Monthly amount received', 'monthlyNet', v.monthlyNet)}`;
  const wide = `${ui.table('Fee on This Payment by Processor', ['Processor', 'Published Rate', 'Fee', 'You Receive'], e.tableRows(o))}
${ui.assumptions(['Fee = amount × percentage + fixed fee. To net a target, charge (target + fixed fee) ÷ (1 − percentage).', 'Stripe rates are from stripe.com/pricing: 2.9% + 30¢ online and 2.7% + 5¢ in person for domestic cards, plus 1.5% for international cards. Other surcharges, such as currency conversion or manually entered cards, are not included.', 'Venmo rates are from Venmo\'s published fee page: 1.9% + $0.10 for business profiles, 2.29% + $0.09 for Tap to Pay, and 2.99% for goods and services payments to personal accounts.', 'Providers change prices and may offer custom rates. Refund, chargeback, payout and monthly fees are not included.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'payment-fees', title: 'Payment Processing Fee Calculator', legend: 'Your Payment', form, label: 'Processing fee', big: v.big, results, summary: e.summary(o, r), wide });
}
