# Fin Loom Calculator Suite

Built from the owner's master development brief (2026-10-28). Each calculator is a static page with no dependencies and no network requests. The build renders each calculator with its default results already filled in, and the browser script then takes over for live updates.

## Architecture

| Part | Location |
|---|---|
| Shared toolkit (formatting, range validation, SVG line chart, debounced live updates, registry) | `src/scripts/calculators.js` (`FinLoomCalc`). The APY, savings, and DRIP calculators also live here. |
| One script per tool, holding the engine, display text, and browser UI | `src/scripts/calc-<id>.js` |
| Server markup per tool | `scripts/lib/calculators/<id>.mjs`, built with the shared `ui` helpers and `ui.layout` from `scripts/lib/calculators.mjs` |
| Shared styles | `src/styles/main.css`, under `.finloom-calc` |
| Tests | `tests/calc-<id>.test.mjs`, which run in `npm run verify` |

To place a tool on a page, add a fenced block containing its id, for example ```` ```calculator\ninflation\n``` ````. The build loads `calculators.js` and `calc-<id>.js`, with content-hash cache busting.

## Calculators

| Tool | Page | Method notes |
|---|---|---|
| Inflation | `/money-banking/inflation-calculator/` | Uses the embedded BLS CPI-U monthly index, January 1913 to September 2026, via FRED CPIAUCNS. Annual averages are rounded as BLS publishes them. October 2025 is missing because of the lapse in appropriations. |
| Daily Compound Interest | `/money-banking/daily-compound-interest-calculator/` | A = P(1 + r/n)^(nt), with t = days/365. Uses a daily equivalent factor, and contributions grow from the day they are added. Compares daily, monthly, and annual compounding. |
| Investment Growth | `/investing/investment-growth-calculator/` | Monthly engine using the equivalent monthly rate. Supports contribution timing, an annual contribution increase, and an inflation-adjusted value. Scenario cards show the base rate and plus or minus 2 percentage points. |
| Dividend Reinvestment | `/investing/dividend-reinvestment-plan-calculator/` | See `dividend-reinvestment-calculator.md`. |
| Dividend Total Return | `/investing/dividend-total-return-calculator/` | Price gain plus dividends, minus fees. Starting value includes fees. The optional reinvestment buys at the average of the purchase and current price. |
| Investment Withdrawal | `/investing/investment-withdrawal-calculator/` | Mode A runs a monthly depletion simulation, capped at 100 years. Mode B uses the annuity formula, cross-checked against the simulation ending at $0. Sequence-of-returns risk is not modeled. |
| Capital Gains Tax | `/investing/capital-gains-tax-calculator/` | 2026 brackets from IRS Rev. Proc. 2025-32 for all four filing statuses. Tax on the gain is tax with the gain minus tax without it. Long-term gains and qualified dividends are stacked on ordinary income. State tax, NIIT, and the 25%/28% gain categories are excluded. |
| Credit Card Debt Payoff | `/money-banking/credit-card-payoff-calculator/` | Monthly engine: interest = balance × APR/12. Compares minimum only, +$50, +$100, and a custom amount. Warns when the payment does not cover interest. Capped at 600 months. |
| Mortgage Payoff | `/money-banking/mortgage-payoff-calculator/` | Standard amortization with extra monthly and one-time payments. Shows the original vs new payoff date and interest saved. Escrow is excluded. |
| 401(k) Withdrawal Tax | `/investing/401k-withdrawal-tax-calculator/` | 2026 brackets. Tax on the withdrawal = tax with it − tax without it. Applies the 10% additional tax before 59½, with an exceptions toggle (IRS Topic 558). Shows the 20% withholding (Topic 413). |
| Self-Employment Tax | `/money-banking/self-employment-tax-calculator/` | 15.3% on 92.35% of net earnings (Topic 554), with a $400 minimum. The 2026 Social Security wage base is $184,500 (Topic 751), reduced by W-2 wages. Includes the 0.9% Additional Medicare Tax (Topic 560). |
| 1099 Tax | `/money-banking/1099-tax-calculator/` | SE tax plus the income-tax increase after half the SE tax and the 2026 standard deduction. Shows a set-aside %, with quarterly figures as total ÷ 4. QBI is not modeled. |
| Stock Average Cost | `/markets-stocks/stock-average-calculator/` | Average cost = Σ(shares × price + fees) ÷ Σ shares. Takes 2 to 50 purchase rows. An optional current price gives the gain or loss and break-even price. |
| Stock Profit | `/markets-stocks/stock-profit-calculator/` | Net profit = (sell × shares − sell fees) − (buy × shares + buy fees). Break-even = (cost basis + sell fees) ÷ shares. |

The hub page is `/tools/`.

## QA

Every tool has unit tests with hand-verified figures and edge cases: zeros, minimum and maximum values, decimals, negative values where allowed, long horizons, and extreme-value warnings.

Each page was also checked in Chromium at 1280, 768, 375, and 320 px, with no console errors, no NaN, Infinity, or undefined, and no page-level horizontal scrolling. Invalid inputs show inline errors and keep the last valid result. Reset restores the defaults.

Only Chromium was automated here. Safari and Firefox need a manual check.
