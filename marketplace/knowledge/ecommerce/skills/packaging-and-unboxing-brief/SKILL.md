---
name: packaging-and-unboxing-brief
description: "Writes a packaging and unboxing brief a packaging supplier and designer can quote and build from: the outer box, inner layers, insert card and any gift, sequenced as an opening moment worth filming, with a cost-per-order budget tied to gross profit, the insert card's exact words and QR targets, the second-order offer it carries, the shipping and damage checks, and how to measure whether it lifted repeat orders and shared posts. Use before a launch, a packaging redesign, a new supplier quote, or when repeat purchase is low and the box is plain."
---

# Packaging and unboxing brief

**You get:** a supplier-ready brief (box, layers, insert card, gift, materials, sizes and quantities), the insert card's final words with QR targets, a per-order cost sheet checked against gross profit, a filmable opening sequence for creators and customers, and a 60-day measurement plan for repeat orders and shared posts.

## When to use

- The store ships in a plain carton and repeat purchase is low.
- A new product or brand launch needs packaging designed or quoted.
- Customers rarely post or tag the brand, and the store wants the opening to be worth filming.
- A packaging supplier needs a clear brief to quote against.

## Not for

- Product labels and regulatory pack text: use `write-product-spec-sheet-for-factory` with the client's compliance adviser.
- Post-purchase emails and WhatsApp messages: use `write-post-purchase-emails` or `post-purchase-repeat-sequence`.
- An unboxing video ad: use `unboxing-video-ad`.
- Designing the gift-with-purchase offer itself: use `gift-with-purchase-offer`.

## What you need

Required:

1. **Gross profit per order** by top product and the order mix (units per order), from `build-sku-profit-sheet` or `store-meta-math`.
2. **Repeat rate today:** share of first-time buyers who order again within 60 and 90 days (Shopify customer report or `cohort-repeat-and-ltv-analysis`).
3. **Product sizes and weights**, and how they ship (courier, 3PL, own packing), with the current box sizes and damage, return or failed-delivery notes.
4. **Order volume per month** and supplier minimum order quantities.
5. **Brand files:** logo, colours, fonts, voice (`store-visual-identity-sheet`, `brand-voice-guide`).
6. **Top support questions** in the first two weeks after delivery (how to use, how to store, sizing).

Optional: current packaging photos, customer unboxing posts, competitor unboxing posts.

This is a planning and design brief (read access). Ordering packaging spends money and is the client's decision; supplier quotes come back to the client.

## Before you start: the gates

1. **The basics work.** Delivery promise mostly met, "where is my order" contacts not out of control, returns easy. Fix effort before adding delight: high-effort service turned 96% of customers disloyal in one large study [CXP-0009]. Fail: hand off to `cut-where-is-my-order-tickets` or `set-up-returns-and-exchanges` first; a pretty box will not save a late order.
2. **Budget fits gross profit.** Typical spend: under 0.50 USD per order for a branded moment, 1.50 to 3 USD mid-tier, about 2.80 to 4.50 USD premium; a common guide is 2 to 5% of product cost [CXP-0008]. Pass: the full unboxing cost per order leaves gross profit per order above the store's floor. Fail: drop to the cheaper tier.
3. **Cash and stock.** Supplier minimums times unit cost fit the cash plan, and packaging lead time fits the launch date. Fail: start with stickers, tissue and a printed insert while the custom box is made.
4. **Shipping still works.** The new box does not push orders into a higher courier weight or size band. Fail: redesign smaller.

## Steps

### 1. Name the opening's three jobs

Write one line each:

- **Protect:** what breaks, leaks or crushes today, and how the box stops it.
- **Peak:** the one moment of the opening people will remember and film.
- **Next order:** what the insert does to bring the second purchase.

Word of mouth spreads when people see the product and talk about it is natural [BRD-0007]; the opening is one of the few moments a buyer shows the product to others.

### 2. Sequence the layers

Plan the opening as 3 to 5 steps a phone can film in one take, top to bottom:

1. **Outer:** the mailer or shipping carton. Plain outer cartons are fine; brand it with a sticker or printed tape if theft risk matters.
2. **First reveal:** inside lid print, tissue with a sticker, or a sleeve. One short line printed here.
3. **The product:** placed so it is the first thing seen, facing up, label readable.
4. **The insert card** under or beside it.
5. **Optional extra:** a sample, a small tool or a note.

Keep it openable without a knife where possible. Practitioner default: no more than 5 layers; more layers become waste.

### 3. Write the insert card

One card, two sides, exact words:

- **Side A, first use:** how to get the result fast, in 3 steps, plus a QR to a 30 to 60 second how-to video. For products with no instant effect, frame a 30, 60 or 90 day plan with a day-0 photo or a check-in [CXP-0003].
- **Side B, next step:** the second-order offer (if any), the reorder or refill link as a QR, and how to reach support (WhatsApp or email).
- A note signed by a real person at the store, if it is true that they read replies.

The second-order offer must be priced from gross profit, and announced, not a surprise: unannounced second-order gifts rarely pay back [CXP-0006]. A personal letter to first-time buyers has doubled second-order conversion in one retailer's test [CXP-0020], so test a personal note against the generic card.

Asking for a review is fine; offering anything only for a positive review is not. In the US it is banned to give incentives conditioned on review sentiment [MCR-6045]. Any thank-you goes to every reviewer, whatever they rate.

