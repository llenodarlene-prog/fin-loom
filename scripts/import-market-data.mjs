import { readFile, writeFile } from 'node:fs/promises';

// Builds data/market-data.json from the raw CSV files in data/source/market/. Each file is an
// unedited download of one official series from FRED (Federal Reserve Bank of St. Louis).
// To refresh: replace the CSV files, update `retrieved`, run this script, and review the diff.
const retrieved = process.argv[2] || '2026-10-03';
const from = '2015-01-01';
const series = [
  { id: 'ECOMPCTSA', key: 'ecommerce-share', title: 'E-Commerce Retail Sales as a Percent of Total Sales', units: 'Percent, Seasonally Adjusted', frequency: 'Quarterly', agency: 'U.S. Census Bureau', release: 'Quarterly Retail E-Commerce Sales' },
  { id: 'A679RC1Q027SBEA', key: 'technology-investment', title: 'Private fixed investment in information processing equipment and software', units: 'Billions of Dollars, Seasonally Adjusted Annual Rate', frequency: 'Quarterly', agency: 'U.S. Bureau of Economic Analysis', release: 'Gross Domestic Product' },
  { id: 'PSAVERT', key: 'personal-saving-rate', title: 'Personal Saving Rate', units: 'Percent, Seasonally Adjusted Annual Rate', frequency: 'Monthly', agency: 'U.S. Bureau of Economic Analysis', release: 'Personal Income and Outlays' }
];
const output = {};
for (const item of series) {
  const file = `data/source/market/${item.id}.csv`;
  const [header, ...lines] = (await readFile(file, 'utf8')).trim().split(/\r?\n/);
  if (header !== `observation_date,${item.id}`) throw new Error(`${file}: unexpected header ${header}`);
  const points = lines.map(line => line.split(',')).filter(([date, value]) => date >= from && value !== '' && value !== '.').map(([date, value]) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Number(value))) throw new Error(`${file}: bad row ${date},${value}`);
    return [date, Number(value)];
  });
  if (points.length < 20) throw new Error(`${file}: too few observations`);
  const { key, ...meta } = item;
  output[key] = { ...meta, source_url: `https://fred.stlouisfed.org/series/${item.id}`, raw_file: file, retrieved, points };
}
await writeFile('data/market-data.json', JSON.stringify(output, null, 1) + '\n');
console.log(Object.entries(output).map(([key, value]) => `${key}: ${value.points.length} observations, latest ${value.points.at(-1).join(' = ')}`).join('\n'));
