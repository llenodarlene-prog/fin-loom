// Fin Loom mortgage recast calculator. A recast applies a lump-sum principal payment and re-amortizes
// the lower balance over the same remaining term at the same rate, so the monthly payment falls.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { balance: [1000, 100000000], rate: [0, 20], remaining: [1, 40], lump: [0, 100000000], fee: [0, 100000] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return b <= 0 ? 0 : i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };

  function recast(o) {
    const n = Math.round(o.remaining * 12);
    const newBalance = o.balance - o.lump;
    const oldPay = pmt(o.balance, o.rate, n); const newPay = pmt(newBalance, o.rate, n);
    const oldInterest = oldPay * n - o.balance; const newInterest = newPay * n - newBalance;
    const savings = oldPay - newPay; const saved = oldInterest - newInterest;
    return { n, newBalance, oldPay, newPay, savings, oldInterest, newInterest, saved, net: saved - o.fee, feeMonths: savings > 0 && o.fee > 0 ? o.fee / savings : null };
  }

  function summary(o, r) {
    return `Paying ${kit.money(o.lump)} toward a ${kit.money(o.balance)} balance at ${kit.number(o.rate, 3)}% and recasting over the remaining ${kit.number(o.remaining, 1)} years lowers the principal and interest payment from ${kit.money(r.oldPay)} to ${kit.money(r.newPay)}, saving ${kit.money(r.savings)} a month. Interest over the rest of the loan falls by about ${kit.money(r.saved)}, or ${kit.money(r.net)} after a ${kit.money(o.fee)} recast fee.`;
  }

  function outputs(o, r) {
    return { big: kit.money(r.newPay), oldPay: kit.money(r.oldPay), savings: kit.money(r.savings), newBalance: kit.money(r.newBalance), saved: kit.money(r.saved), net: `${r.net < 0 ? '−' : ''}${kit.money(Math.abs(r.net))}`, feeMonths: r.feeMonths === null ? 'No fee to recover' : `${Math.ceil(r.feeMonths)} months` };
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k]);
    if (!m.lump && !m.balance && o.lump >= o.balance) m.lump = 'The lump sum must be less than the loan balance.';
    return m;
  }

  const engine = { LIMITS, pmt, recast, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('mortgage-recast', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = recast(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
