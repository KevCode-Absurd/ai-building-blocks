---
name: build-the-shopping-feed-auditor-builder-prompt
description: Use when a developer or coding AI will build a read-only module that sorts every product in your Google Shopping campaigns into tiers (hero, steady, potential, underperformer, zombie) and lists feed fixes, bid ideas and pause candidates with the cost behind each. Every cost and ROAS cut-off is a setting you choose, and thin data is marked not enough data, not guessed.
---

# Shopping feed audit coding prompt

This is a prompt you paste into a coding AI (Claude Code, Cursor, Codex or similar) that can read and edit your project. It builds one read-only module that reviews your Google Shopping products one by one. It sorts them into tiers by results, then lists what to fix in the feed, which bids to test and which products to consider pausing.

If you only want a feed review from Merchant Center reports, not software, use the Merchant Center feed health checker.

## What you need first

- A project with **code you can edit**, and a coding AI with access to it.
- **Product-level Shopping results** for a date range: product ID, title, product type, cost, impressions, clicks, conversions, conversion value, and the campaign type (standard Shopping or Performance Max). Google Ads gives you these through its API. Fetching them live needs a Google Ads API developer token and read access to the account, and Merchant Center access if you also want product disapprovals. Setting that up is a separate job: see the Google Ads token and access check planner. Without access, the prompt builds the module to take typed product rows, so it works and can be tested on sample rows.
- **Your target ROAS**: the return you need on ad spend, worked out from your margin. The module will not guess it.
- Your own **cost cut-offs** in your account currency. The prompt starts with example values you should change.

## Paste this into your coding AI

Fill in the angle brackets first.

```
Build a read-only Shopping product auditor that sorts every product into a tier and lists feed fixes, bid ideas and pause candidates. It must never change a bid, product group or account.

First, look at my project: language, folder layout, how tests run, whether a result type for findings already exists, and whether code already fetches Google Ads data. Tell me what you found. If something I need is missing, list it and build the part that does not depend on it.

## What to build

Function: auditShoppingProducts(input) returns DiagnosticOutput. Put it in <the folder where my analysis code lives>, in my project's language and style.

Input:
- products: rows of { offerId, title, productType, campaignType (standard or performance-max), cost, impressions, clicks, conversions, conversionValue, disapprovals? }
- dateRange and currency
- targetRoas: required. If missing, stop and say so. Never guess it.
- benchmarks (optional): { ctr, conversionRate } per product type. If missing, work them out inside the data, see below.
- settings, all configurable. These are starting assumptions I must review:
  minImpressions = 100, minClicksToPause = 50, zombieMinCost = <50>, criticalCost = <250>, underperformerMinCost = <25>, heroMinConversions = 3, heroRoasMultiple = 1.2, steadyRoasMultiple = 0.8, ctrFloorVsMedian = 0.7, minProductsPerBenchmark = 5, listCap = 50.
  Money values are in account currency.

If the project has no result type yet, use:
  Finding = { checkId, severity: critical|high|medium|low|info, title, recommendation, affectedProducts, evidence }
  DiagnosticOutput = { findings, summary, notEvaluated, dateRange, currency }

## Tiers
Put each product in one tier. Test in this order and stop at the first match. ROAS = conversionValue / cost.
1. zombie: clicks at least minClicksToPause, zero conversions, cost above zombieMinCost.
2. hero: impressions at least minImpressions, conversions at least heroMinConversions, ROAS at least heroRoasMultiple times targetRoas.
3. steady: impressions at least minImpressions, at least 1 conversion, ROAS at least steadyRoasMultiple times targetRoas (and not hero).
4. underperformer: impressions at least minImpressions and either (a) at least 1 conversion with ROAS below steadyRoasMultiple times targetRoas, or (b) zero conversions, CTR below the benchmark and cost above underperformerMinCost.
5. potential: impressions at least minImpressions, zero conversions and CTR at or above the benchmark.
6. Anything else is "not enough data". Count it. Never call it a tier.

## Benchmarks
If no benchmark is given, use the median CTR of products in the same product type, only when that type has at least minProductsPerBenchmark products. If not, mark the CTR test "not evaluated" for those products and say why. Do not invent a benchmark.

## Findings
- hero: "shopping-hero-scale" (medium). Suggest a small bid increase test, or moving it into its own campaign with higher priority. Do not state an amount as a promise.
- steady: no finding, counted in the summary only.
- potential: "shopping-potential-feed-optimize" (medium). Suggest a title that starts with the brand and main search words, and that I check it is in the right campaign.
- underperformer: "shopping-underperformer-feed-fix" (high). Suggest checking the title, GTIN or MPN, image, price against competitors, then testing a bid reduction.
- zombie: "shopping-zombie-pause" (critical if cost is above criticalCost, otherwise high). Suggest excluding the product or pausing its product group, and state "<cost> spent with 0 conversions in <date range>".
Always name the campaign type. Standard Shopping and Performance Max treat priority and product data differently, and Performance Max may show fewer products. Say so in the finding.

## Three action lists in the summary
- feedFixes: { offerId, title, issues[] }
- bidChanges: { offerId, direction, reason } (no exact new bid unless a current bid is in the input)
- pauses: { offerId, reason, costToDate }
Sort each list by cost, highest first, and cap at listCap. Say how many were left off.

## Tests
Write tests with sample rows only, no real accounts:
- each tier reached by at least one row
- a product that fits two tiers goes to the first in order, zombie before the rest
- a product with 40 clicks and zero conversions is NOT a pause candidate
- missing benchmark and a small product type give "not evaluated", not an invented number
- list sort and cap

## Rules
- Read-only. Do not call the Google Ads API from this module. Fetching is separate.
- Every pause suggestion shows the cost to date. A person decides.
- Do not install packages, change config, add a schedule or run against a live account. Ask me first.
- Do not invent numbers. Say what you ran and what you did not.

## When you are done, show me
1. The function signature and types
2. Sample output from the test rows, including the three action lists
3. The test results (say if you could not run them)
4. A list of the settings and assumptions I need to review
```

## Check the result

- Every cut-off is a named setting, with your own number in it. None is hidden in the code.
- Products with too little data are counted as "not enough data", not placed in a tier.
- A pause idea always shows its cost and click count.
- Nothing in the module can change an account.

## After it works

Fixing the titles it flags is a separate job: use the Shopping feed title writer. For a feed-level review from Merchant Center reports, use the Merchant Center feed health checker. A weekly run suits feed work, because feed changes show up within days. Add a schedule only if you want one: ask the AI to propose it, then approve it yourself.
