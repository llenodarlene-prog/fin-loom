// Credit card comparison worksheet markup.
export default function render(e, ui) {
  const d = [['No-fee cash back', 0, 24, 1.5, 200], ['Premium rewards', 95, 22, 2, 250], ['', 0, 0, 0, 0]];
  const o = { cards: d.map(([name, fee, apr, rewards, bonus]) => ({ name: name || 'Card', fee, apr, rewards, bonus })), spend: 1500, carry: 0 };
  const r = e.compare(o); const v = e.outputs(o, r);
  const c = (i, [name, fee, apr, rewards, bonus]) => `<p class="finloom-calc-hint"><strong>Card ${i}</strong></p><div class="finloom-calc-field"><label for="cc-name${i}">Name</label><input id="cc-name${i}" name="name${i}" type="text" maxlength="30" value="${ui.esc(name)}"></div><div class="finloom-calc-pair">${ui.field(`cc-fee${i}`, 'Annual fee ($)', `min="0" max="10000" step="1"${name ? ` value="${fee}"` : ''}`)}${ui.field(`cc-apr${i}`, 'Purchase APR (%)', `min="0" max="60" step="0.01"${name ? ` value="${apr}"` : ''}`)}</div><div class="finloom-calc-pair">${ui.field(`cc-rewards${i}`, 'Rewards rate (%)', `min="0" max="20" step="0.1"${name ? ` value="${rewards}"` : ''}`)}${ui.field(`cc-bonus${i}`, 'Sign-up bonus value ($)', `min="0" max="10000" step="1"${name ? ` value="${bonus}"` : ''}`)}</div>`;
  const form = `${d.slice(0, 2).map((x, i) => c(i + 1, x)).join('')}
${ui.advanced(c(3, d[2]))}
${ui.field('cc-spend', 'Monthly spending on the card ($)', 'min="0" max="1000000" step="1" value="1500" required')}
${ui.field('cc-carry', 'Average balance carried month to month ($)', 'min="0" max="1000000" step="1" value="0"', 'Use 0 if you pay in full every month.')}`;
  const results = `${ui.row('Best first-year value', 'best1', v.best1)}${ui.row('Best value in later years', 'best2', v.best2)}`;
  const wide = `${ui.table('Estimated Yearly Value by Card', ['Card', 'Rewards', 'Annual Fee', 'Interest', 'Year 1 Value', 'Later Years'], e.tableRows(r))}
${ui.assumptions(['Yearly value = monthly spending × 12 × rewards rate + sign-up bonus (first year) − annual fee − average carried balance × APR.', 'Rewards are treated as a flat rate worth face value. Category bonuses, caps and point valuations vary by card.', 'Enter terms from each card\'s official disclosures. This worksheet does not rate or recommend cards.', 'Carrying a balance usually costs more in interest than rewards earn.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'card-compare', title: 'Credit Card Comparison Worksheet', legend: 'Cards to Compare', form, label: 'Highest first-year value', big: v.big, results, summary: e.summary(o, r), wide });
}
