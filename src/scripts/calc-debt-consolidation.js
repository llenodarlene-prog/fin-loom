// Fin Loom debt consolidation calculator. Compares paying off up to three debts at their current payments with one consolidation loan that includes any origination fee.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { b1: [0, 10000000], r1: [0, 40], p1: [0, 1000000], b2: [0, 10000000], r2: [0, 40], p2: [0, 1000000], b3: [0, 10000000], r3: [0, 40], p3: [0, 1000000], rate: [0, 40], years: [1, 10], fee: [0, 15] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return b <= 0 ? 0 : i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };
  const bal = (b, rate, n, k) => { const i = rate / 1200; const p = pmt(b, rate, n); return i === 0 ? b - p * k : b * Math.pow(1 + i, k) - p * (Math.pow(1 + i, k) - 1) / i; };
  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;
  function payoff(b, r, p) {
    if (b <= 0) return { months: 0, interest: 0, ok: true };
    const i = r / 1200; if (p <= b * i) return { months: Infinity, interest: Infinity, ok: false };
    let bl = b; let int = 0; let m = 0;
    while (bl > 0.005 && m < 1200) { const x = bl * i; int += x; bl = bl + x - p; m++; }
    return { months: m, interest: int, ok: true };
  }
  function calc(o) {
    const debts = [[o.b1, o.r1, o.p1], [o.b2, o.r2, o.p2], [o.b3, o.r3, o.p3]].map(d => payoff(...d));
    const balance = o.b1 + o.b2 + o.b3; const oldPay = o.p1 * (o.b1 > 0) + o.p2 * (o.b2 > 0) + o.p3 * (o.b3 > 0);
    const ok = debts.every(d => d.ok); const oldInterest = debts.reduce((s, d) => s + d.interest, 0); const oldMonths = Math.max(...debts.map(d => d.months));
    const loan = balance / (1 - o.fee / 100); const n = o.years * 12; const newPay = pmt(loan, o.rate, n);
    const newCost = newPay * n - balance;
    return { balance, oldPay, ok, oldInterest, oldMonths, loan, newPay, newCost, saved: oldInterest - newCost };
  }
  function summary(o, r) {
    if (!r.ok) return 'At least one payment does not cover that debt\'s monthly interest, so it would never be paid off. Raise that payment to compare.';
    return `Paying ${kit.money(r.balance)} of debt at current payments of ${kit.money(r.oldPay)} a month costs about ${kit.money(r.oldInterest)} in interest over ${r.oldMonths} months. A consolidation loan of ${kit.money(r.loan)} at ${kit.number(o.rate, 2)}% for ${o.years} years costs ${kit.money(r.newPay)} a month and ${kit.money(r.newCost)} in interest and fees, so consolidating ${r.saved >= 0 ? 'saves' : 'costs'} about ${kit.money(Math.abs(r.saved))}.`;
  }
  function outputs(o, r) {
    if (!r.ok) return { big: 'Payment too low', oldPay: kit.money(r.oldPay), newPay: kit.money(r.newPay), oldInterest: 'Never paid off', newCost: kit.money(r.newCost), oldMonths: 'Never', loan: kit.money(r.loan) };
    return { big: signed(r.saved), oldPay: kit.money(r.oldPay), newPay: kit.money(r.newPay), oldInterest: kit.money(r.oldInterest), newCost: kit.money(r.newCost), oldMonths: `${r.oldMonths} months`, loan: kit.money(r.loan) };
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: ["years"].includes(k) });
    if (!m.b1 && o.b1 + o.b2 + o.b3 <= 0) m.b1 = 'Enter at least one debt balance.';
    return m;
  }

  const engine = { LIMITS, pmt, bal, calc, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('debt-consolidation', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = calc(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
