// Server-rendered calculator markup. Default results are computed with the same engine the browser
// uses (src/scripts/calculators.js), so the page shows correct figures before or without JavaScript.
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';

// The browser script is a classic script; run it in a sandbox with a CommonJS-style module object.
const sandbox = { module: { exports: {} }, Math, Number, Intl, globalThis: {} };
vm.runInNewContext(readFileSync(new URL('../../src/scripts/calculators.js', import.meta.url), 'utf8'), sandbox);
export const engine = sandbox.module.exports;

// Suite tools: one browser file per calculator (src/scripts/calc-<id>.js), run here with the shared
// toolkit so the server render uses the same engine, and one markup module per tool
// (scripts/lib/calculators/<id>.mjs).
const scriptsDir = new URL('../../src/scripts/', import.meta.url);
export const toolIds = readdirSync(scriptsDir).filter(name => /^calc-[a-z0-9-]+\.js$/.test(name)).map(name => name.slice(5, -3));
const toolEngines = Object.fromEntries(toolIds.map(id => {
  const box = { module: { exports: {} }, Math, Number, Intl, Date, FinLoomCalc: engine.kit };
  vm.runInNewContext(readFileSync(new URL(`calc-${id}.js`, scriptsDir), 'utf8'), box);
  return [id, box.module.exports];
}));
export const tools = toolEngines;
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = value => `${(value * 100).toFixed(3)}%`;
const disclaimer = '<p class="finloom-calc-note">This calculator provides estimates for educational purposes. Actual interest earnings may differ because rates, balances, fees, account terms, and contribution timing can change.</p>';
const field = (id, label, attrs, hint = '') => `<div class="finloom-calc-field"><label for="${id}">${label}</label><input id="${id}" name="${id.split('-').pop()}" inputmode="decimal" type="number" ${attrs} aria-describedby="${hint ? `${id}-hint ` : ''}${id}-error">${hint ? `<span class="finloom-calc-hint" id="${id}-hint">${hint}</span>` : ''}<span class="finloom-calc-error" id="${id}-error" data-error-for="${id}" aria-live="polite"></span></div>`;
const row = (label, key, value) => `<div class="finloom-calc-row"><dt>${label}</dt><dd><output data-out="${key}">${value}</output></dd></div>`;
const buttons = '<div class="finloom-calc-actions"><button type="submit" class="finloom-calc-button">Calculate</button><button type="reset" class="finloom-calc-button finloom-calc-button--ghost">Reset</button></div>';
const tableRows = (rows, keys) => rows.map(item => `<tr>${keys.map((key, i) => i === 0 ? `<th scope="row">${item[key]}</th>` : `<td class="num">${money.format(item[key])}</td>`).join('')}</tr>`).join('');

function apyCalculator() {
  const d = engine.apyGrowth(4, 12, 10000, 1);
  const options = [[365, 'Daily'], [12, 'Monthly'], [4, 'Quarterly'], [2, 'Semiannual'], [1, 'Annual']].map(([n, label]) => `<option value="${n}"${n === 12 ? ' selected' : ''}>${label}</option>`).join('');
  return `<div class="finloom-calc" data-calculator="apy">
<form class="finloom-calc-form" novalidate><fieldset><legend>Your Rate</legend>
${field('apy-rate', 'Nominal annual interest rate (%)', 'min="0" max="100" step="0.01" value="4" required')}
<div class="finloom-calc-field"><label for="apy-periods">Compounding frequency</label><select id="apy-periods" name="periods">${options}</select></div>
${field('apy-balance', 'Starting balance ($, optional)', 'min="0" max="100000000" step="0.01" value="10000"')}
${field('apy-years', 'Time period (years, optional)', 'min="1" max="100" step="1" value="1"')}
</fieldset>${buttons}</form>
<section class="finloom-calc-results" aria-label="APY results"><p class="finloom-calc-label">Annual percentage yield</p><p class="finloom-calc-big"><output data-out="apy">${pct(d.apy)}</output></p>
<dl class="finloom-calc-list">${row('Nominal rate', 'rate', '4.000%')}${row('Compounding', 'frequency', 'Monthly')}${row('APY minus nominal rate', 'difference', `${((d.apy - 0.04) * 100).toFixed(3)} percentage points`)}${row('Interest after one year', 'interest1', money.format(d.rows[0].interest))}${row('Balance after one year', 'end1', money.format(d.rows[0].end))}</dl>
<dl class="finloom-calc-list" data-multi hidden>${row('Years', 'years', '1')}${row('Total interest', 'interestN', money.format(d.interest))}${row('Final balance', 'endN', money.format(d.end))}</dl>
<p class="finloom-calc-summary" data-summary aria-live="polite">A 4% rate compounded monthly gives an APY of ${pct(d.apy)}. $10,000.00 grows to ${money.format(d.end)} after 1 year.</p>
<svg class="finloom-calc-chart" role="img" aria-label="Balance by year" viewBox="0 0 600 260"></svg>
<div class="table-wrap"><table><caption>Balance by year</caption><thead><tr><th scope="col">Year</th><th scope="col" class="num">Starting Balance</th><th scope="col" class="num">Interest</th><th scope="col" class="num">Ending Balance</th></tr></thead><tbody>${tableRows(d.rows, ['year', 'start', 'interest', 'end'])}</tbody></table></div>
${disclaimer}</section></div>`;
}

