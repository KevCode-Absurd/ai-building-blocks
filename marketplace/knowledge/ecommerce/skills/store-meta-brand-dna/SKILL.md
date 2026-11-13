---
name: store-meta-brand-dna
description: "Build the store profile every Meta ad is made from. Reads the live store (home page, best-selling product page, about page, reviews, shipping and returns policy) plus the store's product and sales exports, then writes one profile with: the products worth advertising, ranked by gross profit per purchase and stock cover; the current offer and the break-even ROAS it needs; the customer's own words from reviews; every proof point the store can actually show, marked verified or not; the claims the ads must never make; and the real product photos, logo, colours and voice the ads must match. Use it before writing concepts or making ad images for a store, for a new client, after a new hero product, or when ads read as generic."
---

# Store profile for Meta ads: products, proof, offer and customer words

**You get:** a store profile for Meta ads: products ranked by gross profit per purchase, a proof table, a customer words bank and a brand profile JSON file, ready for concepts and images.

This skill reads the store like a careful buyer and a careful accountant, and writes down what the ads can sell, what they can prove and how the customer talks. A fact with no source and date does not go in.

## When to use

- Before the first Meta concepts for a store, or for a new client.
- The store has a new hero product or a new offer.
- Ads read as generic: same promise as every rival, no proof, no customer language.
- Before a sale period, to recheck the offer, stock and the ROAS each discount depth needs.
- Before `store-meta-ad-images` or `store-meta-product-photos`, which need the real product photo set this skill records.

## Not for

- Writing concepts, copy or a test plan: use `store-meta-concepts`.
- Making ad images: use `store-meta-ad-images`. New product photos: use `store-meta-product-photos`.
- Checking the ad account, tracking or spend: use `store-meta-audit`.
- Fixing the product page itself: use `store-meta-landing`.

## What you need

**Required**

- The live store URL. You will read: home page, the best-selling product page (by net sales, see step 2), about or founder page, the reviews page or review widget, shipping and returns policy, FAQ.
- Shopify products CSV export: Title, Variant SKU, Variant Price, Variant Compare At Price, Cost per item, Variant Inventory Qty, Status. WooCommerce: product CSV with SKU, prices and stock, plus cost from the owner.
- Shopify report "Sales by product variant" for the last 90 days: net quantity, gross sales, discounts, returns, net sales.
- Per order costs from the owner: average pick, pack and shipping cost, payment fee percentage, return rate by product (or store-wide), and, where cash on delivery is offered, the share of COD orders and the return-to-origin rate.
- Reorder lead time in days for each product you might advertise.

**Optional, raises confidence**

- Review app export (Judge.me, Yotpo, Okendo, Loox or similar): rating, title, body, reviewer name, date, verified buyer flag, photo or video link.
- Post-purchase survey answers, especially "what almost stopped you buying".
- Links to press coverage, test reports, certificates and awards.
- Original logo files (SVG or high-resolution PNG) and the brand guide.
- Meta Ads Manager export, last 90 days, by ad: ad name, spend, purchases, purchase value, attribution setting.

**When something is missing.** Ask once, in one message. If cost per item is still missing, ask for landed cost of the top five products. Without it, mark the ranking "not ranked: gross profit unknown"; `store-meta-concepts` then cannot pick a hero product by money.

**Access.** Level 1, read, for the whole job. The owner sends exports; never ask for a password. Nothing needs draft or publish access.

## Before you start: the gates

1. **Gross profit per purchase can be computed.** For each candidate product: price actually paid (after the usual discount) minus landed product cost, minus pick, pack and shipping, minus payment fees, minus expected returns cost (return rate times the value lost on a return plus return shipping). In COD markets, also subtract return-to-origin cost (RTO rate times forward plus return shipping). Use delivered cost, not product cost against price [MEA-0037]. Pass: every input is known or an owner estimate, labelled. Fail: rank nothing; ship the rest.
2. **Stock and cash limits are stated.** For each product: days of stock cover (units on hand divided by average daily units sold) and reorder lead time. The owner states the most they can spend on Meta per month. Fail: mark every product "stock unknown" and ask before any product goes in the Advertise list.
3. **Tracking is not needed for this job.** Rank on store data. Use the Ads Manager export only to see what is already advertised, never to rank.

