# QA and Fact-Check: Scheduled Posts S25 to S27

Checked on 2026-10-15. Owner drafts supplied in chat were rewritten to house standards, fact-checked against primary sources, and approved by the site owner ("do the revision for the errors and you can push").

| ID | URL | Primary keyword | Publish | Internal link |
|---|---|---|---|---|
| S25 | /markets-stocks/zacks-stock-screener/ | zacks stock screener | 2026-10-17 | /markets-stocks/best-free-stock-screeners/ |
| S26 | /markets-stocks/yahoo-finance-stock-research/ | yahoo finance stock research | 2026-10-18 | /markets-stocks/best-stock-analysis-apps/ |
| S27 | /markets-stocks/technical-analysis-for-stocks/ | technical analysis for stocks | 2026-10-18 | /markets-stocks/stock-analysis-fundamentals/ |

## Keyword changes (owner approved)

- S26: "yahoo stock research" to "yahoo finance stock research" (same 480 US volume; matches the H1). The old keyword is kept as a secondary keyword.
- S27: "stock exchange technical analysis" (320) to "technical analysis for stocks" (1,300; matches the title and slug). The old keyword is kept as a secondary keyword.

## Fact-check findings and fixes

- S27: Figures attributed to SSRN 6977700 (Sharpe 0.60 vs 0.49, drawdowns of -4.9% vs -57.0%, "every rule underperformed") could not be verified: SSRN blocks direct access and no search result confirms the paper. They were removed. Replaced with Clare, Seaton, Smith, and Thomas (2013), read from the accepted version (S&P 500, July 1988 to June 2011, 20 bp cost per trade: 200-day monthly rule 10.66% and Sharpe 0.58 vs buy-and-hold 9.49% and 0.31), and Bajgrowicz and Scaillet (DJIA 1897 to 2011; abstract read from the full PDF).
- S27: The CFA Institute definition was confirmed and quoted. SSRN 6858299 (Fintak) was confirmed via its SSRN listing and is labeled an unreviewed preprint with a small sample.
- S26: "More than 10,000 stocks" was restated precisely: a default United States screen showed 10,000+ results on 2026-10-15. "Spans 50 regions" was confirmed.
- S26: Plan prices were confirmed. Monthly-billing prices ($9.95, $24.95, $49.95) are labeled as our calculation from Yahoo's stated savings. Gold's 7-day trial and its focus on US equities were confirmed.
- S25: $249 per year, the 30-day trial, 45+ Premium Screens, the top 5% #1 Rank List, and "virtually any item" were all confirmed.
- S25: The "650 data elements" claim was corrected to Zacks' wording, "over 650 traits".
- S25: Zacks' performance figure (23.82% vs 11.58%) is labeled hypothetical and vendor-reported.
- S25: The Finviz backtesting claim and Zacks Rank factor details were excluded as unconfirmed.
- All three posts: no buy, sell, or hold recommendations. Rank labels are described as Zacks model output.

## Checks

`npm run verify` passed: content, research, tracker, and 42 tests. `npm run schedule` lists S25 for 2026-10-17 and S26 and S27 for 2026-10-18 as scheduled.

## Dependencies

- S26 links to S21 (publishing 2026-10-16).
- S25 links to S20.
- S20 and S21 come from PR #31, which must reach main first.
