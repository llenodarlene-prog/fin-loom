import { escapeHtml } from './content.mjs';

// Charts for the designed pages. Two kinds, and nothing else:
//   data          an official published series from data/market-data.json, shown with its source
//   illustration  arithmetic computed here from stated assumptions
// No chart is ever drawn from invented or estimated market figures.
const usd = value => `$${(Math.round(value / 100) * 100).toLocaleString('en-US')}`;
const pct = value => `${Number(value.toFixed(1)).toLocaleString('en-US')}%`;
const billions = value => `$${Math.round(value).toLocaleString('en-US')} billion`;
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const longDate = date => `${months[Number(date.slice(5, 7)) - 1]} ${Number(date.slice(8, 10))}, ${date.slice(0, 4)}`;
const period = (date, frequency) => frequency === 'Quarterly' ? `Q${Math.floor((Number(date.slice(5, 7)) - 1) / 3) + 1} ${date.slice(0, 4)}` : `${months[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}`;

const W = 560, H = 300, PAD = { l: 56, r: 18, t: 18, b: 38 };
const plotW = W - PAD.l - PAD.r, plotH = H - PAD.t - PAD.b;
const frame = (title, desc, body) => `<svg class="ill-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeHtml(`${title}. ${desc}`)}">${body}</svg>`;
const gridLines = (ticks, max, format) => ticks.map(tick => {
  const y = PAD.t + plotH - (tick / max) * plotH;
  return `<line class="ill-grid" x1="${PAD.l}" x2="${W - PAD.r}" y1="${y}" y2="${y}"/><text class="ill-axis" x="${PAD.l - 10}" y="${y + 4}" text-anchor="end">${format(tick)}</text>`;
}).join('');

function lineChart({ title, desc, series, max, ticks, xLabels, format }) {
  const steps = series[0].values.length - 1;
  const point = (value, i) => `${(PAD.l + (i / steps) * plotW).toFixed(1)},${(PAD.t + plotH - (value / max) * plotH).toFixed(1)}`;
  const lines = series.map((item, index) => {
    const path = item.values.map(point).join(' ');
    const area = index === 0 ? `<polygon class="ill-area" points="${PAD.l},${PAD.t + plotH} ${path} ${W - PAD.r},${PAD.t + plotH}"/>` : '';
    const [x, y] = point(item.values.at(-1), steps).split(',');
    return `${area}<polyline class="ill-line ill-line--${index}" pathLength="1" points="${path}"/><circle class="ill-dot ill-line--${index}" cx="${x}" cy="${y}" r="4.5"/>`;
  }).join('');
  const labels = xLabels.map(({ at, text }) => `<text class="ill-axis" x="${PAD.l + (at / steps) * plotW}" y="${H - 12}" text-anchor="middle">${escapeHtml(text)}</text>`).join('');
  return frame(title, desc, gridLines(ticks, max, format) + lines + labels);
}

function barChart({ title, desc, bars, max, ticks, format }) {
  const slot = plotW / bars.length, width = Math.min(64, slot * 0.56);
  const body = bars.map((bar, i) => {
    const height = (bar.value / max) * plotH, x = PAD.l + slot * i + (slot - width) / 2, y = PAD.t + plotH - height;
    return `<rect class="ill-bar" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${width.toFixed(1)}" height="${height.toFixed(1)}" rx="6"/><text class="ill-value" x="${(x + width / 2).toFixed(1)}" y="${(y - 8).toFixed(1)}" text-anchor="middle">${escapeHtml(bar.display)}</text><text class="ill-axis" x="${(x + width / 2).toFixed(1)}" y="${H - 12}" text-anchor="middle">${escapeHtml(bar.label)}</text>`;
  }).join('');
  return frame(title, desc, gridLines(ticks, max, format) + body);
}

// A published series: every number on the panel comes from the stored observations.
function dataPanel(id, series, { tab, heading, format, axis, max, ticks, sentence }) {
  const points = series.points, first = points[0], last = points.at(-1);
  const peak = points.reduce((best, point) => point[1] > best[1] ? point : best);
  const when = date => period(date, series.frequency);
  const yearStarts = points.map(([date], i) => ({ date, i })).filter(({ date }) => date.slice(5, 7) === '01' && Number(date.slice(0, 4)) % 2 === 1);
  const yearEnds = [...new Map(points.map(point => [point[0].slice(0, 4), point])).values()];
  return {
    id, kind: 'data', label: 'Official data', tab, title: heading,
    takeaway: sentence({ first, last, peak, when, format }),
    legend: [{ label: `Latest, ${when(last[0])}`, value: format(last[1]) }, { label: when(first[0]), value: format(first[1]) }],
    headers: ['Period', series.units.split(',')[0]],
    rows: yearEnds.map(([date, value]) => [when(date), format(value)]),
    footnote: `<strong>Source:</strong> ${escapeHtml(series.agency)}, ${escapeHtml(series.release)}. Series: <a href="${escapeHtml(series.source_url)}" rel="noopener">${escapeHtml(series.title)}</a> (${escapeHtml(series.id)}), ${escapeHtml(series.units.toLowerCase())}, retrieved from FRED on ${longDate(series.retrieved)}. Latest figure: ${when(last[0])}. The source agency revises these figures.`,
    svg: lineChart({ title: series.title, desc: `${when(first[0])}: ${format(first[1])}. ${when(last[0])}: ${format(last[1])}`, series: [{ values: points.map(point => point[1]) }], max, ticks, format: axis, xLabels: yearStarts.map(({ date, i }) => ({ at: i, text: date.slice(0, 4) })) })
  };
}

