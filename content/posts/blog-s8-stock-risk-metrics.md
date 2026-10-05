---
title: Stock Risk Metrics: Drawdown, Volatility, Beta, and Sharpe Ratio Compared
seo_title: Stock Risk Metrics: Volatility, Beta, Drawdown, Sharpe
description: Compare stock risk metrics including volatility, beta, drawdown, Sharpe ratio, liquidity, leverage, and concentration with practical examples.
slug: /investing/stock-risk-metrics/
type: blog
schema: BlogPosting
draft: false
tracker_id: Blog:S8
primary_keyword: stock risk metrics
secondary_keywords: 
cluster: Investing
approved_internal_links: /investing/
research_record: content/research/blog-s8.json
image: /assets/images/posts/stock-risk-metrics/financial-newspaper-and-charts-1600.jpg
image_alt: A financial newspaper, reading glasses, and printed charts beside a laptop showing a price chart
link_placement_site: Stoxcraft
charts_pending: 0
ai_exceptions: leverage
ai_exception_reason: Leverage is used in its technical financial sense: debt relative to equity, assets, or earnings.
author: Darlene Aberin
published: 2026-10-04
modified: 2026-10-04
---

# Stock Risk Metrics: Drawdown, Volatility, Beta, and Sharpe Ratio Compared

Investors often describe a stock as “risky” without defining the risk. That word can refer to several different problems.

A share price may move violently from day to day. A company may carry too much debt. A stock may be difficult to sell. A portfolio may be concentrated in one sector. A business may face a permanent decline in earnings. A seemingly diversified portfolio may still depend on the same macroeconomic factor.

No single statistic captures all of those risks. That is why stock risk metrics work best as a dashboard rather than a ranking. Volatility, beta, maximum drawdown, Sharpe ratio, leverage, liquidity, and concentration each answer a different question. Used together, they can help investors understand not only how much a stock has moved, but why that movement matters to a portfolio.

## Key Takeaways

The points below summarize what the main stock risk metrics can and cannot show.

- **Volatility Measures Variability, Not Permanent Loss:** A volatile stock can recover; a low-volatility company can still suffer permanent impairment.
- **Beta Measures Market Sensitivity:** It does not measure every source of business or balance-sheet risk.
- **Maximum Drawdown Shows the Pain Between a Peak and Trough:** It is often more intuitive than standard deviation.
- **Sharpe Ratio Compares Excess Return with Volatility:** It is useful for risk-adjusted comparisons but depends heavily on the period measured.
- **Leverage Can Convert Volatility into Solvency Risk:** Balance-sheet metrics belong beside market-price statistics.
- **Liquidity Risk Appears When Investors Need to Trade:** Average volume and spreads matter especially for smaller stocks.
- **Portfolio Risk Is Not the Average of Individual Risks:** Correlation and concentration determine how holdings interact.

## Why One Risk Number Is Never Enough

Imagine two stocks. Stock A is volatile but debt-free, highly profitable, and trades billions of dollars per day. Stock B barely moves most days but carries heavy debt, has weakening cash flow, and trades thinly. Which is riskier?

Volatility alone says Stock A. Fundamental and liquidity analysis may say Stock B. That conflict does not mean risk measurement is broken. It means the investor is measuring different things.

The solution is to identify the question first.

## Risk Metric Comparison

The table sets the main stock risk metrics side by side, with what each one measures and what it leaves out.

| Metric | What It Measures | What It Misses |
|---|---|---|
| Volatility | Magnitude of return fluctuations | Direction, solvency, valuation |
| Beta | Sensitivity to market moves | Company-specific risk |
| Maximum drawdown | Peak-to-trough decline | Frequency of smaller losses |
| Sharpe ratio | Return per unit of volatility | Non-normal returns, path dependence |
| Debt/EBITDA | Financial leverage | Market-price behavior |
| Interest coverage | Ability to service debt | Equity valuation |
| Average volume | Trading liquidity | Fundamental quality |
| Correlation | Co-movement with another asset | Standalone business risk |

The table makes an important point: risk is multidimensional.

## Volatility: How Widely Returns Move

Volatility is commonly measured as the standard deviation of returns. The more widely returns vary, the higher the volatility.

For example, a stock that moves between -1% and +1% most days is less volatile than one frequently moving -6% to +6%. Annualized volatility scales that variability to a yearly figure. The metric is useful for position sizing, comparing similar securities, option pricing, portfolio construction, and assessing how difficult a position may be to hold.

But volatility has a major limitation. It treats upside and downside movement similarly. A stock that repeatedly jumps upward can register high volatility even if investors are delighted by the result.

