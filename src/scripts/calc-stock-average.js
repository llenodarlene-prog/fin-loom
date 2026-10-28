// Fin Loom stock average cost calculator. Total cost = sum of (shares x price + fees),
// average cost = total cost / total shares. An optional current price adds unrealized gain or loss.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  // Share counts keep up to four decimals for fractional shares but drop trailing zeros.
  const shareFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 });
  const shareCount = value => shareFormat.format(Number.isFinite(value) ? value : 0);
  const MIN_ROWS = 2;
  const MAX_ROWS = 50;
  const DEFAULTS = [{ shares: 100, price: 50, fees: 0 }, { shares: 50, price: 40, fees: 0 }];
  const DEFAULT_CURRENT = 45;

  // purchases: [{ shares, price, fees }]; current: number or null.
  function average(purchases, current) {
    const rows = purchases.map((p, i) => ({ index: i + 1, shares: p.shares, price: p.price, fees: p.fees, cost: p.shares * p.price + p.fees }));
    const shares = rows.reduce((a, r) => a + r.shares, 0);
    const fees = rows.reduce((a, r) => a + r.fees, 0);
    const invested = rows.reduce((a, r) => a + r.cost, 0);
    const avg = shares > 0 ? invested / shares : 0;
    const avgBeforeFees = shares > 0 ? (invested - fees) / shares : 0;
    const hasCurrent = Number.isFinite(current) && current > 0;
    const value = hasCurrent ? shares * current : null;
    const gain = hasCurrent ? value - invested : null;
    return { rows, shares, fees, invested, average: avg, averageBeforeFees: avgBeforeFees, breakEven: avg, current: hasCurrent ? current : null, value, gain, gainPct: hasCurrent && invested > 0 ? gain / invested : null };
  }

  function summary(r) {
    const base = `Under these purchases, your ${shareCount(r.shares)} shares cost an estimated ${kit.money(r.invested)} in total, an average of ${kit.money(r.average)} per share including fees.`;
    if (r.current === null) return base;
    const word = r.gain >= 0 ? 'unrealized gain' : 'unrealized loss';
    return `${base} At ${kit.money(r.current)} a share, the position could show an ${word} of ${kit.money(Math.abs(r.gain))} (${kit.percent(r.gainPct, 1)}).`;
  }

  function outputs(r) {
    return {
      big: kit.money(r.average), shares: shareCount(r.shares), invested: kit.money(r.invested), fees: kit.money(r.fees),
      avgNoFees: kit.money(r.averageBeforeFees),
      value: r.current === null ? 'Enter a current price' : kit.money(r.value),
      gain: r.current === null ? 'Enter a current price' : `${r.gain >= 0 ? 'Gain' : 'Loss'} ${kit.money(Math.abs(r.gain))} (${kit.percent(r.gainPct, 1)})`,
      breakEven: kit.money(r.breakEven)
    };
  }

  // Horizontal bars: each purchase price against the average cost, with text labels.
  function bars(r) {
    const items = r.rows.map(row => ({ label: `Purchase ${row.index}`, value: row.price })).concat([{ label: 'Average cost', value: r.average, avg: true }]);
    if (r.current !== null) items.push({ label: 'Current price', value: r.current, current: true });
    const max = Math.max(1e-9, ...items.map(i => i.value));
    return items.map(i => `<div class="finloom-calc-bar-row"><span>${i.label}: <strong>${kit.money(i.value)}</strong></span><div class="finloom-calc-bar-track" aria-hidden="true"><div class="finloom-calc-bar-fill" style="width:${(i.value / max * 100).toFixed(2)}%"></div></div></div>`).join('');
  }

  function tableRows(r) {
    return r.rows.map(row => `<tr><th scope="row">${row.index}</th><td class="num">${shareCount(row.shares)}</td><td class="num">${kit.money(row.price)}</td><td class="num">${kit.money(row.fees)}</td><td class="num">${kit.money(row.cost)}</td><td class="num">${r.shares > 0 ? kit.percent(row.shares / r.shares, 1) : '0%'}</td></tr>`).join('')
      + `<tr><th scope="row">Total</th><td class="num">${shareCount(r.shares)}</td><td class="num">${kit.money(r.average)} avg</td><td class="num">${kit.money(r.fees)}</td><td class="num">${kit.money(r.invested)}</td><td class="num">100%</td></tr>`;
  }

  // Markup for one purchase row; shared by the server render and the Add purchase button.
  function rowHtml(n, values) {
    const v = values || { shares: '', price: '', fees: '' };
    const input = (name, label, attrs, value) => `<div class="finloom-calc-field"><label for="sa-${name}-${n}">${label}</label><input id="sa-${name}-${n}" data-field="${name}" inputmode="decimal" type="number" ${attrs} value="${value}" aria-describedby="sa-${name}-${n}-error"><span class="finloom-calc-error" id="sa-${name}-${n}-error" data-error-for="sa-${name}-${n}" aria-live="polite"></span></div>`;
    return `<div class="finloom-calc-purchase" data-row="${n}"><span class="finloom-calc-index">#${n}</span>${input('shares', `Shares (purchase ${n})`, 'min="0" max="100000000" step="any"', v.shares)}${input('price', `Price per share ($, purchase ${n})`, 'min="0" max="1000000" step="any"', v.price)}${input('fees', `Fees ($, purchase ${n}, optional)`, 'min="0" max="1000000" step="any"', v.fees)}<button type="button" class="finloom-calc-remove" data-remove aria-label="Remove purchase ${n}">×</button></div>`;
  }

  const engine = { MIN_ROWS, MAX_ROWS, DEFAULTS, DEFAULT_CURRENT, average, summary, outputs, bars, tableRows, rowHtml };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('stock-average', box => {
    const form = box.querySelector('form');
    const list = box.querySelector('[data-rows]');
    const addButton = box.querySelector('[data-add]');
    let next = list.children.length + 1;

    const renumber = () => {
      const rows = [...list.querySelectorAll('[data-row]')];
      rows.forEach((row, i) => {
        row.querySelector('.finloom-calc-index').textContent = `#${i + 1}`;
        row.querySelector('[data-remove]').setAttribute('aria-label', `Remove purchase ${i + 1}`);
        row.querySelectorAll('label').forEach(label => { label.textContent = label.textContent.replace(/purchase \d+/, `purchase ${i + 1}`); });
        row.querySelector('[data-remove]').disabled = rows.length <= MIN_ROWS;
      });
      addButton.disabled = rows.length >= MAX_ROWS;
      box.querySelector('[data-row-count]').textContent = `${rows.length} of ${MAX_ROWS} purchases`;
    };

    const run = () => {
      const rows = [...list.querySelectorAll('[data-row]')];
      const checks = []; const purchases = [];
      rows.forEach(row => {
        const get = name => row.querySelector(`[data-field="${name}"]`);
        const shares = kit.num(get('shares')); const price = kit.num(get('price'));
        const feesInput = get('fees'); const fees = feesInput.value.trim() === '' ? 0 : kit.num(feesInput);
        checks.push([get('shares'), kit.range(shares, 0, 1e8)], [get('price'), kit.range(price, 0, 1e6)], [feesInput, kit.range(fees, 0, 1e6)]);
        purchases.push({ shares, price, fees });
      });
      const currentInput = form.elements.current;
      const current = currentInput.value.trim() === '' ? null : kit.num(currentInput);
      checks.push([currentInput, current === null ? '' : kit.range(current, 0.0001, 1e6)]);
      let ok = kit.errors(form, checks);
      const total = purchases.reduce((a, p) => a + (Number.isFinite(p.shares) ? p.shares : 0), 0);
      if (ok && total <= 0) { kit.errors(form, [[rows[0].querySelector('[data-field="shares"]'), 'Enter shares in at least one purchase.']]); ok = false; }
      if (!ok) return;
      const r = average(purchases, current);
      const values = outputs(r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(r);
      box.querySelector('[data-bars]').innerHTML = bars(r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };

    box.addEventListener('click', event => {
      const remove = event.target.closest('[data-remove]');
      if (remove && list.querySelectorAll('[data-row]').length > MIN_ROWS) {
        const row = remove.closest('[data-row]');
        const sibling = row.nextElementSibling || row.previousElementSibling;
        row.remove(); renumber(); run();
        if (sibling) sibling.querySelector('input').focus();
      }
      if (event.target.closest('[data-add]') && list.querySelectorAll('[data-row]').length < MAX_ROWS) {
        list.insertAdjacentHTML('beforeend', rowHtml(next));
        next += 1; renumber();
        list.lastElementChild.querySelector('input').focus();
      }
    });
    form.addEventListener('reset', () => {
      setTimeout(() => {
        list.innerHTML = DEFAULTS.map((d, i) => rowHtml(i + 1, d)).join('');
        next = DEFAULTS.length + 1;
        form.elements.current.value = DEFAULT_CURRENT;
        renumber(); run();
      }, 0);
    });
    renumber();
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
