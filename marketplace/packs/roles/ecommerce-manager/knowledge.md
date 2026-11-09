# Ecommerce manager: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked. This kit covers the shop side of an online store: catalogue, product data and feeds, merchandising, order value and digital products. For themes, speed and checkout set-up, see the Shopify specialist kit. For product and collection copy, see the ecommerce copywriter kit. For Amazon, see the Amazon marketplace manager kit. For Shopping and Meta campaigns, see the media buyer kits.

## 1. What this role is for

A shop hires an ecommerce manager when shoppers can't find things, products are missing from Google or Meta, stock sits too long, or each order is smaller than it could be. The work covers five areas:

- **Catalogue:** the category tree, the attributes each product needs, filters, variants and tags, and the import template that keeps new products tidy.
- **Product data and feeds:** clean Google and Meta product feeds, disapprovals fixed, titles and missing attributes filled from real data.
- **Merchandising:** what goes on the home page and at the top of each collection each week, and a plan to clear slow stock in time.
- **Order value:** bundles, add-ons and delivery thresholds that buyers want and that keep margin.
- **Digital products:** templates, printables and downloads, from the product ladder to listings and delivery emails.

Who hires it: shops with a hundred or more products and messy filters; shops whose products are disapproved in Merchant Center; seasonal retailers who must clear a range on time; stores with repeat buyers that want a bigger basket; creators selling digital products.

What good work looks like: a shopper narrows a range to a few products in a couple of clicks; every product sits in one clear category with complete attributes; feeds have few issues and none that block best sellers; homepage and collection slots follow written rules based on stock and sales; markdowns have dates and floor prices; bundles make sense to the buyer and keep margin; every price, saving and deadline is true.

How it is judged: filter and site search use and exits, feed issues and disapprovals, sell-through and weeks of cover, gross margin, average order value and units per order (with margin, not instead of it), returns, complaints, and whether every price and offer claim holds up.

## 2. The canon

These are the frameworks practitioners rely on, summarised in my own words.

**Filters and facets (Nielsen Norman Group, Kathryn Whitenton, 2014) [1].** A filter removes items that don't match one criterion; faceted navigation is a full set of filters that together describe the range. Facets suit large, varied ranges, but every facet needs data on every current and future product, and more options add effort for shoppers. Confirm shoppers need a facet before building it.

**Baymard Institute, product lists and filtering [2].** Baymard's original testing of 19 leading sites found more than 700 usability issues in product lists, filtering and sorting, which became its guidelines. Its benchmark of 344 sites rates over a third as having flaws severe enough to harm shoppers' ability to find products. The numbers are in section 4.

**Google's guidance on ecommerce structure [3][4][5].** Link from menus to categories to products, and link to every product you want indexed. Promote best sellers from the home page. Filters can create huge numbers of URLs, so decide which filtered pages should be crawled at all. Group variants so search engines see one product with options.

**Retail maths, as Shopify defines it [13].** Sell-through: units sold divided by units sold plus units still in stock, over the last 30 days. Days of inventory remaining: stock on hand divided by average daily sales over the last 28 days (divide by 7 for weeks of cover). ABC analysis: A products make 80% of revenue, B the next 15%, C the last 5%. These are the shared language of merchandising decisions.

**The product data model.** Google's product data specification has become the de facto model for product data, because Google, Meta and most marketplaces ask for similar fields: id, title, description, link, image, availability, price, brand and identifiers, plus attributes that tell variants apart [8][12]. Shopify's Standard Product Taxonomy gives each product one standard category with category-specific attributes [6].

**Product pages and consistency (NN/g) [30].** Shoppers compare across variants and products, so the same details should appear in the same way for each; shipping costs shown early change which product people choose.

## 3. How the work is done now

### Catalogue structure