## Beta: How a Stock Moves Relative to the Market

Beta compares the movement of a stock with a benchmark. A beta near 1 suggests the stock has historically moved roughly in line with the benchmark's sensitivity. A beta above 1 indicates greater historical sensitivity. A beta below 1 indicates lower sensitivity.

A negative beta would imply movement in the opposite direction, though sustained negative betas are uncommon for ordinary equities.

### What Beta Is Useful For

Beta helps answer:

> If the broad market moves, how much has this stock tended to move with it?

That can help portfolio managers understand systematic risk.

### What Beta Cannot Tell You

A company may have a low beta and still be risky because revenue is collapsing, debt is unsustainable, liquidity is poor, the business faces litigation, a product is becoming obsolete, or valuation is extreme. Beta describes a historical relationship with a benchmark. It is not a business-health score.

## Maximum Drawdown: The Investor Experience Metric

Maximum drawdown measures the largest decline from a previous peak to a subsequent trough. The formula is conceptually simple:

**Drawdown = (Trough Value - Peak Value) / Peak Value**

Suppose a stock reaches $100 and later falls to $55 before recovering. Its drawdown is 45%. This is powerful because investors understand what a 45% decline feels like.

## Recovery Mathematics

Losses require larger percentage gains to recover.

| Drawdown | Gain Needed to Return to Peak |
|---:|---:|
| 10% | 11.1% |
| 20% | 25.0% |
| 30% | 42.9% |
| 40% | 66.7% |
| 50% | 100.0% |
| 60% | 150.0% |
| 75% | 300.0% |

That asymmetry is one reason drawdown belongs beside return. Two investments can produce similar long-term returns while putting investors through very different paths.

## Sharpe Ratio: Return Relative to Volatility

The Sharpe ratio compares excess return with volatility. A simplified version is:

**Sharpe Ratio = (Portfolio Return - Risk-Free Rate) / Portfolio Volatility**

A higher Sharpe ratio indicates more return per unit of measured volatility over the selected period. This is useful when comparing portfolios that pursue similar objectives. But interpretation requires care.

### Period Choice Changes the Result

A three-year Sharpe ratio can look very different from a ten-year ratio. A stock that experienced one severe crash may have a low Sharpe ratio even if its long-term return remains attractive.

### The Distribution Assumption Is Imperfect

Financial returns are not always neatly distributed. Large shocks happen more often than a simple normal model may imply. That matters especially for assets with jumps, leverage, or crisis sensitivity.

### Sharpe Can Reward Smoothness

Some strategies look stable until a rare event produces a large loss. Low day-to-day volatility does not guarantee low tail risk. Sharpe is useful, but it should not be read alone.

## Sortino Ratio: Focus Only on Harmful Volatility

The Sortino ratio modifies the Sharpe framework by using downside deviation rather than total volatility. That reflects an intuitive idea. Investors generally do not complain when returns surprise strongly to the upside. By penalizing downside volatility, Sortino can be more aligned with the investor's experience.

It still depends on historical data and the chosen period.

## Alpha: Return Beyond a Model's Expectation

Alpha attempts to measure performance beyond what would be expected given market exposure. In a simple framework, positive alpha suggests the investment produced more return than its beta exposure alone would imply. But alpha is model-dependent. Change the benchmark or risk model and the alpha may change.

A technology stock compared with the S&P 500 may show a different alpha than the same stock compared with a technology index. That makes benchmark choice part of the analysis.

## Value at Risk: A Probability Estimate, Not a Maximum Loss

Value at Risk, or VaR, estimates a loss threshold over a period at a stated confidence level.

For example:

> A one-day 95% VaR of $10,000 means the model estimates that losses should exceed $10,000 on roughly 5% of days under the model assumptions.

It does **not** mean $10,000 is the maximum possible loss. The tail beyond the threshold can be much worse. VaR is useful for risk management but can create false confidence when users forget the assumptions.

## Leverage Is a Different Kind of Risk

Market metrics look backward at price behavior. Balance-sheet metrics examine the business. Debt can amplify shareholder outcomes because lenders have contractual claims that rank ahead of equity.

