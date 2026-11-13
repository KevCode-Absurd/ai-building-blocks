---
name: weekly-creative-sprint
description: "Run a store's weekly creative cycle in one pass: read the last 1 to 4 weeks of ad results against store orders, flag tired winners and plan a successor for each, count how many test slots the week's budget can fund at the store's own target cost per purchase, rank new concepts by the gross profit per purchase of the product they sell, reject any concept that repeats an angle already tested, and hand over finished briefs (belief to overcome, awareness stage, buyer type and feeling per variant, designer spec) plus a test plan with read dates and keep or cut rules. Use every week on a running account, or when the production queue runs dry. Read access only; launching needs a yes."
---

# Weekly creative sprint for an online store

**You get:** a weekly creative plan: a slot table sized to the budget, one brief card per slot, successors for tired winners, a repeat checker log, an updated angle log and a numbered approval list.

## When to use

- Every week, on a store running Meta (or TikTok) ads with new creative going live most weeks.
- The team makes ads from gut feel and cannot say why this week's ads were chosen.
- Winners are tiring and nobody has planned what replaces them.
- Tests keep ending "inconclusive" because they were too small to read.
- A launch, promo or stock-out changes what the store should push this week.

This skill covers two jobs that are one store routine: weekly concept briefs from live results, and the weekly creative test plan.

## Not for

- A full verdict on every live ad with asset spec checks: run `store-meta-creative-review` first; this skill reads its verdicts.
- Writing final ad copy with character counts: use `store-meta-concepts`.
- One large experiment (A/B test, lift study): use `store-meta-test`.
- When results have stalled for a month and the team needs a map of everything ever tried: use `creative-gap-map`.

## What you need

Required:

1. **Meta Ads Manager export, ad level**, last 7 and 28 days: Ad ID, Ad name, Ad set name, Amount spent, Impressions, Reach, Frequency, Link clicks, 3-second video plays, ThruPlays, Purchases, Purchases conversion value, Attribution setting (7-day click).
2. **Store orders, same dates:** Shopify orders by `utm_content` (ad ID) or the order export with Created at, Total, Lineitem sku, Discount Code, Customer type.
3. **Money line per product:** gross profit per purchase (GPP) and target cost per purchase (CPP), from `store-meta-math`.
4. **Angle log:** every concept tested, with product, buyer, angle, offer, format, dates, spend, result. If none exists, this skill starts one from ad names.
5. **This week's calendar:** launches, promos, price changes, products low on stock.
6. **Store profile** from `store-meta-brand-dna`: claims allowed, proof bank, customer quotes.

Optional: the last `store-meta-creative-review` verdict table; stock by SKU; production capacity per week.

Missing 3: stop and run `store-meta-math`. Missing 2: use Meta 7-day click and mark every number "reduced confidence". Missing 4: build it in step 1 from ad names and say how many ads could not be tagged.

**Access:** level 1 (read). Launching ads, pausing tired ones or moving budget needs level 3 and a yes on a numbered list; level 2 can build them as paused drafts.

## Before you start: the gates

1. **Money.** *Pass:* every product in play has GPP and target CPP. *Fail:* no ranking; produce only the fatigue list.
2. **Cash.** *Pass:* the owner has set this week's test budget, or a monthly cap to divide. *Fail:* use step 4's default and ask once.
3. **Capacity.** *Pass:* you know how many ads the team (or creators) can finish this week. *Fail:* assume the count from last week's launches and say so.
4. **Stock.** *Pass:* each product to be briefed has at least 30 days of stock at current pace. *Fail:* brief it only if a restock lands inside the test window; tie ad pressure to stock [ADC-0023].
5. **Tracking.** *Pass:* Meta 7-day click purchases are not above store orders for the same dates. *Fail:* judge on store orders only; send the account to `store-meta-capi`.
6. **Clean window.** A sale or price change in the read window corrupts the read [MCR-0068]. *Fail:* move read dates or read on CTR and cost per click only.

## Steps

### 1. Update the angle log

