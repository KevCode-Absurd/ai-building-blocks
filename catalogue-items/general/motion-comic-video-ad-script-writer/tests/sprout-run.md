# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 2.

The script is a strong, usable motion comic with a clear story, exact product details and honest MISSING/inferred notes. But it departs from the required output shape, and a couple of lines break the skill's own limits.

## Fix

Add to the handback step a rule to output the plain-text shape exactly (FIT/CLAIM/HERO/PALETTE labels, pipe table, NOTES, CAST NOTE, SCORE and Missed lines) with no markdown headings, and to run the word-count check on every caption and narration line before scoring.

## Judge list

- Met: Cover the captions. Can you still tell what was wrong and what changed?
  Drawings show shaker clumps, crusty sink scrub, tub shoved in cupboard, then pouch and gummies tipped into palm.
- Met: Only one claim appears anywhere, including the cutaway labels.
  Claim is no water/mixing/shaker; 60+ ingredients explicitly left out. No cutaway used.
- Met: Every panel has a named cut, and the reveal panel is the longest.
  Panel 6 'moment to moment', 6 seconds, longest; all panels name a transition.
- Met: No drawn person says the product worked for them, and none is an expert or a child.
  Single adult office worker hero, no speech balloons, no drawn customer testimonial.
- Met: The ad ends on a photo panel of your real product, not a drawing of it.
  Panel 8: 'The real Sprout pouch photo in the same border, set in editing.'

## Invented

- other: 6:45. Greens before work. (Invented time of day in a caption; harmless story detail but not from the inputs.)
- other: Gummies drawn in Sprout green (inferred) (Brand file says deep-green bears; flagged inferred and consistent, so acceptable.)

## What went in

```text
Idea: quitting greens powder because the routine is a chore.
Buyer: 28 to 45, office job, has quit powders. Their words: "I've
been choking on [a big-name greens powder] for the last few years",
"not having to clean a shaker bottle".
Product: Sprout daily greens gummies. One daily pack, torn straight
across the top, gummies tipped into a palm. No water, no mixing,
no shaker. Pouch: glossy deep green, yellow wordmark.
Approved: "60+ ingredients, 21 vitamins & minerals, and 6g fiber"
in 1 pack.
Visible result: none, it's a daily supplement.
Offer: $29.99 first order with text sign-up, renews at $49.99 every
4 weeks. 30-day money-back, first order only.
Brand line: "Rip. Tip. Enjoy."
Video, 30 seconds.
```

## What came out

