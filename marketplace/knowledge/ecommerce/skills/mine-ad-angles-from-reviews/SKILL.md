---
name: mine-ad-angles-from-reviews
description: "Ten ranked ad angles mined from the store's own reviews, each with two or three exact buyer quotes that prove it, the product it sells, the objection it answers and a first test headline. Codes every usable review by buyer, trigger, failed past fix, result and doubt, counts each theme against the usable total, and ranks angles on evidence, gap against live ads and the product's gross profit per order, never on review count alone. Use when ads have run out of fresh ideas, before a creative batch or roadmap, or when a new product has its first 50 or more reviews."
---

# Ad angles mined from your reviews

**You get:** a ranked list of ten ad angles in one table, each with 2 to 3 exact buyer quotes (review ID and date), the product it sells, the objection it answers, its evidence count and a first test headline, plus a coded quote bank file the ad team can reuse.

## When to use

- New ads keep repeating the same two or three ideas and results are flattening.
- A creative batch, sprint or quarterly roadmap needs fresh angles with proof behind them.
- A product has passed about 50 reviews and nobody has read them as a set.
- The owner believes they know why people buy and wants it checked against buyer words.

## Not for

- One ad per top objection, ready to brief: use `objection-busting-ad-set` (it can start from this table).
- Twenty or more raw directions from every proof asset, not only reviews: use `proof-scored-ad-ideas`.
- Writing finished ad copy from review quotes: use `write-review-based-ad-copy`.
- The full map of why each buyer type buys: use `buyer-decision-map`.

## What you need

Required (read access, level 1):

1. **Reviews export** for the last 12 to 24 months from the review app or Shopify (CSV with review ID, product handle or SKU, rating, title, body, date, verified buyer flag, media flag). Free path: copy reviews from the product pages into a sheet by hand.
2. **Gross profit per order by product**, from `store-meta-math` or `build-sku-profit-sheet`.
3. **Live and recent ads**: a Meta Ads Manager export at ad level for the last 90 days (ad name, spend, purchases) or screenshots of each live ad, so you can see which angles already run.
4. **Stock by SKU** (Shopify inventory export).

Optional: support tickets or chat logs, post-purchase survey answers, return and RTO reasons, and marketplace reviews of the store's own listings. Competitor reviews are fine for spotting gaps, never for quotes in the store's ads.

If the reviews export is missing, ask once; under 30 usable reviews in total, stop and hand off to `customer-interview-script-and-summary` instead. If gross profit is missing, rank on evidence only and mark the table "profit not checked". This job needs no draft or publish access; nothing goes live from it.

## Before you start: the gates

1. **Gross profit per order known per product.** Pass when built from delivered cost [MEA-0037]. Fail: you may still find angles, but you may not rank them; label the list unranked and send the owner to `store-meta-math`.
2. **Enough evidence.** Pass at 30 or more usable reviews for the product, or 100 or more across the store. Fail: deliver a short memo of what the reviews hint at and an interview plan. No angle stands on one review.
3. **Rights to quote.** Check the review app's terms and the store's review request wording. Quotes for paid ads need either that permission or the reviewer's yes. Fail: the angle can stand, but its ad must paraphrase and the quote stays internal.
4. **Stock.** An angle for a SKU with under four weeks of cover drops to the bottom until restock.

## Steps

### 1. Clean the set

Remove duplicates, staff and gifted reviews (flag them, keep them out of counts), spam, and reviews about delivery only. Keep delivery complaints in a separate service list; they are not buying reasons. Write two numbers at the top: reviews received and reviews usable. Every count later uses the usable number as the denominator.

### 2. Read and paste, do not summarise

Read reviews yourself and paste exact phrases into the quote bank, errors included. Automated theme tools strip the emotional words that make an ad land [AVT-0007]. Read every 1-star and 2-star review, every review with photos or video, and a random half of the rest.

India note: many reviews mix English with Hindi or a regional language. Keep the original line and add a labelled translation; never present your translation as the buyer's words. COD buyers often review on WhatsApp; use those only with the buyer's permission.

### 3. Code each review on six fields

For each usable review fill: **buyer** (any self-description such as "as a nurse", "my mother is 70"), **trigger** (what made them shop), **failed past fix** (what they tried before), **result** (what changed, in their words), **doubt** (what almost stopped them), **product**. One review can carry several codes.

Three patterns earn extra attention:

- Repeated self-descriptions mark a buyer group that may deserve its own ad and page [AVT-0016].
- Buyers who name money already spent on failed fixes are the highest-intent group; search for that phrasing in 1-star and 5-star reviews alike [AVT-0009].
- When 3-star reviews contradict each other (too strong, too weak), do not build an angle on either side; note it as a product question [AVT-0008].

### 4. Group codes into candidate angles

An angle is one buyer, one tension and one belief the ad will leave behind. A new wording of the same tension is not a new angle; a new buyer, a new tension or a new offer is [MCR-0022]. Aim for 15 to 25 candidates, then cut to the strongest ten.

