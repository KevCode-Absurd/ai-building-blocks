---
name: refresh-a-tired-winning-ad
description: "A fatigue check on one winning ad and six refreshes that each change exactly one part (hooks, presenter, setting, format, buyer or offer framing), so the winner's proven idea keeps selling. First proves the ad is really tired, not hurt by a price, stock, page, tracking or auction change, using frequency, hook and click trends against the account and cost per purchase on store orders. Then ranks the six refreshes by how much of the winner they keep, writes a brief line for each, and plans how to test them without switching off the original. Use when a long-running winner's cost per purchase is climbing, or before rebuilding an ad that may not need it."
---

# Refresh a tired winning ad

**You get:** a one-page fatigue check on one winning ad with a verdict (tired, not tired, or unclear) and the evidence, and if tired, six refresh briefs that each change one part of the ad, ranked, with a test plan that keeps the original running until a refresh proves itself.

## When to use

- A winner that carried the account for weeks or months is getting more expensive per purchase.
- The team wants to kill a winner and start over.
- Frequency on a cold ad keeps climbing.
- A big sale or season is coming and the best ad needs fresh versions.

## Not for

- Fixing the exact seconds where viewers leave a video: use `video-ad-retention-fix`.
- Sorting every live ad into scale, keep, fix or cut: use `store-meta-creative-review`.
- New ads in the visual style of several winners: use `new-ads-from-store-winners`.
- Only new openers for a working body: use `ad-opener-writer`.

## What you need

Required (read access, level 1):

1. **Ad-level export for the winner**, by week, since it launched: spend, impressions, reach, frequency, CPM, 3-second views, link clicks, click rate, purchases, cost per purchase (Meta Ads Manager, or TikTok or Google video equivalents).
2. **Account-level CPM and cost per purchase by week** for the same period, to separate the ad from the auction.
3. **Shopify orders by week** for the product the ad sells.
4. **Change log**: price, offer, landing page, stock, tracking, budget and campaign changes.
5. **The ad itself** and its raw footage or source files.
6. **Gross profit per purchase and target cost per purchase** (`store-meta-math`).

Optional: the ad's tags, retention curve by second, comments on the ad.

If raw files are lost, refreshes that reuse footage drop out; say which. Building refreshes in the account needs draft access; launching and budget moves need the client's yes.

## Before you start: the gates

1. **It was a real winner.** It met target cost per purchase on store-matched orders over a meaningful spend (about 5 times target cost per purchase or more [ADC-0039]). Fail: this is not a refresh job; send to `call-creative-test-winners`.
2. **Profit line known.** Fail: run `store-meta-math`.
3. **Stock and cash.** The product has stock to support more spend. How hard to push a winner depends on stock and cash: push when stock must sell, hold it steady to make it last [ADC-0012].

## Steps

### 1. Rule out other causes first

Before calling fatigue, check each, in the same weeks the ad got worse:

- **Auction:** did account-wide CPM rise as much? If yes, the ad is not the problem.
- **Site:** did store conversion rate fall for all traffic? Then the page, price, stock or shipping changed.
- **Offer or price:** changed in the window?
- **Tracking:** do platform purchases still match store orders?
- **Season:** the same weeks last year?
- **Budget:** a big budget jump pushes any ad to people less likely to buy.

If one of these explains the drop, verdict **not tired**; fix that cause.

### 2. Read the fatigue signs

On cold campaigns, an ad frequency above about 2 over 30 to 60 days points to fatigue or too little variety in the account [MCR-0040]. Then look at weekly trends against the ad's own best four weeks: hook rate (3-second views over impressions) falling, click rate falling, CPM rising faster than the account's, and cost per purchase rising while the site converts as before. Two or more of these together, with step 1 clear, gives **tired**. One alone gives **unclear**: run the cheapest refresh (new hooks) as the test.

**Name the kind of tired.** Ads tire for one of two reasons, and the refresh differs [MCR-6641]:

- **Stale:** the ad has reached its lifetime spend, or its look and audience repeat other ads in the account. Every ad has a fixed spend capacity, and ramping it faster only uses that up sooner [MCR-6790]. Fix with new hooks, presenters, settings or formats (refreshes 1 to 4).
- **Pool too small:** the buyer the ad speaks to is a narrow group that cannot absorb the daily spend. A tight call-out can saturate its group after roughly $10,000 of spend, and then frequency or cost climbs [MCR-6630] [MCR-6842]. Fix by widening the buyer (refresh 5) or by resting the ad and bringing it back later as people enter and leave that group. New hooks for the same narrow buyer will tire just as fast.

### 3. Name the parts of the winner

Write the ad as parts: buyer, angle, offer, hook (visual, text, voice), body, presenter, setting, format, length, call to action. Mark which part most likely carries it (often the angle and the body) and which part viewers have seen most (always the hook and the presenter). Keep the carrying parts; refresh the most-seen ones first.

### 4. Write six refreshes, one change each

| # | Change | Keeps | Why |
|---|---|---|---|
| 1 | 3 to 5 new hooks on the same body | angle, body, offer | most viewers leave in the hook; new hooks on a working body are cheap [MCR-0031] [MCR-0013] |
| 2 | Same script, new presenter | angle, script | a tired testimonial ad regained its spend with hooks shot by a different person [MCR-0047] |
| 3 | Same script, new setting | angle, script, presenter | reshooting a tired founder ad in a new place let it take much more spend [MCR-0012] |
| 4 | Same idea, new format (video to static, static to carousel, short to long cut) | angle, offer | apply new formats to proven ideas first [MCR-0052] |
| 5 | Same ad, new buyer named in hook and copy | angle, body | naming a segment in the copy can open a new group under broad targeting [ADC-0032] |
| 6 | Same ad, new offer framing (bundle, gift, per-use price), only if live and profitable | angle, body | a new offer is a new concept to buyers |

