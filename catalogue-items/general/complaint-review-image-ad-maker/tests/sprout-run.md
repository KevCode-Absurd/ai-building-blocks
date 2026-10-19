# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The run correctly rejected all seven reviews with sound reasons and stopped instead of forcing a card. It listed the MISSING items, pointed to a fallback picture and gave labelled examples of what to watch for.

## Judge list

- Met: The review is real and you can point to where it was posted.
  No card made; every review is listed with its source, e.g. "Retailer", "Review site". Nothing fabricated as a review.
- Met: Its grumble would disappear if the product stopped working.
  Correctly failed all seven; 17 and 20 are service, 18 and 19 taste, 21 a side effect.
- Met: Every word on the card matches the original. Nothing was reworded or merged.
  No card produced; the examples are labelled "Example:" and not presented as real reviews.
- Met: The stars, name and date match the original and what the customer allowed.
  No card; stars, dates and permission flagged as MISSING and never guessed.
- Met: The card looks like no real shop or review site, with no badge the review didn't have.
  No card built, so no look or badge to copy.

## What went in

```text
Story ad (approved): opens "I was paying $94 a month for a greens
powder." and tells the switch to Sprout.

Reviews, as posted (stars not captured, no titles):
2  brand site: "It's wild I WANT to take [Sprout] and don't
   forget."
16 brand site, Kids page: "I have tried all of the 'green'
   options for the kids and this is the only one they love
   eating. They think it's a treat."
17 brand site: "I hate subscriptions because I feel like they
   are a trap so I canceled it before the gummies even arrived.
   We quickly decided to resubscribe because we love [Sprout] so
   much! A bonus is my kids love them too!"
18 retailer: "I thought the first pack I tried tasted terrible,
   but after the third day they started tasting better"
19 brand site widget: "the taste is off."
20 review site: "I have tried multiple times to cancel my
   subscription."
21 review site: "The sugar free [Sprout] worked too well."

Ad-use permission: not recorded for anyone.
```

## What came out

```text
**Review check**

| # | Source | Result | Reason |
|---|---|---|---|
| 2 | Brand site | Fail | No grumble. It is plain praise, so there is nothing for the test to turn. |
| 16 | Brand site, Kids page | Fail | No grumble. It is plain praise. |
| 17 | Brand site | Fail | The grumble is about the subscription, which is service. It would stay even if the gummies stopped working. |
| 18 | Retailer | Fail | Taste always fails. |
| 19 | Brand site widget | Fail | Taste always fails. |
| 20 | Review site | Fail | Trouble cancelling is service. It also accuses the brand and should never sit on an ad. |
| 21 | Review site | Fail | With a sugar-free gummy, "worked too well" most likely means a digestive side effect. A side effect fails even when it reads as a joke. No known side effects were supplied to rule this out. |

**MISSING**
- `MISSING: a review that passes the test`. No card can be made.
- `MISSING: stars` for all reviews. They were not captured, so never guess them.
- `MISSING: ad-use permission` for all reviewers. If any review is used later, show no name and flag "real review: check permission before it runs."
- `MISSING: review dates` for all reviews.
- `MISSING: known side effects`. These are needed to judge #21 and any future "worked too well" review.

**Picture to use instead**

Use `tried-before-products-image-ad-maker`. The story opens with "I was paying $94 a month for a greens powder," so a picture of the abandoned greens powder tub picks up that first line directly.

The fallback is `problem-moment-image-ad-maker`.

**What kind of review to watch for**

Check star reviews, post-purchase emails, return-reason notes and marketplace questions. Record the stars, date, source and permission with each one.

- **It made something pointless.** Example: "now I've got half a tub of greens powder I'll never finish." This is the best fit, because it echoes the story's first line.
- **Others take it.** Example: "the kids keep eating my pack, had to order my own." Reviews #16 and #17 suggest this is likely to show up.
- **It runs out because people use it.** Example: "the bag empties faster than I planned, because I actually take them now." Review #2's "I WANT to take them" points this way.
```
