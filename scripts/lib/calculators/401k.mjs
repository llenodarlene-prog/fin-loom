// 401k Calculator markup.
export default function render(e, ui) {
  const o = {"age": 30, "retire": 65, "salary": 70000, "balance": 20000, "contrib": 8, "match": 50, "matchLimit": 6, "ret": 6, "raise": 3};
  const r = e.calc(o); const v = e.outputs(o, r);
  const form = `${ui.field('40x-age', 'Current age', 'min="16" max="80" step="1" value="30" required')}
${ui.field('40x-retire', 'Retirement age', 'min="30" max="85" step="1" value="65" required')}
${ui.field('40x-salary', 'Annual salary ($)', 'min="1000" max="10000000" step="0.01" value="70000" required')}
${ui.field('40x-balance', 'Current 401(k) balance ($)', 'min="0" max="100000000" step="0.01" value="20000"')}
${ui.field('40x-contrib', 'Your contribution (% of salary)', 'min="0" max="100" step="0.1" value="8" required')}
${ui.field('40x-match', 'Employer match (% of your contribution)', 'min="0" max="200" step="1" value="50"', "For example, 50 means 50 cents per dollar you contribute.")}
${ui.field('40x-matchLimit', 'Match applies up to (% of salary)', 'min="0" max="100" step="0.1" value="6"')}
${ui.field('40x-raise', 'Yearly salary increase (%)', 'min="0" max="20" step="0.1" value="3"')}
${ui.field('40x-ret', 'Yearly investment return (%)', 'min="0" max="20" step="0.1" value="6"', "An assumption, not a forecast.")}`;
  const results = `${ui.row('Your contributions', 'mine', v.mine)}${ui.row('Employer contributions', 'theirs', v.theirs)}${ui.row('Investment growth', 'growth', v.growth)}${ui.row('Years until retirement', 'years', v.years)}`;
  const wide = `${ui.table('401(k) Balance by Age', ["Age", "Your Contributions", "Employer Contributions", "Balance"], e.tableRows(o, r))}
${ui.assumptions(["Contributions and the match are added monthly. The return is steady and compounded monthly.", "IRS contribution limits, catch-up contributions, vesting schedules, fees and taxes are not applied. Check your plan and the current IRS limits.", "Results are in future dollars and do not adjust for inflation."])}
${ui.disclaimer()}`;
  return ui.layout({ type: '401k', title: '401k Calculator', legend: 'Your Plan', form, label: 'Estimated balance at retirement', big: v.big, results, summary: e.summary(o, r), wide });
}
