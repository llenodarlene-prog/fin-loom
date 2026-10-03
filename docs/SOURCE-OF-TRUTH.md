# Source of truth

## Source inventory (checked 2026-10-03)

| Source | Location | Use in this repository |
| --- | --- | --- |
| 5-Site SEO GEO AEO Content & Keyword Tracker | Google Sheet `1rtdgN5EZkDx7H7lCsO0UEvOIC0RdZl0Vp7-nAmZXTIw`; workbook snapshot in `data/source/` | Navigation, architecture, 100-item content plan, 20-item launch set, interlinking plan, brand strategy, AI kill list |
| FinLoom - Website Branding Brief | Google Doc `1EGyA57ZA751BHjHKjF7qfz0RRL2El7quQIODIculxX4` | Palette, fonts, type scale, UI rules in `data/site.json` and `src/styles/main.css` |
| Portfolio Content Publishing Standards - All Brands | Google Doc `1dmQeaAdeptANIKtO418fZedy1cIQYWIwEh_qDxgf-lQ` | Editorial rules enforced by `scripts/check-content.mjs` |
| finloom_use_the_bitcoin_first_5 (5 articles, 3 charts) | Drive folder `10jqzxLjI9L_p5LUlaUy7N0Kprs7ybCz3` | Not site content. Off-site placements for Use The Bitcoin, each with one link to a FinLoom category page |
| FinLoom_Stoxcraft_Next_5_Articles (5 articles, 3 charts) | Drive folder `1vEUye0BRm_RnVUD5n-aXB676zcRWCFmB` | Not site content. Off-site placements for Stoxcraft, each with one link to a FinLoom category page |
| Website Copy Draft | `FinLoom Files/02 Website Copy/Website Copy Draft.docx` (local, supplied 2026-10-03) | Home, About, six category pages, Contact, Privacy Policy, Terms and Conditions. Page copy is edited for brand voice in `data/*-page.json`; legal wording is unchanged |
| Brand Book, logos, app icon | `FinLoom Files/05 Assets` (local) | Header logo, favicon, share image in `assets/brand/` |
| Photography (70 AI-generated images) | `FinLoom Files/05 Assets` (local) | Nine scenes without third-party branding or readable invented figures, in `assets/images/` |

`FinLoom Files/` is the owner's working folder and is not committed. The tracker controls title, primary keyword, cluster, status, URL slug, launch links, and silo. If sources conflict, stop and report the conflict.

## Copy editing rules used

- Page copy keeps every claim in the draft and adds none. Edits merge one-line paragraphs, tighten wording, and apply the brand voice: numerate, calm, market-literate, anti-hype.
- "Follow the Money, Not the Noise" comes from the tracker's one-line promise.
- Privacy Policy and Terms and Conditions keep the supplied wording. Only formatting changed: semicolon runs became lists.
- The Terms page is not in the tracker's Site Architecture sheet. It is linked from the footer and listed as a required legal page.

## Open items

Each one blocks production through `npm run release:check`.

1. **Owner approvals:** contact address, privacy policy, financial disclaimer, staging review, and production approval each need a named, dated sign-off in `data/release.json`. The copy, address (finloom@gmail.com), and policy date (October 3, 2026) are in place but unapproved.
2. **Legal review:** the Privacy Policy and Terms came from a draft. They have not been reviewed by a lawyer as far as this repository records.
3. **Author:** no verified, publishable author in `data/authors.json`.
4. **Brand clearance:** the tracker's Brand Strategy sheet flags an active FINLOOM U.S. trademark application and asks for counsel review before public launch.
5. **Logo transparency:** the supplied logo files have an off-white background. A transparent version is needed to place the logo on dark panels.
6. **Tracker freshness:** a newer workbook export sits in `FinLoom Files/` with a different hash from the preserved snapshot in `data/source/`. Diff and re-import before relying on tracker data for publication decisions.
7. **First published blog:** none of the 20 backlog items has a research record or draft yet.
8. **Off-site article targets:** confirm the FinLoom link target in Stoxcraft articles 06, 07, 08, and 10.
