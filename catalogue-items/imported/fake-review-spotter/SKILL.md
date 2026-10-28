---
name: amazon-review-checker
version: 1.0.0
description: "Amazon review authenticity analyzer. Detect fake reviews, suspicious patterns, and rating manipulation. Includes time clustering detection, content similarity analysis, rating distribution checks, and verified purchase validation. Progressive analysis with L1-L4 depth levels. No API key required."
metadata: {"nexscope":{"emoji":"🔍","category":"ecommerce"}}
---

# Amazon Review Checker 🔍

Review authenticity analyzer — detect fake reviews, suspicious patterns, and rating manipulation.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for customer words. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Installation

```bash
npx skills add nexscope-ai/eCommerce-Skills --skill amazon-review-checker -g
```

## Features

- **Authenticity Score** — 0-100 comprehensive rating
- **Suspicious Pattern Detection** — Time clustering, content similarity, rating anomalies
- **Fake Review Flagging** — Mark high-risk reviews with explanations
- **Progressive Analysis** — More data = deeper insights

## Progressive Analysis Levels

| Level | Required Data | Unlocked Analysis |
|-------|---------------|-------------------|
| **L1 Basic** | Review content | Similarity, length, keywords |
| **L2 Advanced** | + Review date | Time clustering detection |
| **L3 Deep** | + Star rating | Rating distribution analysis |
| **L4 Complete** | + VP status | Verified purchase validation |

## Detection Dimensions

| Dimension | Weight | Method |
|-----------|--------|--------|
| Time Clustering | 25% | Sliding window + burst detection |
| Content Similarity | 20% | N-gram + Jaccard similarity |
| Rating Distribution | 20% | Chi-square test vs natural distribution |
| VP Ratio | 15% | Compare to category benchmark |
| Review Length | 5% | Entropy analysis |
| Suspicious Keywords | 5% | Keyword pattern matching |

The weights are relative, and they do not need to add up to 100%. The score is the weighted average of the checks that could run with the data given, divided by the total weight of those checks. A check with no data is left out.

A high-risk result is a signal, not proof. Check the reviews yourself before you report a rival or a store, and do not say in public that a seller bought reviews on the strength of this score alone.

## Risk Levels

| Score | Level | Description |
|-------|-------|-------------|
| 70-100 | ✅ Low Risk | Reviews appear authentic |
| 50-69 | ⚠️ Medium Risk | Some concerns found |
| 30-49 | 🔴 High Risk | Multiple red flags |
| 0-29 | 💀 Critical | Likely mass fake reviews |

## Usage

### Method 1: Paste Reviews

Paste reviews directly in conversation:

```
Check these reviews:

5 stars - Great product! Works perfectly.
5 stars - Amazing! Best purchase ever.
1 star - Not as described.
```

### Method 2: JSON Input

```bash
python3 scripts/analyzer.py '[
  {"content": "Great product!", "rating": 5, "date": "2024-01-15", "verified_purchase": true},
  {"content": "Amazing!", "rating": 5, "date": "2024-01-15", "verified_purchase": false}
]'
```

### Method 3: Demo Mode

```bash
python3 scripts/analyzer.py --demo
```

## Output Example

```
📊 Review Authenticity Report

ASIN: B08XXXXX
Reviews: 10
Analysis Level: L4

━━━━━━━━━━━━━━━━━━━━━━━━

Authenticity Score: 66/100 ⚠️

Medium Risk - Some concerns found.

━━━━━━━━━━━━━━━━━━━━━━━━

Detection Dimensions

🔴 Time Clustering: 70/100
   Max 6 reviews within 48h

✅ Content Similarity: 24/100
   Found 0 highly similar review groups

━━━━━━━━━━━━━━━━━━━━━━━━

High-Risk Reviews (Top 3)

1. Risk 75% - "Perfect!"
   Reason: Too short, non-VP, templated 5-star

🔍 Want more accurate analysis? Add:
• Review dates, star ratings or verified-purchase marks → Unlock the time, rating and verified-buyer checks
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Amazon brand protection planner](https://useaiblocks.com/skills/amazon-brand-protection-planner).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Interaction Flow

```
User Input (any format)
        ↓
Smart field detection
        ↓
Analyze with available data
        ↓
Results + depth suggestions
        ↓
User continues or ends
```

---

**Part of [Nexscope AI](https://www.nexscope.ai/?co-from=skill) — AI tools for e-commerce sellers.**
