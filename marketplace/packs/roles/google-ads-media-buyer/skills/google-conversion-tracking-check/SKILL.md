---
name: google-conversion-tracking-check
description: Check that Google Ads counts the right conversions, once, with values - and fix what it does not. Covers primary versus secondary actions, duplicate tags and GA4 imports, count settings, values, attribution model, enhanced conversions for web, consent mode, and offline sales through enhanced conversions for leads and Data Manager, then writes a developer-ready fix spec and a test plan. Use before launching or scaling, when Google Ads and the shop or CRM disagree, after site or consent-banner changes, or before switching to Target CPA or Target ROAS.
---

# Google conversion tracking check

## When to use

- Before launch, before raising budgets, and before moving to Target CPA or Target ROAS.
- Google Ads conversions differ from shop orders or CRM leads by more than usual.
- After a new site, theme, checkout, tag manager change or consent banner.
- A lead business wants Google to bid on sales, not form fills.

## Why it matters

Smart Bidding optimises toward the conversion actions marked primary. If those include page views or a duplicate purchase, bids chase the wrong thing. If consent or tagging gaps hide conversions, bidding starves.

## What you need

- Screenshot or Read-only view of Goals, then Summary: each conversion action with its goal category, primary or secondary, source (website tag, GA4 import, offline import, phone), count setting (one or every), value settings, click-through window and attribution model.
- Tag setup: Google tag and Google Tag Manager container (read access or a screenshot of tags and triggers).
- Shop or CRM totals by day for the last 30 days.
- Consent banner tool and the regions the business serves.
- For lead businesses: CRM name, lead stages, how often leads become sales, and whether GCLIDs are stored with leads.

**Access:** level 1 for the whole check; level 2 to make tag fixes in an unpublished Tag Manager workspace; level 3 to change conversion settings or publish the workspace, on the fix list you confirm. A primary goal change always needs a fresh yes.

## Steps

### 1. Inventory the actions
Make a table of every conversion action. For each: is it a business outcome (purchase, qualified lead, booked call) or a micro-step (page view, scroll, add to cart)? Only outcomes should be primary. Micro-steps can stay as secondary for observation.

### 2. Find duplicates
Common patterns:
- A Google Ads purchase tag and a GA4 purchase import, both primary.
- Two tags firing on the thank-you page (theme plus app plus Tag Manager).
- Lead forms counted on submit and again on thank-you page view.
- Count set to "Every" for leads where one person may submit twice.
Reconcile with the shop or CRM by day. Expect some difference (consent, ad blockers, cross-device), but it should be steady.

### 3. Values
Purchases should pass the actual order value and currency. For leads, assign values that reflect what a lead is worth, or better, import later stages with their values. Target ROAS needs values; Google lists a minimum of 15 conversions in 30 days for Search and Shopping.

### 4. Attribution model
Google now supports DDA (its default model, which spreads credit using the account's own conversion paths) and last click; first click, linear, time decay and position-based were retired. Note the model per action, because it changes what bidding sees.

### 5. Enhanced conversions for web
Is it on for the purchase or lead action? It sends hashed (SHA-256) first-party data such as email from the conversion page, through the Google tag, Google tag gateway or server-side Tag Manager. Check that the email field is captured on the confirmation page or event.

### 6. Consent mode
For traffic from regions that require consent: are the four signals (ad_storage, analytics_storage, ad_user_data, ad_personalization) set by the banner? Basic mode blocks tags until consent; advanced mode lets tags send cookieless pings when consent is denied, which supports more detailed modelling. When ad_user_data is denied, enhanced conversions data is not collected. Whether the banner meets local law is for the client's legal adviser; your job is to report what the tags do.

### 7. Offline outcomes (lead businesses)
- Are qualified leads and sales sent back? Google's recommended route is enhanced conversions for leads: the website sends hashed lead details when the form is submitted, and later outcomes are imported with the same hashed details (and the GCLID where stored) through Data Manager or the API.
- As shown on Google's help page (November 2026): from 15 June 2026, offline conversion and enhanced conversions for leads uploads go through the Data Manager API and are blocked in the Google Ads API. If the client relies on an old API-based or file upload, check it still works.
- Which stage should bidding use? Usually the qualified-lead stage that happens soon enough and often enough to learn from; set it primary, keep raw form fills secondary.

### 8. Test
Make a real test conversion (purchase or lead). Check Tag Assistant or Tag Manager preview for one conversion tag firing with value and the enhanced conversions data, and check the conversion appears in Google Ads diagnostics within the normal delay. Re-check numbers after 7 days.

### 9. Plan the switch
Changing which actions are primary can put Smart Bidding into learning for up to seven days, and a big change in what counts may need one to two conversion cycles to settle. Schedule goal changes away from peak days, and do not combine them with target or budget changes.

## Checks

- Only business outcomes are primary; each counted once.
- Values and currency correct.
- Enhanced conversions and consent mode status documented.
- Offline stages flowing for lead businesses, or a plan to add them.
- The fix spec names the tag, trigger, field and test for each change.
- No passwords, API keys or customer data requested in chat.

## Output format

1. **Verdict:** Trustworthy, Fix before scaling, or Broken.
2. **Conversion action table:** action, outcome or micro-step, primary or secondary (now and proposed), source, count, value, model.
3. **Reconciliation:** Google Ads versus shop or CRM by week.
4. **Problems and fixes:** problem, evidence, fix, owner, risk.
5. **Developer spec** for each tag or upload change.
6. **Test and review plan.**

## Example of good output (short)

> **Verdict: Fix before scaling.** Google Ads shows 212 leads in October; the CRM shows 131. The contact form fires on submit and on the thank-you page, and both actions are primary.
>
> | Action | Type | Primary now | Proposed | Count | Value |
> |---|---|---|---|---|---|
> | Form submit (tag) | Lead | Yes | Yes | One | 40 USD |
> | Thank-you page view | Micro | Yes | Secondary | Every | none |
> | Qualified lead (CRM) | Outcome | Missing | Yes, once flowing | One | 160 USD |
>
> **Fix 1:** set "Thank-you page view" to secondary (bidding learns for up to 7 days; do it on Monday, not before the Thursday promotion). **Fix 2:** turn on enhanced conversions for leads on the form and send "Qualified" from the CRM through Data Manager, including the GCLID where stored. Reply yes or no to each.
