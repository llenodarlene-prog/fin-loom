// Fin Loom loan payment calculator. Fixed monthly payment = P × i ÷ (1 − (1 + i)^−n), where i is the
// annual rate ÷ 12 and n is the number of monthly payments. Shows total interest and a yearly schedule.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { amount: [100, 100000000], rate: [0, 40], years: [0.5, 40] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };

  function schedule(o) {
    const n = Math.round(o.years * 12); const pay = pmt(o.amount, o.rate, n); const i = o.rate / 1200;
    let bal = o.amount; let paidInt = 0; let paidPrin = 0; const rows = [];
    for (let m = 1; m <= n; m++) {
      const int = bal * i; const prin = Math.min(pay - int, bal); bal -= prin; paidInt += int; paidPrin += prin;
      if (m % 12 === 0 || m === n) rows.push({ year: Math.ceil(m / 12), principal: paidPrin, interest: paidInt, balance: Math.max(bal, 0) });
    }
    return { n, pay, total: pay * n, interest: pay * n - o.amount, rows };
  }

  function summary(o, r) {
    return `Borrowing ${kit.money(o.amount)} at ${kit.number(o.rate, 2)}% for ${kit.number(o.years, 1)} years costs about ${kit.money(r.pay)} a month. Over ${r.n} payments you would pay ${kit.money(r.total)} in total, including ${kit.money(r.interest)} of interest.`;
  }

  function outputs(o, r) {
    return { big: kit.money(r.pay), payments: kit.number(r.n, 0), total: kit.money(r.total), interest: kit.money(r.interest), share: `${kit.number(r.total > 0 ? r.interest / r.total * 100 : 0, 1)}%` };
  }

  function tableRows(r) {
    return r.rows.map(x => `<tr><th scope="row">${x.year}</th><td class="num">${kit.money(x.principal)}</td><td class="num">${kit.money(x.interest)}</td><td class="num">${kit.money(x.balance)}</td></tr>`).join('');
  }

  function check(o) { const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k]); return m; }

  const engine = { LIMITS, pmt, schedule, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('loan-payment', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = schedule(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
