// CD interest calculator markup: deposit, APY and term, with an optional early withdrawal penalty.
export default function render(e, ui) {
  const o = { deposit: 10000, apy: 4, term: 12, penalty: 3, early: 0 };
  const r = e.cd(o);
  const v = e.outputs(r);
  const form = `${ui.field('cd-deposit', 'Deposit ($)', 'min="1" max="100000000" step="0.01" value="10000" required')}
${ui.field('cd-apy', 'APY (%)', 'min="0" max="20" step="0.01" value="4" required', 'The annual percentage yield quoted by the bank or credit union.')}
${ui.field('cd-term', 'Term (months)', 'min="1" max="120" step="1" value="12" required')}
${ui.advanced(`${ui.field('cd-penalty', 'Early withdrawal penalty (months of interest)', 'min="0" max="60" step="1" value="3"', 'Check your CD agreement. Penalties vary by bank and term.')}
${ui.field('cd-early', 'Withdraw early at month', 'min="0" max="120" step="1" value="0"', 'Use 0 to hold the CD to maturity.')}`)}`;
  const results = `${ui.row('Balance at maturity', 'maturity', v.maturity)}${ui.row('Interest earned before early withdrawal', 'earnedEarly', v.earnedEarly)}${ui.row('Early withdrawal penalty', 'penaltyCost', v.penaltyCost)}${ui.row('Net interest after penalty', 'earlyNet', v.earlyNet)}${ui.row('Amount received if withdrawn early', 'earlyBalance', v.earlyBalance)}`;
  const wide = `${ui.table('Interest Over the Term', ['Month', 'Interest Earned to Date', 'Balance'], e.tableRows(r))}
${ui.assumptions(['The APY already reflects compounding, so the balance after t months is deposit × (1 + APY)^(t ÷ 12).', 'The rate is fixed for the whole term and interest stays in the CD.', 'The early withdrawal penalty is modeled as a set number of months of interest on the deposit. Some banks calculate it differently, so check your agreement.', 'Taxes on interest are not included. CDs at insured banks and credit unions are covered by the FDIC or NCUA up to $250,000 per owner, per institution, per ownership category.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'cd-interest', title: 'CD Interest Calculator', legend: 'Your CD', form, label: 'Interest earned at maturity', big: v.big, results, summary: e.summary(o, r), wide });
}
