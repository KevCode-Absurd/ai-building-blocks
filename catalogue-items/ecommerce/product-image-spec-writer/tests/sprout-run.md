# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 2.

The run correctly says it can't see the photos, rejects the Sugar-Free photo as the wrong variant, and marks every visual detail MISSING instead of guessing. The lock lines, blocked-shot table and single next-photo request are usable and stay within Sprout's facts.

## Judge list

- Met: Every line names a photo or fact, or says MISSING.
  Lines tagged "(brand fact)" or "`MISSING`"; e.g. "Pouch size against a hand: `MISSING`."
- Met: The printed words are quoted exactly, not "brand name and logo".
  No photo readable; it says "exact letters... `MISSING`. It can't be taken from the brand name." Quotes "28 Daily Packs" from facts.
- Met: The lookalike names a real thing a model would draw for your category.
  "Not a plastic tub or jar of gummy vitamins." "Not a greens-powder canister or scoop."
- Met: No AI-made picture is listed as evidence.
  "Kept photos: none." Text source is a page transcript, not a picture.
- Met: Every gap names the shots it blocks as well as the missing photo.
  Blocked table pairs each gap with shots, e.g. "Pouch size against a hand | scale, place, use".

## Invented

- other: Not a matte kraft-paper pouch. (Category lookalike; labelled as category default, so acceptable.)
- other: Not red, orange or multicolour gummy bears (Labelled category lookalike; fine.)

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

None of the three photos came through. Only `sprout/product-page.md` is attached, so I couldn't open any image at full size. A described photo can't be checked, so no photo is kept and every line a photo would source says `MISSING`.

| Photo | This exact variant? | Readable? | Honest colour? | Result |
|---|---|---|---|---|
| pouch-front.jpg | Not checkable (not attached). The page says gallery images are "inferred from the brand's photo files," so it may be a render. | Not checkable | Doubtful: a soft gradient backdrop can tint glossy foil | **Out until attached and checked** |
| gummies-hand.jpg | Not checkable. Nothing shows whether these are Low Sugar or Sugar-Free gummies. | Not checkable | Not checkable | **Out until attached and checked** |
| pouch-sf.jpg | **No.** By your facts, the white burst marks Sugar-Free, a sibling variant. | n/a | n/a | **Out: wrong variant.** Never use it as a stand-in. |

## Truth sheet: Sprout Original (Adults), Low Sugar, pouch of 28 daily packs

