# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A clean, honest offer ad for the price doubter: both prices at equal size with their conditions right beside them, no percentage mess, no star ratings, guarantee and SMS condition quoted word for word. All numbers trace to the files, gaps are flagged, and the image prompt and layout are specific enough to hand to a designer; only small quirks are a bulleted prompt instead of one paragraph and the note that reviews weren't received despite the brief saying they were pasted.

## Judge list

- Met: One-sentence argument; picture and every line argue the same thing
  "both prices are shown up front: $29.99 ... then $49.99 every 4 weeks"; headline "What you'll actually pay."; first line "Yes, it goes up after box one"
- Met: Ad type's proof is in the inputs, and ruled-out types each have a reason
  Checked fact backed by "Product page price table: $29.99 ... $49.99 renewal"; ruled out Their words, The offer, The occasion, Product alone, Look inside each with a reason
- Met: Image headline 7 words or fewer, at most three other things to read
  "What you'll actually pay. (4)"; three other items (two price+condition pairs, "Pause Or Cancel Any Time."), 21 words total
- Met: Every character count shown and within limit
  First line (83) verified; headlines (25), (21), (25); description (43); all counts correct
- Met: Customer quotes word for word, with source, never beside a face
  No customer quotes used; "no customer words are used"; brand/site wording is quoted with source
- Met: Offer in exact words; anything unbacked listed as MISSING
  Offer block matches the brief; MISSING lists reviews text, renewal shipping, tax, pause/cancel source, sugar grams

## What went in

```text
Business facts: Sprout brand file (pasted: products, prices,
offers, fine and risky claims, buyers, voice, look)
Customer research: all 20 reviews (pasted)
Buyer: the price doubter. Knows the brand, maybe from a store
shelf, thinks it costs too much. Doubts: "Which discount is
real?" "Will the price jump after the first order?"
Offer: Sprout Original, Low Sugar. $29.99 first box with the
text sign-up, then $49.99 every 4 weeks ($1.78/day, site's
figure). 30-day money-back, first order only. "Pause Or Cancel
Any Time."
Plan: words on the image and feed copy. One ad, 4:5.
Photos: pouch on gradient (1), gummies in a palm (2).
Other ads in the batch: P1 image "'Sprout is too expensive':
here's 61% off to prove otherwise"; S1 image "Trusted by 1M+:
Take 61% OFF".

[attached: sprout/brand.md]
```

## What came out

