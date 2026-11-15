---
name: ad-launch-prepublish-check
description: "Gets a batch of new Meta ads live fast with no setup mistakes. Decides where each new ad goes (its own test ad set inside the proven campaign, never into a winning ad set), builds them paused by duplicating the proven setup through Ads Manager, the bulk import sheet or the Meta Marketing API, names them with one consistent pattern, then runs a pre-publish check on every ad: landing URL works and shows the advertised product in stock at the right price, tracking parameters are complete, naming matches the pattern, placements and text fit, pixel and optimisation event are right, and no near-duplicates. The client switches them on. Use for every creative launch."
---

# New ads live without setup mistakes

**You get:** a launch batch table, a 13-point pre-publish check per ad with fixes, and a filled bulk import sheet with every new ad built paused, ready to load into Meta once the owner says yes.

Most failed launches are not bad ads. They are broken links, missing tracking tags, ads dropped into the wrong ad set, or names nobody can read a month later. This skill builds the batch paused, checks every field, and hands the client a clean yes or no.

## When to use

- A new batch of creative is ready for Meta.
- Adding new ads to a campaign that already works.
- Relaunching old winners or new versions of them.
- Before a sale, when many offer versions go live at once.

## Not for

- Writing the ads: use `store-meta-concepts`, and `store-meta-ad-images` for images.
- Judging the ad itself (hook, claims, proof, call to action): run `prelaunch-ad-check` on the creative before this skill builds it.
- Designing a formal A/B test with a decision rule: use `store-meta-test`.
- Fixing the pixel or Conversions API: use `store-meta-capi`.

## What you need

Required:

1. **The creative files**, each with its intended placement sizes (1:1 or 4:5 for feed, 9:16 for stories and reels), primary text, headline, call to action and landing URL.
2. **The proven campaign** to copy: an Ads Manager export of its campaign, ad set and ad settings (objective, optimisation event, attribution setting, budget type, audience, exclusions, placements, URL parameters, dataset or pixel).
3. **The naming pattern**, or approval of the default in step 3.
4. **The store's target cost per purchase** from `store-meta-math`, to set the test spend.
5. **The live store URL** and current stock for each advertised product.

Optional: a creative tag sheet (persona, angle, offer, format, creator), partnership ad permissions from creators.

Access: level 1 to check an existing draft. Level 2 to build the ads paused. Switching ads on is publishing: the client does it, or approves it in writing at level 3. Never ask for passwords or tokens; for the API path, the client connects through Meta's own business tools and grants the access.

## Before you start: the gates

1. **Gross profit per purchase known.** Needed to set the test budget and the cut line. Fail: build the ads, but leave the test budget blank and ask for `store-meta-math`.
2. **Cash and stock.** Pass when every advertised SKU has more days of cover than the test needs, and the test spend fits the month's cap. Fail on a SKU: hold its ads; do not launch into a stock-out [ADC-0023].
3. **Tracking.** Pass when the proven campaign's purchases track store orders. Fail: launch nothing new; new ads cannot be judged without a working signal [ADC-0028].

## Steps

### 1. Decide where the ads go

- **New concept** (new persona, angle or offer): its own ad set inside the proven prospecting campaign, about 3 variations per concept [MCR-0079]. Practitioner rule from two sources: a daily minimum of about 1 times the target cost per purchase for 7 days, then remove or keep [ADC-0007]; keep a batch's minimum under about 20% of the campaign budget [ADC-0005].
- **New version of a winner** (new hook, new creator): its own ad set too, not inside the winner's ad set.
- **Never** add ads to an ad set that is hitting target; Meta sequences ads across views and new entrants can disturb a winner. Add or cut ads only in ad sets that underperform [ADC-0009].
- Group ad sets by concept (persona, angle, offer), not by launch date [ADC-0058].
- **Advantage+ sales campaigns** have one ad set, so a new concept cannot get its own. Practitioner default: test new concepts in the prospecting test campaign first, then add proven winners to the Advantage+ campaign by post ID. If the store runs only an Advantage+ campaign, add the batch there and read it with the spend rule in step 6.

### 2. Remove near-duplicates before you build

