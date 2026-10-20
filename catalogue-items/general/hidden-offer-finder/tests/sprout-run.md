# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 7 of 7 met. Invented facts: 0.

A thorough, honest offer list that quotes every live deal, exposes the discount and Kids-renewal mess with correct arithmetic, and builds nine new offers purely from stock the brand already has, with no invented facts. Minor slips only: L10's Said simply has two numbers, and the closing next-step question was skipped.

## Judge list

- Met: Every live offer is there, in your exact wording.
  L1-L25 cover the bar lines, plan boxes, pop-up, ads, birthday cut, VIP, Buy 2, cashback, referral, HSA/FSA, fitness app, guarantee, shipping, retailer 12-pack.
- Met: Every clash between pages is listed, with the smaller figure in use.
  "Figure used: 49%"; Kids first order "Figure used: $24.99 (53%)"; renewal uses the higher $74.98 "so no buyer is under-told".
- Met: Every price is one of yours, or worked from yours with the sum shown.
  "$49.99 ÷ 28 = $1.785", "$19.97 ÷ 12 = $1.66", "$29.99 vs $66.65 one-time = 55.0% off"; all sums shown and correct.
- Met: The guarantee is quoted in full, with its limits.
  "30-day money-back, 'This policy applies only to your initial purchase.'" plus "Full wording beyond the FAQ line is not on file."
- Met: No more than two new offers are only money off.
  "Money-off proposals in NEW: none new. N5 uses the live $5."
- Met: Every new gift, size or service sits under "must arrange".
  N9 "Must arrange: gift fulfilment on order 3, an end date"; N6 free swap listed under Must arrange; N4 store locator under Must arrange.
- Met: Nothing says "limited time" or "exclusive" without a real end date, and there are no exclamation marks.
  No exclamation marks; "limited" appears only as the product term; N9 urgency marked "ends on [date: MISSING]".

## What went in

```text
[brand file: sprout/brand.md, the products, prices and offers
sections, plus the buyers section]

Prices: Adults 28 packs $66.65 one-time ($2.38/day); subscription
$49.99 every 4 weeks ($1.78/day); $29.99 first order with the text
sign-up discount. 84-pack pouch sold. Big-box retailer 12-pack:
$19.97 Adults, $14.97 Kids. Kids 28 packs $53.32 one-time.
Deals live at once: 49%, 52%, "up to 55%", 55% and 58% (Kids page)
off; ads say 61%. Kids plan box: $22.49, "Renews at $74.98 each 4
weeks". "Buy 2 Save $5". 4 free gifts on a first order in ads
(which gifts changes). VIP: "Save up to $80, get limited flavors,
and VIP access". Subscription: "Pause Or Cancel Any Time".
Guarantee: 30-day money-back, first order only. Ships within 24
hours, arrives in 3 to 5 days on average. New limited flavour every
4 to 8 weeks.
Buyers: the quitter, the gut-fix seeker, the busy parent, the
price doubter.

[attached: sprout/brand.md]
```

## What came out

