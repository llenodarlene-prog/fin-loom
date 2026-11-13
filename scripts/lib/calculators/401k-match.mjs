// 401(k) employer match calculator markup: salary, your contribution rate, the match formula and age.
export default function render(e, ui) {
  const o = { salary: 75000, contrib: 4, match: 50, cap: 6, over50: false };
  const r = e.match(o);
  const v = e.outputs(r);
  const form = `${ui.field('km-salary', 'Annual salary ($)', 'min="1" max="10000000" step="1" value="75000" required')}
${ui.field('km-contrib', 'Your contribution (% of salary)', 'min="0" max="100" step="0.5" value="4" required')}
${ui.field('km-match', 'Employer match rate (%)', 'min="0" max="200" step="1" value="50" required', 'For example, 50 means the employer adds 50 cents per dollar you contribute.')}
${ui.field('km-cap', 'Match applies up to (% of salary)', 'min="0" max="100" step="0.5" value="6" required', 'For example, 6 means only contributions up to 6% of salary are matched.')}
${ui.radios('age', 'Your age in 2026', [['under', 'Under 50'], ['50', '50 or older']], 'under')}`;
  const results = `${ui.row('Your contribution this year', 'yours', v.yours)}${ui.row('Total going into the plan', 'total', v.total)}${ui.row('Maximum match available', 'fullMatch', v.fullMatch)}${ui.row('Match left unclaimed', 'missed', v.missed)}${ui.row('Your 2026 contribution limit', 'limit', v.limit)}${ui.row('Total per paycheck (26 pay periods)', 'perPaycheck', v.perPaycheck)}`;
  const wide = `${ui.table('How the Match Is Calculated', ['Step', 'Amount'], e.tableRows(o, r))}
${ui.assumptions(['Your contribution is capped at the 2026 elective deferral limit of $24,500, plus the $8,000 catch-up if you are 50 or older, as announced by the IRS.', 'The match equals the match rate times your contributions, counting only contributions up to the cap percentage of salary.', 'Many plans use different formulas, such as tiered matches, vesting schedules or a true-up at year end. Check your plan documents.', 'The higher catch-up for ages 60 to 63, overall annual addition limits, investment growth and taxes are not modeled.'])}
${ui.disclaimer(true)}`;
  return ui.layout({ type: '401k-match', title: '401(k) Employer Match Calculator', legend: 'Your Plan', form, label: 'Employer match this year', big: v.big, results, summary: e.summary(o, r), wide });
}