- **Category tree.** Name categories in shoppers' words, give each product one clear home, and keep the tree shallow enough to scan. Use collections or tags for cross-cutting groups (gifts, sale, new) rather than duplicating categories.
- **Standard categories (Shopify, as of Nov 2026).** Each product should be assigned one category from Shopify's Standard Product Taxonomy; Shopify suggests one with AI from the name, description and images. Category metafields hold attributes such as size, fabric or colour; colour entries can be reused as variant options and shown as swatches. The category feeds Shopify Tax, sales channels such as Google and Facebook, filters and reports, so a wrong category can cause tax and listing errors [6].
- **Filters (Shopify Search & Discovery, as of Nov 2026).** Up to 25 filters per store from standard sources (availability, category, price, product type, tags, vendor) and custom ones (product options and metafields). Collections with more than 5,000 products show no filters; a filter shows up to 100 values; values can be grouped under one label, for example several dark shades shown as "Black" [7].
- **Variants.** Decide what is a variant (same product, different size or colour) and what is a separate product (different use, material or price point). For search, Google's ProductGroup markup groups variants: on a single page, one canonical URL plus a preselectable URL per variant; each variant needs a unique ID such as a SKU or GTIN [5]. In Merchant Center, `item_group_id` is required for variants in Brazil, France, Germany, Japan, the UK and the US, and in free listings [8]; Meta uses the same field name for variant groups [12].
- **Navigation and crawling.** Category pages should link to every product to be indexed; products reachable only through site search may be missed. Use standard links, not JavaScript click events [3]. Filters multiply URLs: if filtered pages don't need to appear in search, block or canonicalise them; if some do, use the standard `&` separator, keep filter order consistent, and return a 404 for empty combinations [4].

### Product data and feeds (as of Nov 2026)

- **Google Merchant Center required fields:** id, title, description, link, image link, availability and price; brand for new products; GTIN where the manufacturer assigned one, or MPN if not. Apparel in the six listed countries needs colour, size, gender and age group. Bundles need `is_bundle` and multipacks need `multipack`. Product highlights (2 to 100, each up to 150 characters) and product details are optional extras [8].
- **Images:** Google has announced a minimum image size of 500 by 500 pixels for all product images, enforced from 31 January 2027 [8].
- **GTINs:** never guess, invent or reuse a GTIN; each variant has its own. Private-label and store-brand products usually have none, so leave it out and send brand and MPN. Leaving out a GTIN that exists can get a product disapproved [9].
- **Titles:** up to 150 characters, key details first, variant details included, no promotional text. AI-generated titles and descriptions go in `structured_title` and `structured_description` [10].
- **APIs:** Google describes its Merchant API (v1) as a redesign of the Content API for Shopping. Ask whether the client's feed app or platform integration has moved to it [11].
- **Meta catalogue:** required id, title, description, availability, condition, price, link and image link, plus brand, GTIN or MPN. Titles up to 200 characters (Meta recommends 65 or fewer), descriptions up to 9,999 characters of plain text, and the same `item_group_id` for all variants [12].
- **Where to fix.** Fix the store data first, so every channel gets the fix; use feed rules in the feed tool for channel-specific changes; use a supplemental sheet only for attributes the store can't hold. Every value must come from the client's data, never from a guess.

### Merchandising

- **Classify every product** from the exports: sell-through, weeks of cover, margin and sales trend. A working sort: hero (sells well, good stock), push (good margin, stock to move), clear (slow, too much cover), cut (slow and low margin), reorder (selling out). ABC grades from Shopify's report help, but they ignore cost, so add margin before deciding [13].
- **Trading calendar:** week by week, what to feature, where (home page slots, collection tops, emails) and why, tied to stock and selling dates.
- **Collection sorting:** written rules the team repeats, such as in-stock heroes first, new products in set slots, and no sold-out products in the first rows.

### Markdowns and price claims (general guidance, not legal advice)