Tag every ad that spent this week with a concept key: product, buyer, angle, offer, format. A new colour, pose or background is the same key [MCR-0022]; near-copies are grouped by Meta and add no reach [MCR-0078]. Use one tag set for every ad so wins trace to one element [MCR-0051].

### 2. Read last week on store money

Per ad set, then per ad (ad set reads are more reliable [ADC-0059]): store CPP = spend / store orders tied to the ad. Use verdicts from `store-meta-creative-review` if it ran. An ad under 3x target CPP spent is still learning. At 3x: 3 or more purchases keep, 2 wait, 0 or 1 cut; 5x for a firm call [ADC-0039]. Log results into the angle log as won, lost or under-tested. Under-tested is not lost.

### 3. Flag tired winners and plan successors

A winner is tiring when two of these hold over the last 7 days against its own first 14 days:

- Cold frequency above about 2 over 30 days [MCR-0040].
- Store CPP up 20% or more for two weeks running (practitioner default, test it).
- Hook rate down 20% or more against its own early level (practitioner default, test it).

For each tired winner, name a successor now, in this order: the same script in a new setting or with a new person [MCR-0012] [MCR-0047]; new openers on the same body [MCR-0048]; then a new buyer or angle. Fatigue is a frequency problem first and a message problem second.

### 4. Count this week's test slots

- Test budget = about 30% of weekly spend when the account meets target CPP, 10% or less when it does not [ADC-0053].
- Slots = test budget / (3 x target CPP of the product), rounded down [ADC-0039].
- Each slot is one concept in its own ad set with about 3 hook variations [MCR-0079].
- Cap slots at what the team can finish this week.

Example: $7,000 weekly spend at target, $2,100 test budget, $35 target CPP: 20 slots in theory, so production capacity decides. If a slot cannot reach 3x target CPP within 7 days, merge slots; never run a test that cannot reach a read. For larger questions, send the idea to `store-meta-test`.

### 5. Fill slots in a fixed mix

About 50 to 60% remakes of past winners, 20 to 30% fixes of near-misses, 20 to 30% net-new concepts, never zero new [MCR-0042]. Tired-winner successors from step 3 come first inside the remake share. Accounts under about $100k a month need only 1 to 3 winning concepts at once [MCR-0058], so most slots extend proven ideas.

### 6. Rank candidates by expected gross profit

Score each candidate concept:

Expected weekly gross profit = chance it wins x GPP of the product x purchases a winner would add per week, minus production cost.

Use 5 to 15% as the chance a new concept wins unless the store's own hit rate says otherwise [MCR-0025]; use the past win rate of the concept's angle for remakes. When two concepts tie, the higher-GPP product wins: a cheap product with a low cost per purchase can still earn less per order [ADC-0022].

### 7. Run the repeat checker

Reject a candidate when its concept key matches a logged concept that lost after at least 3x target CPP spend in the last 90 days, unless the brief names what is new (buyer, offer or proof) and why the loss may have come from execution. Reject a candidate when only colour, background or wording changed [MCR-0022]. Allow a revival of an under-tested concept that got little spend [ADC-0031]. Print every rejection with the log row it matched.

### 8. Write one brief per slot

Each brief holds:

- **Concept key** and slot type (remake, fix, new, successor).
- **Product, GPP, target CPP, stock days.**
- **Belief to overcome:** the one thing the buyer must come to believe, from the quote bank.
- **Awareness stage**, kept to one stage per ad [MCR-0056]. On broad accounts most new volume goes to unaware and problem-aware buyers [MCR-0057].
- **Variants (about 3):** for each, the buyer type, the feeling it works on, the opener, and the proof shown. Openers should filter for buyers, not just stop the scroll [MCR-0026].
- **Destination:** a curiosity ad goes to a page that explains, a clear ad to the product page [MCR-0030].
- **Designer spec:** format and sizes (4:5 and 9:16), layout, on-screen headline of about 5 to 8 words [ORG-0016], the real product photo to use, tone in three words, claims used (from claims allowed only).

