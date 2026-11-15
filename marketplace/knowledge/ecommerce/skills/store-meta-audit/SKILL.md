---
name: store-meta-audit
description: "Audit an online store's Meta (Facebook and Instagram) ad account and return a store-first verdict: what is losing money now, what is blocking measurement, and what to do this week. Every finding carries evidence from the exports and the money at stake per month, judged against the store's own gross profit per purchase, not a benchmark. A lead runs five checks that can go to helpers in parallel: tracking truth, money and budget, structure and delivery, creative supply, policy and account health. Use when taking over an account, when results slipped for two weeks or more, when ads stopped spending, before raising spend, or once a quarter."
---

# Meta account audit for an online store

**You get:** a one-screen verdict on the Meta account, a ranked findings table with money at stake, a reconciliation table, a list of what was not checked, and audit, findings and change list files.

The audit answers three questions, in this order: what is losing money now, what is stopping us from seeing the truth, and what we do this week. There is no 0 to 100 health score. A weighted score lets a broken purchase event hide behind good creative; a ranked list of money at stake cannot.

## When to use

- You are taking over an account from another buyer or agency.
- Cost per purchase has drifted up for two weeks or more and nobody knows why.
- Ads stopped spending or delivery collapsed.
- The owner wants to raise spend and needs to know if the account can take it.
- Quarterly health check.

## Not for

- Explaining one specific drop in depth: use `store-meta-deep-dive`.
- Fixing the pixel or Conversions API setup itself: use `store-meta-capi`.
- Setting budgets and bid rules after the audit: use `store-meta-budget`.
- Judging one batch of new ads: use `store-meta-creative-review`.

## What you need

Required:
1. **Meta Ads Manager export**, last 90 days, by day, at ad level: campaign, ad set and ad name; delivery; attribution setting; amount spent; impressions; reach; frequency; CPM; link clicks; CTR (link); purchases; purchase conversion value; cost per purchase; purchase ROAS. Add 7-day click and 1-day view columns from "Compare attribution settings", and a second export broken down by audience segment (new, engaged, existing customers) where Advantage+ sales campaigns run.
2. **Shopify order export**, same 90 days: Name, Created at, Financial Status, Subtotal, Shipping, Discount Amount, Refunded Amount, Payment Method, Email, Lineitem sku, Lineitem quantity.
3. **Events Manager screenshots** for Purchase, AddToCart and ViewContent: browser and server event counts, deduplication, event match quality, diagnostics.
4. **Gross profit per purchase** and break-even ROAS from `store-meta-ads` or `store-meta-math`.

Optional, raise confidence: activity history (30 days), Account Quality screen, Commerce Manager catalog diagnostics, stock on hand and reorder lead time for the top 20 SKUs, a post-purchase survey export.

Missing item: ask once. If still missing, run the checks you can, mark the rest "not checked", and say what confidence that costs.

**Access:** level 1 (read) for the whole audit. Level 2 (draft) only to build approved fixes as paused drafts. Level 3 (publish) only for fixes the owner approves, within agreed limits.

## Before you start: the gates

1. **Money.** Gross profit per purchase and break-even ROAS are written down. Fail: run only tracking and policy checks, and give no kill, scale or money-at-stake figure.
2. **Cash and stock.** Monthly ad cash limit and stock cover for advertised SKUs are known. Fail: the audit can still find losses, but "can it take more spend" is answered "unknown".
3. **Tracking.** Checked inside the audit (Check A). If it fails badly, it becomes finding 1, and every money figure from Meta is replaced by the Shopify figure or marked provisional.

## Steps

### 1. Set the frame (lead, 10 minutes)

Write the break-even ROAS and break-even cost per purchase at the top. Pick the window: last 30 days for money, 90 days for trends; leave out sale days, or audit them separately. Choose the deciding columns: 7-day click inside Meta, Shopify new-customer revenue per ad dollar for the business [MEA-0025] [MEA-0042].

### 2. Run the five checks

Each check can go to a helper with the frame, the exports and this section. Every helper returns rows in one format: check, finding, evidence (export row, date range or screenshot), money at stake per month with the method, fix, access needed, risk.

**A. Tracking truth**
- Meta 7-day click purchases versus Shopify paid orders, by week. Meta higher than the store points to double counting or view credit; far lower points to missing events.
- Purchase sent from both browser and server, with a shared event ID so Meta deduplicates [MEA-0006]. A test event code left in a live tag sends real purchases to the Test Events screen [MEA-0005].
- Purchase carries value and currency, and the value matches the definition used for break-even.
- With a consent banner, the pixel fires on consent update, not only on page load [MEA-0007].
- For catalog ads: content IDs on events match the IDs in the product feed.
- Event match quality: Meta grades it per event. A low grade on Purchase is a fix item. Numeric floors such as "8 out of 10" are practitioner defaults, not Meta rules. Do not promise big gains from paid server-side tools; the gains are often too small to see [MEA-0046] [MEA-0001].

