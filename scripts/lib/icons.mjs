// Inline Tabler icons (MIT, https://github.com/tabler/tabler-icons; licence in src/icons/tabler/LICENSE).
// Only the icons the site uses are vendored. Icons render inline, so pages make no extra requests.
import { readFileSync, readdirSync } from 'node:fs';

const dir = new URL('../../src/icons/tabler/', import.meta.url);
const shapes = Object.fromEntries(readdirSync(dir).filter(name => name.endsWith('.svg')).map(name => {
  const body = readFileSync(new URL(name, dir), 'utf8').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<path stroke="none" d="M0 0h24v24H0z" fill="none" \/>/, '').replace(/\s*\n\s*/g, '');
  return [name.slice(0, -4), body];
}));

export function icon(name, className = '') {
  if (!shapes[name]) throw new Error(`icon "${name}" is not vendored in src/icons/tabler/`);
  return `<svg class="ti${className ? ` ${className}` : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${shapes[name]}</svg>`;
}

// One icon per calculator and per hub category.
export const toolIcons = {
  apy: 'percentage', savings: 'pig-money', drip: 'repeat', inflation: 'receipt-2', 'daily-compound': 'calendar-stats',
  'investment-growth': 'chart-line', 'dividend-return': 'coins', withdrawal: 'wallet', 'capital-gains': 'receipt-tax',
  'stock-average': 'chart-candle', 'stock-profit': 'report-money', 'credit-card-payoff': 'credit-card',
  'mortgage-payoff': 'home-dollar', 'withdrawal-tax': 'building-bank', 'self-employment-tax': 'briefcase', 'tax-1099': 'file-invoice'
};

// Result tiles pick an icon from their label.
const metricRules = [
  [/tax|withh|penalt/i, 'receipt-tax'], [/date|month|year|sooner|time|last/i, 'calendar'], [/rate|yield|%|percent|return|apy|inflation|share of/i, 'percentage'],
  [/interest/i, 'trending-up'], [/saved|saving|gain|growth/i, 'circle-check'], [/loss|cut|change/i, 'trending-down'],
  [/share|stock|price/i, 'chart-candle'], [/dividend/i, 'coins'], [/contribut|deposit|payment|paid|withdraw/i, 'cash'],
  [/cpi|index/i, 'chart-bar'], [/fee/i, 'receipt']
];
export const metricIcon = label => (metricRules.find(([re]) => re.test(label)) || [null, 'coin'])[1];
