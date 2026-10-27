---
name: brand-protection-amazon
version: 1.0.0
description: "Amazon brand protection toolkit. Detect hijackers, counterfeits, and unauthorized sellers. Includes MAP price checks on data you supply, trademark abuse checks, complaint templates for Brand Registry, and test buy evidence collection guides. No API key required."
metadata: {"nexscope":{"emoji":"🛡️","category":"ecommerce"}}
---

# Brand Protection — Amazon 🛡️

Protect your brand from hijackers, counterfeits, and unauthorized sellers on Amazon.

## Installation

```bash
npx skills add nexscope-ai/eCommerce-Skills --skill brand-protection-amazon -g
```

## Features

This skill has no live data feed and does not watch Amazon. You supply the seller, price and review details for each listing, and it checks what you give it. The detector script runs on built-in sample data until your own details are put in.

- **Hijacker Detection** — Spot unauthorized sellers in the seller list you supply
- **Price Check** — Flag prices below MAP in the prices you supply
- **Counterfeit Signals** — Flags reviews that use words like fake or not authentic. A keyword match is weak evidence. Confirm with a test buy before you send any complaint
- **Trademark Abuse** — Title/keyword infringement detection
- **Complaint Templates** — Brand Registry, C&D letters
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
python3 scripts/templates.py cease-desist

# Test buy guide
python3 scripts/templates.py testbuy
```

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
└── Action: File Brand Registry complaint

━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ COUNTERFEIT SIGNALS

Reviews mentioning "fake": 5
Reviews mentioning "not authentic": 2
Recommendation: Order test buy
```

## Complaint Templates Included

| Template | Use Case |
|----------|----------|
| Brand Registry | Report to Amazon |
| Cease & Desist | Direct seller contact |
| Test Buy Report | Evidence documentation |
| DMCA Takedown | Copyright infringement |

## Action Workflow

```
Check the listings (using the data you supply)
      ↓
Detect Violation
      ↓
Collect Evidence (Test Buy)
      ↓
Generate Complaint
      ↓
Submit to Amazon / Send C&D
      ↓
Track Resolution
```

---

**Part of [Nexscope AI](https://www.nexscope.ai/?co-from=skill) — AI tools for e-commerce sellers.**
