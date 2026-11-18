---
name: meta-account-audit
description: Audit a Meta (Facebook and Instagram) ad account the way a senior media buyer would. Checks tracking and event quality, goals and value, account structure and learning, creative supply and fatigue, budgets and bid strategies, attribution and incrementality, and policy risk, then ranks fixes by money at stake and turns them into a change list the client approves. Use when taking over an account, when results have slipped for weeks, before raising spend, or once a quarter.
---

# Meta account audit

## When to use

- You are taking over an account from another buyer or agency.
- Cost per result has drifted up for two or more weeks and nobody knows why.
- The owner wants to spend more and needs to know whether the account can take it.
- Quarterly health check.

Not for: a single ad that was rejected (use the policy prompt), or a one-day dip (wait for more data first).

## What you need

Minimum (no account access):
- Ads Manager export, last 90 days, by day, at ad level, with: campaign, ad set and ad name; delivery status; spend; impressions; reach; frequency; CPM; link clicks; CTR (link); results; cost per result; purchases or leads; purchase value; ROAS; attribution setting.
- Screenshots of Events Manager: overview, main conversion event detail, event match quality, deduplication.
- Shop or CRM totals by day for the same 90 days (orders, revenue, refunds, or leads and qualified leads).
- The client's unit economics: average order value or lead value, gross margin, target cost per acquisition.
- A screenshot of the activity history for the last 30 days.

Better: partner access with **View performance** on the ad account and **Use events dataset** on the dataset.

**Access:** level 1 for the whole audit; level 2 to build the fixes paused for you; level 3 to make approved fixes live, within your limits.

## Steps

Work in this order. Flag which decisions depend on uncertain upstream evidence.

### Evidence contract before diagnosis

Reuse the shared brand brain and the account's existing context; ask only for missing facts. Record an evidence ledger: source/export ID, account/store ID, fetched time, completed date range, timezone, currency, reporting time basis, conversion action and counting rule, attribution window, revenue/refund definition, rows/pages fetched, filters and inaccessible breakdowns. Reconcile retrieved spend to the account aggregate; report covered spend and the uninspected residual. A top-N extract is a partial audit, never the whole account.

For every comparison, show aligned numerators and denominators. Calculate CPA as total eligible spend / total eligible conversions and ROAS as total eligible conversion value / total eligible spend; do not average row ratios. Keep Meta, Google, store revenue and blended marketing efficiency in separate columns. Do not add platform-attributed sales together as unique store sales. Label unavailable data **Unknown**, not zero or broken. Split measured facts, hypotheses and decisions; a customer's inferred intent is not a verified customer fact.



### 1. Business frame (10 minutes)
Write down expected contribution before ads per acquired order after landed COGS, fulfilment, payment fees, returns/refunds and other variable costs. That is the contribution break-even CPA. Break-even ROAS is the same purchase-value definition reported by the ad platform divided by that contribution; use 1 / contribution rate only when its revenue denominator matches exactly. A 40% product gross margin alone gives a product-cost-only threshold of 2.5, not profit break-even. Missing costs block a scaling verdict. Keep first-order economics separate from mature-cohort value and cash.

### 2. Tracking truth
- Reconcile comparable platform and store/CRM periods after recording reporting time, timezone, attribution windows, outcome definitions, lag and refunds. A count mismatch is an unresolved difference, not proof of duplicate purchases or missing events. Trace a privacy-safe sample of order/event IDs before diagnosing duplication; never derive a corrected ROAS by scaling platform ROAS with the order-count ratio.
- Events Manager: are browser and server events both present for the main conversion? Inspect matched event names and IDs, current deduplication diagnostics, event coverage and event match quality. Missing shared IDs are a deduplication risk, not a measured duplicate rate. Verify current requirements against Meta documentation; no fixed coverage or match-quality score proves revenue accuracy.
- Does the purchase event carry value and currency? Are test or staging events polluting the data?
- Note the attribution model (standard, incremental, custom) and windows on each ad set. Flag mixed models in one comparison.

