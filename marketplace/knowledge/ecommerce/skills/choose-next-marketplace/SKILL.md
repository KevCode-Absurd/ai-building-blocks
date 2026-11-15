---
name: choose-next-marketplace
description: "A ranked choice of the next marketplace to open (Amazon, Walmart, Etsy, eBay, Zalando, bol, Mercado Libre or others), with gross profit per order after every fee, ad cost and return for the store's own SKUs, plus scores for fit, cash timing, effort and risk to the brand and its retail price, one recommendation, a runner-up and a 60-day test plan with a pass line. Uses fee schedules pulled on the day, never remembered rates. Use when the owner is asked 'why are you not on Amazon?', when site growth has slowed, or before signing up to any marketplace."
---

# Choose the next marketplace

**You get:** a one-page ranking of 3 to 6 marketplaces for this store, each with gross profit per order after all fees and ads on its top SKUs, a risk and cash score, one recommendation and a runner-up, and a 60-day test plan with a pass or fail line, for the client to approve before any account is opened.

## When to use

- The owner wants a second sales channel and does not know which marketplace to start with.
- Buyers keep asking whether the product is on Amazon or another big marketplace in their country.
- Site growth has flattened and the store is weighing a marketplace against more ad spend.
- A marketplace sales rep is pushing the store to sign up.

## Not for

- Writing listings once the choice is made: use `list-on-indian-marketplaces` or `write-amazon-listing`.
- Running marketplace ads: use `launch-amazon-ppc` (the `garrett-amazon` agent).
- TikTok Shop set-up: use `launch-tiktok-shop`.
- Selling to physical shops: use `find-and-pitch-retail-stockists`.

## What you need

Required:

1. **SKU list** with landed cost, weight and size, current site price and monthly units, from `build-sku-profit-sheet`.
2. **Return and failed-delivery rates** by product from `returns-and-rto-cost-analysis`, or the store's own returns report.
3. **Each candidate marketplace's current fee pages**, pulled on the day: commission or referral rate for the category, fixed or closing fee, collection or payment fee, shipping or fulfilment fee by weight and zone, storage, return or failed-delivery fee, and the settlement cycle. Record URL and date for each.
4. **Brand protection facts**: trademark filed or registered, and in which country.
5. **Fulfilment set-up**: own warehouse, 3PL or none, and daily dispatch capacity.

