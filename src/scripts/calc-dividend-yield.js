// Fin Loom dividend yield calculator: yield = annual dividends per share ÷ share price, with the
// annual dividend taken as the payment per period × payments per year, and the income an investment
// of a chosen size would produce at that yield before taxes.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { price: [0.01, 1000000], dividend: [0, 100000], frequency: [1, 12], invest: [0, 1000000000] };

  function yieldCalc(o) {
    const annual = o.dividend * o.frequency;
    const y = annual / o.price;
    const shares = o.invest / o.price;
    return { annual, yield: y, shares, income: shares * annual, perPayment: shares * o.dividend };
  }

  function summary(o, r) {
    return `A ${kit.money(o.dividend)} dividend paid ${o.frequency} time${o.frequency === 1 ? '' : 's'} a year is ${kit.money(r.annual)} per share annually. At a ${kit.money(o.price)} share price, that is a ${kit.percent(r.yield, 2)} dividend yield. ${kit.money(o.invest)} invested would earn about ${kit.money(r.income)} a year if the dividend stays the same.`;
  }

  function outputs(o, r) {
    return { big: kit.percent(r.yield, 2), annual: kit.money(r.annual), shares: kit.number(r.shares, 3), income: kit.money(r.income), perPayment: kit.money(r.perPayment) };
  }

  function tableRows(o) {
    return [-0.2, -0.1, 0, 0.1, 0.2].map(c => {
      const p = o.price * (1 + c);
      return `<tr><th scope="row">${c === 0 ? 'Current' : `${c > 0 ? '+' : '−'}${Math.abs(c * 100)}%`}</th><td class="num">${kit.money(p)}</td><td class="num">${kit.percent(o.dividend * o.frequency / p, 2)}</td></tr>`;
    }).join('');
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: k === 'frequency' }); return m;
  }

  const engine = { LIMITS, yieldCalc, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('dividend-yield', box => {
    const form = box.querySelector('form');
    const f = n => form.elements[n];
    const run = () => {
      const o = { price: kit.num(f('price')), dividend: kit.num(f('dividend')), frequency: Number(f('frequency').value), invest: f('invest').value.trim() === '' ? 0 : kit.num(f('invest')) };
      const msg = check(o);
      if (!kit.errors(form, ['price', 'dividend', 'invest'].map(k => [f(k), msg[k]]))) return;
      const r = yieldCalc(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(o);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
