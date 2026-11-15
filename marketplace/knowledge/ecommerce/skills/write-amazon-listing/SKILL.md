---
name: write-amazon-listing
description: "A complete Amazon listing for one product: title, five bullets, product description, backend search terms counted in bytes, and an A+ Content module plan, all checked against Amazon's written rules and built from the words real buyers type and the questions they ask in reviews. Every claim is traced to a proof the brand holds. Covers Amazon.com and the other Amazon stores (UK, EU, Canada, Australia and more), including each market's labelling and product safety declarations and search words in the languages buyers use. Use when listing a new product on Amazon, when a listing was copied from the supplier or the store page, when Amazon rewrites or suppresses a title, or before turning on ads to a listing that does not yet convert."
---

# Amazon listing

**You get:** one listing file for one product, ready to paste into Seller Central or a flat file: a title with its character count, five bullets, a description, a search terms line under 249 bytes, an A+ plan of 5 modules (7 if Premium), a keyword map showing where each buyer word lives, and a claims sheet with the proof for every claim.

## When to use

- A new product is going on Amazon and has no listing yet.
- The listing was pasted from the supplier or from the store's product page.
- Amazon has rewritten, flagged or suppressed the title or bullets.
- Ads are about to start and the listing must convert before money goes in (`launch-amazon-ppc` comes after this).
- A product moves from one Amazon store to another (for example Amazon.com to Amazon.co.uk or Amazon.de).

## Not for

- Titles for every channel at once (store, Google, other marketplaces such as Walmart, Etsy, eBay or Zalando): use `write-product-titles-for-store-and-marketplaces`.
- The store's own product page: use `write-product-page-copy`.
- Main image and gallery shots: use `art-direct-product-photoshoot` and `product-photo-retouch-and-consistency`.
- Getting Brand Registry so A+ is unlocked: use `set-up-brand-registry-and-store` first.

## What you need

Required:

1. **Product facts sheet**: materials, size, weight, pack count, colours, what is in the box, care, compatibility, country of origin. From the supplier spec or `write-product-spec-sheet-for-factory`.
2. **Proof file**: lab reports, certificates, test results, warranty terms. A claim with no proof is cut.
3. **Buyer words**: Amazon's search term report or Brand Analytics if the brand has them; otherwise the search bar's suggestions typed letter by letter (free), plus a keyword tool if the client already pays for one.
4. **Reviews and questions**: the top 3 to 5 rival listings' 1 to 3 star reviews and their customer questions (copy into a sheet by hand or export).
5. **Category style guide** from Seller Central for the product's category, read on the day.

Optional: the brand voice sheet (`store-visual-identity-sheet`), the store's own reviews CSV, support tickets.

If buyer words are missing, use search-bar suggestions and say so in the summary. If the proof file is missing, write the listing without that claim and name it under claims removed. Writing is level 1 work. Uploading needs draft access (level 2) through Seller Central or a flat file, and the client approves before it goes live.

## Before you start: the gates

1. **The product can sell at a profit on Amazon.** Gross profit per unit after referral fee, fulfilment fee and storage is computed in `build-sku-profit-sheet` [MEA-0037]. Fail: say so and stop; a good listing for a product that loses money on every order only loses faster.
2. **Category is open.** The product is not restricted or gated for this seller, and any needed approval or document is in hand. Fail: list what Amazon asks for and stop.
3. **Claims are provable.** Every health, safety, performance or "certified" claim has a document. Fail: drop the claim. In the US, claims need a reasonable basis before they are made; in every market, the pack must carry the declarations your market's labelling and product safety rules require, and the listing must match them [COG-6264].
4. **Brand Registry status known.** A+ Content needs a Professional plan and Brand Registry [AMZ-6446]. Fail: still write the A+ plan, marked "ready when registered".

## Steps

