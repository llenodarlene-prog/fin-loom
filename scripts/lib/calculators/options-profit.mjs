// Options profit calculator markup.
export default function render(e, ui) {
  const o = { kind: 'call', strike: 100, premium: 4, contracts: 1, price: 110, fees: 1 };
  const r = e.calc(o); const v = e.outputs(o, r);
  const form = `${ui.select('op-kind', 'Option type (buying)', [['call', 'Call'], ['put', 'Put']], 'call')}
${ui.field('op-strike', 'Strike price ($)', 'min="0.01" max="1000000" step="0.01" value="100" required')}
${ui.field('op-premium', 'Premium paid per share ($)', 'min="0" max="1000000" step="0.01" value="4" required', 'The quoted option price. One contract usually covers 100 shares.')}
${ui.field('op-contracts', 'Number of contracts', 'min="1" max="100000" step="1" value="1" required')}
${ui.field('op-price', 'Stock price at expiration ($)', 'min="0" max="1000000" step="0.01" value="110" required')}
${ui.field('op-fees', 'Total commissions and fees ($)', 'min="0" max="100000" step="0.01" value="1"')}`;
  const results = `${ui.row('Total cost of the options', 'cost', v.cost)}${ui.row('Value at expiration', 'payoff', v.payoff)}${ui.row('Return on cost', 'roi', v.roi)}${ui.row('Break-even stock price', 'breakeven', v.breakeven)}${ui.row('Maximum loss', 'maxLoss', v.maxLoss)}${ui.row('Maximum gain', 'maxGain', v.maxGain)}`;
  const wide = `${ui.table('Profit or Loss at Expiration by Stock Price', ['Stock Price', 'Option Value', 'Profit or Loss'], e.tableRows(o))}
${ui.assumptions(['The option is bought and held to expiration. Value then = stock price − strike for a call, or strike − stock price for a put, and never below zero.', 'One contract covers 100 shares. Profit = (value − premium) × shares − fees.', 'Selling before expiration, early exercise, dividends, taxes and assignment are not modeled. Before expiration, option prices also depend on time and volatility.', 'Options carry a high risk of loss, and a bought option can expire worthless.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'options-profit', title: 'Options Profit Calculator', legend: 'Your Option Trade', form, label: 'Profit or loss at expiration', big: v.big, results, summary: e.summary(o, r), wide });
}