const illustrationNote = assumptions => `<strong>Assumptions:</strong> ${escapeHtml(assumptions)} Arithmetic illustration: not a forecast, not advice, and not the return of any product.`;

function illustrationPanels() {
  const principal = 10000, growth = 0.06, years = 30, costs = [0.001, 0.01];
  const feeSeries = costs.map(cost => ({ cost, values: Array.from({ length: years + 1 }, (_, t) => principal * (1 + growth - cost) ** t) }));
  const [low, high] = feeSeries.map(item => item.values.at(-1));
  const losses = [10, 20, 30, 40, 50].map(loss => ({ loss, gain: (loss / (100 - loss)) * 100 }));
  const inflation = 0.03;
  const power = [0, 10, 20, 30].map(t => ({ t, value: principal / (1 + inflation) ** t }));
  const thousands = value => `$${value / 1000}k`;
  return {
    costs: {
      id: 'costs', kind: 'illustration', label: 'Illustration', tab: 'Costs Compound', title: 'The Same Growth, Two Different Costs',
      takeaway: `After ${years} years the two balances are about ${usd(low - high)} apart, on the same ${usd(principal)} and the same assumed growth.`,
      footnote: illustrationNote(`${usd(principal)} invested once, ${pct(growth * 100)} assumed annual growth before costs, annual costs of ${pct(costs[0] * 100)} and ${pct(costs[1] * 100)}, no taxes or further contributions.`),
      legend: feeSeries.map(item => ({ label: `${pct(item.cost * 100)} annual cost`, value: usd(item.values.at(-1)) })),
      headers: ['Year', ...costs.map(cost => `${pct(cost * 100)} cost`)],
      rows: [0, 10, 20, 30].map(t => [String(t), ...feeSeries.map(item => usd(item.values[t]))]),
      svg: lineChart({ title: 'Balance over 30 years at two cost levels', desc: `Ends near ${usd(low)} and ${usd(high)}`, series: feeSeries, max: 60000, ticks: [0, 20000, 40000, 60000], format: thousands, xLabels: [0, 10, 20, 30].map(t => ({ at: t, text: t === 0 ? 'Start' : `Year ${t}` })) })
    },
    losses: {
      id: 'losses', kind: 'illustration', label: 'Illustration', tab: 'Losses Need Larger Gains', title: 'The Gain Needed to Recover a Loss',
      takeaway: `A ${losses.at(-1).loss}% loss needs a ${pct(losses.at(-1).gain)} gain to return to the starting value. The deeper the fall, the steeper the climb.`,
      footnote: illustrationNote('Gain needed equals the loss divided by one minus the loss. This applies to any price series.'),
      headers: ['Loss', 'Gain needed to recover'],
      rows: losses.map(item => [`${item.loss}%`, pct(item.gain)]),
      svg: barChart({ title: 'Gain needed to recover from a loss', desc: losses.map(item => `${item.loss}% loss needs ${pct(item.gain)}`).join(', '), bars: losses.map(item => ({ label: `-${item.loss}%`, value: item.gain, display: `+${pct(item.gain)}` })), max: 110, ticks: [0, 50, 100], format: value => `${value}%` })
    },
    inflation: {
      id: 'inflation', kind: 'illustration', label: 'Illustration', tab: 'Inflation Erodes Cash', title: 'What Unchanged Cash Still Buys',
      takeaway: `At ${pct(inflation * 100)} inflation, ${usd(principal)} held as cash has the purchasing power of about ${usd(power[2].value)} in today's money after 20 years.`,
      footnote: illustrationNote(`${usd(principal)} earning no interest, with prices rising ${pct(inflation * 100)} every year. Real inflation varies from year to year.`),
      headers: ['Year', 'Purchasing power'],
      rows: power.map(item => [String(item.t), usd(item.value)]),
      svg: barChart({ title: 'Purchasing power of unchanged cash', desc: power.map(item => `year ${item.t}: ${usd(item.value)}`).join(', '), bars: power.map(item => ({ label: item.t === 0 ? 'Today' : `Year ${item.t}`, value: item.value, display: usd(item.value) })), max: 11000, ticks: [0, 5000, 10000], format: thousands })
    }
  };
}

