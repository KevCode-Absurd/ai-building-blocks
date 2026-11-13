---
name: new-ads-from-store-winners
description: "Make more ads in the visual style that already earns for this store. Picks the winners from the ad account by gross profit per ad on new customers, with a store-side order check, not from memory or a folder of favourites. Compares winners with losers so the written style profile holds only the traits that set winners apart, saves that profile to the brand files after the owner approves it, then plans and builds new statics for a chosen product: some remakes, some new formats on winning ideas, some new concepts, sized to what the test budget can read. Use when the account has proven ads and needs more like them, when winners are tiring, or when a new product should borrow what works."
---

# New ads from the store's own winners

**You get:** a winners table checked against store orders, a trait table, a saved visual style profile, a concept plan, and new statics at 1080 x 1350 and 1080 x 1920 with pre-launch verdicts.

The best brief a store has is its own ad account. This skill reads it for profit, writes down what the winners share that the losers do not, and builds new ads on that.

## When to use

- The account has ads that clearly earned and needs more in the same vein.
- Winning ads are tiring (frequency rising, cost per purchase creeping up).
- A new or second product should launch with the look that already sells.
- The team keeps saying "make it like that one ad" and nobody has checked whether that ad made money.

## Not for

- A full review of live ads with scale, keep, fix and cut calls: use `store-meta-creative-review`.
- Rivals' ads: use `store-meta-competitor`.
- Formats the store has never run: use `proven-static-formats`.
- New angles from customer research: use `store-meta-concepts`.

## What you need

**Required**

- Meta Ads Manager export, last 90 to 180 days, ad level, by day or summed: ad ID, ad name, ad set, campaign, spend, impressions, frequency, link clicks, purchases, purchase value, attribution setting. If available, the same with the breakdown by new versus existing customers, and the incremental attribution column.
- The ad files or thumbnails for every ad with meaningful spend.
- Shopify orders export, same dates: Created at, Lineitem sku, Lineitem quantity, Total, Discount code, Customer ID, UTM fields if captured.
- Gross profit per purchase for each product advertised (from `store-meta-math`).
- Brand files from `store-meta-brand-dna`, the target product, and how many new ads the owner wants.

**Optional**

- Production cost per ad by type (designer hours, creator fees, tool costs).
- TikTok or Pinterest exports with the same columns.

**When something is missing.** No gross profit: rank on cost per purchase against break-even only and label it. No new-customer breakdown: exclude ad sets aimed at existing customers and say so. No ad files: ask once; the style cannot be read from names.

**Access.** Read only. Writing the style profile into the brand files needs the owner's approval. Uploading new ads as paused drafts needs draft access and a yes; launching needs a separate yes.

## Before you start: the gates

1. **Gross profit per purchase known** for every product in the winners and for the target product. Fail: label rankings as cost-per-purchase only; do not build for a target product without it.
2. **Cash and stock.** The new ads' test spend (3 times target cost per purchase each [ADC-0039]) fits the test budget, and the target product has stock for the push; how hard to push depends on inventory and cash [ADC-0012]. Fail: cut the count or pick another product.
3. **Tracking trustworthy enough to name winners.** Meta purchases within about 20% of Shopify orders for the same dates and products (practitioner default, test it), or `store-meta-capi` passed. Fail: name winners from store orders by UTM or discount code only, or stop.
4. **Enough winners.** At least 3 ads qualify in step 1. Fail: there is no reliable winning style yet; send the owner to `proven-static-formats` or `store-meta-concepts` to test first.

## Steps

### 1. Pick winners by profit

1. Use 7-day click results, not view-through, which can inflate reported returns [MEA-0042].
2. An ad qualifies only after spending at least 3 times target cost per purchase [ADC-0039].
3. Judge on new customers. A top ad can look strong overall and much weaker on new customers once existing buyers are split out [ADC-0024]. Use the breakdown, or drop retargeting and existing-customer ad sets.
4. Gross profit per ad = new-customer purchases x gross profit per purchase - spend - production cost [MCR-0023]. Rank by it.
5. Where ads share an ad set, read the ad set too; ad-level credit is less reliable [ADC-0059]. Where the incremental column exists and spend is high enough, prefer ads that hold up there [ADC-0006].
6. Mark results from heavy sale periods; product discounts distort which creative looks best then [MCR-0068].
7. Check the top ads' purchases against Shopify orders for those SKUs and dates.

Winners: the top 3 to 12 by gross profit per ad with positive profit. Contrast set: ads with enough spend that missed target.

### 2. Tag both sets on the same fields

For every winner and contrast ad, record: format, layout family, photo style, setting, who appears, product role and size, palette, type style, headline pattern and length, proof device, offer shown, awareness stage, concept (buyer group, angle, offer). Use fixed tags so they compare [MCR-0051].

### 3. Write the style profile

For each trait, count how many winners and how many losers have it.

