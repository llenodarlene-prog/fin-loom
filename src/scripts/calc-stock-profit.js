// Fin Loom stock profit calculator: gain or loss on one round-trip trade, after buy and sell fees.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { price: [0, 1000000], shares: [0.0001, 1000000000], fees: [0, 1000000] };

  // Cost basis = buy x shares + buy fees; net proceeds = sell x shares - sell fees.
  function profit(o) {
    const cost = o.buy * o.shares + o.buyFees;
    const proceeds = o.sell * o.shares - o.sellFees;
    const gross = (o.sell - o.buy) * o.shares;
    const net = proceeds - cost;
    return {
      cost, proceeds, gross, net, fees: o.buyFees + o.sellFees,
      returnPct: cost > 0 ? net / cost : 0,
      breakEven: o.shares > 0 ? (cost + o.sellFees) / o.shares : 0,
      perShare: o.shares > 0 ? net / o.shares : 0
    };
  }

  const word = value => (value >= 0 ? 'gain' : 'loss');
  const signed = value => `${value < 0 ? '−' : ''}${kit.money(Math.abs(value))}`;

  function summary(o, r) {
    const result = Math.abs(r.net) < 0.005 ? 'break even' : `produce an estimated net ${word(r.net)} of ${kit.money(Math.abs(r.net))}`;
    return `Under these assumptions, buying ${kit.number(o.shares, Number.isInteger(o.shares) ? 0 : 4)} shares at ${kit.money(o.buy)} and selling at ${kit.money(o.sell)} could ${result}, a ${kit.percent(r.returnPct, 2)} return on the cost basis after ${kit.money(r.fees)} in fees.`;
  }

  function outputs(r) {
    return {
      big: signed(r.net), bigLabel: r.net < 0 ? 'Net loss' : 'Net gain',
      gross: signed(r.gross), fees: kit.money(r.fees), returnPct: kit.percent(r.returnPct, 2),
      breakEven: kit.money(r.breakEven), perShare: signed(r.perShare)
    };
  }

  // Horizontal bars with text labels: cost basis, net proceeds, and the gain or loss between them.
  function bars(r) {
    const max = Math.max(Math.abs(r.cost), Math.abs(r.proceeds), Math.abs(r.net), 1e-9);
    const bar = (label, value, loss) => `<div class="finloom-calc-bar-row"><span>${label}: <strong>${signed(value)}</strong></span><span class="finloom-calc-bar-track" aria-hidden="true"><span class="finloom-calc-bar-fill${loss ? ' finloom-calc-bar-fill--loss' : ''}" style="left:0;width:${Math.max(0, Math.min(100, Math.abs(value) / max * 100)).toFixed(2)}%"></span></span></div>`;
    return `<div class="finloom-calc-bar" role="img" aria-label="Cost basis ${kit.money(r.cost)}, net proceeds ${signed(r.proceeds)}, net ${word(r.net)} ${kit.money(Math.abs(r.net))}">${bar('Cost basis', r.cost)}${bar('Net proceeds', r.proceeds)}${bar(r.net < 0 ? 'Net loss (hatched)' : 'Net gain', r.net, r.net < 0)}</div>`;
  }

  function tableRows(o, r) {
    const line = (label, value) => `<tr><th scope="row">${label}</th><td class="num">${value}</td></tr>`;
    return [
      line('Purchase cost (buy price × shares)', kit.money(o.buy * o.shares)), line('Buy fees', kit.money(o.buyFees)),
      line('Cost basis', kit.money(r.cost)), line('Sale value (sell price × shares)', kit.money(o.sell * o.shares)),
      line('Sell fees', kit.money(o.sellFees)), line('Net proceeds', signed(r.proceeds)),
      line('Gross gain or loss (before fees)', signed(r.gross)), line('Net gain or loss (after fees)', signed(r.net))
    ].join('');
  }

  function check(o) {
    return {
      buy: kit.range(o.buy, ...LIMITS.price) || (o.buy > 0 ? '' : 'Enter a buy price above 0.'),
      sell: kit.range(o.sell, ...LIMITS.price), shares: kit.range(o.shares, ...LIMITS.shares),
      buyFees: kit.range(o.buyFees, ...LIMITS.fees), sellFees: kit.range(o.sellFees, ...LIMITS.fees)
    };
  }

  const engine = { LIMITS, profit, summary, outputs, bars, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('stock-profit', box => {
    const form = box.querySelector('form');
    const f = name => form.elements[name];
    const opt = name => (f(name).value.trim() === '' ? 0 : kit.num(f(name)));
    const run = () => {
      const o = { buy: kit.num(f('buy')), sell: kit.num(f('sell')), shares: kit.num(f('shares')), buyFees: opt('buyfees'), sellFees: opt('sellfees') };
      const msg = check(o);
      if (!kit.errors(form, [[f('buy'), msg.buy], [f('sell'), msg.sell], [f('shares'), msg.shares], [f('buyfees'), msg.buyFees], [f('sellfees'), msg.sellFees]])) return;
      const r = profit(o);
      const values = outputs(r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('.finloom-calc-label').textContent = values.bigLabel;
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('[data-bars]').innerHTML = bars(r);
      box.querySelector('tbody').innerHTML = tableRows(o, r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
