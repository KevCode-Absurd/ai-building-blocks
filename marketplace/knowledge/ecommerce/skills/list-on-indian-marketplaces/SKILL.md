---
name: list-on-indian-marketplaces
description: "Decides which products go on Flipkart, Myntra, Nykaa and Meesho, and at what price, from a profit waterfall per product per marketplace that includes commission, fixed and collection fees, shipping by weight and zone, GST on fees, returns and cash-on-delivery refusals (RTO); then builds the listing sheet each one needs (attributes, HSN and GST rate, MRP, Legal Metrology declarations, images, brand papers). Fee figures are read from each seller panel's rate card on the day. Use when an Indian store wants to sell beyond its own site and Amazon.in, when a marketplace is losing money and nobody knows why, or before a big sale event."
---

# List on Flipkart, Myntra, Nykaa and Meesho

**You get:** a channel decision sheet showing, for every product, the gross profit per order on each marketplace after every fee, return and RTO cost, with a list, price or skip verdict; a price sheet that keeps MRP and the brand's own site in line; and a listing sheet per marketplace with every required field filled, ready for the client to upload.

## When to use

- The store sells on its own site (and perhaps Amazon.in) and wants more Indian channels.
- A marketplace shows sales but the bank account does not.
- A big sale event is coming and the marketplace asks the brand to fund discounts.
- A wholesale or distribution lead asks which channels the brand is on and at what price.

## Not for

- Amazon.in listings: use `write-amazon-listing`.
- Writing titles for every channel: use `write-product-titles-for-store-and-marketplaces`.
- GST registration and store tax settings: use `set-up-taxes-gst-and-us-sales-tax`.
- Matching marketplace payouts to orders: use `reconcile-payouts-and-payment-fees`.

## What you need

Required:

