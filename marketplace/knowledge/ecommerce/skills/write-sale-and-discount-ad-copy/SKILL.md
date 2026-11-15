---
name: write-sale-and-discount-ad-copy
description: "Writes sale and discount ad copy that sells the product first and the deal second: three sale versions for Meta, Google and TikTok with the exact offer terms, the real end date and time, and a true reason for the sale, plus a full no-discount version that sells on value, a gift, a bundle or a guarantee instead. Checks the discount's break-even cost before writing, uses only genuine former prices, bans fake countdowns and stock claims, and includes the swap plan for when the sale ends. Use before any sale, festival offer, launch discount or clearance, or when sale ads keep training buyers to wait for the next code."
---

# Sale ad copy that does not cheapen the brand

**You get:** three sale copy sets (each with primary text, headline, description, on-screen text and a Google headline pack) carrying the exact terms, end date and reason, one no-discount copy set built on value, a terms box to paste into every ad and page, and a dated swap plan that pauses sale ads when the sale ends.

## When to use

- A sale, festival offer, anniversary, launch discount or clearance is planned.
- Sale ads read as "XX% OFF EVERYTHING" and the brand looks cheap.
- Buyers wait for codes, and full-price weeks are getting weaker.
- The team needs a version to run alongside the sale for buyers who do not need a discount.

## Not for

- Deciding how deep the discount can go: use `how-deep-can-we-discount` first.
- Designing bundles, thresholds or gifts: use `offer-bundle-threshold-design` or `gift-with-purchase-offer`.
- Sale banners for site, email and ads: use `design-sale-banners-and-hero`.
- Sale emails: use `write-sale-countdown-emails`.

## What you need

Required:

