---
title: Position Size Calculator
seo_title: Position Size Calculator: Shares From Account Risk and Stop
description: Free position size calculator. Enter account size, percent risk, entry and stop-loss to see how many shares to trade, the dollars at risk and the reward-to-risk ratio.
slug: /markets-stocks/position-size-calculator/
type: page
schema: WebPage
draft: false
published: 2026-11-19
---

# Position Size Calculator: Shares From Account Risk and Stop

This position size calculator works out how many shares a trade can hold if you want to limit the loss to a set share of your account. Enter your account size, the percent you are willing to risk, your entry price and your stop-loss price. It returns the share count, the position's value, the actual dollars at risk and, if you add a target, the reward-to-risk ratio.

```calculator
position-size
```

## How the Position Size Calculator Works

Dollar risk is account size times the risk percentage. Risk per share is the gap between the entry and the stop. Shares equal dollar risk divided by risk per share, rounded down. With the defaults, 1% of a $25,000 account is $250. An entry at $50 with a stop at $47.50 risks $2.50 a share, so the position is 100 shares worth $5,000. A target of $57.50 gives a 3 to 1 reward-to-risk ratio. These are Fin Loom calculations from the inputs shown.

A stop above the entry is treated as a short trade.

## Why Size From Risk

Sizing a position from the stop keeps each planned loss roughly the same in dollars, whatever the stock's price. A wide stop means fewer shares; a tight stop allows more. The position can still be a large share of the account, which the calculator shows so you can check concentration.

## The Limits of a Stop

A stop-loss order can be filled below the stop price in a fast market or after a price gap, so the real loss can exceed the planned amount. This tool sizes a trade from your inputs. It does not suggest what to buy or sell.

## More Fin Loom Calculators

This tool is part of Fin Loom's [financial calculators](/tools/). The [stock profit calculator](/markets-stocks/stock-profit-calculator/) works out gains and losses on a trade, and the [stock average calculator](/markets-stocks/stock-average-calculator/) finds your average cost.

## Frequently Asked Questions

### How Do You Calculate Position Size?

Multiply account size by the risk percentage, then divide by the dollar gap between the entry and stop price. Round down to whole shares.

### What Is a Reward-to-Risk Ratio?

It compares the potential gain to the target with the potential loss to the stop. A $7.50 gain against a $2.50 risk is 3 to 1.

### Can I Lose More Than My Planned Risk?

Yes. A stop order may fill at a worse price during a gap or fast market, so the actual loss can be larger than planned.