A new background colour or pose is not a new ad for Meta's delivery; near-identical ads are grouped and reach the same people [MCR-0022] [MCR-0078]. For each new ad, name what differs from its nearest live ad: persona, angle, offer or format. If none differs, merge it into a variation or drop it.

### 3. Name everything one way

Default pattern, built from the creative tags so winners can be traced to one element [MCR-0051]:

- Campaign: `PROSP | IN | purchase | broad | CBO` (funnel stage, country, goal, audience, budget type)
- Ad set: `P23 | persona | angle | offer | 2026-11-14` (pack number first, as packs are read by number [ADC-0016])
- Ad: `P23-A | format | hook | creator | v1`

Rules: no spaces at ends, a pipe between fields, the same words for the same thing every time, dates as YYYY-MM-DD.

### 4. Build the ads paused, by one of three paths

- **Ads Manager (manual, free):** duplicate the proven ad set, keep its settings, swap creative, rename. Leave status off.
- **Bulk import sheet (free, faster for 10 or more ads):** export the proven ads to the Ads Manager import template, fill one row per new ad, import with status paused.
- **Meta Marketing API (optional):** create ad sets and ads with status PAUSED from the same sheet, reusing proven settings by copying the ad set. The client grants access through their business settings.

On every path, build one ad completely, run the step 5 check on it, and only then copy it for the rest of the batch; one mistake copied twenty times is twenty mistakes. Up to a few primary text options per ad are fine if they keep the same angle, so the read stays about the creative.

Use proven ads' settings exactly; do not change targeting, attribution or optimisation event in a launch. Turn off flexible ad formats that mix assets: they hide which creative worked and can crop story assets into feed [ADC-0065]. Review each Advantage+ creative enhancement and keep only those the client approved.

### 5. Run the pre-publish check on every ad

Export the paused ads (or read the sheet) and check each row. Every line is pass or fail.

| # | Check | Pass when |
|---|---|---|
| 1 | Landing URL | Opens on a phone without an error, after any redirect |
| 2 | Product and price | The page shows the advertised product, in stock, at the price or offer in the ad |
| 3 | Tracking parameters | URL parameters carry utm_source, utm_medium, utm_campaign, utm_content; Meta's dynamic values for campaign, ad set and ad names are used where the store reads them (Meta documentation) |
| 4 | Parameters survive | The final page URL still carries them after redirects |
| 5 | Naming | Campaign, ad set and ad names match the pattern in step 3 |
| 6 | Campaign settings | Objective Sales, auction buying, no special ad category (none applies to a normal store), the store's pixel or dataset, optimisation event Purchase, same attribution setting as the proven campaign |
| 7 | Placements and sizes | Feed asset 1:1 or 4:5, story and reel asset 9:16 with text inside the safe area; each placement has its own asset |
| 8 | Text | Copy is current: no expired codes, old offers or dates carried over from the copied ad; primary text front-loads the point; headline does not cut off on a phone (check the preview) |
| 9 | Identity | Correct page and Instagram account; partnership ads have the creator's permission |
| 10 | Exclusions | Existing customers excluded from prospecting, as in the proven campaign |
| 11 | Duplicates | No two ads in the batch differ only in colour, pose or a word |
| 12 | Page limit | The page's active-ad count stays under Meta's limit after launch; heavy launch periods need more pages set up beforehand [ADC-0045] |
| 13 | Status | Every ad and new ad set is paused |

