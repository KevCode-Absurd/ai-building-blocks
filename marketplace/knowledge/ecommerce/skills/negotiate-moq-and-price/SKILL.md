---
name: negotiate-moq-and-price
description: "A negotiation plan and ready-to-send messages for one supplier covering minimum order, unit price and payment terms, with the store's target, fallback and walk-away point on each, worked out from gross profit per order and cash, plus the trades to offer in return. Use after quotes are compared and one supplier is preferred, before a re-order, when a supplier raises prices, or when a minimum order is more stock than the store can sell or pay for."
---

# Negotiate minimum order and price

**You get:** a one-page negotiation plan (target, fallback and walk-away for minimum order, price and payment terms), the trades the store can offer, and 5 ready messages in order, each approved by the client before it is sent.

## When to use

- One supplier is preferred but the minimum order is more than the store can sell or fund.
- A re-order is due and volume has grown since the last price.
- The supplier has announced a price rise.
- The store needs longer payment terms to fund growth.

## Not for

- Collecting and comparing quotes: use `write-rfq-and-compare-quotes` first.
- Building the cost per unit: use `calculate-landed-cost-per-unit`.
- Financing stock through loans or a credit line: use `build-13-week-cash-forecast` and the finance agent.
- Selling to wholesale buyers (the store is the seller there): use `bulk-order-quote-and-invoice`.

## What you need

Required:

1. **The comparison sheet** from `write-rfq-and-compare-quotes`, or the supplier's quote plus one competing quote.
2. **Landed cost sheet** with the target and the most the store can pay per unit.
3. **Sales rate** for this product (units a day, from in-stock days only) or a forecast for a new product.
4. **Cash forecast** for the next 13 weeks.
5. **History with this supplier**: past orders, on-time record, defects, price changes.

Optional: a 12-month volume forecast, the supplier's other buyers if known, the scorecard from `supplier-scorecard`.

If there is no competing quote, get one before negotiating; without a real alternative the store has no lever. Messages go out from the client's account at level 2, each approved by the client. Any agreed price, minimum or term is a binding commitment: the client says yes to it in writing before it is accepted.

## Before you start: the gates

1. **Walk-away price known.** Pass: the most the store can pay per landed unit and still earn its target gross profit per order is written down. Fail: compute it in `calculate-landed-cost-per-unit`.
2. **Walk-away quantity known.** Pass: the largest order the store can sell before the stock ties up cash too long and can pay for (see step 2). Fail: stop.
3. **A real alternative.** Pass: at least one other quote or supplier that passed vetting. Fail: run `find-and-vet-suppliers`.
4. **Quality locked.** Pass: an approved sample and spec version exist. Fail: do not cut price before the spec is fixed; a squeezed supplier can recover margin through cheaper materials.

## Steps

### 1. Set the three numbers for each term

For price, minimum order and payment terms, write:

- **Target:** what you open toward.
- **Fallback:** what you would accept with a trade.
- **Walk-away:** beyond this, you use the alternative.

Price walk-away = the landed cost at which gross profit per order drops below the store's floor. Work the selling price down: price minus target gross profit minus outbound delivery, fees and returns allowance gives the most the unit can cost delivered [FIN-0012].

Set the target from cost, not from the other quote, when you can: with a should-cost sheet (`should-cost-model-per-bom-line`), the target per line is should-cost plus a fair factory margin, and each gap line becomes one exact question. Find the factory's normal margin range for your category from public accounts or paid expert advice; aim inside it, and say "not known" if you cannot find one. One operator found about 5 to 9% earnings margins for jewellery factories; that is one category, not a benchmark for yours.

### 2. Set the minimum order walk-away from sales and cash

Largest acceptable order = units the store expects to sell within its cover window (practitioner default: 90 days for a proven product, 45 to 60 days for a new one) and whose cash fits the forecast. Forecast from in-stock days only, since stock-out days hide demand [OPS-0014]. Tying growth to big stock buys has driven profit to near zero at brands that grew fast on inventory loans [FIN-0011]; a lower minimum at a slightly higher price is often the better deal early on.

### 3. List what the store can give

Suppliers move when they get something. Rank these by cost to the store:

- A 12-month forecast with a firm first order and soft later orders.
- Fewer colours or sizes on the first run, so lines run longer.
- Flexible production timing, filling the factory's quiet weeks.
- Faster payment on time, every time, and a written reference.
- Accepting their standard packaging where the brand allows.

Price breaks can come from how fully the factory's dedicated labour is used; one buyer put such volume credits at 1 to 3 dollars a unit [COG-0002].