**B. Money and budget**
- Per campaign: spend, 7-day click cost per purchase and ROAS against break-even.
- Existing customers: 30-day frequency on existing customers. About 10 is plenty; 20 to 100 in audits means overspend [ADC-0042]. Advantage+ sales campaigns: check the audience segment breakdown, since one ad's 12.84 ROAS fell to about 5 on new customers [ADC-0024].
- Catalog and dynamic product ads: share of spend, and ROAS on 7-day click. These ads mostly reach people about to buy; cap them well below the 70% often found [ADC-0026] [ADC-0010].
- Product mix: is spend going to the cheapest-to-sell product rather than the most profitable [ADC-0022]? Are out-of-stock or low-stock SKUs still advertised [ADC-0023]?
- Bid caps or ROAS goals that under-spend for days in a row are set too tight.
- Scaling read: compare the cost of the last extra customers, not the average [ADC-0049].

**C. Structure and delivery**
- Weekly purchases per ad set against Meta's guide of about 50 optimisation events in 7 days to leave learning. Share of spend in "Learning limited" ad sets.
- Number of cold campaigns. Start from one; add campaigns only for real differences such as countries or categories, not for spend [ADC-0030]. Under $50k a month: concept testing, one scaling campaign, minimal customer retargeting [ADC-0041].
- Exclusions: existing customers out of prospecting; exclusions are hard controls, age and interests are only suggestions on broad targeting [ADC-0055].
- Edits per ad set per week from the activity history. More than one major edit a week on a core ad set is unstable (practitioner default, test it).
- Not spending: account disabled or spending limit hit, payment failed, ads in review or rejected, catalog errors, empty product set, caps too tight. Check these before any budget idea.

**D. Creative supply**
- Count distinct concepts (persona, angle, offer), not files. A new colour or pose is not a new ad [MCR-0022]; near-duplicates are grouped and serve to the same people [MCR-0078].
- Spend concentration: under campaign budgets about 4% of ads can hold 64% of spend [ADC-0014]. Too few live ads can cap an account [ADC-0013].
- Fatigue: on cold campaigns, ad-level frequency above 2 is a warning [MCR-0040].
- Hit rate: ads that reached 5% of campaign spend at target cost, divided by ads launched; about 5% is normal [ADC-0017].
- Ads that send traffic to out-of-stock products or to a page that does not match the ad.

**E. Policy and account health**
- Account Quality warnings, rejected ads in 90 days, restricted ads.
- Claims the store cannot prove: health effects, before and after, "best", fake urgency.
- Domain verified; Business verified; Facebook page ad limits before a sale ramp [ADC-0045].

### 3. Put money on each finding (lead)

Use the simplest honest method and write it next to the number:
- **Spend below break-even:** monthly spend minus 7-day click purchases x gross profit per purchase, for campaigns over break-even cost.
- **Existing-customer overspend:** current spend minus customers x CPM / 1,000 x 10 a month [ADC-0068].
- **Out-of-stock or low-stock spend:** last 30 days of spend on those SKUs.
- **Measurement findings:** money at stake is the spend being steered by the wrong number. Say "decisions on X per month of spend", never invent a loss.

### 4. Apply the tracking verdict (lead)

If Check A fails, it is finding 1 and everything else is re-read on Shopify numbers. A creative or campaign "winner" chosen on a broken purchase event is not a winner yet. Data first, then structure, then creative [ADC-0028].

### 5. Rank and sort into three buckets

- **Losing money now:** fix this week.
- **Blocking measurement:** fix before any budget change.
- **Costing growth:** this month.

Rank inside each bucket by money at stake. Cut hygiene items that move no money to an appendix.

### 6. Write the week list

At most five changes, each small enough for a yes or no, with what changes, the expected effect, the risk (for example "restarts learning on two ad sets"), access level and review date. Nothing goes live without the owner's yes.

### 7. Answer "can it take more spend?"

Yes, after fixes, or not yet, with the reason in one line. Use 7-day read windows; day-to-day swings under about $1,000 a day are normal [ADC-0064].

### 8. Purpose and setup sweep

Run this sweep inside Check E (or as its own row group) on every campaign:

- **One sentence per campaign.** Write what each campaign is for and why it cannot live inside another. If nobody can defend it in one sentence, mark it MERGE (name the target campaign) or CUT. Categories, margins, buyer groups and countries justify campaigns; spend level does not [ADC-6194].
- **Name versus contents.** A campaign called cold prospecting that reaches existing customers, or runs catalog ads to past buyers, makes its ROAS meaningless. Flag every mismatch.
- **Setup errors**, each a finding with money at stake: existing customers not excluded from cold campaigns; store-visit or local campaigns leaking into the app rewards placement; interest or lookalike targeting still layered on purchase campaigns; budgets judged on 1-day view [ADC-6154]; flexible ads or creative enhancements switched on at ad or advertiser level [ADC-6185]; the email-to-Meta customer sync broken [ADC-6227].
- **One attribution setting** across campaigns, normally 7-day click plus 1-day engaged view [ADC-6258].
- **Starting cut-offs for the surface checks**, editable and labelled as practitioner defaults, not Meta rules: purchase events deduplicated at 90% or more (70 to 89% is a warning); daily budget at least 10 times target cost per purchase on each purchase ad set (5 to 9 times is a warning); fewer than 20% of ad sets in learning limited (over 40% fails); audience overlap between cold ad sets under about 15%; at least 3 ads in every concept ad set; catalog ads under about 70% of spend [ADC-0026].
- **Small accounts.** Under about 10,000 a month, skip the frequency and overlap checks and say so.