### 4. Choose the gift, if any

A gift should help the customer use the product (a scoop, a frother, a pouch), not be more of the same, which drives skips and cancels on subscriptions [OFF-0039]. A way to test your quality against rivals can sit in the first box, but only if the product really wins [WLD-0006]. Price every gift into cost per order.

### 5. Cost sheet

List each item: unit cost at the store's volume, quantity per order, and total per order. Split the branded retail box (product cost) from the plain shipping carton (shipping cost), because they sit in different lines of the profit and loss [FIN-0008]. Check the total against gate 2. Inserts scale with every order, so a stack of small extras becomes a real number at volume.

### 6. Shipping check

Give the supplier inner dimensions with a tolerance, board grade or material, print method, and a drop test request. Ask for a pre-production sample and ship it to yourself by the store's main courier to two far postcodes, states or regions. Add the final box's empty weight and size as a saved package in Shopify so calculated shipping is right [SET-0007]. Parcel-friendly packaging matters for profit on every order [PRD-0013].

### 7. Make it filmable

Write a short brief for creators and customers: the order to open the layers, where the light should come from, and the one moment to linger on. Hand it to `unboxing-video-ad` for ads. Never pass off a staged opening as a customer's; creator content follows the store's disclosure rules.

### 8. Measure for 60 days

Before and after the change, compare: 60-day repeat rate of first-time buyers, redemptions of the insert offer code, QR scans (use a UTM-tagged link per QR), tagged posts and mentions, damage, return and failed-delivery claims. If possible, split by month or warehouse so half the orders get the new insert first.

### Market notes

- **Every market:** printed inserts in the languages your buyers use where the store's orders cluster. Pay on delivery orders, where used: put a QR to prepaid reorder with a small prepaid benefit if the offer model supports it. Wet or humid seasons need moisture protection. Packaged goods must carry your market's legally required declarations on the pack (such as net quantity, maker or importer, and any safety marks); confirm with the client's compliance adviser.
- **US:** state rules on packaging recycling claims vary; only print "recyclable" if the material and local programmes support it. Keep the box within the courier's dimensional weight band.
- **UK and EU:** packaging producer rules (UK extended producer responsibility, EU packaging rules and Germany's packaging register) may apply; check before ordering printed boxes. Recycling marks must match local schemes.

## Checks before you hand it over

- The three jobs (protect, peak, next order) are written and each layer serves one of them.
- The insert card has final words, QR targets with UTM tags, and a support contact.
- Cost per order is within the tier the gross profit allows, with retail box and shipping carton split.
- No review request offers anything tied to a positive rating.
- The box keeps the store in the same courier weight and size band.
- A sample has been ordered for a real shipping test before the bulk order.
- The 60-day measurement plan names the baseline numbers.
- Nothing is ordered without the client's yes.

## Output

**One-screen summary:** the opening in five lines, cost per order and its share of gross profit, the second-order offer, supplier lead time, the numbers to watch at 60 days.

**Supplier brief:**

| Item | Purpose | Size (inner, mm) | Material and finish | Print (colours, sides) | Quantity | Target unit cost | Notes |
|---|---|---|---|---|---|---|---|

**Insert card copy:** Side A headline, three steps, QR 1 target and UTM; Side B offer line, terms, QR 2 target and UTM, support line, signature.

**Cost per order sheet:**

| Item | Unit cost | Per order | Retail box or shipping | Total per order | Share of gross profit per order |
|---|---|---|---|---|---|

**Filming brief:** opening order, light, moment to hold, length.

**Measurement plan:** metric, baseline, target, source, read date.

## Common mistakes

- **Delight on top of late deliveries.** Gate 1 fixes effort first [CXP-0009].
- **Boxes that cost more than the profit allows.** Gate 2 and step 5 tie cost to gross profit [CXP-0008].
- **A card that says "thank you" and nothing else.** Step 3 gives it a first-use job and a next-order job.
- **Surprise gifts with no announcement.** Step 3 announces the offer [CXP-0006].
- **Reviews bought with a discount.** Step 3 keeps rewards separate from rating [MCR-6045].
- **Bigger box, higher courier band.** Step 6 tests size and weight before bulk.

## Sources

- CXP-0008: unboxing cost tiers and 2 to 5% of product cost.
- CXP-0009: fix effort before delight.
- CXP-0003: 90-day plan and day-0 photo for slow products.
- CXP-0006: unannounced second-order gifts rarely pay.
- CXP-0020: personal second-purchase letters doubled conversion.
- BRD-0007: word of mouth needs visible use.
- OFF-0039: gifts should help use the product.
- WLD-0006: a test-against-rivals kit in the first box.
- FIN-0008: retail box is product cost, shipping carton is shipping.
- SET-0007: save box weight and size in Shopify.
- PRD-0013: parcel-friendly packaging protects profit.
- MCR-6045: no incentives tied to review sentiment.

What makes this skill ours: the box is only allowed once deliveries and returns work; the budget is set from gross profit per order with retail and shipping packaging split; the insert card has a first-use job and a next-order job with tracked QR codes; and the brief ends in a 60-day test of repeat orders, not a mood.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Printed inserts in English plus the buyer's regional language where orders cluster. COD orders: a QR to prepaid reorder with a small prepaid benefit. Monsoon months need moisture protection. Pack declarations: MRP inclusive of taxes, manufacturer, net quantity.
