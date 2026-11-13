---
name: seasonal-gifting-creative-plan
description: "A creative plan for one gifting season (Diwali, Raksha Bandhan, Black Friday, Christmas, Valentine's Day or Mother's Day): the ad concepts for each phase, the full asset list by channel and size, and every deadline worked back from the real last day to order for on-time delivery. Sets the cutoff from courier lanes and packing capacity, checks gifting stock and the offer's break-even, writes concepts for the giver rather than the user, switches messages after the cutoff to options that still arrive, and dates every brief, asset and go-live. Use six to ten weeks before a gifting date, or when last season's ads promised delivery the store could not keep."
---

# Gifting season creative plan

**You get:** one season plan with the real order cutoff date, four phases of ad concepts (early, peak, last days, after the cutoff), an asset list by channel and size, and a deadline sheet with every brief, asset and go-live date worked back from that cutoff.

## When to use

- A gifting date is 6 to 10 weeks away and nothing is planned.
- Last season's ads kept promising delivery after the store could no longer deliver in time.
- The store has products people buy for others and wants a gifting push beyond a discount.
- Peak season creative is being made late and rushed every year.

## Not for

- Which sales to run across the year: use `plan-yearly-sale-calendar`.
- Running the sale week's budget and bids: use `plan-peak-sale-week`.
- Gifting ad copy lines: use `write-gifting-ad-copy` after this plan.
- The gift guide page: use `build-gift-guide-page`.

## What you need

Required:

1. **The season and gift date** (festival dates move each year; check the official calendar for this year).
2. **Delivery times by zone** from the courier or 3PL: pickup to delivery days for the slowest lane the store sells to, and any published peak cutoffs (US carriers publish holiday deadlines; Indian couriers announce pre-festival slowdowns).
3. **Packing capacity**: orders a day the team or 3PL can pack at peak.
4. **Stock by SKU** and inbound dates (Shopify inventory export, supplier dates).
5. **Gross profit per purchase** for gifting SKUs and bundles (`store-meta-math`), and the planned offer.
6. **Last season's results** if any: orders by day, late deliveries, top gifting products.

Optional: gift wrap and message card options, e-gift card availability, local pickup or same-day options, the brand's visual identity sheet.

If courier times are unknown, ask the courier or use the slowest time in the last 60 days of orders (Shopify fulfilment and delivery dates). This plan needs no account access. Building ads and emails needs draft access; launching, spending and messaging customers need the client's yes.

## Before you start: the gates

1. **Cutoff can be met.** Pass when packing capacity at the expected peak covers orders until the cutoff. Fail: move the cutoff earlier or cap the push; a missed gift is worse than a lost sale. Pick-up promises from warehouses have slipped from 1 or 2 days to a week at peak [OPS-0015].
2. **Stock and documents.** Gifting SKUs have cover through the season, and any imported stock has its paperwork done well before the peak; one brand lost its peak when stock was held for a missing document [OPS-0001]. Fail: drop the SKU from the plan. If stock would run out before December, selling it out early can hurt the rest of the season; one brand pulled peak email and SMS for that reason [OPS-0019].
3. **Offer pays.** Break-even is recomputed for each discount depth before the season [OFF-0069]. Fail: send to `how-deep-can-we-discount`.
4. **Cash** covers the extra stock, ad spend and packing labour until the money comes in.

## Steps

### 1. Work out the real last order date

Last order date = gift date minus slowest common delivery days minus packing days at peak minus a buffer of 1 to 2 days (practitioner default, test it). Write a separate date for each zone if they differ a lot (metro and rest of India; US ground and express). Show a specific arrival date on ads and the product page where the store can keep it; a clear date lifts conversion, but only if it is usually beaten [CXP-0010].

### 2. Split the season into four phases

| Phase | When | Job |
|---|---|---|
| Early | 4 to 6 weeks before cutoff | discovery: gift ideas by recipient and budget |
| Peak | 1 to 3 weeks before cutoff | the offer and the reason to buy now |
| Last days | final 3 to 5 days to cutoff | real "order by" deadline |
| After cutoff | cutoff to gift date | options that still arrive: e-gift card, express, local pickup, "the gift is on its way" card |

Many brands also add a fifth phase for self-gifting after the date. After Christmas, 16 to 31 December is a cheaper auction for a short offer if stock remains [ADC-0043].

### 3. Write concepts for the giver

The buyer is the giver, not the user. Concepts per phase:

- **Recipient** ("for a mother who never buys herself anything"); products that suit "for me or for you" do best here [PRD-0013].
- **Budget band** (under 1,000 rupees, under 50 dollars).
- **Ease**: gift wrap, a message card, delivery to another city, returns for the recipient.
- **The moment**: the giver opening the box with the recipient, the call home on Raksha Bandhan.
- **Deadline**: the real order-by date for that zone.

