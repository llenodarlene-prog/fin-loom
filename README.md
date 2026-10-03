# FinLoom

Static publishing repository for **FinLoom**, a data-first finance and fintech publication.

**Tagline:** Financial Insights. A Brighter Tomorrow.  
**Editorial promise:** Follow the money, not the noise.

## Stack

Node.js 22+, ES modules, zero npm dependencies, and plain static HTML output in `dist/`.

## Commands

```bash
npm ci
npm run verify
npm run release:check
npm run dev
```

`npm run verify` cleans, builds, validates, and tests the repository.  
`npm run release:check` is the production gate and is expected to fail while launch approvals, public contact details, privacy review, and published-content sign-offs are incomplete.

## Sources of Truth

- `data/site.json` — brand and environment settings
- `data/content-plan.json` — 10-article + 10-blog launch plan
- `content/research/*.json` — per-piece evidence and QA records
- `AGENTS.md` — canonical editorial/repository rules
- `docs/BRAND.md` — visual system
- `docs/CONTENT-WORKFLOW.md` — editorial production flow
- `data/release.json` — launch approvals and core-route gate

The ten completed editorial drafts supplied in Google Drive are retained under `content/published/` as source material. They are not silently mapped onto different tracker routes.

## Branch Flow

`feature/*` → pull request to `staging` → review noindex staging deployment → release pull request from `staging` to `main`.

Do not push directly to `staging` or `main`.

## Deployment

The workflows use SSH + rsync to an Apache document root. Configure the GitHub `staging` and `production` environments, deployment secrets, branch protection, and a required production reviewer before enabling deployment.
