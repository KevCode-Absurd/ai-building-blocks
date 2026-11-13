---
name: google-quality-score-triage
description: "Finds the Google Search keywords where a low Quality Score is costing the store money, reads the three parts (expected click-through rate, ad relevance, landing page experience) and routes each ad group to the fix for the parts that are broken, with an owner and a recheck date. Only keywords that make money are fixed, fixes are ranked by spend at stake, and every landing page fix passes a speed and message-match check on the live page. Tracks one monthly number: the share of spend on keywords scoring under 7. Read access only; the client approves any ad or page change. Use it monthly on Search accounts."
---

# Quality Score triage for a store's Search keywords

**You get:** an ad group triage table routing each low Quality Score problem to its fix with an owner and recheck date, landing page checks, and draft ads with 8 headlines and 2 descriptions per fixed group.

Quality Score is Google's 1 to 10 rating of a keyword, built from three parts, each rated Below average, Average or Above average. It is a diagnosis, not a goal: Google says the score itself is not used in the auction, though the same signals are. A 4 on a keyword that makes money is fine; a 9 on one that loses money is not. This skill fixes the broken part on keywords where the fix pays.

## When to use

- Monthly, on any account with Search campaigns; the parts change slowly, so weekly runs are noise.
- Cost per click is rising on keywords you want to keep, and impression share lost to rank is growing.
- Before rewriting responsive search ads or landing pages for Search traffic.
- After a site redesign or theme change, to see whether landing page experience dropped.

## Not for

- Deciding which keywords to keep at all: use `google-keyword-tiers` first, then triage only the keepers.
- Search terms that should be negatives: use `google-search-term-mining`.
- Shopping and Performance Max (no Quality Score): use `google-shopping-product-tiers` or `google-pmax-diagnostics`.
- A full landing page rebuild: use `store-meta-landing`, then come back for the Search check.

## What you need

Required, read access (level 1):

1. **Keyword report**, last 30 to 90 days, Search campaigns. Columns: Keyword, Match type, Campaign, Ad group, Final URL, Quality Score, Exp. CTR, Ad relevance, Landing page exp., Impressions, Clicks, CTR, Avg. CPC, Cost, Conversions, Conv. value, Search lost IS (rank). Add the historical Quality Score columns for the trend.
2. **The ads in each ad group**: responsive search ad headlines, descriptions and ad strength, plus the assets attached (sitelinks, callouts, price, image).
3. **The live landing page URLs.**
4. **Gross profit per purchase**, from `store-meta-math`.

Optional: GA4 landing page report (Sessions, Engagement rate, Purchases), PageSpeed Insights results. The agent can run PageSpeed Insights itself; it is free.

Missing input: ask once. Without gross profit, rank by spend and say the keep calls are "reduced confidence".

## Before you start: the gates

1. **Money gate.** Gross profit per purchase known. Fail: rank fixes by spend, not profit, and say so.
2. **Keep gate.** Only keywords worth keeping are triaged. A keyword with enough clicks to judge and profit after ads below zero goes to `google-keyword-tiers` to be cut, not fixed.
3. **Data gate.** Skip keywords with no score (shown as a dash: not enough exact-match searches) and keywords under a minimum spend (practitioner default: about 1x gross profit per purchase in the period, test it). They are dust, not work.
4. **Tracking gate.** One primary purchase action with real values [MEA-0017] [MEA-0016]. Fail: the triage runs, the profit ranking does not.

## Steps

### 1. Pick the keywords and measure the stake

Keep keywords scoring 1 to 6 that pass the gates. For each: profit after ads = conversions x gross profit per purchase minus cost; spend at stake = its cost in the period. Google publishes no formula for how much a higher score cuts the click price, so never promise a saving.

Cost per purchase is cost per click divided by conversion rate [GAD-0038], so a landing page fix that lifts conversion rate can matter more than a cheaper click.

Account number to track every month: share of Search spend on keywords scoring under 7. It should fall over the quarter.

### 2. Route by the combination of broken parts

Treat Average as fine; only Below average counts as broken.

| Exp. CTR | Ad relevance | Landing page | Route |
|---|---|---|---|
| Below | fine | fine | Ad appeal: headlines, offer, assets; check search terms for wrong-intent traffic |
| fine | Below | fine | Ad group theme: split it, match the ad to the keyword |
| fine | fine | Below | Landing page: step 4 |
| Below | Below | fine | Ad group rebuild: split by theme, then rewrite ads |
| fine | Below | Below | Theme and page: split ad group and send each to its matching page |
| Below | fine | Below | Ad appeal and page |
| Below | Below | Below | Keep only if profit after ads is above zero; then rebuild ad group, ads and page; otherwise pause via `google-keyword-tiers` |

Order of work: ad and ad group fixes ship first because they take days; a landing page fix is scheduled the same week when the page is Below average, because it takes longer and lifts conversion too.

