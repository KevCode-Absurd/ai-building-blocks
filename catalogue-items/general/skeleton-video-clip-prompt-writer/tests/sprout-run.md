# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 1 of 5 met. Invented facts: 2.

The run correctly stopped for approval after the avatar card and flagged missing facts clearly. But it relabelled the tubs as 'protein tubs', which the script never said, and the other criteria couldn't be checked because the run stopped early. It also skipped the Stage 2 heading, the shape-listed format and the reference prompts.

## Fix

In Stage 0 and the avatar card, add the rule 'use the script's own words for the prop (say 'tubs', don't name a product type)'. Also make Stage 1 output include the Stage 2 reference prompts so nothing is skipped.

## Judge list

- Met: It stopped for your approval after the avatar card, the sheets and the storyboard.
  "Stopping here for approval 1." It correctly halted after stage 1 and did not go on to later stages.
- Not met: Every step is framed the same way, and only the growing thing changes between them.
  No rung camera or storyboard exists yet because the run correctly paused at approval 1. Nothing to verify.
- Not met: The skeleton has the same eyes, bones and proportions in every image.
  No images or prompts exist yet. Only the avatar card with 'What never changes' was written.
- Not met: No calendar, clock, sign or number appears inside any picture.
  No picture prompts exist yet. It does note labels are 'added in editing and never drawn'.
- Not met: The product matches its photos, label and all, and opens the way your brand shows it.
  No product sheet yet. It also claims the photos are not visible and asks for re-attachment.

## Invented

- claim: protein tubs (The script says 'half-used tubs' and 'chalky taste', never protein. It's also a category Sprout doesn't say it competes with.)
- number: Seconds estimates (3.5, 3.9, 3.0, 2.6, 27.3 s) (Marked as estimates at 2.3 words/s as the skill instructs, so allowed.)

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
I'll write the prompts. This chat has no video tool connected, so no pictures or clips will come from here.

## Stage 0: Script in

**Dial:** the number of half-used protein tubs in one kitchen cupboard.
**Rung labels:** TUB 1 · TUB 5 · TUB 12 · TUB 20. These are added in editing and never drawn.
**The one place:** a single wall-mounted kitchen cupboard with one shelf and one hinged door, in one kitchen.
**Product enters:** at the turn (T), in the same kitchen. The script doesn't change the place between rungs.

| # | Line | Seconds | Claims |
|---|---|---|---|
| Q | "How many half-used tubs can one cupboard hold?" | 3.5 `estimate` | none |
| 1 | "Tub one. Two scoops, then the chalky taste wins." | 3.9 `estimate` | "chalky taste" refers to generic tubs only (plain, unbranded, never a rival's pack) |
| 2 | "Tub five. The shelf starts to bend." | 3.0 `estimate` | none |
| 3 | "Tub twelve. The door needs a hip to shut." | 3.9 `estimate` | none |
| 4 | "Tub twenty. The cupboard gives up." | 2.6 `estimate` | none |
| T | "Or skip the tub. Rip. Tip. Enjoy." | 3.0 `estimate` | Shows use. The daily pack is torn straight across its top edge only, and the pouch opens only at its resealable top. |
| C | "Sprout gummies. Sixty-plus ingredients in one daily pack." | 3.5 `estimate` | "Sixty-plus ingredients" needs a source |
| O | "First order, $29.99 with text sign-up." | 3.9 `estimate` | Price and condition, word for word from the current offer |

Estimated total: about 27.3 s, at 2.3 spoken words a second. These times stay estimates until the narration is recorded.

MISSING: the pouch photos (front, side, top) and the daily-pack photo. They are referenced but not visible in this chat. Please re-attach them before Stage 3. The product sheet can't be built or checked without them.
MISSING: a source for "Sixty-plus ingredients" (for example, the label's ingredient list).
MISSING: confirmation that "$29.99 with text sign-up" is the current offer, word for word, and any terms line for the end card.
MISSING: whether the brand uses music. The default is no music, only room tone and prop sounds.
MISSING: the label text on the pouch and daily pack, word for word.

## File 1: Avatar card

**Role:** the one living the habit. It buys a protein tub, takes two scoops, gives up on the taste and shoves the tub in the cupboard. Then it does the same again, tub after tub. At the turn it swaps the tubs for one Sprout daily pack.

**Look:** a lanky adult cartoon skeleton with warm ivory bones and a soft matte finish. Its big round cartoon eyes sit in the sockets, white with dark pupils. Its proportions are friendly and slightly long-limbed. It reads as a grown-up, never a toy or a children's character.

**Clothes / signature item:** none. The cast note says no clothes.

**Props:**
- Plain unmarked protein tubs with plain lids, all one size and one colour, never branded or a rival's pack.
- One plain scoop.
- The cupboard door and its single shelf.
- The Sprout pouch and one Sprout daily pack, drawn only from the real photos.

**Voice:** none. The jaw stays closed, and the narrator is off screen in a real or stock voice, never cloned.

**Feeling is shown by:** eyes first (squint, wide, rolling), then the whole pose (shoulders dropping, arms full, a hip pushed against the door).

**What never changes:**
- Bone colour and finish.
- Eye shape and size.
- Proportions.
- The bones stay joined and rigid.
- The jaw stays closed.
- It has no clothes, and gains no accessories or text.

**Reaction figures:** none. The cast note says no onlookers.

**Never:** a real person, a child, a known character, a toy for children, a customer/founder/expert role, or a body before-and-after.

**Stopping here for approval 1.** Reply "yes" to approve the avatar card, or tell me what to change. Please re-attach the product photos before Stage 3.
```
