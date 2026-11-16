---
title: Payment Processing Fee Calculator
seo_title: Payment Processing Fee Calculator: Stripe and Venmo Fees
description: Free payment processing fee calculator. See the fee and net amount on a payment at Stripe and Venmo published rates or your own rate, and what to charge to net a full amount.
slug: /payments/payment-processing-fee-calculator/
type: page
schema: WebPage
draft: false
published: 2026-11-20
---

# Payment Processing Fee Calculator: Stripe and Venmo Fees

This payment processing fee calculator shows what a card or app payment costs to accept. Choose a processor's published rate or enter your own, then enter the payment amount. It returns the fee, what you receive, the effective rate, the amount you would need to charge to receive the full figure, and monthly totals at your volume.

```calculator
payment-fees
```

## How the Payment Processing Fee Calculator Works

Most processors charge a percentage of the payment plus a fixed amount per transaction. Fee = amount × percentage + fixed fee. At 2.9% + 30¢, a $100 payment costs $3.20 and you receive $96.80. The fixed part makes small payments relatively more expensive: on a $10 payment, the same rate costs $0.59, or 5.9%. These are Fin Loom calculations from the inputs shown.

To pass the fee on and still receive a set amount, charge (target + fixed fee) ÷ (1 − percentage). Netting $100 at 2.9% + 30¢ means charging about $103.30. Card network and state rules on surcharging vary, so check them before adding a fee at checkout.

## Published Rates Used

The presets use standard U.S. rates checked on November 14, 2026. [Stripe's pricing page](https://stripe.com/pricing) lists 2.9% + 30¢ for domestic cards online and 2.7% + 5¢ in person, plus 1.5% for international cards. [Venmo's fee page](https://venmo.com/resources/our-fees/) lists 1.9% + $0.10 for payments to a business profile, 2.29% + $0.09 through Tap to Pay, and 2.99% for goods and services payments to a personal account.

Processors change prices and may offer custom rates, so confirm your own account's pricing. For Square or any other processor, use the custom rate option with the rate from your agreement.

## What the Calculator Leaves Out

Monthly, payout, refund, chargeback, currency conversion and manual-entry fees are not included. Taxes on business income are separate.

## More Fin Loom Calculators

This tool is part of Fin Loom's [financial calculators](/tools/). The [sales tax calculator](/payments/sales-tax-calculator/) adds or removes sales tax from a price.

## Frequently Asked Questions

### How Are Payment Processing Fees Calculated?

Usually as a percentage of the payment plus a fixed fee per transaction. At 2.9% plus 30 cents, a $100 payment costs $3.20 to accept.

### Why Do Small Payments Cost More in Fees?

The fixed per-transaction fee is a larger share of a small payment. Thirty cents is 0.3% of $100 but 3% of a $10 sale.

### How Much Should I Charge to Cover the Fee?

Add the fixed fee to your target and divide by one minus the percentage rate. Netting $100 at 2.9% plus 30 cents means charging about $103.30.