## Steps

### 1. Capture the store, dated

Save each page's text and a screenshot, and record the URL and date beside every fact. Confirm the buyer can act today: the hero product is live, in stock, at the price shown, and the link works. If it is not, say so in the first line of the profile.

### 2. Build the product money table

For every product with sales in the last 90 days, compute gross profit per purchase (gate 1), break-even ROAS (order value divided by gross profit per purchase) and break-even cost per purchase (the gross profit itself). A product can show a 70% margin on price and still earn 24% once shipping, fees and returns are counted [MEA-0023]. Then sort each product into one status:

- **Advertise:** gross profit per purchase is healthy and days of cover exceed reorder lead time.
- **Protect:** days of cover are below reorder lead time. Raise its target or keep it out of new ads; do not pay to sell stock that will run out anyway [ADC-0023]. Exception: the hero product, where going dark costs more than the batch margin.
- **Clear:** aged, slow stock. If cash is the constraint, it can run in its own funnel at break-even or a small loss to turn back into cash [FIN-0026].
- **Skip:** gross profit per purchase is below a realistic cost per purchase.

Do not rank by conversion cost: Meta's default bidding favours the cheapest product to sell, not the one that earns most per sale [ADC-0022]. Keep a cheap entry product only if its buyers go on to buy higher-margin ones.

Screen each Advertise product for traffic economics: revenue per landing-page session must beat cost per click times break-even ROAS. The cards give rough screens (conversion rate times AOV above 250 [OFF-0047], or 300 at about $3 clicks [MEA-0047]). They disagree because they assume different click costs. Your own click cost and break-even ROAS win; use the card numbers only when the store has no click data yet.

### 3. Record the offer and what it costs

Write down exactly what a buyer gets today: price, compare-at price, bundles, free shipping threshold, gift with purchase, subscription terms, guarantee, returns window, COD availability. For each discount depth on offer, recompute break-even ROAS: a 30% discount can roughly triple it [OFF-0065]. Mark a compare-at price as usable in ads only if the store actually sold at that price; UK and EU price rules require a genuine prior price [OFF-0017].

### 4. Bank the customer's own words

Read reviews by hand and paste quotes word for word, each with source, star rating and date [AVT-0007]. Aim for 20 or more quotes (practitioner default, test it); if the store has fewer reviews, take all of them and say so. Tag each quote with one theme:

- **Outcome:** what changed for them, in their words.
- **Before:** the problem as they describe it.
- **Failed fixes:** products or methods they tried first; these buyers have already shown they will pay [AVT-0009].
- **Who I am:** self-identifying phrases ("as a nurse", "my toddler"). A phrase that keeps repeating marks a segment worth its own ads [AVT-0016].
- **Objection:** doubts from 1 to 3 star reviews and FAQ entries.

Trim only with "..." and never change a word. Set "ads permission" to unknown for every named reviewer until the store confirms it.

### 5. List the proof, and mark what is real

Make one row per proof item with its exact wording, source link and date:

- Review count and average rating, read from the widget on the capture date.
- Guarantees and returns terms, quoted from the policy page.
- Press: outlet plus the actual quote and link. A bare logo row now reads as padding [LPG-0037].
- Test reports, certificates, awards, founder credentials: a link to the document.
- Customer photos and videos, with permission status.

Mark each item **Verified** (you saw the source), **Claimed** (the site says it, no evidence found) or **Unusable** (expired, unprovable, or a health, medical or results claim with no substantiation). Only Verified items may appear in ads. Under about 80 reviews, more reviews is the cheapest proof gain available [LPG-0062]; record it as a gap.

