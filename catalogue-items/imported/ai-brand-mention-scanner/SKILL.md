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

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**Makes it better (optional):**
- **Brand brain**, made by the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder): your facts, products, buyers, claims and voice, in one folder of eight files.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand brain** with the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the brand brain, read:** `00-start-here.md`, `proof-and-claims.md`, `offers.md`, `voice-and-look.md`. Take the claims list with each claim's status, the offer terms word for word, and the voice rules. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand brain is a folder with `00-start-here.md` in it (often `brand-brain/`). If it's there, read that file and the files above. Look for the other things by name.
2. **Check what's missing.** Look for your brand brain. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude, ChatGPT or Gemini with web search on:** The scan needs to look at live pages on each site.
<!-- /needs -->

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

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [AI search visibility analyst](https://useaiblocks.com/skills/ai-search-visibility-optimiser). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
