---
name: store-meta-concepts
description: "Write Meta ad concepts, copy and a test plan for an online store. Each concept is one product, one buyer group, one angle (problem, desire, proof, comparison, offer, founder story or user-generated) and one offer, tied to the product's gross profit per purchase, a verified proof point and a real customer quote. Copy is written inside Meta's recommended lengths with character counts, and only uses claims the store can prove. The number of concepts comes from the test budget the store can afford, and the plan says when to keep or cut each one, checked against store orders. Use it after the store profile exists and before making ad images, when ads need fresh angles, or before a sale period."
---

# Meta ad concepts and copy for a store

**You get:** a campaign brief file with Meta ad concepts tied to profit and proof, a copy deck with character counts, visual briefs and a test plan with keep or cut rules.

A concept is a reason to buy, aimed at one kind of buyer, for one product the store makes money on. Every line traces to a product, a proof point or a customer's own words.

## When to use

- The store profile from `store-meta-brand-dna` is ready and the store needs its first or next round of concepts.
- Live ads are tiring (frequency climbing, cost per purchase rising) and need new angles, not new colours.
- A sale, launch or seasonal push needs offer concepts with the break-even maths done.

## Not for

- Building the profile, product ranking or proof list: use `store-meta-brand-dna`.
- Making the images: use `store-meta-ad-images`.
- Reviewing ads already running for fatigue or format mix: use `store-meta-creative-review`.
- Designing a full experiment with sample sizes, or a holdout: use `store-meta-test`.

## What you need

**Required**

- `brand-profile.json` and `customer-words.md` from `store-meta-brand-dna`: product money table, offer, proof table, claims allowed and banned, customer quotes, buyer groups.
- Target cost per purchase for each product (gross profit per purchase minus the profit the owner wants to keep per order). If the owner has no view, use break-even cost per purchase and say so.
- Monthly Meta budget and the most the owner will spend on testing this month.
- Landing pages that exist today: product pages, collection pages, any advertorial or quiz page.

**Optional**

- Meta Ads Manager export, last 90 days, by ad: ad name, spend, frequency, CTR (link), purchases, cost per purchase, purchase value, attribution setting.
- Shopify orders export, same dates (Created at, Lineitem sku, Total, Discount code, Customer ID), to split new and returning buyers.

**When something is missing.** No profile: run `store-meta-brand-dna` first, or ask once for the hero product's price, costs, offer and three real reviews, and label the result low confidence. No costs at all: stop.

**Access.** Level 1, read, for the whole job. Level 2, draft, only if the owner wants the copy loaded into Ads Manager as paused ads. Never publish, launch or set budgets; that needs the owner's yes.

## Before you start: the gates

1. **Gross profit per purchase is known** for every product a concept will sell, with its target cost per purchase. Fail: drop that product from this round.
2. **Stock and cash allow it.** Only products in Advertise status (days of cover above lead time) get concepts. The test plan's total spend must fit the owner's test cap. Fail: cut concepts until it fits.
3. **Proof exists.** At least one Verified proof item and one customer quote per product. Fail: write no proof or user-generated concepts for that product, and list the gap.
4. **Tracking is good enough to read a test.** Meta purchases for the last 30 days are within about 20% of Shopify paid-social orders over the same dates (practitioner default, test it), or `store-meta-capi` has passed. Fail: concepts can still be written, but the test plan reads results from Shopify orders by landing page and discount code, not from Ads Manager.

## Steps

### 1. Work out how many concepts the store can afford

Test spend per concept is 3 times target cost per purchase at minimum, 5 times for a firm call [ADC-0039]. Concepts this month = test cap divided by that figure, rounded down. Example: $40 target, $1,200 cap gives 10 concepts at 3x, 6 at 5x. Write one or two spare.

Meta documents about 50 optimisation events in 7 days to leave learning. Most stores cannot fund that per test and do not need to: daily budget = purchases wanted x expected cost per purchase / days [ADC-0066].

Under about $100k a month, an account needs only 1 to 3 winning concepts at once [MCR-0058].

### 2. Define each concept on four axes

