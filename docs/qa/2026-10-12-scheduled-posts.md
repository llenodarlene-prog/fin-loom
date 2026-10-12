# QA: posts scheduled for October 12 and 13, 2026

Four owner-supplied posts were imported as drafts S16 to S19 on 2026-10-12, each with its supplied hero image. They are in the publishing schedule and stay drafts until they pass the checks below and are approved.

| ID | Post | URL | Slot |
| --- | --- | --- | --- |
| S16 | Stock Analysis Fundamentals | `/markets-stocks/stock-analysis-fundamentals/` | Mon 2026-10-12 |
| S17 | Best Stock Screeners Compared | `/markets-stocks/best-stock-screeners-compared/` | Mon 2026-10-12 |
| S18 | Stock Research Analyst | `/markets-stocks/stock-research-analyst-role/` | Tue 2026-10-13 |
| S19 | Explain Per Capita GDP | `/investing/per-capita-gdp-explained/` | Tue 2026-10-13 |

Method: each post was run through `npm run check:content` as if approved (`draft: false`, author Darlene Aberin, `published` set to its slot), then read by hand. **Result: none of the four can be published yet.** The checks found two kinds of blocker.

## 1. Blocks all four: research not done

Each research record (`content/research/blog-s16.json` to `blog-s19.json`) is an empty scaffold. Publication needs, per `docs/RESEARCH-RECORD.md`: Ubersuggest keyword data, five competitor reviews, every source and statistic verified, a claims list, and named fact-check and QA sign-offs. Every external link must match a verified source.

These figures are dated after the repository's last verified data, so they must be checked against the source before publication:

- **S16:** Microsoft fiscal 2026 revenue $331.8B, operating income $155.2B, net income $133.7B, and the FY2024 and FY2025 rows, against the linked 10-K.
- **S17:** every plan price (Finviz $39.50 per month or $299.50 per year, Koyfin Plus $39 and Premium $79, Morningstar $249 or $34.95, TradingView $12.95, Yahoo $7.95, $19.95, and $39.95) and the feature claims for each plan.
- **S18:** BLS May 2025 median $102,740, the 10th and 90th percentiles, 377,200 to 404,300 jobs, 7.2% growth, 24,700 openings, and the CFA and Series 86 exemption statement.
- **S19:** the IMF April 2026 table (six economies, three columns), India's and the U.S. total GDP, and the BEA Q1 and Q2 2026 growth rates.

## 2. Editorial fixes the checks require

| Check | S16 | S17 | S18 | S19 |
| --- | --- | --- | --- | --- |
| Word count, minimum 2,500 (owner rule for supplementary posts) | 2,177 | 2,238 | 2,110 | passes |
| Exact keyword, 8 or more uses, including the introduction | 1 use | 0 uses, also missing from the H1 | passes | 1 use |
| Owner rule: no "matter" or "matters" | 4 | 1 | 6 | 8 |
| Kill list: "actually" (high) and "leverage" (medium) | both | both | both | both |
| Bullets without a bold lead (fragment lists) | 17 | passes | 15 | passes |
| An H2 with only one H3 | 1 | 1 | 1 | 2 |
| 2 or 3 contextual external links before Resources | 1 found | 5 found | 0 found | passes |
| A table or list with no lead-in sentence | passes | passes | passes | 1 |

## 3. Found in the manual read

- **Chart placeholders:** all four contain notes to the designer ("Recommended chart type", "Chart title") instead of a chart. Each one needs a chart built from verified data in `data/charts.json` (S16, S17, S18, and S19 have one each), or the note removed.
- **S17 keyword:** the approved keyword is "top rated stock screener", but the body only uses "top-rated stock screener" (with a hyphen), and the title and H1 do not use it. Confirm the keyword, or change it to one the title supports, such as "best stock screener".
- **S19 broken link:** the supplied IMF "United States" link in Resources was malformed (`.../profile/USA/WEO/datamapper/profile/USA/WE`). It was corrected to `https://www.imf.org/external/datamapper/profile/USA`.
- **S19 internal links:** the supplied copy linked two Fin Loom posts, and a supplementary post may link one. The saving vs investing link is kept. The stock screener metrics anchor is now plain text, since S16, S17, and S18 already link to that guide.
- **Em dashes:** the supplied Resources lists used em dashes, which the rules prohibit. They were replaced with colons at import.
- **Partner placement:** no partner site was named for these four posts, so `link_placement_site` is blank.
- **Images:** the four supplied images are registered at 1600x900 and 800x450 with alt text. Rights are recorded as supplied by the owner on 2026-10-12. Confirm whether they are AI-generated so the rights note matches the earlier images.

## What happens next

1. Do the research and fix the editorial items for each post, then set `draft: false`, author, and `published` and `modified` to the slot date.
2. Run `npm run verify`, open a PR to `staging`, and review the post on staging.
3. Merge to `main`. The daily `Scheduled publish` run deploys on the slot day, after production approval.

The Monday slot (2026-10-12) is today, so S16 and S17 cannot go live on time. `npm run schedule` flags them as overdue drafts. Move their `scheduled_publish` dates if a new day is chosen.
