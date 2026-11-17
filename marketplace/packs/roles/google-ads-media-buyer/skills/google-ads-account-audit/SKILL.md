---
name: google-ads-account-audit
description: Audit a Google Ads account the way a senior PPC buyer would. Checks conversion goals and tracking, campaign mix and overlap, brand versus non-brand, search terms and negatives, match types and AI Max, ads and landing pages, Performance Max and Shopping feed health, bidding and budgets, and measurement, then ranks fixes by money at stake and turns them into a change list the client approves. Use when taking over an account, when results slide, before raising spend, or quarterly.
---

# Google Ads account audit

## When to use

- Taking over an account from another buyer, agency or a Google rep's setup.
- Cost per conversion or ROAS has slipped for two or more weeks.
- The owner wants to spend more and needs to know where it would go.
- Quarterly health check.

## What you need

Minimum (no access):
- Reports for the last 90 days: campaigns, ad groups, keywords (with Quality Score columns), search terms, ads and assets, auction insights, and Performance Max channel performance if used.
- Screenshot of Goals, then Summary: every conversion action with primary or secondary, source, count setting, attribution model and value.
- Change history for the last 30 days.
- Shop or CRM totals by day for the same 90 days.
- Merchant Center diagnostics if the business sells products.
- Unit economics: average order or lead value, margin, close rate.

Better: Read-only access to Google Ads and Merchant Center, GA4 Viewer.

**Access:** level 1 for the whole audit; level 2 to build the fixes paused or unposted in Ads Editor; level 3 to make approved fixes live, within your limits.

## Steps

### Evidence contract before diagnosis

Reuse the shared brand brain and the account's existing context; ask only for missing facts. Record an evidence ledger: source/export ID, account/store ID, fetched time, completed date range, timezone, currency, reporting time basis, conversion action and counting rule, attribution window, revenue/refund definition, rows/pages fetched, filters and inaccessible breakdowns. Reconcile retrieved spend to the account aggregate; report covered spend and the uninspected residual. A top-N extract is a partial audit, never the whole account.

For every comparison, show aligned numerators and denominators. Calculate CPA as total eligible spend / total eligible conversions and ROAS as total eligible conversion value / total eligible spend; do not average row ratios. Keep Meta, Google, store revenue and blended marketing efficiency in separate columns. Do not add platform-attributed sales together as unique store sales. Label unavailable data **Unknown**, not zero or broken. Split measured facts, hypotheses and decisions; a customer's inferred intent is not a verified customer fact.

### 1. Business frame
Derive contribution break-even CPA from acquired-order value after landed COGS, fulfillment, fees, expected returns/refunds and other variable costs. Derive break-even ROAS using the same value definition as the report. Gross product margin alone is not profit break-even; missing costs block a scale verdict. Keep first-order and mature-cohort economics separate. For lead businesses, convert to cost per qualified lead using the close rate: if a sale is worth 1,200 USD in margin and 1 in 8 leads closes, a lead is worth at most 150 USD.

### 2. Conversion truth (gate dependent decisions)
- Which actions are primary? Only real outcomes (purchase, qualified lead, booked call above a set duration) should be. Flag page views, scrolls, button clicks or every form start counted as primary.
- Inspect each conversion action, campaign goal selection, source and count setting. Two primary purchase actions indicate a duplication risk; confirm whether the same transaction is recorded by both and used by the relevant campaign before calling it double counting. Select the canonical action based on validated coverage and business outcome, not its provider name.
- Reconcile comparable Google Ads and store/CRM data: interaction-time versus conversion-time reporting, timezone, action definitions, attribution windows, lag and refunds. Count gaps alone do not prove duplication; never scale ROAS by an order-count ratio to invent a corrected ROAS. If measurement fails, block dependent scaling claims while continuing independent feed, destination and eligibility checks.
- Enhanced conversions on? Consent mode in place for EEA or UK traffic? For lead businesses, are offline outcomes sent back through enhanced conversions for leads or Data Manager?
- Attribution model per action (DDA or last click).

