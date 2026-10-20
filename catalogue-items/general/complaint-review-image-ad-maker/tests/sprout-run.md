# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 2.

The run correctly rejects all seven reviews with sound one-line reasons and makes no card. It uses MISSING lines properly, points to the right alternative pictures and says what kind of review to watch for.

## Judge list

- Met: The review is real and you can point to where it was posted.
  No card made; every review is listed with its source, e.g. "Brand site", "Retailer", "Review site".
- Met: Its grumble would disappear if the product stopped working.
  Correctly fails all seven; e.g. "Taste grumble. Taste always fails." Review 21 is treated as a side effect.
- Met: Every word on the card matches the original. Nothing was reworded or merged.
  No card produced, so nothing was reworded or merged.
- Met: The stars, name and date match the original and what the customer allowed.
  No card. It writes "MISSING: stars for all seven reviews" and shows no name.
- Met: The card looks like no real shop or review site, with no badge the review didn't have.
  No card made, so no shop look or badge.

## Invented

- claim: It's also 6 words, under the 15-word minimum (Review 21 is 6 words, but the skill sets a 15-word minimum for the body, so this is a worked-out use of the rule and not invented.)
- other: Review 17 "also over 35 words" (Review 17 is about 45 words, so the count is worked out, not invented.)

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
I can't draw pictures in this chat unless an image tool is connected, so this would have been a brief, not a finished image.

## Review check

| # | Source | Result | Reason |
|---|---|---|---|
| 2 | Brand site | **Fail** | No grumble. It's straight praise ("I WANT to take [Sprout]"). |
| 16 | Brand site, Kids page | **Fail** | No grumble. It's straight praise ("the only one they love eating"). |
| 17 | Brand site | **Fail** | The grumble is about subscriptions (service). It would still exist if the product stopped working. It's also over 35 words. |
| 18 | Retailer | **Fail** | Taste grumble. Taste always fails. |
| 19 | Brand site widget | **Fail** | Taste grumble. Taste always fails. |
| 20 | Review site | **Fail** | Cancel/service grumble. It isn't caused by the product working. |
| 21 | Review site | **Fail** | On a sugar-free gummy, "worked too well" most likely means a digestive side effect, and side effects always fail even when they read as jokes. It's also 6 words, under the 15-word minimum, and can't be padded with other words. |

**No review passes, so no card is made.**

## MISSING
- MISSING: stars for all seven reviews
- MISSING: review dates
- MISSING: reviewer names and ad-use permission for everyone. Any future card shows no name, flagged "real review: check permission before it runs."
- MISSING: known side effects of Sprout, needed to rule review 21 in or out for certain
- MISSING: original wording behind "[Sprout]". The brackets suggest the text was edited, so the word-for-word match can't be confirmed.

## Use this picture instead
- **First choice: `tried-before-products-image-ad-maker`.** Your story opens on "$94 a month for a greens powder," so a picture of the products they used before fits that first line directly.
- **Second choice: `problem-moment-image-ad-maker`.** Use it if you'd rather show the moment of the problem than the old products.

## What kind of review to watch for
Look for grumbles that only happen because Sprout works:
- **It made something pointless:** e.g. a tub of greens powder now sitting unused, or money wasted on the old powder. This matches your story best.
- **Others take it:** e.g. a partner or kids eating the gummies before the buyer gets any.
- **It runs out because it's used:** e.g. the pack going faster than planned because they actually remember to take it.

Check return-reason notes, post-purchase emails and marketplace questions as well as star reviews. Record the stars, date, source, name and ad-use permission for each one.

Want to switch to the [Tried-before products image ad maker](https://useaiblocks.com/skills/tried-before-products-image-ad-maker) for this story, or something else of your own?
```
