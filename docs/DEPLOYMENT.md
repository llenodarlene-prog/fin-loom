# FinLoom deployment

## Branches

- `main`: production-ready source.
- `staging`: deploys to `https://staging.finloom.org`.

## Required GitHub Actions secrets

- `HOSTINGER_FTP_SERVER`
- `HOSTINGER_FTP_USERNAME`
- `HOSTINGER_FTP_PASSWORD`
- `HOSTINGER_STAGING_DIR`

Do not commit credentials to the repository.

## Validation

Before deployment, the workflow runs:

```bash
npm install
npm run check
```

The current build is intentionally minimal. Site templates, final copy, images, and structured SEO content can be added without changing the deployment contract.
