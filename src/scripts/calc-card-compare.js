// Fin Loom credit card comparison worksheet: up to three cards compared on estimated yearly value =
// rewards on your spending + sign-up bonus (first year only) − annual fee − interest on any balance
// carried (average balance × APR). All card terms are entered by the user from each card's disclosures.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const SLOTS = 3;
  const LIMITS = { fee: [0, 10000], apr: [0, 60], rewards: [0, 20], bonus: [0, 10000], spend: [0, 1000000], carry: [0, 1000000] };

  function card(c, o) {
    const rewards = o.spend * 12 * c.rewards / 100;
    const interest = o.carry * c.apr / 100;
    const ongoing = rewards - c.fee - interest;
    return { ...c, rewards: rewards, interest, year1: ongoing + c.bonus, ongoing };
  }

  function compare(o) {
    const cards = o.cards.map((c, i) => ({ ...c, n: i + 1 })).filter(c => c.fee || c.apr || c.rewards || c.bonus).map(c => card(c, o));
    const best1 = cards.reduce((m, c) => (!m || c.year1 > m.year1 ? c : m), null);
    const best2 = cards.reduce((m, c) => (!m || c.ongoing > m.ongoing ? c : m), null);
    return { cards, best1, best2 };
  }

  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;

  function summary(o, r) {
    if (!r.cards.length) return 'Enter the terms for at least one card.';
    const interestNote = o.carry > 0 ? ' Carrying a balance means interest can outweigh rewards, so compare APRs closely.' : '';
    return `On ${kit.money(o.spend)} of monthly spending, ${r.best1.name} has the highest estimated first-year value at ${signed(r.best1.year1)}, and ${r.best2.name} leads in later years at ${signed(r.best2.ongoing)} a year.${interestNote}`;
  }

  function outputs(o, r) {
    return { big: r.best1 ? r.best1.name : 'None', best1: r.best1 ? signed(r.best1.year1) : '—', best2: r.best2 ? `${r.best2.name}: ${signed(r.best2.ongoing)}` : '—' };
  }

  function tableRows(r) {
    return r.cards.map(c => `<tr><th scope="row">${c.name}</th><td class="num">${kit.money(c.rewards)}</td><td class="num">${kit.money(c.fee)}</td><td class="num">${kit.money(c.interest)}</td><td class="num">${signed(c.year1)}</td><td class="num">${signed(c.ongoing)}</td></tr>`).join('');
  }

  function check(o) {
    const m = { spend: kit.range(o.spend, ...LIMITS.spend), carry: kit.range(o.carry, ...LIMITS.carry) };
    o.cards.forEach((c, i) => { for (const k of ['fee', 'apr', 'rewards', 'bonus']) m[`${k}${i + 1}`] = kit.range(c[k], ...LIMITS[k]); });
    return m;
  }

  const engine = { SLOTS, LIMITS, card, compare, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  const clean = s => String(s || '').replace(/[<>&"]/g, '').slice(0, 30);
  kit.register('card-compare', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const opt = n => (f(n).value.trim() === '' ? 0 : kit.num(f(n)));
    const run = () => {
      const cards = [];
      for (let i = 1; i <= SLOTS; i += 1) cards.push({ name: clean(f(`name${i}`).value) || `Card ${i}`, fee: opt(`fee${i}`), apr: opt(`apr${i}`), rewards: opt(`rewards${i}`), bonus: opt(`bonus${i}`) });
      const o = { cards, spend: opt('spend'), carry: opt('carry') };
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