Optional: search volume for the product on each marketplace (from the marketplace's own search suggestions or a keyword tool), competitor listings and prices, any existing unauthorised sellers of the product.

If a fee page needs a seller login, ask the client to export the rate card or screenshot it. Never use fee numbers from memory or old blogs. Research is read only. Opening a seller account is the client's own action.

## Before you start: the gates

1. **Gross profit per order.** Pass when every candidate can be scored on gross profit per order after referral fees, fulfilment, payment, returns and expected ad cost [MEA-0037]. Fail: fill the missing fee or cost first.
2. **Cash.** Marketplaces pay out on their own cycle and fulfilment programs hold stock away from the store. Pass when `build-13-week-cash-forecast` covers the stock and the payout lag. Fail: pick the candidate with self-ship and the shortest settlement.
3. **Capacity.** Pass when the store can meet the marketplace's dispatch time without hurting its own site orders. Fail: use the marketplace's fulfilment program or wait.
4. **Tax and rules.** Find out what each marketplace needs before you list. US: in most states the marketplace collects sales tax as the facilitator; confirm for the store's states. UK and EU: marketplaces collect VAT on some sales (for example goods sold by sellers based outside the UK or EU), and selling into a new country can mean a VAT registration there; Canada and Australia have their own goods and services tax rules for marketplaces. Some marketplaces also hold back or report tax on sellers' payouts. Confirm the current rules with the store's accountant.

## Steps

### 1. Shortlist by country and category

- **US and Canada:** Amazon, Walmart Marketplace (US and Canada), Etsy (handmade, vintage, craft supplies only), eBay, Target Plus (US, invite only), Best Buy Marketplace (Canada).
- **UK and Europe:** Amazon (UK, Germany, France, Italy, Spain and others), eBay, Etsy, Zalando (fashion), bol (Netherlands and Belgium), Cdiscount (France), Allegro (Poland), OnBuy (UK).
- **Australia and New Zealand:** Amazon Australia, eBay, Catch, Kogan, The Iconic (fashion), Trade Me (New Zealand).
- **Latin America and other regions:** Mercado Libre, Amazon in the country where it runs, and the leading local marketplace for the category.

Keep 3 to 6 that list the store's category and price band.

### 2. Pull fees and build the fee table

For each, one row per fee with base and source. Watch the base: Amazon in the US charges its referral fee on the total price including shipping and gift wrap, with a minimum per item, and adds a plan fee [AMZ-6383]. Other marketplaces may charge on the price before or after tax. Write the base next to every rate.

### 3. Compute gross profit per order for the top 5 SKUs

Per SKU and marketplace:

Marketplace price (same as site price unless the gate in step 5 says otherwise)
minus tax (sales tax or VAT collected)
minus commission, fixed, payment and closing fees
minus shipping or fulfilment fee
minus landed cost and packing
minus return and failed-delivery allowance at that marketplace's expected rate
minus ad cost per order (sponsored listings; practitioner default for a new listing: plan 10 to 20% of sales for the first 60 days, test it)
equals gross profit per order after ads.

Low price items rarely survive this: at about 8 dollars and 1 dollar a click, two or three clicks per sale erase the profit [AMZ-0004]. Where buyers can pay on delivery, model failed deliveries at the store's own failed-delivery rate or higher.

### 4. Read the shelf

Search the main keyword on each marketplace. A tight price band on page one signals a price war; a wide spread means buyers weigh more than price [AMZ-0001]. Note the top 5 rivals' prices, review counts and whether the store's own product is already listed by someone else.

### 5. Score brand and price risk

Score each 0 (low risk) to 2 (high):

- **Price pressure:** the marketplace runs seller-funded sale events or its buyers expect the lowest price (value-led apps score 2 for premium brands).
- **Retail price clash:** the price needed to win there is below the site or stockist price.
- **Content control:** can the brand own its listing (brand registry or equivalent)?
- **Unauthorised sellers or fakes:** already present, or likely.
- **Return policy imposed:** generous mandated returns in fashion and beauty.

A marketplace that needs a lower price than the site fails unless the client accepts the clash in writing.

### 6. Score fit and cash

- **Fit (0 to 2):** buyers search there for this category; existing customers ask for it there. Demand built elsewhere often converts on Amazon because of delivery speed [AMZ-0007].
- **Cash (0 to 2):** settlement days, reserves, stock held in their warehouses.
- **Effort (0 to 2):** listing work, catalog rules, dispatch time.

### 7. Rank

Order by gross profit per order after ads first (any candidate below zero drops out), then by fit + cash + effort minus risk. Recommend one; name the runner-up in a line with the reason it lost.

### 8. Write the 60-day test plan

- **SKUs:** 5 to 10 best sellers with the best step 3 result.
- **Pass line:** gross profit per order after ads at or above the store's floor, return rate within 1.5x the site's, and no fall in site sales beyond normal noise. Ads on Meta or YouTube push some sales onto Amazon, so read the site and marketplace together, not apart [MEA-0029].
- **Stop line:** two weeks running below zero gross profit after ads, or an account health warning.
- **Owner and weekly check:** units, fees charged versus modelled, ads, returns, payouts received.

### 9. If the marketplace is in a new country, add cross-border costs

Selling into a country the store does not ship to today adds costs that step 3 must carry per order:

- **How stock reaches buyers, by expected orders a month to that country:** under about 50, ship each order from the current warehouse to test demand; about 50 to 200, a cross-border consolidation service or a small local 3PL; over about 200, a local 3PL or the marketplace's own fulfilment (author's rough bands from the overseas planning item; test against real quotes). Price each with a carrier or 3PL quote on the store's top 3 parcel sizes, not a published rate card.
- **Duty and import tax by country (confirm each with a broker or accountant in that country):**
  - **European Union:** parcels of €150 or less sent to EU buyers carry a €3 customs duty per item from 1 July 2026 [OPS-6658], plus a €2 handling fee per item expected from 1 November 2026 [OPS-6656]. IOSS lets a non-EU seller charge EU VAT at checkout for parcels up to €150 [FIN-6438]. Stock held in an EU country usually means a VAT registration there.
  - **United Kingdom:** consignments of £135 or less pay no customs duty today, with VAT charged at checkout by the seller or marketplace, but that relief is to end by March 2029 at the latest [OPS-6631].
  - **United States:** duty-free de minimis entry is suspended for non-postal modes, so every parcel needs an entry and pays duty [OPS-6647]; holding stock in the US means duty is paid on cost at import, not on each retail parcel [COG-6288].
  - **Canada and Australia:** check the national goods and services tax at import and at checkout, and any Canadian provincial sales tax.
- **Who pays duty at the door:** if buyers pay duty and fees on delivery, expect refusals and returns; price delivered duty paid where the marketplace or carrier allows it, and put the cost in the price.
- **Local rules:** a local-language listing, local returns rules (for example the 14-day cancellation right for online orders in the UK and EU), product safety marks, and an EU or UK responsible person where required (`import-registration-by-market`).

### 10. Check readiness and phase the entry

Before any sign-up, pass these: the home market makes money per order after ads; the team and warehouse can take about 20% more orders; the budget covers set-up, first stock and two months of ads; the product is legal to sell there; and landed cost per order in that country is known. Then phase it:

