---
name: build-gift-guide-page
description: "Builds a gift guide page for one gifting moment, organised by recipient and by budget: a short intro, 4 to 8 recipient sections with 3 to 6 picks each, a budget filter in real price bands, copy for every pick written for the giver, gift extras (wrap, note, gift receipt), and delivery cutoff dates by region calculated from the store's own dispatch and courier data. Picks are gated on stock and gross profit, and every cutoff has a buffer the store can keep. Use before Diwali, Raksha Bandhan, Christmas, Black Friday, Valentine's or Mother's Day, or for an evergreen gifting page."
---

# Gift guide page

**You get:** one gift guide page written in full (intro, recipient sections, budget bands, 20 to 40 product picks with giver-focused copy, gift options, a delivery cutoff table by region and shipping method), plus a pick sheet with stock and profit for each item, ready for the client's approval and the theme or page builder.

## When to use

- A gifting season is 4 to 8 weeks away.
- Reviews and orders show many purchases are gifts (gift notes, different billing and shipping names).
- The store wants a page to send gifting ads, emails and influencer links to.
- Shoppers ask "what should I get for my dad" in chat.

## Not for

- The ads, assets and dates for a gifting season: `seasonal-gifting-creative-plan`.
- Gift ad copy: `write-gifting-ad-copy`.
- Business and employee gifting orders: `corporate-gifting-sales-pitch`.
- Getting into other publications' gift guides: `pitch-store-to-press-and-gift-guides`.
- A free gift with purchase offer: `gift-with-purchase-offer`.

## What you need

Required (read access, level 1):

1. **Shopify products export** with price, compare-at price, inventory by variant and product type.
2. **Gross profit per order** by product (`build-sku-profit-sheet`).
3. **Last year's gifting-season orders** (same weeks): product, units, order date, gift note used or not, billing versus shipping name.
4. **Dispatch and delivery data, last 90 days**: order date, dispatch date, delivery date, courier, destination region or pincode zone, shipping method. From the shipping app or courier aggregator export.
5. **Stock plan**: what is on hand and what arrives before the season, with dates.

Optional: gift wrap and note costs, reviews that mention gifting, last year's gift guide results.

If delivery data is missing, do not publish cutoff dates; publish "order by" dates only after the store sends a sample of real delivery times. Page building needs draft access (level 2); going live and any paid wrap or delivery upgrade need the client's yes.

## Before you start: the gates

1. **Stock for the season.** Each pick has enough units to cover last season's gift-week sales plus 20% (practitioner default, test it), or an inbound date before the guide launches. Fail: drop or replace the pick.
2. **Every pick earns money.** Gross profit per order is positive after shipping, wrap and any gift extra. Fail: drop it or raise its bundle price.
3. **Cutoffs are real.** Every "order by" date comes from the store's measured dispatch and transit times. In the US a stated or implied ship time needs a reasonable basis, and delays require a notice with a free cancel option [CXP-6160]. Fail: no date; write "Order early, delivery times vary" and fix the data.
4. **Peak capacity.** The team or 3PL can dispatch the expected peak daily orders within the stated processing time. Fail: lower the promise.

## Steps

