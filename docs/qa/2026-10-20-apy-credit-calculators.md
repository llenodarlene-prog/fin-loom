# QA and Fact-Check: S28 to S32 (APY, Credit Score, Calculators)

This is the final AI QA layer of 2026-10-20 on four owner-supplied posts, plus one page drafted from the owner's calculator brief. The posts stay `draft: true` until the owner signs off.

| ID | URL | Keyword (Ubersuggest US) | Publish | Image |
|---|---|---|---|---|
| S28 | /money-banking/apy-meaning/ | apy meaning (40,500) | 2026-10-21 | 16 |
| S29 | /money-banking/apy-vs-interest-rate/ | apy vs interest rate (4,400) | 2026-10-21 | 17 |
| S30 | /money-banking/apy-calculator/ | apy calculator (40,500) | 2026-10-22 | 18 |
| S31 | /money-banking/what-is-a-credit-score/ | what is a credit score (12,100) | 2026-10-22 | needed from owner |
| S32 | /money-banking/savings-interest-calculator/ | savings interest calculator (18,100) | 2026-10-23 | 19 |

## Fact-check

- **APY figures:** every APY figure was recomputed, including:
  - 4% compounded annually, semiannually, quarterly, monthly and daily: 4.000% to 4.081%, $400.00 to $408.08.
  - 5% compounded monthly and daily: $10,511.62 and $10,512.67.
  - The $81 gap on $100,000.
- **CFPB Regulation DD, quoted from the regulation pages:**
  - Section 1030.2 definitions: APY and interest rate.
  - Appendix A: a 365-day term, principal and interest assumed to stay on deposit, and the worked examples (a 6.18% six-month CD, a 5.39% stepped-rate CD, a 5.65% introductory-rate account, tier methods, a 6.58% APY earned, and a 6.00% payout CD).
  - Section 1030.8: the advertising rule.
- **Other CFPB pages:**
  - The APR and money market account pages.
  - The two credit-score pages: many scores range from 300 to 850, you can have several scores, and it can pay to shop around.
- **myFICO:**
  - The weights are 35, 30, 15, 10 and 10.
  - Income, age and where you live are excluded, along with the rest of the excluded-information list.
- **FICO bands:** 300 to 579 Poor, up to 800 to 850 Exceptional. These were confirmed through Experian and Capital One, because myFICO's band page would not load.
- **Corrections:**
  - The brief's savings example figures ($44,216 and $46,336) were wrong. The corrected, engine-tested figures are $46,669.68 with end-of-month deposits and $46,807.83 with start-of-month deposits.
  - The FICO table's "updated October 2026" became "checked October 20, 2026".
  - One unverified clause ("especially for people without a long credit history") was removed.

## Editorial fixes

- **Word count:** expanded to at least 2,500 publishable words, using only verified or calculated material.
- **Keyword:** the exact keyword now appears 8 or more times.
- **Banned words:** removed em dashes, "matters" and "actually".
- **Internal notes:** removed from the APY calculator page.
- **Links:** absolute `https://finloom.org/` links were changed to relative links.
- **External citations:** each post has 2 to 3 contextual external citations.

## Silo

- **Spokes:** all five posts are spokes of the Money & Banking pillar, S9 Saving vs Investing.
- **Pillar:** S9 now links to all five.
- **Credit score link:** S15 Identity Theft Statistics links to S31.
- **Inbound links:** every post receives at least 2 inbound links on its publish date.

## Calculators

- **Built in:** both calculators are built into the pages through a new `calculator` Markdown block (`scripts/lib/calculators.mjs`).
- **Shared engine:** one engine, `src/scripts/calculators.js`, drives the summary, chart and table.
- **Server-side defaults:** the default results are rendered on the server, so the page shows figures without JavaScript.
- **Savings rate:** the savings calculator uses (1 + APY)^(1/12) − 1, never APY ÷ 12.
- **Scoped CSS:** all styling sits under `.finloom-calc`.
- **Tests:** `tests/calculators.test.mjs` covers all the brief's cases.
- **Browser check:** tested in Chromium at 1280 px and 375 px. Results matched, there were no console errors, no NaN, no horizontal overflow, and validation messages appeared inline.

## Checks

`npm run verify` passes with 45 tests.

## Pending

- **Owner sign-off:** the posts move to `draft: false` with a verified research record only after the owner signs off.
- **S31 image:** a hero image for the credit score post is needed from the owner.
