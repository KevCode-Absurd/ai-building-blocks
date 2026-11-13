---
name: set-up-taxes-gst-and-us-sales-tax
description: "Sets up a Shopify store's tax settings for India GST and US sales tax from the store's own registrations and product list: which states or regions collect, tax-inclusive or tax-added prices, product rate overrides, HSN codes, shipping taxability, GST invoices, and a monthly nexus watch for the US. Ends with a one-page list of questions for the store's accountant, so nothing is set on a guess. Does not give tax rulings: it puts in what the accountant confirms and proves it works with test orders. Use before launch, when a store starts selling in another state or country, when GST rates change, or when invoices or tax lines look wrong."
---

# Taxes: GST and US sales tax setup

**You get:** a tax settings sheet (regions, rates, overrides, inclusive or added pricing, shipping rule) ready to enter in Shopify, a product tax map with HSN or tax codes for every product, an invoice set-up, a monthly US nexus watch, and a one-page accountant question list with the answers recorded.

## When to use

- A new store must set tax before taking real orders.
- An India store has products in more than one GST rate, or invoices that buyers reject.
- A US store is getting close to a sales threshold in another state.
- The store starts selling into a new country or adds a warehouse in a new state.
- Tax shown at checkout does not match what the accountant expects.

## Not for

- Deciding what the store legally owes or whether to register: that is the accountant's call; this skill records their answer.
- Duties and import taxes for a new country: use `set-up-markets-and-currencies`.
- Monthly profit and loss with tax lines: use `monthly-store-pnl`.
- Marketplace TCS and seller registration on Amazon or Flipkart: use `list-on-indian-marketplaces`.

## What you need

Required:

1. **Registrations:** GSTIN and the state it is in (India); list of US states where the store holds a sales tax permit, with permit numbers kept by the owner.
2. **Product list** export: Handle, Title, Product type, Variant SKU, Variant price, plus the HSN code (India) or product category (US) for each.
3. **Shopify order export**, last 12 months if trading: Created at, Subtotal, Shipping, Taxes, Shipping Province, Shipping Country, Refunded amount.
4. **Accountant's name and a way to reach them.** The agent drafts questions; the owner sends them.

Optional: Shopify's US tax liability insights page, previous GST returns, B2B customer list with GSTINs.

Checking settings is level 1. Entering tax regions, overrides and invoice app settings is level 2 (draft); the client approves before they go live. Missing HSN codes or registrations: stop and ask; do not guess a rate.

## Before you start: the gates

1. **Registrations confirmed in writing.** Pass when the accountant has said where the store must collect. Fail: keep tax collection off for that region and the store's password on for buyers there.
2. **Product rates confirmed.** Pass when every product has an HSN code and rate (India) or a category (US) the accountant agreed. Fail: list the open products and stop.
3. **Gross profit per order is computed net of tax.** Tax collected is never revenue [MEA-0010]. Fail: fix the margin sheet first (`build-sku-profit-sheet`).
4. **No rulings.** The agent never tells the client what they owe; it points to official guidance and the accountant.

## Steps

### 1. India: set the GST structure

1. Shopify does not file or remit GST and does not create a GST-compliant invoice [FIN-6205]. Plan an invoice app or service from the start.
2. Registration is generally mandatory above Rs 20 lakh turnover (Rs 10 lakh in North Eastern and hill states), and also for interstate supply of goods or marketplace selling [FIN-6205]. A store shipping across states usually needs a GSTIN from day one; the accountant confirms.
3. In Shopify, home-state sales carry CGST plus SGST, which Shopify shows as one combined charge; other states carry IGST [FIN-6205]. The default rates are a starting point only.
4. Products at a different rate: put them in a collection and add a tax override per rate. One collection per rate, named by the rate ("GST 5%"), never by product type alone.
5. Put each HSN code in the HS tariff code field (at least 6 digits); shorter codes go in a metafield [FIN-6205].
6. Prices: Indian buyers expect the shown price to include GST. Turn on tax-inclusive pricing and check the product page says "inclusive of all taxes".

### 2. India: invoices

Choose a GST invoice app or the accounting tool's invoicing, free or low-cost tier first. Each invoice must carry what the accountant lists; a common set is seller legal name, address, GSTIN, invoice number series, date, HSN, taxable value, rate, CGST and SGST or IGST split, place of supply and the buyer's GSTIN for B2B orders. Add a GSTIN field at checkout or in the account page for B2B buyers. Send the invoice with the shipping confirmation or the delivery message.

### 3. US: decide where to collect