function savingsCalculator() {
  const d = engine.savingsGrowth(10000, 5, 500, 5, 'end');
  return `<div class="finloom-calc" data-calculator="savings">
<form class="finloom-calc-form" novalidate><fieldset><legend>Your Savings</legend>
${field('sav-balance', 'Starting balance ($)', 'min="0" max="100000000" step="0.01" value="10000" required')}
${field('sav-apy', 'APY (%)', 'min="0" max="100" step="0.01" value="5" required', 'Use the APY your bank discloses.')}
${field('sav-monthly', 'Monthly contribution ($)', 'min="0" max="1000000" step="0.01" value="500"')}
${field('sav-years', 'Number of years', 'min="1" max="100" step="1" value="5" required')}
<fieldset class="finloom-calc-radios"><legend>Contribution timing</legend><label><input type="radio" name="timing" value="start"> Beginning of month</label><label><input type="radio" name="timing" value="end" checked> End of month</label></fieldset>
</fieldset>${buttons}</form>
<section class="finloom-calc-results" aria-label="Savings results"><p class="finloom-calc-label">Ending balance</p><p class="finloom-calc-big"><output data-out="end">${money.format(d.end)}</output></p>
<dl class="finloom-calc-list">${row('Starting balance', 'start', money.format(10000))}${row('Total contributions', 'contributions', money.format(d.contributions))}${row('Interest earned', 'interest', money.format(d.interest))}${row('Share of balance from interest', 'share', `${(d.interestShare * 100).toFixed(1)}%`)}</dl>
<p class="finloom-calc-summary" data-summary aria-live="polite">$10,000.00 plus $500.00 a month at 5% APY grows to ${money.format(d.end)} after 5 years, including ${money.format(d.interest)} of interest.</p>
<svg class="finloom-calc-chart" role="img" aria-label="Balance and contributions by year" viewBox="0 0 600 260"></svg>
<p class="finloom-calc-legend"><span class="finloom-calc-key finloom-calc-key--balance"></span>Total balance <span class="finloom-calc-key finloom-calc-key--contributions"></span>Starting balance plus contributions (the gap is interest)</p>
<div class="table-wrap"><table><caption>Year-by-year savings</caption><thead><tr><th scope="col">Year</th><th scope="col" class="num">Starting Balance</th><th scope="col" class="num">Contributions</th><th scope="col" class="num">Interest</th><th scope="col" class="num">Ending Balance</th></tr></thead><tbody>${tableRows(d.rows, ['year', 'start', 'contributions', 'interest', 'end'])}</tbody></table></div>
${disclaimer}</section></div>`;
}


