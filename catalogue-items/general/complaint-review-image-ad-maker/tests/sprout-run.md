# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The run correctly sorted all seven reviews, failed each with a sound reason, and stopped instead of forcing a card. It listed MISSING items, pointed to better image skills, and scored 0/100, which is useful and safe for the owner.

## Judge list

- Met: The review is real and you can point to where it was posted.
  No card made; all seven reviews listed with their sources (brand site, retailer, review site). Nothing fabricated.
- Met: Its grumble would disappear if the product stopped working.
  Correctly sorted all seven as fail; "No review passes, so don't use this picture."
- Met: Every word on the card matches the original. Nothing was reworded or merged.
  No card produced. The example grumbles are labelled as shapes to watch for, not card text.
- Met: The stars, name and date match the original and what the customer allowed.
  No card; stars, name and date marked MISSING, none guessed.
- Met: The card looks like no real shop or review site, with no badge the review didn't have.
  No card made, so no look or badge to copy. Nothing breaks this check.

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
I can't draw the picture here because no image tool is connected to this chat. This is the brief only.

**Review check**

| # | Source | Result | Reason |
|---|---|---|---|
| 2 | brand site | Fail | No grumble. It's pure praise ("I WANT to take it"). |
| 16 | brand site, Kids page | Fail | No grumble. It's pure praise about the kids. |
| 17 | brand site | Fail | The grumble is about subscriptions being "a trap." That's service, and it stays even if the product stopped working. |
| 18 | retailer | Fail | Taste complaint. Taste always fails. |
| 19 | brand site widget | Fail | Taste complaint. Taste always fails. |
| 20 | review site | Fail | Cancellation trouble. That's service, a real fault, and not a joke. |
| 21 | review site | Fail | "Worked too well" on a sugar-free gummy most likely means a digestive side effect read as a joke. Side effects always fail. |

No review passes, so don't use this picture.

**MISSING**
- `MISSING: a real review whose grumble only exists because the product works`
- `MISSING: stars` for all seven reviews
- `MISSING: ad-use permission` for all seven reviewers. Each one is a real review, so check permission before it runs.
- `MISSING: dates` for all seven reviews
- `MISSING: original wording` behind each "[Sprout]". The brackets are an edit, so the posted text is needed to quote it word for word.
- `MISSING: known side effects` list. Use it to confirm what #21 refers to before anyone reads it as praise.

**Use this picture instead**
- `tried-before-products-image-ad-maker` fits best. The story opens on the $94-a-month greens powder, so a picture of the abandoned old option leads straight into the first line.
- `problem-moment-image-ad-maker` is the backup.

**What kind of review to watch for**

These are grumbles that vanish if Sprout stopped working, and they should pick up the greens-powder story:
- **It made something pointless:** "now I've got a tub of greens powder I'll never finish." This is the strongest fit with the opening line.
- **Others take it:** "my partner keeps eating my gummies," or "the kids finished my pack."
- **It runs out because it's used:** "the box went faster than planned, because I actually take them now."

Look in return-reason notes, post-purchase emails, marketplace questions and star reviews. For each one, record the exact posted wording, the stars, the date, the source, the name the customer allows, and whether they agreed to ad use.

**Score: 0 / 100**

0 of 7 reviews passed the test. None can be used.
```
