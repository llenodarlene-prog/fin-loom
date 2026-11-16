// Balance transfer calculator markup.
export default function render(e, ui) {
  const o = { balance: 6000, apr: 24, payment: 300, fee: 3, promo: 0, months: 15, goto: 24 };
  const r = e.compare(o); const v = e.outputs(o, r);
  const form = `${ui.field('bt-balance', 'Balance to transfer ($)', 'min="1" max="10000000" step="0.01" value="6000" required')}
${ui.field('bt-apr', 'Current card APR (%)', 'min="0" max="60" step="0.01" value="24" required')}
${ui.field('bt-payment', 'Monthly payment ($)', 'min="1" max="1000000" step="0.01" value="300" required')}
${ui.field('bt-fee', 'Balance transfer fee (%)', 'min="0" max="10" step="0.1" value="3" required', 'Check the offer. Some cards charge a flat minimum fee instead when it is higher.')}
${ui.field('bt-promo', 'Promotional APR (%)', 'min="0" max="30" step="0.01" value="0" required')}
${ui.field('bt-months', 'Promotional period (months)', 'min="0" max="60" step="1" value="15" required')}
${ui.field('bt-goto', 'APR after the promotion (%)', 'min="0" max="60" step="0.01" value="24" required')}`;
  const results = `${ui.row('Transfer fee', 'fee', v.fee)}${ui.row('Interest if you stay', 'stayCost', v.stayCost)}${ui.row('Interest and fee if you transfer', 'moveCost', v.moveCost)}${ui.row('Payoff time if you stay', 'stayTime', v.stayTime)}${ui.row('Payoff time if you transfer', 'moveTime', v.moveTime)}${ui.row('Balance left when the promotion ends', 'left', v.left)}${ui.row('Payment to clear it during the promotion', 'clear', v.clear)}`;
  const wide = `${ui.assumptions(['The transfer fee is added to the transferred balance on day one.', 'Both options use the same fixed monthly payment, interest of balance × APR ÷ 12 each month and no new purchases.', 'After the promotional period, the remaining balance is charged the go-to APR.', 'Late payments can end a promotion early on many cards. Check your card agreement.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'balance-transfer', title: 'Balance Transfer Calculator', legend: 'Your Balance and Offer', form, label: 'Estimated savings from transferring', big: v.big, results, summary: e.summary(o, r), wide });
}
