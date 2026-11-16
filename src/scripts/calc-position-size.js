// Fin Loom position size calculator. Dollar risk = account × risk %; risk per share = |entry − stop|;
// shares = floor(dollar risk ÷ risk per share). A stop below entry is a long trade, above is a short.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { account: [1, 1000000000], risk: [0.01, 100], entry: [0.0001, 1000000], stop: [0.0001, 1000000], target: [0, 1000000] };

  function size(o) {
    const perShare = Math.abs(o.entry - o.stop);
    const dollarRisk = o.account * o.risk / 100;
    const shares = perShare > 0 ? Math.floor(dollarRisk / perShare) : 0;
    const value = shares * o.entry;
    const long = o.stop < o.entry;
    const reward = o.target > 0 ? (long ? o.target - o.entry : o.entry - o.target) : null;
    return { perShare, dollarRisk, shares, value, share: value / o.account, actualRisk: shares * perShare, long, rr: reward !== null && perShare > 0 ? reward / perShare : null, profit: reward !== null ? reward * shares : null };
  }

  function summary(o, r) {
    return `Risking ${kit.number(o.risk, 2)}% of a ${kit.money(o.account)} account is ${kit.money(r.dollarRisk)}. With a ${r.long ? 'long' : 'short'} entry at ${kit.money(o.entry)} and a stop at ${kit.money(o.stop)}, each share risks ${kit.money(r.perShare)}, so the position is ${kit.number(r.shares)} shares worth ${kit.money(r.value)}, or ${kit.percent(r.share, 1)} of the account.`;
  }

  function outputs(o, r) {
    return { big: `${kit.number(r.shares)} shares`, dollarRisk: kit.money(r.dollarRisk), actualRisk: kit.money(r.actualRisk), perShare: kit.money(r.perShare), value: kit.money(r.value), share: kit.percent(r.share, 1), rr: r.rr === null ? 'Add a target' : `${kit.number(r.rr, 2)} : 1`, profit: r.profit === null ? 'Add a target' : kit.money(r.profit) };
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k]);
    if (!m.stop && o.stop === o.entry) m.stop = 'The stop must differ from the entry price.';
    if (!m.target && o.target > 0 && ((o.stop < o.entry && o.target <= o.entry) || (o.stop > o.entry && o.target >= o.entry))) m.target = 'The target should be on the profit side of the entry.';
    return m;
  }

  const engine = { LIMITS, size, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('position-size', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = k === 'target' && f(k).value.trim() === '' ? 0 : kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = size(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