// Every chart the designed pages can show, keyed by id.
export function buildCharts(market) {
  return {
    'ecommerce-share': dataPanel('ecommerce-share', market['ecommerce-share'], {
      tab: 'E-Commerce', heading: 'E-Commerce as a Share of U.S. Retail Sales', format: pct, axis: value => `${value}%`, max: 20, ticks: [0, 5, 10, 15, 20],
      sentence: ({ first, last, when, format }) => `Online sales made up ${format(last[1])} of U.S. retail sales in ${when(last[0])}, compared with ${format(first[1])} in ${when(first[0])}.`
    }),
    'technology-investment': dataPanel('technology-investment', market['technology-investment'], {
      tab: 'Technology Investment', heading: 'U.S. Investment in Information Technology', format: billions, axis: value => `$${value}bn`, max: 2000, ticks: [0, 500, 1000, 1500, 2000],
      sentence: ({ first, last, when, format }) => `Private investment in information processing equipment and software ran at an annual rate of ${format(last[1])} in ${when(last[0])}, compared with ${format(first[1])} in ${when(first[0])}. The figures are not adjusted for inflation.`
    }),
    'personal-saving-rate': dataPanel('personal-saving-rate', market['personal-saving-rate'], {
      tab: 'Saving Rate', heading: 'The U.S. Personal Saving Rate', format: pct, axis: value => `${value}%`, max: 40, ticks: [0, 10, 20, 30, 40],
      sentence: ({ last, peak, when, format }) => `Households saved ${format(last[1])} of disposable income in ${when(last[0])}. The highest reading since 2015 was ${format(peak[1])} in ${when(peak[0])}.`
    }),
    ...illustrationPanels()
  };
}

const table = panel => `<details class="ill-data"><summary>View the numbers</summary><div class="table-wrap"><table><thead><tr>${panel.headers.map(cell => `<th>${escapeHtml(cell)}</th>`).join('')}</tr></thead><tbody>${panel.rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`;
const legend = panel => panel.legend ? `<ul class="ill-legend">${panel.legend.map((item, i) => `<li><span class="ill-swatch ill-line--${i}"></span>${escapeHtml(item.label)}<strong>${escapeHtml(item.value)}</strong></li>`).join('')}</ul>` : '';

// Chart module. Several panels become tabs; without JavaScript every panel is shown in sequence.
export function renderLab(panels) {
  const tabbed = panels.length > 1;
  return `<div class="lab glass"${tabbed ? ' data-tabs' : ''}>
    ${tabbed ? `<div class="lab-tabs" role="tablist" aria-label="Charts">
      ${panels.map((panel, i) => `<button type="button" role="tab" id="tab-${panel.id}" aria-controls="panel-${panel.id}" aria-selected="${i === 0}"${i === 0 ? '' : ' tabindex="-1"'}>${escapeHtml(panel.tab)}</button>`).join('')}
    </div>` : ''}
    ${panels.map(panel => `<div class="lab-panel"${tabbed ? ` role="tabpanel" id="panel-${panel.id}" aria-labelledby="tab-${panel.id}"` : ''}>
      <p class="lab-kind lab-kind--${panel.kind}">${escapeHtml(panel.label)}</p>
      <h3>${escapeHtml(panel.title)}</h3>
      <p class="lab-takeaway">${escapeHtml(panel.takeaway)}</p>
      ${legend(panel)}
      <div class="ill-chart" data-draw>${panel.svg}</div>
      <p class="ill-assumptions">${panel.footnote}</p>
      ${table(panel)}
    </div>`).join('')}
  </div>`;
}

// Chart card for the home hero.
export function renderHeroCard(panel) {
  return `<aside class="hero-card glass" aria-label="${escapeHtml(panel.title)}">
    <p class="hero-card-label">${escapeHtml(panel.title)}</p>
    <p class="lab-kind lab-kind--${panel.kind}">${escapeHtml(panel.label)}</p>
    <p class="hero-card-takeaway">${escapeHtml(panel.takeaway)}</p>
    <div class="ill-chart" data-draw>${panel.svg}</div>
    ${legend(panel)}
    <p class="hero-card-note">${panel.footnote.replace(/<a [^>]*>|<\/a>/g, '').replace(/ The source agency revises these figures\.$/, '')}</p>
  </aside>`;
}