function dripCalculator() {
  const o = { shares: 100, price: 50, dividend: 0.5, frequency: 4, dividendGrowth: 3, priceGrowth: 4, years: 20, monthly: 0, timing: 'end', reinvest: true };
  const r = engine.dripGrowth(o);
  const v = engine.dripOutputs(o, r, engine.dripGrowth({ ...o, reinvest: false }));
  const chart = engine.dripChart(r);
  const options = [[12, 'Monthly'], [4, 'Quarterly'], [2, 'Semiannual'], [1, 'Annual']].map(([n, label]) => `<option value="${n}"${n === 4 ? ' selected' : ''}>${label}</option>`).join('');
  const radio = (name, value, label, checked) => `<label><input type="radio" name="${name}" value="${value}"${checked ? ' checked' : ''}> ${label}</label>`;
  const line = (label, key, extra = '') => `<div class="finloom-calc-row"${extra}><dt>${label}</dt><dd><output data-out="${key}">${v[key]}</output></dd></div>`;
  return `<div class="finloom-calc finloom-calc--drip finloom-drip-calculator" data-calculator="drip">
<h2 class="finloom-calc-title">Dividend Reinvestment Calculator</h2>
<form class="finloom-calc-form" novalidate><fieldset><legend>Your Assumptions</legend>
${field('drip-shares', 'Starting shares', 'min="0" max="100000000" step="0.001" value="100" required', 'Fractional shares are allowed.')}
${field('drip-price', 'Starting share price ($)', 'min="0.01" max="1000000" step="0.01" value="50" required')}
${field('drip-dividend', 'Dividend per share ($)', 'min="0" max="100000" step="0.0001" value="0.50" required', 'Enter the dividend paid each distribution period, not the annual total.')}
<div class="finloom-calc-field"><label for="drip-frequency">Dividend frequency</label><select id="drip-frequency" name="frequency" aria-describedby="drip-frequency-hint">${options}</select><span class="finloom-calc-hint" id="drip-frequency-hint">Payments are modeled in standard months (for example March, June, September, and December). Real companies may pay on different dates.</span></div>
${field('drip-dgrowth', 'Annual dividend growth (%)', 'min="-100" max="100" step="0.1" value="3"', 'Use a negative number if you want to model dividend cuts.')}
${field('drip-pgrowth', 'Annual share price change (%)', 'min="-100" max="100" step="0.1" value="4"', 'This growth rate is an illustration, not a forecast.')}
${field('drip-years', 'Years to project', 'min="1" max="50" step="1" value="20" required')}
${field('drip-monthly', 'Monthly contribution ($)', 'min="0" max="1000000" step="0.01" value="0"')}
<fieldset class="finloom-calc-radios"><legend>Contribution timing</legend>${radio('timing', 'start', 'Beginning of month', false)}${radio('timing', 'end', 'End of month', true)}</fieldset>
<fieldset class="finloom-calc-radios"><legend>Reinvest dividends</legend>${radio('reinvest', 'yes', 'Yes', true)}${radio('reinvest', 'no', 'No, keep dividends as cash', false)}</fieldset>
</fieldset>${buttons}</form>
<section class="finloom-calc-results" aria-label="Dividend reinvestment results" aria-live="polite">
<p class="finloom-calc-label">Ending portfolio value</p><p class="finloom-calc-big"><output data-out="end">${v.end}</output></p>
<dl class="finloom-calc-list finloom-calc-list--primary">${line('Ending shares', 'shares')}${line('Estimated annual dividend income', 'income')}${line('Total dividends generated', 'dividends')}</dl>
<p class="finloom-calc-summary" data-summary>${engine.dripSummary(o, r)}</p>
<div class="finloom-calc-warning" data-warnings role="status" hidden></div>
<dl class="finloom-calc-list">${line('Starting portfolio value', 'start')}${line('Additional contributions', 'contributions')}${line('Total capital contributed', 'capital')}${line('Total dividends reinvested', 'reinvested')}${line('Investment growth above contributed capital', 'growth')}${line('Ending share price', 'price')}${line('Ending dividend per share', 'perShare')}${line('Projected yield on contributed capital', 'yoc')}${line('Growth from reinvesting vs taking cash', 'gain', ' data-gain-row')}${line('Cash dividends accumulated', 'cash', ' data-cash-row hidden')}</dl>
</section>
<div class="finloom-calc-wide">
<h3 class="finloom-calc-subtitle">Growth Over Time</h3>
<svg class="finloom-calc-chart" role="img" aria-label="${chart.desc}" viewBox="0 0 640 280">${chart.svg}</svg>
<p class="finloom-calc-legend"><span><span class="finloom-calc-key finloom-calc-key--value"></span>Portfolio value (solid)</span><span><span class="finloom-calc-key finloom-calc-key--capital"></span>Contributed capital (dashed)</span><span><span class="finloom-calc-key finloom-calc-key--dividends"></span>Cumulative dividends (dotted)</span></p>
<div class="table-wrap" tabindex="0" role="region" aria-label="Year-by-year projection table"><table><caption>Year-by-Year Projection</caption><thead><tr><th scope="col">Year</th><th scope="col" class="num">Ending Shares</th><th scope="col" class="num">Share Price</th><th scope="col" class="num">Dividend/Share</th><th scope="col" class="num">Dividends That Year</th><th scope="col" class="num">Contributions</th><th scope="col" class="num">Annual Dividend Income</th><th scope="col" class="num">Ending Value</th></tr></thead><tbody>${engine.dripRows(r)}</tbody></table></div>
<h3 class="finloom-calc-subtitle">Assumptions</h3>
<ul class="finloom-calc-assumptions"><li>Dividend growth is assumed constant and is applied once a year.</li><li>Share-price change is assumed constant and is applied monthly at the equivalent monthly rate.</li><li>Actual stock prices are volatile and do not move in a straight line.</li><li>Dividend payment months are standardized for illustration.</li><li>Fractional shares are assumed to be available for every purchase.</li><li>Fees and commissions are excluded.</li><li>Taxes are excluded.</li><li>Dividends can be reduced or eliminated at any time.</li></ul>
<div class="finloom-calc-disclaimer"><p><strong>Educational estimate only.</strong> This calculator illustrates how dividend reinvestment could affect an investment under the assumptions you enter. It does not predict future stock prices, dividends, investment returns, taxes, or company performance. Dividends can be reduced or eliminated, share prices can fall, and actual results may differ materially.</p><p>Reinvested dividends can still be taxable in a taxable account. Tax treatment depends on the investment, account type, holding period, and individual circumstances.</p></div>
</div></div>`;
}