1. Collect where the store has physical presence: an office, staff, or stock in a warehouse or 3PL [SET-0004] [FIN-6206].
2. Economic nexus starts when sales into a state pass its threshold, which differs by state and is measured on net sales [FIN-6206]. Shopify's tax liability insights page lists states needing action and moves a state to "Monitoring" at 80% of its threshold [FIN-6206].
3. Register with the state first, then turn on collection in Shopify and enter the permit number [FIN-6206]. Never collect tax in a state without a permit.
4. Decide shipping taxability per state with the accountant; states differ [SET-0004].
5. US prices are shown before tax; tax is added at checkout.

### 4. Product tax categories (US)

Assign each product a category so exempt or reduced items (some clothing, food or health items in some states) are handled. Leave nothing as "uncategorised" without the accountant's yes.

### 5. Other countries

For each country the store ships to, record whether the store collects tax there, whether prices should include tax, and whether duties are collected at checkout [SET-0004]. Duties set-up goes to `set-up-markets-and-currencies`. Without Shopify Payments, local currency may show only up to the cart [SET-0002], which affects how tax-inclusive prices read.

### 6. Test

Run test orders: home state, another state, a mixed-rate cart, a B2B order with GSTIN (India), a discounted order, a refund. For each, record subtotal, tax lines, shipping tax and invoice. The tax on the order must match a hand calculation from the confirmed rate.

### 7. Monthly watch

On the first working day: US liability insights page status by state; India rate changes notified by the GST Council; new products without HSN or category; tax collected per Shopify against what the accounting system received, since accounting usually sees only net revenue [FIN-0010]. Send the totals to the accountant before filing dates.

## Checks before you hand it over

- Every product has an HSN code and rate (India) or a tax category (US); none blank.
- Each override collection is named by its rate and contains only products at that rate.
- India: tax-inclusive pricing on, invoice app producing an invoice with the CGST, SGST or IGST split on a test order.
- US: collection is on only in states with a permit number on file.
- Test order taxes match a hand calculation to the paisa or cent.
- The accountant question list has an answer, a date and a name for every line.
- No line in the deliverable states what the store owes on the agent's own authority.

## Output

**One-screen summary:** where the store collects, inclusive or added pricing, number of products per rate, invoice method, US states in Monitoring, and open accountant questions.

**Tax settings sheet:**

| Region | Collect (yes or no) | Registration or permit on file | Rate or method | Shipping taxed | Prices include tax | Confirmed by and date |
|---|---|---|---|---|---|---|

**Product tax map:**

| SKU | Title | HSN code or US category | Rate | Override collection | Confirmed |
|---|---|---|---|---|---|

**Accountant question list** (owner sends it):

1. In which states or regions must we register and collect now?
2. Which GST rate applies to each HSN code on our list?
3. Is our shipping charge taxed, and at what rate?
4. What must each invoice show, and do we need e-invoicing at our turnover?
5. Which US states are close to a threshold, counting sales outside Shopify?
6. How do we treat discounts, refunds and gift cards for tax?

**Monthly watch log:** Date, US states in Monitoring, new products without codes, tax collected (Shopify), tax booked (accounts), gap, action.

## Common mistakes

- **Trusting Shopify's default India rates.** They are a starting point [FIN-6205]. Step 1 sets overrides per rate.
- **No GST invoice.** Shopify's order email is not one [FIN-6205]. Step 2.
- **Collecting before registering.** Tax collected without a permit is a problem of its own [FIN-6206]. Step 3 registers first.
- **Counting tax as revenue.** It inflates gross profit [MEA-0010]. Gate 3.
- **Missing the threshold creep.** Step 7 checks the 80% Monitoring list monthly.
- **One override per product type.** Rates follow HSN, not how the menu groups products. Step 1 names collections by rate.

## Sources

- SET-0002: without Shopify Payments, checkout charges the base currency.
- SET-0004: tax where you have presence; shipping taxability by state; inclusive pricing.
- FIN-0010: accounting usually receives only net revenue; report gross to net.
- MEA-0010: cash collected is net sales plus shipping; tax is not revenue.
- FIN-6205: Shopify India GST settings, HSN field, no GST invoice, no filing.
- FIN-6206: US physical and economic nexus, 80% Monitoring, register before collecting.

What makes this skill ours: nothing is set on the agent's guess, because every rate traces to a named accountant answer; India override collections are named by rate so mixed carts tax correctly; US collection starts only after a permit; and a monthly watch catches threshold creep and the gap between tax collected and tax booked.
