---
name: harvest-amazon-search-terms
description: "A weekly routine for Amazon Sponsored Products that sorts every customer search term into harvest, negate, cut bid, hold or watch using gross profit per order and a click threshold set by conversion rate, then writes the exact-match keywords, ASIN targets and negatives ready to upload as a bulk sheet, with each harvested term blocked in the campaign it came from. Skips the last days that have not finished reporting, checks no negative blocks a live keyword or the brand name, and feeds new buyer words back into the listing. Use every week after a launch, when ACOS is drifting up with no clear cause, or when an account has years of auto and broad campaigns that were never cleaned."
---

# Amazon search term harvesting

**You get:** a weekly harvest sheet: every search term with its verdict and reason, a bulk upload file with new exact keywords, product targets and negatives, a change log, and a short list of buyer words to add to the listing, ready for the client to approve in 30 to 45 minutes.

## When to use

- Every week after `launch-amazon-ppc` hands over on day 14.
- ACOS is rising and nobody knows which terms cause it.
- An old account runs auto and broad campaigns that were never cleaned.
- Before a peak season, to stop paying for waste at higher click prices.

## Not for

- Building the first campaigns: use `launch-amazon-ppc`.
- Google Ads search terms: use `google-search-term-mining`.
- Keeping rivals off the brand's name on Google: use `protect-brand-search-terms`.
- A listing that gets clicks but no sales: fix it with `write-amazon-listing`; harvesting cannot fix a page that does not convert.

## What you need

Required:

1. **Sponsored Products search term report**, last 30 days, from the Amazon Ads console (Reports, Sponsored Products, Search term). Columns used: Campaign Name, Ad Group Name, Targeting, Match Type, Customer Search Term, Impressions, Clicks, Spend, 7 Day Total Orders, 7 Day Total Sales (column names may differ by marketplace; map them once).
2. **Gross profit per unit before ads** for each advertised ASIN, from `build-sku-profit-sheet`.
3. **Live keyword and negative lists**: a bulk operations download of all Sponsored Products campaigns.
4. **Conversion rate** per ASIN: unit session percentage from Business Reports, last 30 days.

Optional: Brand Analytics search query data, the keyword map from `write-amazon-listing`, last week's change log.

Reading reports is level 1. Uploading the bulk sheet needs draft access (level 2) and the client's yes on each week's changes.

## Before you start: the gates

1. **Profit per order is known for each ASIN.** Break-even ACOS = gross profit before ads / price [MEA-0037]. Fail: stop; ACOS on its own says nothing about money made.
2. **Enough data.** The report window has at least 30 days, or the product's whole life if shorter. Leave out the last 3 days, because attributed orders keep arriving for several days after a click (practitioner default; check how numbers for recent days change week to week).
3. **Stock is fine.** If an ASIN's days of cover are below its lead time, harvest nothing that raises spend on it; lower its bids instead [ADC-0023].
4. **Nothing else changed this week.** Note price changes, coupons, Featured Offer losses and listing edits. A term that died the week the Featured Offer was lost is not waste.

## Steps

1. **Set the two numbers per ASIN.** Target ACOS (agreed with the client, at or under break-even). Click threshold = 2 / conversion rate (at 10% conversion, 20 clicks; practitioner default, test it). Cost per order = cost per click / conversion rate [MEA-0019], so these two numbers tell you when a term has had a fair chance.
2. **Combine rows.** Sum each search term across campaigns and ad groups, keeping a list of where it ran. Mark ASIN terms (they start with B0 and a mix of letters and numbers).
3. **Sort every term into one verdict.**

| Verdict | Rule |
|---|---|
| Harvest | 2 or more orders and ACOS at or under target, and not already an exact keyword |
| Harvest ASIN | an ASIN term with 2 or more orders at or under target ACOS |
| Negate | clicks at or above the threshold and zero orders; or clearly wrong product, use or buyer at any click count |
| Cut bid | orders, but ACOS above break-even after the threshold is reached |
| Hold | ACOS between target and break-even; leave for another week |
| Watch | under the threshold; no action |