From this, write two lists: **claims allowed** (each tied to a Verified row) and **claims banned** (anything the store cannot prove, plus Meta's personal attributes rule: no copy that implies the viewer has a condition, such as "your acne").

### 6. Record the real product and visual codes

- **Product truth set:** links to the store's real photos of every product and variant you might advertise, and notes on what the product really looks like: label text, colours, shape, size, what is in the box. `store-meta-ad-images` and `store-meta-product-photos` check every image against this.
- **Logo:** the file used in the site header, plus whether originals were supplied.
- **Colours:** hex values read from the site's CSS for buttons, header, background and text.
- **Fonts:** names from the CSS or font links; "system" if none.
- **Photo style:** what the store's own photos do (plain background, in use, people or not, light).

### 7. Write the voice from real lines

Copy five real lines from the site and five phrases customers repeat. Write three descriptors, each backed by one of those lines, and the words the brand avoids. No numeric voice scores.

### 8. Name buyer groups from evidence

Write two or three buyer groups as who, situation and problem, from the "who I am" and "before" quotes. Three or more independent quotes make a group strong; one is a hunch. Add no ages or incomes the quotes do not show.

## Checks before you hand it over

1. Every fact has a source URL or export name and a capture date.
2. Every customer quote is verbatim, with source, stars and date.
3. Products are ranked only where gross profit per purchase is computed; the inputs are shown.
4. No product with days of cover below its lead time sits in Advertise, unless marked as the hero exception.
5. Each discount on offer shows its own break-even ROAS.
6. Every proof item is marked Verified, Claimed or Unusable, and only Verified items feed the claims allowed list.
7. The product truth set covers every variant in the Advertise list.
8. Buyer groups name the quotes they rest on.

## Output

1. **One-screen summary:** the product to advertise first and why in money (gross profit per purchase, break-even ROAS, days of cover); the three strongest customer phrases; the three strongest Verified proofs; the offer and its break-even ROAS; the biggest gaps (for example "only 34 reviews", "no landed cost for two products").
2. **Product money table:** product, SKU, price paid, landed cost, shipping and pack, fees, returns cost, gross profit per purchase, break-even ROAS, days of cover, lead time, status.
3. **Proof table:** item, exact wording, source, date, status.
4. **Customer words bank** (`customer-words.md`): quote, theme, segment, source, stars, date, ads permission.
5. **`brand-profile.json`** with these keys: `store`, `captured_at`, `sources`, `economics`, `offer`, `customer_words`, `proof`, `claims_allowed`, `claims_banned`, `visual` (logo, colours, fonts, photo_style, product_truth_set), `voice`, `buyer_groups`, `gaps`. Use null for anything not found; never guess.

## Common mistakes

- **Picking the homepage hero as the product to advertise.** Step 2 ranks by gross profit and stock, not by what the home page features.
- **Summarising reviews into themes.** Step 4 keeps exact words, because the words become the hooks.
- **Treating what the site says as proof.** Step 5 marks site claims Claimed until a source is seen.
- **Advertising stock that will run out.** The Protect status keeps it out of new ads.
- **Using a reviewer's name or photo in an ad without permission.** The ads permission field starts as unknown.

## Sources

- [MEA-0037]: gross margin must be delivered cost to the door.
- [MEA-0023]: product margin of 70% can be 24% true gross margin.
- [ADC-0023]: tie ad pressure to days of stock versus reorder lead time.
- [ADC-0022]: default bidding favours cheap-to-sell, not most profitable, products.
- [FIN-0026]: push slow stock through its own funnel at break-even when cash is tight.
- [OFF-0047]: AOV times conversion rate above about 250 as a rough scaling screen.
- [MEA-0047]: the same screen at 300, tied to about $3 clicks.
- [OFF-0065]: a 30% discount can triple break-even ROAS.
- [OFF-0017]: discount framing, and the genuine prior price rule.
- [AVT-0007]: paste review quotes verbatim, by hand.
- [AVT-0009]: buyers who already paid for failed fixes are the highest intent.
- [AVT-0016]: self-identifying review phrases mark segments.
- [LPG-0037]: press logos need the outlet's quote; reviews need name and source.
- [LPG-0062]: 0 to about 80 reviews is where conversion moves most.

Meta documentation: Advertising Standards, personal attributes policy.

Coverage checked against the open-source meta-ads skill set (MIT), https://github.com/AI-Marketing-Hub/meta-ads.

What this skill does that the open-source one did not: ranks the store's products by gross profit per purchase and stock cover before anything is advertised; banks the customer's exact words from reviews; builds a proof inventory marked verified or not, with a banned-claims list; records the real product photo set that later image work is checked against, and drops numeric voice scores that had no evidence behind them.
