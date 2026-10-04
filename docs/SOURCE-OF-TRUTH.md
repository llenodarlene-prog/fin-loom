# Source of truth

## Source inventory (checked 2026-10-03)

| Source | Location | Use in this repository |
| --- | --- | --- |
| 5-Site SEO GEO AEO Content & Keyword Tracker | Google Sheet `1rtdgN5EZkDx7H7lCsO0UEvOIC0RdZl0Vp7-nAmZXTIw`; workbook snapshot in `data/source/` | Navigation, architecture, 100-item content plan, 20-item launch set, interlinking plan, brand strategy, AI kill list |
| FinLoom - Website Branding Brief | Google Doc `1EGyA57ZA751BHjHKjF7qfz0RRL2El7quQIODIculxX4` | Palette, fonts, type scale, UI rules in `data/site.json` and `src/styles/main.css` |
| Portfolio Content Publishing Standards - All Brands | Google Doc `1dmQeaAdeptANIKtO418fZedy1cIQYWIwEh_qDxgf-lQ` | Editorial rules enforced by `scripts/check-content.mjs` |
| Blog posts (10 articles, 6 charts) | `FinLoom Files/03 Blogs` (local) and the matching Drive folders | Fin Loom blog posts whose live URLs are placed in existing articles on Use The Bitcoin and Stoxcraft. See Supplementary blog posts below |
| Website Copy Draft | `FinLoom Files/02 Website Copy/Website Copy Draft.docx` (local, supplied 2026-10-03) | Home, About, six category pages, Contact, Privacy Policy, Terms and Conditions. Page copy is edited for brand voice in `data/*-page.json`; legal wording is unchanged |
| Brand Book, logos, app icon | `FinLoom Files/05 Assets` (local) | Header logo, favicon, share image in `assets/brand/` |
| Photography (70 AI-generated images) | `FinLoom Files/05 Assets` (local) | Nine scenes without third-party branding or readable invented figures, in `assets/images/` |

| Market data (3 series) | Raw CSV downloads in `data/source/market/`, from FRED, retrieved 2026-10-03 | Charts on the home page and category pages. U.S. Census Bureau: e-commerce share of retail sales. U.S. Bureau of Economic Analysis: investment in information processing equipment and software, and the personal saving rate |

`FinLoom Files/` is the owner's working folder and is not committed. The tracker controls title, primary keyword, cluster, status, URL slug, launch links, and silo. If sources conflict, stop and report the conflict.

## Copy editing rules used

- Page copy keeps every claim in the draft and adds none. Edits merge one-line paragraphs, tighten wording, and apply the brand voice: numerate, calm, market-literate, anti-hype.
- "Follow the Money, Not the Noise" comes from the tracker's one-line promise.
- Privacy Policy and Terms and Conditions keep the supplied wording. Only formatting changed: semicolon runs became lists.
- The draft, tracker, and brand book write the name as one word. The site owner confirmed "Fin Loom" as the public name, so all site text, including the legal pages, uses two words.
- The Terms page is not in the tracker's Site Architecture sheet. It is linked from the footer and listed as a required legal page.

## Charts on designed pages

- Official series are stored unedited in `data/source/market/` and imported with `npm run import:market-data`. Every chart prints its agency, release, series, units, retrieval date, and latest period. A test checks each stored figure against the raw file.
- Arithmetic illustrations are computed in `scripts/lib/illustrations.mjs` and labeled as illustrations.
- The figures are a snapshot. Refresh the CSV files when the agencies publish new data; the agencies also revise past figures.
- "Technology investment" is the BEA series for private fixed investment in information processing equipment and software. It is not a measure of the technology sector's revenue or market value.

## Partner With Us page

The site owner asked for a footer page covering sponsored posts, guest posts, and similar. No copy was supplied, so the page was drafted. It states no prices. Its four partnership standards (disclosure, evidence, no advice or promised returns, editorial control) are consistent with the About page and Privacy Policy but are new commitments, and need owner sign-off in `data/release.json` under `partner_terms`.

## Supplementary blog posts

The fifteen articles in `FinLoom Files/03 Blogs` are Fin Loom blog posts. Each is published on Fin Loom, and its live URL is then placed in an existing article on a partner site (Use The Bitcoin, Stoxcraft, or WebTribunal). They sit outside the tracker's 20-item launch set, so they are recorded in `data/supplementary-content-plan.json` and go through the same research, content, and release checks. By owner decision of 2026-10-04 these posts have a minimum of 2,500 words and no ceiling, recorded on each plan record as `min_words` and `no_word_ceiling`. Tracker items keep the 2,000 to 2,600 range.

All fifteen are in the repository as drafts, imported with `npm run import:posts`, which applies the mechanical editing pass and never overwrites an existing post. The owner's schedule is seven posts on 2026-10-04 and eight on 2026-10-05, recorded as `scheduled_publish` in the plan; a post publishes only when its research record is verified and it passes the content checks, with its real publication date. Supplied chart images are not used; `charts_pending` in a post's front matter counts charts still to be redrawn from verified data. Two are finished to content-check standard: Crypto Airdrop Risk (`/crypto/crypto-airdrop-risk/`) and Crypto vs Stocks (`/investing/crypto-vs-stocks/`). The supplied chart image is not used; charts are redrawn from `data/charts.json`. Chart figures from Chainalysis were checked against the source on 2026-10-04. Both had an editing pass on 2026-10-04 and pass the content checks: fragment bullet lists were folded into the sentences that introduce them with every item kept, flagged filler words were removed, and sources named in the text now link to the page they cite. The author is Darlene Aberin, verified by the site owner. Before either post is published it still needs a completed research record with Ubersuggest data and competitor review, fact-check sign-off, and a truthful publication date.

## Content status on 2026-10-04

All fifteen supplementary posts pass the content checks when dry-run as published, and all have hero images. They remain drafts. Each research record carries a `verification_log` stating what was checked against the original source and what is still pending. Only S1 (crypto airdrop) has complete research (Ubersuggest data, five competitors, sources, statistics) and sits at `planned`, awaiting a named fact-check and QA sign-off. `npm run audit:seo` reports the SEO elements and image hygiene of every built page.

## Open items

Each one blocks production through `npm run release:check`.

1. **Owner approvals:** contact address, privacy policy, financial disclaimer, partner terms, staging review, and production approval each need a named, dated sign-off in `data/release.json`. The copy, address (finloom@gmail.com), and policy date (October 3, 2026) are in place but unapproved.
2. **Legal review:** the Privacy Policy and Terms came from a draft. They have not been reviewed by a lawyer as far as this repository records.
4. **Brand clearance:** the tracker's Brand Strategy sheet flags an active FINLOOM U.S. trademark application and asks for counsel review before public launch.
5. **Logo transparency:** the supplied logo files have an off-white background. A transparent version is needed to place the logo on dark panels.
6. **Tracker freshness:** a newer workbook export sits in `FinLoom Files/` with a different hash from the preserved snapshot in `data/source/`. Diff and re-import before relying on tracker data for publication decisions.
7. **First published blog:** none of the 20 backlog items has a research record or draft yet.
