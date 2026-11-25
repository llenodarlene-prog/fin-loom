// Business Valuation Calculator markup.
export default function render(e, ui) {
  const o = {"earnings": 250000, "multiple": 3, "ret": 20, "growth": 3, "cash": 50000, "debt": 100000};
  const r = e.calc(o); const v = e.outputs(o, r);
  const form = `${ui.field('bux-earnings', 'Yearly earnings ($)', 'min="1" max="10000000000" step="0.01" value="250000" required', "Use the earnings measure your multiple is based on, such as SDE or EBITDA.")}
${ui.field('bux-multiple', 'Earnings multiple', 'min="0.5" max="50" step="0.05" value="3" required', "Multiples vary widely by industry, size and risk.")}
${ui.field('bux-ret', 'Required return (%)', 'min="1" max="50" step="0.1" value="20" required', "The yearly return a buyer would want for the risk.")}
${ui.field('bux-growth', 'Long-term earnings growth (%)', 'min="-10" max="20" step="0.1" value="3"')}
${ui.field('bux-cash', 'Cash and equivalents ($)', 'min="0" max="10000000000" step="0.01" value="50000"')}
${ui.field('bux-debt', 'Debt ($)', 'min="0" max="10000000000" step="0.01" value="100000"')}`;
  const results = `${ui.row('Equity value by multiple (plus cash, minus debt)', 'eqMultiple', v.eqMultiple)}${ui.row('Value by capitalized earnings', 'byCap', v.byCap)}${ui.row('Equity value by capitalized earnings', 'eqCap', v.eqCap)}${ui.row('Implied multiple', 'implied', v.implied)}`;
  const wide = `${ui.assumptions(["Earnings multiple value = yearly earnings \u00d7 multiple.", "Capitalized earnings value = next year\u2019s earnings \u00f7 (required return \u2212 growth), which assumes steady growth forever.", "Equity value adds cash and subtracts debt. Working capital, owner adjustments and market conditions are not modeled.", "This is a planning estimate, not a formal appraisal or fairness opinion."])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'business-valuation', title: 'Business Valuation Calculator', legend: 'Your Business', form, label: 'Value by earnings multiple', big: v.big, results, summary: e.summary(o, r), wide });
}
