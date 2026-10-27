// Server-rendered calculator markup. Default results are computed with the same engine the browser
// uses (src/scripts/calculators.js), so the page shows correct figures before or without JavaScript.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// The browser script is a classic script; run it in a sandbox with a CommonJS-style module object.
const sandbox = { module: { exports: {} }, Math, Number, Intl, globalThis: {} };
vm.runInNewContext(readFileSync(new URL('../../src/scripts/calculators.js', import.meta.url), 'utf8'), sandbox);
export const engine = sandbox.module.exports;
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = value => `${(value * 100).toFixed(3)}%`;
const disclaimer = '<p class="finloom-calc-note">This calculator provides estimates for educational purposes. Actual interest earnings may differ because rates, balances, fees, account terms, and contribution timing can change.</p>';
const field = (id, label, attrs, hint = '') => `<div class="finloom-calc-field"><label for="${id}">${label}</label><input id="${id}" name="${id.split('-').pop()}" inputmode="decimal" type="number" ${attrs}>${hint ? `<span class="finloom-calc-hint">${hint}</span>` : ''}<span class="finloom-calc-error" data-error-for="${id}" aria-live="polite"></span></div>`;
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
  const o = { shares: 100, price: 50, dividend: 0.5, frequency: 4, dividendGrowth: 0, priceGrowth: 0, years: 5, monthly: 0, reinvest: true };
  const d = engine.dripGrowth(o);
  const cash = engine.dripGrowth({ ...o, reinvest: false });
  const count = new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  const options = [[12, 'Monthly'], [4, 'Quarterly'], [2, 'Semiannual'], [1, 'Annual']].map(([n, label]) => `<option value="${n}"${n === 4 ? ' selected' : ''}>${label}</option>`).join('');
  const note = '<p class="finloom-calc-note">This calculator shows an illustration for educational purposes, not a forecast. It assumes steady price and dividend growth and ignores taxes, fees, and plan execution rules. Dividends can be cut, and actual results can differ.</p>';
  return `<div class="finloom-calc" data-calculator="drip">
<form class="finloom-calc-form" novalidate><fieldset><legend>Your Holding</legend>
${field('drip-shares', 'Starting number of shares', 'min="0" max="10000000" step="0.001" value="100" required')}
${field('drip-price', 'Starting share price ($)', 'min="0.01" max="1000000" step="0.01" value="50" required')}
${field('drip-dividend', 'Dividend per share, per payment ($)', 'min="0" max="10000" step="0.0001" value="0.50" required')}
<div class="finloom-calc-field"><label for="drip-frequency">Dividend frequency</label><select id="drip-frequency" name="frequency">${options}</select></div>
${field('drip-dgrowth', 'Annual dividend growth (%)', 'min="-50" max="50" step="0.1" value="0"', 'Use 0 to assume no change. Negative values model cuts.')}
${field('drip-pgrowth', 'Annual share-price growth (%)', 'min="-50" max="50" step="0.1" value="0"')}
${field('drip-years', 'Number of years', 'min="1" max="50" step="1" value="5" required')}
${field('drip-monthly', 'Additional monthly investment ($, optional)', 'min="0" max="1000000" step="0.01" value="0"')}
<div class="finloom-calc-field finloom-calc-check"><label><input type="checkbox" id="drip-reinvest" name="reinvest" checked> Reinvest dividends</label></div>
</fieldset>${buttons}</form>
<section class="finloom-calc-results" aria-label="Dividend reinvestment results"><p class="finloom-calc-label">Ending portfolio value</p><p class="finloom-calc-big"><output data-out="end">${money.format(d.end)}</output></p>
<dl class="finloom-calc-list">${row('Ending share count', 'shares', count.format(d.shares))}${row('Total dividends generated', 'dividends', money.format(d.dividends))}${row('Dividends reinvested', 'reinvested', money.format(d.reinvested))}${row('Annual dividend income at the end', 'income', money.format(d.income))}${row('Outside contributions', 'contributions', money.format(d.contributions))}${row('Growth from reinvesting vs taking cash', 'gain', money.format(d.end - cash.end))}</dl>
<p class="finloom-calc-summary" data-summary aria-live="polite">100.000 shares at $50.00 with dividends reinvested grow to ${count.format(d.shares)} shares worth ${money.format(d.end)} after 5 years, under these assumptions.</p>
<svg class="finloom-calc-chart" role="img" aria-label="Annual dividend income and cumulative dividends reinvested by year" viewBox="0 0 600 260"></svg>
<p class="finloom-calc-legend"><span class="finloom-calc-key finloom-calc-key--balance"></span>Annual dividend income <span class="finloom-calc-key finloom-calc-key--contributions"></span>Cumulative dividends reinvested</p>
<div class="table-wrap"><table><caption>Year-by-year dividend reinvestment</caption><thead><tr><th scope="col">Year</th><th scope="col" class="num">Starting Shares</th><th scope="col" class="num">Dividends Paid</th><th scope="col" class="num">Dividends Reinvested</th><th scope="col" class="num">New Shares</th><th scope="col" class="num">Ending Shares</th><th scope="col" class="num">Contributions</th><th scope="col" class="num">Ending Value</th></tr></thead><tbody>${d.rows.map(r => `<tr><th scope="row">${r.year}</th><td class="num">${count.format(r.startShares)}</td><td class="num">${money.format(r.dividends)}</td><td class="num">${money.format(r.reinvested)}</td><td class="num">${count.format(r.newShares)}</td><td class="num">${count.format(r.endShares)}</td><td class="num">${money.format(r.contributions)}</td><td class="num">${money.format(r.end)}</td></tr>`).join('')}</tbody></table></div>
${note}</section></div>`;
}

const calculators = { apy: apyCalculator, savings: savingsCalculator, drip: dripCalculator };

export function calculatorBlock(id, version) {
  const render = calculators[id.trim()];
  if (!render) throw new Error(`calculator "${id.trim()}" is not defined in scripts/lib/calculators.mjs`);
  return `${render()}<script src="/scripts/calculators.js?v=${version}" defer></script>`;
}
