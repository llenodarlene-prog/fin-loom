// Fin Loom rental property calculator: mortgage payment from price, down payment, rate and term;
// effective rent after vacancy; operating expenses; net operating income (NOI); cap rate = NOI ÷ price;
// annual cash flow = NOI − mortgage payments; cash-on-cash return = cash flow ÷ cash invested.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { price: [1000, 100000000], down: [0, 100], rate: [0, 20], term: [1, 40], closing: [0, 10000000], rent: [0, 1000000], vacancy: [0, 100], taxes: [0, 10000000], insurance: [0, 1000000], hoa: [0, 100000], maintenance: [0, 50], management: [0, 50] };

  function rental(o) {
    const loan = o.price * (1 - o.down / 100); const i = o.rate / 1200; const n = o.term * 12;
    const payment = loan === 0 ? 0 : i === 0 ? loan / n : loan * i / (1 - Math.pow(1 + i, -n));
    const gross = o.rent * 12; const effective = gross * (1 - o.vacancy / 100);
    const expenses = o.taxes + o.insurance + o.hoa * 12 + gross * o.maintenance / 100 + effective * o.management / 100;
    const noi = effective - expenses; const debt = payment * 12; const cashFlow = noi - debt;
    const invested = o.price * o.down / 100 + o.closing;
    return { loan, payment, gross, effective, expenses, noi, debt, cashFlow, monthly: cashFlow / 12, cap: noi / o.price, coc: invested > 0 ? cashFlow / invested : null, invested, dscr: debt > 0 ? noi / debt : null };
  }

  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;

  function summary(o, r) {
    return `With ${kit.money(o.rent)} monthly rent, ${kit.number(o.vacancy, 1)}% vacancy and ${kit.money(r.expenses)} of yearly expenses, net operating income is ${kit.money(r.noi)}, a ${kit.percent(r.cap, 2)} cap rate. After mortgage payments of ${kit.money(r.payment)} a month, cash flow is about ${signed(r.monthly)} a month${r.coc === null ? '' : `, a ${kit.percent(r.coc, 2)} cash-on-cash return on ${kit.money(r.invested)} invested`}.`;
  }

  function outputs(o, r) {
    return { big: signed(r.monthly), noi: kit.money(r.noi), cap: kit.percent(r.cap, 2), coc: r.coc === null ? 'No cash invested' : kit.percent(r.coc, 2), payment: kit.money(r.payment), expenses: kit.money(r.expenses), dscr: r.dscr === null ? 'No mortgage' : `${kit.number(r.dscr, 2)}x`, invested: kit.money(r.invested) };
  }

  function tableRows(r, o) {
    const rows = [['Gross rent', r.gross], ['Vacancy', -(r.gross - r.effective)], ['Property taxes', -o.taxes], ['Insurance', -o.insurance], ['HOA fees', -o.hoa * 12], ['Maintenance reserve', -r.gross * o.maintenance / 100], ['Property management', -r.effective * o.management / 100], ['Net operating income', r.noi], ['Mortgage payments', -r.debt], ['Cash flow', r.cashFlow]];
    return rows.map(([l, v]) => `<tr><th scope="row">${l}</th><td class="num">${signed(v)}</td></tr>`).join('');
  }

  function check(o) { const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: k === 'term' }); return m; }

  const engine = { LIMITS, rental, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('rental-property', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = f(k).value.trim() === '' ? 0 : kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = rental(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r, o);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
