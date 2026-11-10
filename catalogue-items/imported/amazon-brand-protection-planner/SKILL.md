---
name: brand-protection-amazon
version: 1.0.0
description: "Amazon brand protection toolkit. Detect hijackers, counterfeits, and unauthorized sellers. Includes MAP price checks on data you supply, trademark abuse checks, complaint templates for Brand Registry, and test buy evidence collection guides. No API key required."
metadata: {"nexscope":{"emoji":"🛡️","category":"ecommerce"}}
---

# Brand Protection — Amazon 🛡️

Protect your brand from hijackers, counterfeits, and unauthorized sellers on Amazon.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Brand file** (its products part), made by the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder): your offers, facts, buyers, claims, voice and look, kept in one folder.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand file** with the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the brand file, read:** `index.md`, `facts.json`, `offers.json`, `voice.md`. Take the claims list with each claim's status, the offer terms word for word, and the real voice lines. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand file is a `context/brand-file/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older brand brain folder, with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for your brand file. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Installation

```bash
npx skills add nexscope-ai/eCommerce-Skills --skill brand-protection-amazon -g
```

## Features

This skill has no live data feed and does not watch Amazon. You supply the seller, price and review details for each listing, and it checks what you give it. The detector script runs on built-in sample data until your own details are put in.

- **Hijacker Detection** — Spot unauthorized sellers in the seller list you supply
- **Price Check** — Flag prices below your minimum advertised price (MAP) in the prices you supply
- **Counterfeit Signals** — Flags reviews that use words like fake or not authentic. A keyword match is weak evidence. Confirm with a test buy before you send any complaint
- **Trademark Abuse** — Title/keyword infringement detection
- **Complaint Templates** — Brand Registry, C&D letters
- **Know what counts** — Amazon's infringement tools are for intellectual property: counterfeits, trademark misuse and copied images or text. A seller who is not on your approved list, or who prices below your MAP, is not by itself grounds for an IP complaint. Reselling genuine goods is generally allowed, and MAP is an agreement between you and the resellers who signed it. Check Amazon's current Intellectual Property Policy in Seller Central and the Brand Registry help pages before you file
- **Test Buy Guide** — Evidence collection procedure

## Detection Dimensions

| Dimension | Method | Risk Level |
|-----------|--------|------------|
| Hijackers | Seller count check | 🔴 High |
| Price Violations | Below MAP detection | 🔴 High |
| Counterfeit | Review keyword analysis | 🔴 High |
| Trademark | Title pattern matching | ⚠️ Medium |

## Risk Levels

| Level | Description | Action |
|-------|-------------|--------|
| 🔴 High | Immediate threat to brand | Take action within 24h |
| ⚠️ Medium | Potential concern | Investigate with fresh data |
| ✅ Low | Normal activity | Check again when you next collect data |

## Input Configuration

```json
{
  "brand_name": "YourBrand",
  "trademark_number": "US12345678",
  "brand_registry": true,
  "authorized_sellers": ["A1B2C3D4E5F6G7"],
  "protected_asins": ["B08XXXXXX1"],
  "min_price": 29.99
}
```

## Using your own data

The detector reads built-in sample data. To check your own listings, open `scripts/detector.py`, find `get_demo_data()` and replace the brand details, the listings (ASIN, title, price, seller list) and the review text with yours. Then run `python3 scripts/detector.py`. Do not send a complaint or letter based on the sample output.

## Usage

### Hijacker Detection

```bash
python3 scripts/detector.py
```

### Generate Complaint Templates

```bash
# Brand Registry complaint
python3 scripts/templates.py complaint

# Cease & Desist letter
python3 scripts/templates.py cease

# Test buy guide
python3 scripts/templates.py testbuy

# Notice to a seller pricing below your minimum advertised price (MAP)
python3 scripts/templates.py map
```

The template script also fills its letters with sample brand details. Before you send anything, open `scripts/templates.py`, find `main()` and replace the brand, seller, evidence and contact details with yours.

## Output Example

This is made-up sample output. The ASIN, prices and counts are placeholders, not real findings.

```
🛡️ Brand Protection Report

Brand: YourBrand
ASINs Monitored: 5
Analysis Date: 2024-01-15

━━━━━━━━━━━━━━━━━━━━━━━━

🔴 HIGH RISK ALERTS

ASIN: B08XXXXXX1
├── 3 unauthorized sellers detected
├── Lowest price: $19.99 (MAP: $29.99)
└── Action: Test buy from the new sellers. Report only a counterfeit or trademark problem. Send a MAP notice only to resellers who agreed to your MAP policy

━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ COUNTERFEIT SIGNALS

Reviews mentioning "fake": 5
Reviews mentioning "not authentic": 2
Recommendation: Order test buy
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Amazon brand registry planner](https://useaiblocks.com/skills/amazon-brand-registry-planner).
- The [Trademark name screener](https://useaiblocks.com/skills/trademark-name-first-check).
- The [Amazon margins, stock and claim review](https://useaiblocks.com/skills/amazon-monthly-account-keeper).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Complaint Templates Included

| Template | Use Case |
|----------|----------|
| Brand Registry | Report a counterfeit, trademark or copyright problem to Amazon |
| Cease & Desist | Direct seller contact about counterfeits, after a test buy |
| Test Buy Report | Evidence documentation |
| MAP Notice | A reseller who agreed to your MAP policy is pricing below it (a business notice, not an IP complaint) |

## Action Workflow

```
Check the listings (using the data you supply)
      ↓
Detect Violation
      ↓
Collect Evidence (Test Buy)
      ↓
Generate Complaint (only for a counterfeit, trademark or copyright problem)
      ↓
Submit to Amazon / Send C&D
      ↓
Track Resolution
```

---

**Part of [Nexscope AI](https://www.nexscope.ai/?co-from=skill) — AI tools for e-commerce sellers.**
