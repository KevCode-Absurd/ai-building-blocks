---
name: competitor-product-teardown
description: "A teardown of one rival product the store competes with: its real delivered price, offer and bundle maths, what it promises, its page and proof, what its reviews praise and complain about (counted, with quotes), its weak spots, and a short plan for how the store beats it on product, offer, buyer or message, priced against the store's own gross profit. Built from the rival's live page, marketplace listings, reviews, Meta Ad Library and Merchant Center price data, all dated. Use before launching a product against an established rival, when a rival is taking share, or before a price, offer or page change."
---

# Competitor product teardown

**You get:** a one-page teardown of one rival product (price paid at the door, offer, promise, proof, counted review praise and complaints, weak spots) and a ranked plan of 3 to 5 ways the store can beat it, each checked against the store's gross profit and the law on comparisons.

## When to use

- The store is about to launch a product against an established rival.
- One rival keeps appearing in reviews, searches or ads and seems to be taking sales.
- Before changing the store's own price, bundle or product page.
- The owner asks "why do people buy theirs and not ours?"

## Not for

- A map of all rivals' ads across channels: use `cross-channel-competitor-map` or `store-meta-competitor`.
- Ongoing weekly price watching: use `track-competitor-prices`.
- Comparison ads naming the rival: use `comparison-ads-that-stay-legal`.
- Mining the store's own reviews for ad angles: use `mine-ad-angles-from-reviews`.

## What you need

Required:

1. **The rival product:** its product page URL, and marketplace listings (Amazon, Flipkart, Myntra, Nykaa) if it sells there.
2. **The store's matching product** with its gross profit per order, from `build-sku-profit-sheet` or worked out here.
3. **Rival reviews:** at least 50 if they exist, read from the page or marketplace. Read by hand; do not scrape against a site's terms.

Optional: a test purchase of the rival product (strongly advised when the store will compete on quality); Merchant Center account for benchmark prices; screenshots the owner has saved.

Access: read only (level 1). A test purchase is spending money, so it needs the client's yes and budget.

## Before you start: the gates

1. **Own gross profit per order known.** Pass: delivered costs in [MEA-0037]. Fail: compute it first; a plan to beat a rival on price cannot be judged without it.
2. **Same job.** Pass: the rival sells to the same buyer for the same use. Fail: pick a closer rival or say the products do not really compete.
3. **Evidence dated.** Every observation gets a date and a link or screenshot. Prices and offers change weekly.
4. **Comparison law.** Anything the plan says publicly about the rival must be true, clear and provable: US rules allow naming a rival when the comparison is fair [MCR-6020]; India's ASCI code allows it only when what is compared is clear, fairly chosen and provable [MCR-6024].

## Steps

### 1. Capture the product and offer

Record on one date:

- List price, sale price, any "was" price, and how long the sale has run. A "was" price counts only if the item was really sold at it [OFF-6145].
- **Delivered price:** add shipping, COD fee, platform fee, GST or sales tax shown at checkout. Go to checkout without paying to see it.
- Bundles, subscriptions, gifts, thresholds, guarantee and return terms, delivery promise.
- Merchant Center benchmark price for the same GTIN, if both sell a shared product [PRD-6482].

Work out the rival's price per unit or per use for each pack size, so offers compare like for like.

### 2. Capture the promise and the proof

- Headline promise, the top three benefits, any mechanism ("why it works") and the main claims.
- Proof shown: review count and rating, photos, certificates, press, guarantees, creators.
- Page structure on mobile: what appears before the add-to-cart button.
- Ads running now in the Meta Ad Library; it shows only live ads for ordinary advertisers, so date every capture [PRD-6483]. A long-running ad hints at what works but is not proof of profit.

### 3. Read and count the reviews

Read reviews by hand and paste exact phrases; automatic summaries lose the words buyers use [AVT-0007]. Code each usable review once:

| Code | Example of what to note |
|---|---|
| Praise: result | what it did for them |
| Praise: feature | material, taste, fit, ease |
| Complaint: product | broke, wrong size, smell |
| Complaint: service | late, refund trouble, COD hassle |
| Failed before | other products they tried first [AVT-0009] |
| Who they are | "as a nurse", "for my mother" [AVT-0016] |

