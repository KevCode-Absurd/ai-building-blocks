---
name: brand-protection-shopify
version: 1.0.0
author: Nexscope AI
description: "Shopify/DTC brand protection toolkit. Detect counterfeit stores, unauthorized resellers, and trademark violations. Includes DMCA takedown templates. You collect listings by hand and the script checks them; it does not monitor domains or social media for you. No API key required."
metadata: {"nexscope":{"emoji":"🛡️","category":"ecommerce"}}
---

# Brand Protection — Shopify/DTC 🛡️

Protect your brand from counterfeit stores and unauthorized resellers in the DTC space.

## Installation

```bash
npx skills add nexscope-ai/eCommerce-Skills --skill brand-protection-shopify -g
```

## Features

- **Counterfeit Store Detection** — Find fake stores copying your brand
- **Domain checks (manual)** — You find look-alike domains and paste them in; the script does not search for them
- **Social media checks (manual)** — You find unauthorized ads or posts and paste them in; the script does not search for them
- **Trademark Abuse** — Logo and brand name misuse
- **DMCA Takedown Templates** — Copyright infringement removal
- **Cease & Desist Letters** — Legal notice templates

## DTC-Specific Detection

| Dimension | Method | Risk Level |
|-----------|--------|------------|
| Fake Stores | Domain + content matching | 🔴 High |
| Unauthorized Resellers | Price and image details you collect by hand | 🔴 High |
| Social Ads | You check the ad library by hand | ⚠️ Medium |
| Trademark | Logo/name detection | 🔴 High |

## Risk Levels

The detector checks listing details that you collect by hand against your brand info. It does not search the web, and it does not monitor ads or prices on its own. The 24-hour figure below is a suggested internal target, not a legal deadline. A lawyer should confirm any notice before you send it.

| Level | Description | Action |
|-------|-------------|--------|
| 🔴 High | Active infringement | DMCA within 24h |
| ⚠️ Medium | Potential concern | Investigate further |
| ✅ Low | Normal activity | Continue monitoring |

## Input Configuration

```json
{
  "brand_name": "YourBrand",
  "official_domain": "yourbrand.com",
  "trademark_number": "US12345678",
  "logo_url": "https://yourbrand.com/logo.png",
  "social_handles": {
    "instagram": "@yourbrand",
    "facebook": "yourbrand",
    "tiktok": "@yourbrand"
  }
}
```

## Usage

### Detection

```bash
python3 scripts/detector.py
```

The script does not fetch the web, ad libraries or social sites, and it needs no key. It checks listing details (seller, price, images, reviews) against your brand info. Run as it is, it only shows built-in demo data, so its findings are not about your store. Give it real listings you collected by hand, and check each finding yourself.

**How to give it your own listings.** The command above only runs the demo. To check your own listings, call `detect(brand, listings, reviews)` in Python (it is in `scripts/detector.py`) with these objects, built from what you collected by hand:

- `BrandInfo`: brand_name, trademark_number, brand_registry (true or false), authorized_sellers (list of seller ids), protected_asins (list), min_price, logo_url.
- `ListingInfo`: asin (the product id), title, brand_in_title, price, image_urls, seller_count, sellers, buy_box_seller, category.
- `SellerInfo`: seller_id, seller_name, price, is_fba, rating, review_count, is_authorized, storefront_url.
- `reviews`: a list of dicts, each with a `content` text field.

The fields follow marketplace listings (ASIN, buy box). For a plain online store, fill in the closest match and say which fields you left empty.

### Generate Takedown Templates

```bash
# DMCA takedown
python3 scripts/templates.py dmca

# Cease & Desist letter
python3 scripts/templates.py cease-desist

# Platform report (Shopify)
python3 scripts/templates.py platform-report
```

## Output Example

This is an illustration from the built-in demo data. The names, counts and dates below are placeholders, not real findings.

```
🛡️ Shopify/DTC Brand Protection Report

Brand: [example brand]
Official Domain: [example domain]
Analysis Date: [example date]

━━━━━━━━━━━━━━━━━━━━━━━━

🔴 HIGH RISK ALERTS

Fake Store Detected:
├── Domain: [example: look-alike domain]
├── Copying: Product images, descriptions
└── Action: File DMCA + domain complaint

━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ SOCIAL MEDIA INFRINGEMENT

Instagram: [example: unauthorized ads found]
Facebook: [example: fake page found]
Recommendation: Report to platforms
```

## Takedown Templates Included

Every template is a draft. Have a lawyer review it before you send it, and send it only if you hold the right it names.

| Template | Use Case |
|----------|----------|
| DMCA Takedown | Hosting provider removal |
| Cease & Desist | Direct legal notice |
| Platform Report | Shopify abuse report |
| Social Report | Instagram/Facebook/TikTok |
| Domain Complaint | Registrar abuse report |

## Action Workflow

```
Collect listings and posts by hand (web, social)
      ↓
Check them with detector.py
      ↓
Document Evidence
      ↓
Send DMCA/C&D
      ↓
Report to Platforms
      ↓
Track Resolution
```

---

**Part of [Nexscope AI](https://www.nexscope.ai/?co-from=skill) — AI tools for e-commerce sellers.**
