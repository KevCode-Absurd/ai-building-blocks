---
name: store-knowledge-folder
description: "Build and keep the store's knowledge folder: one set of checked, dated files that every later job (ads, emails, pages, photos, offers) reads first, so nobody re-asks the owner. Captures the live site and catalogue, works out gross profit per purchase for every product, records stock cover and cash limits, banks customer words with counts, ranks buyer groups by share and strength of feeling, lists proof marked verified or not, notes rivals with an expiry date, logs past ads against store orders, and keeps a read-first change log and a learnings log. Downloads the real product images as the truth set. Use for a new store, when facts have gone stale, or when jobs keep using different numbers. Read access only."
---

# Store knowledge folder

**You get:** a dated knowledge folder with a one-screen README and facts, product money, voice, customer, proof, competitor and ads files, each with a recheck date, ready for every later job to read first.

Every job for a store needs the same facts. This skill writes them down once, each with a source and a date, checks the files agree with each other, and sets rules so later jobs add to the folder without corrupting it.

## When to use

- A new store comes on board and nothing is written down yet.
- Different jobs have used different prices, margins or customer descriptions.
- Files are past their recheck date (step 10).
- A new hero product, market or offer.

## Not for

- A profile built only for Meta ads, with ad claim lists: use `store-meta-brand-dna`, which reads this folder first.
- Colours, fonts and components: use `store-visual-identity-sheet`.
- Deep claim work on one product: use `product-claims-profile`.
- A full rival study across channels: use `cross-channel-competitor-map`.

## What you need

**Required**

- The live store URL: home page, top product pages, about page, shipping, returns and payment policies, FAQ, reviews page.
- Shopify products CSV (Title, Handle, Variant SKU, Variant Price, Variant Compare At Price, Cost per item, Variant Inventory Qty, Status, Image Src) or the platform's equivalent.
- Shopify Analytics "Sales by product variant SKU", last 90 days (net quantity, gross sales, discounts, returns, net sales).
- Per order costs: pick, pack and shipping, payment fee percentage, return rate (by product if known). Where pay on delivery is offered, its share of orders and the rate of refused or failed deliveries sent back.
- Reorder lead time per active product, and the most the owner can spend on marketing per month.
- The owner intake sheet (step 1).

**Optional, raises confidence**

- Review app export (rating, title, body, date, verified flag); post-purchase survey answers.
- Meta Ads Manager export, last 180 days, ad level: ad name, ad ID, first delivery date, spend, purchases, purchase value, attribution setting. Google Ads and TikTok exports with the same fields.
- Email platform flow and campaign report, last 90 days (Klaviyo, Shopify Email or Omnisend).

**When something is missing.** Ask once, in one message. If cost per item is missing, ask for landed cost of the top five products by net sales. If the site blocks reading, ask the owner to paste the about page and a product list with prices. Anything still missing is written as `null` and listed under Gaps; never guess a cost. Connected platform tools save time but are never required; every input has a manual export path.

**Access.** Level 1, read. The owner sends exports or grants read access through the platform's own sign-in; never ask for a password. Publishing the facts page in step 11 needs publish access and the owner's yes.

## Before you start: the gates

1. **Gross profit per purchase can be computed.** Per product: price actually paid (after the usual discount), minus landed cost, pick, pack and shipping, payment fees and expected returns cost; where pay on delivery runs, also the cost of refused parcels (refusal rate times forward plus return shipping). Use cost delivered to the door [MEA-0037]. Fail: build the rest, mark the products table "not ranked: gross profit unknown", and put the missing costs first under Gaps.
2. **Cash and capacity are stated.** Monthly marketing cap, orders per day the team or warehouse can ship, days of stock cover per product. Fail: write "limits unknown" at the top of the README; later jobs add no spend or volume until answered.
3. **Tracking is good enough for the ads record.** Compare Meta purchases with Shopify orders for the same 30 days. If Meta reports more, or the gap swings week to week, label every ad result "platform-reported, not store-checked". The rest runs on store data.

## Steps

### 1. Send the intake sheet once

One sheet, not a chat interview: the story in the owner's words, three admired brands and one to never resemble, the best past offers with dates and results, the best customers and the worst-fit ones (who returns or complains most), words never to use, claims they know they cannot make, markets shipped to, and the currency and languages each market uses. Save answers word for word with the date in `10-owner-answers.md`. They are hypotheses until step 4 checks them against customers.

### 2. Capture the site and catalogue, dated

Save each page's text and a screenshot with URL and date. On Shopify, `<store>/products.json?limit=250` (add `&page=2` and so on) lists titles, variants, prices and image links; some stores switch it off, so fall back to the CSV. Skip lines that are not products: shipping protection, gift cards, warranties, free-gift placeholders. Download every product image at full size into `images/`, named `sku_variant_position_YYYY-MM-DD.jpg`, keeping the store's display order, and check no file is empty. This is the product truth set later photo and ad jobs check against.