```text
## LIVE

All prices are as captured late Sept to mid Oct 2026. "Pause Or Cancel Any Time" comes from your brief and is not in the brand file. Lines marked *(summary)* have no exact customer-facing wording on file.

**L1. Announcement bar: "Save 52% + free shipping on your first order"** `live`
- Name: First Order 52%
- Said simply: Your first order is about half off and ships free.
- Terms: First order only. The line shows no base price, no end price and no renewal price. The free-shipping condition is not stated next to it.
- For: price doubter. Stage: knows you already.

**L2. Announcement bar: "Save 55% + Free Shipping"** `live`
- Name: 55% + Free Shipping
- Said simply: More than half off, delivered free.
- Terms: No base, end or renewal price is shown with it. It does not say it is first order only.
- For: price doubter. Stage: knows you already.

**L3. Product page plan box: "MOST POPULAR: GET UP TO 55% OFF"** `live`
- Name: Up To 55% Off
- Said simply: The subscription saves you up to about half.
- Terms: Subscription. Renews at $49.99 every 4 weeks. The "up to" condition is not explained.
- For: price doubter. Stage: knows you already.

**L4. How-it-works plan box: "MOST POPULAR: GET 49% OFF" at $45.33 ($1.62/day)** `live`
- Name: 49% Off Plan
- Said simply: The plan is $45.33 for 4 weeks.
- Terms: $45.33 ÷ 28 = $1.62 a day. The base price behind 49% is not shown, and the renewal price is not stated in the box.
- For: price doubter. Stage: knows you already.

**L5. Kids plan box: "MOST POPULAR: GET 58% WITH FREE SHIPPING" at $22.49, "Renews at $74.98 each 4 weeks"** `live`
- Name: Kids 58% Plan
- Said simply: The first kids pouch is $22.49 and ships free.
- Terms: $22.49 first order, then $74.98 every 4 weeks.
- For: busy parent. Stage: knows you already.

**L6. Text sign-up pop-up: "Sign Up for 55% Off"** `live`
- Name: Text Sign-Up 55%
- Said simply: Sign up by text and get about half off.
- Terms: New customers only, per the footer: "Offer assumes customer has received and uses promotional SMS discount reserved for new customers only."
- For: price doubter. Stage: knows you already.

**L7. Meta ads: "up to 61% OFF + 4 FREE gifts"** `live`
- Name: 61% + 4 Gifts
- Said simply: Up to 61% off plus 4 free gifts.
- Terms: The gifts are not named and change. No base price is shown. No price on the site matches 61%.
- For: price doubter. Stage: knows you already.

**L8. Ad: "'Sprout is too expensive': here's 61% off to prove otherwise"** `live` (15+ copies)
- Name: Too Expensive? 61% Off
- Said simply: Think it costs too much? Here's 61% off.
- Terms: Same as L7.
- For: price doubter. Stage: knows you already.

**L9. Ad: "21 Vitamins. 4 Free Gifts. 61% Off."** `live`
- Name: Stacked Numbers
- Said simply: 21 vitamins, a stack of free gifts, a big discount.
- Terms: Same as L7.
- For: price doubter. Stage: knows you already.

**L10. Ad main text: "$20 off your first order" and "+$5 off for every extra person"** `live`
- Name: $20 Off First Order
- Said simply: $20 off your first order, plus $5 more for each extra person.
- Terms: First order only. $49.99 − $20 = $29.99, which matches L11.
- For: price doubter, busy parent. Stage: knows you already.

**L11. Birthday price cut: "Same Sprout. New Lower Price. Subs Now Start at $29.99." / "Not just for a week but indefinitely."** `live`
- Name: Subs Start at $29.99
- Said simply: The subscription now starts at $29.99.
- Terms: $29.99 ÷ 28 = $1.07 a day. It applies only with the text-message discount for new customers (footer small print). It renews at $49.99 every 4 weeks.
- For: price doubter. Stage: knows you already.

**L12. Adult subscription: "$49.99 every 4 weeks ($1.78/day)"** `live`
- Name: Adult Subscription
- Said simply: Your pouch is $49.99 every 4 weeks.
- Terms: Sugar-Free is $54.99. Limited flavour is $52.79 Low Sugar or $57.79 Sugar-Free, with a first order of $32.79. Kids "starts at" $24.99.
- For: quitter, price doubter. Stage: knows you already.

**L13. One-time purchase: $66.65 ($2.38/day), shown with "No Free Shipping", "No First Order Discount"** `live`
- Name: One-Time Pouch
- Said simply: Buy one pouch with no subscription.
- Terms: Other one-time prices: Sugar-Free $73.32, Kids $53.32. The 84-pack is $199.95 Low Sugar, $219.96 Sugar-Free, or $159.96 Kids.
- For: price doubter who dislikes subscriptions. Stage: comparing options.

**L14. "Pause Or Cancel Any Time"** `live` (from your brief)
- Name: Pause Or Cancel
- Said simply: You can pause or cancel whenever you like.
- Terms: How to pause or cancel is not on file.
- For: price doubter ("subscriptions are a trap"). Stage: comparing options.

**L15. "Buy 2 Save $5"** `live`
- Name: Buy 2 Save $5
- Said simply: Order for two people and save $5.
- Terms: Applies to more than one adult or kid on the order.
- For: busy parent. Stage: knows you already.

**L16. VIP program: "Save up to $80, get limited flavors, and VIP access"** `live`
- Name: VIP
- Said simply: Join VIP for savings and new flavours.
- Terms: The basis for "up to $80" and what "VIP access" means are not on file.
- For: quitter (already a subscriber). Stage: knows you already.

**L17. Limited flavour: "Subscribers get the limited flavour for 1 month, then switch back to Original automatically"** `live` *(summary)*
- Name: New Flavour Month
- Said simply: Try the new flavour for a month, then you go back to Original.
- Terms: A new flavour every 4 to 8 weeks. Adult price $52.79 or $57.79, against $49.99 for Original.
- For: busy parent (Kids), quitter. Stage: knows you already.

**L18. Guarantee: 30-day money-back, "This policy applies only to your initial purchase."** `live`
- Name: 30-Day Money-Back
- Said simply: Your first order comes with a 30-day money-back guarantee.
- Terms: First order only. Full wording beyond the FAQ line is not on file.
- For: gut-fix seeker, quitter. Stage: comparing options.

**L19. Shipping: orders "typically ship within 24 hours and on average arrive 3-5 days later"** `live`
- Name: Ships In A Day
- Said simply: It usually ships the next day.
- Terms: Typical, not guaranteed.
- For: all. Stage: comparing options.

**L20. Cashback through a third-party app: 20% cash back or 40% store credit after purchase** `live` *(summary)*
- Name: Cashback App
- Said simply: Get some money back after you buy.
- Terms: Third-party app. Conditions are not on file.
- For: price doubter. Stage: knows you already.

**L21. Referral program and monthly smartwatch giveaway** `live` *(summary)*
- Name: Refer & Win
- Said simply: Refer friends and enter a monthly giveaway.
- Terms: Referral reward and giveaway rules are not on file.
- For: quitter. Stage: knows you already.

**L22. HSA/FSA eligible through a third-party service** `live` *(summary)*
- Name: HSA/FSA Eligible
- Said simply: You can pay with your HSA or FSA.
- Terms: Through a third-party service. Steps are not on file.
- For: price doubter. Stage: comparing options.

**L23. Free 30 days of a fitness app (partner offer, one ad)** `live` *(summary)*
- Name: Fitness App Month
- Said simply: Get a month of a fitness app free.
- Terms: What the buyer must buy to qualify is not on file.
- For: quitter. Stage: knows you already.

**L24. Big-box retailer 12-pack: $19.97 Adults, $14.97 Kids** `live` (retailer price)
- Name: Shelf 12-Pack
- Said simply: Grab a 12-day pack off the shelf.
- Terms: Adults $19.97 ÷ 12 = $1.66 a day. Kids $14.97 ÷ 12 = $1.25 a day. The retailer sets the price.
- For: quitter, busy parent. Stage: hasn't noticed the problem / comparing options.

**L25. Price comparison: "$1.26" a serving vs "$3.60" for greens powders** `live` (product page)
- Name: Cheaper Than Powder
- Said simply: It costs less per serving than a greens powder.
- Terms: $1.26 matches no current price (see CLASHES).
- For: quitter. Stage: comparing options.

## CLASHES

**Adult first-order discount size**
- Live figures: 49% (how-it-works), 52% (bar), 55% (bar, pop-up), "up to 55%" (product page), 61% (ads).
- Sums against live prices:
  - $29.99 vs $66.65 one-time = 55.0% off.
  - $29.99 vs $49.99 renewal = 40.0% off.
  - $45.33 vs $66.65 = 32.0% off. A 49% cut would need a base of $88.88, which is not seen.
  - 52% off $66.65 = $31.99, which is not seen.
  - 61% off $66.65 = $25.99, which is not seen.
- **Figure used: 49%.** Better still, quote dollars ($29.99 with text sign-up, then $49.99) until the brand confirms one base.

**Adult first-order price**
- Live figures: $45.33 (how-it-works), $29.99 (birthday cut, ad $20 off, SMS only).
- **Figure used: $29.99 only with the text sign-up condition beside it.** Otherwise use $45.33.

**"Indefinitely" vs new customers only**
- The birthday line says "Subs Now Start at $29.99 … indefinitely".
- The footer says the price needs the SMS discount "reserved for new customers only."
- **Figure used: first order, new customers, with text sign-up.**

**Kids renewal**
- Live figures: "Renews at $74.98 each 4 weeks" (Kids page). The one-time price is $53.32.
- The renewal is $21.66 more than buying one-time. Kids subscription is listed as "not clear" in the brand file.
- **Figure used: $74.98, the higher figure, so no buyer is under-told.** Fix before any Kids subscription offer runs.

**Kids first-order price**
- Live figures: $22.49 (plan box, "58%") and $24.99 ("starts at").
- Sums: $22.49 vs $53.32 = 57.8% off. $24.99 vs $53.32 = 53.1% off.
- **Figure used: $24.99 (53%).**

**Extra-person saving**
- Live figures: "Buy 2 Save $5" vs "+$5 off for every extra person".
- **Figure used: $5 total for 2 people.**

**Adult per-day price**
- The site says $1.78/day. $49.99 ÷ 28 = $1.785, which rounds to $1.79.
- **Figure used: $1.79.**

**Per-serving comparison**
- "$1.26" a serving matches no current price. Current prices work out to:
  - $29.99 ÷ 28 = $1.07
  - $49.99 ÷ 28 = $1.79
  - $66.65 ÷ 28 = $2.38
- **Figure used: none.** Do not reuse $1.26.

**Free shipping**
- "Free shipping on your first order" (bar) vs "Save 55% + Free Shipping" (no first-order limit).
- **Figure used: free shipping on the first subscription order only.**

## STOCK

**Sizes**
- 28-pack pouch: Adults Low Sugar / Sugar-Free, Kids, limited flavour.
- 84-pack (3 pouches).
- 12-pack at big-box retailers only (Adults, Kids).

**Prices per day**

| Size and buy | Price | Per day |
|---|---|---|
| Adults one-time | $66.65 | $2.38 |
| Adults subscription | $49.99 | $1.79 |
| Adults first order (SMS) | $29.99 | $1.07 |
| Adults Sugar-Free subscription | $54.99 | $1.96 |
| Adults 84-pack | $199.95 ÷ 84 | $2.38 |
| Kids one-time | $53.32 | $1.90 |
| Kids 84-pack | $159.96 ÷ 84 | $1.90 |
| Kids first order | $24.99 | $0.89 |
| Retail Adults 12-pack | $19.97 ÷ 12 | $1.66 |
| Retail Kids 12-pack | $14.97 ÷ 12 | $1.25 |

The 84-pack saves nothing per day against the 28-pack bought one-time.

**Guarantee:** 30-day money-back, first order only. It sits in the FAQ and is not loud.

**Delivery:** usually ships within 24 hours and arrives in 3 to 5 days on average. Free shipping on the first subscription order. Returns window: MISSING.

**Extras already stocked**
- Kids line.
- Electrolyte variety pack ($75.88).
- Merch: hoodie $45.49, tee $25.99, tote $36.99, caps $25.99.
- 4 rotating ad gifts (unnamed).

**Partner perks running:** cashback app (20% cash / 40% credit), fitness app 30 days, HSA/FSA service, monthly smartwatch giveaway.

**Reachable people:** subscribers, past first-order buyers, text list, VIP members, referral program, and a surveyed base of 3,000+ customers.

**Proof on file:**
- 2025 12-week study: vitamin C +40.1%, folate +20.5%.
- Third-party testing: 70 pesticides, 4 heavy metals, 16 contaminants, 9 microbial contaminants.
- Survey: "95% of users take [Sprout] at least 4-6x per week with 80% taking daily" (of surveyed users).

**Real dates:** a new limited flavour every 4 to 8 weeks. Exact dates are MISSING.

## NEW

**N1. The Whole Price, Upfront**
- Said simply: You see the first price, the next price and how to stop, all in one box.
- Terms: Your first 28-pack pouch is $29.99 with the text sign-up discount for new customers, then $49.99 every 4 weeks ($1.79 a day), shipped free on the first order. Pause or cancel any time (steps: MISSING).
- For: price doubter ("Which discount is real?" "Will the price jump?"). Stage: knows you already.
- Changes: easier, surer.
- Must arrange: one discount figure across bar, pop-up, plan boxes and ads; the SMS condition moved from the footer to beside the price; written pause and cancel steps.
- Costs you: unknown (likely near zero).
- Why: it answers the doubt behind the most-copied ad without cutting any price.

**N2. Try It For 30 Days**
- Said simply: If your first pouch doesn't work for you, you get your money back.
- Terms: 30-day money-back guarantee. "This policy applies only to your initial purchase." Full wording: MISSING. The first order is $29.99 with text sign-up, then $49.99 every 4 weeks.
- For: gut-fix seeker ("Will this upset my stomach more?") and quitter ("A gummy can't hold enough"). Stage: comparing options.
- Changes: surer.
- Must arrange: the guarantee moved from the FAQ to the plan box and ad close, quoted word for word.
- Costs you: unknown (refund rate could rise; "less than 1%" is brand-reported).
- Why: the guarantee already exists and is buried. Leading with it takes the risk away for the buyers with the strongest feelings.

**N3. Twelve Weeks, No Subscription**
- Said simply: Get 12 weeks in one order and never think about a subscription.
- Terms: One 84-pack order (3 pouches) is $199.95 Low Sugar ($2.38 a day). One-time purchase, no renewal, no free shipping.
- For: price doubter ("I hate subscriptions because I feel like they are a trap"). Stage: comparing options.
- Changes: more, easier.
- Must arrange: nothing to sell it. Do not call it a saving, since its price per day equals the 28-pack's.
- Costs you: unknown.
- Why: it gives subscription-haters a real yes with no renewal at all.

**N4. Start Small On The Shelf**
- Said simply: Try a 12-day pack from the store before you commit.
- Terms: Adults 12-pack $19.97 ($1.66 a day) or Kids 12-pack $14.97 ($1.25 a day) at big-box retailers, at the retailer's price.
- For: quitter who has given up on supplements and isn't looking; busy parent unsure about kids' taste ("Is this just candy?"). Stage: hasn't noticed the problem.
- Changes: cheaper to start.
- Must arrange: a "find it in stores" line or locator. Wording that leaves price to the retailer.
- Costs you: unknown.
- Why: it is the smallest real way to try. Taste can take a few days, so a small first pack lowers the stakes.

**N5. One Order For The Household**
- Said simply: Your gummies and the kids' gummies come in one order.
- Terms: One Adults and one Kids pouch on the same order, with "Buy 2 Save $5". Adults renews at $49.99 every 4 weeks. Kids renewal: MISSING (the page says $74.98, which needs fixing first).
- For: busy parent ("Two subscriptions is too much money"). Stage: knows you already.
- Changes: easier, more.
- Must arrange: a confirmed Kids renewal price; a combined plan box showing both renewal prices and the $5 once.
- Costs you: $5 per order (already live).
- Why: it answers the two-subscriptions worry with a discount that already runs.

**N6. Gentle Start: Low Sugar First**
- Said simply: If your stomach is touchy, start on Low Sugar, which is also the cheaper one.
- Terms: Low Sugar subscription is $49.99 every 4 weeks, against $54.99 for Sugar-Free. The first order is $29.99 with text sign-up, then $49.99.
- For: gut-fix seeker ("Will the sugar-free one cause problems?"). Stage: comparing options.
- Changes: surer, easier.
- Must arrange: a plain note on the Sugar-Free choice pointing gut-sensitive buyers to Low Sugar. Optional: a free swap from Sugar-Free to Low Sugar on the next order, which would need a written policy.
- Costs you: unknown.
- Why: it heads off a known complaint before it becomes a refund.

**N7. Under $1.80 A Day**
- Said simply: Your daily greens cost under $1.80 a day on the subscription.
- Terms: $49.99 every 4 weeks ÷ 28 packs = $1.79 a day. The first order is $29.99 with text sign-up ($1.07 a day), then $49.99.
- For: quitter ("They are expensive"), price doubter. Stage: comparing options.
- Changes: cheaper to start (framing only, no new cut).
- Must arrange: retire the "$1.26" line.
- Costs you: none.
- Why: per-day prices are already on site. One honest daily figure beats six percent claims.

**N8. Use Your HSA/FSA**
- Said simply: You can pay with your HSA or FSA money.
- Terms: HSA/FSA eligible through [third-party service]. Steps and conditions: MISSING. The first order is $29.99 with text sign-up, then $49.99 every 4 weeks.
- For: price doubter. Stage: comparing options.
- Changes: cheaper to start.
- Must arrange: one plain how-to line beside the offer.
- Costs you: unknown (partner fee, if any).
- Why: it lowers what the price feels like without a new discount.

**N9. Third-Pouch Tote**
- Said simply: Stick with it for 3 pouches and a tote comes with the third.
- Terms: Subscribers who receive their third paid pouch get a Sprout tote ($36.99 on the site) in that box. You pay the first order ($29.99 with text sign-up) plus two renewals at $49.99. The offer ends on [date: MISSING].
- For: quitter ("Sprout has been the one thing I've been able to stick to"). Stage: knows you already.
- Changes: more.
- Must arrange: gift fulfilment on order 3, an end date, and the terms printed beside the offer.
- Costs you: unknown (tote cost + shipping weight).
- Why: it rewards the habit, the open lane in ads, with stock the brand already sells.

Money-off proposals in NEW: none new. N5 uses the live $5.

## TRY FIRST

1. **N1:** it answers the loudest doubt ("Which discount is real?") at almost no cost. Most other offers are only safe to run once it is done.
2. **N2:** it turns an existing, buried guarantee into the strongest risk-remover for gut-fix seekers and quitters, with nothing new to make.
3. **N3:** it gives the subscription-hater a yes with no renewal, using a size already sold, with no discount needed.

## MISSING

- Which discount figure and base price the brand stands behind (49 / 52 / 55 / 58 / 61%).
- The real Kids subscription renewal price.
- How to pause or cancel, in the brand's words. Cancelling is the top complaint.
- The full guarantee text, including how a refund is claimed.
- Whether the $66.65 one-time price is openly charged and bought often enough to anchor "% off".
- Free-delivery level and shipping cost after the first order.
- Average order value.
- Returns window.
- Cost per order (unit, shipping, gift).
- Names and real prices of the 4 ad gifts.
- How the VIP "up to $80" is worked out.
- Conditions for the cashback app, referral, smartwatch giveaway and fitness app.
- HSA/FSA steps.
- Whether 84-pack orders ship free.
- Next limited-flavour launch date.

## CHECKS MISSED

- **Brand's own words:** L20 to L23 and L17 are summaries; the brand's exact wording is not on file. L14 is from your brief, not the brand file.
- **Subscription offers (N1, N2, N5, N6, N7, N8, N9):** they cannot yet state how to cancel. The steps are MISSING.
- **N5:** it cannot state the Kids renewal price until the brand fixes the $74.98 / $53.32 clash.
- **N9:** it fails the urgency and "free" checks until the brand sets a real end date and confirms fulfilment.
- **Add-on, free-delivery level:** cannot check it against the average order. Both figures are MISSING.
- **Add-on, checkout price:** cannot confirm the checkout price matches the renewal price in each offer.
```
