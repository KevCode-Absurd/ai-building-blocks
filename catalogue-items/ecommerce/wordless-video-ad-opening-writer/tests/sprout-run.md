# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 2 of 6 met. Invented facts: 2.

The run handled missing inputs well: it flagged the photos, motions and gummy count as MISSING, marked motions inferred, and stopped for approval. It is a sensible line-up, but it is only Stage 0 with a table instead of the shape, so the owner has no frames or clip prompts yet.

## Fix

Add a rule to Stage 0 that the line-up must use the output-shape row layout, and that missing photos should not block writing the line-up when a description exists. Also require ad-supplied props only in rows, or mark extras as inferred.

## Judge list

- Met: The run stopped for your yes on the line-up, the product card, the sheets and the storyboard.
  Stopped after the line-up: "Which rows do you approve (2 or 3)?" No later stage was written ahead.
- Not met: The first frame already shows the motion part done, at thumbnail size.
  No start frame yet. Rows only hint: "already tipped", "a third of the way". Stage 4 not reached.
- Not met: The finish lands in the last third, and nothing new happens after it.
  No timed thirds or shot card written; only a "done" description per row.
- Not met: The end frame is still and sits next to your ad's first frame without a jump in place or light.
  Only a "Last frame" row line, e.g. "in the spot where the tub stood"; no end frame produced.
- Not met: The prompt says "real speed" once, with no slow-motion, time-lapse or "explode" style words.
  No clip prompt exists, so "real speed" never appears.
- Met: No words in the picture and nobody talking.
  Sound rows are SFX and ambient only; overlay not yet added and no speech.

## Invented

- claim: "Row C: the shaker and scoop sliding out, then the powder tub" (Shaker and scoop are not in the ad's first frame; only a tub is. Plausible but unconfirmed.)
- claim: "They own this exact kit" (Asserts the buyer owns a shaker and scoop; the brand file only says some reviewers quit powders and shakers.)

## What went in

```text
Product: Sprout greens gummies. Photos attached: pouch front, one
daily pack, gummies in a palm, close-up of the gummies. Pouch:
glossy deep green foil, big yellow wordmark. Gummies: small opaque
deep-green bears, soft matte.
How it's used: tear one daily pack, tip the small handful of
gummies into your hand, eat. No water, no shaker.
Brand handling notes: "The daily pack is torn straight across its
top edge. Never the side, bottom or a corner." "Gummies pour out
of the torn top into a palm or bowl." "The big pouch opens only at
its resealable top. It is never shown torn."
Real motions and sounds: not written down yet.
Ad it goes before: "Powder tub". First frame (still attached): a
man at a kitchen counter, morning window light from the left,
holding a half-used powder tub.
Tool: 4-second clips, takes a start and an end frame.
```

## What came out

```text
I can only write prompts here. No pictures or clips will come out of this chat unless a video tool is connected.

**MISSING:** the four product photos and the ad's first-frame still did not come through on my side. Please re-attach them. Until then I'm working from your written description, and nothing below is checked against the real pouch, pack or bears.
**MISSING:** real motions and sounds. Every motion below is proposed from how the product is used and marked *inferred*. Please confirm or correct them.
**MISSING:** how many gummies are in one daily pack. I've written "N" until you give the exact count.

## Line-up (Stage 0)

| | Row A: Level | Row B: Release | Row C: Order |
|---|---|---|---|
| **Focus** | The bears leaving the torn daily pack | The daily pack's top strip | The old powder kit against one daily pack |
| **Motion** *(all inferred)* | A torn daily pack, already tipped, pours bears into a small bowl. | A tear already a third of the way straight across the daily pack's top edge runs to the far side. | The shaker and scoop are already sliding out of frame, then the powder tub. One daily pack is set down in the cleared spot. |
| **Finish / what "done" looks like** | The last bear tumbles, the pile settles and nothing moves. N bears in the bowl. | The strip comes away whole in one piece, the pack sits open at its top and the bears are just visible. | The counter is clear except for the daily pack, flat and square to camera. |
| **Place & camera** | Kitchen counter, morning window light from the left. Overhead, locked. | Same counter and light. Locked, at the pack's height. | Same counter and light. Locked, at counter height, matching the ad's angle. |
| **Sound** | SFX: soft patter of bears into the bowl, the last one landing. Ambient: quiet kitchen morning. | SFX: one clean foil tear, the strip lifting free. Ambient: quiet kitchen. | SFX: plastic scraping on the counter, the tub's hollow slide, a light foil tap as the pack lands. Ambient: quiet kitchen. |
| **Last frame** | Bowl of N bears, the opened daily pack beside it with its printing clear, window light from the left. | Opened daily pack held still, strip gone, printing clear. | Daily pack alone on the counter, printing clear, in the spot where the tub stood in the ad. |
| **Why this buyer waits** | Powder users know clumps and dust. They'll wait to see a dose that lands clean and counted. | A tear that goes wrong is a small daily annoyance, so they'll wait to see this one come away whole. | They own this exact kit and will wait to see whether all of it really gets replaced by one pack. It sets up the man and his tub with no change of subject. |
| **Hands** | None | A hand is needed to tear: hands only, no face | A hand is needed to sweep and set down: hands only, no face |

All three keep the pouch out of the motion. It is never torn and only ever opens at its resealable top. The powder tub, scoop and shaker would be plain and unbranded.

**Before I go on:**
1. Which rows do you approve (2 or 3)? Are hands-only shots acceptable for B and C? If not, I'll replace them with motions that need no hand.
2. Do you want an overlay (up to 4 words, e.g. "Wait for it"), or none?
```
