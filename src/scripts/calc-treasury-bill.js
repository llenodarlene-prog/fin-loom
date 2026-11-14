// Fin Loom Treasury bill calculator. Formulas from TreasuryDirect, "Price, Yield and Rate
// Calculations for a Treasury Bill": price P = 100(1 − d·r/360) per $100 face; discount rate
// d = ((100 − P)/100)(360/r); coupon equivalent (investment) rate i = ((100 − P)/P)(y/r) for bills of
// not more than a half-year, and for longer bills the root of i²(r/2y − .25) + i(r/y) + (P − 100)/P = 0.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { face: [100, 100000000], rate: [0, 25], price: [50, 100], days: [1, 366] };

  const priceFromRate = (d, r) => 100 * (1 - (d / 100) * r / 360);
  const rateFromPrice = (p, r) => ((100 - p) / 100) * (360 / r) * 100;
  function investmentRate(p, r, y) {
    if (r <= y / 2) return ((100 - p) / p) * (y / r) * 100;
    const a = r / (2 * y) - 0.25; const b = r / y; const c = (p - 100) / p;
    return ((-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a)) * 100;
  }

  function bill(o) {
    const price = o.mode === 'price' ? o.price : priceFromRate(o.rate, o.days);
    const discount = o.mode === 'price' ? rateFromPrice(o.price, o.days) : o.rate;
    const cost = o.face * price / 100;
    return { price, discount, cost, interest: o.face - cost, investment: investmentRate(price, o.days, o.year), proceeds: o.face, weeks: o.days / 7 };
  }

  function summary(o, r) {
    return `A ${kit.money(o.face)} bill with ${o.days} days to maturity at a ${kit.number(r.discount, 3)}% discount rate costs about ${kit.money(r.cost)}. You receive ${kit.money(o.face)} at maturity, so the interest is ${kit.money(r.interest)}, an investment rate of about ${kit.number(r.investment, 3)}%.`;
  }

  function outputs(o, r) {
    return { big: kit.money(r.cost), price: `${kit.number(r.price, 6)} per $100`, discount: `${kit.number(r.discount, 3)}%`, investment: `${kit.number(r.investment, 3)}%`, interest: kit.money(r.interest), proceeds: kit.money(r.proceeds) };
  }

  function tableRows(o) {
    return [28, 42, 56, 91, 119, 182, 364].map(days => {
      const r = bill({ ...o, mode: 'rate', rate: o.mode === 'price' ? rateFromPrice(o.price, o.days) : o.rate, days });
      return `<tr><th scope="row">${days} days (${days / 7} weeks)</th><td class="num">${kit.money(r.cost)}</td><td class="num">${kit.money(r.interest)}</td><td class="num">${kit.number(r.investment, 3)}%</td></tr>`;
    }).join('');
  }

  function check(o) {
    return {
      face: kit.range(o.face, ...LIMITS.face) || (o.face % 100 !== 0 ? 'Treasury bills are sold in $100 increments.' : ''),
      rate: o.mode === 'rate' ? kit.range(o.rate, ...LIMITS.rate) : '', price: o.mode === 'price' ? kit.range(o.price, ...LIMITS.price) : '',
      days: kit.range(o.days, ...LIMITS.days, { integer: true })
    };
  }

  const engine = { LIMITS, priceFromRate, rateFromPrice, investmentRate, bill, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('treasury-bill', box => {
    const form = box.querySelector('form');
    const f = n => form.elements[n];
    const run = () => {
      const mode = form.querySelector('input[name="mode"]:checked').value;
      const o = { face: kit.num(f('face')), mode, rate: kit.num(f('rate')), price: kit.num(f('price')), days: kit.num(f('days')), year: Number(f('year').value) };
      const msg = check(o);
      if (!kit.errors(form, ['face', 'rate', 'price', 'days'].map(k => [f(k), msg[k]]))) return;
      const r = bill(o);
      const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(o);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
