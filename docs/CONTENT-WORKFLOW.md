# Content workflow

1. Select an approved tracker row and verify its current status.
2. Read every source in `docs/GUIDELINES.md`, then the research brief and source plan. Record evidence limits before outlining.
3. Scaffold the exact launch record and its research sidecar with `npm run new:content -- <article|blog> <number>`.
4. Complete `docs/RESEARCH-RECORD.md`: primary evidence, full statistic context, Ubersuggest retrievals (historical Ahrefs data kept with its attribution), five ranking competitors, content mapping, gaps, value-add, and the section evidence plan.
5. Draft to the article or blog structure in `CLAUDE.md`.
6. Place only tracker-approved silo links, where the surrounding sentence already supports the anchor. Place two or three verified source links contextually before Resources and put other approved sources in Resources.
7. Move the research record through `scaffolded`, `researched`, `planned`, and `verified`. `npm run check:research` validates every stage even while the article or blog remains a draft.
8. Complete the research sidecar, fact-check every material claim, register all images in `data/assets.json`, complete verified author and date fields, then run `npm run verify`.
9. Review staging before production approval.

Drafts with `draft: true` are excluded from production. “Ready for Source Verification” means the brief is ready, not that its evidence has already been verified.

The production gate requires the structured approvals and `launch_policy` in `data/release.json`: complete core and legal pages plus at least one published blog. The 20 launch IDs are the editorial backlog and publish one per day after launch; each must pass every check before it goes live. Removing warning copy cannot satisfy that gate. See `docs/DEPLOYMENT.md` for the full launch policy.

## Final QA layer for owner-supplied posts

Owner rule of 2026-10-20: when the owner sends finished posts, the AI assistant runs one more independent QA and fact-check pass, even though the owner has already researched and checked them. Do every step and report the results before scheduling.

1. **Intake.** Confirm each post's keyword, slug, silo, pillar and publish slot. Flag any keyword that does not match the title or H1, and any slug or schedule conflict.
2. **Fact-check every claim** against its primary source, not a secondary summary:
   - Figures, percentages, prices, dates, rankings and product features from the publisher's own page, filing or dataset.
   - Quotes checked word for word.
   - Calculations recomputed.
   - Estimates, forecasts, partial-year data and sponsored studies labelled.
3. **Unverifiable claims are removed or replaced** with a verified alternative. Never keep a claim "to fix later". List each one for the owner, with the reason.
4. **Editorial QA:**
   - Run `CLAUDE.md` rules and `npm run check:content`: word count, keyword placement, Key Takeaways and FAQ without intros, H3 sections of 40+ words, and no em dashes or kill-list words.
   - Check for no buy, sell or hold language and no implied returns.
5. **Links and silo:**
   - Spoke-to-pillar and pillar-to-spoke body links, plus a sibling link, per `docs/SEO-AEO-GEO-SOP.md`. Confirm with `npm run check:silo`.
   - Two or three contextual external links to verified sources.
6. **Research record:** Ubersuggest data, five competitors, and every source with its check date. The record moves to `verified` only after this pass.
7. **Images:** each image is registered in `data/assets.json` with dimensions, rights and alt text.
8. **Report to the owner:** a QA report in `docs/qa/` that lists every correction, every removed claim, keyword or schedule issues, and check results. The owner signs off; only then does the post leave draft and go into a PR to `staging`.
