# PRD: Build the Google Ads Audit Engine

Adapt the brief to the selected repository after inspecting its interfaces.

---

```
Build the Google Ads integration foundation and a rule-based audit engine that
scores live Google Ads accounts using the API.

## Overview

This is the foundation for Course 5. Every subsequent lesson adds a module to
apps/worker/src/integrations/google-ads/. This PRD creates the API client,
data fetcher, type system, and the 74-check audit engine that orchestrates
all later diagnostics.

The audit engine is deterministic. No AI calls. It pulls live account data
via the google-ads-api npm package, runs 74 checks against thresholds, and
outputs typed findings with severity levels and category scores.

## Dependencies

Run inside apps/worker/:
- pnpm add google-ads-api zod
- pnpm add -D @types/node vitest

## Files To Create

### 1. apps/worker/src/integrations/google-ads/client.ts

A wrapper around google-ads-api that:
- Reads env vars: GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CLIENT_ID,
  GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN,
  GOOGLE_ADS_LOGIN_CUSTOMER_ID
- Exports getCustomer(customerId: string) returning a Customer instance
- Throws a typed error if any env var is missing
- Caches the GoogleAdsApi instance at module scope (one client per process)

### 2. apps/worker/src/integrations/google-ads/types.ts

Define the shared types used across every module:

  - Severity = 'info' | 'low' | 'medium' | 'high' | 'critical'
  - Status = 'pass' | 'warn' | 'fail'
  - Category = 'tracking' | 'wasted-spend' | 'structure' | 'keywords' | 'ads'
              | 'settings' | 'shopping' | 'pmax' | 'display' | 'video' | 'bid'
              | 'cross-channel'
  - Finding = { checkId, category, status, severity, message, recommendation,
                metric?, value?, threshold?, affectedEntities? }
  - DiagnosticOutput = { generatedAt, customerId, dateRange, findings, summary }
  - DateRange = { start, end, days }
  - Account, Campaign, AdGroup, Keyword, SearchTerm, Conversion (raw API rows
    with snake_case → camelCase conversion)

Also export Zod schemas for runtime validation of the GAQL responses.

### 3. apps/worker/src/integrations/google-ads/data-fetcher.ts

GAQL queries → typed rows. One function per data shape:

  - fetchAccount(customerId, dateRange) → Account
  - fetchCampaigns(customerId, dateRange) → Campaign[]
  - fetchAdGroups(customerId, dateRange) → AdGroup[]
  - fetchKeywords(customerId, dateRange) → Keyword[]   (includes QS sub-components)
  - fetchSearchTerms(customerId, dateRange) → SearchTerm[]
  - fetchConversions(customerId, dateRange) → Conversion[]

Each function:
- Builds a GAQL query
- Calls customer.query<T>() via the google-ads-api package
- Maps snake_case fields to camelCase
- Validates with the Zod schema from types.ts
- Returns the typed array

Add micros conversion helpers (Google Ads returns cost/revenue in micros).

### 4. apps/worker/src/integrations/google-ads/audit-engine.ts

The 74-check orchestrator. Function: runAudit(customerId, dateRange) → DiagnosticOutput.

Six categories, weighted:
- Conversion Tracking — 25%
- Wasted Spend — 20%
- Account Structure — 15%
- Keywords — 15%
- Ads & Assets — 15%
- Settings & Targeting — 10%

Use the explicitly enumerated inventory below as a draft rule catalogue. Each check returns a typed Finding only after applicability and configured thresholds are resolved. No absent private skill is required.

Example checks (not exhaustive — see skill for the full 74):

TRACKING (10 checks, 25%):
1. Conversion actions exist and are receiving data (last 7 days non-zero)
2. Primary conversion action has Include in "Conversions" = true
3. Conversion value is non-zero for purchase actions
4. No "All conv." > "Conversions" by 50%+ (indicates secondary actions firing)
5. Cross-account conversion enabled if MCC
6. Attribution model not set to last-click for shopping/PMax
7. Enhanced conversions enabled
8. CAPI for offline conversions if lead-gen
9. No campaigns with $50+ spend and 0 conversions
10. ROAS calculable (conv. value > 0 globally)

WASTED SPEND (12 checks, 20%):
11. Search Lost IS (Budget) > 30% on profitable campaigns (under-funded)
12. Search Lost IS (Rank) > 50% (uncompetitive bidding or QS)
13. Branded campaigns not capped to top of page rate < 80%
14. Display campaigns spending without conversion in 30 days
15. Video campaigns spending without view-through conversions
16. Standalone Shopping campaigns competing with PMax (cannibalization)
17. PMax serving on branded queries (search categories check — needs Lesson 08)
18. Keywords with $50+ spend, 0 conversions (zombie spend)
19. Ad groups with $50+ spend, 0 conversions
20. Underperforming match types (broad + no negatives)
21. Conflicting negatives (negative blocking a Hero keyword)
22. Geo overspend (one geo at 80%+ spend, ROAS below blended)

STRUCTURE (12 checks, 15%):
23. Single-Keyword Ad Groups (SKAGs) absent for top 10 spend keywords
24. Themes mixed in one ad group (>5 distinct themes)
25. Active campaigns < 5 OR > 30 (consolidation/sprawl flags)
26. Naming convention consistency
27. Default audience signals attached to PMax asset groups
28. Display placement targeting set (not "all placements")
29. Smart Bidding portfolios assigned correctly (no orphaned standalone bidders)
30. Conversion-action sets configured per campaign type
31. Audience exclusions set (existing customer list, employees)
32. Negative keyword lists shared at account level
33. Brand exclusion list applied to PMax
34. Geo, language, schedule, and device settings explicit (not Google defaults)

KEYWORDS (15 checks, 15%):
35. Quality Score average ≥ 6
36. Distribution of QS ≥ 7 ≥ 50% of keyword cost
37. Below-avg Expected CTR keywords < 25% of cost
38. Below-avg Ad Relevance keywords < 25% of cost
39. Below-avg Landing Page Exp keywords < 25% of cost
40. Match-type mix (exact + phrase preferred; broad < 30% of cost)
41. Single-keyword ad groups for top 5 cost keywords
42. Negative keyword count ≥ 50 per account
43. Hero keywords (top 5 conv) on TOP IS ≥ 70%
44. Stop-words present in keyword list (e.g., "free", "cheap" if not relevant)
45. Cross-match conflicts (same term in two ad groups, no campaign-level negative)
46. Phrase-match terms generating broad-style search terms (needs Lesson 02)
47. Plurals/synonyms covered (titles vs title)
48. Long-tail keywords (3+ words) ≥ 30% of keyword count
49. Keyword status: no enabled keywords with status "below first page bid"

ADS & ASSETS (15 checks, 15%):
50. RSAs with ≥ 11 headlines and ≥ 3 descriptions
51. RSA Ad Strength ≥ Good for top 10 ad groups
52. Sitelinks: ≥ 4 active per campaign
53. Callouts: ≥ 4 active per campaign
54. Structured snippets: ≥ 1 active per campaign
55. Lead form extension if lead-gen
56. Image extensions if eCommerce
57. Promotion extensions during sale periods
58. Location extensions if local component
59. Call extensions with call tracking
60. Video assets attached to PMax / Demand Gen / Discovery
61. Ad copy mentions price for eCommerce
62. Ad copy mentions guarantee/return policy where relevant
63. Headlines pin sparingly (< 30% pinned)
64. Final URL suffix tracking template set

SETTINGS (10 checks, 10%):
65. Search partners disabled on non-brand
66. Display network excluded from Search campaigns
67. Mobile bid adjustments applied where mobile conv rate diverges
68. Location targeting "Presence" not "Presence or interest"
69. Language matches geo
70. Ad rotation set to optimize for conversions
71. Ad schedule covers business hours minimum
72. IP exclusions set (office, VPN ranges)
73. Optimization score ≥ 70%
74. Recommendations applied or explicitly dismissed in last 30 days

Each check gets a unique checkId like 'tracking-01', 'wasted-spend-12', etc.
Use owner-approved, current thresholds; for any unresolved threshold,
flag with a TODO comment and use a sensible default.

### 5. Scoring

Each check returns:
- pass = 0 points
- warn = 1 point
- fail (low/medium severity) = 2 points
- fail (high severity) = 3 points
- fail (critical severity) = 4 points

Category score = 100 - (sum of penalties / max possible × 100).
Overall score = weighted average of category scores.
Letter grade: A (90+), B (75-89), C (60-74), D (40-59), F (<40).

Critical-failure override: if Conversion Tracking score < 40, cap overall
at 50 regardless. Bad data invalidates the whole audit.

### 6. Quick Wins

Sort findings by (severity rank × estimated dollar impact).
Estimated dollar impact = portion of account spend affected by the finding.
Return top 10 as quickWins on the summary.

### 7. Persistence

Create a Supabase migration in packages/supabase/supabase/migrations/ named
2026XXXXXXXXXX_create_google_ads_audit_runs.sql:

  - audit_runs table:
    - id uuid PK default gen_random_uuid()
    - customer_id text not null
    - date_range_start date, date_range_end date, date_range_days int
    - overall_score int, grade text
    - category_scores jsonb
    - findings jsonb (array of Finding)
    - quick_wins jsonb
    - critical_count int
    - generated_at timestamptz default now()
    - index on (customer_id, generated_at desc)

After runAudit() completes, persist the DiagnosticOutput.

### 8. Tests

Create:
- apps/worker/src/integrations/google-ads/audit-engine.test.ts (Vitest)
  - Fixture-based unit tests for each scoring rule
  - Fixture file: apps/worker/src/integrations/google-ads/__fixtures__/sample-account.json
- apps/worker/src/integrations/google-ads/data-fetcher.integration.test.ts
  - Hits the live API for the customer in GOOGLE_ADS_DEFAULT_CUSTOMER_ID
  - Asserts only that responses are non-empty and shape-validate

Use the existing Vitest config in apps/worker/vitest.config.ts (or create one
matching the convention used by other integrations).

## Rules

- Pure logic in the audit-engine. No AI calls.
- Every check has a specific threshold from the skill, not "use judgment".
- Every Finding includes a concrete recommendation, not "investigate further".
- Handle missing data gracefully — if a campaign has no conversions, skip
  conversion-dependent checks for it with a Finding.severity = 'info'.
- All money values stay in micros until display-time (then divide by 1e6).
- All percentages are 0-100, never 0-1.

## When You're Done

Show me:
1. The directory tree of apps/worker/src/integrations/google-ads/
2. The runAudit() function signature and an example call
3. A sample DiagnosticOutput from running against the live default customer
4. Test results (vitest run)

I'll read it, give feedback, and we'll move to Lesson 02.
```