- **EU.** A price reduction must state the prior price, which is the lowest price charged in at least the 30 days before the reduction (Price Indication Directive, Article 6a, added by Directive 2019/2161, applying from 28 May 2022; Commission guidance adopted 17 December 2021) [15]. On 26 September 2024 the Court of Justice ruled in Case C-330/23 that Aldi Süd's percentage reductions and "price highlight" claims must be calculated from that 30-day lowest price, not from the price just before the offer. In Aldi Süd's example, a banana price shown as -23% was the same as its lowest price of the previous 30 days [14]. The rule sets a minimum of 30 days, so check whether the country's own law asks for more.
- **UK.** Since 6 April 2025 the CMA can decide breaches itself and fine up to 10% of global turnover [17][21]. Falsely claiming that an offer is time-limited is banned outright. On 14 October 2026 the CMA fined Wayfair £4.8 million because many "Daily Deals" and 24-hour "Flash Deals" stayed at the same or a lower price after they ended [18]. CMA guidance lists a false claim of a specific price advantage among the things that mislead shoppers [17].
- **US.** The FTC applies the same truthfulness standard to price comparisons and "sale" prices as to other claims, and points sellers to its Guides Against Deceptive Pricing [16].
- **In practice:** keep a price history per product; set markdown steps with dates and floor prices; never raise a price before a sale; and make deadlines real, with prices going back up when they end.

### Order value

- **Bundles.** Shopify needs a bundles app; bundles sell through the Online Store, Shop and POS, and only fixed bundles carry over to Google and YouTube [24]. In Google feeds, flag bundles with `is_bundle` and describe the whole bundle in the title [8][10].
- **Delivery and thresholds.** Extra costs are the most common reason US shoppers abandon checkout (Baymard) [25]. In the UK, the CMA's price transparency guidance says mandatory charges, including delivery, belong in the total price; where delivery varies, shoppers need enough information to work it out; with several delivery options, show the cheapest until the shopper chooses [19]. Its open letter of 2 November 2026 tells online retailers to include mandatory delivery fees in the price at every stage, including product pages, baskets and marketplaces [20]. A free delivery threshold is fine; a price shown without mandatory delivery is not.
- **Add-ons.** Paid extras must be opt-in: in the EU a pre-ticked box is not consent [23]. In October 2026 the CMA fined Appliances Direct £1.2 million, partly for automatically adding paid removal and installation services [18].
- **Drip pricing enforcement.** On 19 August 2026 the CMA opened investigations into Trainline, Virgin Atlantic and RED Driving School over mandatory fees left out of headline prices, after fining others in ticketing and driving lessons [22].

### Reviews on the shop

The ecommerce manager often runs the review app, so its settings matter. In the US, the FTC's reviews rule (in force 21 October 2024) bans fake reviews, incentives tied to positive sentiment and review suppression [26]; Fashion Nova paid $4.2 million in 2022 after reviews under four stars were held back for about four years [27]. In the UK, businesses that publish reviews must take reasonable and proportionate steps to stop fake reviews and must not hide incentivised ones [28]. Set review apps to publish all genuine reviews on the same terms. The ecommerce copywriter kit covers how reviews are used in copy.

### Digital products

A digital shop sells a ladder: a free sample that shows the style, a low-price single product, a core product, a bundle, and an optional premium. Listings say exactly what's included, file types and sizes, and how delivery works. In the EU, the 14-day right of withdrawal does not apply to digital content once the buyer has expressly agreed to lose it and the download or streaming has started [29], so the checkout and delivery email must capture that step. Use rules (personal or business use, sharing, edits) are written in plain words from the seller's choices and checked by the seller; they are not legal advice.

## 4. Benchmarks and numbers

Use these to set expectations, never as promises.

- **Product list and filtering quality.** Baymard's benchmark of 344 large US and European sites (page viewed Nov 2026): 36% have product list flaws severe enough to harm shoppers' ability to find products, and the average site needs 35 design changes. In Baymard's testing, sites with mediocre product lists saw 67% to 90% abandonment, against 17% to 33% on sites with a slightly better toolset, for shoppers looking for the same kinds of product [2]. *Caveat:* large sites and Baymard's own scoring; lab tasks, not live revenue.
- **Checkout abandonment.** Baymard's average documented cart abandonment rate is 70.22%, from 50 studies published 2006 to 2025. Among US shoppers who abandoned during checkout, 40% cited extra costs, 20% slow delivery, and 12% not being able to see the total cost up front (page updated 28 October 2026) [25]. *Caveat:* US shoppers; the sample size isn't stated on the page; abandonment includes people never ready to buy.
- **ABC grades.** Shopify's report defines A as the products making 80% of revenue over 28 days, B the next 15%, C the last 5% [13]. *Caveat:* a definition, not a target; it ignores cost.
- **Enforcement as a measure of risk.** CMA fines under its new powers: Wayfair £4.8 million and Appliances Direct £1.2 million (October 2026) [18]; drip pricing fines on four businesses totalling over £5.1 million, with refunds over £1.35 million, by November 2026 [20].

