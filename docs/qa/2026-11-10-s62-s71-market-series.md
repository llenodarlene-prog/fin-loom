# QA and Fact-Check: S62 to S71 (2026 Market Statistics Series)

This is the final AI QA layer, run November 9 to 10, 2026, on ten time-sensitive owner-supplied posts. The owner asked for five posts on Tuesday, November 10 and five on Wednesday, November 11, with every post already scheduled from November 10 onward moved back two days.

| ID | URL | Keyword (Ubersuggest US) | Publish |
|---|---|---|---|
| S62 | /markets-stocks/stock-market-crash-2026-statistics/ | stock market crash 2026 (2,400) | 2026-11-10 |
| S63 | /markets-stocks/why-tech-stocks-fell-2026/ | why are tech stocks down (1,000) | 2026-11-10 |
| S64 | /markets-stocks/semiconductor-stocks-october-2026-statistics/ | semiconductor stocks (12,100) | 2026-11-10 |
| S65 | /markets-stocks/magnificent-seven-2026-selloff-statistics/ | magnificent 7 stocks (12,100) | 2026-11-10 |
| S66 | /markets-stocks/sector-rotation-october-2026-statistics/ | sector rotation (590) | 2026-11-10 |
| S67 | /markets-stocks/market-breadth-statistics-2026/ | market breadth (720) | 2026-11-11 |
| S68 | /markets-stocks/stock-market-return-by-year/ | stock market return by year (1,000) | 2026-11-11 |
| S69 | /markets-stocks/stock-market-crash-history-statistics/ | stock market crash history (1,000) | 2026-11-11 |
| S70 | /markets-stocks/vix-index-statistics-2026/ | vix index (135,000) | 2026-11-11 |
| S71 | /investing/buy-the-dip-statistics/ | buy the dip (4,400) | 2026-11-11 |

## Schedule shift

These posts moved back two days, in both their front matter and the plan:
- S45 and S47 move to November 12.
- S42 and S50 move to November 13.
- S48 and S51 move to November 14.
- S52 and S53 move to November 15.
- S60 and S61 move to November 16.
- S56 and S57 move to November 17.
- S58 and S59 move to November 18.
- S55 moves to November 19.

The November 9 posts stayed live.

## Sources and verification

- **Checked against primary or first-hand sources:**
  - **Janus Henderson's October 2026 review:** the October index returns, six sector returns, the Russell style indexes and the semiconductor index (SOX) at −15.3%.
  - **J.P. Morgan's monthly review:** the October moves for Nvidia, Broadcom, Alphabet and Meta, the Asian market returns and developed-market sector returns.
  - **FRED daily closes:**
    - S&P 500, Nasdaq Composite, Nasdaq-100 and Dow.
    - VIX closes from October 30 to November 5.
    - These were used to recalculate the October changes, the November 5 drops, the Nasdaq's distance from its October 6 record (−11.9%), and the VIX history table.
  - **Federal Reserve History:** the 1929 and 1987 crash essays.
  - **Damodaran (NYU Stern):** the annual S&P 500 returns for 1928 to 2025, plus our own calculations of the averages, decade returns and count of negative years.
  - **FINRA:** the definition of dollar-cost averaging.
- **Owner-verified because automated access was blocked:** these figures are attributed in each post with their source and date.
  - **Nasdaq's October review:** the Magnificent Seven index at −4.7%, the Dow at +1.8%, five sector returns (Materials, Financials, Real Estate, Consumer Discretionary, Industrials), the moving-average breadth figures (21% to 61% and 43% to 62%), and earnings growth of 30.2%.
  - **AP:** the November 5 single-stock moves for Nvidia (−9.3%) and AMD (−17.3%), and the Russell 2000 at −4.4%.
  - **Reuters:** the reported causes, attributed in the text.
  - **YCharts:** the November 6 VIX close of 25.64. It should be re-checked once FRED posts it.

## Replaced or removed

- **Slickcharts annual returns** (blocked): replaced with Damodaran's series. The values differ slightly, for example 2008 is −36.55%, not −37.00%.
- **Investor.gov** (blocked): replaced with FINRA.
- **The Schwab sector claim** (schwab.com blocked): removed.
- **Unsourced claims dropped:** that the S&P 500 sits about "a few percentage points" from a correction, and a general claim about sector-timing research.
- **Janus Henderson link:** its URL contains "mattered", which trips the owner's no-"matter" style check. The source is cited by name without a link, and the check was left unchanged.

## Links and silo

- **Spoke links:** each spoke links to its main topic page and two related posts.
- **Pillar links:** stock analysis fundamentals (S16) now links to all nine markets posts, and crypto vs stocks (S6) links to S71.
- **Silo check:** `check:silo` passes on every date from November 10 to November 19.

## Images

All ten posts use featured images supplied by the owner on November 9. They are cropped to 16:9 at 1,600 and 800 pixels wide and registered in `data/assets.json` with alt text.

## Checks

- **`npm run verify`:** passes, both as is and with `PUBLISH_DATE=2026-11-19`.
- **Content check:** passes for all ten. Each post is at least 2,500 words with 8 or more uses of its exact keyword.
- **Status:** PASS. Scheduled on the owner's instruction of November 9.

## Not done

Staggered publish times were requested, but changing the publish workflow from daily to hourly was blocked by the session's permission check. It needs the owner's approval to change.