Useful leverage measures include debt-to-equity, net debt/EBITDA, debt/assets, interest coverage, and fixed-charge coverage. Each can be calculated from the financial statements that public companies file through the [SEC's EDGAR database](https://www.sec.gov/edgar/search/). The appropriate measure depends on the industry. A software company with net cash and a utility with significant long-term debt should not be judged by the same leverage threshold without context.

## Interest Coverage Shows Debt-Service Capacity

Interest coverage is commonly calculated using operating profit or EBITDA relative to interest expense. A high ratio suggests the company has substantial operating earnings relative to current interest obligations. A low ratio indicates less room for earnings deterioration. This metric becomes especially important when interest rates rise, debt matures, refinancing conditions tighten, or profit is cyclical.

A company's stock can appear statistically calm while its debt position becomes increasingly fragile.

## Liquidity Risk Can Be Invisible Until Stress

Market liquidity asks how easily an investor can trade. Useful indicators include average daily dollar volume, bid-ask spread, order-book depth, free float, and size of the investor's position relative to normal volume. A $5,000 position may be easy to exit in a small-cap stock. A $5 million position might not be.

Liquidity is therefore partly investor-specific. The stock itself does not have one universal liquidity risk independent of position size.

## Concentration Is a Portfolio-Level Risk

A stock can be excellent and still create a dangerous portfolio if the position is too large.

Suppose a portfolio is 40% invested in one company. If that company falls 50%, the direct portfolio impact is roughly 20% before considering movement in other holdings. Position size converts stock risk into portfolio risk.

This is why [portfolio risk analysis](/investing/) should combine individual stock metrics with sector exposure, correlation, and allocation size. A stock's volatility tells only part of the story; the weight determines how much that volatility matters.

## Correlation Determines Whether Diversification Works

Correlation measures the degree to which two return series move together. A correlation near +1 means they tend to move in the same direction. Near 0 suggests limited linear relationship. Near -1 suggests opposite movement.

Diversification benefits are strongest when assets do not move perfectly together. [Investor.gov's diversification guidance](https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/diversify-your-investments) emphasizes spreading investments to reduce overall risk, while also noting that diversification cannot guarantee protection when the market drops.

## Sector Labels Can Hide Correlation

Two companies in different industries may still depend on the same factor.

For example: a software company, a semiconductor company, and a cloud infrastructure provider. may all depend heavily on enterprise technology spending. The portfolio looks diversified by ticker count but may remain economically concentrated.

## Scenario Analysis Adds What Historical Metrics Cannot

Historical volatility tells you what happened, whereas scenario analysis asks what could happen. For a company, scenarios might include revenue down 20%, gross margin compresses five points, interest expense doubles, a key customer leaves, a commodity input rises 30%, a regulator restricts a product, or the valuation multiple falls while earnings remain flat.

The investor then estimates what happens to earnings, free cash flow, debt ratios, and equity value. This is not prediction. Rather, it is a resilience test.

## An Illustrative Risk Dashboard

Suppose an investor is comparing two hypothetical stocks.

| Metric | Stock A | Stock B |
|---|---:|---:|
| Annualized volatility | 24% | 38% |
| Beta | 0.9 | 1.5 |
| Max drawdown | -28% | -52% |
| Net debt/EBITDA | 0.5x | 3.0x |
| Interest coverage | 18x | 4x |
| Average daily dollar volume | $250M | $12M |

Stock B is riskier across several dimensions. But even here, the dashboard does not answer whether Stock B is a bad investment. A lower valuation or stronger growth rate could compensate investors for taking more risk. Risk measurement tells the investor what is being paid for.

## Risk-Adjusted Return Is Not the Same as Low Risk

An asset can have high absolute risk and still produce attractive risk-adjusted returns. That distinction matters.

Suppose: portfolio A returns 8% with 8% volatility and portfolio B returns 15% with 18% volatility. Portfolio B is more volatile. Depending on the risk-free rate and period, its risk-adjusted performance may still be attractive. The question becomes whether the investor can tolerate the path.

A mathematically efficient portfolio is useless if its owner sells during the first major drawdown.

## Behavioral Risk Belongs on the Dashboard

Not every risk is in the data. Behavioral risk includes panic selling, performance chasing, overconfidence, anchoring to purchase price, doubling down without new evidence, and refusing to rebalance winners. In addition, a highly volatile holding magnifies behavioral pressure. Investors should therefore ask:

> What decline would make me abandon this investment?

If the answer is 20%, buying an asset that routinely experiences 40% drawdowns creates a predictable mismatch.

## Use the Right Risk Metric for the Decision

Different decisions call for different stock risk metrics.

### Choosing Position Size

Focus on volatility, drawdown, liquidity, and portfolio correlation.

### Evaluating Financial Resilience

Focus on leverage, interest coverage, cash flow, and debt maturities.

### Comparing Funds or Strategies

Sharpe, Sortino, drawdown, and benchmark-relative metrics become more useful.

### Evaluating a Single Company

Blend market metrics with business and balance-sheet risk. No one statistic wins every job.

## Common Mistakes With Stock Risk Metrics

Six mistakes come up repeatedly when investors read these numbers.

### Calling Beta “Risk”

Beta measures market sensitivity, not total risk.

### Treating Low Volatility as Safety

A stock can decline slowly for years.

### Ignoring the Measurement Window

A calm five-year period can hide earlier crises.

### Comparing Different Strategies With One Benchmark

Benchmark mismatch can distort beta and alpha.

### Forgetting Liquidity

A theoretical risk model assumes you can transact. Real markets may disagree.

### Treating Historical Correlation as Permanent

Relationships between assets change during crises.

## Tail Risk Deserves Separate Attention

Volatility assumes that the distribution of returns can be summarized meaningfully by average variability. Markets occasionally produce moves far outside normal experience. Tail risk refers to those extreme outcomes. Examples include bankruptcy, fraud, sudden regulatory action, geopolitical shock, commodity-price collapse, cyberattack, or a liquidity freeze.

Historical volatility can understate these risks because the event may not exist in the sample. Investors can address this weakness through scenario analysis, position limits, diversification, liquidity reserves, and avoiding leverage that could force liquidation.

## Fundamental Risk Can Lead Price Risk

Sometimes the business deteriorates before the stock becomes volatile. Examples include inventory building, receivables rising faster than revenue, debt refinancing becoming more expensive, customer concentration increasing, or capital expenditure producing weak returns. These are not market-price metrics. Instead, they require financial-statement analysis.

That is why a serious risk dashboard should combine price data with company fundamentals.

## Valuation Risk Is Easy to Ignore

A financially strong company can still be risky if the valuation assumes unrealistic growth. Valuation risk appears when investors pay so much for future earnings that even good results disappoint. Useful checks include P/E relative to growth, enterprise value/free cash flow, earnings yield, historical valuation ranges, and implied expectations.

Valuation does not predict the next price move. It helps frame how much optimism is already embedded in the stock.

## Risk Budgets Turn Metrics Into Portfolio Decisions

Professional portfolios often think in terms of risk budgets. The concept can be simplified for individual investors. Instead of giving every position the same dollar weight, consider how much each holding contributes to portfolio volatility and drawdown. A highly volatile stock may deserve a smaller weight.

A low-volatility stock may support a larger weight, although fundamental risk still needs review. The objective is not mathematical perfection. It is avoiding a portfolio where one idea silently determines the outcome.

## Stress Correlations, Not Just Normal Correlations

Correlations often rise during broad market stress. Assets that appeared independent can fall together when investors de-risk simultaneously. A portfolio should therefore be tested under stressed assumptions. Ask what if equity sectors become highly correlated, what if liquidity falls, what if credit spreads widen, and what if the portfolio's defensive asset also declines.

Diversification is a process, not a permanent property of a set of tickers.

## Final Perspective

Stock risk metrics are most useful when they stop investors from reducing risk to a single number. Volatility describes movement, beta describes market sensitivity, and drawdown describes the depth of historical losses.

Sharpe and Sortino describe return relative to measured variability. Leverage describes financial fragility. Liquidity describes whether the investor can exit. Correlation describes how the holding interacts with everything else.

Together, these measures create a more realistic picture. The objective is not to eliminate risk. It is to know which risk you are taking, how much of it the portfolio can absorb, and whether the expected return is worth that exposure.

## Frequently Asked Questions

Short answers to the questions readers ask most often about stock risk metrics.

### What Is the Best Stock Risk Metric?

There is no universal best metric. Maximum drawdown is intuitive for loss experience, volatility measures variability, beta measures market sensitivity, and leverage measures financial risk.

### Is Beta the Same as Volatility?

No. Volatility measures how much the stock's returns fluctuate. Beta measures how the stock has moved relative to a benchmark.

### What Is a Good Sharpe Ratio?

Interpretation depends on asset class, period, and market environment. A higher Sharpe ratio generally indicates more excess return per unit of volatility, but it should not be used without drawdown and strategy context.

### Why Is Maximum Drawdown Important?

It shows the largest historical peak-to-trough loss, helping investors understand how severe a decline they might have had to endure.

### Can a Low-Volatility Stock Still Be Risky?

Yes. It may carry high debt, poor liquidity, deteriorating fundamentals, governance problems, or valuation risk.

## Resources

- [Investor.gov: Asset Allocation and Diversification](https://www.investor.gov/introduction-investing/getting-started/asset-allocation)
- [Investor.gov: Diversify Your Investments](https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/diversify-your-investments)
- [SEC EDGAR Company Filings](https://www.sec.gov/edgar/search/)
- [FINRA Investor Resources](https://www.finra.org/investors)