1. **Product list** with landed cost per unit, packed weight and dimensions, HSN code and GST rate, MRP, and the current site price.
2. **Rate cards on the day** from each seller panel (or the marketplace's published fee page): commission by category and price band, fixed or closing fee, collection or payment fee, shipping by weight slab and zone, pick and pack if fulfilled by the marketplace, return and RTO charges.
3. **Return and RTO rates** by category from the store's own orders (`returns-and-rto-cost-analysis`); if a marketplace is new to the brand, use the store's own COD RTO rate as the starting guess and say so.
4. **GST registration** details (GSTIN) and the state it is registered in.
5. **Brand papers**: trademark application or registration, or an authorisation letter from the brand owner.

Optional: category approval status on each marketplace, competitor listings and prices, sale event funding terms, payout cycle per marketplace.

Planning is level 1. Creating listings in a seller panel is draft work (level 2). Accepting a seller agreement, opting into a sale event, setting live prices and publishing listings need the client's yes; the client signs any agreement.

## Before you start: the gates

1. **GST in place.** Marketplaces ship to buyers in every state, and selling goods across states generally needs GST registration; filing stays the seller's job [FIN-6205]. The marketplace also collects tax at source from payouts; confirm current rates and how to claim them with the accountant. Fail: register first.
2. **Pack labels are legal.** Every pre-packaged product carries maker or importer, origin for imports, generic name, net quantity, month and year of manufacture, MRP inclusive of taxes, unit sale price and consumer care details [COG-6264]. Products under a Quality Control Order need the BIS mark [COG-6266]. Fail: fix labels before listing; marketplaces ask for these fields and can delist.
3. **Profit floor known.** Gross profit per order must include every marketplace fee, shipping and returns, not just product cost against price [MEA-0037]. Fail: build it in step 2 first.
4. **Stock and cash.** Marketplaces pay days or weeks after delivery and hold money through the return window. Enough stock and cash to wait one full payout cycle per channel. Fail: start with one channel.

## Steps

1. **Shortlist the fit.** A practitioner view to check against each panel's category list:
   - **Flipkart:** broad catalogue, large sale events, wide reach outside metros.
   - **Myntra:** fashion, footwear, accessories and beauty; brand-led and selective about who it onboards.
   - **Nykaa:** beauty, personal care and wellness (Nykaa Fashion for fashion); expects brand papers and product compliance documents.
   - **Meesho:** low price points, small towns, mostly cash on delivery, high return sensitivity.
   Drop any channel whose category is closed to the brand.
2. **Build the profit waterfall per product per channel.** Selling price (GST inclusive) - GST on the sale = net revenue. Then subtract: commission, fixed or closing fee, collection fee, forward shipping for the weight slab and the usual zone, pick and pack if any. GST charged on these fees is usually input credit for a registered seller; confirm with the accountant. Then subtract a returns allowance = return rate x (reverse shipping + any damage write-off) and an RTO allowance = RTO rate x (forward + return shipping), and the landed cost [FIN-0007]. The result is gross profit per order shipped.
3. **Give each product a verdict.** List: profit per order at or above the floor. Price up: below the floor, but a price within MRP and the market range would clear it. Skip: no price clears it. Page-one prices for the product type show the range: a tight band means a price war, a wide band means buyers judge on more than price [AMZ-0001].
4. **Set prices in line.** The selling price may never exceed MRP. Keep the marketplace price close to the site price: a much lower marketplace price teaches buyers to leave the site, a much higher one gets few orders. Write one price rule per channel, for example "site price, plus the fee gap rounded to the nearest 9", and check it still clears the floor.
5. **Price the sale events.** For each event, model each discount depth the marketplace asks for against the waterfall. A discount comes out of gross profit, not revenue, so break-even needs rise steeply [OFF-0065]. Split who pays: marketplace-funded, brand-funded, or shared. Opt in only on products that still clear the floor; the client approves.
6. **Fill the listing sheet.** Each marketplace's category template, filled once from one attribute sheet: product name, brand, HSN, GST rate, MRP, selling price, net quantity, maker or importer, origin, manufacture date field, size chart, colour, material, care, images to the marketplace's specs. Titles come from `write-product-titles-for-store-and-marketplaces`. Brand approval needs the trademark papers or authorisation letter.
7. **Plan the cash-on-delivery cost.** Meesho and much of Flipkart's volume is cash on delivery; RTO is charged back to the seller. Use `cut-rto-on-cod-orders` for the store's own site rules; on marketplaces the seller controls fewer levers, so the RTO allowance in step 2 decides which products can live there.
8. **Regional language.** Buyers on these apps may browse in Hindi or other languages. Listings stay in English unless the panel offers language fields; use the Indian buyer terms ("kurta set", "chappal") in titles and attributes.
9. **Pick the order of launch.** One channel first, the one with the most products on "list". Add the next only after one full payout cycle shows profit per order close to the model (practitioner default).
10. **Wholesale notes.** A channel that sells products to resellers (Meesho's reseller users, or B2B buyers) sees the brand's price as a cost; check the floor holds at the price a reseller pays.
11. **Hand over.** Show the decision sheet, the price rules, the event plan and the listing sheets. Upload only after the client's yes.

## Checks before you hand it over

- Every fee is from a rate card dated this week, with the source named.
- Every waterfall includes returns and RTO allowances, not just commission.
- No selling price above MRP; no listed product below the profit floor.
- Every pre-packaged product has all Legal Metrology fields filled.
- Products needing a BIS mark show the licence number.
- Brand papers are attached for each marketplace that asks.
- Sale event discounts are modelled before any opt-in.
- Nothing uploaded, opted in or signed without the client's yes.

## Output

**One-screen summary:** channels chosen and the order to launch, products listed, priced up or skipped per channel, expected gross profit per order per channel, cash tied up for one payout cycle, and the "To confirm" list (rates, tax treatment, approvals).

**Decision sheet:** SKU | Channel | Selling price | MRP | Net revenue | Commission | Fixed fee | Collection fee | Shipping | Pick and pack | Returns allowance | RTO allowance | Landed cost | Gross profit per order | Floor | Verdict.

**Price rule sheet:** Channel | Rule | Example SKU | Site price | Channel price | Clears floor (yes or no).

**Sale event sheet:** Event | SKU | Discount depth | Who funds | Profit per order after discount | Opt in (yes or no).

**Listing sheet (one per channel):** SKU | Title | Brand | Category | HSN | GST rate | MRP | Selling price | Net quantity | Maker or importer | Country of origin | Manufacture month and year | BIS licence | Size chart | Attributes | Image file names | Brand paper.

## Common mistakes

- **Judging a channel on commission alone.** Step 2 adds shipping, fees, returns and RTO.
- **Pricing below the site to chase orders.** Step 4 keeps channels in line and above the floor.
- **Joining every sale event.** Step 5 models each depth first.
- **Missing pack declarations.** Gate 2 fixes labels before listing.
- **Launching on four channels at once.** Step 9 proves one payout cycle first.
- **Old fee figures.** Every fee comes from a rate card dated this week.

## Sources

- MEA-0037: gross margin must include marketplace fees, shipping and pick-pack.
- FIN-0007: what sits in landed cost and what sits below gross profit.
- FIN-6205: GST registration and filing are the seller's job.
- COG-6264: India packaged-goods declarations.
- COG-6266: India Quality Control Orders and the BIS mark.
- OFF-0065: discounts raise break-even steeply.
- AMZ-0001: page-one price spread signals a price war.

What makes this skill ours: each channel is judged on profit per order after returns and cash-on-delivery refusals, not on commission; prices stay in line with the brand's own site and under MRP; sale event discounts are modelled before opting in; and pack declarations and BIS marks are checked before any listing goes up.
