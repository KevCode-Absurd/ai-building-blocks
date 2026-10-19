# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean Stage 0 and Stage 1 that fixes the dial, place and lines, computes timings correctly at 2.3 words a second, and locks the product-opening rules exactly as the brand shows them. It stops properly at the first approval gate; the only quibbles are over-cautious MISSING lines for facts already in the brand file and calling the tubs "protein-style" when the brand's enemy is greens powder.

## Judge list

- Met: It stopped for your approval after the avatar card, the sheets and the storyboard.
  "Stopped for approval 1. Reply yes to approve the avatar card... Stage 2 (reference images) starts only after a yes." Later stops not yet reached.
- Met: Every step is framed the same way, and only the growing thing changes between them.
  Not yet applicable: storyboard (stage 4) not reached because the run correctly halted at approval 1. Stage 0 fixes "One place: one kitchen cupboard".
- Met: The skeleton has the same eyes, bones and proportions in every image.
  No images yet; card locks it: "Bone count, proportions, ivory colour and matte finish. The eye style. The closed jaw."
- Met: No calendar, clock, sign or number appears inside any picture.
  Not yet applicable: no frame prompts written; tubs specified as "plain unmarked white tubs with plain white lids".
- Met: The product matches its photos, label and all, and opens the way your brand shows it.
  "opens only at its resealable top and is never torn"; pack "torn straight across its top edge only" matches brand rules.

## What went in

```text
Script (from the skeleton ad script skill):
Q "How many half-used tubs can one cupboard hold?"
1 TUB 1 "Tub one. Two scoops, then the chalky taste wins."
2 TUB 5 "Tub five. The shelf starts to bend."
3 TUB 12 "Tub twelve. The door needs a hip to shut."
4 TUB 20 "Tub twenty. The cupboard gives up."
T "Or skip the tub. Rip. Tip. Enjoy."
C "Sprout gummies. Sixty-plus ingredients in one daily pack."
O "First order, $29.99 with text sign-up."
Cast note: the default skeleton, no clothes, no onlookers.
Photos attached: pouch front, side and top; one daily pack. Pack
torn straight across its top edge only; the pouch opens only at
its resealable top, never torn.
Colours: forest green #00582D, warm cream #FFF7DF, sunflower
yellow #FFCC2E. Tools: 5-second clips, 3 references, end frame
yes. Music: not stated.
```

## What came out

```text
# Stage 0: Script in (fixed from here)

- **Dial:** the number of half-used protein-style tubs packed into one kitchen cupboard.
- **Rung labels:** TUB 1 · TUB 5 · TUB 12 · TUB 20.
- **One place:** one kitchen cupboard, seen with its doors open. The script never changes the place.
- **Product enters:** at the turn (T): one Sprout daily pack, torn and tipped.

| # | Line | Words | Seconds | Claims |
|---|---|---|---|---|
| Q | "How many half-used tubs can one cupboard hold?" | 8 | 3.5 `estimate` | none |
| 1 | "Tub one. Two scoops, then the chalky taste wins." | 9 | 3.9 `estimate` | taste, about generic tubs (no brand shown) |
| 2 | "Tub five. The shelf starts to bend." | 7 | 3.0 `estimate` | none |
| 3 | "Tub twelve. The door needs a hip to shut." | 9 | 3.9 `estimate` | none |
| 4 | "Tub twenty. The cupboard gives up." | 6 | 2.6 `estimate` | none (peak) |
| T | "Or skip the tub. Rip. Tip. Enjoy." | 7 | 3.0 `estimate` | none |
| C | "Sprout gummies. Sixty-plus ingredients in one daily pack." | 8 | 3.5 `estimate` | **"Sixty-plus ingredients"** (number) |
| O | "First order, $29.99 with text sign-up." | 7 spoken | 3.0 `estimate` | **"$29.99 with text sign-up"** (offer) |

Total about 26.4 s `estimate`. All times use 2.3 spoken words a second until the narration exists.

MISSING: source for "Sixty-plus ingredients"
MISSING: current offer terms, word for word, confirming "$29.99 with text sign-up" for first orders
MISSING: pouch and daily-pack label text, typed out word for word (photos received, text not)
MISSING: how the gummies are taken after "Tip". Into the palm, or straight from the pack to the mouth?
MISSING: brand file voice notes, and whether the brand uses music. Default until answered: no music.

---

# Stage 1: Avatar card (approval 1)

**Role:** The one living the habit. It buys tub after tub, manages a couple of scoops of each, then shoves the half-used tub into the cupboard and buys another.

**Look:** A lanky adult cartoon skeleton with warm ivory bones and a soft matte finish. Big round cartoon eyes sit in the sockets, white with dark pupils. Friendly and a little hapless. Its feelings show through the eyes first, then the pose.

**Clothes / signature item:** None, per the cast note. Bare skeleton only.

**Props:**
- Plain unmarked white tubs with plain white lids, all the same size, never branded and never a rival's pack.
- One plain white plastic scoop.
- One kitchen cupboard: plain wooden shelves and plain doors.
- The Sprout pouch, built from the attached photos with its printing unchanged. It opens only at its resealable top and is never torn.
- One Sprout daily pack, built from the photo. It is torn straight across its top edge only, and only from the shot where it is torn.

**Voice:** None. The jaw stays closed in every shot. The narrator is off screen. There is no lip-sync.

**What never changes:**
- Bone count, proportions, ivory colour and matte finish.
- The eye style.
- The closed jaw.
- No clothes.
- The same hand (right) on the scoop and the pack.
- It never reads as a customer, founder or expert, and there is no body before-and-after.

**Note for later stages:** Because the jaw stays closed, the "chalky taste" at TUB 1 is shown as a squint and dropped shoulders after the scoop, not as chewing. "Tip" is shown as gummies tipping into the palm unless you tell me otherwise.

**Reaction figures:** None, per the cast note.

---

**Stopped for approval 1.** Reply yes to approve the avatar card, or send changes. Stage 2 (reference images) starts only after a yes.
```
