// Crypto profit calculator markup.
export default function render(e, ui) {
  const o = { invest: 1000, buy: 50000, sell: 60000, buyFee: 0.5, sellFee: 0.5 };
  const r = e.profit(o); const v = e.outputs(o, r);
  const form = `${ui.field('cp-invest', 'Amount invested ($)', 'min="0.01" max="1000000000" step="0.01" value="1000" required')}
${ui.field('cp-buy', 'Buy price per coin ($)', 'min="0.00000001" max="100000000" step="any" value="50000" required')}
${ui.field('cp-sell', 'Sell price per coin ($)', 'min="0" max="100000000" step="any" value="60000" required')}
${ui.field('cp-buyFee', 'Buy fee (%)', 'min="0" max="10" step="0.01" value="0.5"', 'Check your exchange\'s fee schedule. Spreads can add to the cost.')}
${ui.field('cp-sellFee', 'Sell fee (%)', 'min="0" max="10" step="0.01" value="0.5"')}`;
  const results = `${ui.row('Return on investment', 'roi', v.roi)}${ui.row('Coins bought', 'coins', v.coins)}${ui.row('Proceeds after fees', 'proceeds', v.proceeds)}${ui.row('Total fees', 'fees', v.fees)}${ui.row('Break-even sell price', 'breakEven', v.breakEven)}${ui.row('Price change', 'change', v.change)}`;
  const wide = `${ui.table('Profit or Loss at Other Sell Prices', ['Price Move', 'Sell Price', 'Profit or Loss'], e.tableRows(o))}
${ui.assumptions(['Coins = (amount − buy fee) ÷ buy price. Proceeds = coins × sell price − sell fee.', 'Fees are percentages of each trade. Network fees, spreads and withdrawal fees are not included.', 'Taxes are not included. Crypto prices are highly volatile and can fall sharply.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'crypto-profit', title: 'Crypto Profit Calculator', legend: 'Your Trade', form, label: 'Profit or loss', big: v.big, results, summary: e.summary(o, r), wide });
}
