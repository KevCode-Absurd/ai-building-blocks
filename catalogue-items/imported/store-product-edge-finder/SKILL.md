---
name: product-differentiation-shopify
version: 1.0.0
author: Nexscope AI
description: "Shopify/DTC product differentiation strategy tool. Analyze competitor stores, extract pain points from reviews, identify brand positioning opportunities, and generate actionable differentiation strategies. Includes DTC-specific metrics like CAC, LTV, and brand story analysis. No API key required."
metadata: {"nexscope":{"emoji":"🎯","category":"ecommerce"}}
---

# Product Differentiation — Shopify/DTC 🎯

Develop winning product differentiation strategies for Shopify and DTC brands.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

**Makes it better (optional):**
- **Competitors** (yours): the brands buyers compare you with.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for customer words, competitors. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Installation

```bash
npx skills add nexscope-ai/eCommerce-Skills --skill product-differentiation-shopify -g
```

## Features

- **Competitor Matrix** — Side-by-side store comparison
- **Pain Point Mining** — Extract issues from competitor reviews
- **USP Extraction** — Identify brand differentiators
- **Brand Positioning** — Market positioning strategy
- **Value Proposition** — Unique value messaging
- **Action Plan** — Prioritized improvement roadmap

## DTC-Specific Analysis

| Dimension | Method | Output |
|-----------|--------|--------|
| Brand Story | Narrative analysis | Story gaps |
| Price Position | Price-value mapping | Positioning quadrant |
| Visual Identity | Design comparison | Differentiation opportunities |
| Social Proof | Review/UGC analysis | Trust signals |
| Ad Creative | Ad copy analysis | Messaging gaps |

## Progressive Analysis Levels

| Level | Required Data | Unlocked Analysis |
|-------|---------------|-------------------|
| **L1 Basic** | Store info | Basic comparison matrix |
| **L2 Pain Points** | + Competitor reviews | Pain point analysis |
| **L3 USP** | + Your reviews | Selling point extraction |
| **L4 Complete** | + Ad/social data | Full strategy & action plan |

## Usage

### Interactive Mode

```bash
python3 scripts/analyzer.py
```

### With Parameters

```bash
python3 scripts/analyzer.py '{
  "your_store": "yourbrand.com",
  "competitors": ["competitor1.com", "competitor2.com"],
  "category": "Skincare"
}'
```

## Output Example

Format only. Every name, count and impact figure below is a placeholder, not real data. In a real run, use only what the user pasted, and label any impact as a guess (High, Medium or Low) rather than a percentage.

```
🎯 Shopify/DTC Differentiation Report

Brand: YourBrand
Category: Skincare
Competitors Analyzed: 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 COMPETITOR COMPARISON

Attribute       | You  | Comp A | Comp B | Comp C
─────────────────────────────────────────────────
Price Point     | $$   | $$$    | $      | $$
Brand Story     | ⭐⭐  | ⭐⭐⭐  | ⭐     | ⭐⭐
Social Proof    | 500  | 2000   | 100    | 800
Free Shipping   | $50+ | $75+   | $25+   | None
Subscription    | ✅   | ✅     | ❌     | ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

😤 TOP PAIN POINTS (competitor reviews)

1. 🔴 Expensive shipping (mentioned 42x)
2. 🔴 Slow delivery (mentioned 35x)
3. 🟡 Inconsistent quality (mentioned 22x)
4. 🟡 Poor customer service (mentioned 18x)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ DIFFERENTIATION OPPORTUNITIES

1. ⭐ Lower free shipping threshold
2. ⭐ Stronger brand story/mission
3. ⭐ Better customer service messaging
4. ⭐ Quality guarantee program

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 ACTION PLAN

Priority | Action                    | Impact (guess, not measured)
─────────────────────────────────────────────
HIGH     | Revamp brand story page   | <High / Medium / Low>
HIGH     | Add quality guarantee     | <High / Medium / Low>
MEDIUM   | Lower free ship threshold | <High / Medium / Low>
LOW      | Launch referral program   | <High / Medium / Low>
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Review insight finder](https://useaiblocks.com/skills/review-insight-finder).
- **Check the landing page** with the [Product page auditor](https://useaiblocks.com/skills/product-page-auditor).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## DTC Strategy Framework

```
Competitor Store Analysis
      ↓
Review & UGC Mining
      ↓
Brand Story Gap Analysis
      ↓
Value Proposition Development
      ↓
Positioning Strategy
      ↓
Action Plan
```

---

**Part of [Nexscope AI](https://www.nexscope.ai/?co-from=skill) — AI tools for e-commerce sellers.**