Count each code against the total of usable reviews. Read 3-star reviews closely: when they pull in opposite directions (too simple, too complex), do not chase either; keep the core simple and offer depth separately [AVT-0008]. On Indian marketplaces, read reviews in Hindi and other languages too, and note delivery and COD complaints separately from product faults.

### 4. If possible, buy and test it

Unboxing, packaging, time to dispatch, delivery time, what is in the box, quality against the claims, how support answers one question. Photograph everything. This is the only way to check claims the page makes.

### 5. Find the weak spots

List weak spots only where evidence supports them: a complaint at 10% or more of usable reviews (practitioner default, test it), a claim the test purchase did not bear out, a buyer group the rival ignores, or an offer gap. For each, note how many reviews or which capture shows it.

### 6. Plan how to beat it

For each weak spot, write one move in one of four lanes:

1. **Product.** Change one big thing the buyer will notice, not three at once; too many changes make a product feel too new to trust [PRD-0002].
2. **Buyer.** If the products are about the same, win a buyer group the rival is not serving rather than inventing a mechanism the product cannot back [AVT-0014].
3. **Offer.** A better bundle, guarantee or delivery promise. Price each with the store's gross profit; a rival with better margins or repeat can outbid the store in ad auctions even with weaker ads, so a price war is the last resort [ADC-0057].
4. **Message.** Answer the rival's top complaint on the store's page, in the store's own words, without naming the rival unless the comparison passes gate 4.

Rank moves by gross profit effect, evidence strength and effort. Name the first move and the runner-up.

### 7. India and US notes

- India: compare COD fee, prepaid discount, delivery days to tier 2 and 3 pincodes, and the return or replacement window; these often decide the sale more than price.
- US: compare free-shipping thresholds, return windows and any subscription terms; check whether the rival's sale price is genuine before matching it.

## Checks before you hand it over

- Every price, offer and claim has a date and a link or screenshot.
- The delivered price includes shipping, fees and taxes shown at checkout.
- Review themes are counted against usable reviews, with at least one exact quote each.
- Weak spots rest on counted evidence or a test purchase, not opinion.
- Each move shows its effect on the store's gross profit per order.
- No plan step copies the rival's words, images or claims.
- Any public comparison passes the US or India comparison rule.

## Output

**One-screen summary:** the rival's delivered price against the store's, their top two strengths, their top two weak spots with counts, the recommended first move and its gross profit effect, and the runner-up.

**Teardown sheet:**

| Area | Rival (date, source) | Store | Gap |
|---|---|---|---|
| List and sale price | | | |
| Delivered price at checkout | | | |
| Price per unit or use | | | |
| Offer and bundles | | | |
| Guarantee and returns | | | |
| Delivery promise | | | |
| Headline promise | | | |
| Proof shown | | | |
| Live ads (count, oldest start date) | | | |

**Review table:** Code, Count, Share of usable reviews, Best quote, Source link.

**Moves table:** Move, Lane (product, buyer, offer, message), Evidence, Gross profit per order effect, Effort, Rank.

## Common mistakes

- **Comparing list prices.** Step 1 compares the price at the door.
- **Taking the rival's claims on trust.** Step 4 tests the product.
- **Counting stars instead of reasons.** Step 3 codes and counts themes.
- **Starting a price war.** Step 6 prices every move against gross profit and treats price cuts last.
- **Inventing a mechanism to look different.** Step 6 moves to an unserved buyer instead.
- **Naming the rival unfairly.** Gate 4 applies the comparison rules.

## Sources

- MEA-0037: delivered gross margin.
- OFF-6145: a "was" price must be genuine.
- PRD-6482: Merchant Center benchmark price per GTIN.
- PRD-6483: Meta Ad Library shows live ads only.
- AVT-0007: read reviews by hand and keep exact words.
- AVT-0008: contradictory 3-star reviews.
- AVT-0009: buyers who failed with other products first.
- AVT-0016: self-identifying phrases mark buyer groups.
- PRD-0002: change one major variable.
- AVT-0014: same product, win an unserved buyer.
- ADC-0057: better unit economics win auctions.
- MCR-6020, MCR-6024: comparison rules in the US and India.

What makes this skill ours: prices are compared at the door, with COD fees and taxes; review themes are counted and quoted rather than summarised; every way to beat the rival is priced against the store's own gross profit; and India's delivery, COD and multilingual reviews are read as their own signals.
