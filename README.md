# Fin Loom static website

Tracker-driven repository for https://finloom.org. Fin Loom is an informational financial publication, not a financial adviser.

The site is generated into `dist/` by a dependency-free Node build. Tracker data in `data/` controls navigation, URLs, the content plan, and the launch silo, and validation enforces it. The architecture, checks, and deployment method follow the Verdict Point repository; the brand, copy, and content are Fin Loom's own.

## Current state

- Core pages use the owner's Website Copy Draft, edited for brand voice, with the supplied logo and photography. Legal pages keep the supplied wording.
- No article or blog is published. The 20 tracker items with approved URLs are the editorial backlog in `data/launch-content-plan.json`.
- Staging deploys from the `staging` branch and is always `noindex`.
- Production is blocked by the launch gate until every item in `docs/SOURCE-OF-TRUTH.md` under "Open items" is resolved.

## Commands

```bash
npm ci
npm run verify          # clean, build, and run every check and test
npm run dev             # local preview on http://localhost:8080
npm run release:check   # production launch gate
npm run new:content -- blog 1   # scaffold a tracker item and its research record
```

## Branches

Work happens on `feature/*` branches, merges into `staging` by pull request, and reaches `main` by a second pull request after staging review. Never push directly to `staging` or `main`.

## Documentation

- `CLAUDE.md` / `AGENTS.md`: rules for anyone, human or agent, working in this repository.
- `docs/SOURCE-OF-TRUTH.md`: source inventory and open items.
- `docs/CONTENT-WORKFLOW.md` and `docs/RESEARCH-RECORD.md`: research-first publishing workflow.
- `docs/DEPLOYMENT.md`: environments, staging deployment, and the launch policy.