Confirm the buyer can act today: the hero product is live, in stock, at the price shown, and its link works. If not, say so in the README's first line.

### 3. Build the products money table

For every product with sales in the last 90 days: gross profit per purchase, break-even ROAS (price paid divided by gross profit per purchase) and break-even cost per purchase. A 70% margin on price can be about 24% once freight, shipping, fees and allowances are in [MEA-0023]. Use Net sales plus shipping charges as cash collected; Total sales includes tax [MEA-0010]. Add days of stock cover and lead time, and mark each product **Advertise**, **Protect** (cover below lead time; the hero is the exception [ADC-0023]) or **Skip** (gross profit below a realistic cost per purchase). For any discount the store runs often, add its own break-even ROAS; a 30% discount can roughly triple it [OFF-0065]. The hero product is the one this table ranks first, not the one the home page features.

### 4. Bank customer words, with counts

Read reviews by hand and paste quotes verbatim with source, stars and date [AVT-0007]. Tag each: outcome, before, failed fixes, who I am, objection, surprise (what delighted them that the site never mentions). Count tags. Repeated self-naming phrases ("as a nurse") mark a buyer group [AVT-0016]. Read the most loyal and most unhappy customers first [AVT-0021], once the store has a few hundred customers.

Each buyer group in `04-customers.md` shows its evidence as numbers ("new parents: 14 of 212 reviews, 7%, Jan to Oct 2026") and two ranks: **share** of buyers and **intensity** (how strong the feeling is in their words: low, medium, high). The most intense group is often the best creative bet even when smaller. Three or more independent quotes make a group **strong**; fewer are **hunches**, labelled so. No ages or incomes the evidence does not show. If a post-purchase survey exists, add its counted "what almost stopped you" answers [LPG-0042]; if not, recommend one with that question and "what made you buy today" [CRO-0018].

### 5. List the proof, marked

One row per proof item: exact wording, source link, date, status **Verified** (you saw the evidence), **Claimed** (no evidence found) or **Unusable**. Only Verified rows feed buyer-facing work. Missing proof is a store problem to report, not an extraction failure: "no third-party proof", "reviews never answer the price doubt". Reviews loaded by script may be invisible to AI crawlers [AEO-0002]; note it for the page team.

### 6. Note rivals, with an expiry

Three to five rivals from the owner, the reviews ("failed fixes") and a search for the store's main product terms. For each: URL, hero product and price, current offer, main claim, what they do well, what they miss, date found and an expiry 90 days later (practitioner default, test it). Include marketplace sellers when shoppers compare there.

### 7. Start the ads record

