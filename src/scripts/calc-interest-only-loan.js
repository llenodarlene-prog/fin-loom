// Fin Loom interest-only loan calculator. During the interest-only period the payment is balance × rate ÷ 12. The loan then amortizes over the remaining term.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { amount: [1000, 100000000], rate: [0, 30], ioYears: [1, 15], years: [2, 40] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return b <= 0 ? 0 : i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };
  const bal = (b, rate, n, k) => { const i = rate / 1200; const p = pmt(b, rate, n); return i === 0 ? b - p * k : b * Math.pow(1 + i, k) - p * (Math.pow(1 + i, k) - 1) / i; };
  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;
  function calc(o) {
    const ioPay = o.amount * o.rate / 1200; const rest = (o.years - o.ioYears) * 12;
    const amPay = pmt(o.amount, o.rate, rest); const full = pmt(o.amount, o.rate, o.years * 12);
    const interest = ioPay * o.ioYears * 12 + amPay * rest - o.amount; const fullInterest = full * o.years * 12 - o.amount;
    return { ioPay, amPay, jump: amPay - ioPay, full, interest, fullInterest, extra: interest - fullInterest };
  }
  function summary(o, r) {
    return `On ${kit.money(o.amount)} at ${kit.number(o.rate, 3)}%, the interest-only payment is ${kit.money(r.ioPay)} a month for ${o.ioYears} years. The payment then rises to ${kit.money(r.amPay)} to repay the loan over the remaining ${o.years - o.ioYears} years. Total interest is about ${kit.money(r.interest)}, which is ${kit.money(r.extra)} more than a fully amortizing loan.`;
  }
  function outputs(o, r) {
    return { big: kit.money(r.ioPay), amPay: kit.money(r.amPay), jump: kit.money(r.jump), full: kit.money(r.full), interest: kit.money(r.interest), extra: kit.money(r.extra) };
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: ["ioYears", "years"].includes(k) });
    if (!m.ioYears && !m.years && o.ioYears >= o.years) m.ioYears = 'The interest-only period must be shorter than the loan term.';
    return m;
  }

  const engine = { LIMITS, pmt, bal, calc, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('interest-only-loan', box => {
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