A gift with purchase can lift contribution per order when the gift costs little and is valued highly [OFF-0007]. Build an offer ladder in advance if the store might react during the peak [OFF-0068]. Keep evergreen ads running through a big sale and add offer-badged copies rather than replacing everything [MCR-0069]. Owning one cultural date each quarter can lift demand beyond the big sale days [EML-0055].

India note: Raksha Bandhan and Diwali gifts often ship to another city; lead with delivery to that city. Push prepaid for gifts: a COD parcel the recipient did not expect is often refused, which adds return-to-origin cost. Corporate Diwali orders need GST invoices; hand those to `corporate-gifting-sales-pitch`.

US note: Black Friday buyers are often self-gifting; Christmas buyers need carrier deadlines; Valentine's and Mother's Day are short, so express shipping matters.

### 4. Build the asset list

For every concept: ad sizes (9:16, 4:5, 1:1), video length, the site banner and gift guide tile, the email header, a WhatsApp or SMS image, and the "order by" badge with the date. Make the after-cutoff versions now, not on the day. Resizing goes to `resize-ads-for-every-placement`.

### 5. Date everything backwards

From each phase's go-live: assets due 5 working days before, briefs due 10 working days before that, shoots 3 to 4 weeks before go-live (practitioner defaults, adjust to the team). Add ad review time before go-live.

### 6. Plan the readout

Sale weeks bend ad-level results toward whichever product was discounted; read creative at ad-set level and on click signals during the peak [MCR-0068]. Customers won in peak weeks may repeat less than those won at other times, so set a separate acquisition cost allowance for them [MEA-0035].

## Checks before you hand it over

- The last order date is calculated from slowest lane, peak packing and a buffer, per zone.
- Packing capacity covers forecast orders up to the cutoff.
- No ad or message promises arrival after the store can deliver.
- Every phase has concepts, including after-cutoff options that still arrive.
- Concepts speak to the giver: recipient, budget, ease, moment or deadline.
- The offer's break-even is computed for each depth.
- Every asset has a size, channel, owner and due date.
- India plans push prepaid for gifts; corporate orders are handed off.

## Output

**One-screen summary:** gift date, last order date per zone, the four phases with go-live dates, the hero concept per phase, the offer and its break-even, and the top risk (stock, packing or courier).

**Concept table:** Phase, Concept, Recipient or budget band, Product or bundle, Offer, Hook, Proof, Order-by line, Format, Gross profit per purchase.

**Asset list:** Asset ID, Concept, Channel (Meta, Google, email, site, WhatsApp, SMS), Size or ratio, Length, Copy line, Owner, Due date, Status.

**Deadline sheet:** Phase, Brief due, Shoot date, Assets due, Ad review, Go-live, Switch-off, Readout date.

**Assumptions:** courier cut-off dates, packing staff and the offer, where not given, as the value used and what moves if it differs, one line each, at most three.

## Common mistakes

- **Promising delivery the store cannot keep.** Step 1 sets the cutoff from the slowest lane and peak packing.
- **Nothing to sell after the cutoff.** Step 2 plans that phase in advance.
- **Ads aimed at the user, not the giver.** Step 3 writes for the giver.
- **Assets made the week they run.** Step 5 dates every brief and asset backwards.
- **COD gifts that get refused.** Step 3 pushes prepaid for gifts in India.
- **Judging creative on sale-week returns.** Step 6 reads at ad-set level.

## Sources

- ADC-0043: 16 to 31 December is a cheaper auction.
- CXP-0010: a specific delivery date lifts conversion if kept.
- EML-0055: own a cultural date each quarter.
- MCR-0068: sale weeks distort ad-level results.
- MCR-0069: keep evergreen ads through a sale and add offer copies.
- MEA-0035: peak-season customers may repeat less.
- OFF-0007: low-cost, high-value gifts with purchase.
- OFF-0068: pre-build the offer ladder.
- OFF-0069: recompute break-even for each discount depth.
- OPS-0001: missing import paperwork can lose the peak.
- OPS-0015: peak pick times slip.
- OPS-0019: selling out early can hurt the rest of the season.
- PRD-0013: "for me or for you" gifting demand.

What makes this skill ours: the plan is worked back from a last order date built on the store's slowest courier lane and real peak packing, not a calendar date; after-cutoff creative is made in advance so the store keeps selling things that still arrive; concepts speak to the giver; and India gifting pushes prepaid to avoid refused COD parcels, with corporate GST orders handed to their own skill.
