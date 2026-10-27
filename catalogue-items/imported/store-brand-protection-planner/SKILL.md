---
name: brand-protection-shopify
version: 1.0.0
author: Nexscope AI
description: "Shopify/DTC brand protection toolkit. Detect counterfeit stores, unauthorized resellers, and trademark violations. Includes DMCA takedown templates, domain monitoring, and social media infringement detection. No API key required."
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
- **Domain Monitoring** — Track similar/typosquatting domains
- **Social Media Infringement** — Detect unauthorized ads/posts
- **Trademark Abuse** — Logo and brand name misuse
- **DMCA Takedown Templates** — Copyright infringement removal
- **Cease & Desist Letters** — Legal notice templates

## DTC-Specific Detection

| Dimension | Method | Risk Level |
|-----------|--------|------------|
| Fake Stores | Domain + content matching | 🔴 High |
| Unauthorized Resellers | Price/image tracking | 🔴 High |
| Social Ads | Ad library monitoring | ⚠️ Medium |
| Trademark | Logo/name detection | 🔴 High |

## Risk Levels

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

| Template | Use Case |
|----------|----------|
| DMCA Takedown | Hosting provider removal |
| Cease & Desist | Direct legal notice |
| Platform Report | Shopify abuse report |
| Social Report | Instagram/Facebook/TikTok |
| Domain Complaint | Registrar abuse report |

## Action Workflow

```
Monitor Web/Social
      ↓
Detect Infringement
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
