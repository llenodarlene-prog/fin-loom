// Fin Loom 401(k) employer match calculator: your contribution, the match it earns, and any match
// left unclaimed, with the 2026 IRS elective deferral limits.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  // 2026 limits: $24,500 elective deferral; $8,000 catch-up at 50+ (IRS, November 2025 announcement).
  const DEFERRAL_2026 = 24500;
  const CATCHUP_2026 = 8000;
  const LIMITS = { salary: [1, 10000000], pct: [0, 100], match: [0, 200], cap: [0, 100] };

  function match(o) {
    const limit = DEFERRAL_2026 + (o.over50 ? CATCHUP_2026 : 0);
    const wanted = o.salary * o.contrib / 100;
    const yours = Math.min(wanted, limit);
    const capped = wanted > limit;
    // Match: match rate × your contribution, up to the matched share of salary (cap %).
    const matchable = Math.min(yours, o.salary * o.cap / 100);
    const employer = matchable * o.match / 100;
    const fullMatch = o.salary * o.cap / 100 * o.match / 100;
    const needPct = o.cap;
    return {
      limit, wanted, yours, capped, employer, fullMatch, total: yours + employer,
      missed: Math.max(0, fullMatch - employer), needPct, perPaycheck: (yours + employer) / 26
    };
  }

  function summary(o, r) {
    const missed = r.missed > 0.005 ? ` Contributing at least ${kit.number(r.needPct, 2)}% of salary would capture the full match, about ${kit.money(r.missed)} more a year.` : ' At this rate you capture the full match.';
    return `Contributing ${kit.number(o.contrib, 2)}% of a ${kit.money(o.salary)} salary puts ${kit.money(r.yours)} into the plan this year. Under the match formula you entered, your employer would add about ${kit.money(r.employer)}.${missed}`;
  }

  function outputs(r) {
    return {
      big: kit.money(r.employer), yours: kit.money(r.yours), total: kit.money(r.total), fullMatch: kit.money(r.fullMatch),
      missed: kit.money(r.missed), limit: kit.money(r.limit), perPaycheck: kit.money(r.perPaycheck)
    };
  }

  function tableRows(o, r) {
    const line = (label, value) => `<tr><th scope="row">${label}</th><td class="num">${value}</td></tr>`;
    return [
      line('Contribution you chose (salary × your %)', kit.money(r.wanted)),
      line('2026 elective deferral limit that applies', kit.money(r.limit)),
      line('Your contribution after the limit', kit.money(r.yours)),
      line('Salary eligible for the match (salary × cap %)', kit.money(o.salary * o.cap / 100)),
      line('Employer match (matched amount × match rate)', kit.money(r.employer)),
      line('Maximum match available', kit.money(r.fullMatch)),
      line('Total going into the plan', kit.money(r.total))
    ].join('');
  }

  function check(o) {
    return {
      salary: kit.range(o.salary, ...LIMITS.salary), contrib: kit.range(o.contrib, ...LIMITS.pct),
      match: kit.range(o.match, ...LIMITS.match), cap: kit.range(o.cap, ...LIMITS.cap)
    };
  }

  const engine = { DEFERRAL_2026, CATCHUP_2026, LIMITS, match, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('401k-match', box => {
    const form = box.querySelector('form');
    const f = name => form.elements[name];
    const run = () => {
      const o = { salary: kit.num(f('salary')), contrib: kit.num(f('contrib')), match: kit.num(f('match')), cap: kit.num(f('cap')), over50: form.elements.age.value === '50' };
      const msg = check(o);
      if (!kit.errors(form, [[f('salary'), msg.salary], [f('contrib'), msg.contrib], [f('match'), msg.match], [f('cap'), msg.cap]])) return;
      const r = match(o);
      const values = outputs(r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(o, r);
      const warn = box.querySelector('[data-warnings]');
      warn.hidden = !r.capped;
      warn.textContent = r.capped ? `Your chosen contribution exceeds the 2026 limit of ${kit.money(r.limit)}, so it is capped at that amount.` : '';
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