1. **Build the keyword map.** Pull 30 to 80 buyer phrases. Group them by meaning (the thing, the use, the buyer, the problem, the feature). Mark each phrase's root word. Products that buyers describe in many ways give more cheap long-tail terms to rank and advertise on [AMZ-0003]; if there are only two or three ways to say it, the title carries almost everything. For a new brand with few reviews, sort the map into tiers before writing: start from 2 or 3 seed phrases plus keyword exports from close rival ASINs, then keep phrases with at least 2 words, monthly searches under about 5,000, about 100 or fewer competing products and some keyword sales each month (a practitioner filter; loosen it for an established brand). Mark every phrase use, drop as too generic, drop as a brand name, drop as too competitive, or drop as not true for this product. Attributes such as organic, caffeine free or stainless steel stay only if they are true; any health or medical phrase is flagged for `check-ad-copy-for-policy-and-claims` and not used by default. Scan the titles and bullets of similar products for true phrases you missed. Tier 1 is the main product phrase, tier 2 the specific true phrases (material, size, use), tier 3 the leftovers, misspellings and synonyms for search terms. Send the best tier 1 and 2 phrases to `launch-amazon-ppc` as the manual campaign list.
2. **Mine the reviews.** From rival 1 to 3 star reviews and questions, list the top 5 worries in buyers' own words (it leaked, too small, smell, hard to clean). Note phrases where buyers name themselves ("as a nurse", "for my mother"): each repeating one is a buyer the bullets can speak to [AVT-0016]. Each worry gets an answer in a bullet or an A+ module.
3. **Write the title.** Order: brand, product type in the buyer's main phrase, the one or two features that decide the sale, size or count, colour. Keep it within the category limit (200 characters with spaces in most categories, lower in some), no ! $ ? _ { } ^ ¬ ¦ unless in the brand, and no word more than twice [AMZ-6160]. No "best", "No.1", prices or offers. Aim for the key phrase in the first 80 characters, since phones cut long titles (practitioner default, check on a phone). In search results a shopper sees only the main image, title, price and review count, so the title must win the click on its own. If nobody searches the brand name yet and the category guide allows it, test leading with the product phrase; otherwise follow the category guide's order.
4. **Write five bullets.** One job each, in this order unless reviews say otherwise: the main outcome; the top worry answered; what it is made of and why that matters; size, fit or compatibility; what is in the box and care or warranty. Start each with a short capital-led label of 2 to 4 words, then one or two plain sentences. Put proof inside the sentence ("tested to 5 kg", "CE marked", "UL listed"). Lead each bullet with the benefit, then the feature that delivers it; a list of features alone is the most common weak listing. Turn a vague line like "premium build" into a plain result only when a fact backs it, and never invent a number. A money-back or returns line goes in the last bullet only when the client confirms the exact terms, worded to match them; with no confirmed terms, leave it out and note it as missing. Work keyword-map phrases in where they read naturally. Under about 250 characters each is a practitioner default for phone reading; the category guide may set a hard limit.
5. **Write the description.** Used when A+ is not live and by some search features. Three short paragraphs: who it is for and the problem, how it works, how to use and care. No HTML unless the category allows it, no links, no contact details.
6. **Fill the search terms field.** Use only buyer words not already in the title or bullets: synonyms, other spellings, related uses, other-language words buyers type. Single spaces, no commas needed, no repeats, no brand names (yours or others), no temporary words (new, on sale) and no subjective words (best, amazing) [AMZ-6445]. Count bytes, not characters: the limit is 249 bytes and going over can make Amazon ignore the whole field [AMZ-6445]. A free online byte counter works.
7. **Plan A+ Content.** Up to 5 modules (Basic) or 7 (Premium) [AMZ-6446]. A plan that works for most products: (1) hero banner with the main outcome; (2) the top buyer worry answered with a picture; (3) how it works or what it is made of; (4) in-use photos for the main buyer named in step 2; (5) a comparison chart of the brand's own products only. Not allowed: best-selling or top-rated claims, prices, shipping, warranty text in text placements, links, QR codes, contact details, and any rival comparison [AMZ-6446]. Images up to 2 MB, no animation. Write alt text for every image in plain words.
8. **Write the claims sheet.** Every claim in title, bullets, description and A+, with its proof document and page. Anything with no proof is removed, not softened.
9. **UK, EU and other Amazon stores.** Show net quantity, maker or importer, the EU or UK responsible person where required, and country of origin as the pack states them [COG-6264]. Check whether a safety mark (CE, UKCA) or other certification is compulsory for the product [COG-6266]. Write each EU store's listing in its own language (German for Amazon.de, French for Amazon.fr), from local buyer words, not a straight machine translation. Buyers often type local or borrowed words; put them in search terms. Accented letters and non-Latin scripts use 2 to 3 bytes per character, so count bytes again. Use metric units and the local spelling (colour, not color, on Amazon.co.uk).
10. **US notes (Amazon.com).** Use US units (inches, ounces) with metric where the category expects both. Do not put disease or "FDA approved" claims on supplements or cosmetics; route any health claim through `check-ad-copy-for-policy-and-claims`.
11. **Set up the listing form.** Pick the same category and item type as the closest top sellers (shown on their product pages). With no brand name or logo on the product, the brand field is Generic. A brand name must be approved first, either through Brand Registry with a pending or registered trademark (`set-up-brand-registry-and-store`), or, without one, through Amazon's request to use an unregistered brand name. Read the category style guide for title length and banned words on the day; they change.
12. **Plan the launch date.** Set the offer start date in the future so the listing does not go live before stock is checked in and the launch plan is ready. As a pricing sense check, many sellers aim for a price of at least 3 times landed cost; it is a rule of thumb, not a target, so confirm it against the fee and margin sheet (`build-sku-profit-sheet`).
13. **Hand over for approval.** Show the listing beside the current one (if any). Upload only after the client's yes.

