---
name: set-up-pre-orders-and-backorders
description: "Pre-order and backorder set-up for a store: which products may sell before stock lands, the unit cap per product, the ship date to promise, how payment is taken (full, deposit or at shipping), the wording on the product page, cart, confirmation and update messages, and the delay, cancel and refund rules, all matched to Shopify settings and the consumer rules of the markets the store sells to (US, UK, EU, Canada, Australia and others). Use when stock is on the water, a launch is weeks away, a best seller is about to sell out, or past pre-orders caused angry buyers and refund requests."
---

# Pre-orders and backorders

**You get:** a set-up sheet per product (mode, cap, promised date, payment method, settings), the buyer-facing wording for the product page, cart, checkout note, confirmation and three update messages, a delay and refund rule card, and a one-screen summary of what goes live once the client approves.

## When to use

- A purchase order is confirmed or shipped and the store wants to sell it before it arrives.
- A new product launches in a few weeks and the owner wants orders now.
- A best seller will sell out before the restock lands.
- Past pre-orders brought angry messages, chargebacks or a flood of "where is my order" tickets.

## Not for

- Testing demand for a product that does not exist yet: use `validate-demand-before-buying-stock`.
- The message set for orders that are already late: use `delay-and-stockout-customer-messages`.
- Order dates and quantities for the restock itself: use `set-reorder-points-and-safety-stock`.
- Writing the shipping policy page: use `write-store-policy-pages`.

## What you need

Required:

1. **Open purchase orders**: supplier, SKU, units, confirmed ship date, mode (air or sea), expected arrival at the warehouse. A quote is not enough; the supplier must have confirmed production or shipped.
2. **Current stock and daily sales speed per SKU** (from `set-reorder-points-and-safety-stock` if it exists).
3. **Store platform and payment providers**, with the countries the store sells to.
4. **Receiving time** at the warehouse or 3PL, from past deliveries.
5. **Current shipping promise** and policy pages.

Optional: waitlist or back-in-stock sign-ups per product, past pre-order results, defect rate on past orders from this supplier.

Settings, product page text and apps are prepared at draft access (level 2). Turning pre-orders on, charging buyers or messaging them needs the client's yes.

## Before you start: the gates

1. **Stock is real.** Pass when units are in production with a confirmed date or already shipped. Fail: no pre-order. Use a waitlist instead.
2. **Profit per order holds.** Pass when gross profit per order stays positive after any pre-order discount, split shipping and refund risk. Fail: drop the discount or the split shipment.
3. **Payment rules fit.** Pass when the store's provider supports the chosen payment method. Shopify pre-orders need Shopify Payments or PayPal Express and a pre-order app [OPS-6282]. Fail: use backorder mode with full payment only, or prepaid without deposits.
4. **Capacity on arrival.** Pass when the warehouse can pick and ship the pre-order backlog within 3 working days of receiving. Fail: lower the cap or stagger the promised dates.

## Steps

### 1. Pick the mode per product

- **Backorder:** a normal stocked product briefly out of stock, with a restock under about 3 weeks away. Uses Shopify's Continue selling when out of stock, which works only with inventory tracked, takes full payment and shows nothing special by default [OPS-6283]. Add a theme or app message so buyers see the date.
- **Pre-order:** a launch, or a restock more than about 3 weeks away. Uses a pre-order app with its own selling plan, which can take full, partial or no payment at order and charge the rest at fulfilment [OPS-6282].
- **Waitlist only:** restock date unknown, or supplier not confirmed. Collect back-in-stock sign-ups; take no money.

The 3-week line is a practitioner default; test it against the store's own cancel rate.

### 2. Set the promised date

Promised ship date = expected warehouse arrival + receiving days + pick and pack days for the backlog + a buffer.