### 3. Campaign mix and overlap
List campaigns by type (Search, Performance Max, Shopping, Demand Gen, Display, Video). For each: goal, budget, bid strategy, share of spend, share of conversions. Look for overlap: Performance Max and Search both chasing brand terms; Performance Max and Standard Shopping on the same products; several Search campaigns with the same keywords.

### 4. Brand versus non-brand
Split observable spend and conversions by brand, non-brand and unclassified/withheld queries, with coverage stated. Report configured brand exclusions and available PMax insights. Brand-attributed conversions are not proof of free demand or cannibalization; propose an appropriately powered holdout or experiment before claiming incremental waste.

### 5. Search terms and negatives
Sort search terms by cost over mature, comparable periods; label hidden terms and reporting coverage. Zero observed conversions alone do not prove waste when volume is small or outcomes are immature. Investigate intent and product fit for themes (jobs, free, DIY, competitors you do not want, wrong locations, wrong product). Review negative lists: are any blocking good traffic? Are account-level negatives in use? (Run the `search-terms-cleanup` skill for the full pass.)

### 6. Match types and AI Max
Which match types are in use, with which bidding? Verify current eligibility and enabled features from the account and official docs before judging a match-type/bidding combination. If AI Max is on: which features (search term matching, text customisation, final URL expansion), and what do the AI Max rows in the search terms and landing pages reports show?

### 7. Ads, assets and landing pages
Per ad group: number of RSAs, Ad Strength, pinning, distinct headlines, keyword use. Sitelinks and other assets present. Quality Score components: Below average landing page experience or ad relevance on high-spend keywords points to fixes outside the bid.

### 8. Performance Max and Shopping
- Asset groups by theme, with enough images, videos and text. Audience signals present. Search themes used.
- Channel performance report: where spend goes; any channels Not eligible or Eligible (limited).
- Search terms and campaign-level negatives.
- Merchant Center: disapproved and limited products, missing GTINs, price or availability mismatches, title quality for top sellers.

### 9. Bidding and budgets
- Check strategy eligibility, value completeness, outcome maturity, observed status and data sufficiency using current official guidance for the campaign type. Do not transfer one volume threshold across campaign types.
- Target realism: compare targets with the last 30 days' actuals.
- For budget-limited target campaigns, inspect observed target attainment, spend, marginal economics and auction constraints. Verify any platform behavior change with dated official documentation before attributing a trend to it. Compare feasible changes against cash, stock and contribution constraints.
- Search impression share lost to budget versus rank, per campaign.

### 10. Measurement maturity and hygiene
Any custom experiments run in the last year? Any lift or geo test? Auto-applied recommendations switched on without review? Who else has access, and when did they last change things?

### Close the loop on each intervention

Read existing interventions before recommending changes. Keep the canonical intervention episode beside the existing job receipts in `jobs/<run-id>/`; `context/media-buying/google/<account-id>/` is an index linking to those episodes, not a second copy of their state. Record the stable intervention ID, entity scope, evidence IDs, hypothesis, baseline period, primary outcome, guardrail, maturity/lag rule, current experiment collisions, authorized scope, rollback and review trigger in that episode. For a material executed change, use the optional shared `intervention/v1` contract and `org-context.mjs intervention-check` described in `MEMORY-ARCHITECTURE.md`; passing it means eligible for outcome review, not causal success. Keep proposed, executed, provider-verified and outcome-reviewed states distinct. Existing authorization remains valid within its scope; ask only for genuinely new consequential actions. Review comparable mature periods, note promotions, stock, traffic mix and other concurrent changes, and choose keep, revert, iterate or collect more evidence. A before/after improvement alone is not a causal lift estimate. Feed the verified result back into scoped memory without overwriting canonical brand facts.

## Checks before sending

- Every finding has evidence (report rows, screenshot, numbers).
- Findings are ranked by monthly money at stake, with the estimation method shown.
- Nothing contradicts the conversion verdict.
- Each fix states the change, expected effect, risk (for example, learning or outcome-lag effects observed after a goal change), review date and undo.
- Nothing is presented as done.