## Checks before you hand it over

- Title within the category limit, no banned characters, no word three times [AMZ-6160].
- Five bullets, each answering a different buyer job, with at least two answering worries found in reviews.
- Search terms at or under 249 bytes, no word repeated from title or bullets, no brand or subjective words.
- A+ plan has no banned content and no rival comparison; module count fits the plan type.
- Every claim on the claims sheet has a proof document.
- Read on a phone: the key phrase shows in the cut-off title.
- For each non-US store: net quantity, maker or importer, responsible person and origin match the pack.
- Keyword phrases are tiered, each marked use or drop with the reason, and none is untrue for the product.
- Every bullet leads with a benefit, and every number in it is backed by a fact the client gave.
- A returns line appears only with confirmed terms.
- The offer start date is set after stock is checked in.
- Nothing uploaded without the client's yes.

## Output

**One-screen summary:** product, marketplace, main buyer phrase, the three buyer worries the listing answers, Brand Registry status, claims removed for lack of proof, and up to three assumption lines where an unknown changes the listing.

**Listing file (paste-ready):**

| Field | Text | Count | Rule check |
|---|---|---|---|
| Title | | characters with spaces | pass or fail |
| Bullet 1 to 5 | | characters each | pass or fail |
| Description | | characters | pass or fail |
| Search terms | | bytes | pass or fail |

**Keyword map:** Phrase | Root | Meaning group | Placed in (title, bullet n, search terms, A+) | Source (search report, suggestions, reviews).

**A+ plan:** Module number | Module type | Headline | Body text | Image brief | Alt text | Buyer worry it answers.

**Claims sheet:** Claim | Where it appears | Proof document | Page or test number | Status (kept, reworded, removed).

## Common mistakes

- **Keyword-stuffed titles.** Amazon now rewrites them; step 3 caps repeats and moves extra words to search terms.
- **Counting characters, not bytes.** A field over 249 bytes can be ignored entirely; step 6 counts bytes.
- **Bullets that list features with no reason to care.** Step 4 pairs each feature with the worry it settles.
- **A+ that compares with rivals or says "best seller".** Both break the A+ rules; step 7 uses the brand's own range for comparisons.
- **Supplier claims copied in.** Step 8 removes anything without a document.
- **Copying the store page.** A store page and an Amazon listing do different jobs; this skill builds from Amazon search words and rival reviews.
- **Chasing the biggest phrases on day one.** Step 1 tiers phrases a new brand can rank for first.
- **A returns promise the client never set.** Step 4 writes it only from confirmed terms.
- **Going live before stock is in.** Step 12 sets a future offer start date.

## Sources

- AMZ-6160: Amazon title rules, 200 characters, banned characters, no word more than twice.
- AMZ-6445: 249-byte search terms limit and banned word types.
- AMZ-6446: A+ eligibility, module counts and banned content.
- AMZ-0003: products described in many ways give long-tail terms to launch on.
- AVT-0016: self-naming phrases in reviews mark buyer segments.
- MEA-0037: gross margin must include marketplace fees and delivery.
- COG-6264: packaged-goods declarations.
- COG-6266: compulsory safety and certification marks.
- Library items: Amazon keyword picker and Amazon listing writer (AI Blocks skills), used for the keyword tiers and filters, benefit-first bullets, the confirmed-terms returns line, the listing form and the future start date.

What makes this skill ours: bullets are built from rival 1 to 3 star reviews, not a feature list; search terms are counted in bytes, which matters for accented and non-Latin words; every claim needs a document or is cut; and the listing is only written once the product makes money after Amazon's fees.

## Selling in India

- On Amazon.in, show MRP inclusive of taxes, net quantity, maker or importer and country of origin as the pack states them, under Legal Metrology rules [COG-6264].
- Check whether a BIS mark is compulsory for the product [COG-6266].
- Many buyers type Hindi words in Latin letters ("kurti", "chappal", "atta"); put them in search terms. Devanagari uses 3 bytes per character.
- Keep the listing in English unless the brand chooses a language listing and can support it.
