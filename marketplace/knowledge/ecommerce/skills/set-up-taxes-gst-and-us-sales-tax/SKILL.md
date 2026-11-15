---
name: set-up-taxes-gst-and-us-sales-tax
description: "Sets up a Shopify store's tax settings for VAT and sales tax in the markets it sells to (US state sales tax, UK and EU VAT, Canada's and Australia's sales taxes and others) from the store's own registrations and product list: which states, countries or regions collect, tax-inclusive or tax-added prices, product rate overrides, HS codes, shipping taxability, compliant invoices, and a monthly threshold watch. Ends with a one-page list of questions for the store's accountant, so nothing is set on a guess. Does not give tax rulings: it puts in what the accountant confirms and proves it works with test orders. Use before launch, when a store starts selling in another state or country, when tax rates change, or when invoices or tax lines look wrong."
---

# Taxes: sales tax and VAT setup

**You get:** a tax settings sheet (regions, rates, overrides, inclusive or added pricing, shipping rule) ready to enter in Shopify, a product tax map with HS or tax codes for every product, an invoice set-up, a monthly threshold watch for every market, and a one-page accountant question list with the answers recorded.

## When to use

- A new store must set tax before taking real orders.
- A store sells products at more than one VAT rate, or sends invoices that business buyers reject.
- A US store is getting close to a sales threshold in another state.
- A store starts selling into a new country (for example a US store into the UK or EU, or an EU store into the UK), or adds a warehouse in a new state or country.
- Tax shown at checkout does not match what the accountant expects.

## Not for

- Deciding what the store legally owes or whether to register: that is the accountant's call; this skill records their answer.
- Duties and import taxes for a new country: use `set-up-markets-and-currencies`.
- Monthly profit and loss with tax lines: use `monthly-store-pnl`.
- Tax collected by marketplaces (Amazon, Walmart, Etsy, eBay and others often collect it for the seller under marketplace facilitator or deemed supplier rules): record which sales they cover here, and set up the listings with the marketplace's own tools.

## What you need

Required:

1. **Registrations:** every tax registration the store holds and where: US states with a sales tax permit, UK VAT number, EU VAT number or One Stop Shop (OSS) or Import One Stop Shop (IOSS) registration, Canadian and Australian tax registrations, and any others, with numbers kept by the owner.
2. **Product list** export: Handle, Title, Product type, Variant SKU, Variant price, plus the HS code and product category for each.
3. **Shopify order export**, last 12 months if trading: Created at, Subtotal, Shipping, Taxes, Shipping Province, Shipping Country, Refunded amount.
4. **Accountant's name and a way to reach them.** The agent drafts questions; the owner sends them.

Optional: Shopify's US tax liability insights page, previous VAT or sales tax returns, B2B customer list with VAT or tax numbers.

Checking settings is level 1. Entering tax regions, overrides and invoice app settings is level 2 (draft); the client approves before they go live. Missing HS codes, rates or registrations: stop and ask; do not guess a rate.

## Before you start: the gates

1. **Registrations confirmed in writing.** Pass when the accountant has said where the store must collect. Fail: keep tax collection off for that region and the store's password on for buyers there.
2. **Product rates confirmed.** Pass when every product has an HS code and rate (VAT markets) or a category (US) the accountant agreed. Fail: list the open products and stop.
3. **Gross profit per order is computed net of tax.** Tax collected is never revenue [MEA-0010]. Fail: fix the margin sheet first (`build-sku-profit-sheet`).
4. **No rulings.** The agent never tells the client what they owe; it points to official guidance and the accountant.

## Steps

### 1. VAT markets: set the structure

This covers the UK, the EU and other countries with a VAT or goods and services tax (for example Australia, New Zealand, Norway and Switzerland).