For refresh 1, film or design the new openings fresh; do not recut lines from the old opening, because most of the market has already seen it and scrolled past. A different person, setting or first image matters more than new words, and each new opening gets its own creative ID, so hook swaps still bring fresh reach under Meta's current delivery: one agency reports reviving ads that had spent $50,000 to $100,000 with about 50 new hooks [MCR-6652]. Treat every hook as three layers, the visual, the spoken line and the on-screen text, and change at least the visual [MCR-6743]. For a **static** winner, the opening is the image and headline: keep the primary text and offer, and make a new image and headline pair, or move the same message to a long-copy static.

Match the number of refreshes to the budget. Each needs enough spend to read; with a small budget, test three hooks, not ten.

Each change must be big enough to count as new to the delivery system: a new colour, crop or pose usually is not, and near-duplicates get grouped and shown to the same people [MCR-0022] [MCR-0078]. Rank the six by cost to make and how much of the winner they keep; hooks and new presenter usually first.

Language note: a winner that ran only in English can take a version in another language your buyers use, spoken by a native speaker, as refresh 5. On stores with many pay-on-delivery orders or high returns, every cost per purchase in this skill uses delivered, kept orders, not placed ones.

### 5. Plan the test

Do not switch the original off. **Set the pace by stock and cash first** [ADC-0012]: with plenty of stock and fast-returning cash, push the revived winner; with low stock, a long restock or slow cash, run it lower for longer and save the push until stock lands. Launch refreshes in their own test ad set at a small budget; move a refresh beside the original only after it reaches the store's keep rule (`call-creative-test-winners`). Some practitioners keep winners running far longer than fast-rotating brands do; a winner still under target cost per purchase stays on [MCR-0065].

When a refresh wins and moves to a scaling campaign, use the existing post (its post ID, through "use existing post" in Ads Manager) rather than a fresh upload, so its likes and comments carry over; do not edit the live ad, since edits can reset learning.

## Checks before you hand it over

- The verdict is tired, not tired or unclear, with the evidence row for each sign.
- Auction, site, offer, tracking, season and budget causes were checked and noted.
- Every refresh changes one part only, and that part is named.
- No refresh is just a colour, crop or pose change.
- Offer refreshes use only live, profitable offers.
- The original keeps running until a refresh passes the keep rule.
- Raw files needed for each refresh exist, or the refresh is marked blocked.
- The kind of tired (stale or pool too small) is named, and the refreshes match it.
- New openings are freshly made, not recut, and their count fits the test budget.

## Output

**One-screen summary:** the verdict in one line, the two strongest pieces of evidence, the cause if not tired, the six refreshes in rank order, and spend needed to test the top three.

**Fatigue check table:** Week, Spend, Frequency (30-day), CPM, Account CPM, Hook rate, Click rate, Cost per purchase (store-matched), Store conversion rate, Changes that week.

**Refresh briefs:**

| Rank | Refresh | Part changed | Parts kept | New element (hooks, presenter, setting, format, buyer or offer) | Source files | Maker | Due | Test budget |
|---|---|---|---|---|---|---|---|---|

**Proposed actions for approval:** new ad set, budgets, and any change to the original.

## Common mistakes

- **Calling fatigue when the auction or site changed.** Step 1 checks those first.
- **Changing three things at once.** Step 4 changes one part per refresh so the result teaches something.
- **Tiny tweaks the system ignores.** Step 4 rules out colour, crop and pose swaps.
- **Killing the original before a replacement works.** Step 5 keeps it running.
- **A new offer the store cannot afford.** Refresh 6 needs a live, profitable offer.
- **Refreshing a fluke.** Gate 1 checks it was a real winner first.
- **New hooks for a buyer pool that is used up.** Step 2 names a small pool and widens the buyer instead.
- **Recutting the old opening.** Step 4 films or designs new ones.

## Sources

- ADC-0012: push a winner according to stock and cash.
- ADC-0032: name a segment in the copy to reach a new group.
- ADC-0039: judge on spend relative to target cost per purchase.
- MCR-0012: reshoot in a new setting.
- MCR-0013: 2 to 4 hook variants per body.
- MCR-0022: colour or pose changes are not new ads.
- MCR-0031: most viewers leave during the hook; test hooks on a working body.
- MCR-0040: ad frequency above about 2 on cold campaigns.
- MCR-0047: a new presenter revived a tired testimonial ad.
- MCR-0052: new formats on proven ideas.
- MCR-0065: some keep winners running longer.
- MCR-0078: near-duplicate ads get grouped.
- MCR-6641: ads tire from staleness or a buyer pool too small.
- MCR-6790: each ad has a fixed lifetime spend capacity.
- MCR-6630: a tight call-out saturates its group quickly.
- MCR-6842: a narrow persona caps daily spend.
- MCR-6652: new hooks get new creative IDs and revive fatigued ads.
- MCR-6743: a hook has three layers: visual, audio and on-screen text.

What makes this skill ours: fatigue is only called after the auction, site, offer, tracking, season and budget are ruled out, so the store does not rebuild an ad that was never the problem; each refresh changes exactly one named part that is big enough to count as new; the original keeps selling until a refresh passes the store's own keep rule; and an offer refresh needs a live, profitable offer.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. A winner that ran only in English can take a Hindi or regional-language version as refresh 5. On COD stores, every cost per purchase uses delivered orders, not placed ones.
