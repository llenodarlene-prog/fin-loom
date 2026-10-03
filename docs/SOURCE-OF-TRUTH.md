# Source of truth

## Source inventory (checked 2026-10-03)

| Source | Location | Use in this repository |
| --- | --- | --- |
| 5-Site SEO GEO AEO Content & Keyword Tracker | Google Sheet `1rtdgN5EZkDx7H7lCsO0UEvOIC0RdZl0Vp7-nAmZXTIw`; workbook snapshot in `data/source/` | Navigation, architecture, 100-item content plan, 20-item launch set, interlinking plan, brand strategy, AI kill list |
| FinLoom - Website Branding Brief | Google Doc `1EGyA57ZA751BHjHKjF7qfz0RRL2El7quQIODIculxX4` | Palette, fonts, type scale, UI rules in `data/site.json` and `src/styles/main.css` |
| Portfolio Content Publishing Standards - All Brands | Google Doc `1dmQeaAdeptANIKtO418fZedy1cIQYWIwEh_qDxgf-lQ` | Editorial rules enforced by `scripts/check-content.mjs` |
| finloom_use_the_bitcoin_first_5 (5 articles, 3 charts) | Drive folder `10jqzxLjI9L_p5LUlaUy7N0Kprs7ybCz3` | Not site content. Off-site placements for Use The Bitcoin, each with one link to a Fin Loom category page |
| FinLoom_Stoxcraft_Next_5_Articles (5 articles, 3 charts) | Drive folder `1vEUye0BRm_RnVUD5n-aXB676zcRWCFmB` | Not site content. Off-site placements for Stoxcraft, each with one link to a Fin Loom category page |
| Fin Loom logo concepts (unnamed PNG files) | Drive folder `15apHQ0KNhFa0yxjtqqklo6tTJJ_p07lV` | Not imported. No file is identified as the approved logo |

The tracker controls title, primary keyword, cluster, status, URL slug, launch links, and silo. If sources conflict, stop and report the conflict.

## Open items

Nothing below may be invented. Each one blocks production through `npm run release:check`.

1. **Approved website copy:** no home, about, category, or contact copy document exists for Fin Loom. Core pages are drafts built from tracker text.
2. **Privacy policy:** no approved policy or effective date.
3. **Financial and editorial disclaimer:** no approved wording. The footer carries interim wording taken from the site owner's build instruction, marked in `data/footer.json`.
4. **Contact address:** the tracker suggests a Gmail handle whose availability is unconfirmed. No address is published.
5. **Author:** no verified, publishable author in `data/authors.json`.
6. **Logo files:** the header uses a text wordmark until approved logo, icon, and social files are supplied and registered.
7. **Brand clearance:** the tracker's Brand Strategy sheet flags an active FINLOOM U.S. trademark application and asks for counsel review before public launch.
8. **Display name:** the tracker and branding brief say "FinLoom" as one word. The site owner's instructions and the GitHub `SITE_NAME` variable say "Fin Loom". The site uses "Fin Loom"; change `name` in `data/site.json` and the `SITE_NAME` variable together if the one-word form is preferred.
9. **Tracker freshness:** the live sheet was modified on 2026-09-23, after the preserved workbook snapshot. Re-export and diff before relying on it for publication decisions.
10. **First published blog:** none of the 20 backlog items has a research record or draft yet.
