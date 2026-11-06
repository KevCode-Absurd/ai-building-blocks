---
name: google-ads-account-audit
description: Audit a Google Ads account the way a senior PPC buyer would. Checks conversion goals and tracking, campaign mix and overlap, brand versus non-brand, search terms and negatives, match types and AI Max, ads and landing pages, Performance Max and Shopping feed health, bidding and budgets (including the August 2026 target-bidding change), and measurement, then ranks fixes by money at stake and turns them into a change list the client approves. Use when taking over an account, when results slide, before raising spend, or quarterly.
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

### 1. Business frame
Write the break-even cost per acquisition and break-even ROAS. For lead businesses, convert to cost per qualified lead using the close rate: if a sale is worth 1,200 USD in margin and 1 in 8 leads closes, a lead is worth at most 150 USD.

### 2. Conversion truth (stop here if it fails)
- Which actions are primary? Only real outcomes (purchase, qualified lead, booked call above a set duration) should be. Flag page views, scrolls, button clicks or every form start counted as primary.
- Double counting: two purchase actions both primary (for example a Google Ads tag and a GA4 import), or count set to "Every" for leads where "One" fits.
- Reconcile Google Ads conversions with shop or CRM for the same dates. Note conversion lag before judging recent days.
- Enhanced conversions on? Consent mode in place for EEA or UK traffic? For lead businesses, are offline outcomes sent back through enhanced conversions for leads or Data Manager?
- Attribution model per action (DDA or last click).

### 3. Campaign mix and overlap
List campaigns by type (Search, Performance Max, Shopping, Demand Gen, Display, Video). For each: goal, budget, bid strategy, share of spend, share of conversions. Look for overlap: Performance Max and Search both chasing brand terms; Performance Max and Standard Shopping on the same products; several Search campaigns with the same keywords.

### 4. Brand versus non-brand
Split spend and conversions by brand and non-brand search terms. Blended ROAS often hides an unprofitable non-brand programme. Check whether Performance Max has brand exclusions or whether brand traffic is leaking into it.

### 5. Search terms and negatives
Sort search terms by cost over 90 days. Share of spend on terms with zero conversions; obvious waste themes (jobs, free, DIY, competitors you do not want, wrong locations, wrong product). Review negative lists: are any blocking good traffic? Are account-level negatives in use? (Run the `search-terms-cleanup` skill for the full pass.)

### 6. Match types and AI Max
Which match types are in use, with which bidding? Broad match or AI Max on manual or click bidding is a red flag. If AI Max is on: which features (search term matching, text customisation, final URL expansion), and what do the AI Max rows in the search terms and landing pages reports show?

### 7. Ads, assets and landing pages
Per ad group: number of RSAs, Ad Strength, pinning, distinct headlines, keyword use. Sitelinks and other assets present. Quality Score components: Below average landing page experience or ad relevance on high-spend keywords points to fixes outside the bid.

### 8. Performance Max and Shopping
- Asset groups by theme, with enough images, videos and text. Audience signals present. Search themes used.
- Channel performance report: where spend goes; any channels Not eligible or Eligible (limited).
- Search terms and campaign-level negatives.
- Merchant Center: disapproved and limited products, missing GTINs, price or availability mismatches, title quality for top sellers.

### 9. Bidding and budgets
- Strategy versus conversion volume: Target ROAS needs values and, for Search and Shopping, at least 15 conversions in 30 days; Target CPA should be judged over 30 or more conversions.
- Target realism: compare targets with the last 30 days' actuals.
- **Budget-limited target campaigns:** since 17 August 2026 these deliver closer to the stated target. A campaign that was beating its target may now spend toward it. Flag each and decide: lower the target, raise the budget, or switch to Maximize conversions or value.
- Search impression share lost to budget versus rank, per campaign.

### 10. Measurement maturity and hygiene
Any custom experiments run in the last year? Any lift or geo test? Auto-applied recommendations switched on without review? Who else has access, and when did they last change things?

## Checks before sending

- Every finding has evidence (report rows, screenshot, numbers).
- Findings are ranked by monthly money at stake, with the estimation method shown.
- Nothing contradicts the conversion verdict.
- Each fix states the change, expected effect, risk (for example, Smart Bidding learning for up to 7 days after a goal change), review date and undo.
- Nothing is presented as done.

## Output format

1. **Verdict** in three lines.
2. **Scorecard:** Conversions, Campaign mix, Brand split, Search terms, Match and AI Max, Ads and pages, PMax and feed, Bidding and budget, Measurement. Good, Needs work or Broken, one line of evidence each.
3. **Findings table:** rank, finding, evidence, money at stake per month, fix, effort, risk.
4. **Change list for approval:** numbered.
5. **What I need from you.**
6. **Review date.**

## Example of good output (short)

> **Verdict:** Fix goals first. Three conversion actions are primary, including "page_view thank-you" and a GA4 import of the same purchase, so Google counts 1.8 purchases per order. Non-brand Search spends 61% of budget at a true ROAS of 1.4 against a break-even of 2.2.
>
> | # | Finding | Evidence | At stake / month | Fix | Risk |
> |---|---|---|---|---|---|
> | 1 | Purchases double counted | 1,212 conversions vs 668 orders, Sep | Bidding on false data | Make the Google Ads purchase tag the only primary action | Up to 7 days of bid learning |
> | 2 | Brand leaking into PMax | 38% of PMax search-term conversions are brand | Credit claimed for free demand | Add brand exclusion list to PMax | PMax volume drops; brand Search covers it |
>
> **For approval:** 1) Set GA4 purchase import to secondary. 2) Apply brand exclusions to PMax after 7 days. Reply yes or no to each.