- **Winning trait:** in most winners and few losers.
- **House trait:** in both; part of the brand look, not a reason for winning.
- **Losing trait:** in most losers and few winners.

Write `visual-style-profile.md`: date, source ad IDs and their gross profit per ad, then winning traits (with counts), house traits, losing traits, and open questions where the sample is too small. A trait seen in only one or two ads is a hunch, not a rule.

**Gate:** the owner reads and approves the profile. Then save it to the brand files with the date.

### 4. Plan the new ads

Count first: new ads = the owner's number or what the test budget can read at 3 times target cost per purchase each, whichever is lower.

Split the plan (where the store has proven winners) [MCR-0042]:
- about half to 60%: remakes of winning ideas with a real change (new setting, new person, new proof);
- 20 to 30%: near-misses fixed;
- 20 to 30%: net-new concepts, never zero.

Rules:
- Put new formats and styles on ideas that already won before inventing new ideas [MCR-0052].
- A remake must change something big: concept, format, setting or person. A new colour or pose is not a new ad [MCR-0022]; near-copies share one delivery entity [MCR-0078].
- Every new ad keeps the winning traits and avoids the losing ones; say which trait each ad tests.
- Target product: only if it is in stock beyond its reorder lead time [ADC-0023].

Per concept: ID, idea, winning traits kept, what changes, product, gross profit per purchase, target cost per purchase, proof row, landing page.

**Gate:** the owner approves the concept plan.

### 5. Build the statics

Build each with `layered-static-production` (real type over a clean base) or `proven-static-formats` (one fast format), using the real product photo and real proof. Build 4:5 and 9:16 as separate layouts. Run every file through `prelaunch-ad-check`.

### 6. Read and update

After launch (owner's yes only), read each new ad at 3 times target cost per purchase, on new-customer store-side purchases. Note which winning traits held and which did not. Update the profile every quarter or after about 20 new ads, keeping the old version.

## Checks before you hand it over

1. Every winner spent at least 3 times target cost per purchase and was ranked by gross profit per ad on new customers.
2. The top winners' purchases were checked against Shopify orders.
3. The profile separates winning, house and losing traits, with counts from both sets.
4. The profile was approved by the owner before it was saved.
5. The number of new ads fits the test budget.
6. Every new ad changes a big element from its source; none is a colour or pose swap.
7. The target product is in stock beyond its reorder lead time.
8. Every file passed `prelaunch-ad-check`; nothing was launched without a yes.

## Output

1. **One-screen summary:** how many winners, the three traits that set them apart, the new ads planned, test spend, read date.
2. **Winners table:** ad ID, name, spend, new-customer purchases, cost per purchase, gross profit per purchase, production cost, gross profit per ad, store-side check (pass or fail).
3. **Trait table:** trait, winners with it, losers with it, label (winning, house, losing).
4. **`visual-style-profile.md`** saved to the brand files.
5. **Concept plan table:** concept ID, bucket (remake, fix, new), source ad, traits kept, what changes, product, target cost per purchase, proof row.
6. **The new statics** at 1080 x 1350 and 1080 x 1920 with their pre-launch verdicts.

## Common mistakes

- **Winners picked from memory or ROAS alone.** Step 1 ranks by gross profit per ad on new customers.
- **Retargeting ads counted as winners.** Step 1 splits out existing customers.
- **A profile that just describes the brand.** Step 3 compares winners with losers.
- **Copies that add no reach.** Step 4 requires a big change.
- **More ads than the budget can read.** Step 4 counts from the test budget.
- **Pushing a product about to sell out.** Gate 2 and step 4 check stock.
- **Black Friday winners treated as evergreen.** Step 1 marks sale periods.

## Sources

- [ADC-0039]: judge after 3 times target cost per purchase.
- [ADC-0012]: push a winner by inventory and cash.
- [MEA-0042]: report on 7-day click; view-through inflates returns.
- [ADC-0024]: a top ad's return can fall sharply on new customers.
- [MCR-0023]: compare on gross profit per ad, including production cost.
- [ADC-0059]: judge creative at ad set level.
- [ADC-0006]: pick ads to iterate from the incremental column.
- [MCR-0068]: sale periods corrupt creative analysis.
- [MCR-0051]: tag every ad on the same fields.
- [MCR-0042]: split effort between remakes, fixes and new concepts.
- [MCR-0052]: apply new formats to ideas that already won.
- [MCR-0022]: a colour or pose change is not a new ad.
- [MCR-0078]: near-duplicates share one delivery entity.
- [ADC-0023]: tie ads to stock against reorder time.

What makes this skill ours: winners chosen by gross profit per ad on new customers with a Shopify check, not from memory; a style profile built by comparing winners with losers, so it holds only traits that earn; a plan sized by the test budget and split into remakes, fixes and new ideas; a stock gate on the target product.