A concept is product x buyer group x angle x offer, with format as an optional fifth axis [MCR-0078]. It counts as new only if the buyer group, angle or offer differs from every live ad; a new background colour or pose is a variation, not a concept [MCR-0022].

### 3. Pick angles that fit what the store can prove

| Angle | Needs from the profile | Fits when | Rule |
|---|---|---|---|
| Problem | "Before" and "failed fixes" quotes | Buyers know the problem, not the product | Name the situation, not the viewer's condition; Meta's personal attributes policy rejects "your acne" |
| Desire | "Outcome" quotes | The result is easy to picture | Benefit first, feature second [MCR-0019] |
| Proof | A Verified proof row | The store has real reviews, press or tests | Show count and date; outlet quote under any press logo [LPG-0037] |
| Comparison | A substantiated, current fact versus an alternative | One clear, checkable advantage | Compare with "the usual way" unless the claim about a named rival is provable [MCR-0043] |
| Offer | Live offer and its break-even ROAS | Offer is profitable at that ROAS | Ads name one offer, matching the default bundle on the page [OFF-0027] |
| Founder story | A real origin tied to the buyer's problem | Founder story links to the problem | The founder need not be on camera [MCR-0005] |
| User-generated | Customer photos or video with permission, or a creator brief | Product is shown well in real use | Mine real customer content for angles the brand never used [MCR-0035] |

For broad prospecting on larger accounts, most new concepts should speak to people who know the problem but not the product [MCR-0057]. A small store under its warm demand can start with product, proof and offer concepts; move up when cold frequency passes about 2 [MCR-0040].

### 4. Tie every concept to money and evidence

For each concept record: product SKU, gross profit per purchase, target cost per purchase, the proof row it uses, the quote it uses, the buyer group, and the landing page. Match the destination to the ad: a curiosity ad needs a page that explains, a clear ad can go to the product page [MCR-0030]. If you test several buyer groups for one product, give each its own page leading with its benefit where traffic allows [LPG-0064].

For offer concepts, recompute break-even ROAS at the offer's discount depth; a 25% sitewide discount on a 60% margin product can need about 50% more ROAS to earn the same [OFF-0005]. Above about $100 order value, show savings in money; below it, a percentage usually reads bigger [OFF-0026].

### 5. Write the copy inside Meta's limits

Meta's Ads Guide recommends about 125 characters of primary text (the rest hides behind "See more") and about 27 each for headline and description; check the current guide. In Reels and Stories the first line must carry the point.

Per concept, write:

- **2 to 4 hooks** on one body, each opening the primary text [MCR-0013]. A hook should filter for buyers, not just stop the scroll [MCR-0026].
- **3 primary texts**, the first 125 characters holding hook, product and proof.
- **3 headlines** and **1 description**, each within about 27 characters.
- **1 CTA button** from Meta's list: Shop Now for a product page, Learn More for an advertorial or quiz.

Rules for every line:

- Hooks use customer words from the quote bank.
- Every claim, number and price must sit in claims allowed and match the landing page as captured today. Never invent a count such as "10,000+ customers".
- No "it's not X, it's Y" lines; buyers read the pattern as AI copy [MCR-0016].
- Price, currency, shipping threshold and COD availability exactly as on the site.
- Count characters with a script or counter, not by eye, and show the count beside each line.

### 6. Write a visual brief per concept

For `store-meta-ad-images`: format, the real product photo to use, the proof element to show, on-image text (one short line plus price or offer), clear or curious [MCR-0019], and sizes 4:5 and 9:16.

### 7. Write the test plan

- One prospecting campaign; each concept its own ad set with its hook variations [MCR-0079], named by concept ID, product, buyer group and angle.
- Daily budget per ad set from step 1. Exclude existing customers so returning buyers do not flatter a concept.
- Read on 7-day click, at ad set level, not ad level [ADC-0059]. Below about $1,000 a day of spend, ignore daily swings and read over at least 7 days [ADC-0064].
- Decision at 3 times target cost per purchase: 3 or more purchases, keep; 2, allow one more target cost per purchase; 0 or 1, cut [ADC-0039].
- High CTR without purchases is not a win [MCR-0029].
- Before calling a winner, check Shopify: new-customer orders of that SKU in the test dates should not contradict Meta's count. Store orders decide when they disagree.

