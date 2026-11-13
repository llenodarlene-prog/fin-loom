// Fin Loom expense ratio calculator: how two fund fees change an ending balance over time.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const LIMITS = { start: [0, 1000000000], monthly: [0, 10000000], years: [1, 60], rate: [-20, 30], fee: [0, 5] };

  // Monthly engine: growth at the equivalent monthly rate, then the fee (expense ratio / 12) is taken
  // from the balance, then the contribution is added at month end.
  function grow(o, feePct) {
    const g = Math.pow(1 + o.rate / 100, 1 / 12) - 1;
    const f = feePct / 100 / 12;
    let balance = o.start;
    let fees = 0;
    const rows = [];
    for (let year = 1; year <= o.years; year += 1) {
      for (let m = 0; m < 12; m += 1) {
        balance *= 1 + g;
        const fee = balance * f;
        balance -= fee;
        fees += fee;
        balance += o.monthly;
      }
      rows.push({ year, balance, fees });
    }
    return { balance, fees, rows };
  }

  function compare(o) {
    const a = grow(o, o.feeA);
    const b = grow(o, o.feeB);
    const contributions = o.start + o.monthly * 12 * o.years;
    return { a, b, contributions, gap: a.balance - b.balance, feeGap: b.fees - a.fees };
  }

  const pct = v => `${kit.number(v, 2)}%`;

  function summary(o, r) {
    const lower = r.gap >= 0 ? 'A' : 'B';
    return `With the same ${pct(o.rate)} assumed return before fees, Fund ${lower} could end about ${kit.money(Math.abs(r.gap))} higher after ${o.years} years. Fund A's ${pct(o.feeA)} expense ratio costs an estimated ${kit.money(r.a.fees)} in total, against ${kit.money(r.b.fees)} for Fund B at ${pct(o.feeB)}.`;
  }

  function outputs(r) {
    return {
      big: kit.money(Math.abs(r.gap)), balanceA: kit.money(r.a.balance), balanceB: kit.money(r.b.balance),
      feesA: kit.money(r.a.fees), feesB: kit.money(r.b.fees), contributions: kit.money(r.contributions)
    };
  }

  function tableRows(r) {
    return r.a.rows.map((row, i) => `<tr><th scope="row">${row.year}</th><td class="num">${kit.money(row.balance)}</td><td class="num">${kit.money(row.fees)}</td><td class="num">${kit.money(r.b.rows[i].balance)}</td><td class="num">${kit.money(r.b.rows[i].fees)}</td><td class="num">${kit.money(row.balance - r.b.rows[i].balance)}</td></tr>`).join('');
  }

  function check(o) {
    return {
      start: kit.range(o.start, ...LIMITS.start), monthly: kit.range(o.monthly, ...LIMITS.monthly),
      years: kit.range(o.years, ...LIMITS.years, { integer: true }), rate: kit.range(o.rate, ...LIMITS.rate),
      feeA: kit.range(o.feeA, ...LIMITS.fee), feeB: kit.range(o.feeB, ...LIMITS.fee)
    };
  }

  const engine = { LIMITS, grow, compare, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('expense-ratio', box => {
    const form = box.querySelector('form');
    const f = name => form.elements[name];
    const run = () => {
      const o = { start: kit.num(f('start')), monthly: kit.num(f('monthly')), years: kit.num(f('years')), rate: kit.num(f('rate')), feeA: kit.num(f('a')), feeB: kit.num(f('b')) };
      const msg = check(o);
      if (!kit.errors(form, [[f('start'), msg.start], [f('monthly'), msg.monthly], [f('years'), msg.years], [f('rate'), msg.rate], [f('a'), msg.feeA], [f('b'), msg.feeB]])) return;
      const r = compare(o);
      const values = outputs(r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