1. **Test:** 5 to 10 SKUs, shipped from the current warehouse or via the marketplace's fulfilment, for 60 days (step 8).
2. **Local stock:** move stock into the country only when orders pass the volume band above and the test pass line holds; use `choose-3pl-or-self-fulfil` and `inbound-shipment-tracker-with-alerts`.
3. **Grow:** widen the range, localise content further and add the next country only after this one holds its pass line for a quarter.

## Checks before you hand it over

- Every fee has a source URL and date from this week.
- Every candidate shows gross profit per order after ads for the same top SKUs.
- The fee base (with or without shipping and tax) is written beside each rate.
- Return and failed-delivery allowances use the store's data, not a guess.
- No recommended marketplace needs a price below the site or stockist price unless the client accepted it.
- Cash timing and stock held by the marketplace are in the cash forecast.
- The test plan has a pass line, a stop line and an owner.
- For a new country, duty, import tax and fulfilment cost per order are in the profit table, and each tax point names its country and the adviser who confirms it.
- The readiness checks in step 10 pass before any sign-up, or the gap is named.

## Output

1. **One-screen summary:** the recommendation, the runner-up and why it lost, gross profit per order after ads on the top 3 SKUs, cash needed, and the 60-day pass line.
2. **Fee table:** Marketplace, Fee type, Rate or amount, Base, Source URL, Date checked.
3. **Profit table:** SKU, Marketplace, Price, Tax, Fees, Fulfilment, Landed cost, Returns allowance, Ad cost, Gross profit per order after ads, Site gross profit per order for comparison.
4. **Ranking table:** Marketplace, Gross profit per order (avg top 5), Fit, Cash, Effort, Risk, Total, Rank, Reason.
5. **60-day test plan:** SKUs, Start date, Pass line, Stop line, Weekly metrics, Owner, Hand-off skills.
6. **Cross-border cost table (new countries only):** Country, Fulfilment route, Shipping per order, Duty per order, Import tax handling, Fees per item, Who pays at the door, Adviser to confirm.
7. **Phase plan:** Phase, Trigger to start, SKUs, Fulfilment route, Owner.

## Common mistakes

- **Fees from memory.** Step 2 pulls the rate card on the day with its URL.
- **Commission only.** Step 3 adds fulfilment, payment, returns and ads [MEA-0037].
- **Cheap SKUs first.** Step 3 shows low-price items lose money to click costs [AMZ-0004].
- **Matching marketplace prices downward.** Step 5 fails any channel that breaks the retail price.
- **Reading the site alone.** Step 8 reads both channels together [MEA-0029].
- **Every marketplace at once.** Step 7 picks one, with a test before the next.
- **Assuming small parcels enter duty free.** Step 9 prices the EU, UK and US low-value rules as they stand.
- **Moving stock abroad before demand is proven.** Step 10 ships from home first and moves stock on a trigger.

## Sources

- MEA-0037: gross margin includes marketplace fees and every delivery cost.
- AMZ-6383: Amazon US (United States) plan and referral fee rules, charged on price plus shipping.
- AMZ-0004: low-price products lose profit to click costs.
- AMZ-0001: page-one price spread shows price wars.
- AMZ-0007: demand built elsewhere converts on Amazon.
- MEA-0029: ad value spills onto marketplaces; measure across both.
- OPS-6658, OPS-6656, FIN-6438: EU low-value duty, handling fee and IOSS.
- OPS-6631: UK low-value relief and its planned end.
- OPS-6647, COG-6288: US de minimis suspension and holding stock in the US.
- Library item: Overseas market planner (adapted from cross-border-ecommerce by Nexscope AI, MIT, https://github.com/nexscope-ai/eCommerce-Skills/tree/main/cross-border-ecommerce), used for the fulfilment bands by order volume, the readiness checks and the phased entry; its undated tax figures were replaced with dated rules from the cards above.

What makes this skill ours: every marketplace is ranked on gross profit per order after ads, returns and fees pulled on the day, not on traffic or commission alone; a channel that forces the price below the site fails outright; failed-delivery and return losses and payout lags are in the maths; and the choice ends in a 60-day test with a stop line, not a sign-up.

## Selling in India

- India shortlist: Amazon.in, Flipkart, Myntra (fashion, beauty), Nykaa (beauty, fashion), Meesho (value-priced items), Ajio, Tata CLiQ, FirstCry (baby), and quick-commerce apps for fast-moving daily items.
- Selling on marketplaces generally needs GST registration [FIN-6205]; marketplaces also collect tax at source on sellers' payouts, so confirm the current rate with a chartered accountant.
- Model failed deliveries on COD orders at the store's own RTO rate or higher, and use `returns-and-rto-cost-analysis` for return and RTO rates by product.

Sources for this section:
- FIN-6205: India GST registration for marketplace sellers.