// Shared markup for suite tools.
const esc = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const ui = {
  esc,
  field,
  select: (id, label, options, selected, hint = '') => `<div class="finloom-calc-field"><label for="${id}">${label}</label><select id="${id}" name="${id.split('-').pop()}"${hint ? ` aria-describedby="${id}-hint"` : ''}>${options.map(([value, text]) => `<option value="${value}"${String(value) === String(selected) ? ' selected' : ''}>${text}</option>`).join('')}</select>${hint ? `<span class="finloom-calc-hint" id="${id}-hint">${hint}</span>` : ''}</div>`,
  radios: (name, legend, options, checked) => `<fieldset class="finloom-calc-radios"><legend>${legend}</legend>${options.map(([value, text]) => `<label><input type="radio" name="${name}" value="${value}"${value === checked ? ' checked' : ''}> ${text}</label>`).join('')}</fieldset>`,
  advanced: inner => `<details class="finloom-calc-advanced"><summary>Advanced options</summary>${inner}</details>`,
  buttons,
  row: (label, key, value, extra = '') => `<div class="finloom-calc-row"${extra}><dt>${label}</dt><dd><output data-out="${key}">${value}</output></dd></div>`,
  chart: (chart, label) => `<svg class="finloom-calc-chart" role="img" aria-label="${esc(chart.desc)}" viewBox="${chart.viewBox}">${chart.svg}</svg>${label ? `<p class="finloom-calc-legend">${label}</p>` : ''}`,
  key: (key, text) => `<span><span class="finloom-calc-key finloom-calc-key--${key}"></span>${text}</span>`,
  table: (caption, headers, body) => `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(caption)}"><table${headers.length >= 5 ? ' class="finloom-calc-table--wide"' : ''}><caption>${caption}</caption><thead><tr>${headers.map((h, i) => `<th scope="col"${i ? ' class="num"' : ''}>${h}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>`,
  assumptions: items => `<h3 class="finloom-calc-subtitle">Assumptions</h3><ul class="finloom-calc-assumptions">${items.map(item => `<li>${item}</li>`).join('')}</ul>`,
  disclaimer: (tax = false) => `<div class="finloom-calc-disclaimer"><p><strong>Educational estimate only.</strong> This calculator uses the assumptions you enter to illustrate a possible financial outcome. It does not predict future investment performance, interest rates, inflation, taxes, market prices, or financial results. Actual outcomes may differ.</p>${tax ? '<p>Tax calculations are simplified estimates for educational purposes and do not replace tax advice. Federal and state rules can change, and individual circumstances vary.</p>' : ''}</div>`,
  // Inputs on the left, results on the right, then full-width chart, table, assumptions, and disclaimer.
  layout: ({ type, title, legend = 'Your Inputs', form, label, big, results, summary, wide }) => `<section class="finloom-calc finloom-calc--${type}" data-calculator="${type}" aria-label="${esc(title)}">
<h2 class="finloom-calc-title">${title}</h2>
<form class="finloom-calc-form" novalidate><fieldset><legend>${legend}</legend>${form}</fieldset>${buttons}</form>
<div class="finloom-calc-results" aria-live="polite"><p class="finloom-calc-label">${label}</p><p class="finloom-calc-big"><output data-out="big">${big}</output></p>
<p class="finloom-calc-summary" data-summary>${summary}</p><div class="finloom-calc-warning" data-warnings role="status" hidden></div>
<dl class="finloom-calc-list">${results}</dl></div>
<div class="finloom-calc-wide">${wide}</div></section>`
};

const calculators = { apy: apyCalculator, savings: savingsCalculator, drip: dripCalculator };

const toolRenderers = Object.fromEntries(await Promise.all(toolIds.map(async id => [id, (await import(`./calculators/${id}.mjs`)).default])));

// versions: { core, [toolId] } content hashes for cache-busting.
export function calculatorBlock(id, versions) {
  const key = id.trim();
  const core = `<script src="/scripts/calculators.js?v=${versions.core}" defer></script>`;
  if (calculators[key]) return `${calculators[key]()}${core}`;
  if (!toolRenderers[key]) throw new Error(`calculator "${key}" is not defined in scripts/lib/calculators.mjs or scripts/lib/calculators/`);
  return `${toolRenderers[key](tools[key], ui)}${core}<script src="/scripts/calc-${key}.js?v=${versions[key]}" defer></script>`;
}