1. Shopify calculates the tax on orders but does not file or remit it, and its order email may not meet every country's invoice rules [FIN-6205]. Plan an invoice app or service from the start.
2. Registration rules differ by country; the accountant confirms. Common triggers: turnover above the home country's threshold; sales to consumers in other EU countries above the EU-wide distance selling threshold, handled through OSS; sellers outside the EU selling low-value goods to EU consumers, often through IOSS; sellers outside the UK selling goods of up to 135 pounds to UK consumers, who charge UK VAT at checkout; and low-value import rules in Australia and New Zealand. A store shipping across borders may need a registration from day one.
3. In Shopify, add each registration number, turn on collection for that country or for OSS, and check which rate applies. The default rates are a starting point only.
4. Products at a different rate (reduced or zero rates such as children's clothing, books or some food in some countries): put them in a collection and add a tax override per rate. One collection per rate, named by the rate ("VAT 5%"), never by product type alone.
5. Put each HS code in the HS tariff code field (at least 6 digits); it also feeds customs and duty estimates. Longer national codes go in a metafield.
6. Prices: buyers in the UK, EU, Australia and New Zealand expect the shown price to include tax. Turn on tax-inclusive pricing and check the product page says "including VAT" or "including tax".

### 2. VAT markets: invoices

Choose an invoice app or the accounting tool's invoicing, free or low-cost tier first. Each invoice must carry what the accountant lists; a common set is seller legal name, address, VAT number, invoice number series, date, description and quantity, taxable value, rate and tax amount per rate, and the buyer's VAT number for B2B orders. For B2B sales to another EU country, the invoice may need to show reverse charge wording instead of VAT. Add a VAT number field at checkout or in the account page for B2B buyers, and check numbers against the official checker (VIES in the EU). Send the invoice with the shipping confirmation or the delivery message. Ask whether e-invoicing applies; several countries now require it for business sales.

### 3. US: decide where to collect

1. Collect where the store has physical presence: an office, staff, or stock in a warehouse or 3PL [SET-0004] [FIN-6206].
2. Economic nexus starts when sales into a state pass its threshold, which differs by state and is measured on net sales [FIN-6206]. Shopify's tax liability insights page lists states needing action and moves a state to "Monitoring" at 80% of its threshold [FIN-6206].
3. Register with the state first, then turn on collection in Shopify and enter the permit number [FIN-6206]. Never collect tax in a state without a permit.
4. Decide shipping taxability per state with the accountant; states differ [SET-0004].
5. US prices are shown before tax; tax is added at checkout.

### 4. Product tax categories (US)

Assign each product a category so exempt or reduced items (some clothing, food or health items in some states) are handled. Leave nothing as "uncategorised" without the accountant's yes.

### 5. Other countries

For each other country the store ships to, record whether the store collects tax there, whether prices should include tax, and whether duties are collected at checkout [SET-0004]. Canada has a federal sales tax plus provincial or harmonized taxes that differ by province, and non-resident sellers may need to register once sales pass the small-supplier line. Duties set-up goes to `set-up-markets-and-currencies`. Without Shopify Payments, local currency may show only up to the cart [SET-0002], which affects how tax-inclusive prices read.

### 6. Test

Run test orders: home state or country, another state or country, a mixed-rate cart, a B2B order with a VAT number, a discounted order, a refund. For each, record subtotal, tax lines, shipping tax and invoice. The tax on the order must match a hand calculation from the confirmed rate.

### 7. Monthly watch

On the first working day: US liability insights page status by state; sales into each VAT country against its threshold; rate changes announced by each tax authority; new products without an HS code or category; tax collected per Shopify against what the accounting system received, since accounting usually sees only net revenue [FIN-0010]. Send the totals to the accountant before filing dates.

## Checks before you hand it over

- Every product has an HS code and rate (VAT markets) or a tax category (US); none blank.
- Each override collection is named by its rate and contains only products at that rate.
- VAT markets: tax-inclusive pricing on, invoice app producing an invoice with the VAT number and rate split on a test order.
- US: collection is on only in states with a permit number on file.
- Collection is on only in countries or schemes (OSS, IOSS) with a registration on file.
- Test order taxes match a hand calculation to the cent or penny.
- The accountant question list has an answer, a date and a name for every line.
- No line in the deliverable states what the store owes on the agent's own authority.

## Output

**One-screen summary:** where the store collects, inclusive or added pricing, number of products per rate, invoice method, US states in Monitoring, countries near a threshold, and open accountant questions.

**Tax settings sheet:**

| Region | Collect (yes or no) | Registration or permit on file | Rate or method | Shipping taxed | Prices include tax | Confirmed by and date |
|---|---|---|---|---|---|---|

**Product tax map:**

| SKU | Title | HS code or US category | Rate | Override collection | Confirmed |
|---|---|---|---|---|---|

**Accountant question list** (owner sends it):

1. In which states, countries or regions must we register and collect now?
2. Which VAT or sales tax rate applies to each product on our list?
3. Is our shipping charge taxed, and at what rate?
4. What must each invoice show, and do we need e-invoicing at our turnover or in our markets?
5. Which US states and which countries are close to a threshold, counting sales outside Shopify?
6. How do we treat discounts, refunds and gift cards for tax?
7. Which marketplace sales are already taxed by the marketplace?

**Monthly watch log:** Date, US states in Monitoring, countries near a threshold, new products without codes, tax collected (Shopify), tax booked (accounts), gap, action.

## Common mistakes

- **Trusting Shopify's default rates.** They are a starting point [FIN-6205]. Step 1 sets overrides per rate.
- **No proper invoice.** Shopify's order email is not one in many VAT countries [FIN-6205]. Step 2.
- **Collecting before registering.** Tax collected without a permit is a problem of its own [FIN-6206]. Step 3 registers first.
- **Counting tax as revenue.** It inflates gross profit [MEA-0010]. Gate 3.
- **Missing the threshold creep.** Step 7 checks the 80% Monitoring list and each country's threshold monthly.
- **One override per product type.** Rates follow the product's tax class, not how the menu groups products. Step 1 names collections by rate.
- **Showing pre-tax prices to UK, EU or Australian buyers.** Step 1 turns on tax-inclusive pricing for those markets.

## Sources

- SET-0002: without Shopify Payments, checkout charges the base currency.
- SET-0004: tax where you have presence; shipping taxability by state; inclusive pricing.
- FIN-0010: accounting usually receives only net revenue; report gross to net.
- MEA-0010: cash collected is net sales plus shipping; tax is not revenue.
- FIN-6205: Shopify settings for a goods and services tax: HS code field, no compliant invoice, no filing.
- FIN-6206: US physical and economic nexus, 80% Monitoring, register before collecting.

What makes this skill ours: nothing is set on the agent's guess, because every rate traces to a named accountant answer; override collections are named by rate so mixed carts tax correctly; collection starts only after a registration or permit; and a monthly watch catches threshold creep in every market and the gap between tax collected and tax booked.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Key points: Shopify does not file GST or create a GST-compliant invoice [FIN-6205]. Registration is generally mandatory above Rs 20 lakh turnover (Rs 10 lakh in North Eastern and hill states), and also for interstate supply or marketplace selling. Home-state sales carry CGST plus SGST, shown as one charge; other states carry IGST. Put HSN codes in the HS tariff code field. Indian buyers expect prices "inclusive of all taxes". Invoices need GSTIN, HSN, place of supply and the CGST, SGST or IGST split; B2B buyers give a GSTIN. Watch GST Council rate changes monthly. Marketplace TCS goes to `list-on-indian-marketplaces`.