When measurement is unreliable, block dependent scale/profitability verdicts and prioritize verification. Continue independent supported findings (broken links, disapprovals, unavailable products, missing creative assets); say which decisions remain blocked.

### 3. Goal and value
- What performance goal does each ad set optimise for? Flag any that optimise for clicks, landing page views or reach when the business wants sales or leads.
- For lead businesses: is there any signal back from the CRM on lead quality (Conversions API for CRM, or offline uploads)?
- For shops with varied margins: is value optimisation or a ROAS goal in use, and are values correct?

### 4. Structure and learning
- Count active campaigns and ad sets; record observed delivery/learning status, outcome volume and maturity. Check current platform guidance for the actual optimization event rather than treating one conversion count as a universal budget requirement.
- How many ad sets show Learning limited? What share of spend sits in them?
- Investigate overlap using observable audience, objective, geography and product scope. Consolidation is a hypothesis: protect intentional exclusions, separate economics and active experiments; require evidence of fragmentation before proposing a scoped test.
- Advantage+ levers: are campaign budget, Advantage+ audience and Advantage+ placements on? If not, is there a stated reason (for example, a Special Ad Category or a brand placement restriction)?

### 5. Edits and stability
From activity history, align targeting, creative, optimization, bidding, budget and pause changes with delivery and outcome trends. Record observed learning resets and confounders; edit frequency alone does not prove instability.

### 6. Creative
- Join the performance rows to actual creative evidence using stable account, ad, ad-set and creative IDs where supplied. Retain source locators and versions for body copy, headline, destination, asset and catalog product. Names, similar images and a high ROAS do not establish that join. Deliver a compact creative-evidence table; mark unresolved joins and inspected spend coverage. Do not silently attach a winning ad's results to a different photo or historical copy variant.
- Group inspected ads by concept (person, problem, promise, proof, format), not by file. Count only concepts supported by that inspection; separate metadata-only labels and uninspected ads. For catalog ads, shared copy may conceal different products, availability, prices or baskets.
- Analyze the strongest decision-relevant contrasts with their exact IDs: within an ad set where possible, then comparable product/offer/period groups. Explain attributed purchase count, attributed value per purchase and spend together rather than calling every ROAS difference a creative win. Keep any response-rate denominator and attribution basis explicit; attributed purchases divided by clicks are not verified checkout conversion. Check audience, placement, inventory, destination and product mix as alternative mechanisms when the fields exist. A within-ad-set contrast still is not randomized causal evidence.
- Turn each material creative recommendation into a supported observation, at least one plausible competing explanation, and a test that could distinguish them. Tie the proposed visual/copy change to the inspected creative and buyer question. A generic recommendation to refresh hooks is not a diagnosis. Missing media limits visual judgments; missing daily reach/frequency and mature outcomes limits fatigue judgments.
- Share of inspected spend on the top ad and top verified concept. A platform creative-limitation or fatigue flag is a diagnostic signal, not proof of the cause or the size of a recoverable loss. Check mature trends and competing explanations before prescribing a refresh or budget change.
- Formats in use: video, static, carousel, catalogue; vertical versions for Reels and Stories.
- When was the last new concept launched? What is the hit rate (share of new concepts that reach break-even)?
- Advantage+ creative enhancements: which are on, and has the client approved them?

### 7. Budget and bidding
- Record bid strategy and constraints per campaign. Under-spend can reflect targets, audience size, eligibility, inventory or measurement; distinguish supported causes before proposing a budget or bid change.
- Budget split across prospecting, retargeting and existing customers. Large retargeting share with high ROAS needs an incrementality question, not more budget.

### 8. Measurement maturity
Has the account ever run a Conversion Lift or a proper A/B test? Is there any check outside Meta (post-purchase survey, MMM, holdout by region)? Rate it: none, informal, tested.