### 9. Write the test plan

Per slot: ad set name (slot, product, buyer, angle), daily budget, launch date, read date (when 3x target CPP is spent, at least 7 days [ADC-0064]), keep or cut rule from step 2, and the store-side check. Do not cut cheap-looking ads inside an ad set that is hitting target [ADC-0009].

## Checks before you hand it over

1. Every slot can reach 3x target CPP spend by its read date at the stated budget.
2. Total test spend fits the week's budget; slot count fits production capacity.
3. Every tired winner has a named successor.
4. No brief repeats a lost concept key without a stated new element; rejections are printed.
5. Every brief names a product with GPP, target CPP and 30 days of stock or a dated restock.
6. Every claim in a brief is on the claims allowed list.
7. The mix of remakes, fixes and new concepts is shown and new is not zero.
8. Nothing is launched; changes are a numbered approval list.

## Output

1. **One-screen summary:** last week in store money (spend, store orders, store CPP versus target), tired winners and successors, slots this week, the top concept and its expected weekly gross profit, read dates.
2. **Slot table:** Slot, Type, Concept key, Product, GPP, Target CPP, Daily budget, Launch, Read date, Keep or cut rule, Expected weekly gross profit.
3. **Brief cards**, one per slot, with the fields in step 8.
4. **Repeat checker log:** Candidate, Matched log row, Result, Reason.
5. **Updated angle log** `angle-log.csv`: Concept key, First launched, Spend, Store purchases, Store CPP, Result, Notes.
6. **Approval list:** launches, pauses and budget moves, numbered.

Save as `SPRINT-<date>.md` plus the two CSV files.

## Common mistakes

- **Ranking concepts by ROAS or hook rate.** Step 6 ranks by gross profit of the product sold.
- **Testing more concepts than the budget can read.** Step 4 counts slots from 3x target CPP.
- **Re-briefing a dead angle with a new background.** Step 7 rejects it with the log row.
- **Waiting for a winner to die before briefing its successor.** Step 3 plans it at the first two signals.
- **Calling an under-spent ad a loser.** Step 2 keeps it as under-tested.
- **Briefing a product about to stock out.** The stock gate blocks it.
- **Reading sale-week results as creative quality.** The clean-window gate moves the read.

## Sources

- ADC-0009: do not cut ads inside an ad set hitting target.
- ADC-0022: lowest-CPA product is not the most profitable.
- ADC-0023: tie ad pressure to days of stock.
- ADC-0031: revive ads that got no spend.
- ADC-0039: judge at 3x and 5x target CPA.
- ADC-0053: 70/30 proven to test, 90/10 when unprofitable.
- ADC-0059: judge at ad set level.
- ADC-0064: read on at least 7 days below about $1,000 a day.
- MCR-0012: reshoot a tired script in a new setting.
- MCR-0022: colour or pose is not a new ad.
- MCR-0025: hit rate and churn set volume.
- MCR-0026: hooks should filter for buyers.
- MCR-0030: destination sets the ad's job.
- MCR-0040: cold frequency above 2 signals fatigue.
- MCR-0042: remake, fix, new split.
- MCR-0047: new hooks by a new person revived a tired winner.
- MCR-0048: vary hooks on angle, offer, avatar, format.
- MCR-0051: tag every ad the same way.
- MCR-0056: one awareness stage per ad.
- MCR-0057: most volume to unaware and problem-aware.
- MCR-0058: concepts needed by spend band.
- MCR-0068: sale periods corrupt creative reads.
- MCR-0078: near-copies grouped by Meta.
- MCR-0079: about 3 hook variations per new concept.
- ORG-0016: on-screen hooks of 5 to 8 words.

What makes this skill ours: concepts are ranked by the expected gross profit of the product they sell, not by ROAS; test slots are counted from the store's own target cost per purchase so no test is launched that cannot reach a read; a repeat checker rejects lost angles against a logged concept key; and every tired winner gets a successor before it dies, gated by stock.
