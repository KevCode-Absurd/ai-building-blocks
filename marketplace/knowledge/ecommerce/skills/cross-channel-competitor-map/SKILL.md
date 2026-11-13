---
name: cross-channel-competitor-map
description: "Map what rival stores say and sell across Meta, TikTok, Google Search, Google Shopping and Amazon, using free tools: which themes and offers are crowded, which lanes are open, and which rival offers the store can afford to match. Weights each theme by how long ads have run (labelled a proxy, not proof of profit), adds marketplace and Shopping rivals that ad libraries miss, prices rival offers against the store's own gross profit per purchase, dates every finding with an expiry, and ends with 5 to 7 briefs aimed at open lanes plus an optional weekly tracker. Never copies rivals' ads, words or images. Use before a creative batch, a launch or a sale, or when a rival seems to be winning. Read access only."
---

# Cross-channel competitor map

**You get:** a dated map of rival ads and offers across Meta, TikTok, Google and Amazon: a rival list, ad log, marketplace table, theme heat map, offer check and five to seven briefs for open lanes.

Rivals show up in more places than the Meta Ad Library: on Google Shopping beside the store's product, on Amazon's first page, in search ads on the store's own brand name. This skill reads all of them with free tools, finds the messages everyone is crowding into and the ones nobody owns, and checks each idea against what the store can afford before it becomes a brief.

## When to use

- Before a new creative batch, to aim at lanes rivals have left open.
- Before a launch or a sale, to see the offers shoppers will compare.
- Costs rose and the owner suspects a rival is winning the auction or the Shopping slot.
- The store also sells on Amazon or Google Shopping and needs one view of rivals there.
- Monthly or quarterly category check.

## Not for

- A detailed read of rivals' Meta ads only, with tests sized from Meta data: use `store-meta-competitor`, which this skill hands Meta depth to.
- Pulling repeatable ad formulas (hooks, beats, timing) from long-running ads: use `category-ad-formula-teardown`.
- The store's own opponent position: use `brand-opponent-statement`.
- Choosing which of the store's own concept cells to make: use `creative-gap-grid`.

## What you need

**Required**

- Two to five rival names or URLs, or the store URL so you can find them (step 1).
- The category, the main country and the store's main search terms (five to ten).
- The store's products table with gross profit per purchase and the store's own theme list from `product-claims-profile`.

**Free tools used**

- Meta Ad Library (all active ads by page; in the EU and UK, ads also show more detail).
- TikTok Creative Center Top Ads and, for the EU, TikTok's ad library.
- Google Ads Transparency Center (ads by advertiser, region, format and date shown).
- Google Search and the Shopping tab, in a private window set to the store's main country.
- Amazon (or the main local marketplace) search results, first page.

**Optional**

- Paid ad intelligence tools if the store already has them; every step works without them.
- Google Ads auction insights and Search Console queries.

**When something is missing.** Without rival names, find them in step 1. Without gross profit per purchase, map the landscape but do not judge which offers the store can match.

**Access.** Level 1, read. No logins to rival accounts; no test purchases from rivals without the owner's yes.

## Before you start: the gates

1. **Gross profit per purchase is known.** It decides whether a rival's offer can be matched and which briefs are affordable. Fail: deliver the map and lanes, with briefs marked "offer not checked".
2. **Cash and capacity for the briefs.** Each brief needs a test budget of about three times its target cost per purchase and someone to make it. Fail: cut to the two or three best briefs.
3. **Findings are dated.** Every row gets a capture date and an expiry: 30 days for prices and offers, 90 days for themes and formats (practitioner default, test it). An expired row is rechecked before use.

## Steps

### 1. Find the real rivals per channel

Start from the owner's list, then add who actually appears:

- **Google Shopping and Search:** search the store's top five terms; note every seller on the first row of Shopping ads and the first page of results, and any search ads on the store's own brand name.
- **Amazon:** search the same terms; note the first-page sellers.
- **Meta and TikTok:** search the category terms in the ad libraries.

Prefer rivals one or two steps bigger than the store, choosing their longest-running ads, over category giants [MCR-0034]. Large brands with strong outside demand run ads that harvest it and cannot be copied by a small store [MCR-0064]. Keep three to eight rivals, covering four roles: closest positioning, a pricier rival, a cheaper rival, and one adjacent brand buyers also consider.

### 2. Log ads with run length

For each rival on Meta, TikTok and Google, log each active ad: channel, format, start date (or first shown date), days live on the capture date, the theme, the offer, the buyer it speaks to, and the landing page. Give each ad one theme by its dominant signal (what it leads with and who is on screen), not every theme it touches. Run length is a proxy that an ad pays, not proof: long runs can also be low-spend brand or retargeting ads, and a count of active ads says little about spend. Outside the EU and UK the Meta Ad Library shows only active commercial ads, so ads that died quickly are invisible there; read EU or UK results where the rival sells there. On organic and creator videos, drop high-view posts with under about 2% engagement, which are likely paid boosts [ORG-0010].

Weight each ad by run length, practitioner default, test it: under 14 days 0.5; 14 to 60 days 1; 61 to 180 days 2; over 180 days 3.

### 3. Log marketplace and Shopping positions

For each rival product on Google Shopping and Amazon: price, rating, review count, delivery promise, offer or coupon, badge, and main image style. On Amazon, a tight price band on page one signals a price war; a wide band means buyers judge on more than price [AMZ-0001]. Read the rivals' 1 to 3 star reviews; products rated around 4.1 to 4.3 that still sell show complaints the store can answer [AMZ-0002]. A sudden drop in the store's own Shopping click rate on a product often means a rival cut its price [GAD-0034]. If the store sells on Amazon too, remember that part of the value from its social ads may land there [MEA-0029].

