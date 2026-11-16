// Bank fee comparison worksheet markup.
export default function render(e, ui) {
  const o = { a: { monthly: 12, atm: 3, overdraft: 35, wire: 30, other: 0, apy: 0.01, waived: false }, b: { monthly: 0, atm: 0, overdraft: 0, wire: 25, other: 0, apy: 3.5, waived: false }, atmUses: 2, overdrafts: 1, wires: 1, balance: 5000 };
  const r = e.compare(o); const v = e.outputs(o, r);
  const acct = (s, label) => `<p class="finloom-calc-hint"><strong>${label}</strong></p><div class="finloom-calc-pair">${ui.field(`bf-${s}monthly`, 'Monthly fee ($)', `min="0" max="1000" step="0.01" value="${o[s].monthly}"`)}${ui.field(`bf-${s}apy`, 'APY (%)', `min="0" max="20" step="0.01" value="${o[s].apy}"`)}</div><div class="finloom-calc-field"><label><input type="checkbox" name="${s}waived" id="bf-${s}waived"> I meet the monthly fee waiver</label></div><div class="finloom-calc-pair">${ui.field(`bf-${s}atm`, 'Out-of-network ATM fee ($)', `min="0" max="100" step="0.01" value="${o[s].atm}"`)}${ui.field(`bf-${s}overdraft`, 'Overdraft fee ($)', `min="0" max="100" step="0.01" value="${o[s].overdraft}"`)}</div><div class="finloom-calc-pair">${ui.field(`bf-${s}wire`, 'Outgoing wire fee ($)', `min="0" max="200" step="0.01" value="${o[s].wire}"`)}${ui.field(`bf-${s}other`, 'Other yearly fees ($)', `min="0" max="10000" step="0.01" value="${o[s].other}"`)}</div>`;
  const form = `${acct('a', 'Account A')}${acct('b', 'Account B')}
<p class="finloom-calc-hint"><strong>Your usage</strong></p>
${ui.field('bf-atmUses', 'Out-of-network ATM uses per month', 'min="0" max="100" step="1" value="2"')}
${ui.field('bf-overdrafts', 'Overdrafts per year', 'min="0" max="100" step="1" value="1"')}
${ui.field('bf-wires', 'Outgoing wires per year', 'min="0" max="100" step="1" value="1"')}
${ui.field('bf-balance', 'Average balance ($)', 'min="0" max="100000000" step="0.01" value="5000"')}`;
  const results = `${ui.row('Yearly savings with the cheaper account', 'diff', v.diff)}${ui.row('Account A net yearly cost', 'aNet', v.aNet)}${ui.row('Account B net yearly cost', 'bNet', v.bNet)}`;
  const wide = `${ui.table('Yearly Cost Breakdown', ['Item', 'Account A', 'Account B'], e.tableRows(r))}
${ui.assumptions(['Enter fees from each bank\'s current fee schedule. This worksheet does not contain any bank\'s fees.', 'Yearly cost = monthly fee × 12 (unless waived) + ATM fee × uses × 12 + overdraft fee × overdrafts + wire fee × wires + other fees − interest on your average balance.', 'Third-party ATM owner surcharges, foreign transaction fees and fee caps are not included unless you add them under other fees.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'bank-fees', title: 'Bank Fee Comparison Worksheet', legend: 'Two Accounts', form, label: 'Cheaper account for your usage', big: v.big, results, summary: e.summary(o, r), wide });
}
