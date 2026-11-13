---
name: monthly-ad-batch-sprint
description: "Plan and produce a month of ad creative in one run with two approval gates: an approved plan, then approved briefs, then finished images or ready-to-paste prompts. The batch size is set by the lowest of three caps: what the test budget can actually read, how many new ads the spend level needs, and what the team can produce. Only products with known gross profit and stock get slots. Near-duplicates are filtered out before anything is made, so each ad is a real new concept or a real variation, and launch is scheduled in weekly batches with read dates and keep or cut rules. Works with any image tool or none. Use at the start of each month, before a peak season, or when creative output is ad hoc and nobody knows how many ads the account needs."
---

# Monthly ad batch sprint

**You get:** a sized monthly ad batch with a plan table, one brief card per ad, finished files at 1080 x 1350 and 1080 x 1920 or a prompt file, and a weekly launch schedule with read dates.

A month of creative, planned from money and capacity, filtered for repeats, and produced through gates the owner controls.

## When to use

- Start of the month: the account needs its next set of new ads.
- Creative is made ad hoc and nobody knows how many ads the store needs or can afford to test.
- A peak season or launch is coming and the creative plan must be set weeks ahead.
- A previous batch had many ads that looked alike and few results.

## Not for

- One ad today: use `proven-static-formats`.
- Writing concepts and copy in depth: use `store-meta-concepts`.
- Reviewing live ads: use `store-meta-creative-review`.
- Setting the overall Meta budget: use `store-meta-budget`.

## What you need

**Required**

- Brand files from `store-meta-brand-dna`: profile, proof table, customer words, claims allowed.
- Products with gross profit per purchase, target cost per purchase and days of stock cover versus reorder lead time (from `store-meta-math` and the inventory report).
- Monthly ad spend and the share for testing this month.
- Team capacity: hours per week for design, video, review; any creator or freelancer slots.
- Meta Ads Manager export, last 90 days, ad level: ad ID, name, ad set, spend, frequency, purchases, cost per purchase; plus the live ads' thumbnails.

**Optional**

- `format-scorecard.csv`, `visual-style-profile.md`, `prelaunch-log.csv` from earlier runs.
- A creative tracking sheet with launch dates and verdicts.

**When something is missing.** No capacity numbers: ask once; assume one person with 10 hours a week and say so. No export (new account): skip the gap scan; plan for net-new concepts only. No gross profit for a product: it gets no slots.

**Access.** Read only. Generating images may cost money on paid tools; the owner picks the tool and approves the spend. Uploading drafts needs draft access and a yes; launching needs a separate yes per batch.

## Before you start: the gates

1. **Gross profit per purchase known** per product. Fail: that product gets no slots.
2. **Cash.** The batch's test spend fits this month's test budget. Fail: the budget cap in step 1 decides the size.
3. **Capacity.** The team can produce and review the batch in the month. Fail: the capacity cap in step 1 decides the size.
4. **Stock.** Each product has cover beyond its reorder lead time. Fail: no slots for it this month, or only slots to clear slow stock.
5. **Tracking.** Ads Manager purchases within about 20% of store orders (practitioner default, test it). Fail: plan and produce, but read results from store orders by UTM or discount code.

## Steps

### 1. Size the batch: take the lowest of three caps

1. **Budget cap** = this month's test budget / (3 x target cost per purchase). Three times target is the minimum spend to judge a concept [ADC-0039]. Example: $3,600 test budget at $40 target gives 30 ads.
2. **Need** = about one new ad per $1,000 of monthly spend [MCR-0059], for accounts from about $20k to $1M a month. With history, use churn instead: winners lost per month divided by hit rate; 2 lost winners at a 5% hit rate needs about 40 [MCR-0025]. Under $20k a month, skip this cap.
3. **Capacity cap** = production hours available / hours per ad, by format.

Batch size = the lowest. Say which cap bound it. Test share of spend: about 30% when the account is profitable, 10% or less when not [ADC-0053]. Spend bands also guide the mix: under about $30k a month, founder-made content and about 3 concepts; $30k to $100k, 5 to 6 concepts with 2 or 3 creators [MCR-0039]. Those bands are in Australian dollars from Meta-led brands; rescale for other currencies.

### 2. Set the mix

- **Concepts:** under $100k a month, the account needs only 1 to 3 winning concepts at once [MCR-0058]. Plan concepts first, then variations.
- **Remakes, fixes, new:** about 50 to 60% remakes of past winners, 20 to 30% fixes of near-misses, 20 to 30% net-new, never zero new [MCR-0042]. New accounts: mostly new.
- **Awareness:** broad accounts trying to grow put most volume in unaware and problem-aware ads; small stores under their warm demand can start lower in the funnel [MCR-0057].
- **Format and cost:** statics cost about a quarter of video; compare by gross profit per ad [MCR-0023].
- **Source:** where possible, about a third each from AI-assisted, creator and in-house work [MCR-0037]. AI never makes a customer, reviewer or the product itself where the buyer judges colour, texture or fit.

### 3. Draft the plan and filter duplicates

Plan table, one row per ad: slot, product, concept key (buyer group x angle x offer), format, awareness stage, variation number, asset source, destination page.

