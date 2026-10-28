// Fin Loom dividend total return calculator: price change plus dividends, less fees, over a holding
// period. Starting value includes fees (the full cash outlay). With reinvestment on, dividends are
// assumed to buy shares at the average of the purchase and current price, valued at the current price.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;

  function totalReturn(o) {
    const cost = o.buy * o.shares;
    const start = cost + o.fees;
    const priceGain = (o.current - o.buy) * o.shares;
    const dividends = o.dividend * o.shares;
    const average = (o.buy + o.current) / 2;
    const extraShares = o.reinvest && average > 0 ? dividends / average : 0;
    const dividendValue = o.reinvest ? extraShares * o.current : dividends;
    const end = o.current * o.shares + dividendValue;
    const total = end - start;
    const totalPct = start > 0 ? total / start : 0;
    const annualized = start > 0 && end > 0 ? Math.pow(end / start, 1 / o.years) - 1 : null;
    return { start, cost, priceGain, dividends, dividendValue, extraShares, end, total, totalPct, annualized, fees: o.fees, priceReturn: cost > 0 ? priceGain / cost : 0, years: o.years, reinvest: o.reinvest };
  }

  function check(o) {
    return {
      buy: kit.range(o.buy, 0.01, 1e6), current: kit.range(o.current, 0, 1e6), shares: kit.range(o.shares, 0.0001, 1e8),
      years: kit.range(o.years, 0.01, 100), dividend: kit.range(o.dividend, 0, 1e5), fees: kit.range(o.fees, 0, 1e9)
    };
  }

  const signed = value => (value < 0 ? `−${kit.money(-value)}` : kit.money(value));

  function summary(o, r) {
    const verb = r.total >= 0 ? 'a gain' : 'a loss';
    const annual = r.annualized === null ? 'an annualized return that cannot be calculated because the ending value is zero' : `an estimated annualized return of ${kit.percent(r.annualized, 2)}`;
    return `Under these assumptions, ${kit.number(o.shares, 4).replace(/\.?0+$/, '')} shares bought at ${kit.money(o.buy)} and valued at ${kit.money(o.current)} after ${kit.number(o.years, 2).replace(/\.?0+$/, '')} years, with ${kit.money(r.dividends)} of dividends${o.reinvest ? ' reinvested' : ''}, could produce ${verb} of ${kit.money(Math.abs(r.total))} (${kit.percent(r.totalPct, 2)}), ${annual}.`;
  }

  function outputs(o, r) {
    return {
      big: signed(r.total), pct: kit.percent(r.totalPct, 2), price: `${signed(r.priceGain)} (${kit.percent(r.priceReturn, 2)})`,
      dividends: o.reinvest ? `${kit.money(r.dividends)} (worth ${kit.money(r.dividendValue)} reinvested)` : kit.money(r.dividends),
      annualized: r.annualized === null ? 'Not available' : kit.percent(r.annualized, 2), end: kit.money(r.end), start: kit.money(r.start)
    };
  }

  // Bars for each part of the return, scaled to the largest part; losses use a hatched fill and a minus sign.
  function bars(r) {
    const parts = [['Price change', r.priceGain], ['Dividends', r.dividendValue], ['Fees', -r.fees], ['Total return', r.total]];
    const max = Math.max(1e-9, ...parts.map(([, v]) => Math.abs(v)));
    return parts.map(([name, v]) => `<div class="finloom-calc-bar-row"><span>${name}: <strong>${signed(v)}</strong></span><span class="finloom-calc-bar-track" aria-hidden="true"><span class="finloom-calc-bar-fill${v < 0 ? ' finloom-calc-bar-fill--loss' : ''}" style="left:0;width:${(Math.abs(v) / max * 100).toFixed(1)}%"></span></span></div>`).join('');
  }

  function tableRows(o, r) {
    const rows = [
      ['Purchase cost', kit.money(r.cost)], ['Fees', kit.money(r.fees)], ['Starting value (cost plus fees)', kit.money(r.start)],
      ['Price change', signed(r.priceGain)], ['Dividends received', kit.money(r.dividends)]
    ];
    if (o.reinvest) rows.push(['Shares bought with dividends', kit.number(r.extraShares, 4)], ['Value of reinvested dividends', kit.money(r.dividendValue)]);
    rows.push(['Ending value', kit.money(r.end)], ['Total return', `${signed(r.total)} (${kit.percent(r.totalPct, 2)})`], ['Annualized return', r.annualized === null ? 'Not available' : kit.percent(r.annualized, 2)]);
    return rows.map(([a, b]) => `<tr><th scope="row">${a}</th><td class="num">${b}</td></tr>`).join('');
  }

  const engine = { totalReturn, check, summary, outputs, bars, tableRows };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('dividend-return', box => {
    const form = box.querySelector('form');
    const f = name => form.elements[name];
    const run = () => {
      const o = { buy: kit.num(f('buy')), current: kit.num(f('current')), shares: kit.num(f('shares')), years: kit.num(f('years')), dividend: f('dividend').value.trim() === '' ? 0 : kit.num(f('dividend')), fees: f('fees').value.trim() === '' ? 0 : kit.num(f('fees')), reinvest: form.querySelector('input[name="reinvest"]:checked').value === 'yes' };
      const msg = check(o);
      if (!kit.errors(form, Object.keys(msg).map(key => [f(key), msg[key]]))) return;
      const r = totalReturn(o);
      const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('[data-bars]').innerHTML = bars(r);
      box.querySelector('tbody').innerHTML = tableRows(o, r);
      const warn = box.querySelector('[data-warnings]');
      warn.hidden = r.end > 0; warn.textContent = r.end > 0 ? '' : 'The ending value is zero, so an annualized return cannot be calculated.';
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