### 1. Identity
- Name and variant: Sprout Original, Adults, Low Sugar, one pouch of 28 daily packs. *(brand fact)*
- The page title reads "Sprout Superfood Gummies". *(product-page.md)*
- Told apart from Sugar-Free by having **no white burst** on the front. *(brand fact)*
- Told apart from the Kids pouch by: `MISSING` (no Kids photo or fact on how the pouches differ).
- Told apart from the tie-in flavour by: `MISSING` (the tie-in pack can't be shown anyway; see Never show).
- Lookalikes a model would draw instead *(category default; brand fact sets the true form)*:
  - Not a plastic tub or jar of gummy vitamins.
  - Not a greens-powder canister or scoop.
  - Not a matte kraft-paper pouch.
  - Not red, orange or multicolour gummy bears.
  - Not translucent, glossy or sugar-coated bears.

### 2. Body
- Pouch shape: stand-up pouch. *(brand fact)*
- Pouch colour and finish: glossy deep green foil. *(brand fact)* The exact shade is `MISSING`.
- Pouch size against a hand: `MISSING`.
- Gummy shape: small bears. *(brand fact)*
- Gummy colour and finish: opaque deep green, soft matte. *(brand fact)*
- Gummy size: about thumbnail height. *(brand fact)*
- Daily pack shape, colour, finish and size against a hand: `MISSING`.

### 3. Marks
- Wordmark: big, yellow. *(brand fact)* The exact letters, typeface and position are `MISSING`. It can't be taken from the brand name.
- Bear face: yellow, top right of the front. *(brand fact)* The exact drawing is `MISSING`.
- "28 Daily Packs": at the bottom of the front. *(brand fact)* The exact wording, case, colour and placement are `MISSING` (not read from a photo).
- Low Sugar marking on the front, if any: `MISSING`.
- Any other front words (flavour line, claims, net weight): `MISSING`.
- Back panel, including the "View Nutrition Label" content: `MISSING`.
- Side gussets and base print: `MISSING`.
- Daily pack print: `MISSING`.

### 4. Build
- Pouch closure: resealable top, the only opening. *(brand fact)* The closure type (zip, press-seal, tear notch above it) is `MISSING`.
- Pouch base, gusset and seal edges in close-up: `MISSING`.
- Daily pack opening: torn straight across its top edge. *(brand fact)* Whether it has a tear notch is `MISSING`.
- What's in one order: one pouch of 28 individual daily packs. *(brand fact; product-page.md Directions and FAQ)*
- Shipping box or mailer, inserts: `MISSING`.

### 5. Use
- Steps:
  1. Open the pouch at its resealable top.
  2. Take one daily pack.
  3. Tear the pack straight across its top edge.
  4. Eat the gummies. *(brand fact; product-page.md Directions)*
- One use: one daily pack, about 20 g, "a small handful". *(brand fact)*
- Number of bears per pack: `MISSING`.
- How it looks in use (bears in an adult's open hand, a pack being torn): `MISSING`. No checked photo exists.
- Changes with use: the pouch empties and is resealed, and torn packs are discarded. How a part-empty pouch looks is `MISSING`.

### 6. Never show
- Cartoon tie-in characters. *(brand fact)*
- Partner brand marks. *(brand fact)*
- The big pouch torn or opened anywhere but its resealable top. *(brand fact)*
- A daily pack torn at the side, bottom or a corner. *(brand fact)*
- The white Sugar-Free burst on this variant. *(brand fact)*
- Known wrong versions: tub or jar, powder canister, red or multicolour bears, translucent glossy bears. *(category lookalikes, Identity)*
- Prices or discount percentages on the image. The page itself shows 49% to 61% and conflicting star ratings. *(product-page.md, Issues 1 and 5)*
- Health-claim text such as "revive whole body vitality" on the image. *(product-page.md, Issue 6)*

### 7. Evidence
- Kept photos: none.
- pouch-front.jpg: rejected for now. Not attached, possibly a render, and the gradient backdrop is a colour risk.
- gummies-hand.jpg: rejected for now. Not attached, and the variant is unconfirmed.
- pouch-sf.jpg: rejected. It shows Sugar-Free, a sibling variant.
- Text source: `sprout/product-page.md`, read 13 Oct 2026. It is a page transcript, not a photo, so it sources no visual detail.

## Lock lines
Every prompt repeats these word for word. They are sourced from brand facts and still need photo confirmation.
1. glossy deep green stand-up foil pouch, not a jar or tub
2. yellow wordmark, yellow bear face top right, no white burst
3. small opaque soft-matte deep-green gummy bears
4. daily pack torn straight across its top edge only
5. no cartoon characters, no partner logos

## Blocked shots
| Gap | Shots it blocks |
|---|---|
| No checked front photo of this variant | identity, ad base, range, place, arrival |
| Wordmark letters, front words and Low Sugar mark unread | identity, ad base, any pouch close-up |
| Back panel / nutrition label | every shot of the back; substance (label close-up) |
| Pouch size against a hand | scale, place, use (pouch in hand) |
| Daily pack look and size | use, arrival, scale (pack), substance (pack) |
| No checked gummies-in-hand photo; bears per pack | substance, use, scale (gummies) |
| Pouch closure, seals, gusset | substance (pouch close-up), use (opening and resealing) |
| Shipping box and inserts | arrival |
| No checked Kids or Sugar-Free photo, Kids difference | range |

## One photo to ask for next
**The Low Sugar pouch, front on, standing upright on a plain white or light grey surface, in even daylight, with an adult hand resting flat beside it without covering any print.** A phone photo is fine. It confirms the exact variant and lets every front word be read line by line. It also gives true colour and size against a hand. That unblocks identity, ad base, scale, place, and the front half of range and arrival.

CHECKS MISSED: none

Want to plan the product photos next with the [Product page gallery planner](https://useaiblocks.com/skills/product-page-gallery-planner)? It takes this truth sheet. Or type your own next step.
```
