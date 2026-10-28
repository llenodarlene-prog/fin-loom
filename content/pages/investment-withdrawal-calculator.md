---
title: Investment Withdrawal Calculator
seo_title: Investment Withdrawal Calculator: How Long Will It Last?
description: Free investment withdrawal calculator. Estimate how long a portfolio could last at a monthly withdrawal, or how much you could withdraw each month over a set number of years.
slug: /investing/investment-withdrawal-calculator/
type: page
schema: WebPage
draft: false
---

# Investment Withdrawal Calculator: How Long Could Your Money Last?

This investment withdrawal calculator answers two related questions. The first mode estimates how long a portfolio could last if you withdraw a set amount each month. The second estimates the level monthly withdrawal that would spend a portfolio down to zero over a number of years you choose. Both use a steady average return, so the results are illustrations, not forecasts.

```calculator
withdrawal
```

## How the Calculator Works

The calculator runs month by month. Each month it applies the annual return at the equivalent monthly rate, (1 + annual return)^(1/12) − 1, and takes the withdrawal at the beginning or end of the month, depending on the timing you choose. Taking money out at the beginning of the month leaves slightly less invested, so the money runs out a little sooner.

In the first mode, the monthly withdrawal can rise once a year by the yearly increase you enter, which is a simple way to model raising spending as prices rise. The calculator stops when the balance reaches zero and reports the time it took, or reports that the money lasts beyond 100 years. With the default inputs, $500,000 earning 5% a year with withdrawals starting at $2,500 a month and rising 3% a year could last an estimated 20 years and 5 months. That is a Fin Loom calculation from the calculator's engine.

The inflation rate does not change the withdrawals themselves. It converts the balance and the last withdrawal into today's dollars, so you can see what the later amounts would buy in current terms.

## The Level Withdrawal Formula

The second mode uses the standard annuity formula for a balance that earns a monthly rate *i* and is spent evenly over *n* months:

**Monthly withdrawal = Balance × i ÷ (1 − (1 + i)^−n)**

That is the end-of-month version. Beginning-of-month withdrawals divide the result by (1 + i), and a zero return simply divides the balance by the number of months. The calculator then runs the same month-by-month projection to confirm the balance ends at about zero. For example, $500,000 earning 5% a year could support about $2,650 at the end of each month for 30 years, a Fin Loom calculation.

## What This Projection Leaves Out

Sequence-of-returns risk is not modeled in this basic projection. Real portfolios do not earn the same return every month, and the order of good and bad years affects how long withdrawals can last. Losses in the first years of withdrawals do more damage than the same losses later, because the portfolio is largest at the start. The [bear vs bull stock market](/markets-stocks/bear-vs-bull-market/) history shows how deep and long market declines have been.

The calculator also leaves out taxes, fees, required minimum distributions, and changes in spending other than the yearly increase. Money set aside for near-term needs often sits in cash rather than investments, a tradeoff covered in [saving vs investing](/money-banking/saving-vs-investing/).

## More Fin Loom Calculators

This tool is part of Fin Loom's set of [financial calculators and reference tools](/tools/), which covers inflation, compound interest, investment growth, dividends, withdrawals, capital gains tax, and stock trades.

## Frequently Asked Questions

### Does the Calculator Account for Inflation?

Inflation is used to show balances and withdrawals in today's dollars. To raise withdrawals with prices, enter a yearly withdrawal increase in the advanced options.

### Why Does Beginning-of-Month Timing Run Out Sooner?

Withdrawing at the start of each month removes money before it earns that month's return, so the balance grows slightly less over time.

### Is the Estimated Withdrawal Safe to Spend?

The result shows the arithmetic under a steady return. Actual returns vary, so the same withdrawal could last longer or shorter than the estimate.