4. **Write the harvest.** Each harvested term goes into the exact campaign as an exact keyword. Starting bid = its average cost per click so far, but never above price x target ACOS x conversion rate. With dynamic bids up and down, enter half that, since Amazon can raise a bid by up to 100% [AMZ-6447]. Harvested ASINs go into the product targeting campaign.
5. **Block it at the source.** Add each harvested term as a negative exact in every auto, broad and phrase ad group it came from, so the exact keyword gets the traffic and the data stays clean.
6. **Write the negatives.** Use negative exact for single wasted terms. Use negative phrase only for a word that is wrong in every search (another product type, "free", "manual", a rival's spare part). Before adding, check each negative against the live keyword list and the brand name: a negative phrase like "case" can block "phone case for kids". Never negate the brand's own name.
7. **Adjust bids on existing keywords.** For exact keywords past the threshold: cut 20 to 30% when ACOS is above break-even; raise 10 to 15% when ACOS is under target and impressions are low (practitioner default). One bid change per keyword per week, so each result can be traced.
8. **Feed the listing.** Harvested terms that are not in the title, bullets or search terms field go to the listing owner. Product types that buyers describe in many ways keep producing new long-tail terms worth adding [AMZ-0003]. Search terms stay under 249 bytes [AMZ-6445].
9. **Other Amazon stores (Amazon.co.uk, .de, .ca, .com.au and more).** Expect local spelling variants, words from the other languages buyers use, and city or region words. Harvest variants that convert; negate city words only if the product ships everywhere and they do not convert. Where many orders are paid on delivery, use the delivered share of orders when counting orders, since refused orders bring no profit.
10. **US notes (Amazon.com).** From October to December, click prices rise; recheck every bid against the affordable cost per click before Black Friday rather than letting old bids run.
11. **Log and hand over.** Write each change with the reason and the numbers behind it. Compare this week's changes with last week's results: did harvested terms keep their ACOS in exact?

## Checks before you hand it over

- Every term has one verdict and the rule that produced it.
- No term judged before reaching the click threshold, except clearly wrong ones.
- Every harvested term is also a negative exact where it came from.
- No negative blocks a live keyword or the brand name.
- The last 3 days are excluded from verdicts.
- Bids never exceed the affordable cost per click (halved for up and down).
- No spend increase on an ASIN with cover below lead time.
- Nothing uploaded without the client's yes.

## Output

**One-screen summary:** spend, orders and ACOS this period by ASIN against target and break-even; counts of harvested, negated, cut and held terms; money spent last period on terms now negated; the 3 biggest changes; listing words to add.

**Harvest sheet:** Search term | ASIN | Where it ran | Impressions | Clicks | Spend | Orders | Sales | ACOS | Threshold reached (yes or no) | Verdict | Action | New bid.

**Bulk upload file:** Record type | Campaign | Ad group | Keyword or ASIN | Match type | Bid | State. One row per new keyword, target and negative, in the format of the bulk operations template.

**Change log:** Week | Item | Old value | New value | Reason | Result next week.

## Common mistakes

- **Negating terms after 5 clicks.** Step 1 sets the threshold from conversion rate.
- **Harvesting without blocking the source.** Step 5 stops the same term being bought twice.
- **Broad negative phrases.** Step 6 checks every negative against live keywords.
- **Judging the last few days.** Gate 2 leaves them out until orders finish arriving.
- **Raising bids on terms that sell a product about to run out.** Gate 3 ties spend to stock.
- **Changing bids every day.** Step 7 allows one change per keyword per week.

## Sources

- AMZ-6447: dynamic bids up and down can double the entered bid.
- AMZ-6445: 249-byte search terms field.
- AMZ-0003: products described in many ways keep producing long-tail terms.
- MEA-0019: cost per order = cost per click / conversion rate.
- MEA-0037: profit must include marketplace fees.
- ADC-0023: tie ad spend to stock cover.

What makes this skill ours: verdicts use break-even ACOS from gross profit, not a flat ACOS goal; a term is judged only after a click count set by its own conversion rate; every negative is checked against live keywords and the brand; and winning terms flow back into the listing, not only into ads.

## Selling in India

- On Amazon.in, expect Hindi words in Latin letters, spelling variants ("kurti", "kurthi") and pincode or city words.
- For COD-heavy ASINs, use the delivered share of orders when counting orders, since refused orders bring no profit.
