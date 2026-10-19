# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 0.

The ranking and style analysis are accurate, honest about missing images, and every number checks out against the CSV. But the owner asked for 3 new ads and got none, because the run treated Stop 1 and the missing photos as a reason to plan nothing rather than plan words only.

## Fix

In step 8 and the output shape, state that Stop 1 does not block drafting: always hand back the requested number of new ads (words only when images or photos are MISSING) together with the Stop 1 corrections list.


## Judge list

- Met: The ranking matches your file, and ads under about 20 sales are left out.
  "T1 ... $21.21 Top" through "P2 ... $50.00 Bottom"; "R1 Runner ... Not measured (10 purchases, under 20)". All costs per purchase check out.
- Met: Every kept trait shows its count among winners and losers.
  "headline of 5 words or fewer ... 3/3 | 0/3 | Kept"; "no price or discount in headline | 3/3 | 0/3 | Kept".
- Met: Any reason for a win comes from your records, or is written "not recorded".
  Every row in the why-it-won table reads "Not recorded"; the P1 window change is reported as observed, cause "not recorded".
- Met: The do-not-carry list includes the winners' words, offers and people.
  "Fix the Hot Girl Tummy" ... "One Step I Never Skip" and "Fiber Kids Won't Fight" ... "61% off, 4 free gifts" ... "The creator in T1's UGC video".
- Not met: Each new ad changes exactly one thing, and you can say what it is in a few words.
  "Held at Stop 1 until the style is confirmed." No new ads were planned, though the owner asked for 3 and the skill says plan words only.

## What went in

```text
Ads: ad-results.csv, one row per ad, 14 to 42 days (all 10 rows
pasted; practice numbers). P1 is one ad split into two 21-day
windows. Columns: ad_name, format, opening_line, days_live,
spend_usd, impressions, link_clicks, purchases, revenue_usd
Ad images: not attached
Judge on: cost per purchase
Product: Sprout Original (Adults)
Facts: Sprout brand file (pasted)
Reviews: all 20 (pasted)
How many new ads: 3

[attached: sprout/brand.md, sprout/ad-results.csv]
```

## What came out

