# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, honest map: every quote is exact, counts and channel tallies check out against the 22 sources, and every health, GLP-1, competitor and kids-as-treat line is flagged with a reason. The owner gets a usable FAQ seed and a clear warning that the data is thin, hand-picked and unverified, so nothing here should go straight into paid ads.

## Judge list

- Met: Every quote appears word for word in its source, with spelling mistakes kept.
  All quotes checked against reviews.md; e.g. "glp1 for about a year now and was always constipated not anymore" [R11] kept as written, cuts at word boundaries only.
- Met: Counts are separate people, not mentions.
  Reason 1 lists R7, R8, R9, R10, R11, R14 = 6; R14 and R6 appear in several reasons but counted once each per reason.
- Met: Nothing is called a pattern with fewer than five people, and one-channel patterns say so.
  "Pattern by count, but one channel (reviews only)" for #1; all others marked "Thin".
- Met: The check-before-use list exists, even if empty.
  CHECK BEFORE USE lists 13 flagged quotes with source IDs and reasons.
- Met: No quote has a name, initial or city that wasn't in the source.
  Quotes carry only [R#]/[F#] IDs and bracketed swaps as in the file; no names or places added.

## What went in

```text
Customer sources: 20 public reviews, numbered R1 to R20, with where
each came from (brand site, brand site widget, retailer, review site),
plus two short fragments, F1 and F2 (sprout/reviews.md). Captured
over two months. No dates per review, no verified-buyer flags, no
star ratings.

Our product page text is below, so you can see what we already say.
[sprout/product-page.md]

[attached: sprout/reviews.md, sprout/product-page.md]
```

## What came out

```text
```
FORCES MAP (ranked by separate people)
Every best quote is unverified (no verified-purchase flags). Keep all of them out of paid ads.
All 22 sources are reviews. "Channels" below are the places a review appeared, not different kinds of source.

# | Reason | Force | People (n, share, channels) | Pattern or thin
  | Best quote [ID] | Backups [IDs] | Brand says it?

1 | Digestion got regular and less bloated | Result | 6, 27%, brand site + retailer + widget | Pattern by count, but one channel (reviews only)
  | "My bowel movements are normal for the 1st time in 15 years!" [R7] (unverified, flagged)
  | "The prebiotics do their job, but not aggressively, and I feel like my overall digestion has improved." [R8]; "[Sprout] have been the solution to my problems with regularity." [R9]; "Feel lighter, less bloated and overall good." [R10]. Also says it: R11, R14
  | Yes ("Supports digestion and gut health", "67% better, more regular digestion")

2 | Had tried other greens for years before this | Habit | 4, 18%, brand site only | Thin, one channel
  | "I've been choking on [a big-name greens powder] for the last few years" [R4] (unverified, flagged)
  | "I've tried a few green powders over the years." [R1]; "I was taking [a big-name greens powder]" [R3]; "I have tried all of the 'green' options for the kids" [R16]
  | Yes ("Vs Powders" review cards, "Us vs. Them")

3 | Powders were gritty, hard to get down and messy to clean up | Push | 3, 14%, brand site only | Thin, one channel
  | "the drink was definitely gritty/chalky." [R3] (unverified, flagged)
  | "I've been choking on [a big-name greens powder] for the last few years" [R4]; "not having to clean a shaker bottle or extra dishes for greens stuff in powder form, is absolutely excellent!" [R6]
  | Yes ("No more gagging on pills, sloshing chalky powders, or cleaning messy counters")

4 | Tastes like a sweet treat | Pull | 3, 14%, brand site + widget | Thin
  | "[Sprout] literally tastes like fruit snacks I ate as a kid." [R12] (unverified)
  | "The convenience and taste are huge! Like mixed berries!" [R6]; "They taste good!" [R14]
  | Yes ("great tasting gummies", "Delicious")

5 | Stayed on it, came back to it or recommended it | Result | 3, 14%, brand site + widget | Thin
  | "We quickly decided to resubscribe because we love [Sprout] so much!" [R17] (unverified)
  | "Glad I have a subscription!" [R14]; "10/10 would recommend." [R6]
  | Unsure (the page cites 1M+ customers and "Less than 1%" guarantee use, but has no came-back or recommend line)

6 | Finally a greens habit they keep | Result | 2, 9%, brand site only | Thin, one channel
  | "[Sprout] has been the one thing I've been able to stick to." [R1] (unverified)
  | "It's wild I WANT to take [Sprout] and don't forget." [R2]
  | Yes ("A habit that tastes so good, you'll actually want to keep it", "80% daily")

7 | Grab and go on a busy day | Pull | 2, 9%, brand site only | Thin, one channel
  | "So easy to grab and eat on my way to the billion things I have to do as a mom." [R15] (unverified)
  | "The convenience and taste are huge!" [R6]
  | Yes ("Portable: Just grab and go.")

8 | More energy and focus (one person adds sleep) | Result | 2, 9%, brand site + widget | Thin
  | "clean feeling energy and mental focus ... without the sugar crash" [R13] (unverified, flagged)
  | "noticed a difference in my energy, gut health, and even my sleep!!!" [R14]
  | Yes for energy and focus. No for sleep

9 | Kids love them | Result | 2, 9%, brand site only | Thin, one channel
  | "this is the only one they love eating. They think it's a treat." [R16] (unverified, flagged)
  | "A bonus is my kids love them too!" [R17]
  | Unsure (Kids tiles are on this page; Kids page text not supplied)

10 | Helps while on a GLP-1 medication (an unexpected use) | Result | 2, 9%, widget only | Thin, one channel
  | "These gummies have helped me to get back to normal as I've been on a glp1 for about a year now and was always constipated not anymore" [R11] (unverified, flagged)
  | "I'm on Glp-1 and they definitely help with the vitamin loss you get!" [R14]
  | No (only in the auto-generated review summary; the brand should not adopt it as a claim)

11 | Subscription feels like a trap and is hard to cancel | Anxiety | 2, 9%, brand site + review site | Thin
  | "I have tried multiple times to cancel my subscription." [R20] (unverified)
  | "I hate subscriptions because I feel like they are a trap so I canceled it before the gummies even arrived." [R17]
  | Yes ("Pause Or Cancel Any Time"), but R20 contradicts it

12 | Taste is off, or bad at first | Anxiety | 2, 9%, retailer + widget | Thin
  | "I thought the first pack I tried tasted terrible, but after the third day they started tasting better" [R18] (unverified)
  | "the taste is off." [R19] (tie-in flavour, Sugar-Free)
  | No

13 | Replaces several separate supplements | Result | 1, 5%, brand site | Thin, one person
  | "I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies. I just take these now and it's easier for me to manage." [R5] (unverified, flagged)
  | none
  | Yes ("replaces handfuls of health products")

14 | The old powder cost too much, even on subscription | Push | 1, 5%, brand site | Thin, one person
  | "even with their monthly subscription discount it was still $94 a month" [R3] (unverified, flagged)
  | none
  | Yes ("Us vs. Them" cost per serving)

15 | Expensive | Anxiety | 1, 5%, retailer | Thin, one person
  | "They are expensive" [F1] (unverified)
  | none
  | Yes ("$1.07/day", "Not overhyped or overpriced")

16 | Sugar-Free upset the stomach | Anxiety | 1, 5%, review site | Thin, one person
  | "The sugar free [Sprout] worked too well." [F2] (unverified, flagged)
  | none
  | No. MISSING: text of the Low Sugar vs. Sugar-Free panel

NEVER SAID BY THE BRAND
Top five: none is clearly missing. The one open question is #5.
Came back after cancelling, glad of the subscription, would recommend (#5, unsure): 3 people
Outside the top five:
Taste gets better after the first days, or "the taste is off" (#12): 2 people
Sugar-Free upsets the stomach (#16, panel not captured): 1 person
Sleep (part of #8): 1 person
Kids love them (#9, unsure until the Kids page is read): 2 people
A person must confirm each of these before it is called a gap in public.

WHAT NEARLY STOPPED THEM
1 "I have tried multiple times to cancel my subscription." [R20]; "I hate subscriptions because I feel like they are a trap so I canceled it before the gummies even arrived." [R17]  2 people
  Moment: R17 cancelled after buying, before delivery, then came back.
  Page answer: "Pause Or Cancel Any Time" and "Cancel anytime". There is no how-to-cancel step on the page, and the renewal at $49.99 sits in small print.
2 "I thought the first pack I tried tasted terrible, but after the third day they started tasting better" [R18]; "the taste is off." [R19]  2 people
  Moment: first pack, then the third day.
  Page answer: none found.
3 "They are expensive" [F1]  1 person
  Page answer: cost per day and Us vs. Them. The $1.07/day figure is first box only; renewal is $1.78/day.
4 "The sugar free [Sprout] worked too well." [F2]  1 person
  Page answer: not seen. MISSING: Low Sugar vs. Sugar-Free panel text.

CHECK BEFORE USE
"My bowel movements are normal for the 1st time in 15 years!" [R7]: health result. One unusual result that could read as typical. Use only as one buyer's story, and send it to whoever approves claims.
"I feel like my overall digestion has improved. This is huge for someone who suffers from chronic IBS!" [R8]: names a medical condition and implies a treatment result.
"[Sprout] have been the solution to my problems with regularity." [R9]: health result, framed as a "solution".
"Feel lighter, less bloated and overall good." [R10]: claim about the body. Ad platforms restrict these.
"These gummies have helped me to get back to normal as I've been on a glp1 for about a year now and was always constipated not anymore" [R11]: GLP-1 medication plus constipation. A customer may say it; the brand must not repeat it as its own claim.
"I'm on Glp-1 and they definitely help with the vitamin loss you get!" [R14]: GLP-1 medication and a deficiency claim the brand can't support.
"noticed a difference in my energy, gut health, and even my sleep!!!" [R14]: sleep is not a claim the brand makes or can support.
"clean feeling energy and mental focus ... without the sugar crash" [R13]: cognitive claim. The study measured only 2 vitamins in the blood. The "..." is in the source.
"I was taking [a big-name greens powder] but even with their monthly subscription discount it was still $94 a month and the drink was definitely gritty/chalky." [R3]: names a competitor (bracketed in this file, real name in the original) and gives an unverified competitor price.
"I've been choking on [a big-name greens powder] for the last few years" [R4]: names and disparages a competitor.
"I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies." [R5]: implies Sprout replaces those products, an equivalence the brand would need to support.
"this is the only one they love eating. They think it's a treat." [R16]: a children's supplement framed as a treat or candy. This is a child-safety risk; check before any kids ad.
"The sugar free [Sprout] worked too well." [F2]: hints at a laxative effect from sugar alcohols. This is a health side effect, not a selling line.

NOTES
Sources: 22. That is 20 reviews (R1 to R20) plus 2 short fragments (F1, F2), all reviews.
  By place: brand site, hand-picked: 13. Brand site widget: 3. Retailer: 4. Review site: 2.
  Captured Sept to Oct 2026. MISSING: a date for each review.
Dropped: nothing. Every entry gave a reason, and every quote was checked word for word against reviews.md.
  Bracketed swaps such as [Sprout] are kept as they appear in the file.
Not scoped:
  The product and price changes (the birthday price cut to $29.99, the new tie-in flavour) have no dates, so no review could be checked against them. Older material may be mixed in.
  Products were not split. Only R11, R14, R16 and R19 name a product: tie-in, Original Low Sugar, Kids page, tie-in Sugar-Free. That is too few to map separately.
Counts:
  Counts treat each source as a separate person. The names were removed, so repeat reviewers can't be ruled out.
  15 of 16 reasons are thin. 4 rest on one person (#13 to #16).
  The only reason that reaches 5 people (#1) is one channel: reviews only.
Saturation: the newest-20 test can't be run without dates.
  Four reasons rest on a single person, and the last two sources read (F1, F2) each added a new one.
  Not saturated: more sources will change this map.
What this can't tell you:
  Why people didn't buy, or why they left. There are no tickets, surveys or calls.
  13 of 22 sources were hand-picked by the brand. The complaints sit mostly on retailer and review sites (4.0 from 2,411 there, against the 4.8 the brand claims).
  How common any reason is beyond these 22 sources. Shares describe these sources only, not a typical result.
  Which reviewers got the product free or were paid.
MISSING:
  Dates for each review.
  Verified-purchase flags (so every quote is unverified, and none can go in paid ads).
  Star ratings.
  Free or paid flags.
  Product for most reviews.
  Low Sugar vs. Sugar-Free panel text.
  Kids page text.
  Support tickets about refunds and cancellations.

SCORE
4 of 4 checks = 100 out of 100
Missed: none
```
```
