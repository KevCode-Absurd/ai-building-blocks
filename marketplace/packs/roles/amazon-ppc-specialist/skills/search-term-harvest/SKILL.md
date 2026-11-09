---
name: search-term-harvest
description: Turn an Amazon Ads search term report into three lists - searches to harvest as exact-match keywords, searches and products to add as negatives (negative exact, negative phrase or negative ASIN, at campaign or ad group level), and a watch list - each with the rule that put it there, as CSV ready for bulk upload. Use weekly or fortnightly on active Sponsored Products and Sponsored Brands accounts, after launching automatic or broad campaigns, or when ACOS rises.
---

# Search term harvest

## When to use

- Weekly on accounts with steady spend; fortnightly on small ones.
- About two weeks after launching an automatic or broad-match campaign, which is when Amazon suggests the first manual build.
- When ACOS rises on a product and the margin hasn't changed.
- When one search term shows up in several campaigns at different bids.

## What you need

- Sponsored Products search term report, last 30 to 60 days: campaign, ad group, targeting, match type, customer search term, impressions, clicks, spend, orders, sales.
- Sponsored Brands search term report, if Sponsored Brands runs.
- Each product's break-even ACOS and target ACOS (from the break-even-acos-review skill).
- Current negative keywords and negative products per campaign.
- What the seller does not sell: wrong sizes, materials, compatible models, price levels, used or refill versions.

**Access:** level 1 to read the reports; level 2 to prepare the bulk file for the seller to upload; level 3 to add the keywords and negatives on the agreed rules, within the limits.

## Steps

### 1. Prepare the report
Sort by spend, highest first. Tag each term as brand (yours), competitor brand, generic, or ASIN (search terms that are product IDs come from product targeting). Note the date range and attribution window in the column names.

### 2. Set the rules before you sort
Write them down so the seller can see and change them:
- **Harvest rule:** a term with orders at or below the product's target ACOS, and enough orders to trust.
- **Negative rule:** a term with at least 20 clicks and no orders whose meaning doesn't fit the product. Amazon's own guidance is to judge a term only after at least 20 clicks before making it negative.
- **Relevance override:** a term that is clearly wrong (wrong product, wrong compatible model, "free", "used") can be made negative earlier, because no number of clicks will make it right.
- **Watch rule:** relevant terms with too few clicks to judge.

### 3. Sort every term
Put each row in harvest, negative, watch or keep (performing well where it is). Sum the 60-day spend in each list.

### 4. Build the harvest list
For each harvested term:
- Add it as an exact-match keyword in the manual campaign for that product.
- Starting bid: near the term's current average CPC, adjusted towards target ACOS (a term converting well below target can take a higher bid).
- In the source campaign (automatic or broad), add the same term as a negative exact, so the exact keyword gets the traffic and you control its bid. Do this only once the new keyword is live.
- Don't add the same term to several ad groups.

### 5. Build the negatives list
- **Negative exact** for a specific wasteful search.
- **Negative phrase** for a word order that is always wrong for this product ("for kids" on an adult product).
- **Negative product (ASIN)** for product pages where your ad never converts, such as an incompatible model.
- **Level:** campaign level for themes wrong for every ad group in the campaign; ad group level to steer traffic between ad groups.
- **Collateral check:** before any negative phrase, search the converting terms for it. "Set" as a negative phrase would block "knife set".

### 6. Write the watch list
Each term with its clicks, spend and the date to look again.

### 7. Estimate the effect
Spend on the negatives list over the period is the spend the change would have redirected, assuming similar volume. Orders on harvested terms show what the exact keywords should keep. Say clearly these are estimates.

### 8. Deliver and log
Give CSVs in the column order of the account's bulk upload sheet (ask for a recent bulk download to match it). At level 3, add the items on the agreed rules and mark them "done, logged" with the date. After adding negatives, wait two weeks or more before changing strategy again, as Amazon advises.

## Checks

- Every harvested term has orders at or below target ACOS, from the stated date range.
- Every negative has at least 20 clicks, or a written relevance reason.
- No negative blocks a term that converted in the last 60 days, unless the seller agreed.
- Your own brand terms aren't negated in the campaign meant to serve them.
- Each negative has a type (exact, phrase, ASIN) and a level (campaign, ad group).
- The CSV columns match the seller's bulk sheet.

## Output format

1. **Summary:** spend reviewed, spend on terms with no orders, the top three waste themes, estimated spend redirected.
2. **Harvest CSV:** product, campaign, ad group, keyword, match type (exact), bid, orders, ACOS, rule.
3. **Negatives CSV:** campaign, ad group (if any), term or ASIN, negative type, level, clicks, spend, reason.
4. **Watch list:** term, clicks, spend, why, review date.
5. **Approval line:** "Reply yes or no to each numbered item," or, at level 3, the log of items added inside the limits.

## Example of good output (short)

*Illustrative structure, not a real business: a kitchen tools seller on Amazon US. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> Reviewed 2,940 of search term spend (7 Sep to 5 Nov). 26% went to terms with no orders. Main waste: "electric" variants (we sell manual tools), "dishwasher safe" on the bamboo board (it isn't), and rival-model ASINs.
>
> **Harvest** (exact, Manual campaign "BambooBoard_SP_KW_Exact")
> 1. bamboo cutting board large, bid 1.10: 23 orders, ACOS 17.9% (target 30%).
> 2. wood chopping board with handle, bid 0.85: 9 orders, ACOS 24.0%.
> Then add both as negative exact in "BambooBoard_SP_Auto".
>
> **Negatives**
> 3. "electric garlic" (negative phrase, campaign GarlicPress_SP_KW_Broad): 41 clicks, 0 orders, 38.20. Checked: no converting term contains it.
> 4. "dishwasher safe cutting board" (negative exact, BambooBoard_SP_Auto): 27 clicks, 0 orders, 22.95.
>
> **Watch:** "bamboo board for cheese": 6 clicks, 1 order. Look again 19 Nov.
>
> Reply yes or no to each number.