No source gives a trustworthy "good sell-through", "good average order value" or "right free delivery threshold" across shops. Use the shop's own history and margin.

## 5. Decision rules

- If shoppers search for a product by a dimension (size, use, room, fit), make it a filter, and only if every product in that category has the value, because a filter with gaps hides products [1][7].
- If a product could live in two categories, give it one home and reach it from the other through a collection or link, because duplicates split data and confuse shoppers.
- If two products differ only in size or colour, make them variants of one product with one group ID, because channels and search treat them as one product [5][8][12].
- If filter values are messy (spelling, case, near-duplicates), merge them at the source, or group them in the filter app as a stopgap [7].
- If filtered pages don't need to rank, keep them out of crawling; if a few do (for example, "waterproof walking boots"), make those proper collections instead [4].
- If a feed issue blocks products, rank fixes by the number of products blocked and their sales, and fix the store data before adding feed rules, because store fixes reach every channel.
- If a GTIN is missing and the product has one, ask the client or manufacturer for it; if it is private label, send brand and MPN, because invented GTINs get products disapproved [9].
- If a product has more than enough weeks of cover to last its selling season, plan markdown steps now, with dates and floor prices, because late markdowns need deeper cuts.
- If a price cut is shown to EU shoppers, take the "was" price and the percentage from the lowest price of the previous 30 days [14][15].
- If an offer has a deadline, make sure the price really goes back up when it ends, or drop the deadline [18].
- If delivery is mandatory and charged, show UK shoppers the total including delivery wherever a price appears [19][20].
- If a bundle saves the buyer nothing they'd notice and costs margin, drop it; a bundle should solve a buyer's problem (a set, a refill pair, a starter kit).
- If an add-on costs extra, make it opt-in, never pre-ticked [23].
- If no access level has been agreed for a tool, work at level 1.

## 6. Common mistakes, and how to spot them

- **Categories named the company's way.** Spot it: internal range names in the menu, high site-search use for words that aren't in the menu.
- **Filters with missing values.** Spot it: products disappear when a filter is applied, though they match [7].
- **Duplicate filter values.** Spot it: "Navy", "navy" and "Navy Blue" as separate options.
- **Variants split into separate products,** or unrelated products forced into one. Spot it: reviews spread over near-identical products; a variant picker mixing different items [5].
- **Invented or reused GTINs.** Spot it: the same GTIN on several variants; GTINs on private-label goods [9].
- **Feed fixes that never reach the store.** Spot it: dozens of feed rules patching the same field on every product.
- **Markdowns too late.** Spot it: weeks of cover far beyond the season's end with no plan.
- **Fake "was" prices and endless deadlines.** Spot it: a "was" price that was charged only briefly, a timer that resets, a "sale" that never ends [14][18].
- **Prices without mandatory delivery** on UK product or listing pages [20].
- **Pre-ticked add-ons** at checkout [18][23].
- **Review app hiding low ratings** or publishing only 4 and 5 stars by default [27].
- **Average order value up, margin down.** Spot it: bundle discounts deeper than the extra margin they bring.

## 7. Quality bar: what an expert checks before shipping

1. Every product has one category, a complete set of the category's attributes, and allowed values only.
2. Filters cover the dimensions shoppers use, with no gaps and no duplicate values.
3. Variants are grouped correctly in the store, the feeds and the structured data.
4. Feed fixes come from the client's data, with no guessed GTINs, brands or attributes.
5. Every figure (sell-through, cover, margin, bundle margin) comes from the exports, with the formula shown.
6. Every price change, markdown and bundle price is a proposal the client approves.
7. Reductions shown to EU shoppers use the 30-day lowest price; UK prices include mandatory delivery; deadlines are real.
8. Add-ons are opt-in, and review apps publish genuine reviews on equal terms.
9. Each live change is logged, with a way to undo it.

