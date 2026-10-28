// Capital gains tax calculator markup: filing status, income, sale details, holding period, optional
// qualified dividends and fees, the tax on the gain, and a rate-band breakdown. Tax year 2026.
export default function render(e, ui) {
  const o = { status: 'single', income: 60000, basis: 10000, proceeds: 25000, fees: 0, dividends: 0, holding: 'long' };
  const r = e.estimate(o);
  const v = e.outputs(o, r);
  const statuses = Object.entries(e.STATUSES);
  const form = `<p class="finloom-calc-tax-year"><strong>Tax year ${e.YEAR}</strong> federal rates (Rev. Proc. 2025-32).</p>
${ui.select('cg-status', 'Filing status', statuses, o.status)}
${ui.field('cg-income', 'Taxable ordinary income before the gain ($)', 'min="0" max="1000000000" step="1" value="60000" required', 'Taxable income after deductions, not counting this gain or qualified dividends.')}
${ui.field('cg-basis', 'Cost basis ($)', 'min="0" max="1000000000" step="0.01" value="10000" required', 'What you paid, including purchase commissions.')}
${ui.field('cg-proceeds', 'Sale proceeds ($)', 'min="0" max="1000000000" step="0.01" value="25000" required')}
${ui.radios('holding', 'Holding period', [['long', 'More than one year (long-term)'], ['short', 'One year or less (short-term)']], 'long')}
${ui.advanced(`${ui.field('cg-fees', 'Selling fees and adjustments ($)', 'min="0" max="100000000" step="0.01" value="0"')}
${ui.field('cg-dividends', 'Qualified dividends this year ($)', 'min="0" max="1000000000" step="0.01" value="0"', 'Qualified dividends share the 0%, 15%, and 20% bands with long-term gains and are stacked first.')}`)}`;
  const results = `${ui.row('Taxable gain', 'gain', v.gain)}${ui.row('Effective tax rate on the gain', 'effective', v.effective)}${ui.row('After-tax proceeds', 'afterTax', v.afterTax)}${ui.row('Holding period', 'term', v.term)}${ui.row('Federal income tax without the sale', 'before', v.before)}${ui.row('Federal income tax with the sale', 'after', v.after)}`;
  const wide = `<h3 class="finloom-calc-subtitle">How the Gain Is Taxed</h3>
${ui.table('Gain by Tax Rate Band', ['Rate Band', 'Portion of Gain', 'Tax'], e.tableRows(r))}
<p class="finloom-calc-note">${e.YEAR} thresholds for long-term gains and qualified dividends: 0% up to ${statuses.map(([key, name]) => `${ui.esc(name)} $${e.TAX_RULES[e.YEAR][key].capital[0].toLocaleString('en-US')}`).join(', ')}; 20% above ${statuses.map(([key, name]) => `${ui.esc(name)} $${e.TAX_RULES[e.YEAR][key].capital[1].toLocaleString('en-US')}`).join(', ')} of taxable income. Source: IRS Rev. Proc. 2025-32.</p>
${ui.assumptions(['Uses 2026 federal income tax brackets and capital gains thresholds from IRS Rev. Proc. 2025-32.', 'Long-term gains and qualified dividends are stacked on top of ordinary taxable income; short-term gains are taxed as ordinary income.', 'State and local income taxes are excluded.', 'The 3.8% Net Investment Income Tax may apply above $200,000 (single or head of household), $250,000 (married filing jointly), or $125,000 (married filing separately) of modified adjusted gross income; it is not included.', 'Special 25% (unrecaptured section 1250) and 28% (collectibles and qualified small business stock) gain categories are excluded.', 'Capital loss limits, carryovers, and other gains or losses for the year are not modeled.'])}
${ui.disclaimer(true)}`;
  return ui.layout({ type: 'capital-gains', title: 'Capital Gains Tax Calculator', legend: 'Your Sale', form, label: 'Estimated federal tax on the gain', big: v.big, results, summary: e.summary(o, r), wide });
}