Buffer: 7 days for air, 14 days for sea or domestic factory runs, as a practitioner default. Show a specific date or week, padded so the store usually beats it; specific delivery dates lift conversion, and accuracy should stay above 90% [CXP-0010]. Lead times from overseas factories can run 20 to 30 days of production plus 30 to 40 days at sea [COG-0008]; never promise from the production date alone.

Market rules: in the US, a stated ship time needs a reasonable basis, and with no stated time the store must ship within 30 days [CXP-6160]; a pre-order without a stated date is a 30-day promise. In the UK and EU, goods must arrive within 30 days unless a different date was agreed, so the pre-order date must be stated before purchase. Australia's consumer law and Canada's provincial rules also expect delivery by the date given. Check your market's rules before opening.

### 3. Set the cap

Cap = confirmed incoming units x (1 minus defect allowance) minus units held for normal in-stock buyers after arrival.

Defect allowance: the supplier's real rate, or 3% if unknown; one practitioner saw 300 faulty units in 10,000 [COG-0009]. Held units: daily speed x days from arrival to the next restock, if the store wants to keep selling in stock after the backlog ships. Set the app or inventory to stop selling at the cap. When the cap is hit, switch the product to waitlist.

### 4. Choose how payment is taken

| Situation | Payment | Why |
|---|---|---|
| Date within 30 days, confirmed shipment | Full at order | Simple, cash early |
| Date 30 to 90 days out | Deposit or no charge until shipping | Fewer refund requests while waiting |
| Launch with uncertain quantity | No charge until shipping | Buyers can drop out without a refund |

Payment notes: keep pay on delivery off for pre-orders by default where the store offers it; a buyer waiting weeks is more likely to refuse a parcel paid at the door, and every refusal costs two-way shipping. Offer card, wallet or local bank payment upfront instead. Ask the accountant when VAT or sales tax is due on deposits and advance payments (UK and EU VAT is often due when the payment is received) and how the invoice is dated. Charging in full at order is allowed in most markets, but delay and refund rules in step 7 then apply to money already taken; some card schemes also limit how far ahead of shipping a card can be charged.

### 5. Write the buyer-facing wording

Every place says the same date and the same rule:

- **Product page, near the button:** "Pre-order. Ships by [date]. You can cancel for a full refund any time before it ships." Change the button text to "Pre-order".
- **Cart line:** product name with "Pre-order, ships by [date]".
- **Mixed carts:** state whether in-stock items ship now or wait. Shipping them separately doubles shipping cost; only do it when gross profit per order still holds. Otherwise "Your whole order ships together by [date]."
- **Order confirmation:** the date, the payment rule ("You paid a deposit of X; the rest is charged when it ships"), and how to cancel.
- **Update 1 (when stock leaves the factory or port):** stock is on the way, date confirmed.
- **Update 2 (on arrival at the warehouse):** packing has started, ships within N days.
- **Update 3 (shipped):** tracking link.

Proactive updates cut "where is my order" contacts [CXP-0014]. Send updates by email; WhatsApp only to buyers who opted in, as utility messages with no offer inside.

### 6. Set ads and feeds

Do not send cold ad traffic to a pre-order page unless the plan says so, and tell the media buyer which products are on pre-order. Mark catalog and feed availability as pre-order or backorder with the date where the platform supports it. A sell-out with a quick restock can build demand; one brand's rule was a restock in two weeks or less [ORG-0038].

### 7. Write the delay, cancel and refund rules

- **Cancel any time before shipping** for a full refund, from a link in every message.
- **If the date will slip:** tell buyers before the promised date passes, with a new date or the reason there is none, and the right to cancel. For US buyers, silence can count as agreement only for a first delay of 30 days or less; longer or open-ended delays need an automatic cancel if the buyer does not answer, and a second delay needs a fresh yes [CXP-6160]. In the UK and EU, if the agreed date passes, the buyer may set a new date or cancel and get a full refund.
- **Refunds** within 7 working days for US buyers, and within 14 days of cancellation in the UK and EU, in the original payment method, never as store credit unless the buyer chooses it; no different colour or size sent without the buyer's yes [OPS-6281].
- **All markets:** state the cancellation and refund terms on the product page and policy page before purchase, and refund to the original method; check the store's obligations under its market's consumer and e-commerce rules with the client's adviser. UK and EU buyers also keep their 14-day right to cancel after delivery.

