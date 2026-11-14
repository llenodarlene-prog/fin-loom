// Fin Loom financial goal planner: up to four goals, each with a target, a deadline in months, what is
// already saved and a planned monthly deposit. Required deposit solves FV of savings + annuity = target
// at a shared assumed APY; progress and on-track status compare the plan with the requirement.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const SLOTS = 4;
  const LIMITS = { target: [0, 100000000], months: [0, 600], saved: [0, 100000000], monthly: [0, 1000000], apy: [0, 20] };

  function goal(g, apy) {
    const i = Math.pow(1 + apy / 100, 1 / 12) - 1; const n = g.months;
    const grow = Math.pow(1 + i, n); const annuity = i === 0 ? n : (grow - 1) / i;
    const fromSaved = g.saved * grow;
    const required = n > 0 ? Math.max(0, (g.target - fromSaved) / annuity) : Math.max(0, g.target - g.saved);
    const projected = fromSaved + g.monthly * annuity;
    return { ...g, required, projected, gap: projected - g.target, onTrack: projected >= g.target - 0.005, progress: g.target > 0 ? Math.min(1, g.saved / g.target) : 1 };
  }

  function plan(o) {
    const goals = o.goals.map((g, idx) => ({ ...g, n: idx + 1 })).filter(g => g.target > 0).map(g => goal(g, o.apy));
    return { goals, required: goals.reduce((s, g) => s + g.required, 0), planned: goals.reduce((s, g) => s + g.monthly, 0), onTrack: goals.filter(g => g.onTrack).length };
  }

  function summary(o, p) {
    if (!p.goals.length) return 'Enter a target amount for at least one goal.';
    return `To reach all ${p.goals.length} goal${p.goals.length === 1 ? '' : 's'} on time you would need to save about ${kit.money(p.required)} a month in total. You plan to save ${kit.money(p.planned)}, which keeps ${p.onTrack} of ${p.goals.length} on track.`;
  }

  function outputs(o, p) {
    return { big: kit.money(p.required), planned: kit.money(p.planned), diff: `${p.planned - p.required < 0 ? '−' : ''}${kit.money(Math.abs(p.planned - p.required))}`, onTrack: `${p.onTrack} of ${p.goals.length}` };
  }

  function tableRows(p) {
    return p.goals.map(g => `<tr><th scope="row">${kit.esc ? kit.esc(g.name) : g.name}</th><td class="num">${kit.money(g.target)}</td><td class="num">${kit.percent(g.progress, 0)}</td><td class="num">${kit.money(g.required)}</td><td class="num">${g.onTrack ? 'On track' : `${kit.money(-g.gap)} short`}</td></tr>`).join('');
  }

  function check(o) {
    const m = { apy: kit.range(o.apy, ...LIMITS.apy) };
    o.goals.forEach((g, idx) => { for (const k of ['target', 'months', 'saved', 'monthly']) m[`${k}${idx + 1}`] = kit.range(g[k], ...LIMITS[k], { integer: k === 'months' }); });
    return m;
  }

  const engine = { SLOTS, LIMITS, goal, plan, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  const clean = s => String(s || '').replace(/[<>&"]/g, '').slice(0, 40);
  kit.register('goal-planner', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const opt = n => (f(n).value.trim() === '' ? 0 : kit.num(f(n)));
    const run = () => {
      const goals = [];
      for (let k = 1; k <= SLOTS; k += 1) goals.push({ name: clean(f(`name${k}`).value) || `Goal ${k}`, target: opt(`target${k}`), months: opt(`months${k}`), saved: opt(`saved${k}`), monthly: opt(`monthly${k}`) });
      const o = { goals, apy: opt('apy') };
      const msg = check(o);
      if (!kit.errors(form, Object.keys(msg).map(k => [f(k), msg[k]]))) return;
      const p = plan(o); const values = outputs(o, p);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, p);
      box.querySelector('tbody').innerHTML = tableRows(p);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