From the ad exports, every ad that spent in the last 180 days: ad ID, name, first delivery date, spend, purchases, cost per purchase, and tags for product, buyer group, angle, offer, format and hook [MCR-0051]. Verdict: winner (cost per purchase under the product's break-even for 14 days or more), loser, or not enough data. Judge against break-even from step 3, never ROAS alone.

### 8. Open the change log and learnings log

- `00-recent-changes.md`: read first by every job. Newest entry on top: launches, price changes, promotions with dates, stock-outs, discontinued products. It stops later jobs pushing a product that sold out last week.
- `09-learnings-log.md`: date, what was tried, result with numbers and source, the rule it suggests, where it applies, who wrote it. People write the original ideas; AI may only reformat them [ORG-0025]. A rule needs a number or it is a note.

### 9. Check the files agree

Before handover: the hero product is the same in every file; every price traces to the catalogue capture; every selling point traces to a page, review or proof row; voice rules each rest on a real brand line; no offer appears that the store is not running. Fix contradictions; do not average them. Then write a two-line diagnosis at the top of the README: who actually buys (step 4) versus who the current ads speak to (step 7), and the biggest gap between them.

**Close what is left with one founder call.** Turn every remaining gap into a question: each `null`, each contradiction you could not fix, each unverified proof row, each buyer group marked hunch. Rank them: first the gaps that block work today (claims and proof, who may appear in ads, the live offer, costs), then the ones that shape every ad (the buyer, the voice), with history last. Split the list: questions that need a story or a judgement go to a call of about 30 minutes, about ten in rank order; facts, lists and files (numbers, policies, logo files, past emails) go on a written form sent before the call, each item naming the file it will fill. On the call, ask about one real moment ("Tell me about the last customer who surprised you"), and after any claim ask "How do you know?", noting whether the answer is a document, a belief or a story. When the founder answers with an adjective ("premium", "fun"), ask for a sentence they would say or a photo they would post. If the founder's picture of the buyer differs from step 4, keep both, side by side. File each answer word for word in `10-owner-answers.md` tagged `confirmed: founder, <date>, Q<n>` and update the file it fills. The founder's word settles a fact about the business; it never proves a selling claim, which stays unverified in `06-proof.csv` until the document arrives. Send a one-page readback: what was heard, what is still needed, what was decided.

### 10. Set recheck dates and write-back rules

Every file gets "checked on" and "recheck by" dates. Practitioner defaults, test them: prices, offers and stock before every job; rivals 90 days; ads record and learnings monthly; customer words and proof every 6 months; voice and look yearly.

Later jobs may append dated, sourced entries to the change log, learnings log, ads record and rivals file. They may not overwrite facts, delete history or change the products table without a new export, and they tell the owner what they added.

### 11. Optional: a public facts page

If AI assistants or search show wrong facts about the store, draft an FAQ of official facts (prices, materials, shipping, ownership); assistants cited an official FAQ far more reliably than planted third-party claims in one test [AEO-0011]. Publishing needs the owner's yes.

### Market details

Add per product the HS code and the tax rate for each market (VAT, sales tax or similar), and whether shown prices include tax there. For each market shipped to, record currency, price list or rounding rule, duties collected or not, and the main payment methods. Where pay on delivery runs, put its share and the refusal rate in the cost line, and any pay-now versus pay-on-delivery price difference. Note which channels buyers use for orders or updates (email, SMS, WhatsApp or other chat apps), and the languages your buyers use.

## Checks before you hand it over

1. Every fact has a source and a capture date.
2. Gross profit per purchase plus every cost line adds back to the price paid.
3. No Advertise product has stock cover below its lead time, unless it is the marked hero exception.
4. Every buyer group shows count, share, intensity, source and date range, and is labelled strong or hunch.
5. Every quote is verbatim with source, stars and date.
6. The consistency check in step 9 passed or its fixes are listed.
7. Every file has a recheck date; the change log exists.
8. The truth set covers every variant in the Advertise list.
9. Remaining gaps went to a ranked founder call and written form; answers are tagged with date and question number, and no selling claim was marked verified on the founder's word alone.
10. Nothing was published or sent to customers.

## Output

1. `README.md`, one screen first: the diagnosis; the product to lead with and why in money; cash and capacity limits; the three strongest customer phrases with counts; the three strongest Verified proofs; biggest gaps (missing costs first); a file index with checked-on and recheck-by dates.
2. `00-recent-changes.md`, `01-facts.md`, `02-products.csv` (product, SKU, variant, price paid, landed cost, ship and pack, fees, returns cost, failed-delivery cost, gross profit per purchase, break-even ROAS, days of cover, lead time, status).
3. `03-voice-and-look.md`: five real brand lines, three voice traits each backed by a line, banned words, link to the visual identity sheet.
4. `04-customers.md` and `05-customer-words.csv` (quote, tag, group, source, stars, date, ads permission).
5. `06-proof.csv`, `07-competitors.md`, `08-ads-record.csv`, `09-learnings-log.md`, `10-owner-answers.md`, and `images/`.

## Common mistakes

- **Profiles from the owner's view.** Step 4 makes every group show counted evidence.
- **Price minus product cost as margin.** Gate 1 uses cost to the door, with refused parcels where pay on delivery runs.
- **Hero product chosen by the home page.** Step 3 ranks by gross profit and stock.
- **Files that contradict each other.** Step 9 checks them before handover.
- **Advice from stale facts.** The change log is read first; every file expires.
- **Ads judged on platform ROAS.** Step 7 uses store-side break-even.
- **Treating the founder's word as proof.** Step 9 files it as a confirmed business fact; claims still need their document.

## Sources

- [MEA-0037]: gross margin is cost delivered to the door.
- [MEA-0023]: 70% product margin can be 24% true gross margin.
- [MEA-0010]: Shopify cash collected is Net sales plus shipping.
- [ADC-0023]: tie ad pressure to stock cover against lead time.
- [OFF-0065]: a 30% discount can triple break-even ROAS.
- [AVT-0007]: paste review quotes by hand, verbatim.
- [AVT-0016]: repeated self-naming phrases mark buyer groups.
- [AVT-0021]: weight the most loyal and most unhappy customers.
- [LPG-0042]: post-purchase "what almost stopped you" survey.
- [CRO-0018]: two-question post-purchase survey.
- [AEO-0002]: script-loaded reviews are invisible to many AI crawlers.
- [MCR-0051]: tag every ad on the same fields.
- [ORG-0025]: people write the original ideas; AI remixes them.
- [AEO-0011]: an official facts FAQ gets cited.

What makes this skill ours: products are ranked by gross profit per purchase to the door (with refused parcels where pay on delivery runs), not by what the home page features; buyer groups carry counts, share and intensity instead of invented demographics; the files are checked against each other and every fact expires; and later jobs may only append dated, sourced entries, so the folder improves without drifting.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. For Indian products, add the HSN code and GST rate, the COD share and RTO rate in the cost line, RTO cost in the products table, and any prepaid versus COD price difference. Note whether WhatsApp is used for orders or updates.