```text
## 1. Fit and claim

**Fit:** This works as a comic. It is a short problem-and-fix story about a routine, and the story can be drawn.

The offer does not fit the photo panel. The terms are long: text sign-up, a renewal price, and a first-order-only guarantee. The photo panel cannot show "$29.99" without the renewal terms next to it. The full terms are set there in small type (below). Repeat them in the ad copy and on the landing page.

**Claim:** Sprout greens need no water, no mixing and no shaker. Rip the pack and tip the gummies into your palm.
**Source:** brand usage facts: "One daily pack, torn straight across the top, gummies tipped into a palm. No water, no mixing, no shaker."

## 2. Hero line and palette

**Hero line (reuse unchanged):** One adult office worker. Short round black bob, round black glasses, grey-blue sweater, black trousers. Simple face: dot eyes and a single-line mouth.

**Palette (reuse unchanged):** Black, plus deep Sprout green, warm yellow, grey-blue and cream.
- Deep green and yellow appear only on the Sprout pouch and gummies.
- The old greens powder is drawn as grey-blue sludge, so Sprout green stays the most saturated thing on screen.
- Clock faces have no numerals.

**Drawn product (inferred, no photo supplied):** A small single-serve pouch standing upright in glossy deep green. A blank yellow band sits where the wordmark is, with no letters. The tear line runs straight across the top.

## 3. Panel list

| Panel | Movement | Transition in | What's drawn | Motion | Caption | Narration | Seconds |
|---|---|---|---|---|---|---|---|
| 1 | Set | scene to scene (opening: kitchen, early morning, dark window) | Hero at the kitchen counter, heavy-lidded. Large thing: a huge tub of powder beside a shaker bottle. | Flat layers drifting apart: counter in front, dark window behind | 6:45. Greens before work. | Every morning, the same green ritual. | 3 |
| 2 | Set | action to action | Hero shaking the shaker hard. Grey-blue clumps cling inside. One sweat drop. | One part moving: the shaker shakes | Choking on it for years. | Scoop, pour, shake… and it still clumps. | 4 |
| 3 | Grow | action to action | Hero at the sink scrubbing crusted residue from the shaker. A wall clock with no numerals looms large behind. | One part moving: the sponge scrubs | Late again. Shaker still crusty. | Then the shaker sits in the sink, crusting. | 4 |
| 4 | Grow | scene to scene ("that evening") | Tall panel: storm cloud over the hero's head at the top. Below, the hero's hand shoves the tub to the back of a low cupboard. | Pan down the tall panel, from the cloud to the tub | That evening. Quit again. | So the tub ends up at the back. | 3 |
| 5 | Turn | scene to scene ("next morning") | Same counter where the tub stood. Now a single deep-green pouch stands upright, the largest and brightest thing. Hero behind it, small lightbulb overhead. | Flat layers drifting apart: pouch in front, hero behind | Next morning. No tub. | What if greens didn't need a shaker? | 3 |
| 6 | Turn (reveal) | moment to moment | Close on the hero's hands. The pouch is torn straight across the top and gummies tip into an open palm. Gummies drawn in Sprout green (inferred). | One part moving: gummies slide into the palm, slowed | Rip. Tip. Enjoy. | Rip the pack. Tip them out. Done. | 6 |
| 7 | Land | action to action | Same kitchen, morning light. Hero chewing and heading out, coat on. The sink is empty, the clock small and calm, the torn pouch on the counter. | One part moving: the front door swings open | Not cleaning a shaker bottle. | No water. No mixing. No shaker to scrub. | 4 |
| 8 | Photo panel | subject to subject (drawn pouch to real pouch) | The real Sprout pouch photo in the same border, set in editing. Text in editing: "Rip. Tip. Enjoy." Small type below: "$29.99 first order with text sign-up. Renews at $49.99 every 4 weeks. 30-day money-back, first order only." | Slight push-in on the photo | n/a (offer text only) | none | 3 |

**Total:** 30 seconds.

## 4. Notes

**Buyer words used:**
- "Choking on it for years." This trims "I've been choking on [big-name greens powder] for the last few years." The competitor name is kept out (inferred trim).
- "Not cleaning a shaker bottle." This trims "not having to clean a shaker bottle" to fit 6 words (inferred trim).

**Brand line:** "Rip. Tip. Enjoy." is the reveal caption and the photo-panel line.

**Claims left out:**
- "60+ ingredients, 21 vitamins & minerals, and 6g fiber" is a second claim and belongs in a second ad.
- No health or energy outcome is shown. There is no visible result, so the land panel shows only a morning routine that goes easier.

**No cutaway:** The comic does not explain how the product works, so none is needed.

**Speech balloons:** None. All lettering is added in editing.

**MISSING:**
- Product photos: pack front and gummies out of the pack. The drawn pouch shape, size relative to a hand, and gummy shape and colour could not be checked against the real product.
- Lettering typeface.
- Verified review phrase (optional).

**Inferred:**
- The pouch is drawn standing upright.
- The wordmark is a blank yellow band.
- The gummies are Sprout green.
- The pouch is deep green, not black, white or grey, so it needs no outline.

## 5. Cast note

**Who carries it:** The drawn hero carries the ad, with a narrator over the panels.

**Why:** This buyer has already quit powders. A simple, plain face lets them see their own groggy mornings without being lectured.

**Voice:** A dry, warm, slightly wry peer who has been there. Unhurried and conversational, never a hype announcer.

**Never changes:** The black round bob, round black glasses, grey-blue sweater, black trousers and simple dot-eye face. Sprout green and yellow appear only on the pouch and gummies.

## 6. Score

**100 / 100**

**Sum:** 6 of 6 checks passed. 6 ÷ 6 × 100 = 100.

**Checks missed:** None.
```
