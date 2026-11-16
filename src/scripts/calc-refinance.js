// Fin Loom mortgage refinance calculator. Compares the current loan's remaining principal-and-interest
// payments with a new loan for the same balance (plus any closing costs rolled in). Break-even months
// = upfront closing costs ÷ monthly payment savings.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { balance: [1000, 100000000], rate: [0, 20], remaining: [1, 40], newRate: [0, 20], term: [1, 40], costs: [0, 1000000] };
  const pmt = (b, rate, years) => { const i = rate / 1200; const n = years * 12; return i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };

  function refi(o) {
    const oldPay = pmt(o.balance, o.rate, o.remaining);
    const principal = o.balance + (o.roll ? o.costs : 0);
    const newPay = pmt(principal, o.newRate, o.term);
    const savings = oldPay - newPay;
    const upfront = o.roll ? 0 : o.costs;
    const oldTotal = oldPay * o.remaining * 12; const newTotal = newPay * o.term * 12 + upfront;
    return { oldPay, newPay, savings, upfront, breakEven: savings > 0 && upfront > 0 ? upfront / savings : savings > 0 ? 0 : null, oldInterest: oldTotal - o.balance, newInterest: newPay * o.term * 12 - principal, lifetime: oldTotal - newTotal };
  }

  function summary(o, r) {
    const base = `Refinancing ${kit.money(o.balance)} from ${kit.number(o.rate, 3)}% to ${kit.number(o.newRate, 3)}% over ${o.term} years changes the principal and interest payment from ${kit.money(r.oldPay)} to ${kit.money(r.newPay)}.`;
    if (r.breakEven === null) return `${base} The payment does not fall, so there is no monthly break-even.`;
    const be = r.upfront > 0 ? ` Upfront costs of ${kit.money(r.upfront)} are recovered in about ${Math.ceil(r.breakEven)} months.` : ' Closing costs are rolled into the loan, so there is no upfront cost to recover.';
    return `${base}${be} Over the full terms, total payments ${r.lifetime >= 0 ? 'fall' : 'rise'} by about ${kit.money(Math.abs(r.lifetime))}.`;
  }

  function outputs(o, r) {
    return { big: r.breakEven === null ? 'No break-even' : r.breakEven === 0 ? 'Immediate' : `${Math.ceil(r.breakEven)} months`, oldPay: kit.money(r.oldPay), newPay: kit.money(r.newPay), savings: `${r.savings < 0 ? '−' : ''}${kit.money(Math.abs(r.savings))}`, oldInterest: kit.money(r.oldInterest), newInterest: kit.money(r.newInterest), lifetime: `${r.lifetime < 0 ? '−' : ''}${kit.money(Math.abs(r.lifetime))}` };
  }

  function check(o) { const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: k === 'remaining' || k === 'term' }); return m; }

  const engine = { LIMITS, pmt, refi, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('refinance', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = { roll: f('roll').checked }; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = refi(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