Any fail goes back to step 4 for that row only. Re-run the check after the fix. Then a second person (the client's buyer, or a fresh reviewer) reads the batch table once before it goes to the client; a builder misses their own copy-paste errors.

### 6. Set the read rule before launch

Write the cut and keep lines into the launch note so nobody makes them up later: after spending 3 times the target cost per purchase, 3 or more purchases keep, 2 wait, 0 or 1 cut [ADC-0039]. Add the date the 7-day test minimum ends.

### 7. Hand over for the switch-on

Send the client: the batch table, the check results, the total test spend for 7 days, the read rule and dates. On their yes, they switch on, or you do at level 3. Log the launch in the decision log used by `daily-ad-account-review`.

### 8. Payment options and chat orders

Check the landing page shows the payment options the ad promises (cards, wallets, buy now pay later, pay on delivery where offered) and the price the buyer will pay, including VAT or sales tax where the market shows tax-inclusive prices (UK, EU, Australia). If ads point to WhatsApp or Messenger chat instead of the site, add utm-style tracking through the chat link's prefilled text or a separate number, practitioner default, so those orders can be counted.

### 9. Walk the creative as a phone viewer meets it

Step 5 checks the setup. Before switch-on, also walk each finished ad the way a viewer meets it on a phone, sound off:

- **First second:** something moves or changes in frame 1; the product or brand shows early; any words on frame 1 read in about 2 seconds (flag more than 8 words); on a still, note where the eye lands first.
- **Middle:** the one message fits in one sentence; picture and words agree; flag a hold of more than about 3 seconds with nothing changing.
- **End:** one next step, and the button matches it. Cut the last 3 seconds in your head: if the message still lands, the ending is padding.
- **Text limits:** main text should land its point in about the first 125 characters before "more"; headline about 40. Captions on every spoken line.
- **Versions:** each version differs from the others in one nameable thing (reason, buyer, format or opening). More than 4 versions from one script is a flag.

Sort what you find into **stop-ship** and **worth a look**. Stop-ship holds only wrong facts, wrong product, a wrong or lookalike logo or font, hidden or misspelt words, and the wrong size for the placement. Taste never stops a launch; it goes in worth a look with one suggested fix. Anything you could not check is marked not checked, never passed.

## Checks before you hand it over

- Every new ad sits in its own ad set, none inside a winning ad set.
- Every ad differs from its nearest live ad on persona, angle, offer or format.
- All 13 pre-publish checks pass on every row, with the results attached.
- Names follow one pattern across the whole batch.
- Test spend fits the monthly cap; advertised SKUs have the stock for it.
- The read rule and its dates are written before launch.
- Everything is paused until the client says yes.
- Every ad has a creative walk result: stop-ship items (or none), worth-a-look items and anything not checked.

## Output

**Summary, one screen:** ads in the batch, concepts, ad sets created, 7-day test spend, checks passed, anything held back and why, and the yes needed.

**Table "Launch batch":** Ad set name, Ad name, Concept (persona, angle, offer), Differs from nearest live ad by, Format and sizes, Landing URL, Price on page, Stock days, Daily minimum, Status.

**Table "Pre-publish check":** Ad name, then one column per check 1 to 13 with pass or fail, and a Fix column.

**File:** the filled bulk import sheet or API input sheet, `launch-batch.csv`, ready to load.

## Common mistakes

- **New ads dropped into the winning ad set.** It can upset delivery of the winner. Step 1 gives each concept its own ad set [ADC-0009].
- **"New" ads that Meta sees as the same ad.** Step 2 removes near-duplicates [MCR-0078].
- **Links that lose their tracking tags on redirect.** Check 4 tests the final URL.
- **Advertising a product that sold out yesterday.** Gate 2 and check 2 look at stock and price on the day.
- **Flexible ads that hide what worked.** Step 4 turns them off [ADC-0065].
- **Making up the cut rule after the results.** Step 6 writes it first.
- **Holding a launch over taste.** Only wrong facts, product, logo, words or size stop an ad.

## Sources

- ADC-0005, ADC-0007: test ad set minimum spend and its share of budget.
- ADC-0009: change ads only in underperforming ad sets.
- ADC-0016: pack naming inside one prospecting campaign.
- ADC-0023: no ads into a stock-out.
- ADC-0028: tracking before new tests.
- ADC-0039: spend-based read rule for new ads.
- ADC-0045: page ad limits at high launch volume.
- ADC-0058: group ad sets by concept.
- ADC-0065: avoid flexible ads.
- MCR-0022, MCR-0078: near-duplicates are not new ads.
- MCR-0051: tag every ad on the same fields.
- MCR-0079: about 3 variations per new concept in its own ad set.

What makes this skill ours: a placement rule that keeps new ads out of winning ad sets; a 13-point check that includes stock and price on the live page, not just the link; a duplicate test against Meta's own grouping; and the read rule written before launch so results cannot be bent later.

## Selling in India

- The landing page should show cash on delivery and UPI if the ad promises them, and the price including GST.
