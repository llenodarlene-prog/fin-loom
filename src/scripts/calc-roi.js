// Fin Loom ROI calculator. ROI = (final value − total cost) ÷ total cost. Annualized ROI = (final ÷ cost)^(1 ÷ years) − 1.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { cost: [0.01, 1000000000], extra: [0, 1000000000], final: [0, 1000000000], years: [0.1, 100] };
  const pmt = (b, rate, n) => { const i = rate / 1200; return b <= 0 ? 0 : i === 0 ? b / n : b * i / (1 - Math.pow(1 + i, -n)); };
  const bal = (b, rate, n, k) => { const i = rate / 1200; const p = pmt(b, rate, n); return i === 0 ? b - p * k : b * Math.pow(1 + i, k) - p * (Math.pow(1 + i, k) - 1) / i; };
  const signed = v => `${v < 0 ? '−' : ''}${kit.money(Math.abs(v))}`;
  function calc(o) {
    const total = o.cost + o.extra; const gain = o.final - total; const roi = gain / total;
    return { total, gain, roi, annual: o.final > 0 ? Math.pow(o.final / total, 1 / o.years) - 1 : -1 };
  }
  const pc = v => `${v < 0 ? '−' : ''}${kit.number(Math.abs(v) * 100, 2)}%`;
  function summary(o, r) {
    return `Putting in ${kit.money(r.total)} and ending with ${kit.money(o.final)} is a ${signed(r.gain)} ${r.gain >= 0 ? 'gain' : 'loss'}, a total return on investment of ${pc(r.roi)}. Spread over ${kit.number(o.years, 1)} years, that is about ${pc(r.annual)} a year.`;
  }
  function outputs(o, r) {
    return { big: pc(r.roi), total: kit.money(r.total), gain: signed(r.gain), annual: pc(r.annual) };
  }

  function check(o) {
    const m = {}; for (const k of Object.keys(LIMITS)) m[k] = kit.range(o[k], ...LIMITS[k], { integer: [].includes(k) });
    return m;
  }

  const engine = { LIMITS, pmt, bal, calc, summary, outputs, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('roi', box => {
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
