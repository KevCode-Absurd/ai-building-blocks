---
name: social-listening-for-ideas
description: "A monthly social listening sweep for a store, run by hand in about three hours: the store's own comments and DMs, Reddit and forum threads, category creators' comment sections and marketplace reviews, searched by buyer pain topics rather than brand mentions. Every quote is logged with its link and date, coded by buyer, trigger, pain, failed fix and wish, and only themes seen in two or more sources become ideas. Output is a monthly memo with five product ideas and five ad or content ideas, each with the buyer quotes behind it and a rough gross profit case. Use monthly, before a product or creative planning meeting, or when ads and posts feel out of touch with what buyers say."
---

# Social listening for product and ad ideas

**You get:** a monthly memo with five product ideas and five ad or content ideas, each backed by quotes from at least two sources, plus the idea log sheet with every quote's link, date and code, ready for the product and creative teams.

## When to use

- Once a month, before product, creative or content planning.
- New ad angles are running dry and the team keeps rewriting the same hooks.
- The store wants to know what buyers in the category complain about, wish for or misunderstand.
- Before deciding on a new variant, size, bundle or accessory.

## Not for

- Turning the store's own reviews into ranked ad angles: use `mine-ad-angles-from-reviews`.
- Monthly themes from support tickets: use `turn-support-tickets-into-insights`.
- A full teardown of one rival product: use `competitor-product-teardown`.
- Finding new products to sell from search and marketplace trends: use `find-trending-products`.

## What you need

Required (read access, level 1):

1. **3 to 5 pain topics** for the category, agreed with the client (for example "dry skin in winter", "back pain at desk", "toddler won't eat vegetables").
2. **The store's own comments and DMs, last 30 days**: read in Meta Business Suite inbox or the TikTok and YouTube comment views. Export where the tool allows; otherwise copy by hand.
3. **Product list** with gross profit per order, from `build-sku-profit-sheet`, to size ideas.
4. **Last month's memo**, if any, to track themes over time.

Optional: competitor product links, 5 to 10 category creators, marketplace listings (Amazon, Flipkart, Nykaa, Etsy) for the top rival products.

This skill reads public pages and the store's own inbox only. It never posts, replies or messages anyone. If inbox access is missing, run the sweep on public sources and note the gap.

## Before you start: the gates

1. **Gross profit per order** is known for the current range, so ideas can be compared with what already sells. Fail: rank ideas by evidence only and say so.
2. **Platform rules.** Read by hand or with each platform's own tools and exports; do not scrape against a site's terms. Fail: skip that source.
3. **Privacy.** Log quotes without usernames, real names, phone numbers or photos. Keep only the link, date and words. Fail: delete the personal data before saving.
4. **Time box.** About three hours a month; listening that never ends produces nothing (practitioner default, test it).

## Steps

### 1. Set the search terms

Point listening at pain topics, not brand mentions; brand mentions tell you about the brand, pain topics tell you about the buyer [AVT-0019]. For each topic write 5 to 8 search phrases in the buyer's words: the problem, the fear ("is it safe", "waste of money"), the failed fix ("tried X", "nothing works") and the wish ("I wish there was"). In India, add Hinglish and the top regional language phrasing.

### 2. Sweep the sources (time-boxed)

| Source | Time | What to look for |
|---|---|---|
| Own comments and DMs | 30 min | Questions asked twice, objections, words buyers use for the product |
| Reddit and forums | 45 min | Emotional barriers and real vocabulary; search "<problem> reddit" [AVT-0006] |
| Creators' comment sections | 30 min | What viewers ask creators in the niche; drop high-view posts with very low engagement as likely boosted [ORG-0010] |
| Marketplace reviews of rival products | 45 min | 1-star and 5-star reviews mentioning money spent on things that failed [AVT-0009] |

