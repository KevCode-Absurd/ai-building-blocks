---
name: product-differentiation-amazon
version: 1.0.0
author: Nexscope AI
description: "Amazon product differentiation strategy tool. Analyze competitor weaknesses, extract pain points from negative reviews, identify unique selling points from positive reviews, and generate actionable differentiation strategies. Progressive L1-L4 analysis depth. No API key required."
metadata: {"nexscope":{"emoji":"🎯","category":"ecommerce"}}
---

# Product Differentiation — Amazon 🎯

Develop winning product differentiation strategies by analyzing competitor reviews and market positioning.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

**Makes it better (optional):**
- **Brand brain** (its products part), made by the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder): your facts, products, buyers, claims and voice, in one folder of eight files.
- **Competitors** (yours): the brands buyers compare you with.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand brain** with the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the brand brain, read:** `00-start-here.md`, `customers.md`, `offers.md`, `proof-and-claims.md`, `market.md`. Take the buyers, the main promise and approved claims only. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand brain is a folder with `00-start-here.md` in it (often `brand-brain/`). If it's there, read that file and the files above. Look for the other things by name.
2. **Check what's missing.** Look for customer words, your brand brain, competitors. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Installation

```bash
npx skills add nexscope-ai/eCommerce-Skills --skill product-differentiation-amazon -g
```

## Features

- **Competitor Matrix** — Side-by-side product comparison
- **Pain Point Mining** — Extract issues from negative reviews
- **USP Extraction** — Identify selling points from positive reviews
- **Differentiation Opportunities** — Find gaps in the market
- **Positioning Strategy** — Market positioning recommendations
- **Action Plan** — Prioritized improvement roadmap

## Progressive Analysis Levels

| Level | Required Data | Unlocked Analysis |
|-------|---------------|-------------------|
| **L1 Basic** | Product info | Basic comparison matrix |
| **L2 Pain Points** | + Competitor negative reviews | Pain point analysis |
| **L3 USP** | + Your positive reviews | Selling point extraction |
| **L4 Complete** | + Market data | Full strategy & action plan |

## Analysis Dimensions

| Dimension | Method | Output |
|-----------|--------|--------|
| Feature Gap | Competitor comparison | Missing features list |
| Pain Points | Negative review NLP | Top complaints ranked |
| Selling Points | Positive review NLP | Key USPs identified |
| Price Position | Price-value mapping | Positioning quadrant |
| Quality Signals | Review sentiment | Quality perception score |

## Usage

### Interactive Mode

```bash
python3 scripts/analyzer.py
```

### With Parameters

```bash
python3 scripts/analyzer.py '{
  "your_asin": "B08XXXXXX1",
  "competitor_asins": ["B08XXXXXX2", "B08XXXXXX3"],
  "category": "Electronics"
}'
```

### Demo Mode

```bash
python3 scripts/analyzer.py --demo
```

## Input Example

```json
{
  "your_product": {
    "asin": "B08XXXXXX1",
    "title": "[YOUR PRODUCT TITLE]",
    "price": 0.00,
    "rating": 0.0,
    "features": ["[FEATURE 1]", "[FEATURE 2]", "[FEATURE 3]"]
  },
  "competitors": [
    {
      "asin": "B08XXXXXX2",
      "title": "[RIVAL PRODUCT TITLE]",
      "price": 0.00,
      "rating": 0.0
    }
  ],
  "negative_reviews": [...],
  "positive_reviews": [...]
}
```

## Output Example

This is made-up sample output. Every name, number and price below is a placeholder. Fill them from the user's own data only. Impact figures are guesses to test, never predictions. Do not promise them.

```
🎯 Product Differentiation Report

Product: [YOUR PRODUCT]
Category: [CATEGORY]
Competitors Analyzed: [COUNT]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 COMPETITOR COMPARISON MATRIX

Feature         | You     | Comp A  | Comp B  | Comp C
─────────────────────────────────────────────────
[FEATURE 1]     | [VALUE] | [VALUE] | [VALUE] | [VALUE]
[FEATURE 2]     | [VALUE] | [VALUE] | [VALUE] | [VALUE]
[FEATURE 3]     | [VALUE] | [VALUE] | [VALUE] | [VALUE]
Price           | [PRICE] | [PRICE] | [PRICE] | [PRICE]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

😤 TOP PAIN POINTS (from competitor reviews)

1. 🔴 [COMPLAINT 1] (mentioned [COUNT]x)
2. 🔴 [COMPLAINT 2] (mentioned [COUNT]x)
3. 🟡 [COMPLAINT 3] (mentioned [COUNT]x)
4. 🟡 [COMPLAINT 4] (mentioned [COUNT]x)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ YOUR UNIQUE SELLING POINTS

1. ⭐ [STRENGTH 1] ([YOUR VALUE] vs rival average [VALUE])
2. ⭐ [STRENGTH 2] ([YOUR VALUE])
3. ⭐ [STRENGTH 3] (praised in your reviews)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 DIFFERENTIATION OPPORTUNITIES

1. [FEATURE GAP rivals leave open]
2. [MESSAGING GAP in your listing]
3. [STRENGTH to put first in your listing]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 ACTION PLAN

Priority | Action                    | Effect to test
─────────────────────────────────────────────
HIGH     | [ACTION 1]                | [EFFECT TO TEST, not a promise]
HIGH     | [ACTION 2]                | [EFFECT TO TEST, not a promise]
MEDIUM   | [ACTION 3]                | [EFFECT TO TEST, not a promise]
LOW      | [ACTION 4]                | [EFFECT TO TEST, not a promise]
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Write the landing page** with the [Product listing writer](https://useaiblocks.com/skills/product-listing-writer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Strategy Framework

```
Competitor Analysis
      ↓
Pain Point Mining
      ↓
USP Identification
      ↓
Gap Analysis
      ↓
Positioning Strategy
      ↓
Action Plan
```

---

**Part of [Nexscope AI](https://www.nexscope.ai/?co-from=skill) — AI tools for e-commerce sellers.**
