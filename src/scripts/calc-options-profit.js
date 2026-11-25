// Fin Loom options profit calculator for buying a call or a put held to expiration. Value at
// expiration per share = max(price − strike, 0) for a call or max(strike − price, 0) for a put.
// Profit = (value − premium) × 100 × contracts − commissions. Break-even = strike ± premium.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { strike: [0.01, 1000000], premium: [0, 1000000], contracts: [1, 100000], price: [0, 1000000], fees: [0, 100000] };
  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;

  function value(kind, strike, price) { return kind === 'put' ? Math.max(strike - price, 0) : Math.max(price - strike, 0); }

  function calc(o) {
    const shares = o.contracts * 100; const cost = o.premium * shares + o.fees;
    const payoff = value(o.kind, o.strike, o.price) * shares; const profit = payoff - cost;
    const breakeven = o.kind === 'put' ? o.strike - o.premium - o.fees / shares : o.strike + o.premium + o.fees / shares;
    return { shares, cost, payoff, profit, roi: cost > 0 ? profit / cost : null, breakeven, maxLoss: cost, maxGain: o.kind === 'put' ? Math.max(o.strike * shares - cost, 0) : null };
  }

  function summary(o, r) {
    return `Buying ${o.contracts} ${o.kind} contract${o.contracts > 1 ? 's' : ''} at a ${kit.money(o.strike)} strike for ${kit.money(o.premium)} a share costs ${kit.money(r.cost)}. If the stock is at ${kit.money(o.price)} at expiration, the position is worth ${kit.money(r.payoff)}, a ${r.profit >= 0 ? 'profit' : 'loss'} of ${kit.money(Math.abs(r.profit))}. The break-even price at expiration is ${kit.money(r.breakeven)}.`;
  }

  function outputs(o, r) {
    return { big: signed(r.profit), cost: kit.money(r.cost), payoff: kit.money(r.payoff), roi: r.roi === null ? 'Not defined' : `${r.roi < 0 ? '−' : ''}${kit.number(Math.abs(r.roi) * 100, 1)}%`, breakeven: kit.money(r.breakeven), maxLoss: kit.money(r.maxLoss), maxGain: r.maxGain === null ? 'Unlimited' : kit.money(r.maxGain) };
  }

  function tableRows(o) {
    const pts = [-30, -20, -10, -5, 0, 5, 10, 20, 30].map(p => o.strike * (1 + p / 100));
    return pts.map(p => { const r = calc({ ...o, price: p }); return `<tr><th scope="row">${kit.money(p)}</th><td class="num">${kit.money(r.payoff)}</td><td class="num">${signed(r.profit)}</td></tr>`; }).join('');
  }

  function check(o) { const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: k === 'contracts' }); return m; }

  const engine = { LIMITS, value, calc, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('options-profit', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = { kind: f('kind').value }; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = calc(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(o);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