For each rival, open the page behind its longest-running ad and note the headline, hero image, where proof sits, the offer, the guarantee and the price structure (single, bundle, subscription). Read ten recent 3 and 4 star reviews per rival and count the top complaints and praise. Plot rivals on price (low to high) against positioning (performance to lifestyle) and note whether the store sits in a crowded corner.

### 4. Build the theme heat map

Rows are themes (the store's own list plus any new ones found), columns are channels, cells are the sum of run-length weights. Add a row total and the number of rivals using each theme.

- **Crowded:** three or more rivals and a high weight.
- **Contested:** one or two rivals with long runs.
- **Open:** no rival, or only short runs.

An open lane may be open because it fails. Before calling it an opportunity, check the store's own evidence: quote counts in reviews and the claim tier from `product-claims-profile`. In crowded markets, a buyer nobody speaks to is often the best open lane [MCR-0002].

Formats rise and fall: once a format is widely promoted to marketers, expect it to fade [MCR-0062]. Note the formats rivals pile into, but do not chase them.

### 5. Price rivals' offers against the store's margin

Record the category's usual discount depth from the rival offers found. For each rival offer the store might meet (discount, bundle, free gift, free shipping threshold), compute the store's break-even ROAS if it matched. A 30% discount can roughly triple the ROAS needed [OFF-0065]. A rival with higher order value, margin or repeat value can win auctions with weaker ads [ADC-0057]; name it when that is why costs rose, so the store competes on a different lane rather than the same offer.

### 6. Write 5 to 7 briefs aimed at gaps

Each brief: the lane (open or contested), buyer type, theme, the store's proof and allowed claim, two customer quotes, an offer the margin allows with its break-even ROAS, a format the store can make, the channel, the target cost per purchase and test budget, and the expiry date of the finding it rests on. Order them by gross profit per purchase of the product times the store's evidence count. In a crowded lane, only a provable fact that is true but not obvious stands out from rivals repeating the same promise [BRD-0021]. No brief copies a rival's words, images or claims; describe the lane, not their ad.

### 7. Optional weekly tracker

One sheet: rival, channel, new ads this week, ads dropped, longest-running ad and days live, price and offer changes, Shopping position on the top terms, date checked. Fifteen minutes a week; changes trigger a recheck of the affected brief. Flag and look into: a rival that stops advertising (out of stock, moved channel or closing; a chance to bid harder), a sudden jump in a rival's live ads (expect auction pressure), a change of positioning, and a new name showing up in several places.

## Checks before you hand it over

1. Every row has a channel, a capture date and an expiry date.
2. Run length is labelled a proxy everywhere it is used.
3. Amazon and Google Shopping rivals are included where the store sells or competes there, or their absence is explained.
4. Every rival offer the store might match shows its break-even ROAS for the store.
5. Every open lane is checked against the store's own evidence before it becomes a brief.
6. No brief reuses a rival's wording, image or claim.
7. Theme weights add up from the ad log.

## Output

1. **One-screen summary first:** the three most crowded themes, the three best open lanes with evidence, rival offers the store can and cannot afford to match, and the date the map expires.
2. **Rival list:** rival, role (closest, pricier, cheaper, adjacent), channels found on, size signal, why included; plus the price and positioning map and each rival's landing page and review notes.
3. **Ad log:** rival, channel, format, theme, offer, buyer, landing page, start date, days live, weight, capture date.
4. **Marketplace and Shopping table:** rival, product, price, rating, reviews, delivery promise, offer, badge, capture date.
5. **Theme heat map:** themes by channel with weights, rival counts and lane status.
6. **Offer check:** rival offer, store's break-even ROAS if matched, verdict.
7. **Briefs** (5 to 7) and the optional **weekly tracker** template.

## Common mistakes

- **Meta only.** Step 1 adds Shopping, Search and Amazon, where shoppers compare side by side.
- **Long-running means profitable.** Step 2 labels run length a proxy and weights it in bands.
- **Copying a giant.** Step 1 favours rivals one or two steps bigger.
- **Open lane equals opportunity.** Step 4 checks the store's own evidence first.
- **Matching an offer the margin cannot carry.** Step 5 computes break-even ROAS.
- **Stale findings.** Gate 3 dates and expires every row.

## Sources

- [MCR-0034]: study rivals one or two steps bigger, longest-running ads.
- [MCR-0064]: big brands harvesting outside demand cannot be copied.
- [ORG-0010]: high-view, low-engagement videos are likely paid.
- [AMZ-0001]: Amazon page-one price spread signals a price war or not.
- [AMZ-0002]: 4.1 to 4.3 star products show fixable complaints.
- [GAD-0034]: falling Shopping click rate can mean a rival discounted.
- [MEA-0029]: some social ad value lands on Amazon.
- [MCR-0002]: in crowded markets, test an unclaimed buyer.
- [MCR-0062]: a format fades once widely promoted.
- [OFF-0065]: a 30% discount can triple break-even ROAS.
- [ADC-0057]: a rival's better economics can win the auction.
- [BRD-0021]: a non-obvious but true claim stands out in a crowded lane.

What makes this skill ours: it maps rivals on Shopping, Search and Amazon as well as social, with free tools; every finding carries an expiry date; open lanes must pass the store's own evidence before they become briefs; and every rival offer is priced against the store's gross profit per purchase before anyone suggests matching it.
