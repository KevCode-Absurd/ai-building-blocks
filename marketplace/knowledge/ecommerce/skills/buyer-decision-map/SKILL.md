---
name: buyer-decision-map
description: "Map why the store's buyers actually buy: for each buyer type, the trigger that set off the purchase, the feeling behind it, the proof they needed, the result they expect and what almost stopped them, all counted from a post-purchase survey, reviews and short interviews. Then tags the store's current ads on the same points and checks the gaps against ad-level results and store orders, so the diagnosis rests on data, not opinion. Use before a new round of ads or pages, when ads talk to nobody in particular, or when the owner's picture of the customer has never been checked. Read access; a new survey needs the owner's yes."
---

# Buyer decision map

**You get:** buyer type briefs built from surveys, reviews and interviews, a codes table, a tag table of current ads, a gap table ranked by money, and a survey and interview kit, ready to guide new ads and pages.

People buy when something sets them off, they feel a certain way about it, they see enough proof, and they believe a result will follow. This skill finds those four things for each kind of buyer the store has, with counts, then checks which of them the current ads leave out, using real ad results rather than taste.

## When to use

- Before a new round of ad concepts, a new landing page or a new email flow.
- Ads talk to "everyone" and convert like it.
- The owner's description of the customer has never been checked against data.
- A new product or market is bringing a different kind of buyer.
- Ads with high click rates fail to sell and nobody knows why.

## Not for

- Writing the concepts and copy: use `store-meta-concepts` with this map as input.
- Matching copy to how much a shopper already knows: use `awareness-stage-message-match`.
- Choosing which concept cells to make next: use `creative-gap-grid`.
- A full Meta account audit: use `store-meta-audit`.

## What you need

**Required**

- Reviews: review app export (rating, title, body, date, product).
- Post-purchase survey answers if any exist (survey app export or Shopify order notes), last 90 to 180 days.
- Meta Ads Manager export, last 90 days, at ad level: campaign, ad set, ad name, ad ID, spend, impressions, CTR (all), CTR (link), purchases, purchase value, attribution setting. Add Google or TikTok exports if they carry real spend.
- Shopify orders for the same period (order date, products, discount code, UTM source and campaign if tagged) and the products table with gross profit per purchase.

**Optional, raises confidence**

- Up to 20 short customer interviews (step 2).
- Abandoned checkout list with contact consent.
- Support tickets and return reasons.

**When something is missing.** No survey yet: build the map from reviews and interviews at "medium confidence", and propose the survey in step 1 so the next pass is stronger. No ad export: deliver the map without the gap check and say the diagnosis is untested.

**Access.** Level 1, read. Adding a post-purchase survey or interview invite needs draft access and the owner's yes; messaging customers always needs the owner's yes. Calls to abandoned checkouts only with consent and within local telemarketing rules.

## Before you start: the gates

1. **Gross profit per purchase is known** for the products each buyer type buys. It weights the gaps in step 8. Fail: rank gaps by buyer share alone and say so.
2. **Cash and capacity.** Interviews take about 10 hours of someone's time for 20 calls; survey incentives cost money. Fail: skip interviews; use survey and reviews.
3. **Ad results are trustworthy enough.** Compare Meta purchases (7-day click) with Shopify orders tagged to Meta for the same dates. Within about 20% and stable week to week (practitioner default, test it): pass. Fail: use store orders by UTM campaign for the gap check, and report Meta numbers as context only.

## Steps

### 1. Get a post-purchase survey running

If the store has none, propose one on the thank-you page or order status page with three questions: "What made you buy today?", "What almost stopped you?" [CRO-0018] and "Where did you first hear about us?" with the channels listed. Post-purchase surveys often get very high completion without an incentive [LPG-0042]. Keep answers open text for the first two. The channel question also checks attribution: a channel taking half the spend should show up in about half the answers [MEA-0045], given hundreds of answers a month.

### 2. Interview a few buyers

Up to 20 recent buyers (within about 60 days of purchase), 30 minutes each; about that many interviews surface most of what a group thinks, and a survey checks it at scale [AVT-0017]. Promise no sales pitch in the invite; it fills calls fast [AVT-0018]. Record with permission and walk through the purchase in order:

- **The start:** the moment they stopped putting up with the problem, where they were, what they told themselves.
- **The search:** where they looked first, who or what they trusted, what surprised them, which options they ruled out and why.
- **The shortlist:** the two or three products they compared, what nearly made them leave, what made them trust this store.
- **The buy:** what tipped it (an offer, a review, a deadline, free shipping), how they justified it to themselves, who they told.

Open questions only. Do not ask "why did you buy?" (people rationalise), "would you pay more?" (hypothetical) or "would you recommend us?" (yes or no). Ask one key question twice, ten minutes apart; an answer that changes is a rationalisation. When memory stalls, ask them to show what they searched. Write each call up within 24 hours, with five to ten exact phrases.

### 3. Mine reviews with counts

Read reviews by hand and paste quotes verbatim [AVT-0007]. Note self-naming phrases ("as a runner", "for my dad") with counts; repeats mark a buyer type [AVT-0016].

### 4. Code every answer into five slots

For each survey answer, interview and review, code:

| Slot | Question | Example code |
|---|---|---|
| Trigger | What set it off? | body (injury, bad night), social (a comment, a photo), calendar (holiday, new year), money (ran out, payday), life event (new baby, move), content (a post, an ad), letdown (old product failed) |
| Feeling | What did they feel? | worry, embarrassment, frustration, excitement (their word) |
| Proof | What convinced them? | reviews with photos, ingredient list, guarantee, creator they trust |
| Result | What did they expect? | sleep through the night, pain gone by Friday, compliments |
| Blocker | What almost stopped them? | price, shipping time, doubt it works for them, returns |

