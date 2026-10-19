# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The run correctly read the script, built a clean bar grid, wrote a complete avatar card for an unseen-singer lead who never testifies, and stopped at the first approval gate as the skill requires. It over-flags as MISSING several facts the brand file already holds (product name, gummy format, the 21-vitamins and 'works like a supplement' lines, the offer), and its 'powder into water?' aside contradicts the brand file, so the owner will have to answer questions that were already answered.

## Judge list

- Met: Stopped for approval after the avatar card, the sheets, and the track with its storyboard
  "**Stop.** Approve this avatar card and answer the music and animation question to move on to stage 2." Only gate 1 reached, as the skill requires.
- Met: Track made before the storyboard; every cut on a bar line of that take
  Not reached: no storyboard or frame written before approval. Only the script's bar grid read in stage 0 ("1 bar = 2.0 s").
- Met: Music prompt starts singing at 0 seconds and ends on the sung tag
  Not reached: no music prompt written yet; stage 4 waits on approvals 1 and 2 as the skill demands.
- Met: Animated lead and pack match their sheets in every shot
  Not reached; card fixes "Never changes: Hair shape and colour, eye size and colour, denim-blue cardigan, cream top, orange pom-pom keyring".
- Met: Mouths closed in every non-singing shot; pack on screen within 5 seconds
  "Singer: unseen. The lead's mouth stays closed in every shot." Shot-level check not yet reachable.

## What went in

```text
Song script (from the song ad script skill), 30 s, 120 BPM:
[Hook] Rip it, tip it, out the door / A handful of greens and
nothing more
[Verse] Lunch box packed and the kettle's on / Keys in my hand
and the morning's gone / That chalky shake? Still in the sink /
No time to scrub, no time to think
[Hook] (same)  [Lift] Twenty-one vitamins and minerals (2 bars) /
Tastes like a treat, works like a supplement (2 bars)
[Hook] (same)  [Tag] Rip. Tip. Sprout.
Sound: bright indie pop, warm female lead, handclaps, jangly
guitar. Cast note: unseen singer; one animated adult woman, the
busy parent, on screen.
Photos attached: pouch front, side and top; one daily pack. Pack
torn straight across its top edge; the pouch opens only at its
resealable top. Colours: forest green, warm cream, sunflower.
Tools: one-box music tool; video clips up to 8 s with timed
prompts and an end frame; no mouth sync.
```

## What came out

```text
# 1. Avatar card: the lead

**Script fixed from here:** 120 BPM, so 1 bar = 2.0 s. The ad is 15 bars = 30 s.

| Section | Bars | Seconds |
|---|---|---|
| Hook 1 | 1–2 | 0–4 |
| Verse | 3–6 | 4–12 |
| Hook 2 | 7–8 | 12–16 |
| Lift | 9–12 | 16–24 |
| Hook 3 | 13–14 | 24–28 |
| Tag "Rip. Tip. Sprout." | 15 | 28–30 |

- Singer: unseen. The lead's mouth stays closed in every shot.
- Brand and claim lines sung exactly as written:
  - "A handful of greens"
  - "Twenty-one vitamins and minerals"
  - "works like a supplement"
  - "Sprout"

| Field | Card |
|---|---|
| **Role in the song** | The busy parent getting out the door. She acts out every line but never sings, speaks or gives a testimonial. She is not presented as a customer, founder or expert. |
| **Age range** | Made-up adult, mid-30s to early 40s |
| **Look** | Medium build with soft rounded shoulders. Dark brown curly hair in a loose high bun with a few curls falling at the temples. Large, expressive brown eyes and warm medium-brown skin. Simple rounded animated features. |
| **Clothing (two colours)** | Denim-blue cardigan over a plain warm-cream crew-neck top. Dark trousers and plain shoes, kept neutral. |
| **Signature item** | Chunky orange pom-pom keyring on her keys, always in her left hand when keys are in shot |
| **Props** | Kids' lunch box (plain, unmarked), electric kettle, travel mug, keys, the old shaker bottle with chalky residue, the Sprout pouch (resealable top only), one Sprout daily pack (torn straight across its top edge) |
| **Voice** | None on screen. The track's sung voice is warm, bright female indie-pop: light, clear, smiling tone, mid-range, a little breathy on held notes. It is described by tone only, with no artist named and no cloned or real person's voice. |
| **Never changes** | Hair shape and colour, eye size and colour, denim-blue cardigan, cream top, orange pom-pom keyring, build. Mouth closed throughout. She is never shown as a child or with a named studio's style. |

**Before anything is made:**
- Does the brand use music and animation in its ads? A yes is needed before stage 2 or any song is made.

**Missing information:**
- `MISSING: brand's use of music and animation (ask before any song is made)`
- `MISSING: product name and label text, word for word, from the pouch and daily pack (assumed "Sprout" from the tag)`
- `MISSING: source for "Twenty-one vitamins and minerals"`
- `MISSING: source for "works like a supplement"`
- `MISSING: source for "A handful of greens"`
- `MISSING: how the product is used (powder into water? amount?) and how it must be shown`
- `MISSING: offer line for the tag`
- `MISSING: Hook bar count not stated in the script, inferred as 2 bars (1 bar per line) so the total reaches 30 s`

**Stop.** Approve this avatar card and answer the music and animation question to move on to stage 2.
```