```text
**Working from**
- **Product:** Sprout Original (Adults), from the Sprout brand file (captured Sept–Oct 2026, updated 2026-10-18). It is not marked sold out. The stock level is not given.
- **Ads:** ad-results.csv has 10 rows covering 9 ads, live 14 to 42 days, with practice numbers. P1 appears as two 21-day windows. No start or end dates are given and no images are attached.
- **Judged on:** cost per purchase (spend ÷ purchases). An ad counts as measured at about 20 purchases.
- **Reviews:** "all 20 (pasted)" did not arrive. Only the brand file and the CSV are here.
- **Small print:** none is required on every ad. The $29.99 first-order price carries the SMS footnote, but only where that price is used.

## 1. Ranking

| # | Ad | Spend | Purchases | Cost per purchase | Group |
|---|---|---|---|---|---|
| 1 | T1 Hot girl tummy (video 28s UGC) | $4,200 | 198 | $21.21 | **Top** |
| 2 | H1 One step never skip (video 20s) | $1,300 | 44 | $29.55 | **Top** |
| 3 | K1 Fiber kids (video 15s) | $2,200 | 63 | $34.92 | **Top** |
| 4= | F1 Fiber question (carousel) | $1,800 | 46 | $39.13 | Middle |
| 4= | W1 Muscle weight loss (image) | $900 | 23 | $39.13 | Middle |
| 6 | P1 Too expensive, both windows (image) | $6,000 | 151 | $39.74 | **Bottom** |
| 7 | S1 Trusted by 1M (image) | $1,600 | 38 | $42.11 | **Bottom** |
| 8 | P2 Dont pay full price (image) | $2,500 | 50 | $50.00 | **Bottom** |
| – | R1 Runner (image) | $1,000 | 10 | $100.00 | Not measured (10 purchases, under 20) |

Notes on the ranking:
- **Measured ads:** 8, which is enough for a contrast.
- **Group size:** the top and bottom groups are a third of 8, so 3 each.
- **P1 is counted once** because it is one ad. Its windows were:
  - Days 1–21: $26.79 per purchase (112 purchases). On its own this window would rank 2nd.
  - Days 22–42: $76.92 per purchase (39 purchases).
- **The middle/bottom line is thin.** F1, W1 and P1 sit within $0.61 of each other, which is within chance.
- **W1 is barely measured** at 23 purchases.

## 2. Style

**Traits** (top group = T1, H1, K1; bottom group = P1, S1, P2)

| Trait | Top | Bottom | Verdict |
|---|---|---|---|
| Code, type question: "Is it for me?" (T1 the moment, H1 in use, K1 the moment) | 3/3 | 0/3 | **Kept.** Read from the opening line only. |
| Code, type: "The moment" | 2/3 | 0/3 | Passes. This is the type position, so a new ad may move it within "Is it for me?". |
| Code, type: "The offer" | 0/3 | 3/3 | Dropped. This is a bottom-group trait. |
| Code, dress | T1 Lo-fi (UGC per format); H1 and K1 unknown | unknown | MISSING, no images |
| Code, audience | unknown | unknown | MISSING, not recorded |
| Format: video | 3/3 | 0/3 | Passes the rule but **cannot carry into image ads**. It may be the real reason for the win. Treat it as a confound. |
| Skeleton | – | – | MISSING, no images (and the top ads are videos) |
| Brand cues | – | – | MISSING, no images |
| Word shape: headline of 5 words or fewer (top 4–5 words, bottom 6–12) | 3/3 | 0/3 | **Kept** |
| Word shape: no price or discount in headline | 3/3 | 0/3 | **Kept** |
| Word shape: no figure in headline (bottom has 61%, 1M+) | 3/3 | 0/3 | **Kept.** It mostly overlaps the price trait; S1's "1M+" is the only figure that is not a price. |
| Word shape: speaker (top: you-imperative, I, none; bottom: quote + you, you, you) | no pattern | – | Dropped |
| Word shape: opens with a statement | 3/3 | 2/3 | Dropped. This is a brand habit. |
| Word shape: no brand name in headline | 3/3 | 2/3 | Dropped. This is a brand habit. |
| Product shown | – | – | MISSING, no images. Which product each ad showed is not recorded (K1 is likely Kids). |

**Style in one line:** a short headline of 5 words or fewer, no price or figures, that answers "Is it for me?" with a body or routine benefit rather than a deal. This is words only, because every visual trait is missing.

**What each ad argued, to whom, and why it won**

| Ad | Argument | To whom (inferred from words) | Why it won or lost |
|---|---|---|---|
| T1 | Bloating relief, in slang | Gut-fix seeker | Not recorded |
| H1 | A daily habit that sticks | Quitter who wants to stick | Not recorded |
| K1 | Fiber that kids eat without a fight | Busy parent (Kids product) | Not recorded |
| P1 | "Too expensive" answered with 61% off | Price doubter | Not recorded. The record shows cost per purchase rose from $26.79 to $76.92 between windows; the cause is not recorded. |
| S1 | 1M+ customers plus 61% off | Price doubter | Not recorded |
| P2 | Don't pay full price, 61% off | Price doubter | Not recorded. Observed: highest click rate of all (2.45%) and lowest purchases per click (0.90%). |

This data does not support the brand file's leading hypothesis ("price objection, then a discount"). All three offer-led ads land in the bottom group.

**Do not carry:**
- "Fix the Hot Girl Tummy". "Fix" is also flagged as a risky claim in the brand file.
- "One Step I Never Skip" and "Fiber Kids Won't Fight".
- 61% off, 4 free gifts and "Trusted by 1M+".
- The creator in T1's UGC video, and any lookalike of them.
- The Kids product from K1.
- Video as a format, since the new ads are images.

**Cells the top group never used:**
- **Types outside the kept group:** Product alone, Look inside, Their words, Checked fact, The offer, The occasion.
- **Type inside the kept group, unused:** Old way new way. This is the best candidate.
- **Arguments:**
  - Powder or pill quitter (the brand file's "open lane")
  - Taste ("tastes like a treat")
  - No water, no mixing
  - The absorption study (vitamin C +40.1%, folate +20.5%)
  - Third-party testing
  - Methylfolate for adults
- **Audience and dress cells:** cannot be judged because they are not recorded.

## 3. New ads

Held at Stop 1 until the style is confirmed. Because no images or product photos were given, these will be planned as words only, and nothing will be made.

## 4. MISSING
- MISSING: ad images or video frames for all 10 rows (needed for skeleton, brand cues, product shown and dress)
- MISSING: audience (New / Warm / Ready) per ad
- MISSING: which product each ad showed
- MISSING: start and end dates per ad (only days_live is given)
- MISSING: the 20 reviews. None arrived, and the brand-file quotes don't say which product the buyer used.
- MISSING: clean photos of Sprout Original (Adults) by view: pouch front, daily pack torn across the top, gummies in a palm
- MISSING: stock level
- MISSING: which Adults offer is current. The live discount lines conflict (49%, 52%, 55%, 61%, $29.99 with SMS).
- MISSING: grams of sugar per pack
- MISSING: whether ads must carry the FDA line or the SMS footnote
- MISSING: R1 results above 20 purchases

**Stop 1, corrections needed before planning:**
1. Should P1 count once (as above) or as two windows? Splitting it would put the same creative in both groups.
2. Do you agree with the type reads taken from opening lines?
3. Do you accept a words-only style, given that the winning trait "video" cannot carry into image ads?
4. Please send the reviews and the product photos.
```