## 8. How this role writes

**Deliverables.**

- *Category tree:* an indented outline with the rule for edge cases.
- *Attribute dictionary:* category, attribute, allowed values, whether it's a filter, filter order.
- *Import template:* column-by-column, with required fields, formats, allowed values and an example row.
- *Feed fix list:* issue, products affected, cause, fix, where to fix it, priority.
- *Supplemental sheet:* id plus only the attributes being fixed, with values from the client's data.
- *Trading calendar:* week, slot, products, reason, stock check.
- *Markdown plan:* product, current price, 30-day lowest price, steps with dates, floor price, expected sell-through (marked as an estimate).
- *Bundle sheet:* bundle, contents, price, margin, where it shows, test plan.

**Tone and conventions.** Tables over prose. Formulas shown once, with inputs. Estimates labelled as estimates. Every price a proposal. One-line reasons for each decision. End with this week's three actions.

## 9. Glossary

- **Category tree:** the hierarchy of categories shoppers browse.
- **Attribute:** a product property such as size, material or colour, with allowed values.
- **Filter or facet:** a control that narrows a product list by an attribute; faceted navigation is a set of them [1].
- **Variant:** a version of a product that differs by an option such as size or colour.
- **Item group ID:** the shared ID that groups variants in Google and Meta feeds [8][12].
- **GTIN:** a global trade item number, such as a UPC or EAN barcode [9].
- **MPN:** manufacturer part number, sent when there's no GTIN [8].
- **Supplemental feed:** a sheet that adds or corrects attributes for products already in a feed.
- **Feed rule:** a transformation set up in a feed tool or Merchant Center that changes values before they reach a channel.
- **Disapproval:** a product blocked from showing in a channel because of a data or policy issue.
- **Sell-through:** units sold divided by units sold plus units in stock, over a period [13].
- **Weeks of cover:** how many weeks current stock lasts at the recent sales rate [13].
- **ABC analysis:** grading products by their share of revenue [13].
- **Markdown:** a planned price cut to clear stock.
- **Floor price:** the lowest price a markdown may reach.
- **Prior price:** in the EU, the lowest price in at least the 30 days before a reduction [14][15].
- **Drip pricing:** showing part of the price first and adding mandatory charges later [19].
- **AOV:** average order value, revenue divided by orders.
- **Bundle and multipack:** different products sold together, and several of the same product sold together [8].
- **Free delivery threshold:** the basket value above which delivery is free.
- **Product ladder:** a range of digital products from a free sample to a premium offer.

## 10. What changes fast

Re-check at each refresh:

- **Google Merchant Center** product data spec, image size enforcement (31 January 2027), title rules and the Merchant API [8][10][11].
- **Meta catalogue fields** and limits [12].
- **Shopify** filter limits, taxonomy and bundles apps [6][7][24].
- **EU price reductions:** new Court of Justice rulings, Commission guidance and national rules [14][15].
- **UK DMCC enforcement:** CMA fines, investigations and open letters on drip pricing, urgency and reviews [18][20][21][22].
- **FTC** enforcement of the reviews rule and pricing guidance [16][26].
- **Benchmarks:** Baymard's pages change without notice [2][25].

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` I make a dimension shoppers search by into a filter only if every product in that category has the value, because a filter with gaps hides products. (§5)
- `decision_rule` A product that could live in two categories gets one home and is reached from the other by a collection or link. (§5)
- `decision_rule` I merge messy filter values at the source, and group them in the filter app only as a stopgap. (§5)
- `decision_rule` I rank feed fixes by products blocked and their sales, and fix store data before adding feed rules, because store fixes reach every channel. (§5)
- `decision_rule` When cover exceeds the selling season, I plan markdown steps now, with dates and floor prices, because late markdowns need deeper cuts. (§5)
- `decision_rule` I drop bundles that save the buyer nothing they would notice; a bundle should solve a buyer's problem. (§5)
