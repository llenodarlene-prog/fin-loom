// Fin Loom dollar-cost averaging calculator: equal purchases along a hypothetical price path,
// compared with investing the same total at the first price.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { amount: [1, 10000000], periods: [2, 120], price: [0.01, 1000000], dip: [0, 95] };

  // Price path: falls in a straight line from the start price to the low (start × (1 - dip)) at the
  // middle purchase, then moves in a straight line to the end price at the last purchase.
  function path(o) {
    const low = o.start * (1 - o.dip / 100);
    const mid = Math.floor((o.periods - 1) / 2);
    const prices = [];
    for (let i = 0; i < o.periods; i += 1) {
      if (i <= mid) prices.push(mid === 0 ? o.start : o.start + (low - o.start) * (i / mid));
      else prices.push(low + (o.end - low) * ((i - mid) / (o.periods - 1 - mid)));
    }
    return prices;
  }

  function dca(o) {
    const prices = path(o);
    let shares = 0;
    const rows = prices.map((price, i) => {
      const bought = o.amount / price;
      shares += bought;
      return { n: i + 1, price, bought, shares, invested: o.amount * (i + 1), value: shares * price };
    });
    const invested = o.amount * o.periods;
    const value = shares * o.end;
    const lumpShares = invested / o.start;
    const lumpValue = lumpShares * o.end;
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    return {
      rows, invested, shares, value, gain: value - invested,
      avgCost: shares > 0 ? invested / shares : 0, avgPrice,
      lumpShares, lumpValue, diff: value - lumpValue, low: Math.min(...prices)
    };
  }

  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;

  function summary(o, r) {
    const lead = Math.abs(r.diff) < 0.005 ? 'the same as' : r.diff > 0 ? `${kit.money(r.diff)} more than` : `${kit.money(-r.diff)} less than`;
    return `In this hypothetical path, investing ${kit.money(o.amount)} in each of ${o.periods} periods buys shares at an average cost of ${kit.money(r.avgCost)}. At an ending price of ${kit.money(o.end)}, that is worth ${kit.money(r.value)}, ${lead} investing the full ${kit.money(r.invested)} at the first price.`;
  }

  function outputs(r) {
    return {
      big: kit.money(r.value), invested: kit.money(r.invested), gain: signed(r.gain),
      avgCost: kit.money(r.avgCost), avgPrice: kit.money(r.avgPrice),
      shares: kit.number(r.shares, 4), lumpValue: kit.money(r.lumpValue), diff: signed(r.diff)
    };
  }

  function tableRows(r) {
    return r.rows.map(row => `<tr><th scope="row">${row.n}</th><td class="num">${kit.money(row.price)}</td><td class="num">${kit.number(row.bought, 4)}</td><td class="num">${kit.number(row.shares, 4)}</td><td class="num">${kit.money(row.invested)}</td><td class="num">${kit.money(row.value)}</td></tr>`).join('');
  }

  function check(o) {
    return {
      amount: kit.range(o.amount, ...LIMITS.amount), periods: kit.range(o.periods, ...LIMITS.periods, { integer: true }),
      start: kit.range(o.start, ...LIMITS.price), dip: kit.range(o.dip, ...LIMITS.dip), end: kit.range(o.end, ...LIMITS.price)
    };
  }

  const engine = { LIMITS, path, dca, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('dca', box => {
    const form = box.querySelector('form');
    const f = name => form.elements[name];
    const run = () => {
      const o = { amount: kit.num(f('amount')), periods: kit.num(f('periods')), start: kit.num(f('start')), dip: kit.num(f('dip')), end: kit.num(f('end')) };
      const msg = check(o);
      if (!kit.errors(form, [[f('amount'), msg.amount], [f('periods'), msg.periods], [f('start'), msg.start], [f('dip'), msg.dip], [f('end'), msg.end]])) return;
      const r = dca(o);
      const values = outputs(r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