For each candidate write: the angle in one plain line, the buyer, the tension, the product, the objection it answers (the most common doubt among those reviews), and the count (reviews coding to it over usable reviews). Never call the count a market share; it is a share of this sample.

### 5. Check against live ads

Tag each live or recent ad with the angle it runs (use the store's tag sheet from `creative-naming-and-tagging-system` if it has one). Mark each candidate **open** (no live ad), **thin** (one or two ads, little spend) or **crowded** (several ads already). An unclaimed buyer is often the cheapest next win in a crowded category [MCR-0002]; if the product works the same as a bigger rival's, a new buyer beats a new mechanism claim [AVT-0014].

### 6. Score and rank

Score each candidate out of 10 (practitioner default, test it):

| Part | Points | Rule |
|---|---|---|
| Evidence | 0 to 3 | 3 = 8% or more of usable reviews or 15 or more reviews; 2 = 4 to 8%; 1 = at least 3 reviews |
| Language | 0 to 2 | 2 = buyers use vivid, specific words you can quote; 0 = only generic praise |
| Gap | 0 to 2 | open 2, thin 1, crowded 0 |
| Profit and stock | 0 to 3 | 3 = product in the top third of gross profit per order with 8 or more weeks of cover; 0 = bottom third or under 4 weeks |

Break ties on gross profit per order. Drop any candidate that needs a claim the store cannot prove, or that only works by naming a buyer's health, age or money trouble in a way Meta bans [MCR-6023].

### 7. Write the first test for each angle

For each of the ten, write one test headline in buyer words and a one-line visual idea. The cheapest first read is a plain product image with a bold text bar, changing only the angle line [MCR-0075]; or swap only the headline into one product page ad [MCR-0080]. Hand winners to `write-one-page-creative-brief` for full production.

US note: a quote used in an ad must be a real review that reflects the buyer's real experience; no rewording that changes its meaning and no AI voice presented as the buyer [MCR-6021].

## Checks before you hand it over

- Every angle has at least 3 supporting reviews and 2 to 3 exact quotes with review ID and date.
- Counts use the usable denominator, and the summary states received and usable numbers.
- Every angle names one product, one buyer and one objection; no angle is a reword of another.
- Each angle shows its gap status against live ads.
- Ranking used gross profit per order and stock, or the table is marked unranked.
- No quote is translated, trimmed or merged without a label.
- Gifted, staff and incentivised reviews are excluded from counts and quotes.
- No first-test headline addresses the viewer's health, age, money or other personal attribute.

## Output

**One-screen summary:** usable reviews and sources, the top three angles in one line each, the biggest open gap, products held back for stock, and what to test first.

**Angle table:**

| Rank | Angle (one line) | Buyer | Tension | Product (SKU) | Objection answered | Quotes (ID, date, rating) | Count / usable | Gap | Gross profit per order | Score | First test headline | Visual idea |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Quote bank file** (`review-quote-bank.csv`): review_id, date, rating, product, verified, media, buyer, trigger, failed_fix, result, doubt, exact_quote, translation, permission_status, used_in_angle.

**To confirm:** one short list (quote permissions, any product question raised by contradicting reviews).

## Common mistakes

- **Summarising instead of quoting.** Step 2 pastes exact buyer words, which the ad needs.
- **Ranking by how many people said it.** Step 6 weighs gap and gross profit, so a popular angle on a thin-margin product does not top the list.
- **Five versions of one idea.** Step 4 defines an angle by buyer, tension or offer, not wording.
- **Treating delivery complaints as angles.** Step 1 splits service problems out.
- **Quotes the store cannot use.** Gate 3 checks rights before an angle depends on a quote.
- **Banned call-outs.** Step 6 drops angles that only work by naming the viewer's condition.

## Sources

- AVT-0007: read and paste exact quotes; tools strip emotional words.
- AVT-0008: contradicting 3-star reviews are a product question, not an angle.
- AVT-0009: buyers who spent on failed fixes are the highest-intent group.
- AVT-0014: a new buyer beats a new mechanism when products are alike.
- AVT-0016: repeated self-descriptions mark a buyer group.
- MCR-0002: test an unclaimed buyer in a crowded niche.
- MCR-0022: a new angle means a new buyer, tension or offer, not new wording.
- MCR-0075: smoke-test angles with one image and a text bar.
- MCR-0080: test angles by swapping only the headline.
- MEA-0037: gross margin is delivered cost.
- MCR-6021 (proposed): US rule on fake reviews and testimonials.
- MCR-6023 (proposed): Meta personal attributes policy.

What makes this skill ours: every count has a stated denominator and is never sold as market share; angles are ranked on gap against the store's own live ads and on gross profit per order and stock, not on mention count; review permissions and regional-language quotes are handled before an angle depends on them; and each angle leaves with a cheap first test, not just a label.