```text
## Ad 1: Both prices, same size

Argument: A price doubter who suspects Sprout's deal hides a jump should start the Low Sugar subscription, because both prices are shown up front: $29.99 for the first 28 packs with the text sign-up, then $49.99 every 4 weeks.

Buyer: The price doubter, who knows the brand (maybe from a store shelf) and thinks it costs too much | Ready | Question: Can I believe it? The named doubt is "Will the price jump after the first order?"

Claim: $29.99 first box, then $49.99 every 4 weeks for 28 packs ($1.78/day, the site's figure). Source: sprout.example product page, prices captured late Sept to mid Oct 2026. Footer terms: "Offer assumes customer has received and uses promotional SMS discount reserved for new customers only."

Offer:
- What you get: Sprout Original, Low Sugar, 28 daily packs.
- Today's price: $29.99 for the first box. This is for new customers who use the text sign-up discount.
- Later price: $49.99 every 4 weeks ($1.78/day).
- Pause and cancel: "Pause Or Cancel Any Time."
- Guarantee: 30-day money-back. "This policy applies only to your initial purchase."
- Action: shop at sprout.example and use the text sign-up.

Code: Checked fact · Designed · Ready | Skeleton: Big type, with the pouch beside it | Size: 4:5

Ruled out:
- **Their words:** the 20 reviews were not in the inputs I received. The brand file's price lines ("They are expensive", "I feel like they are a trap") are doubts with no named source, and none says the price is fair.
- **The offer:** there is no true reason to act now. The birthday price is "indefinitely", with no end date. The live percentages (52/55/49/58/61%) contradict each other. P1 and S1 already run this type.
- **The occasion:** no real date on file.
- **Product alone and Look inside:** these answer "What is it?", which a Ready buyer already knows.

### Picture and layout

Picture must show:
- The two prices as the picture, set at the same size, so the renewal price is not hidden in small print.
- Photo 1's deep-green Low Sugar pouch beside them, upright and sealed, with a few green bears in front.

Reading order: picture (the $29.99 and $49.99 numerals plus the pouch), then the headline "What you'll actually pay.", then each price's label (its condition, sitting right beside it), then "Pause Or Cancel Any Time."

Zones, 4:5 at 1440 x 1800, top to bottom. Side margins are 5%.

| Height | What sits there |
|---|---|
| 0–5% | Empty cream (#FFF7DF) |
| 5–18% | Headline, left aligned, Work Sans bold 120 px, #002C17 |
| 20–44% | Left 5–65% width: "$29.99" in the chunky display font at 260 px, kelly green #007E40. Directly under it: "first box, new customers, text sign-up", Work Sans medium 52 px, #002C17 |
| 44–48% | Left: thin #002C17 rule with a small downward arrow (graphic only, not a button) |
| 48–70% | Left 5–65% width: "$49.99" at 260 px, same size and font, #002C17. Directly under it: "every 4 weeks after" at 52 px |
| 18–80% | Right 62–95% width (overlaps the rows above): the photo 1 pouch, upright, about 58% of frame height. It is closed at its resealable top, never torn, with "28 Daily Packs" readable at its base |
| 74–84% | Left: "Pause Or Cancel Any Time.", Work Sans bold 60 px, #002C17, with a thin sunflower (#FFCC2E) underline. Plain text, no pill or button shape |
| 84–100% | Cream fading to soft pale green. A loose scatter of deep-green bears runs in front of the pouch base. No words. The bottom 5% is clear |

The price block covers about 50% of the height by 60% of the width, which is more than a third of the frame.

Photos needed:
- **Photo 1 (pouch on gradient):** confirm it is the Low Sugar pouch, with no white Sugar-Free burst.
- **Photo 2 (gummies in a palm):** not used. It is kept for a later "In use" ad.

### Words on the image (21 words)

Headline: What you'll actually pay. (4)

Other:
- "$29.99" (1) + "first box, new customers, text sign-up" (6)
- "$49.99" (1) + "every 4 weeks after" (4)
- "Pause Or Cancel Any Time." (5)

### Feed copy

First line: Yes, it goes up after box one: $29.99 with text sign-up, then $49.99 every 4 weeks. (83)

Rest:
1. The $29.99 first box is for new customers who use our text sign-up discount. After that it's $49.99 for 28 packs every 4 weeks, or $1.78 a day.
2. Pause Or Cancel Any Time.
3. 30-day money-back guarantee on your first order. This policy applies only to your initial purchase.
4. Sprout Original, Low Sugar: 21 vitamins & minerals and 6g fiber in one pack. Rip. Tip. Enjoy.

Headlines:
- $29.99, then $49.99/4 wks (25)
- Every price, up front (21)
- $1.78 a day after box one (25)

Description: Sprout Original, Low Sugar. 28 daily packs. (43)

Button: Shop Now

### Image prompt

A 4:5 vertical image, 1440 x 1800 px, in a bright, sunny, candy-like product style.

- **Background and light:** a smooth warm cream (#FFF7DF) background that fades to soft pale green across the bottom 15%. Soft, even daylight from the upper left, with a gentle shadow on the floor.
- **Photo 1 is the Sprout Original Low Sugar pouch.** Keep its glossy deep-green stand-up foil shape, yellow wordmark, yellow bear face top right and "28 Daily Packs" at the bottom exactly as photographed. Do not add a white burst, and do not change any colour or label.
- **Placement and angle:** stand the pouch upright, shot straight on at eye level. Place it in the right third of the frame, from 62% to 95% of the width and from 18% to 80% of the height.
- **Opening rule:** the pouch is sealed at its resealable top. It is never shown torn or open.
- **Props:** five to eight small, opaque, soft matte deep-green gummy bears, about thumbnail height, loosely scattered on the floor in front of the pouch base, between 84% and 95% of the height. No other props.
- **Empty space:** leave the left 65% of the frame, from 5% to 84% of the height, completely empty, flat cream for type.
- **Do not include:** people, hands, children, cartoon characters or any partner brand marks.
- **No text:** generate no text, numbers or logos beyond what is printed on the pouch in photo 1. All type will be set afterwards in a design tool.

### Proof and gaps

**Sources:**
- Product page price table: $29.99 "starts at" price, $49.99 renewal every 4 weeks, "$1.78/day", 28 packs, Low Sugar.
- Product page footer (SMS condition): "Offer assumes customer has received and uses promotional SMS discount reserved for new customers only."
- FAQ (guarantee): "This policy applies only to your initial purchase."
- Product page and science page: "21 vitamins & minerals and 6g fiber" (fine-to-repeat list).
- Brand lines: "Rip. Tip. Enjoy." (brand line).
- Pause and cancel wording: "Pause Or Cancel Any Time." comes from your brief, not the brand file.
- Price check: $49.99 ÷ 28 = $1.785, which the site shows as $1.78. No per-day figure is built from the $29.99 price.

**Inferred:**
- The buyer's Ready stage and the jump doubt come from the brief and the brand file's buyer summary, not from reviews I could read.
- This is a test of transparency against percentage-off.

**Against the batch:**
- P1 and S1 are offer-type ads built on "61% off". This ad uses a different type (Checked fact) and a different argument: both prices shown, with no percentage.
- It tests whether showing the renewal price up front persuades price doubters better than a discount headline.
- The dress of P1 and S1 was not given, so it is not confirmed that Designed is the least-used dress in the batch.

**MISSING:**
- Fact: the text of the 20 pasted reviews. It was not in the inputs I received, so no customer words are used.
- Fact: shipping cost on renewal boxes. Free shipping is only stated for the first order.
- Fact: whether tax applies.
- Source: the brand file does not record "Pause Or Cancel Any Time." as site wording.
- Fact: grams of sugar in Low Sugar.

**Check before launch:**
- **"Pause Or Cancel Any Time.":** confirm it appears on sprout.example word for word. Cancelling is the loudest complaint on public review sites, so add nothing beyond those words.
- **Prices:** confirm $29.99 and $49.99 are still live together for Original Low Sugar.
- **Conflicting discounts:** the live percentages (52%, 55%, 49%, 58%, 61%) contradict each other and are deliberately left out.
- **Conflicting ratings:** the star rating appears four ways (4.8, 4.75, 4.74 and 4.0), so none is used.
- **Photo 1:** confirm it shows the Low Sugar pouch.
- **Type sizes:** confirm all type is at least 40 px. The smallest planned is 52 px.
```