Count each code. Keep one quote per code that says it best. From interviews, also count where buyers searched, which rivals they compared and what closed the sale; channels named by several buyers are where early-stage content belongs.

### 5. Group into buyer types by trigger and situation

Group by what happened to the buyer and their situation, not by age or income; personas split by the job they hire the product for get used, demographic ones rarely do [AVT-0019]. A buyer type needs at least three independent sources and about 10% of coded answers (practitioner default, test it). Smaller groups are listed as "watch".

### 6. Write a short brief per buyer type

One half-page each: name (their situation, in plain words), share of buyers, the top trigger, feeling, proof and result codes with counts and one quote each, top two blockers with the review or proof that answers them, the words and claims that put this group off (from complaints and interviews), and the products they buy with gross profit per purchase. Date each brief and recheck it after 60 days or a new product.

### 7. Tag the current ads

For every ad with spend in the period, tag which buyer type it speaks to and which of the five slots it covers (names the trigger, shows the feeling, carries the proof, promises the result, answers a blocker). Use the same fields every time so results can be traced to one element [MCR-0051].

### 8. Check the gaps against results

Join the tags to results, and judge at ad set level where ads share a set, because ad-level credit leans to the last click [ADC-0059]. For each buyer type and each slot, compare: share of buyers (step 5), share of ad spend, and store-side cost per purchase against break-even. Read Meta on 7-day click, not the 1-day view default, which can inflate results [MEA-0042]. Where Meta shows an incremental attribution column, sort by it too [ADC-0008].

Flag false winners: an ad with a high CTR (all) but a CTR (link) more than about three points lower, or many clicks and few purchases, is pulling attention, not buyers [MCR-0029].

A gap is real when a buyer type or slot is common among buyers, rare in spend, and the few ads that cover it sell at or under break-even. Rank gaps by buyer share times the gross profit per purchase of what they buy.

### 9. Say where to fill each gap

For blockers, one ad per objection works for the bottom of the funnel [MCR-0043]; for triggers and feelings, problem-led concepts for cold audiences. Hand the top three gaps to `store-meta-concepts` with the quotes and proof attached.

Set a check that can prove the map wrong: one trigger-led ad and one proof-led ad for the top buyer type, each judged on store-side purchases at about three times target cost per purchase. Hook rate alone does not validate a trigger.

### India and similar markets

Blockers often include trust in delivery, returns and whether cash on delivery is available; code them separately. A short survey sent on WhatsApp after delivery can reach COD buyers who never see the thank-you page, with their consent.

## Checks before you hand it over

1. Every code shows a count and a source mix (survey, interview, review).
2. Every buyer type meets the threshold or is marked "watch".
3. Every brief quote is verbatim with source and date.
4. Each gap shows buyer share, spend share and store-side cost per purchase against break-even.
5. Gap results use store orders when gate 3 failed.
6. False-winner ads are named with their CTR gap.
7. No survey, interview invite or call went out without the owner's yes.

## Output

1. **One-screen summary first:** the buyer types with shares, the three biggest gaps ranked by money, and what to make next.
2. **Buyer type briefs** (half a page each).
3. **Codes table:** slot, code, count, share, source mix, best quote.
4. **Ad tag table:** ad, buyer type, slots covered, spend, store-side purchases, cost per purchase, break-even, verdict.
5. **Gap table:** buyer type or slot, buyer share, spend share, cost per purchase on covering ads, money weight, recommended fill.
6. **Survey and interview kit:** the questions, the invite text for the owner to approve.

## Common mistakes

- **Personas from demographics.** Step 5 groups by trigger and situation.
- **Diagnosing ads by opinion.** Step 8 checks every gap against spend and store-side results.
- **Trusting high CTR.** Step 8 flags the click gap and purchase shortfall.
- **One interview as a pattern.** Step 5 needs three sources and a share threshold.
- **Leading interview questions.** Step 2 walks the purchase in order and bans "why did you buy?".
- **Three interviews treated as truth.** Step 2 aims for about 20 and the survey checks the pattern.
- **Gaps ranked by count alone.** Step 8 weights by gross profit per purchase.

## Sources

- [CRO-0018]: two-question post-purchase survey.
- [LPG-0042]: post-purchase surveys get high completion.
- [MEA-0045]: channel shares in surveys should match spend shares.
- [AVT-0017]: about 20 interviews of 30 minutes per group.
- [AVT-0018]: invites with no sales pitch fill fast.
- [AVT-0007]: paste quotes verbatim, by hand.
- [AVT-0016]: self-naming phrases mark buyer types.
- [AVT-0019]: group by job, not demographics.
- [MCR-0051]: tag every ad on the same fields.
- [ADC-0059]: judge creative at ad set level.
- [MEA-0042]: read Meta on 7-day click.
- [ADC-0008]: sort by the incremental attribution column.
- [MCR-0029]: high CTR can be a false winner.
- [MCR-0043]: one bottom-funnel ad per objection.

What makes this skill ours: every buyer type stands on counted survey, interview and review codes; the five slots are tagged on live ads and checked against store-side cost per purchase versus break-even, not opinion; false winners are caught by the click gap; and gaps are ranked by buyer share times gross profit per purchase.
