# Dividend Reinvestment Calculator

Built from the owner's development brief (2026-10-27) for `/investing/dividend-reinvestment-plan-calculator/`.

## Installation and File Locations

The calculator uses the site's existing calculator system. It needs no npm packages, external scripts, CDN, API, or backend. The page loads only one same-origin script.

| Part | File |
|---|---|
| Engine, display text, chart, and browser UI (vanilla JS) | `src/scripts/calculators.js` (published as `/scripts/calculators.js`) |
| Server-rendered markup with default results | `scripts/lib/calculators.mjs` (`dripCalculator`) |
| Styles, scoped under `.finloom-calc--drip` / `.finloom-drip-calculator` | `src/styles/main.css` |
| Tests | `tests/calculators.test.mjs` |

To place it on a page, add this fence to the Markdown:

````
```calculator
drip
```
````

The build renders the full calculator with the default example already computed, so results, chart, and table show before JavaScript runs. It also adds `<script src="/scripts/calculators.js" defer>`.

## Calculation Methodology

The engine is a monthly simulation (`dripGrowth`). For each month:

1. Buy shares with a beginning-of-month contribution, if that timing is selected.
2. In a dividend month, pay `shares × dividend per share`. Reinvest it at the current price, or keep it as cash when reinvestment is off.
3. Buy shares with an end-of-month contribution, if that timing is selected.
4. Move the price by the equivalent monthly rate, `(1 + annual rate)^(1/12) − 1`, never the annual rate divided by 12.
5. At each year end, save a snapshot. Then apply the annual dividend growth for the next year, clamped at zero.

Dividend months are standardized: monthly every month; quarterly in months 3, 6, 9, and 12; semiannual in 6 and 12; annual in 12. Nothing is rounded inside the simulation. Values are rounded only for display, using `Intl.NumberFormat('en-US')`.

Outputs:

- **Ending value:** shares × price, plus any cash dividends and any contributions held as uninvested cash.
- **Ending annual dividend income:** shares × ending dividend per share × payments per year.
- **Capital invested:** starting value plus contributions.
- **Investment growth:** ending value minus capital invested.
- **Projected yield on contributed capital:** income ÷ capital invested.
- **Growth from reinvesting vs taking cash:** compares the same inputs with reinvestment turned off.

## Assumptions

Each of these is shown to readers in the assumptions panel:

- Dividend and price growth are constant.
- Payment months are standardized.
- Fractional shares are available.
- Fees and taxes are excluded.
- Dividends can be cut.

## Known Limitations

- **Fixed rates:** real prices and dividends do not follow a fixed rate, and real payment dates vary.
- **No dividend record dates:** a contribution made in a dividend month receives that month's dividend.
- **Price reaching zero:** if the price reaches zero (for example −100% annual change), purchases stop. Later dividends and contributions are held as cash, and a warning is shown.
- **Very large projections:** projections above $1 quadrillion show the brief's "unrealistically large projection" warning.

## Test Results

`node --test tests/calculators.test.mjs` passes all 10 test cases in the brief:

- No dividend: $5,000.
- No reinvestment: $200 dividends, 100 shares, a $5,000 stock value and a $5,200 combined value.
- Reinvestment: more than 104 shares.
- Contributions only: $1,200 and 24 shares.
- Negative growth: stays finite.
- Dividend cut: dividend declines to a floor of zero.
- Zero starting shares: works with contributions.
- 50 years: finishes in under 100 ms.
- Reinvestment toggle: changes shares, income, and value.
- Fractional shares: $25 at $80 = 0.3125 shares.

It also checks:

- The equivalent monthly price rate: 12 months at 4% gives exactly $52.
- Contribution timing.
- The zero-price and too-large warnings.
- The result sentence.

The default example (100 shares, $50, $0.50 quarterly, 3% dividend growth, 4% price change, 20 years) gives 203.900 shares, $22,338.45, and $715.08 of annual dividend income.

Browser check (Chromium at 1280, 375, and 320 px):

- All inputs, reinvestment toggle, contribution timing, validation messages, warnings, and reset work.
- No NaN, Infinity, undefined, or scientific notation appears.
- There is no page-level horizontal scrolling.
- The table scrolls inside its own container on mobile.