1. **The offer, decided:** depth, products included and excluded, minimum order, code or automatic, start and end date and time with time zone, stacking rules.
2. **Break-even numbers** for the offer from `store-meta-math` or `how-deep-can-we-discount`.
3. **Price history** for each product on sale: the regular price and how long it has been charged (Shopify product export with Variant Price and Variant Compare At Price, plus the store's price change log or past order prices).
4. **The reason for the sale:** season end, anniversary, festival, overstock, launch.
5. **Stock per SKU** for the sale window.

Optional: last sale's results by ad, discount cohort repeat rates, the store's best non-sale ads.

Writing is read-only. Loading ads and scheduling them needs draft access; the client approves every ad and the end-time swap.

## Before you start: the gates

1. **The discount pays.** A discount eats gross margin, not revenue: a 30% cut on a 40% margin order can move break-even ROAS from 2.5 to about 7 [OFF-0065]; required ROAS rises steeply with depth [OFF-0069]. Pass when the break-even ROAS for this offer is known and the client accepts it. Fail: stop; send back to `how-deep-can-we-discount`.
2. **Genuine reference price.** A "was" or compare-at price must be a price the store really charged, openly and for a reasonable recent time; a price raised just to be cut is fictitious [OFF-6145]. Fail: drop the "was" price and state the cut as money or percent off today's price.
3. **Real end and real stock.** The end date will be kept. Any "limited stock" line needs stock records that prove it; keep the stock level from when the message ran, since regulators in the US, UK, EU and elsewhere can ask the advertiser to show it. Fail: no urgency lines beyond the true end date.
4. **Stock covers the window.** If a hero SKU sells out on day one, ads keep spending on a dead offer. Fail: cap the offer or drop that SKU from the ads.

## Steps

### 1. Write the terms box first

One short block every ad, page and email will copy word for word:

- what: "20% off all linen shirts" (name the range, list exclusions);
- how: "Code BFCM20 at checkout" or "Price already reduced";
- when: "Ends 1 Dec, 11:59 pm GMT" (always name the time zone);
- conditions: minimum order, one per customer, not with other codes;
- UK, EU and Australia: prices shown include VAT or the local sales tax; US: tax as on the page.

If the ad says "free", the buyer must pay nothing beyond delivery, and any delivery charge must be stated [ADC-6146].

### 2. Write the reason line

A sale with a reason reads as an event; a sale without one reads as the normal price. Write one true line: "Our 5th birthday", "End of summer stock", "Black Friday week". Never invent a reason ("warehouse fire").

### 3. Frame the number

- Show whichever is bigger to the buyer: money saved or percent off [OFF-0017]. "Save $60" beats "15% off" on a $400 item (in the store's currency).
- For multi-unit offers, prefer "Buy 2, get 1 free" or cost per day over percentage maths [OFF-0017].
- Small 5 to 10% codes usually lose profit because buyers do not buy more units [OFF-0014]. If the offer is that small, flag it before writing.

### 4. Write three sale versions

Each version leads with something different, and the deal is never the only idea:

| Version | Lead | Use for |
|---|---|---|
| A. Product first | The product's best proven benefit, then the offer and terms | Cold buyers who do not know the store |
| B. Offer first | The saving and end date in the first line, product proof second | Warm buyers, past visitors, email list lookalikes |
| C. Reason first | The event ("5 years of...") then product, then offer | Brand-led stores, loyal buyers |

Keep evergreen winners running and add offer-badged copies of them rather than replacing them; offer creative can take far more spend during peak sales [MCR-0069].

Rules for every version:

- the same terms box, unchanged;
- no ALL CAPS, no "!!!", no "LOWEST PRICE EVER" unless the price history proves it;
- no countdown that resets, no "only 3 left" without stock proof;
- "Last day" copy only on the real last day, scheduled to start that morning.

### 5. Write the no-discount version

Write a full copy set that sells without any price cut, to run beside the sale for buyers who were going to buy anyway, and after it. Pick one lever the store can afford:

- value: what the product does, proof, reviews;
- a gift with purchase whose cost is below the margin it protects [OFF-0007];
- a bundle or threshold from `offer-bundle-threshold-design`;
- the guarantee or returns promise.

Customers acquired on deep discounts had worse lifetime value at many brands [CXP-0016]; this version protects that.

### 6. Fit each platform

- **Meta:** primary text first line carries the lead; headline carries the offer or product; description carries the end date.
- **Google Search:** 3 offer headlines of 30 characters or fewer ("20% Off Linen Shirts", "Sale Ends 1 Dec") for `write-google-responsive-search-ads`, plus one description with the terms.
- **TikTok and Reels:** one spoken line for the offer, on-screen text with the end date.
- Character counts shown for each.

### 7. Plan the end

Write the swap plan: at the exact end time, sale ads pause and the no-discount version and evergreen ads continue. Name who switches what, or set the platform end date on each sale ad. In the US, UK, EU and most other markets, a sale ad still live after the end misleads buyers if the price is gone.

### 8. Plan the read

Sale results distort ad analysis: ad ROAS mostly shows which product was discounted, so judge at ad set level and lean on CTR and CPC during the sale [MCR-0068]. Afterwards compare gross profit per order and new-customer repeat at 60 days between sale and no-discount buyers.

## Checks before you hand it over

- The break-even ROAS for the offer is stated and approved.
- Every ad carries the identical terms box: what, how, end date and time with time zone, conditions.
- Any "was" price matches the store's real price history.
- No urgency or scarcity line without proof; no resetting timers.
- Three sale versions with different leads, and one full no-discount version.
- Copy for tax-inclusive markets says prices include VAT or the local sales tax; "free" lines meet the delivery-charge rule.
- The swap plan pauses every sale ad at the end time.
- Nothing published or scheduled without the client's yes.

## Output

**1. One-screen summary:** offer, reason, break-even ROAS, versions and where each runs, end time and swap owner.

**2. Terms box** (paste-ready).

**3. Copy sheet:**

| Version | Platform | Field | Text | Characters | Lead | Terms box included (Y/N) | Start | End |
|---|---|---|---|---|---|---|---|---|

**4. No-discount set**, same columns.

**5. Swap plan:** ad name, action at end (pause or edit), time, owner.

## Common mistakes

- **Writing copy before the discount is costed.** Gate 1.
- **Inflated "was" prices.** Gate 2 checks real history.
- **"Ends tonight" every night.** Step 4 and step 7 tie urgency to the real end.
- **Percent shown when money saved is bigger.** Step 3.
- **Only discount copy in the account.** Step 5 writes the no-discount version.
- **Sale ads left live after the end.** Step 7's swap plan.

## Sources

- OFF-0065, OFF-0069: discounts raise break-even ROAS steeply.
- OFF-0014: small codes rarely add units.
- OFF-0017: show the bigger of money or percent.
- OFF-0007: gift with purchase can protect margin.
- OFF-6145: genuine former prices only.
- MCR-0069: offer-badged copies of evergreen ads absorb peak spend.
- MCR-0068: sale periods distort ad-level analysis.
- CXP-0016: discount-acquired cohorts repeat less.

What makes this skill ours: copy is only written after the discount's break-even ROAS is known; one terms box keeps every ad identical on end time, exclusions and tax; every "was" price is checked against the store's real price history; and a no-discount version and an end-time swap plan are part of the deliverable, not an afterthought.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Points to keep:
- The advertiser must be able to show the stock level when a "limited stock" message ran [ADC-6147].
- Prices shown include GST [ADC-6147]. Terms example: "20% off all cotton kurtas", "Code DIWALI20 at checkout", "Ends 2 Nov, 11:59 pm IST".
- "Diwali week" is a true reason line when the sale runs then.
- A sale ad still live after the end is bait and switch if the price is gone [ADC-6147].
- ADC-6146: "free" and buy-one-get-one rules in India.
- ADC-6147: false urgency, drip pricing and bait and switch in India.
