---
name: store-meta-competitor
description: "Read rival stores' Meta ads in the free Meta Ad Library and turn them into tests the store can afford. Uses how long an ad has run as the main sign it works, then logs each rival's offers, angles, buyers, formats and landing pages, prices their offers against the store's own gross profit per purchase, and ends with a gap table and ranked test ideas. Never copies anyone's ads, words, images or claims. Use before a new creative batch, a launch or a sale, when a rival seems to be winning, or once a quarter. Read access only."
---

# Rival ad research for an online store

**You get:** a rival roster, a competitor ad log from the Meta Ad Library, a long-runner table, an offer check against store profit, a gap table and the top test idea with its cost.

## When to use

- Before briefing a new batch of ad concepts, to find angles and buyers nobody owns.
- A rival seems to be winning the auction: costs rose and the owner wants to know why.
- Before a launch or a sale, to see what offers shoppers will compare against.
- The store's concepts all look alike and the team has run out of ideas.
- Quarterly check on the category.

## Not for

- Writing the new ads themselves: use `store-meta-concepts`.
- Judging the store's own live ads: use `store-meta-creative-review`.
- Building the overall plan and budget: use `store-meta-plan`.
- Fixing the store's own product page: use `store-meta-landing`.

## What you need

Required:

1. **The store's hero products** with price, usual offer and gross profit per purchase (GPP). If GPP is missing, compute it as `store-meta-plan` does: order value after discount minus landed cost, shipping and pick-pack, payment fees and expected returns.
2. **Countries the store sells to.** The Ad Library is filtered by country.
3. **Rival list or category words.** If the owner gives none, find rivals by searching the category words in the Ad Library and in Google Shopping, and confirm the list with the owner once.

Optional:

4. Meta Ads Manager export, last 30 days, ad level: Ad name, Amount spent, Impressions, CPM, Link clicks, Purchases, Attribution setting. This shows whether the store's own costs rose when a rival got busier.
5. The store's own concept list (persona, angle, offer, format per live ad), or let this skill build it from the Ads Manager export.
6. Rival product reviews (their site, Amazon) for buyer words.

**Tools:** the free Meta Ad Library website (facebook.com/ads/library). No paid spy tool is needed; if the owner has one, use it only for longer history and say so. **Access:** level 1 (read) for everything. This skill never creates, edits or launches anything.

## Before you start: the gates

1. **Money.** *Pass:* GPP and break-even ROAS known for the hero products. *Fail:* compute them first; without them no rival offer can be judged, only described.
2. **Cash and stock.** *Pass:* you know the test budget per concept (3 × target cost per purchase [ADC-0039]) and which products have stock for a test. *Fail:* ideas are listed but not ranked, and the summary says why.
3. **Enough rivals.** *Pass:* at least 3 rivals running ads in the store's country. *Fail:* widen to adjacent categories and format sources outside the niche [MCR-0055], and say the read is thin.
4. **Tracking (only for the cost-rise question).** *Pass:* the store's own purchase counts are trustworthy (Meta purchases not above Shopify orders for the same dates). *Fail:* answer the rival question, but do not blame rivals for a cost rise you cannot measure; refer to `store-meta-capi`.

## Steps

1. **Pick the right rivals.** Choose 5 to 8:
   - 2 direct rivals at a similar price.
   - 2 or 3 brands one or two steps bigger, about 10 times the store's size, not the category giant [MCR-0034].
   - 1 brand in an adjacent category selling to the same buyer.
   - 1 or 2 format sources from outside the niche, for structure only [MCR-0055].
   Giants are poor models: a brand with demand from outside the ad account can run ads that would fail cold for a smaller store [MCR-0064].

2. **Collect from the Ad Library.** Search each brand's Page, set the country and "All ads", and record each ad in the log (see Output). For each ad note: Library ID, "Started running on" date, days live, how many versions share the creative, platforms, format, first line of primary text, headline, call to action, landing URL and page type (product page, collection, homepage, quiz, advertorial), offer, buyer named or shown, angle, proof type. Cap at the 30 longest-running and the 10 newest ads per rival. The Library shows what is live, not spend, results or targeting; spend is shown only for political and social issue ads. In EU countries it also lists ended ads and reach, which gives a longer history there.

3. **Read run length as the main signal.** A store does not keep paying for an ad that loses money, so long life is the best free evidence of a winner [MCR-0034]. Practitioner defaults, test them:
   - Live 30 days or more: probably working.
   - Live 90 days or more, or many versions of one creative: a proven concept that rival is scaling.
   - Launched in the last 14 days: what the rival is testing now, not proof.
   Discount run length when the ad is a brand or retargeting ad, or a catalog ad, which run for months without being cold winners [MCR-0034]. Some fashion brands rotate fast, with a median live ad age of 5 days at Alo [MCR-0065], so for them read the newest batch for direction instead. Ad count is not budget: near-copies are grouped by Meta and add no reach [MCR-0078], so count distinct concepts, not ads.

4. **Tag each long runner as a concept.** Concept = buyer × angle × offer × format [MCR-0009]. Add awareness stage (problem, solution, product) and proof type (review, demo, founder, expert, comparison). A new colour or background is the same concept [MCR-0022].

