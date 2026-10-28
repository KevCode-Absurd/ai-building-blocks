---
name: etsy-seo
version: 1.0.0
author: Nexscope AI
description: "Etsy SEO analyzer and optimizer. Improve search visibility with title optimization, tag analysis, description scoring, and keyword suggestions from fixed category lists. Includes SEO scoring (0-100), long-tail tag suggestions, and prioritized action plans. No API key required."
metadata: {"nexscope":{"emoji":"🔍","category":"ecommerce"}}
---

# Etsy SEO 🔍

Analyze and optimize Etsy listings for better search visibility.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Pdp copy** (yours): product page copy: title, benefits, details, FAQ, proof blocks.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for pdp copy. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Installation

```bash
npx skills add nexscope-ai/eCommerce-Skills --skill etsy-seo -g
```

## Features

- **SEO Score** — 0-100 comprehensive rating
- **Title Optimization** — Keyword placement, length analysis
- **Tag Analysis** — 13 tag optimization, long-tail suggestions
- **Description Analysis** — First 160 chars, keyword density
- **Attribute Check** — Completeness validation
- **Keyword ideas** — Suggestions from fixed category lists (no live Etsy search data, no competitor data)
- **Action Plan** — Prioritized improvement roadmap

## SEO Scoring Weights

| Dimension | Weight | Max Score |
|-----------|--------|-----------|
| Title | 30% | 100 |
| Tags | 25% | 100 |
| Description | 20% | 100 |
| Attributes | 15% | 100 |
| Images | 10% | 100 |

## Etsy Tag Rules

| Rule | Specification |
|------|---------------|
| Quantity | Max 13 tags |
| Length | Max 20 characters each |
| Format | Multi-word phrases allowed |
| Strategy | Long-tail + synonyms + attributes |

## Title Best Practices

```
[Core Keyword] + [Attributes] + [Material/Style] + [Use Case/Occasion]

✅ Good:
"Personalized Name Bracelet, Custom Gold Bracelet for Women, Birthday Gift"

❌ Bad:
"Beautiful Handmade Bracelet"
```

## Usage

### With Listing Data

Pass the listing as a JSON string, or as a path to a JSON file:

```bash
python3 scripts/analyzer.py '{
  "title": "Handmade Silver Ring",
  "tags": ["silver ring", "handmade jewelry"],
  "description": "Beautiful handmade ring...",
  "category": "Jewelry",
  "attributes": {"material": "silver"},
  "images": 6
}'

python3 scripts/analyzer.py listing.json
```

`category` can be a name like `Jewelry`, `Home Decor` or `Jewelry > Rings`. If it does not match one of the built-in lists (jewelry, home decor, clothing, accessories, art, craft supplies, wedding), the general list is used. Add `--zh` for the Chinese layout.

### Demo Mode

```bash
python3 scripts/analyzer.py --demo
```

With no listing (or with `--demo`) the script scores a made-up demo bracelet and says so. It never scores the demo when you pass a listing.

### What the script does and does not do

The script scores the listing, lists the issues, suggests tags from a fixed category list (each 20 characters or fewer) and prints a P1/P2 action plan. Its suggested title is only a starting point. It does not research keywords, read competitor listings or know your product.

After running it (or if Python is not available, by applying the same rules yourself), finish the job for the person:

1. Drop any suggested tag that does not describe their actual product (the fixed lists are broad, so a mug can get "wall art").
2. Write a rewritten title from their real product facts: core keyword first, then attributes, material or style, then use or occasion, 140 characters or fewer.
3. Give a full set of 13 tags, each 20 characters or fewer. Count the characters.
4. Order the fixes P1 first. Do not promise a score or sales gain.

## Output Example

Real output from `python3 scripts/analyzer.py --demo` (the demo listing is made up):

```
🏷️ **Etsy SEO Analysis Report**

**Listing**: Beautiful Handmade Bracelet...
**Category**: jewelry

## 🟠 SEO Score: 43/100 (Grade D)

| Dimension | Score | Weight |
|-----------|-------|--------|
| Title | 40/100 | 30% |
| Tags | 47/100 | 25% |
| Description | 45/100 | 20% |
| Attributes | 40/100 | 15% |
| Images | 50/100 | 10% |

## 📝 Title Analysis
Length: 27/140 | Keywords: 0

- ❌ Title too short (< 40 chars)
- ❌ No category keywords found in title
- ❌ Title has too few words

Starting point for a new title (rewrite it with your real product facts):
`Handmade Jewelry, Beautiful Handmade Bracelet`

## 🏷️ Tag Analysis
Used: 5/13 | Multi-word: 0 | Average length: 6.6 chars
- ❌ Only 5/13 tags used
- ❌ 1 tags are too short
- ❌ Need more multi-word (long-tail) tags

Suggested tags (from a fixed category list, each 20 characters or fewer):
`handmade jewelry`, `custom bracelet`, `birthstone ring`, `minimalist earrings`, `gold filled`, `sterling silver`, `dainty jewelry`, `layered necklace`

## 📄 Description Analysis
Length: 85 chars | Call to action: no
First 160 characters: "A beautiful handmade bracelet perfect for any occasion. Made with high quality beads."
- ❌ Description too short (< 100 chars)
- ❌ No category keywords in description
- 💡 Add a call-to-action

## 📋 Action Plan (P1 first)
- [P1] [Title] Fix: Title too short (< 40 chars)
- [P1] [Title] Fix: No category keywords found in title
- [P1] [Title] Fix: Title has too few words
- [P1] [Tags] Add 8 more tags
- [P2] [Tags] Fix: Need more multi-word (long-tail) tags
- [P2] [Description] Fix: Description too short (< 100 chars)

SEO Score: 43/100 (D) | Title: 40 | Tags: 47 | Desc: 45
```

(Some lines are left out above for space.) For this demo, the finished answer would drop tags that are not bracelets (`birthstone ring`, `minimalist earrings`, `layered necklace`) and add bracelet tags of 20 characters or fewer, such as `beaded bracelet`, `blue bracelet` or `gift for her`.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Collection page SEO builder](https://useaiblocks.com/skills/collection-page-seo-builder). It takes the keyword list and audit report.
- The [Product page SEO builder](https://useaiblocks.com/skills/product-page-seo-builder). It takes the keyword list.
- The [Store SEO fix prioritiser](https://useaiblocks.com/skills/store-seo-fix-prioritiser). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Keyword Research

The tool suggests keywords from fixed category rules and long-tail variations. It does not use live competitor data or real search volume. Check any suggestion against real Etsy search results before you use it.

## Optimization Workflow

```
Analyze current listing
      ↓
Score each dimension
      ↓
Identify gaps
      ↓
Generate suggestions
      ↓
Prioritize actions
      ↓
Track improvements (log your own scores each time; the tool does not store them)
```

---

**Part of [Nexscope AI](https://www.nexscope.ai/?co-from=skill) — AI tools for e-commerce sellers.**
