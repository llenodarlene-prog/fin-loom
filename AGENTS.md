# FinLoom Operating Policy

## Editorial

- Never invent statistics, prices, features, dates, authors, quotes, rankings, reviews, or first-party findings.
- Verify changeable facts against current primary sources immediately before publication.
- Keep distinct measures distinct and define material terms.
- Ahrefs is the required live SEO research tool. Ubersuggest is a secondary cross-check; historical tool data is context only.
- Use 2 to 3 contextual internal links and at least 3 useful external links per published piece where supported.
- Do not publish without a verified research record, fact-check sign-off, and QA sign-off.
- Apply `data/ai-kill-list.json`. Do not use em dashes.

## Repository

- Work on `feature/*`. Never push directly to `staging` or `main`.
- Run `npm run verify` before opening a pull request.
- Run `npm run release:check` before production release.
- Keep drafts out of production pages, listings, sitemap, feed, and structured data.
- Do not commit secrets or raw private source exports.
- Do not weaken validators or bypass the release gate.

## Launch Policy

Production requires completed core pages, release approvals, and at least one fully verified published blog. Remaining launch items may stay backlog.
