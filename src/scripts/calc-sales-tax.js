// Fin Loom sales tax calculator. Add tax: tax = price × rate, total = price + tax. Remove tax from a
// tax-inclusive total: price = total ÷ (1 + rate). The rate is the combined state and local rate the
// user enters; rates vary by location and item, so none are built in.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { amount: [0, 1000000000], rate: [0, 30] };

  function tax(o) {
    const r = o.rate / 100;
    if (o.mode === 'remove') { const price = o.amount / (1 + r); return { price, tax: o.amount - price, total: o.amount }; }
    return { price: o.amount, tax: o.amount * r, total: o.amount * (1 + r) };
  }

  function summary(o, r) {
    return o.mode === 'remove' ? `A ${kit.money(o.amount)} total that includes ${kit.number(o.rate, 3)}% sales tax is ${kit.money(r.price)} before tax plus ${kit.money(r.tax)} of tax.` : `${kit.number(o.rate, 3)}% sales tax on ${kit.money(o.amount)} is ${kit.money(r.tax)}, for a total of ${kit.money(r.total)}.`;
  }

  function outputs(o, r) { return { big: kit.money(o.mode === 'remove' ? r.price : r.total), price: kit.money(r.price), tax: kit.money(r.tax), total: kit.money(r.total) }; }

  function tableRows(o) {
    return [1, 2, 5, 10, 25, 50, 100].map(q => { const r = tax({ amount: o.mode === 'remove' ? tax(o).price * q : o.amount * q, rate: o.rate, mode: 'add' }); return `<tr><th scope="row">${q}</th><td class="num">${kit.money(r.price)}</td><td class="num">${kit.money(r.tax)}</td><td class="num">${kit.money(r.total)}</td></tr>`; }).join('');
  }

  function check(o) { return { amount: kit.range(o.amount, ...LIMITS.amount), rate: kit.range(o.rate, ...LIMITS.rate) }; }

  const engine = { LIMITS, tax, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('sales-tax', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = { amount: kit.num(f('amount')), rate: kit.num(f('rate')), mode: form.querySelector('input[name="mode"]:checked').value };
      const msg = check(o);
      if (!kit.errors(form, [[f('amount'), msg.amount], [f('rate'), msg.rate]])) return;
      const r = tax(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(o);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
