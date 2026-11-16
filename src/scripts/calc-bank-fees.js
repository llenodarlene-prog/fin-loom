// Fin Loom bank fee comparison worksheet: yearly cost of two accounts from fees the user enters from
// each bank's fee schedule. Monthly fee applies unless the waiver is met; ATM, overdraft and wire fees
// scale with how often the user expects each event. Interest earned is netted against fees.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const KEYS = ['monthly', 'atm', 'overdraft', 'wire', 'other', 'apy'];
  const LIMITS = { monthly: [0, 1000], atm: [0, 100], overdraft: [0, 100], wire: [0, 200], other: [0, 10000], apy: [0, 20], atmUses: [0, 100], overdrafts: [0, 100], wires: [0, 100], balance: [0, 100000000] };

  function account(a, u) {
    const monthly = a.waived ? 0 : a.monthly * 12;
    const atm = a.atm * u.atmUses * 12; const overdraft = a.overdraft * u.overdrafts; const wire = a.wire * u.wires;
    const fees = monthly + atm + overdraft + wire + a.other;
    const interest = u.balance * a.apy / 100;
    return { monthly, atm, overdraft, wire, other: a.other, fees, interest, net: fees - interest };
  }

  function compare(o) {
    const a = account(o.a, o); const b = account(o.b, o);
    return { a, b, diff: a.net - b.net };
  }

  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;

  function summary(o, r) {
    const cheaper = r.diff > 0 ? 'Account B' : r.diff < 0 ? 'Account A' : null;
    return `Based on your usage, Account A costs a net ${signed(r.a.net)} a year and Account B costs ${signed(r.b.net)}, after interest. ${cheaper ? `${cheaper} costs about ${kit.money(Math.abs(r.diff))} less a year.` : 'They cost the same.'}`;
  }

  function outputs(o, r) {
    return { big: r.diff === 0 ? 'Same cost' : r.diff > 0 ? 'Account B' : 'Account A', diff: kit.money(Math.abs(r.diff)), aNet: signed(r.a.net), bNet: signed(r.b.net) };
  }

  function tableRows(r) {
    const line = (label, k) => `<tr><th scope="row">${label}</th><td class="num">${kit.money(r.a[k])}</td><td class="num">${kit.money(r.b[k])}</td></tr>`;
    return line('Monthly maintenance fees', 'monthly') + line('Out-of-network ATM fees', 'atm') + line('Overdraft fees', 'overdraft') + line('Wire fees', 'wire') + line('Other yearly fees', 'other') + line('Total fees', 'fees') + line('Interest earned', 'interest') + `<tr><th scope="row">Net yearly cost</th><td class="num">${signed(r.a.net)}</td><td class="num">${signed(r.b.net)}</td></tr>`;
  }

  function check(o) {
    const m = {};
    for (const s of ['a', 'b']) for (const k of KEYS) m[`${s}${k}`] = kit.range(o[s][k], ...LIMITS[k]);
    for (const k of ['atmUses', 'overdrafts', 'wires', 'balance']) m[k] = kit.range(o[k], ...LIMITS[k]);
    return m;
  }

  const engine = { KEYS, LIMITS, account, compare, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('bank-fees', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const opt = n => (f(n).value.trim() === '' ? 0 : kit.num(f(n)));
    const run = () => {
      const o = { a: { waived: f('awaived').checked }, b: { waived: f('bwaived').checked } };
      for (const s of ['a', 'b']) for (const k of KEYS) o[s][k] = opt(`${s}${k}`);
      for (const k of ['atmUses', 'overdrafts', 'wires', 'balance']) o[k] = opt(k);
      const msg = check(o);
      if (!kit.errors(form, Object.keys(msg).map(k => [f(k), msg[k]]))) return;
      const r = compare(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