5. **Price every rival offer against the store's money.** For each recurring offer (percent off, free gift, bundle, free shipping threshold), compute what it would do to the store's GPP and break-even ROAS. A 30% discount can triple break-even ROAS [OFF-0065]. Mark each offer "affordable", "affordable on a bundle only" or "not affordable". A rival with higher order value or repeat value can outbid the store with weaker ads [ADC-0057]; if so, the answer is a different buyer or a better bundle, not a price war.

6. **Check where their ads land.** Open the landing URL of each long runner on a phone. Note the page type and whether the page leads with the ad's buyer and promise. Rivals that send separate buyers to separate pages [LPG-0070], or cold traffic to an advertorial for a complex product [LPG-0004], show what the store's own pages may need.

7. **Mine their buyers' words.** Read rival reviews by hand and paste exact phrases [AVT-0007]. Phrases that repeat ("as a nurse", "after my second baby") mark a buyer group worth its own ads and page [AVT-0016].

8. **Build the gap table.** Rows are angles, buyers, offers, formats and page types; columns are each rival and the store. Mark who owns each row (a long runner) and who only tests it. Gaps worth testing:
   - A buyer nobody speaks to. In a crowded niche, an unclaimed buyer beats a louder version of the same promise [MCR-0002]. If the store's product is the same as a big rival's, an unserved buyer works better than a new mechanism claim [AVT-0014].
   - An objection no rival answers (durability, fit, delivery time). Checkout abandoners can confirm it [MCR-0043].
   - A format the category ignores, if the store can produce it. A format every rival copies is near its peak [MCR-0062].

9. **Turn gaps into test ideas, then rank them.** Each idea states the concept, the evidence (at least two pieces: a rival long runner, buyer words, a review theme or the store's own data), the landing page, the offer and its effect on GPP, and the test cost at 3 × target cost per purchase [ADC-0039]. Rank by expected gross profit: chance of a win × likely gain × GPP × traffic, minus build cost [CRO-0013]. Keep the top 5.

10. **Apply the no-copy rules.** Take structure, never surface: no rival words, images, footage, music, product names, trademarks or before-and-after claims. Any claim in a new idea needs the store's own proof. A rival's comparison to the store goes to the owner, not into an ad.

## Checks before you hand it over

1. Every rival ad cited has a Library ID, a start date and days live.
2. Long runners are separated from brand, retargeting and catalog ads.
3. Each rival offer has its effect on the store's GPP and break-even ROAS.
4. The gap table counts concepts, not ads.
5. Every test idea has two pieces of evidence, a landing page, a GPP check and a test cost.
6. No idea reuses a rival's words, images, names or claims.
7. The summary says what the Library cannot show (spend, results, targeting).

## Output

1. **One-screen summary:** the 3 strongest rival concepts and why, the biggest gap, the top test idea with its cost, and confidence.
2. **Rival roster:** Rival, Size step versus the store, Live ads, Distinct concepts, Longest-running ad in days, Main offer, Main page type.
3. **Ad log** (`competitor-ad-log.csv`): Rival, Library ID, Started, Days live, Versions, Format, Platforms, Buyer, Angle, Awareness stage, Proof type, Offer, CTA, Landing page type, URL.
4. **Long-runner table:** Rival, Library ID, Days live, Concept, Why it likely works, What the store can learn (structure only).
5. **Offer check:** Rival, Offer, Store GPP if matched, Break-even ROAS if matched, Verdict.
6. **Gap table:** Row (angle, buyer, offer, format, page), each rival, the store, Gap or owned.
7. **Test ideas:** Rank, Concept, Evidence 1, Evidence 2, Landing page, Offer, GPP after offer, Test cost, Expected gross profit.
8. File: `COMPETITOR-READ.md`.

## Common mistakes

- **Reading ad count as budget.** Fifty near-copies are a few concepts [MCR-0078]. Step 3 counts concepts.
- **Copying a category giant.** Their ads harvest demand made elsewhere [MCR-0064]. Step 1 picks brands one or two steps up.
- **Treating every long-running ad as a winner.** Retargeting and catalog ads run for months. Step 3 separates them.
- **Matching an offer the store cannot afford.** Step 5 prices it first.
- **Swiping too close.** Copying words or footage risks takedowns and claim issues [MCR-0055]. Step 10 keeps structure only.
- **Chasing the format everyone copies.** Step 8 checks it is not past its peak [MCR-0062].

## Sources

ADC-0039: read at 3 × CPA; ADC-0057: unit economics set the bid; AVT-0007: paste exact review words; AVT-0014: unserved buyer beats mechanism; AVT-0016: self-identifying phrases mark segments; CRO-0013: rank by expected gross profit; LPG-0004: advertorial for complex products; LPG-0070: route traffic by buyer; MCR-0002: test an unclaimed buyer; MCR-0009: concept matrix; MCR-0022: colour change is not a concept; MCR-0034: study bigger brands' longest ads; MCR-0043: one ad per objection; MCR-0055: swipe formats outside the niche; MCR-0062: copied formats fade; MCR-0064: giants harvest outside demand; MCR-0065: some brands rotate fast; MCR-0078: near-copies grouped; OFF-0065: discount can triple break-even.

Coverage checked against the open-source meta-ads skill set (MIT), https://github.com/AI-Marketing-Hub/meta-ads.

What this skill does that the open-source one did not: it makes run length, not ad count, the main signal and says when that signal lies; it prices every rival offer against the store's own gross profit per purchase; it ends in ranked, costed test ideas with two pieces of evidence each; and it sets hard no-copy rules and drops the guessed spend formula and the "60% similarity" claim.
