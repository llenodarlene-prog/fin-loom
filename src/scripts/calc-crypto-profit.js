// Fin Loom crypto profit calculator: coins bought = (amount − buy fee) ÷ buy price; proceeds = coins ×
// sell price − sell fee; profit = proceeds − amount invested. Fees are percentages of each trade.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { invest: [0.01, 1000000000], buy: [0.00000001, 100000000], sell: [0, 100000000], buyFee: [0, 10], sellFee: [0, 10] };

  function profit(o) {
    const buyFee = o.invest * o.buyFee / 100;
    const coins = (o.invest - buyFee) / o.buy;
    const gross = coins * o.sell; const sellFee = gross * o.sellFee / 100;
    const proceeds = gross - sellFee; const gain = proceeds - o.invest;
    const breakEven = o.invest / (coins * (1 - o.sellFee / 100));
    return { coins, buyFee, sellFee, fees: buyFee + sellFee, proceeds, gain, roi: gain / o.invest, breakEven, change: o.sell / o.buy - 1 };
  }

  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;

  function summary(o, r) {
    return `${kit.money(o.invest)} at ${kit.money(o.buy)} buys ${kit.number(r.coins, 8)} coins after a ${kit.money(r.buyFee)} fee. Selling at ${kit.money(o.sell)} returns ${kit.money(r.proceeds)} after a ${kit.money(r.sellFee)} fee, a ${r.gain >= 0 ? 'profit' : 'loss'} of ${kit.money(Math.abs(r.gain))} (${kit.percent(r.roi, 2)}). Fees mean the price must reach ${kit.money(r.breakEven)} to break even.`;
  }

  function outputs(o, r) {
    return { big: signed(r.gain), roi: kit.percent(r.roi, 2), coins: kit.number(r.coins, 8), proceeds: kit.money(r.proceeds), fees: kit.money(r.fees), breakEven: kit.money(r.breakEven), change: kit.percent(r.change, 2) };
  }

  function tableRows(o) {
    return [-0.5, -0.25, 0, 0.25, 0.5, 1].map(c => { const r = profit({ ...o, sell: o.buy * (1 + c) }); return `<tr><th scope="row">${c >= 0 ? '+' : '−'}${Math.abs(c * 100)}%</th><td class="num">${kit.money(o.buy * (1 + c))}</td><td class="num">${signed(r.gain)}</td></tr>`; }).join('');
  }

  function check(o) { const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k]); return m; }

  const engine = { LIMITS, profit, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('crypto-profit', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = profit(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(o);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
