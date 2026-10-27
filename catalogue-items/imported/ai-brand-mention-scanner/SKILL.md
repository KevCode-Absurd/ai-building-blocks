---
name: geo-brand-mentions
description: Brand mention and authority scanner for AI visibility.
category: seo
risk: safe
source: https://github.com/zubair-trabzada/geo-seo-claude
source_repo: zubair-trabzada/geo-seo-claude
source_type: community
date_added: '2026-09-20'
license: MIT
license_source: https://github.com/zubair-trabzada/geo-seo-claude/blob/main/LICENSE
compatibility: Docs-only; upstream helper scripts and templates are not bundled. Site
  audits need network access to the target site; PDF reports need pandoc and headless
  Chrome.
allowed-tools:
- Read
- Grep
- Glob
- Bash
- WebFetch
- Write
---

# Brand Mention Scanner Skill

## Core Insight

> **Unchecked claims:** the 3x figure and the Ahrefs study below are the original author's claims. AI Blocks has not checked them. See "What the score means" for the same caveat.

Brand mentions correlate approximately 3x more strongly with AI visibility than traditional backlinks, according to the author. An Ahrefs study published in December 2025, analyzing 75,000 brands across AI search platforms, found that **unlinked brand mentions** -- references to a brand name without a hyperlink -- are a stronger predictor of whether AI systems cite and recommend a brand than Domain Rating or backlink count.

The critical finding: **the platform where the mention appears matters enormously.** Not all mentions are equal. A mention on YouTube or Reddit carries far more weight for AI citation than a mention on a low-authority blog, because AI training data and retrieval systems disproportionately index high-engagement platforms.

This inverts a core assumption of traditional SEO. In traditional SEO, a backlink from a high-DR site is the gold standard. In GEO, an unlinked mention on Reddit or a YouTube video description may be more valuable than a dofollow backlink from a DR 70 blog.

---


## Contents

- [Platform Importance Ranking for AI Citations](references/details.md)
- [Composite Brand Authority Score](references/details.md)
- [Analysis Procedure](references/details.md)
- [Output Format](references/details.md)
- [Brand Authority Score: [X]/100 ([Rating])](references/details.md)
- [Platform Detail](references/details.md)
- [Recommendations](references/details.md)
- [Competitive Context](references/details.md)
- [Key Takeaway](references/details.md)
- [Reference Data](references/details.md)

## How to run this skill

AI Blocks added this section. It replaces the generic "When to Use", "Limitations" and "Example" text that came with the import, which described a general site audit and did not match this skill. The brand-mention method is in `references/details.md`, and you must follow it.

### What you need
- The brand name, spelled exactly, with any other spellings.
- The website address.
- Optional: founder or CEO name, top products, up to two rival brands.
- The file `references/details.md`. If you only have this file, ask the person to add it.

### Steps
1. Read `references/details.md`: the platform scoring tables, the Composite Brand Authority Score, the Analysis Procedure and the Output Format.
2. Follow the Analysis Procedure, step by step.
3. Write the report in the Output Format and save it as `GEO-BRAND-MENTIONS.md`.

### Keep it read-only and polite
- Read public pages only. Do not log in, post, edit, or change anything on any site.
- Respect each site's robots.txt and terms. Keep to a few searches per site, with no loops.
- If a site blocks you, shows a CAPTCHA or asks for a login, stop on that site. Mark it `not checked`. Do not try to get around it.

### If you cannot browse or run code
- Ask the person to search each site themselves (for example the brand name plus `site:reddit.com`) and paste the results. The Wikipedia check can be done by opening `https://en.wikipedia.org/wiki/<Brand_Name>`.
- Mark every site you could not check as `not checked`. Never fill in a score, count, subscriber number or quote that you did not see.
- If not all five groups were checked, show the total as partial. Add up only the groups you checked, divide by their combined weight, and label it "partial, based on <sites>".

### What the score means
- The score is a rough guide. It is a weighted sum of five site scores, using the weights in `references/details.md`. It does not promise that any AI will name the brand.
- The study figures in the reference file (the Ahrefs study of 75,000 brands, the correlations) are the original author's claims. Say so, and do not present them as checked.

### Licence and credit
- The original skill is by zubair-trabzada (MIT). It was shared in sickn33's collection, where written content is under CC BY 4.0. Keep both credits.

> Adapted from [zubair-trabzada/geo-seo-claude](https://github.com/zubair-trabzada/geo-seo-claude) (MIT); frontmatter, When to Use/Limitations, and safety boundaries added for upstream compliance. Docs-only import: upstream runtime helpers not bundled.