Hand the actual delay messages to `delay-and-stockout-customer-messages`.

### 8. Prepare the arrival day

Before the stock lands: count the pre-orders per SKU, print or queue labels, plan the pick order (oldest orders first), and book extra packing hands if the backlog is above two normal days. Capture the remaining payment for deposit orders, and plan what happens to failed charges (one retry, then a message, then cancel after 7 days, as a practitioner default).

## Checks before you hand it over

- Every pre-order product has a confirmed purchase order, not a quote.
- The promised date is arrival + receiving + backlog + buffer, and matches on page, cart and confirmation.
- The cap is set in the app or inventory and switches to waitlist when hit.
- The payment method fits the store's provider and the date gap.
- Pay on delivery is off for pre-orders unless the client chose otherwise in writing.
- Every message has a cancel link and the refund rule.
- The delay rule meets the notice rules for each market (US 30-day rule, UK and EU agreed-date rule).
- Nothing is switched on and no buyer is charged or messaged without the client's yes.

## Output

1. **One-screen summary:** products going on pre-order or backorder, caps, promised dates, payment method, and the arrival-day plan.
2. **Set-up sheet:**

| Column | What goes in it |
|---|---|
| SKU, Product | |
| Mode | Backorder, pre-order, waitlist |
| PO number, Confirmed ship date, Mode of transport | |
| Expected arrival, Receiving days, Buffer | |
| Promised ship date | |
| Cap | Units, with the working |
| Payment | Full, deposit (amount), at shipping |
| Pay on delivery | Off or on, with reason |
| Platform setting | App or Continue selling, with exact setting |
| Feed availability | Pre-order or backorder, date |

3. **Wording set:** product page line, button text, cart line, mixed-cart line, confirmation block, three update messages.
4. **Delay and refund rule card** for support.
5. **Arrival-day checklist.**

## Common mistakes

- **Opening pre-orders on a supplier's quote.** Gate 1 requires confirmed production.
- **Promising the factory's date.** Step 2 adds transit, receiving, backlog and a buffer.
- **No cap.** Step 3 limits orders to units that will really arrive.
- **Pay on delivery on long pre-orders.** Step 4 keeps them paid upfront.
- **Store credit instead of refunds.** Step 7 refunds to the original method.
- **Silence after the order.** Step 5 sets three updates before tracking.

## Sources

- CXP-6160: US ship-time basis, 30-day default and delay notices.
- OPS-6281: backorders, no substitutes, no store-credit refunds.
- OPS-6282: Shopify pre-order payment options and requirements.
- OPS-6283: Shopify Continue selling when out of stock.
- CXP-0010: specific padded delivery dates.
- CXP-0014: proactive updates cut order-status tickets.
- COG-0008: production and transit lead times.
- COG-0009: defect allowance on bulk orders.
- ORG-0038: sell-outs only with a fast restock.

What makes this skill ours: pre-orders open only on a confirmed purchase order; the cap is net of defects and units held for in-stock buyers; payment method follows the date gap and keeps pay on delivery off; and one promised date runs through page, cart, confirmation and updates, with US, UK and EU delay rules built in.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Keep COD off for pre-orders by default; a buyer waiting weeks is more likely to refuse a COD parcel, and every refusal costs two-way shipping. Offer UPI or card prepaid instead. Ask the accountant when GST is due on advance payments and how the invoice is dated. State the cancellation and refund terms on the product page and policy page before purchase, and check the store's obligations under the Consumer Protection (E-Commerce) Rules, 2020 with the client's adviser.
