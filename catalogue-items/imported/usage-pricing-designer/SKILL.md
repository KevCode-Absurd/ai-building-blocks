---
name: usage-based-pricing
description: "Design pricing models that developers understand, accept, and can predict. Trigger phrases: usage-based pricing, API pricing, metered billing, developer pricing, pricing page, cost calculator, pay as you go, pricing transparency, competitive pricing, developer billing"
risk: critical
source: https://github.com/jonathimer/devmarketing-skills/tree/main/skills/usage-based-pricing
source_repo: jonathimer/devmarketing-skills
source_type: community
date_added: 2026-07-01
license: MIT
license_source: https://github.com/jonathimer/devmarketing-skills/blob/main/LICENSE
---

<!-- Licence note: this copy is shown under CC BY 4.0 (see LICENSE-CONTENT). The MIT line in the header above is the original author's, kept as the upstream source. -->

# Usage-Based Pricing

## Detailed Guide

Read [the detailed guide](references/detailed-guide.md) before executing this skill. It retains the complete procedure and reference material. Treat its safety, prerequisites, and validation requirements as mandatory. For focused work, load the relevant sections; for end-to-end work, read the guide completely.

## When to Use

Use this skill when you need to design pricing models that developers understand, accept, and can predict. Trigger phrases: usage-based pricing, API pricing, metered billing, developer pricing, pricing page, cost calculator, pay as you go, pricing transparency, competitive pricing, developer billing.


Design pricing models that developers understand, accept, and can predict—without surprise bills or confusing metrics.

If your AI cannot open the detailed guide file (for example you pasted this file into a chat), work from this file and the steps below. They are enough.

## When Not to Use

- Seat-based or per-user plans only: use the SaaS pricing designer.
- Enterprise contracts with custom terms: this skill covers listed, public prices.
- Choosing between whole pricing models (flat, tiered, usage): start with the Pricing model designer, then come back here.
- You need legal, tax or accounting advice on billing.

## Inputs to Gather First

Ask once for any that are missing. If one is still missing, write MISSING in the answer and say what it changes. Never invent a figure.

1. What the product does and what one unit costs you to run (cost per call, per GB, per minute).
2. Who the customers are and how they use it (a few typical and heavy users, if known).
3. Your current plans and prices, if you have any (optional).
4. Competitor prices the person has checked on the competitor's own site (optional). Do not quote a competitor's price from memory.
5. Real usage data, if any (optional). Without it, every example bill is illustrative.

## Steps

1. **Pick the metric.** Use the metric selection framework below. Choose one metric a customer can count and predict. Reject made-up units, compound metrics and hidden multipliers. Name one backup metric and say why it ranked second.
2. **Set the free allowance and tiers.** Propose a free allowance, then volume steps. Make sure the price per unit never rises as a customer grows. Every price you suggest is a draft: state the cost per unit it must cover, and mark any price you cannot ground in the person's own costs as a placeholder.
3. **Add bill protection.** Choose a spend cap type (hard, soft or burst allowance), the alert levels (for example 75, 90 and 100 percent) and what the customer sees on a usage dashboard.
4. **Write the pricing page.** Price per unit, a calculator outline, a tier table and an FAQ answering "what if I go over", "how do I watch my usage" and "are there hidden fees".
5. **Work three example months.** A small, a typical and a heavy customer. Show the arithmetic line by line. Label them illustrative unless the person gave real usage.
6. **Compare with competitors.** Use only the prices the person supplied. If none, say the comparison is MISSING and list what to look up.
7. **Check before you hand over.** Can a customer predict their bill from the page? Does the cost grow in line with the value they get? Does success get punished? Fix any no.

## Output

Return these sections in order. Keep it under about 700 words plus the tables.

