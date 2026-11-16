// Fin Loom balance transfer calculator. Compares keeping a card balance at its current APR with moving
// it to a card charging a transfer fee (added to the balance), a promotional APR for a set number of
// months and a go-to APR afterward. Both use the same fixed monthly payment and no new charges.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { balance: [1, 10000000], apr: [0, 60], payment: [1, 1000000], fee: [0, 10], promo: [0, 30], months: [0, 60], goto: [0, 60] };
  const CAP = 600;

  function simulate(start, payment, rateFor) {
    let bal = start; let m = 0; let interest = 0; let atPromoEnd = null;
    while (bal > 0.005 && m < CAP) {
      const i = bal * rateFor(m) / 1200;
      if (payment <= i + 1e-9) return { months: m, interest, done: false, never: true, atPromoEnd };
      bal = bal + i - Math.min(payment, bal + i); interest += i; m += 1;
      if (rateFor.promoMonths !== undefined && m === rateFor.promoMonths) atPromoEnd = Math.max(0, bal);
    }
    return { months: m, interest, done: bal <= 0.005, never: false, atPromoEnd: atPromoEnd === null ? 0 : atPromoEnd };
  }

  function compare(o) {
    const stay = simulate(o.balance, o.payment, () => o.apr);
    const fee = o.balance * o.fee / 100;
    const rate = m => (m < o.months ? o.promo : o.goto); rate.promoMonths = o.months;
    const move = simulate(o.balance + fee, o.payment, rate);
    const clearInPromo = o.months > 0 ? (o.promo === 0 ? (o.balance + fee) / o.months : (o.balance + fee) * (o.promo / 1200) / (1 - Math.pow(1 + o.promo / 1200, -o.months))) : null;
    return { stay, move, fee, stayCost: stay.interest, moveCost: move.interest + fee, savings: stay.interest - (move.interest + fee), clearInPromo };
  }

  const span = m => { const y = Math.floor(m / 12); const r = m % 12; return [y ? `${y} year${y === 1 ? '' : 's'}` : '', r ? `${r} month${r === 1 ? '' : 's'}` : ''].filter(Boolean).join(', ') || '0 months'; };

  function summary(o, r) {
    if (r.stay.never || r.move.never) return 'At this payment the interest is not covered, so the balance would not fall. Increase the monthly payment.';
    const word = r.savings >= 0 ? `save about ${kit.money(r.savings)}` : `cost about ${kit.money(-r.savings)} more`;
    return `Moving ${kit.money(o.balance)} with a ${kit.number(o.fee, 1)}% fee (${kit.money(r.fee)}) and ${kit.number(o.promo, 2)}% for ${o.months} months would ${word} in interest and fees compared with staying at ${kit.number(o.apr, 2)}%, paying ${kit.money(o.payment)} a month. To clear it before the promotion ends, you would need about ${kit.money(r.clearInPromo || 0)} a month.`;
  }

  function outputs(o, r) {
    const ok = !r.stay.never && !r.move.never;
    return { big: ok ? `${r.savings < 0 ? '−' : ''}${kit.money(Math.abs(r.savings))}` : 'Not available', fee: kit.money(r.fee), stayCost: ok ? kit.money(r.stayCost) : 'Not paid off', moveCost: ok ? kit.money(r.moveCost) : 'Not paid off', stayTime: ok ? span(r.stay.months) : 'Not paid off', moveTime: ok ? span(r.move.months) : 'Not paid off', left: ok ? kit.money(r.move.atPromoEnd) : 'Not available', clear: r.clearInPromo ? kit.money(r.clearInPromo) : 'No promotion' };
  }

  function check(o) { const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: k === 'months' }); return m; }

  const engine = { LIMITS, simulate, compare, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('balance-transfer', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = compare(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