1. **Choose the recipients.** From last year's gift orders, notes and reviews, list who people buy for (partner, mother, father, sibling, friend, colleague, new parent, host). Keep 4 to 8 groups with real demand. For India add festival-specific groups (brother for Raksha Bandhan, family hampers for Diwali).
2. **Set the budget bands.** Base bands on the store's real price spread and common gift amounts: for example under 500, 500 to 1,000, 1,000 to 2,500, over 2,500 rupees, or under $25, $25 to $50, $50 to $100, over $100. Every band needs at least 3 picks.
3. **Pick the products.** For each recipient, 3 to 6 picks across bands. Prefer products that ship well and suit giving (looks good unwrapped, no sizing risk, or with an easy exchange) [PRD-0013]. Add one ready bundle per main recipient if the shipping saving funds it. Record stock, profit and why it fits.
4. **Write pick copy for the giver.** One headline line about the recipient's reaction or use ("For the dad who grills every Sunday"), one line about what it is, price, and a gift cue (arrives wrapped, easy exchange, includes a note). The giver is not the user, so write about why the recipient will like it and why it is safe to give. Use a real review that mentions gifting when one exists.
5. **Write the intro.** Two or three sentences: who the guide helps, how it is organised, and the first cutoff date. Then a jump bar of recipient and budget links.
6. **Calculate cutoffs.** For each region or zone and shipping method: cutoff = last delivery date wanted minus (processing days at peak + transit days at the 90th percentile from the store's data + 1 to 2 buffer days). Use the 90th percentile, not the average, so most orders arrive. Showing a specific delivery date instead of a vague range can lift conversion, but only when the estimate is padded and usually met [CXP-0010]. Add courier holidays and peak delays. In India set zones by metro, tier 2 and remote pincodes, and note COD and prepaid cutoffs separately if they differ.
7. **Write gift extras.** Gift wrap (price or free), gift note (character limit), gift receipt or price-free invoice, ship to a different address, and exchange window after the festival. A gift worth listing for sale has a real value [OFF-0007]; only offer extras the warehouse can do at peak.
8. **Plan the after-cutoff path.** When cutoffs pass: switch to e-gift cards, express shipping where real, or "arrives after" wording. Prepare the delay message with the cancel option before the peak (`delay-and-stockout-customer-messages`).
9. **Write the search title.** "[Recipient] gift ideas under [amount]" style titles and sub-collections for searched gift terms help the page rank [SEO-0012]; keep it on the main domain.
10. **Plan the stock watch.** During the season, check picks daily; replace any sold-out pick within one day. Hold a ready replacement for each section. Pre-build any sale ladder rung linked to the guide in advance [OFF-0068].
11. **India and US notes.** India: GST-inclusive prices, COD availability per pick, Hindi or regional festival greetings only if the brand voice uses them, and avoid promising delivery to remote pincodes in festival weeks without data. US: holiday cutoffs per carrier and method, and a clear note when the last ground date has passed.

## Checks before you hand it over

- Every recipient group comes from real gift orders or notes, not guesses.
- Every pick passes stock and profit gates, with a replacement named.
- Every budget band has at least 3 picks.
- Every cutoff date shows its formula inputs and uses the 90th percentile transit time plus buffer.
- Gift extras are confirmed with the warehouse for peak volume.
- Pick copy is written to the giver, with a gift cue.
- The after-cutoff path and delay message exist before launch.

## Output

**Summary (one screen):** the season, recipients and bands, number of picks, the earliest and latest cutoff dates, stock risks, and the expected peak daily orders versus capacity.

**Page copy:** title, intro, jump bar, sections by recipient (heading, short intro, picks), gift extras block, cutoff table, FAQ (wrap, notes, exchanges, delivery).

**Pick sheet:**

| Recipient | Band | Product | Pick copy (headline, line, gift cue) | Price | Gross profit per order | Units on hand | Season need | Replacement |
|---|---|---|---|---|---|---|---|---|

**Cutoff table:**

| Region or zone | Method | Processing days at peak | Transit p90 days | Buffer | Order by | Payment note (COD or prepaid) |
|---|---|---|---|---|---|---|

**To confirm:** extras pricing, capacity sign-off, any pick needing approval.

## Common mistakes

- **Cutoffs from the courier's brochure.** Step 6 uses the store's own 90th percentile transit time.
- **Picks that sell out in week one.** Gate 1 and step 10 check stock and name replacements.
- **Copy written to the user.** Step 4 writes to the giver.
- **Budget bands with one product.** Step 2 requires 3 picks per band.
- **No plan after the last date.** Step 8 switches to gift cards and honest wording.
- **Loss-making gift extras.** Gate 2 counts wrap and extras in profit.

## Sources

- CXP-6160: US ship-time claims need a reasonable basis; delay notices and cancel option.
- PRD-0013: screen for parcel-friendly packaging and gifting demand.
- CXP-0010: specific, padded delivery dates lift conversion when met.
- OFF-0007: gifts with real listed value.
- SEO-0012: sub-collections for searched variants.
- OFF-0068: pre-build sale ladders and pages before peak.

What makes this skill ours: delivery cutoffs come from the store's own 90th percentile dispatch and transit data with a buffer, not courier promises; every pick is gated on season stock and profit after wrap; recipients come from real gift orders; and India's festival calendar, zones and COD cutoffs are built in.