A timed session (half forums in the buyer's own problem phrasing, half reviews, pasting verbatim text) keeps it focused [AVT-0011]. Skip Quora for this job; answers skew to long tutorials [AVT-0006].

In India, also read YouTube comments on Hindi and regional review videos and reviews on Indian marketplaces. In the US, Reddit, TikTok comments and Amazon reviews usually carry the most.

### 3. Log every quote

One row per quote: date found, source type, link, product or topic, exact words, and the codes from step 4. Copy words exactly; never rewrite a quote to make it sharper. Quotes stay internal; any public use of a person's words needs permission (see `repost-customer-content-with-rights`).

### 4. Code each quote

Tag each row with:

- **Buyer**: who is speaking. Self-identifying phrases ("as a nurse", "as a new mum") that repeat mark a segment worth its own message [AVT-0016].
- **Trigger**: what made them look for a fix now.
- **Pain**: the problem in their words.
- **Failed fix**: what they tried that did not work. People who already spent on failed solutions are the highest-intent buyers [AVT-0009].
- **Wish**: what they want that nobody offers.
- **Objection**: why they would not buy.

### 5. Group into themes and apply the two-source rule

Group rows by theme and count them by source. A theme becomes an idea only when it appears in at least two different sources; no idea gets in without two pieces of evidence [CRO-0013]. A theme that shows up in many separate Reddit threads is a real segment, not one loud poster [AVT-0013]. When 3-star reviews contradict each other (too simple vs too complex), do not chase either side; note it and keep the core simple [AVT-0008].

### 6. Turn themes into ideas

For each strong theme write one of:

- **Product idea**: a variant, size, bundle, accessory, refill, guide or packaging change. Note what it would cost to test (sample run, pre-order page) and the rough gross profit per order if priced like the closest current product.
- **Ad or content idea**: the angle, a hook in the buyer's own words, the proof the store already has, and the format (demo, myth, objection answer).

### 7. Rank and pick ten

Rank product ideas by expected gross profit: chance it works x lift x gross profit per order x buyers reached, minus the cost to test [CRO-0013]. Use rough, stated guesses and label them as guesses. Rank ad and content ideas by how many sources back them and whether the store can prove the claim. Keep the top five of each.

### 8. Write the memo and hand off

Write the monthly memo. Send product ideas to the client or product owner, ad ideas to `write-one-page-creative-brief` or the ad team, and content ideas to `reels-ideas-from-products`. Mark last month's themes as rising, steady or fading.

## Checks before you hand it over

- Every idea is backed by quotes from at least two different source types.
- Every quote has a link and date and no personal data.
- Quotes are exact, not rewritten.
- Five product ideas and five ad or content ideas, each ranked with the reason.
- Each product idea has a test cost and a rough gross profit, labelled as estimates.
- Each ad idea uses the buyer's own words and names the proof the store holds.
- Nothing was posted or sent to anyone during the sweep.

## Output

1. **One-screen memo:** the month's top three themes with one quote each, the five product ideas, the five ad or content ideas, themes rising or fading, and who receives each idea.
2. **Idea log sheet** (`listening-<month>.csv`):

| Date found | Source type | Link | Topic | Exact quote | Buyer | Trigger | Pain | Failed fix | Wish | Objection | Theme |
|---|---|---|---|---|---|---|---|---|---|---|---|

3. **Theme table**: Theme, Rows, Sources (count of types), Example quote 1, Example quote 2, Status vs last month.
4. **Product ideas table**: Rank, Idea, Theme, Evidence (rows and sources), Test method, Test cost, Rough gross profit per order, Owner.
5. **Ad and content ideas table**: Rank, Angle, Hook in buyer's words, Proof the store holds, Format, Sources, Hand-off.

## Common mistakes

- **Listening for the brand name.** Step 1 searches pain topics.
- **One viral thread becomes a product.** Step 5 needs two sources.
- **Polished paraphrases instead of real words.** Step 3 keeps quotes exact.
- **Endless reading.** The time box keeps it to about three hours.
- **Usernames and photos in the log.** The privacy gate strips them.
- **Ideas with no money case.** Step 7 ranks product ideas by rough gross profit.

## Sources

- AVT-0006: Reddit for emotional barriers and vocabulary; skip Quora.
- AVT-0008: contradictory 3-star reviews: keep the core simple.
- AVT-0009: buyers who spent on failed fixes have the highest intent.
- AVT-0011: a timed search session of forums and reviews.
- AVT-0013: confirm a segment across many separate threads.
- AVT-0016: repeated self-identifying phrases mark a segment.
- AVT-0019: point listening at pain topics, not brand mentions.
- CRO-0013: rank ideas by expected gross profit; two pieces of evidence.
- ORG-0010: drop low-engagement high-view posts as likely boosted.

What makes this skill ours: listening is aimed at buyer pain, not brand mentions; no idea passes without two independent sources; every quote is kept exact, linked and stripped of personal data; and product ideas carry a rough gross profit case instead of a vibe.
