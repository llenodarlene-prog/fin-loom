# Deployment

GitHub environments named `staging` and `production` hold the deployment configuration. Production must require human reviewers.

## Staging

- Branch: `staging`. Workflow: `.github/workflows/deploy-staging.yml`.
- URL: https://staging.finloom.org
- Document root: `/home/u285869133/domains/finloom.org/public_html/staging`
- Variables: `DEPLOY_PORT=65002`, `SITE_NAME=FinLoom`, `SITE_URL=https://staging.finloom.org`.
- Secrets: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_ROOT`, `DEPLOY_SSH_KEY`, `SSH_KNOWN_HOSTS` (pinned from an independently verified host key).

In this repository the staging environment's `SITE_URL` is the staging address. Canonical URLs never come from that variable; they come from `url` in `data/site.json` (`https://finloom.org`).

The workflow builds with `BUILD_ENV=staging`, runs every check, confirms the target, uploads only `dist/` with `scripts/deploy-document-root.sh`, and smoke-tests the result. The repository source is never uploaded.

Staging is always noindex, enforced four ways:

1. Every page carries `<meta name="robots" content="noindex,nofollow,noarchive">`.
2. `.htaccess` sends `X-Robots-Tag: noindex, nofollow, noarchive` for every file.
3. `scripts/check-staging-target.mjs` refuses a build that is indexable or a staging URL on the production domain.
4. The deploy script refuses a staging `DEPLOY_ROOT` that does not end in `/staging`, and the smoke test fails if the live page or header is not noindex.

`robots.txt` stays crawlable so the noindex directives can be read. It is not access control; add Hostinger password protection if staging must be private.

## Production

Production deploys only from `main` and has not been configured or run. The production document root is the parent of the staging folder, so the production workflow passes `DEPLOY_PRESERVE_DIR=staging` to leave staging in place. Configure the `production` environment (with `SITE_URL=https://finloom.org`) only after staging review.

## Launch policy

`data/release.json` (schema version 2) defines the launch. `npm run release:check` passes when:

- Every page in `required_pages` exists, is not a draft, and has no prelaunch language. Every navigation and footer page is listed there, and every page in `legal_pages` is complete.
- Contact, privacy, financial disclaimer, brand clearance, staging review, and production approvals are each named and dated.
- Approved logo, icon, and social files are registered, and the footer disclaimer is approved wording.
- At least `minimum_published_blogs` (currently 1) blog is published, and every published item maps to exactly one tracker record.
- `npm run check:research` and `npm run check:content` pass for everything published.
- The production build contains no draft page, link, listing, sitemap or RSS entry, or structured-data reference. Links to unpublished drafts render as plain text until that item publishes.

The 10 articles and 10 blogs in `data/launch-content-plan.json` are the editorial backlog. They are not a launch requirement, and drafts never block a release. After launch, publish at most one completed item per day.
