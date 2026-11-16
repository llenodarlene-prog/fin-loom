// RMD calculator markup.
export default function render(e, ui) {
  const o = { balance: 500000, age: 73, ret: 5, years: 10 };
  const r = e.rmd(o); const v = e.outputs(o, r);
  const form = `${ui.field('rmd-balance', 'Account balance on December 31 of last year ($)', 'min="0" max="1000000000" step="0.01" value="500000" required')}
${ui.field('rmd-age', 'Your age at the end of this year', 'min="72" max="120" step="1" value="73" required')}
${ui.advanced(`${ui.field('rmd-ret', 'Assumed annual return for the projection (%)', 'min="-10" max="15" step="0.1" value="5"')}
${ui.field('rmd-years', 'Years to project', 'min="1" max="30" step="1" value="10"')}`)}`;
  const results = `${ui.row('Distribution period', 'period', v.period)}${ui.row('Share of balance to withdraw', 'pct', v.pct)}${ui.row('Monthly equivalent', 'monthly', v.monthly)}${ui.row('Total RMDs over the projection', 'total', v.total)}`;
  const wide = `${ui.table('Projected RMDs', ['Age', 'Prior Year-End Balance', 'Distribution Period', 'RMD'], e.tableRows(r))}
${ui.assumptions(['RMD = prior December 31 balance ÷ distribution period from IRS Publication 590-B, Appendix B, Table III (Uniform Lifetime).', 'The Uniform Lifetime Table applies to unmarried owners and to married owners whose spouse is not more than 10 years younger or is not the sole beneficiary. A different table applies otherwise.', 'Future balances grow at the steady return you enter after each year\'s RMD is taken. Real returns vary.', 'Inherited accounts and Roth IRAs follow different rules. Taxes are not included.'])}
${ui.disclaimer(true)}`;
  return ui.layout({ type: 'rmd', title: 'RMD Calculator', legend: 'Your Account', form, label: 'Required minimum distribution', big: v.big, results, summary: e.summary(o, r), wide });
}