### 9. Policy and risk
Special Ad Category needed but missing? Rejected ads in the last 90 days? Account Quality warnings? Claims in ads that cannot be proven?

### Close the loop on each intervention

Read existing interventions before recommending changes. Keep the canonical intervention episode beside the existing job receipts in `jobs/<run-id>/`; `context/media-buying/meta/<account-id>/` is an index linking to those episodes, not a second copy of their state. Record the stable intervention ID, entity scope, evidence IDs, hypothesis, baseline period, primary outcome, guardrail, maturity/lag rule, current experiment collisions, authorized scope, rollback and review trigger in that episode. For a material executed change, use the optional shared `intervention/v1` contract and `org-context.mjs intervention-check` described in `MEMORY-ARCHITECTURE.md`; passing it means eligible for outcome review, not causal success. Keep proposed, executed, provider-verified and outcome-reviewed states distinct. Existing authorization remains valid within its scope; ask only for genuinely new consequential actions. Review comparable mature periods, note promotions, stock, traffic mix and other concurrent changes, and choose keep, revert, iterate or collect more evidence. A before/after improvement alone is not a causal lift estimate. Feed the verified result back into scoped memory without overwriting canonical brand facts.

## Checks before you send it

- Every finding has evidence: a number, an export row, or a screenshot reference.
- Findings are ranked by money at stake per month, not by how interesting they are.
- No finding contradicts the tracking verdict.
- Each fix states what changes, the expected effect, the risk (for example, "restarts learning on two ad sets") and when we review it.
- Nothing is presented as done. Every fix is a proposal until the client says yes or it falls inside agreed level 3 limits, and anything made live is in the change log.
- You have said what the data cannot tell you.

## Output format

1. **Verdict in three lines:** can this account take more spend now, after fixes, or not yet?
2. **Scorecard:** Tracking, Goal and value, Structure, Stability, Creative, Bidding, Measurement, Policy. Each rated Good, Needs work, Broken or Unknown, with one line of evidence.
3. **Findings table:** rank, finding, evidence, monthly money at stake (estimate, with the method), fix, effort, risk.
4. **Intervention list:** scope, evidence, hypothesis, outcome, guardrail, authorization status, rollback and review trigger. Identify only decisions requiring new approval.
5. **What I need from you:** access, exports, decisions.
6. **Review date.**

## Example of good output (short)

*Illustrative figures, not a real account. Use the client's evidence, never these values.*

**Verdict:** Scaling decision is unresolved. The platform reports 412 attributed purchases while the store reports 301 orders. The raw difference is 111; it does not establish 111 duplicates. The export lacks reporting-time and attribution alignment, and contribution costs are incomplete. No corrected ROAS or profit break-even claim is supported.

| Finding | Evidence | Conclusion / next step |
|---|---|---|
| Measurement discrepancy | 412 platform purchases; 301 store orders; server sample lacks shared event IDs | Deduplication risk plus unresolved attribution difference. Inspect privacy-safe event/order traces and aligned periods before quantifying impact. |
| Fragmentation hypothesis | 64% of retrieved spend is in ad sets marked Learning limited | Inspect goals, volumes, exclusions and current tests. Status alone does not prove recoverable spend or justify merging. |

**Scope:** Account-level spend is not supplied; coverage is unknown. Retrieve aggregate totals before extrapolating the inspected rows. Continue checking destination links and product availability now.

Primary reference: [Meta event ID and event-name deduplication fields](https://github.com/facebookarchive/Facebook-Server-Side-API-Swagger/blob/main/server-side-api.yaml). Consult current Events Manager diagnostics and supported API documentation for the live integration.

## Ecommerce arithmetic check (illustrative, independent of the audit above)

These are deliberately complete hypothetical inputs, not real brand or account evidence. All values use USD, the same completed period, purchase definition and revenue basis. Refund impact is a variable-cost allowance here, not also deducted from the revenue numerator.

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
