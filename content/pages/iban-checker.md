---
title: IBAN Checker
seo_title: IBAN Checker: Validate IBAN Format and Check Digits
description: Free IBAN checker. Validate an IBAN's structure and MOD 97 check digits in your browser, and learn why a valid format does not prove an account exists.
slug: /money-banking/iban-checker/
type: page
schema: WebPage
draft: false
published: 2026-11-21
---

# IBAN Checker: Validate Format and Check Digits

This IBAN checker tests whether an international bank account number is correctly formed. Paste or type an IBAN, and it checks the country code, the check digits and the characters, then runs the MOD 97-10 check-digit test. If the check digits are wrong, it shows what they would need to be, which often points to a typing error.

```calculator
iban-checker
```

## How the IBAN Checker Works

An IBAN starts with a two-letter country code and two check digits, followed by the domestic account number. The check digits are calculated with the MOD 97-10 method from the ISO 7064 standard. The [Central Bank of Kosovo's IBAN regulation](https://bqk-kos.org/wp-content/uploads/2024/11/International-payment-account-number-structure-and-use-regulations-English-V_7-WBG-CLEAN.pdf) sets out the method with a worked example: move the country code and check digits to the end, convert letters to numbers (A = 10 through Z = 35), and the remainder after dividing by 97 must be 1.

The calculator uses that published example, XK05 1212 0123 4567 8906, as its default. It passes. Change one digit and the check fails.

## What a Valid Result Means

A pass means the number is correctly formed and the check digits match. It does not prove the account exists, is open, can receive a payment or belongs to the person you expect. Scammers can supply correctly formed IBANs for accounts they control, so confirm payment details with the recipient through a channel you already trust before sending money.

## What the Checker Leaves Out

Each country sets its own IBAN length and domestic format, and this tool does not check country-specific lengths or bank codes. It does not look up banks or accounts.

## Your IBAN Stays Private

The check runs in your browser. The number you enter is not stored or sent anywhere.

## More Fin Loom Tools

This tool is part of Fin Loom's [financial calculators](/tools/). The [payment processing fee calculator](/payments/payment-processing-fee-calculator/) estimates what card and app payments cost to accept.

## Frequently Asked Questions

### How Are IBAN Check Digits Calculated?

Using MOD 97-10 from ISO 7064. Rearrange the IBAN, convert letters to numbers and divide by 97. A valid IBAN leaves a remainder of 1.

### Does a Valid IBAN Mean the Account Exists?

No. It only shows the number is correctly formed. Confirm account details with the recipient through a trusted channel before sending a payment.

### Is the IBAN I Enter Stored?

No. The check runs entirely in your browser. Fin Loom does not store or send the number you type.
