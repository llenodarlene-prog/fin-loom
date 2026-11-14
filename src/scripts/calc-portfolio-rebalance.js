// Fin Loom portfolio allocation and rebalancing analyzer: up to six holdings with a current value and
// a target weight. Shows current weights, drift from target and the buy or sell amount that would
// restore the targets, optionally after adding new cash. Values are as of the date the user enters them.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const SLOTS = 6;
  const LIMITS = { value: [0, 10000000000], target: [0, 100], cash: [0, 10000000000], band: [0, 50] };

  function analyze(o) {
    const items = o.holdings.map((h, i) => ({ ...h, n: i + 1 })).filter(h => h.value > 0 || h.target > 0);
    const total = items.reduce((s, h) => s + h.value, 0);
    const after = total + o.cash;
    const targetSum = items.reduce((s, h) => s + h.target, 0);
    const rows = items.map(h => {
      const weight = total > 0 ? h.value / total : 0; const goal = h.target / 100;
      const trade = goal * after - h.value;
      return { ...h, weight, drift: weight - goal, trade, outside: Math.abs(weight - goal) * 100 > o.band };
    });
    const largest = rows.reduce((m, r) => (!m || r.weight > m.weight ? r : m), null);
    return { rows, total, after, targetSum, largest, buys: rows.reduce((s, r) => s + Math.max(0, r.trade), 0), sells: rows.reduce((s, r) => s + Math.max(0, -r.trade), 0), outside: rows.filter(r => r.outside).length };
  }

  function summary(o, r) {
    if (Math.abs(r.targetSum - 100) > 0.01) return `Your target weights add up to ${kit.number(r.targetSum, 2)}%. Adjust them to total 100% to see rebalancing trades.`;
    return `Your portfolio is worth ${kit.money(r.total)}. ${r.outside} holding${r.outside === 1 ? ' is' : 's are'} more than ${kit.number(o.band, 1)} percentage points from target. Restoring the targets${o.cash > 0 ? ` after adding ${kit.money(o.cash)}` : ''} would mean buying ${kit.money(r.buys)} and selling ${kit.money(r.sells)}.`;
  }

  function outputs(o, r) {
    return { big: kit.money(r.total), targetSum: `${kit.number(r.targetSum, 2)}%`, outside: String(r.outside), buys: kit.money(r.buys), sells: kit.money(r.sells), largest: r.largest ? `${r.largest.name}: ${kit.percent(r.largest.weight, 1)}` : 'None' };
  }

  function tableRows(r) {
    return r.rows.map(x => `<tr><th scope="row">${x.name}</th><td class="num">${kit.money(x.value)}</td><td class="num">${kit.percent(x.weight, 1)}</td><td class="num">${kit.number(x.target, 1)}%</td><td class="num">${x.drift >= 0 ? '+' : '−'}${kit.number(Math.abs(x.drift * 100), 1)} pts</td><td class="num">${x.trade >= 0 ? 'Buy ' : 'Sell '}${kit.money(Math.abs(x.trade))}</td></tr>`).join('');
  }

  function check(o) {
    const m = { cash: kit.range(o.cash, ...LIMITS.cash), band: kit.range(o.band, ...LIMITS.band) };
    o.holdings.forEach((h, i) => { m[`value${i + 1}`] = kit.range(h.value, ...LIMITS.value); m[`target${i + 1}`] = kit.range(h.target, ...LIMITS.target); });
    return m;
  }

  const engine = { SLOTS, LIMITS, analyze, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  const clean = s => String(s || '').replace(/[<>&"]/g, '').slice(0, 30);
  kit.register('portfolio-rebalance', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const opt = n => (f(n).value.trim() === '' ? 0 : kit.num(f(n)));
    const run = () => {
      const holdings = [];
      for (let i = 1; i <= SLOTS; i += 1) holdings.push({ name: clean(f(`name${i}`).value) || `Holding ${i}`, value: opt(`value${i}`), target: opt(`target${i}`) });
      const o = { holdings, cash: opt('cash'), band: opt('band') };
      const msg = check(o);
      if (!kit.errors(form, Object.keys(msg).map(k => [f(k), msg[k]]))) return;
      const r = analyze(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
