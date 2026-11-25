// Fin Loom pension calculator. Compares a monthly pension with a lump-sum offer: present value of the pension stream at a chosen return, with an optional yearly cost-of-living increase, and the return the lump sum would need to match the pension.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { monthly: [1, 1000000], lump: [1, 100000000], years: [1, 50], ret: [0, 20], cola: [0, 10] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return b <= 0 ? 0 : i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };
  const bal = (b, rate, n, k) => { const i = rate / 1200; const p = pmt(b, rate, n); return i === 0 ? b - p * k : b * Math.pow(1 + i, k) - p * (Math.pow(1 + i, k) - 1) / i; };
  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;
  function pvAt(o, rate) {
    const i = Math.pow(1 + rate / 100, 1 / 12) - 1; let pv = 0; let p = o.monthly;
    for (let m = 1; m <= o.years * 12; m++) { pv += p / Math.pow(1 + i, m); if (m % 12 === 0) p *= 1 + o.cola / 100; }
    return pv;
  }
  function calc(o) {
    const pv = pvAt(o, o.ret); let lo = -50; let hi = 100;
    if (pvAt(o, hi) > o.lump) return { pv, total: pvAt(o, 0), breakeven: null };
    for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (pvAt(o, mid) > o.lump) lo = mid; else hi = mid; }
    return { pv, total: pvAt(o, 0), breakeven: (lo + hi) / 2 };
  }
  function summary(o, r) {
    const be = r.breakeven === null ? '' : ` The lump sum would need to earn about ${kit.number(r.breakeven, 2)}% a year to pay the same amounts.`;
    return `At a ${kit.number(o.ret, 2)}% return, ${kit.money(o.monthly)} a month for ${o.years} years${o.cola > 0 ? ` rising ${kit.number(o.cola, 1)}% a year` : ''} is worth about ${kit.money(r.pv)} today, ${r.pv > o.lump ? 'more' : 'less'} than the ${kit.money(o.lump)} lump sum.${be}`;
  }
  function outputs(o, r) {
    return { big: kit.money(r.pv), total: kit.money(r.total), diff: signed(r.pv - o.lump), breakeven: r.breakeven === null ? 'Above 100%' : `${kit.number(r.breakeven, 2)}%` };
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: ["years"].includes(k) });
    return m;
  }

  const engine = { LIMITS, pmt, bal, calc, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('pension', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; Object.keys(LIMITS).forEach(k => { o[k] = kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, Object.keys(LIMITS).map(k => [f(k), msg[k]]))) return;
      const r = calc(o); const values = outputs(o, r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
