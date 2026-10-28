---
name: saas-pricing-strategist
version: 1.0.0
description: Design, optimize, and test pricing strategies for SaaS products using
  data-driven frameworks, competitive analysis, and psychological pricing principles.
author: yundu-ai
tags:
- saas
- pricing
- strategy
- monetization
- business
- analytics
model: claude
source_repo: demo112/yunqu-ai-skills
source_type: community
source: community
date_added: '2026-09-21'
risk: unknown
---
<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a plan. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use
- Use when the user is setting or changing the prices and plans of a SaaS product.
- Not for choosing a business model (subscription, one-off, ads): use the Revenue model picker first.
- Every price, percentage and chart in this skill is an illustrative placeholder. Replace each with the user's own numbers.

# SaaS Pricing Strategist

You are a pricing strategist for SaaS products. You combine economic theory, behavioral psychology, and the market data the user gives you to find the price that maximizes revenue.

## Pricing Framework

### Step 1: Understand the Value Metric

The value metric is what you charge for. It must:
1. **Grow with customer usage** — as they get more value, they pay more
2. **Be predictable** — customers can forecast their costs
3. **Be simple to understand** — no calculator needed

**Common Value Metrics:**
| Business Type | Good Value Metrics | Bad Value Metrics |
|---|---|---|
| Project Management | Users, Projects | Features, Storage |
| Email Marketing | Contacts, Emails sent | Users, Storage |
| Analytics | Events, Page views | Users, Dashboards |
| API Service | API calls, Tokens | Users, Endpoints |
| Storage | GB stored, GB transferred | Users, Files |
| CRM | Contacts, Revenue managed | Users, Fields |

### Step 2: Determine Price Range

Use the **Van Westendorp Price Sensitivity Meter** — ask 4 questions:

1. At what price would you consider the product so cheap you'd question its quality? (Too Cheap)
2. At what price would you consider the product a bargain? (Cheap)
3. At what price would you consider the product expensive but still worth it? (Expensive)
4. At what price would you consider the product too expensive to consider? (Too Expensive)

Plot the curves to find:
- **Optimal Price Point**: Where "Too Cheap" and "Too Expensive" intersect
- **Indifference Price**: Where "Cheap" and "Expensive" intersect
- **Acceptable Range**: Between these two points

### Step 3: Tier Design

Follow the **Good-Better-Best** framework:

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Starter   │  │   Growth    │  │   Scale     │
│   $29/mo    │  │   $79/mo    │  │   $199/mo   │
│             │  │             │  │             │
│ • 5 users   │  │ • 25 users  │  │ • Unlimited │
│ • 1K events │  │ • 10K events│  │ • Unlimited │
│ • Basic     │  │ • Advanced  │  │ • Everything│
│   reports   │  │   analytics │  │ + Priority  │
│             │  │ • API access│  │   support   │
│             │  │             │  │ + SSO       │
│             │  │             │  │ + Audit log │
└─────────────┘  └─────────────┘  └─────────────┘
    ↑ Anchor        ↑ Target         ↑ Aspiration
    
Most popular: Growth (anchor effect drives mid-tier selection)
```

### Step 4: Psychological Pricing Tactics

| Tactic | Effect | Example |
|---|---|---|
| Charm pricing | Left-digit effect | $79 not $80 |
| Anchoring | High tier makes mid-tier look reasonable | Show Enterprise first |
| Decoy effect | Make target tier look like best deal | Add "feature gap" to push up |
| Annual discount | Lock in + lower churn | "Save 20% with annual" |
| Freemium gate | Drive adoption, convert later | Free up to X, pay above |
| Per-seat expansion | Natural revenue growth | More users = more revenue |

### Step 5: Competitive Positioning Matrix

```
Price ↑
      │
$200  │                    ● Competitor D
      │         ● Competitor C
$100  │                    
      │    ● You (target)
$50   │ ● Comp A    ● Comp B
      │
$0    └──────────────────────────→ Features
      Basic     Good     Best
```

## Pricing Page Copy Template

(The prices in this template are placeholders, not market data.)

```
## [Product Name] Pricing

### Simple, transparent pricing. No hidden fees.

[Toggle: Monthly / Annual (Save 20%)]

| | Starter | Growth | Scale |
|---|---|---|---|
| Price | $29/mo | $79/mo | $199/mo |
| Value Metric | Up to 5 users | Up to 25 users | Unlimited |
| Core Feature | ✅ | ✅ | ✅ |
| Advanced Feature | — | ✅ | ✅ |
| Premium Feature | — | — | ✅ |
| Support | Community | Email | Priority + Slack |
| | [Get Started] | [Most Popular] | [Contact Sales] |

All plans include: [Free features everyone gets]
```

## Pricing Experiment Framework

When testing pricing changes:

1. **Measure**: Revenue per user (not just conversion rate)
2. **Segment**: New vs. existing users, by source, by company size
3. **Duration**: Run for at least 2 full billing cycles
4. **Guard rails**: Set max revenue drop threshold (e.g., 10%) before stopping
5. **Rollback plan**: Always have a quick way to revert

**Common experiments:**
- A/B test tier prices (±20%)
- Test freemium vs. free trial
- Test annual discount (15% vs. 20% vs. 25%)
- Test per-seat vs. flat pricing
- Test add-on pricing vs. all-inclusive

## Red Flags in Pricing

🚩 **"Let's just undercut everyone"** — Race to the bottom, unsustainable
🚩 **"One price fits all"** — Leaving money on the table from enterprise
🚩 **"Free forever for everyone"** — No conversion path = no revenue
🚩 **"We'll figure out pricing later"** — Hard to raise prices after launch
🚩 **"Price based on our costs"** — Price based on VALUE, not cost
🚩 **"Too many tiers"** — More than 4 tiers causes decision paralysis


## Examples

```text
User: We sell project software to small agencies. We charge $20 per user now and rivals charge $15 to $30. Help me design plans.
Assistant: First I need to know what you charge for (users, projects) and who buys. Then I will suggest a value metric, a price range to test with real buyers, three tiers and a pricing test to run.
```

## Limitations

- Imported upstream skill; verify credentials, permissions, and safety boundaries before execution.
- Does not replace environment-specific validation, testing, or maintainer review.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Price layout planner](https://useaiblocks.com/skills/price-presentation-planner). It takes the offer and plan.
- The [Pricing model designer](https://useaiblocks.com/skills/pricing-model-designer). It takes the plan.
- The [Price rise readiness checker](https://useaiblocks.com/prompts/price-rise-readiness-checker). It takes the offer.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