## Checks before you hand it over

1. Every finding has evidence: an export row, a date range or a screenshot.
2. Every money figure shows its method and uses the store's break-even, not a benchmark.
3. No finding contradicts the tracking verdict.
4. Each helper's rows were merged, deduplicated and re-ranked by the lead.
5. Not-spending causes were checked before any budget recommendation.
6. The week list has five items or fewer, each with risk, access level and review date.
7. Nothing is presented as done; all changes are proposals until the owner says yes.
8. The audit says what the data cannot tell (for example, incrementality without a lift test).
9. Every campaign has a one-sentence purpose with KEEP, MERGE or CUT.
10. Surface cut-offs are labelled as editable starting points.

## Output

1. **Verdict, one screen:** Losing money now (top three, money per month each). Blocking measurement (top items). This week (numbered, five at most). Can it take more spend: yes, after fixes, or not yet.
2. **Findings table:** rank, bucket, check (A to E), finding, evidence, money at stake per month, method, fix, access, risk, review date.
3. **Reconciliation table:** week, Meta 7-day click purchases, Meta default purchases, Shopify paid orders, new-customer orders, ad spend, acquisition MER.
4. **Not checked:** each missing input and what it would change.

Files: `meta-audit-<date>.md`, `meta-audit-findings.csv`, `meta-change-list.md`.

## Common mistakes

- **A health score that averages a broken purchase event with good creative.** The three buckets and money ranking replace it.
- **Benchmark CPMs and CTRs as verdicts.** Only the store's break-even decides.
- **Praising high-ROAS retargeting and catalog ads.** Checks B and the segment breakdown test how much is existing customers.
- **Calling a near-duplicate set "creative diversity".** Check D counts concepts, not files.
- **Raising budget on an account that is not spending.** Check C looks for blocks first.
- **Advertising products that are about to sell out.** Check B ties spend to stock.
- **Treating "Learning limited" as an emergency on a small account.** Compare purchases per week with the guide and read on 7 days before changing anything.
- **Trusting a campaign name.** Check what it reaches before reading its ROAS.

## Sources

- [MEA-0001]: Conversions API Gateway recovers little against blockers.
- [MEA-0005]: test event code left in a live tag.
- [MEA-0006]: one event ID on browser and server for dedup.
- [MEA-0007]: fire the pixel on consent update.
- [MEA-0025]: acquisition MER over blended MER.
- [MEA-0042]: report on 7-day click.
- [MEA-0046]: server-side gains are usually small.
- [ADC-0010]: dynamic product ad ROAS inflated by existing customers.
- [ADC-0013]: too few live ads can cap an account.
- [ADC-0014]: about 4% of ads hold about 64% of spend.
- [ADC-0017]: creative hit rate about 5%.
- [ADC-0022]: bidding favours the cheapest-to-sell product.
- [ADC-0023]: tie ad targets to days of stock.
- [ADC-0024]: segment breakdown cut one ad's ROAS sharply.
- [ADC-0026]: cap dynamic product ads.
- [ADC-0028]: data, then structure, then creative.
- [ADC-0030]: start from one cold campaign.
- [ADC-0041]: structure under $50k a month.
- [ADC-0042]: existing customers see far too many ads.
- [ADC-0045]: per-page ad limits.
- [ADC-0049]: judge the last customers, not the average.
- [ADC-0055]: exclusions are hard controls.
- [ADC-0064]: read on 7 days at low spend.
- [ADC-0068]: existing-customer budget in money, not percent.
- [MCR-0022]: a new colour is not a new ad.
- [MCR-0040]: cold ad-level frequency above 2.
- [MCR-0078]: near-duplicates share one entity.
- [ADC-6154]: drop 1-day view from reporting.
- [ADC-6185]: settings audit.
- [ADC-6194]: campaigns only for business differences.
- [ADC-6227]: email to Meta sync breaks.
- [ADC-6258]: 7-day click plus 1-day engaged view.

Coverage checked against the open-source meta-ads skill set (MIT), https://github.com/AI-Marketing-Hub/meta-ads.

What this skill does that the open-source one did not: replaces the weighted 0 to 100 score with three buckets (losing money now, blocking measurement, this week) ranked by money at stake against the store's own break-even; reconciles Meta purchases with Shopify orders and lets that verdict override every other finding; checks store mechanics the generic audit skipped, such as existing-customer frequency, catalog ad share, ads on out-of-stock SKUs and not-spending causes; drops unsupported rules such as a similarity score and "5x CPA to exit learning" for Meta's own 50-events guide.
