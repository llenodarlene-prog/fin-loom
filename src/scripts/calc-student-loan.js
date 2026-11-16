// Fin Loom student loan payoff calculator: a standard amortized loan with interest of balance × rate
// ÷ 12 each month, a required monthly payment, and an optional extra payment applied to principal.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { balance: [1, 10000000], rate: [0, 30], term: [1, 30], extra: [0, 100000] };
  const CAP = 600;

  const scheduled = (b, rate, years) => { const i = rate / 1200; const n = years * 12; return i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };

  function payoff(b, rate, payment) {
    let bal = b; let months = 0; let interest = 0; const years = [];
    while (bal > 0.005 && months < CAP) {
      const i = bal * rate / 1200; const pay = Math.min(bal + i, payment);
      bal = bal + i - pay; months += 1; interest += i;
      if (months % 12 === 0 || bal <= 0.005) years.push({ year: Math.ceil(months / 12), balance: Math.max(0, bal), interest });
    }
    return { months, interest, years };
  }

  function plan(o) {
    const payment = scheduled(o.balance, o.rate, o.term);
    const base = payoff(o.balance, o.rate, payment);
    const fast = payoff(o.balance, o.rate, payment + o.extra);
    return { payment, base, fast, saved: base.interest - fast.interest, sooner: base.months - fast.months };
  }

  const span = m => { const y = Math.floor(m / 12); const r = m % 12; return [y ? `${y} year${y === 1 ? '' : 's'}` : '', r ? `${r} month${r === 1 ? '' : 's'}` : ''].filter(Boolean).join(', ') || '0 months'; };

  function summary(o, p) {
    const base = `A ${kit.money(o.balance)} loan at ${kit.number(o.rate, 2)}% over ${o.term} years has a payment of about ${kit.money(p.payment)} a month and ${kit.money(p.base.interest)} of total interest.`;
    return o.extra > 0 ? `${base} Adding ${kit.money(o.extra)} a month could pay it off ${span(p.sooner)} sooner and save about ${kit.money(p.saved)} of interest.` : base;
  }

  function outputs(o, p) {
    return { big: kit.money(p.payment), interest: kit.money(p.base.interest), time: span(p.fast.months), fastInterest: kit.money(p.fast.interest), saved: kit.money(p.saved), sooner: p.sooner > 0 ? span(p.sooner) : 'No extra payment' };
  }

  function tableRows(p) {
    return p.fast.years.map(y => `<tr><th scope="row">${y.year}</th><td class="num">${kit.money(y.interest)}</td><td class="num">${kit.money(y.balance)}</td></tr>`).join('');
  }

  function check(o) { const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: k === 'term' }); return m; }

  const engine = { LIMITS, scheduled, payoff, plan, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('student-loan', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = { balance: kit.num(f('balance')), rate: kit.num(f('rate')), term: kit.num(f('term')), extra: f('extra').value.trim() === '' ? 0 : kit.num(f('extra')) };
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const p = plan(o); const values = outputs(o, p);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, p);
      box.querySelector('tbody').innerHTML = tableRows(p);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