### 3. Batch the work by ad group

Group findings by ad group and route, not by keyword: one rewrite fixes many keywords. Sort ad groups by spend at stake. Brand ad groups are triaged separately; they usually score high and need little.

### 4. Write the ad fixes

- **Ad relevance:** one theme per ad group. If "linen shirts" and "cotton shirts" share one, split them. Put the keyword's main words in at least two headlines.
- **Expected CTR:** give the buyer a reason to click (price cue, offer, proof, delivery promise) and add the assets that fit: sitelinks to top categories, callouts for delivery and returns, price assets. Non-brand Search in competitive consumer categories should aim for about 7 to 8% CTR [GAD-0020]. Low CTR often comes from wrong-intent searches; send those to `google-search-term-mining`.
- Use about 8 headlines and 2 descriptions rather than the full 15 and 4, so combinations get enough impressions [GAD-0052]. Pin only where a message must show. Use keyword insertion only where every keyword reads well in the headline.
- Every claim in an ad must be true on the landing page today.

### 5. Check the landing page: message match and speed

For each page tied to a Below average rating, on a phone:

- **Right page.** Send each ad group to the most specific page that sells what was searched: the product or collection page, never the home page.
- **Message match.** The page headline names the product and promise the keyword and ad named. A keyword about one benefit lands on a page leading with that benefit [LPG-0064]. For high-intent search traffic, social proof sits right under the first screen [LPG-0050]; the first screen shows price, add to cart and a risk reducer [LPG-0034].
- **Speed.** Run PageSpeed Insights on mobile and note LCP, INP and CLS. Field data is a 28-day rolling sample, so a fix shows in lab data at once and in field data weeks later [SPD-0005]. Fix images first (product images under about 100 KB, hero under about 200 KB, never lazy-load the first image), then third-party scripts, then hosting [SPD-0002]. On Shopify, a lazy-loaded or faded-in hero is the usual cause of slow LCP [SPD-0006].
- **Use.** No pop-up in the first seconds, tap targets big enough, nothing that jumps as it loads.

### 6. Set owners and recheck dates

Each fix gets one owner: copy (marketer), theme and speed (developer), offer or price (owner). The parts are re-rated over weeks; a landing page re-score can take weeks to months [GAD-0038]. Recheck ad fixes after 3 to 4 weeks and page fixes after 6 to 8 weeks, in the next monthly run.

## Checks before you hand it over

- Every triaged keyword passed the keep gate and the data gate.
- Every ad group is routed by its actual combination of Below average parts, with the ratings shown.
- Every landing page fix shows its PageSpeed numbers and the message-match result in a written line.
- No ad claim is untrue on the page today.
- Fixes are sorted by spend at stake; no saving is promised.
- Each fix has an owner and a recheck date; the share of spend under 7 is reported.
- Nothing changes in the account or on the site without the client's yes; drafts only at level 2.

## Output

**One-screen summary first:** share of Search spend on keywords under 7 (this month and last), ad groups triaged, the five fixes with the most spend at stake, and the recheck dates.

**Table "Ad group triage":** Ad group, Keywords affected, Spend at stake, Profit after ads, Exp. CTR, Ad relevance, Landing page exp., Route, Fix, Owner, Recheck date.

**Table "Landing page checks":** URL, Ad groups sent there, Right page (yes or no), Message match (pass or fail, with the line), Mobile LCP, INP, CLS, Fixes in order.

**Draft ads:** per ad group fixed, 8 headlines (30 characters max) and 2 descriptions (90 characters max) with counts, plus the assets to add.

## Common mistakes

- **Chasing the score on losing keywords.** The keep gate stops it.
- **Treating Average as broken.** Only Below average is routed.
- **One fix per keyword.** Step 3 batches by ad group.
- **Sending search traffic to the home page.** Step 5 picks the most specific page.
- **Speed work in the wrong order.** Images first [SPD-0002].
- **Reading results too soon.** The parts move over weeks [SPD-0005] [GAD-0038].

## Sources

- GAD-0020: non-brand Search CTR norm about 7 to 8%.
- GAD-0038: cost per purchase equals cost per click over conversion rate; page re-score can take weeks.
- GAD-0052: 8 headlines and 2 descriptions rather than 15 and 4.
- LPG-0034: price, add to cart and risk reducers in the first mobile screen.
- LPG-0050: search traffic gets proof right under the first screen.
- LPG-0064: one benefit per page.
- MEA-0016, MEA-0017: one primary purchase action with real values.
- SPD-0002, SPD-0005, SPD-0006: speed fix order, field data lag, Shopify hero image.

What makes this skill ours: only keywords that make money are fixed; every combination of broken parts has one route and a stated order of work; landing page fixes pass a measured speed check and a written message-match check; and progress is tracked as one monthly number, the share of spend on keywords under 7.