Ask the factory to show where its own costs fall with volume, line by line: when does the fabric, the zip or the labour get cheaper, and can any of that reach you? In cut and sew, fewer colours and sizes per run raise line efficiency; moving from 60% to 75% efficiency cuts real sewing time by 20%, which is a saving to share.

Early runs: paying a little more per unit on the first one or two orders, while you learn sell-through, quality and delays, often buys a better long-term partner. Negotiate harder once you have the data.

### 4. Choose the asks, in order

Open with the term that matters most for this store:

1. **Cash-tight store:** ask for terms first. Float equals payment terms minus order-to-shelf time [FIN-0005]. Steps: lower deposit (30% to 20%), balance after inspection rather than before shipping, then net 30 to 90 after delivery for repeat orders. Some factories can offer longer terms by financing your invoices under export credit insurance, at about 6% a year in one account; offering to share that cost can unlock net 90 [FIN-0004]. Brands have grown on supplier net terms instead of equity, by sharing the growth plan and always paying on time [FIN-0023].
2. **Margin-tight store:** ask for price at the next tier for the current quantity, or a tier price if the store commits to a 12-month total. Bulk tiers can cut cost a lot: one item fell from 7.80 to about 4.00 per unit [COG-0010].
3. **Stock-heavy minimum:** ask for the minimum per order to be split (minimum per colour lowered, or one production run delivered in two shipments), or a one-time trial minimum.

Share the competing quote's numbers, not its supplier name; factories that know the buyer has options keep price and quality honest [COG-0003].

Price every ask in money before you send it:

- **Payment terms:** value = order value x share of payment moved x days moved / 365 x the store's yearly cost of cash. Paying a supplier 2% more to move from net 30 to net 60 is like a one-month loan at about 24% a year, dearer than most bank loans [COG-6291].
- **Price breaks:** take a bigger tier only if total yearly cost (price plus ordering plus holding) falls. In one textbook case a 4% discount at a larger order raised total yearly cost about 2.5%; the break-even discount there was 6.4%, which is the number to ask for.

Test how well the factory knows its costs: say your target is about 20% under its quote and ask what it would change to get there. A factory that suggests a cheaper material or a step to skip knows its costs, and you can judge each idea in `cost-down-levers-with-return-risk`. One that simply accepts may cheapen the product later. If the only route to your price is cheaper materials or skipped checks, stop pressing; a squeezed factory recovers margin in quality.

### 5. Protect what you win

Ask for these in writing with any deal:

- Price held for 6 or 12 months, or tied to a named material index.
- Same spec version and materials; any change needs your written approval.
- Pre-shipment inspection before the balance is paid (see `order-samples-and-quality-check`).
- If the supplier is your only source: continued supply if the factory changes owner, and no other buyer getting a better price or first claim on capacity [COG-0013].
- Mould and tooling ownership in writing, with a tooling schedule (ID, photo, location, release deadline); an invoice that says "mould fee" does not prove you own it. Use `purchase-order-and-supply-terms`.
- If price is tied to a material index, it moves both ways and only on the share the material drives (`cost-trigger-rules`).
- Shared savings: when a factory's cost-down idea passes its test, agree in writing how the saving is split (for example half each for the first year). Never offer or accept side payments to staff on either side.

A price cut that lowers quality shows up later as returns. Watch the return rate on the first lot made at the new price for 90 days and compare it with the last lot.

### 6. Run the messages

Send one message at a time, wait for the reply, update the plan. Stop at the walk-away and move to the alternative; say so politely, and leave the door open.

For factories in China, send each message in English and Simplified Chinese with a back-translation (`bilingual-supplier-messages`) and confirm every agreed number by email. If Accio runs the talks, give it hard limits: it may report a number as acceptable pending the owner's approval, but it may never accept a price, MOQ, deposit or order.

### 7. Market notes

- **Domestic makers anywhere:** they often quote including VAT or sales tax, or with freight extra; negotiate on the price before tax and ask who pays freight to the 3PL. Keep advances to the sample or first lot until trust is built. Ask for credit of 15 to 30 days on repeat orders (practitioner default, test it).
- **US imports:** tariffs can change between quote and shipment. Agree in writing who carries a tariff change before the goods ship, and on what price basis.
- **UK, EU and Australian imports:** import VAT or goods and services tax and duty are due at the border; agree the Incoterm (for example FOB or DDP) so it is clear who pays them.

## Checks before you hand it over

