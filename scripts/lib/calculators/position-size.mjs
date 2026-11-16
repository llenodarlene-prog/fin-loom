// Position size calculator markup.
export default function render(e, ui) {
  const o = { account: 25000, risk: 1, entry: 50, stop: 47.5, target: 57.5 };
  const r = e.size(o); const v = e.outputs(o, r);
  const form = `${ui.field('ps-account', 'Account size ($)', 'min="1" max="1000000000" step="0.01" value="25000" required')}
${ui.field('ps-risk', 'Risk per trade (% of account)', 'min="0.01" max="100" step="0.01" value="1" required')}
${ui.field('ps-entry', 'Entry price ($)', 'min="0.0001" max="1000000" step="0.0001" value="50" required')}
${ui.field('ps-stop', 'Stop-loss price ($)', 'min="0.0001" max="1000000" step="0.0001" value="47.5" required', 'Below the entry for a long trade, above it for a short.')}
${ui.field('ps-target', 'Profit target ($, optional)', 'min="0" max="1000000" step="0.0001" value="57.5"')}`;
  const results = `${ui.row('Dollar amount at risk', 'dollarRisk', v.dollarRisk)}${ui.row('Risk per share', 'perShare', v.perShare)}${ui.row('Actual risk with whole shares', 'actualRisk', v.actualRisk)}${ui.row('Position value', 'value', v.value)}${ui.row('Share of account', 'share', v.share)}${ui.row('Reward-to-risk ratio', 'rr', v.rr)}${ui.row('Profit at target', 'profit', v.profit)}`;
  const wide = `${ui.assumptions(['Shares = (account × risk %) ÷ |entry − stop|, rounded down to whole shares.', 'A stop can be skipped in a fast market or a price gap, so the real loss can exceed the planned risk.', 'Commissions, spreads, margin and taxes are not included.', 'This tool sizes a trade from your inputs. It does not suggest what or when to buy or sell.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'position-size', title: 'Position Size Calculator', legend: 'Your Trade Plan', form, label: 'Position size', big: v.big, results, summary: e.summary(o, r), wide });
}
