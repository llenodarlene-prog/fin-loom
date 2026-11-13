// Fin Loom credit utilization calculator: per-card and overall utilization from balances and credit
// limits, and how much to pay down to reach a chosen target ratio.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const CARDS = 5;
  const LIMITS = { limit: [0, 10000000], balance: [0, 10000000], target: [1, 100] };

  // cards: [{ limit, balance }]; cards with no limit and no balance are ignored.
  function utilization(o) {
    const cards = o.cards.map((c, i) => ({ ...c, n: i + 1 })).filter(c => c.limit > 0 || c.balance > 0);
    const totalLimit = cards.reduce((s, c) => s + c.limit, 0);
    const totalBalance = cards.reduce((s, c) => s + c.balance, 0);
    const t = o.target / 100;
    const rows = cards.map(c => ({ n: c.n, limit: c.limit, balance: c.balance, ratio: c.limit > 0 ? c.balance / c.limit : null, payDown: Math.max(0, c.balance - t * c.limit) }));
    const overall = totalLimit > 0 ? totalBalance / totalLimit : null;
    return {
      cards: rows, totalLimit, totalBalance, overall,
      payDown: Math.max(0, totalBalance - t * totalLimit),
      available: Math.max(0, totalLimit - totalBalance),
      over: rows.filter(c => c.ratio !== null && c.ratio > t).length,
      highest: rows.reduce((m, c) => (c.ratio !== null && (m === null || c.ratio > m.ratio) ? c : m), null)
    };
  }

  const ratio = v => (v === null ? 'No credit limit entered' : kit.percent(v, 1));

  function summary(o, r) {
    if (r.overall === null) return 'Enter at least one credit limit to see your utilization.';
    const base = `Your overall utilization is ${kit.percent(r.overall, 1)}: ${kit.money(r.totalBalance)} in balances on ${kit.money(r.totalLimit)} of credit.`;
    if (r.payDown === 0) return `${base} That is at or below your ${o.target}% target.`;
    return `${base} Paying down about ${kit.money(r.payDown)} would bring it to ${o.target}%.`;
  }

  function outputs(o, r) {
    return {
      big: ratio(r.overall), balance: kit.money(r.totalBalance), limit: kit.money(r.totalLimit),
      available: kit.money(r.available), payDown: kit.money(r.payDown),
      highest: r.highest ? `Card ${r.highest.n}: ${kit.percent(r.highest.ratio, 1)}` : 'None',
      over: `${r.over} of ${r.cards.length}`
    };
  }

  function tableRows(r) {
    return r.cards.map(c => `<tr><th scope="row">Card ${c.n}</th><td class="num">${kit.money(c.balance)}</td><td class="num">${kit.money(c.limit)}</td><td class="num">${ratio(c.ratio)}</td><td class="num">${kit.money(c.payDown)}</td></tr>`).join('');
  }

  function check(o) {
    const msg = { target: kit.range(o.target, ...LIMITS.target) };
    o.cards.forEach((c, i) => {
      msg[`limit${i + 1}`] = kit.range(c.limit, ...LIMITS.limit);
      msg[`balance${i + 1}`] = kit.range(c.balance, ...LIMITS.balance);
    });
    if (!o.cards.some(c => c.limit > 0)) msg.limit1 = msg.limit1 || 'Enter a credit limit for at least one card.';
    return msg;
  }

  const engine = { CARDS, LIMITS, utilization, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('credit-utilization', box => {
    const form = box.querySelector('form');
    const f = name => form.elements[name];
    const opt = name => (f(name).value.trim() === '' ? 0 : kit.num(f(name)));
    const run = () => {
      const cards = [];
      for (let i = 1; i <= CARDS; i += 1) cards.push({ limit: opt(`limit${i}`), balance: opt(`balance${i}`) });
      const o = { cards, target: kit.num(f('target')) };
      const msg = check(o);
      if (!kit.errors(form, Object.keys(msg).map(k => [f(k), msg[k]]))) return;
      const r = utilization(o);
      const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