1. **Recommended metric**: the metric, why it fits, the backup, and the metrics rejected.
2. **Allowance and tiers**: a table of `<tier>`, `<units included>`, `<price per unit>`, `<monthly price if any>`.
3. **Bill protection**: cap type, alert levels, dashboard contents.
4. **Pricing page copy**: headline, price per unit, calculator fields, FAQ answers.
5. **Three example months**: usage, line items and total for a small, a typical and a heavy customer.
6. **Competitor comparison**: one row per competitor the person supplied, or MISSING.
7. **Gaps and next steps**: every MISSING input, every placeholder, and what to test with real usage data before launch.

Designing a price here does not change anyone's live billing. The person decides and makes any change in their own billing tool.

## Usage Metrics Developers Accept

### Good Metrics: Direct Value Correlation

**API calls/requests**
- Developers understand what triggers a call
- Easy to monitor and predict
- Scales with actual usage
- Example: Stripe charges per transaction, Twilio per message

**Compute time**
- Clear relationship to server costs
- Predictable for consistent workloads
- Fair for variable workloads
- Example: AWS Lambda per GB-second, Vercel build minutes

**Storage**
- Simple to understand
- Easy to predict growth
- Clear cost driver
- Example: S3 per GB stored, databases per GB

**Bandwidth/data transfer**
- Makes sense for CDN and hosting
- Can be surprising if not monitored
- Example: Cloudflare per GB, Vercel bandwidth

**Active users (MAU)**
- Works for auth and user-facing tools
- Aligns with customer's growth
- Example: Auth0, Firebase Auth

### Problematic Metrics

**"Compute units" or proprietary measures**
```
Bad: "1 CU = 0.25 CPU seconds at 1.5GHz equivalent with 256MB memory allocation"
Developers can't estimate usage.
```

**Compound metrics**
```
Bad: "Charged per operation, where operation = read OR write OR delete,
     multiplied by document size factor"
Too complex to predict.
```

**Metrics that punish success**
```
Bad: Per-user pricing that penalizes viral growth
Developer's successful launch becomes a cost crisis.
```

**Metrics with hidden multipliers**
```
Bad: "Per request, but each retry counts, and warming requests count,
     and health checks count"
Actual usage is unpredictable.
```

### Metric Selection Framework

| Metric | When It Works | When It Fails |
|--------|---------------|---------------|
| API calls | Discrete operations | Streaming, persistent connections |
| Compute time | Variable workloads | Idle resources still cost |
| Storage | Data products | Temporary/cache data |
| Bandwidth | CDN, media | Retry-heavy protocols |
| MAU | User-facing apps | Machine-to-machine |
| Seats | Collaboration tools | Individual developers |

## Examples: Pricing That Works

Provider names illustrate pricing structures, not current price/plan endorsements. Verify each current regional plan and fee schedule from its official source before comparison or quoting. Designing a model does not authorize live billing changes.

### Stripe

- Percentage plus fixed-fee structure; verify the current country, currency and payment-method schedule before quoting a rate
- Aligns with customer revenue
- Predictable and simple
- Volume discounts for scale

### Twilio

- Per-message/per-minute pricing
- Clear unit costs
- Usage dashboard and alerts
- Prepaid credits for discount

### Vercel

- Clear tier structure
- Generous free tier
- Usage-based for bandwidth/builds
- Team pricing separate

### DigitalOcean

- Predictable monthly pricing
- Clear size/price relationship
- Hourly billing option
- Bandwidth included in pricing

## Examples: Pricing Problems

### Confusing Unit Pricing

Some cloud providers:
- Per "compute unit" (undefined)
- Multiple meters per service
- Different rates for different operations
- Bill requires expert interpretation

### Enterprise Tax

Some companies:
- SSO requires enterprise tier
- SSO tier is 10x team tier
- No intermediate option
- Punishes security-conscious teams

### Punishing Success

Some user-based pricing (a made-up pattern, not a real price list):
- Free tier: [FREE USERS]
- Paid tier: [PRICE]/user
- Viral success = immediate $$$
- Discourages growth

## Limitations

- Use this skill only when the task clearly matches its upstream source and local project context.
- Verify commands, generated code, dependencies, credentials, and external service behavior before applying changes.
- Do not treat examples as a substitute for environment-specific tests, security review, or user approval for destructive or costly actions.
