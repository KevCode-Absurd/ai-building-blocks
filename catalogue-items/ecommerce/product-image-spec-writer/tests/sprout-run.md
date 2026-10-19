# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 3.

The run honestly said none of the photos were attached, held out or rejected each file, and marked every unread detail MISSING with the shots it blocks. The owner gets a usable lock-line set and a clear single photo to send next.

## Judge list

- Met: Every line names a photo or fact, or says MISSING.
  Lines carry 'Source: brand fact' or 'MISSING'; e.g. 'Pouch back, sides and bottom... MISSING'.
- Met: The printed words are quoted exactly, not 'brand name and logo'.
  No photo read, so 'every printed word in reading order: MISSING'; only '28 Daily Packs' quoted from brand fact. Honest gap.
- Met: The lookalike names a real thing a model would draw for your category.
  'a plastic bottle or jar of gummy vitamins... not a bottle or jar'; gelatin gummy bears; powder tub.
- Met: No AI-made picture is listed as evidence.
  'Kept: none.' Gallery renders only mentioned as a doubt.
- Met: Every gap names the shots it blocks as well as the missing photo.
  Blocked table lists each gap with shots, e.g. 'Pouch size against a hand | scale, place, arrival, ad base'.

## Invented

- claim: gallery pack shots are often renders or mock-ups (Speculation about the brand's photos, offered as a reason to hold the file out, not as Sprout fact.)
- claim: Lookalike 2: clear, glossy, brightly coloured gelatin gummy bears (General category knowledge; acceptable.)
- other: Tells it apart... Source: product-page.md ('Vs Powders' theme) (Lookalike 3 citation is a stretch but the page does contain it.)

## What went in

```text
Product: Sprout Original (Adults), Low Sugar, pouch of 28 daily packs

Photos I have:
1. pouch-front.jpg: the pouch front on, soft gradient background
   (from our product page gallery)
2. gummies-hand.jpg: gummies in an adult's open hand (gallery)
3. pouch-sf.jpg: a pouch with a white burst on the front

Facts:
- Glossy deep green stand-up foil pouch, big yellow wordmark, yellow
  bear face top right, "28 Daily Packs" at the bottom. Sugar-Free
  adds a white burst.
- Gummies: small opaque deep-green bears, soft matte, about
  thumbnail height. One pack is about 20 g, "a small handful".
- Tear the daily pack straight across its top edge, never the side,
  bottom or a corner. The big pouch opens only at its resealable
  top and is never shown torn.
- Never show cartoon tie-in characters or partner brand marks.

[attached: sprout/product-page.md]
```

## What came out

```text
## Photo check

None of the three image files came through. Only `sprout/product-page.md` is attached, so I could not open any photo at full size. A described photo can't be checked, so every line it would have sourced says `MISSING`. **No photo currently shows the exact variant. Don't generate any image of this product until one does.**

| File | Exact variant? | Readable? | Honest colour? | Result |
|---|---|---|---|---|
| pouch-front.jpg | Not checked (file not attached). The sugar level can't be confirmed, and gallery pack shots are often renders or mock-ups. | Not checked | Doubtful: a soft gradient backdrop can cast colour onto glossy foil | **Held out.** Attach the original file, not the gallery export. |
| gummies-hand.jpg | Not checked (file not attached). Can't confirm it's Original rather than the tie-in flavour, or Low Sugar rather than Sugar-Free. | Not checked | Not checked | **Held out.** Attach the file. |
| pouch-sf.jpg | **No.** The white burst marks Sugar-Free (brand fact), which is a sibling variant. | n/a | n/a | **Rejected.** Wrong variant. Don't keep it "for angles". |

## Truth sheet: Sprout Original (Adults), Low Sugar, pouch of 28 daily packs

### 1. Identity
- Name and variant: Sprout Superfood Gummies, Original flavour, Adults, Low Sugar. *Source: brief and product-page.md.*
- Tells it apart from Sugar-Free: no white burst on the pouch front. *Source: brand fact.*
- Tells it apart from the tie-in flavour and the Kids versions: `MISSING` (how those pouches differ isn't recorded). Blocks: identity, range, ad base.
- Lookalike 1: a plastic bottle or jar of gummy vitamins, the default packaging for this category. It's a stand-up foil pouch, **not a bottle or jar**. *Source: brand fact.*
- Lookalike 2: clear, glossy, brightly coloured gelatin gummy bears. These are **opaque, matte, deep-green bears**. *Source: brand fact.* The pectin base, not gelatin, is from product-page.md.
- Lookalike 3: a tub and scoop of greens powder. This is gummies, not powder. *Source: product-page.md (the "Vs Powders" theme and "Us vs. Them" section).*

### 2. Body
- Pouch: stand-up foil, glossy deep green. *Source: brand fact.* Exact shade, gusset shape and gloss under light are `MISSING`. Blocks: identity, place, ad base.
- Pouch size against a hand or furniture: `MISSING`. Blocks: scale, place, arrival, ad base.
- Daily pack (sachet): shape, colour, material, finish and size are all `MISSING`. Blocks: use, scale, substance, arrival.
- Gummies: small bears, opaque, deep green, soft matte, about the height of a thumbnail. *Source: brand fact.* Not yet confirmed from a photo: `MISSING` (gummies-hand.jpg not attached). Blocks: substance, use.
- One serving is about 20 g, "a small handful" of bears. *Source: brand fact and product-page.md ("small handful of green gummy bears").*

### 3. Marks
- Pouch front, every printed word in reading order: `MISSING`. No photo has been read, so no wording is assumed. Blocks: identity, ad base, place, range.
- Wordmark: big, yellow. The lettering itself is `MISSING`. *Layout source: brand fact.* Blocks: identity, ad base.
- Bear-face graphic: yellow, top right of the front. *Source: brand fact.* The drawing itself is `MISSING`. Blocks: identity, ad base.
- Count line at the bottom of the front: the brand says it reads "28 Daily Packs". The exact wording and type are `MISSING` until read from a photo. Blocks: identity, ad base.
- Pouch back, sides and bottom, including the nutrition panel: `MISSING`. Blocks: **every shot of the back, sides or bottom**, and any range shot that turns the pouch.
- Daily pack print: `MISSING`. Blocks: use, arrival, substance.
- Shipping box print: `MISSING`. Blocks: arrival.

### 4. Build
- Big pouch opens only at its resealable top. *Source: brand fact.* How the zip or seal looks up close is `MISSING`. Blocks: use, close-ups of the pouch opening.
- The big pouch is never shown torn. *Source: brand fact.*
- Daily pack opens by a tear straight across its top edge. *Source: brand fact.* The notch, the seal width and the torn edge are `MISSING`. Blocks: use.
- One pouch holds 28 individual daily packs. *Source: product-page.md ("Each large pouch contains 28 individual packs") and brand fact.*
- One order is 28 packs every 4 weeks on subscription, or 28 packs once. *Source: product-page.md.* The shipper box and anything else in it are `MISSING`. Blocks: arrival.

### 5. Use
- Take one daily pack from the pouch. *Source: product-page.md ("Grab a single pack daily").*
- Tear the pack straight across its top edge, never the side, bottom or a corner. *Source: brand fact.*
- Eat the small handful of bears inside, about 20 g, once a day. *Source: brand fact and product-page.md.*
- How the gummies look in an adult's open hand: `MISSING` (gummies-hand.jpg not attached). Blocks: use, substance, scale.
- How the pouch looks as it empties and how the reseal looks once opened: `MISSING`. Blocks: use, place.

### 6. Never show
- Cartoon tie-in characters, or anything from the tie-in flavour. *Source: brand fact.*
- Partner brand marks, including the HSA/FSA service and the testing lab. *Source: brand fact. Partners named on product-page.md.*
- The big pouch torn, or opened anywhere but its resealable top. *Source: brand fact.*
- A daily pack torn at the side, bottom or a corner. *Source: brand fact.*
- Known wrong version: a white burst on the front, which is Sugar-Free. *Source: brand fact. Seen in rejected pouch-sf.jpg as described.*
- Known wrong versions: the tie-in flavour pouch and the Kids pouches. *Source: product-page.md ("Find Your Flavor" tiles).*
- Known wrong versions: a bottle, jar or tub; translucent glossy bears; powder. *Source: Identity lines above.*

### 7. Evidence
- Kept: none. *Source: photo check.*
- Held out: pouch-front.jpg (file not attached; sugar level unconfirmed; possible gallery render; gradient backdrop). *Source: photo check.*
- Held out: gummies-hand.jpg (file not attached; flavour and sugar level unconfirmed). *Source: photo check.*
- Rejected: pouch-sf.jpg (Sugar-Free sibling). *Source: brand fact.*
- Note: product-page.md says its gallery description was inferred from photo files and not seen directly, so the page can't be used as photo evidence. *Source: product-page.md.*

## Lock lines
Repeat these word for word in every prompt:
1. glossy deep green stand-up foil pouch, not a bottle or jar
2. no white burst on the pouch front
3. small opaque matte deep-green bears, thumbnail height
4. daily pack torn straight across its top edge only
5. no cartoon characters, no partner logos

## Blocked shots

| Gap | Shots it blocks |
|---|---|
| No verified photo of the Low Sugar pouch front | identity, place, range, ad base, and every shot showing the pouch |
| Front wording and lettering unread | identity, ad base, place, range |
| Pouch back, sides and bottom | every shot of the back, sides or bottom; range (turned pouch) |
| Pouch size against a hand | scale, place, arrival, ad base |
| Daily pack look, print and tear | use, scale, substance, arrival |
| Gummies in hand unverified | use, substance, scale |
| Reseal top close-up and emptying pouch | use, place |
| Shipper box and order contents | arrival |
| How Low Sugar Original differs from tie-in and Kids pouches | identity, range |

## One photo to ask for next
Take **the Low Sugar Original pouch, front on, held upright in an adult's hand, on a plain light-grey or white surface in daylight**. A phone photo at full resolution is fine, with the smallest front print sharp. Send the original file, not a gallery export.

This photo verifies the exact variant (no white burst). It also lets the front wording, wordmark and bear face be read exactly, and fixes the pouch's size against a hand. That unblocks identity, scale, place, ad base and part of range. Please attach the actual pouch-front.jpg and gummies-hand.jpg files as well, so they can be checked at full size.

## Score
SCORE 100/100 (5 of 5 checks)
```