---

## How To Use This PRD

1. Open Claude Code at the root of `eCom AI Operator` monorepo
2. Confirm you're on a clean feature branch (`git checkout -b feature/course-5-lesson-01-audit-engine`)
3. Paste this PRD verbatim
4. Read every diff before accepting — this is foundational code that 10 future lessons depend on
5. Run the integration test once Claude Code finishes — `pnpm --filter worker test`
6. Commit and move to Lesson 02

## What "Done" Looks Like

- `apps/worker/src/integrations/google-ads/` exists with the 4 module files
- `runAudit('your-customer-id', { start, end, days: 30 })` returns a DiagnosticOutput
- The Supabase migration applied cleanly
- All Vitest unit tests pass against fixtures
- The integration test hits the live API and returns shape-valid data

## If Something Breaks

| Symptom | Fix |
|---------|-----|
| `Authentication failed` from google-ads-api | Re-run Course 1's `verify-google-ads.md` |
| `customer not found` | Confirm `GOOGLE_ADS_LOGIN_CUSTOMER_ID` is the MCC, not the operator account |
| `permission denied` on tables | Confirm Supabase migration ran via `pnpm --filter supabase db:push` |
| TS strict errors on Zod schemas | Make sure `tsconfig.json` has `strict: true` and `exactOptionalPropertyTypes: true` |