- Each term has a target, fallback and walk-away, with the maths shown.
- The price walk-away comes from gross profit per order, not from the competing quote.
- The minimum order walk-away fits both the sell-through window and the cash forecast.
- Every ask has a matching give.
- Payment term and price-break asks are priced in money with the formula shown.
- Tooling ownership and any index clause are in the protection terms.
- Spec, inspection and price-hold terms are in the plan.
- Each message is short, has one ask, and has client approval.
- Nothing was accepted on the store's behalf without a written client yes.

## Output

**One-screen summary:** what to ask for, in what order, what the store will give, and the walk-away on each term. Expected saving per unit and per year at the planned volume.

**Negotiation plan:**

| Term | Current offer | Target | Fallback (with trade) | Walk-away | Why (the maths) |
|---|---|---|---|---|---|
| Unit price | | | | | |
| Minimum order | | | | | |
| Deposit and balance | | | | | |
| Credit after delivery | | | | | |
| Price hold | | | | | |

**Messages (fill and send in order):**

1. **Thanks and frame:** "Thank you for the quote. We want to work with you and plan [12-month volume]. Before we order, we need to close three points: [terms]."
2. **The main ask with the give:** "If we commit to [give], can you offer [ask]? Our other quote is at [number] on [basis]."
3. **The second ask:** "On payment, we can [give]. Could you accept [deposit or terms]?"
4. **Protection terms:** "Please confirm in writing: price held until [date], spec version [x] with no material changes without our written OK, and balance paid after inspection passes."
5. **Close or walk:** "Thank you. We can confirm at [terms]." or "We cannot make [term] work, so we will proceed elsewhere for this order and would like to stay in touch for the next."

## Common mistakes

- **No walk-away.** Steps 1 and 2 set it before the first message.
- **Winning a price, losing on quality.** Gate 4 and step 5 lock spec and inspection.
- **Taking a huge minimum for a lower price.** Step 2 caps it by sell-through and cash.
- **Asking without giving.** Step 3 lists what the store can trade.
- **Forgetting terms.** Step 4 treats days of credit as money.
- **Naming the rival supplier.** Step 4 shares numbers only.
- **Squeezing until quality goes.** Step 4 stops when the only route is cheaper materials or skipped checks.
- **Taking a price tier that costs more to hold.** Step 4 judges it on total yearly cost.

## Sources

- COG-0002: volume credits from labour utilisation, 1 to 3 dollars a unit.
- COG-0003: let factories know you have alternatives.
- COG-0010: bulk tiers cut unit cost.
- COG-0013: change-of-control and most-favoured-nation clauses with a sole supplier.
- FIN-0004: factory financing of longer terms; share the cost.
- FIN-0005: float equals payment terms minus lead time.
- FIN-0011: inventory-funded growth can wipe out profit.
- FIN-0012: price bottom-up from the profit target.
- FIN-0023: grow on supplier net terms and honour them.
- OPS-0014: forecast from in-stock days only.
- COG-6291: paying more for longer terms can be a dear loan.
- University of Houston, Operations Management Chapter 3: Inventory Management (quantity discounts): https://www.bauer.uh.edu/egardner/3301H%20Operations%20Management/OM%20Text/3INVENTORY%20MANAGEMENT-1.pdf
- QualityInspection.org, Is It Possible To Get Credit from a Chinese Supplier?: https://qualityinspection.org/payment-credit-chinese-factory/
- QualityInspection.org, China Supplier Vetting Part 10: Pricing, Negotiation, Contracts: https://qualityinspection.org/pricing-negotiation-contracts/
- Fair Wear, Labour Minute and Product Costing Calculator guidance: https://api.fairwear.org/wp-content/uploads/2020/06/Guidance-for-Use-of-the-Fair-Wear-Labour-and-Minute-and-Product-Costing-Calculator-Final.pdf
- Harris Sliwoski, Who Owns Your Molds?: https://harris-sliwoski.com/chinalawblog/who-owns-your-molds-how-overseas-factories-hold-tooling-hostage-and-how-to-stop-them/
- BLS, Price Adjustment Guide for Contracting Parties: https://www.bls.gov/ppi/publications/price-adjustment-guide-for-contracting-parties.htm

What makes this skill ours: walk-away points come from gross profit per order and the cash forecast, not from the other quote; the minimum order is capped by sell-through days; payment terms are bargained as money; and every price win is protected by a spec lock, inspection and a 90-day return watch on the first cheaper lot.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Domestic makers often quote including GST or with freight extra; negotiate on ex-GST price and ask who pays freight to the 3PL. Advance by UPI is common; keep advances to the sample or first lot until trust is built.
