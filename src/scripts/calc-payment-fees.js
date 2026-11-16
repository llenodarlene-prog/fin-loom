// Fin Loom payment processing fee calculator. Fee = amount × percent + fixed fee. Presets are the
// standard published U.S. rates on stripe.com/pricing and venmo.com/resources/our-fees, retrieved
// November 14, 2026; providers change prices and may offer custom rates. To net a target amount,
// charge (target + fixed) ÷ (1 − percent).
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const PRESETS = {
    'stripe-online': ['Stripe, online domestic card', 2.9, 0.30],
    'stripe-international': ['Stripe, online international card', 4.4, 0.30],
    'stripe-in-person': ['Stripe, in-person domestic card', 2.7, 0.05],
    'venmo-business': ['Venmo business profile', 1.9, 0.10],
    'venmo-tap': ['Venmo business profile, Tap to Pay', 2.29, 0.09],
    'venmo-personal': ['Venmo personal, goods and services', 2.99, 0],
    custom: ['Custom rate', null, null]
  };
  const LIMITS = { amount: [0.01, 10000000], pct: [0, 20], fixed: [0, 100], count: [1, 1000000] };

  const rateFor = o => (o.provider === 'custom' ? [o.pct, o.fixed] : PRESETS[o.provider].slice(1));

  function fees(o) {
    const [pct, fixed] = rateFor(o);
    const fee = o.amount * pct / 100 + fixed;
    const charge = (o.amount + fixed) / (1 - pct / 100);
    return { pct, fixed, fee, net: o.amount - fee, effective: fee / o.amount, charge, monthlyFees: fee * o.count, monthlyNet: (o.amount - fee) * o.count };
  }

  function summary(o, r) {
    return `At ${kit.number(r.pct, 2)}% + ${kit.money(r.fixed)}, a ${kit.money(o.amount)} payment costs ${kit.money(r.fee)} in fees, leaving ${kit.money(r.net)}, an effective rate of ${kit.percent(r.effective, 2)}. To receive the full ${kit.money(o.amount)} after fees, you would charge about ${kit.money(r.charge)}.`;
  }

  function outputs(o, r) {
    return { big: kit.money(r.fee), net: kit.money(r.net), effective: kit.percent(r.effective, 2), charge: kit.money(r.charge), monthlyFees: kit.money(r.monthlyFees), monthlyNet: kit.money(r.monthlyNet) };
  }

  function tableRows(o) {
    return Object.entries(PRESETS).filter(([k]) => k !== 'custom').map(([k, [label]]) => { const r = fees({ ...o, provider: k }); return `<tr><th scope="row">${label}</th><td class="num">${kit.number(r.pct, 2)}% + ${kit.money(r.fixed)}</td><td class="num">${kit.money(r.fee)}</td><td class="num">${kit.money(r.net)}</td></tr>`; }).join('');
  }

  function check(o) {
    return { amount: kit.range(o.amount, ...LIMITS.amount), pct: o.provider === 'custom' ? kit.range(o.pct, ...LIMITS.pct) : '', fixed: o.provider === 'custom' ? kit.range(o.fixed, ...LIMITS.fixed) : '', count: kit.range(o.count, ...LIMITS.count, { integer: true }) };
  }

  const engine = { PRESETS, LIMITS, fees, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('payment-fees', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = { amount: kit.num(f('amount')), provider: f('provider').value, pct: kit.num(f('pct')), fixed: kit.num(f('fixed')), count: kit.num(f('count')) };
      const msg = check(o);
      if (!kit.errors(form, ['amount', 'pct', 'fixed', 'count'].map(k => [f(k), msg[k]]))) return;
      const r = fees(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(o);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