## Output format

1. **Verdict** in three lines.
2. **Scorecard:** Conversions, Campaign mix, Brand split, Search terms, Match and AI Max, Ads and pages, PMax and feed, Bidding and budget, Measurement. Good, Needs work, Broken or Unknown, one line of evidence each.
3. **Findings table:** rank, finding, evidence, money at stake per month, fix, effort, risk.
4. **Intervention list:** scope, evidence, hypothesis, outcome, guardrail, authorization status, rollback and review trigger. Identify only decisions requiring new approval.
5. **What I need from you.**
6. **Review date.**

## Example of good output (short)

*Illustrative figures, not a real account. Use the client's evidence, never these values.*

**Verdict:** Verify conversion goals before scaling. The export reports 1,212 conversions and the store reports 668 orders: a raw difference of 544, not a measured duplicate count. The export mixes purchase and page-view actions and lacks reporting-time alignment. A true ROAS cannot be calculated from these counts.

| Finding | Evidence | Conclusion / next step |
|---|---|---|
| Goals may mix outcomes | Purchase tag, GA4 purchase import and thank-you-page action marked primary | Inspect campaign goal usage and transaction overlap. Validate coverage before changing a primary action. Quantified revenue impact unknown. |
| PMax includes branded demand | 38% of conversions in the visible search-term sample are branded; full query coverage unknown | Describe the sampled mix. Do not infer cannibalization or extrapolate to all PMax; design a brand incrementality test if volume permits. |

**Intervention:** Measurement validation first; record baseline, scope and evidence. Existing authorization can cover implementation once the proposed change is supported and within scope. Set the review by observed conversion lag, not an automatic seven-day deadline.

Primary references: [Google conversion reporting](https://support.google.com/google-ads/answer/6270625), [reporting discrepancies](https://support.google.com/google-ads/answer/7457111), and [conversion windows](https://support.google.com/google-ads/answer/3123169), checked 2026-11-17.

## Ecommerce arithmetic check (illustrative, independent of the audit above)

These are deliberately complete hypothetical inputs, not Gehna or account evidence. All values use USD, the same completed period, purchase definition and revenue basis. Refund impact is a variable-cost allowance here, not also deducted from the revenue numerator.

| Input | Value |
|---|---:|
| Attributed purchase value | 36000 |
| Eligible spend | 12000 |
| Attributed purchases | 300 |
| Value per order | 120 |
| Landed COGS per order | 60 |
| Fulfillment per order | 8 |
| Payment fees per order | 4 |
| Expected returns/refunds per order | 6 |
| Contribution before ads per order | 42 |
| CPA | 40 |
| ROAS | 3 |
| Break-even ROAS (rounded) | 2.86 |

Contribution is 120 - 60 - 8 - 4 - 6 = 42. CPA is 12000 / 300 = 40; ROAS is 36000 / 12000 = 3; break-even ROAS is 120 / 42, about 2.86. This is a first-order arithmetic illustration, not proof of incrementality or permission to scale. Check stock, delivery capacity, cash and retention/cohort evidence before proposing expansion. Missing any material cost reopens the profitability decision.

## Method attribution

Adapted measurement, evidence and deliverable procedures from NotFair: [Measurement framework](https://github.com/nowork-studio/notfair-plugin/blob/deed0436d0c68cbc20a78523fffc67edd12aa25c/paid-ads/shared/measurement-framework.md); [Intervention memory](https://github.com/nowork-studio/notfair-plugin/blob/deed0436d0c68cbc20a78523fffc67edd12aa25c/google-ads/manage/references/intervention-memory.md). Pinned source reviewed 2026-11-17. Platform claims must be checked against current official documentation and observed account settings; source heuristics are not universal thresholds.

<details>
<summary>NotFair MIT notice</summary>

MIT License

Copyright (c) 2026 Toprank Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

</details>
