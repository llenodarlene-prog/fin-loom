# QA: posts scheduled for October 12 and 13, 2026

Final QA pass on 2026-10-12, after the owner's own fact-check and QA. Each post was run through `npm run check:content` as if published and checked by hand against its sources.

| ID | Post | URL | Words | Editorial checks |
| --- | --- | --- | --- | --- |
| S16 | Stock Analysis Fundamentals | `/markets-stocks/stock-analysis-fundamentals/` | 2,541 | Pass |
| S17 | Top Rated Stock Screener Comparison | `/markets-stocks/best-stock-screeners-compared/` | 2,572 | Pass |
| S18 | Stock Research Analyst | `/markets-stocks/stock-research-analyst-role/` | 2,523 | Pass |
| S19 | Explain Per Capita GDP | `/investing/per-capita-gdp-explained/` | 3,382 | Pass |

## Factual corrections

- **S16, Microsoft net income.** The draft credited net income rising faster than revenue to operating leverage. The 10-K attributes much of the 31% net income rise to a $5.0 billion gain on the OpenAI investment, after a $3.6 billion reduction the year before. The post now says so.
- **S17, Yahoo Finance prices.** $7.95, $19.95, and $39.95 are monthly equivalents of annual prices ($95.40, $239.40, $479.40 a year), not monthly prices with an annual discount. Corrected in the text, tables, and chart.
- **S18, BLS projections.** 377,200 to 404,300 jobs is the 2025 to 2035 projection, not 2024 to 2034. BLS publishes the growth as 7%. The 24,700 annual openings figure did not match the current BLS page and was removed.
- **S18, Series 86 exemption.** FINRA's exemption for CFA Level I and II passers has conditions: Level II within two years of applying, or continuous work as a research analyst since passing it. Series 87 and the SIE exam are still required. Added.
- **S19, IMF link.** The U.S. IMF link in Resources was malformed and is corrected.

Confirmed against sources: Microsoft FY2026 revenue, operating income, and net income; Finviz, Koyfin, TradingView, and Morningstar prices; BLS pay and percentiles; BEA Q1 and Q2 2026 growth; IMF U.S. GDP per capita and U.S. and India growth.

## Editorial fixes

- **Keyword use.** Each primary keyword now appears 8 or more times, including the introduction. For S17, the title, H1, SEO title, and meta description now carry "top rated stock screener". The slug still reads `best-stock-screeners-compared`.
- **Word count.** S16, S17, and S18 were under 2,500 words. Fragment lists became bold-lead bullets with explanations. S17 gained a section on testing a screener before paying, and S18 one on earnings season.
- **House style.** Removed "matter(s)" and "actually". "Leverage" stays only as the finance noun, recorded as an approved exception.
- **Headings and links.** Single H3 subsections were removed or paired. Each post now has 2 or 3 contextual source links.
- **Charts.** The four designer notes are now real charts in `data/charts.json`, built from the verified figures.

## Research completed after network access opened

- **Competitor reviews:** Five pages were read for each post, with headings, sources, data assets, link patterns, trust signals, and gaps recorded. Pages that block automated access (Investopedia, Indeed, MarketWatch, and others) were replaced by the next ranking page.
- **Sources:** Every cited source is now confirmed. Vendor pricing pages match the post. All 24 IMF cells in the S19 table match the IMF's World Economic Outlook data API. CFA Institute wording and World Bank coverage through 2025 are confirmed.
- **Status:** All four research records are at `planned`, so research and plan are complete.

## Sign-off

Fact-check and QA signed off by Darlene Aberin on 2026-10-12. All four research records are `verified`. The posts are approved, with S16 and S17 dated 2026-10-12 and S18 and S19 dated 2026-10-13. The images are recorded as owner-supplied and AI-generated. Production builds show each post only from its date onward.
