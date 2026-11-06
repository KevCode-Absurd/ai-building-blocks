---
name: search-terms-cleanup
description: Review Google Ads search terms and turn them into three lists the client can approve - new keywords to add, negative keywords to add (with the right level and match type), and terms to watch. Works for Search, AI Max and Performance Max search terms, handles brand versus non-brand, protects good traffic from over-broad negatives, and estimates the spend each change affects. Use weekly or fortnightly on active accounts, after switching on broad match or AI Max, or when cost per conversion rises with no other cause.
---

# Search terms clean-up

## When to use

- Weekly for accounts spending more than a few hundred a week on Search or Performance Max; fortnightly for small ones.
- After turning on broad match, AI Max search term matching, or a new Performance Max campaign.
- When cost per conversion rises and tracking is fine.

## Why it matters

Matching is looser than it used to be. Broad match can draw on signals beyond the keyword, and AI Max adds keywordless matching. That finds new demand and also buys irrelevant clicks. Negative keywords are the main control, and they behave differently from keywords: they do not match close variants, so (in Google's own example) a negative "flowers" blocks "red flowers" but not "red flower".

## What you need

- Search terms report, last 30 days (or 90 for small accounts), with: search term, match type, added or excluded status, campaign, ad group, keyword, cost, clicks, impressions, conversions, conversion value. Include the "AI Max" match type rows if AI Max is on.
- Performance Max search terms report if Performance Max runs.
- Current negative keyword lists and account-level negatives.
- Brand terms and misspellings; competitor names the client does or does not want.
- What the business does not sell or serve: products, locations, price levels, job seekers, DIY.
- Target cost per conversion or ROAS.

**Access:** level 1 to read the reports; level 2 to load the lists into Ads Editor unposted; level 3 to add the negatives and keywords on the agreed themes, within your limits.

## Steps

### 1. Prepare
Sort by cost, descending. Note the share of total spend you can see: low-volume terms are withheld for privacy, so the report will not add up to total spend. Tag every term as brand, competitor or generic.

### 2. Bucket each term
- **Winners:** converting at or better than target with enough volume to trust (as a working rule, at least two or three conversions). Candidate keywords.
- **Clear waste:** wrong intent (jobs, free, how to, DIY, definitions), wrong product, wrong place, wrong customer type. Candidate negatives, even with little spend, if the theme repeats.
- **Expensive non-converters:** spent more than about one target cost per conversion with no conversion. Look at intent before excluding; a relevant term may just need time or a better page.
- **Watch:** relevant intent, too little data.

### 3. Choose negative level and match type
- **Level:** account-level list for themes that are never relevant anywhere (jobs, careers, free); shared list for themes irrelevant to a group of campaigns; campaign level for routing (for example, keeping generic terms out of the brand campaign); ad group level only to steer traffic between ad groups.
- **Match type:** start narrow. Exact negative for a specific query you do not want; phrase negative for a word order that is always wrong ("used parts" for a new-parts seller); broad negative only for single words that are never relevant ("jobs").
- **Check for collateral damage:** before adding a broad or phrase negative, search your converting terms for it. A negative "cheap" kills "cheap flights" for a discount airline.
- **Performance Max:** campaign-level negatives and lists apply only to its Search and Shopping inventory. Brand traffic is better handled with brand exclusions than with negative lists.

### 4. Promote winners
For converting terms not already keywords: add as exact or phrase keywords in the ad group whose ads and landing page fit best. If none fits, propose a new ad group with its own RSAs. Do not add the same term in several ad groups.

### 5. Brand and competitor rules
- Brand terms should be served by the brand campaign; exclude them from non-brand campaigns at campaign level (or use brand exclusions where available) so reporting is honest.
- Competitor terms: only if the client has agreed to bid on them, with ads that do not use the competitor's trademark in a misleading way.

### 6. Estimate impact
For the negatives list, sum the last 30 days' cost on the matched terms: that is the spend the change would have redirected. For new keywords, note current conversions and cost. Say clearly that the estimate assumes similar volume next month.

### 7. Write the change request
Three lists, each numbered for approval. At level 3, items on the agreed themes go live and are marked "done, logged". Keep a log of every negative added with date and reason, so a future drop in volume can be traced.

## Checks

- No negative blocks a term that converted in the last 90 days, unless the client agreed.
- Each negative has a level and match type with a reason.
- Brand terms are not excluded from the brand campaign.
- Promoted keywords have a fitting ad group and landing page.
- The estimate of affected spend is shown with its date range.

## Output format

1. **Summary:** spend reviewed, share of spend on zero-conversion terms, top three waste themes.
2. **Add as negatives:** term or theme, match type, level (account, list, campaign, ad group), 30-day cost, reason.
3. **Add as keywords:** term, match type, target ad group, conversions, cost per conversion.
4. **Watch list:** term, why, when to re-check.
5. **Approval line:** "Reply yes or no to each number."

## Example of good output (short)

> Reviewed 4,180 USD of search term spend (1 to 30 Oct), 81% of Search spend; the rest is withheld by Google for privacy. 23% went to terms with no conversions. Main waste: job searches, DIY, a town we do not serve.
>
> **Negatives**
> 1. jobs (broad, account list "Always exclude"): 212 USD, job seekers.
> 2. "how to fix" (phrase, campaign Non-brand): 344 USD, DIY intent; checked: no converting term contains it.
> 3. [boiler repair leeds] (exact, campaign Non-brand): 96 USD, outside service area.
>
> **New keywords**
> 4. [combi boiler service] (exact, ad group Servicing): 6 conversions, 41 USD each, target 55 USD.
>
> **Watch:** "boiler cover price": 2 clicks, relevant, re-check on 20 Nov.
>
> Reply yes or no to each number.