Then filter:
- Two rows with the same concept key and format are the same ad unless their big visual setting differs (photo style, setting, who appears). Near-copies are grouped as one by Meta's delivery [MCR-0078]; a colour or pose change does not count [MCR-0022].
- At most about 3 variations per concept, each concept in its own ad set [MCR-0079]; more hooks on one body spread a small budget too thin [MCR-0013].
- Compare every row with the live ads; a row that repeats a live concept and format is cut or changed.

Fill freed slots with net-new concepts or reduce the batch.

**Gate 1:** the owner approves the plan.

### 4. Write the briefs

One brief card per ad: ad ID, concept key, product, gross profit per purchase, target cost per purchase, awareness, format and layout family (`static-ad-layout-blueprint`), visual settings (`ad-batch-visual-direction`), headline and copy with character counts, proof row with date, real asset files, production path, destination URL. Check every brief: one message, claims sourced, price and offer match the live page today.

**Gate 2:** the owner approves the briefs.

### 5. Check assets

Count real product and customer assets per brief. If short: plan a phone shoot or use `store-meta-product-photos`. Outside ads may inform structure only, never their words, photos or people.

### 6. Produce

Per brief, produce on the chosen path: designer, free editor, `layered-static-production`, `product-photo-ad-variations`, or, if the owner wants prompts only, a prompt file from `ad-image-prompt-compiler` with the reference photo named per prompt. Every finished file goes through `prelaunch-ad-check`.

### 7. Schedule launch and reads

- Launch in weekly batches. In accounts that can afford it, each batch of 4 to 8 new ads gets its own ad set in the prospecting campaign with a minimum spend near 1 times target cost per purchase a day for 7 days [ADC-0007]; smaller accounts use one test ad set and the daily budget the test plan allows.
- Each ad has a read date (when it should reach 3 times target cost per purchase) and a keep or cut rule: 3 or more purchases keep, 2 wait, 0 or 1 cut [ADC-0039].
- Launch only with the owner's yes per batch.

### 8. Close the month

Count launched ads, winners and hit rate: ads that spent over 5% of the campaign budget at target, divided by ads launched; about 5% is normal in accounts launching dozens a month [ADC-0017]. Carry the hit rate into next month's need calculation.

## Checks before you hand it over

1. The batch size equals the lowest of the three caps, with the binding cap named.
2. Total test spend fits the month's test budget.
3. Every slot's product has gross profit per purchase and stock beyond reorder time.
4. No two ads share concept key, format and big visual setting; no concept has more than about 3 variations.
5. Both gates were passed with the owner's explicit approval.
6. Every brief's claims have proof rows and its price matches the live page.
7. Every finished file passed `prelaunch-ad-check`.
8. Every ad has a read date and a keep or cut rule; nothing launched without a yes.

## Output

1. **One-screen summary:** batch size and the cap that set it, test spend, concepts, mix, weekly launch dates, what the owner must approve next.
2. **Sizing table:** budget cap, need, capacity cap, chosen size.
3. **Plan table:** slot, product, concept key, format, awareness, variation, source, destination, duplicate check (pass or fail).
4. **Brief cards**, one per ad.
5. **Finished files** at 1080 x 1350 and 1080 x 1920, or the prompt file.
6. **Launch schedule:** batch, ad IDs, ad set, daily budget, launch date, read date, keep or cut rule.
7. **Month-end read** (filled later): launched, winners, hit rate.

## Common mistakes

- **A fixed batch of fifty.** Step 1 sizes from budget, need and capacity.
- **Fifty ads, ten concepts.** Step 3 filters near-copies before any work.
- **Slots for a product about to sell out.** Gate 4 removes it.
- **Too many hooks on one body.** Step 3 caps variations per concept.
- **Generating before the plan is approved.** Gates 1 and 2 come first.
- **Launching everything on day one.** Step 7 launches weekly with read dates.

## Sources

- [ADC-0039]: judge after 3 times target cost per purchase; keep or cut rule.
- [MCR-0059]: about one new ad per $1,000 of monthly spend.
- [MCR-0025]: monthly volume from winner churn and hit rate.
- [ADC-0053]: 70/30 proven to test when profitable, 90/10 when not.
- [MCR-0039]: creative budget and concepts by spend band.
- [MCR-0058]: concepts needed by spend band.
- [MCR-0042]: split between remakes, fixes and new concepts.
- [MCR-0057]: most broad-account volume in unaware and problem-aware ads.
- [MCR-0023]: statics cost about a quarter of video; gross profit per ad.
- [MCR-0037]: a third AI, a third creator, a third in-house.
- [MCR-0078]: near-duplicates share one delivery entity.
- [MCR-0022]: a colour or pose change is not a new ad.
- [MCR-0079]: each concept in its own ad set with about 3 variations.
- [MCR-0013]: 2 to 4 hooks per body; more spreads budget too thin.
- [ADC-0007]: each new batch in its own ad set with a 1x target daily minimum.
- [ADC-0017]: creative hit rate.

What makes this skill ours: batch size set by the lowest of test budget, spend-level need and team capacity instead of a fixed count; slots only for products with known gross profit and stock; a duplicate filter on concept key and big visual settings before anything is made; weekly launches with read dates and a keep or cut rule.
