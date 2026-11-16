// Fin Loom financial ratio analyzer. The user enters figures from a company's balance sheet and income
// statement; ratios use standard definitions. Ratios that need a missing or zero denominator show "Not
// available" rather than a misleading number.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;
  const FIELDS = [['currentAssets', 'Current assets'], ['cash', 'Cash and equivalents'], ['inventory', 'Inventory'], ['currentLiabilities', 'Current liabilities'], ['totalAssets', 'Total assets'], ['totalLiabilities', 'Total liabilities'], ['equity', "Shareholders' equity"], ['revenue', 'Revenue'], ['operatingIncome', 'Operating income'], ['netIncome', 'Net income'], ['interest', 'Interest expense']];
  const LIMITS = [-1e13, 1e13];

  const div = (a, b) => (b && Number.isFinite(a) && Number.isFinite(b) && b !== 0 ? a / b : null);

  function ratios(o) {
    return [
      ['Liquidity', 'Current ratio', div(o.currentAssets, o.currentLiabilities), 'x', 'Current assets ÷ current liabilities'],
      ['Liquidity', 'Quick ratio', div(o.currentAssets - o.inventory, o.currentLiabilities), 'x', '(Current assets − inventory) ÷ current liabilities'],
      ['Liquidity', 'Cash ratio', div(o.cash, o.currentLiabilities), 'x', 'Cash ÷ current liabilities'],
      ['Leverage', 'Debt-to-equity (total liabilities)', div(o.totalLiabilities, o.equity), 'x', 'Total liabilities ÷ equity'],
      ['Leverage', 'Liabilities to assets', div(o.totalLiabilities, o.totalAssets), '%', 'Total liabilities ÷ total assets'],
      ['Leverage', 'Interest coverage', div(o.operatingIncome, o.interest), 'x', 'Operating income ÷ interest expense'],
      ['Profitability', 'Operating margin', div(o.operatingIncome, o.revenue), '%', 'Operating income ÷ revenue'],
      ['Profitability', 'Net margin', div(o.netIncome, o.revenue), '%', 'Net income ÷ revenue'],
      ['Profitability', 'Return on equity', div(o.netIncome, o.equity), '%', 'Net income ÷ equity'],
      ['Profitability', 'Return on assets', div(o.netIncome, o.totalAssets), '%', 'Net income ÷ total assets'],
      ['Efficiency', 'Asset turnover', div(o.revenue, o.totalAssets), 'x', 'Revenue ÷ total assets']
    ].map(([group, name, value, unit, formula]) => ({ group, name, value, unit, formula }));
  }

  const fmt = r => (r.value === null ? 'Not available' : r.unit === '%' ? kit.percent(r.value, 1) : `${kit.number(r.value, 2)}x`);

  function summary(o, list) {
    const cur = list[0]; const om = list[6]; const roe = list[8];
    return `From the figures entered, the current ratio is ${fmt(cur)}, the operating margin is ${fmt(om)} and return on equity is ${fmt(roe)}. Compare these with the same company in other years and with peers in the same industry.`;
  }

  function outputs(o, list) {
    const by = name => fmt(list.find(r => r.name === name));
    return { big: by('Current ratio'), quick: by('Quick ratio'), de: by('Debt-to-equity (total liabilities)'), coverage: by('Interest coverage'), om: by('Operating margin'), nm: by('Net margin'), roe: by('Return on equity'), roa: by('Return on assets') };
  }

  function tableRows(list) {
    return list.map(r => `<tr><th scope="row">${r.name}</th><td>${r.group}</td><td class="num">${fmt(r)}</td><td>${r.formula}</td></tr>`).join('');
  }

  function check(o) { const m = {}; FIELDS.forEach(([k]) => { m[k] = kit.range(o[k], ...LIMITS); }); return m; }

  const engine = { FIELDS, ratios, summary, outputs, tableRows, check };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('financial-ratios', box => {
    const form = box.querySelector('form'); const f = n => form.elements[n];
    const run = () => {
      const o = {}; FIELDS.forEach(([k]) => { o[k] = f(k).value.trim() === '' ? 0 : kit.num(f(k)); });
      const msg = check(o);
      if (!kit.errors(form, FIELDS.map(([k]) => [f(k), msg[k]]))) return;
      const list = ratios(o); const values = outputs(o, list);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(o, list);
      box.querySelector('tbody').innerHTML = tableRows(list);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
