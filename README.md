# FinLoom

FinLoom is the source repository for [finloom.org](https://finloom.org/), a finance publication covering investing, markets & stocks, crypto, fintech, and payments.

## Brand

**Tagline:** Financial Insights. A Brighter Tomorrow.

## Launch categories

- Investing
- Markets & Stocks
- Crypto
- Fintech
- Payments

## Repository workflow

- `main` is the protected production-ready branch.
- `staging` is used for staging builds and deployment to `https://staging.finloom.org`.
- Content and site changes should be validated before merging to `main`.

## Local commands

```bash
npm install
npm run verify
npm run build
```

## Deployment

GitHub Actions deploys the built `dist/` output to the configured Hostinger staging target. Production deployment remains intentionally separate from staging until launch approval.
