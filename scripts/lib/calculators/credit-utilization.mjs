// Credit utilization calculator markup: up to five cards plus a target ratio.
export default function render(e, ui) {
  const defaults = [[5000, 1200], [3000, 900], [0, 0], [0, 0], [0, 0]];
  const o = { cards: defaults.map(([limit, balance]) => ({ limit, balance })), target: 30 };
  const r = e.utilization(o);
  const v = e.outputs(o, r);
  const card = (i, [limit, balance]) => `<div class="finloom-calc-pair">${ui.field(`cu-limit${i}`, `Card ${i} credit limit ($)`, `min="0" max="10000000" step="0.01"${limit ? ` value="${limit}"` : ''}`)}${ui.field(`cu-balance${i}`, `Card ${i} balance ($)`, `min="0" max="10000000" step="0.01"${limit ? ` value="${balance}"` : ''}`)}</div>`;
  const form = `${defaults.slice(0, 2).map((d, i) => card(i + 1, d)).join('')}
${ui.advanced(defaults.slice(2).map((d, i) => card(i + 3, d)).join(''))}
${ui.field('cu-target', 'Target utilization (%)', 'min="1" max="100" step="1" value="30" required', 'The CFPB notes many experts suggest staying under 30%, and people with the highest scores often use under 10%.')}`;
  const results = `${ui.row('Total balances', 'balance', v.balance)}${ui.row('Total credit limits', 'limit', v.limit)}${ui.row('Available credit', 'available', v.available)}${ui.row('Pay-down to reach target', 'payDown', v.payDown)}${ui.row('Highest card utilization', 'highest', v.highest)}${ui.row('Cards above target', 'over', v.over)}`;
  const wide = `${ui.table('Utilization by Card', ['Card', 'Balance', 'Credit Limit', 'Utilization', 'Pay-Down to Target'], e.tableRows(r))}
${ui.assumptions(['Utilization = balance ÷ credit limit, for each card and for all cards combined.', 'Pay-down to target = balance − target × credit limit, and never less than zero.', 'Card issuers usually report the statement balance, so paying before the statement date can lower the balance that is reported.', 'Credit scoring models are proprietary. This tool shows the ratio only and does not estimate a credit score.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'credit-utilization', title: 'Credit Utilization Calculator', legend: 'Your Cards', form, label: 'Overall credit utilization', big: v.big, results, summary: e.summary(o, r), wide });
}