### 8. Check facts and fit

Open each landing page and confirm price, offer and stock against the copy; rerun the counts; remove any line that fails.

## Checks before you hand it over

1. Every concept names a SKU in Advertise status, its gross profit per purchase and target cost per purchase.
2. Every concept cites one Verified proof row and one customer quote.
3. No two concepts share the same buyer group, angle and offer.
4. Every line is within Meta's recommended length, with the count shown.
5. Every claim, number and price is in claims allowed and matches the live page today.
6. Offer concepts show the break-even ROAS at their discount depth.
7. Total test spend fits the owner's test cap, and every ad set has a read date and a keep or cut rule.
8. Nothing is set to launch; everything is a proposal or a paused draft.

## Output

1. **One-screen summary:** the concepts recommended, the one to test first and why in money, total test spend, the read date.
2. **Concept table:** ID, name, product SKU, gross profit per purchase, target cost per purchase, buyer group, angle, offer, awareness, proof row, quote, format, landing page.
3. **Copy deck:** concept ID, variant, primary text, characters, headline, characters, description, characters, CTA.
4. **Visual briefs**, one per concept.
5. **Test plan table:** ad set name, concepts, daily budget, start date, read date, keep or cut rule, store-side check.
6. **To confirm:** a short list for the owner.

Save it all as `campaign-brief.md`.

## Common mistakes

- **Calling a colour change a new concept.** Step 2 counts only buyer group, angle or offer changes.
- **An angle with nothing behind it.** Gate 3 and step 4 tie each concept to a Verified proof row and a quote.
- **A discount nobody priced.** Step 4 recomputes break-even ROAS for every offer.
- **Sending a curiosity ad to the product page.** Step 4 matches destination to ad.
- **Promoting a product about to sell out.** Gate 2 allows only Advertise products.
- **Picking winners on CTR or Ads Manager alone.** Step 7 reads purchases at ad set level and checks Shopify.

## Sources

- [ADC-0039]: judge a concept after 3x target cost per purchase, 5x for a firm call.
- [ADC-0066]: daily test budget formula.
- [MCR-0058]: concepts needed by monthly spend band.
- [MCR-0078]: near-duplicate ads share one entity.
- [MCR-0022]: a new colour or pose is not a new ad.
- [MCR-0019]: statics are either clear or deliberately curious.
- [LPG-0037]: press logos need the outlet's quote.
- [MCR-0043]: one objection per ad, with provable comparisons.
- [OFF-0027]: ads name one offer matching the default bundle.
- [MCR-0005]: founder ads work without the founder on camera.
- [MCR-0035]: mine customer content for new angles.
- [MCR-0057]: weight broad creative toward problem-aware buyers.
- [MCR-0040]: cold frequency above 2 signals fatigue.
- [MCR-0030]: set each ad's job by its destination.
- [LPG-0064]: one page per buyer group or angle.
- [OFF-0005]: a 25% discount can need about 50% more ROAS.
- [OFF-0026]: money off above about $100, percent below.
- [MCR-0013]: 2 to 4 hooks per body.
- [MCR-0026]: hooks must filter for buyers.
- [MCR-0016]: ban "it's not X, it's Y" lines.
- [MCR-0079]: each concept in its own ad set, about 3 variations.
- [ADC-0059]: judge creative at ad set level.
- [ADC-0064]: at low spend, read over 7 days or more.
- [MCR-0029]: high CTR can be a false winner.

Meta documentation: Ads Guide text recommendations, learning phase (about 50 optimisation events in 7 days), personal attributes policy.

Coverage checked against the open-source meta-ads skill set (MIT), https://github.com/AI-Marketing-Hub/meta-ads.

What this skill does that the open-source one did not: sets the number of concepts from the test budget and target cost per purchase instead of a fixed three; ties every concept to a product's gross profit, a verified proof point and a real customer quote, and bans invented numbers; replaces the unsupported "similarity score" rule with concept uniqueness by buyer group, angle and offer; adds a test plan with keep or cut rules checked against store orders.
