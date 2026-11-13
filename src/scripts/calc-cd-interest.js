// Fin Loom CD interest calculator: interest earned at maturity from the APY, and what an early
// withdrawal penalty measured in months of interest could cost.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { deposit: [1, 100000000], apy: [0, 20], term: [1, 120], penalty: [0, 60], early: [0, 120] };

  // APY already includes compounding, so the balance after t months is P × (1 + APY)^(t/12).
  const grown = (p, apy, months) => p * Math.pow(1 + apy / 100, months / 12);

  function cd(o) {
    const maturity = grown(o.deposit, o.apy, o.term);
    const interest = maturity - o.deposit;
    const rows = [];
    for (let m = 1; m <= o.term; m += 1) {
      if (m % 12 === 0 || m === o.term) rows.push({ month: m, balance: grown(o.deposit, o.apy, m), interest: grown(o.deposit, o.apy, m) - o.deposit });
    }
    // Early withdrawal: interest earned to that month, less a penalty equal to `penalty` months of
    // interest on the deposit. The result can dip below the deposit if the penalty exceeds interest earned.
    const early = o.early > 0 && o.early < o.term;
    const earnedEarly = early ? grown(o.deposit, o.apy, o.early) - o.deposit : 0;
    const penaltyCost = early ? grown(o.deposit, o.apy, o.penalty) - o.deposit : 0;
    const earlyNet = earnedEarly - penaltyCost;
    return { maturity, interest, rows, early, earnedEarly, penaltyCost, earlyNet, earlyBalance: o.deposit + earlyNet };
  }

  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;

  function summary(o, r) {
    const base = `A ${kit.money(o.deposit)} CD at ${kit.number(o.apy, 2)}% APY for ${o.term} months could earn about ${kit.money(r.interest)} in interest, for ${kit.money(r.maturity)} at maturity.`;
    if (!r.early) return base;
    return `${base} Withdrawing at month ${o.early} with a ${o.penalty}-month interest penalty would leave a net ${r.earlyNet < 0 ? 'loss' : 'gain'} of about ${kit.money(Math.abs(r.earlyNet))}.`;
  }

  function outputs(r) {
    return {
      big: kit.money(r.interest), maturity: kit.money(r.maturity),
      earnedEarly: r.early ? kit.money(r.earnedEarly) : 'Not withdrawing early',
      penaltyCost: r.early ? kit.money(r.penaltyCost) : kit.money(0),
      earlyNet: r.early ? signed(r.earlyNet) : kit.money(0),
      earlyBalance: r.early ? kit.money(r.earlyBalance) : 'Held to maturity'
    };
  }

  function tableRows(r) {
    return r.rows.map(row => `<tr><th scope="row">${row.month}</th><td class="num">${kit.money(row.interest)}</td><td class="num">${kit.money(row.balance)}</td></tr>`).join('');
  }

  function check(o) {
    return {
      deposit: kit.range(o.deposit, ...LIMITS.deposit), apy: kit.range(o.apy, ...LIMITS.apy),
      term: kit.range(o.term, ...LIMITS.term, { integer: true }), penalty: kit.range(o.penalty, ...LIMITS.penalty, { integer: true }),
      early: kit.range(o.early, ...LIMITS.early, { integer: true }) || (o.early >= o.term && o.early > 0 ? 'Enter a month before the end of the term, or 0.' : '')
    };
  }

  const engine = { LIMITS, grown, cd, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('cd-interest', box => {
    const form = box.querySelector('form');
    const f = name => form.elements[name];
    const opt = name => (f(name).value.trim() === '' ? 0 : kit.num(f(name)));
    const run = () => {
      const o = { deposit: kit.num(f('deposit')), apy: kit.num(f('apy')), term: kit.num(f('term')), penalty: opt('penalty'), early: opt('early') };
      const msg = check(o);
      if (!kit.errors(form, [[f('deposit'), msg.deposit], [f('apy'), msg.apy], [f('term'), msg.term], [f('penalty'), msg.penalty], [f('early'), msg.early]])) return;
      const r = cd(o);
      const values = outputs(r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
