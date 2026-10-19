# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

The run did exactly what the skill asks for a first turn: confirmed the shaker, wrote a tight character card in the required order with no limbs, set a voice, and stopped for approval. The owner gets a clean, pasteable card and a clear list of what to supply next (sizes, pack photo, accent), though the brand file facts were on hand and could have answered the brand-file MISSING line.

## Judge list

- Met: The run stopped for your yes after the character card, the sheets and the storyboard.
  "Approval 1 of 3: please approve or change the character card and voice line before I write the reference image prompts." Stopped correctly at gate 1.
- Met: Pause the first frame, muted, at thumbnail size. You can see the face and its feeling.
  Not yet reached (stops at approval 1 as the skill requires); card fixes a clear face spot "moulded into the smooth upper front".
- Met: The face sits in the same spot in every clip, with the same eyes, brows and mouth.
  Not yet reached; one-sentence card with fixed face spot, eyes, brows, mouth is set to be pasted into every prompt.
- Met: The mouth moves only with the words and closes when each line ends.
  Not yet reached (no clip prompts yet); nothing so far conflicts; "small closed slightly lopsided mouth at rest".
- Met: The product's label matches its photo, it has no face, and it arrives by a cut at the turn.
  "The bear printed on the pouch is the product's own label art. It is never animated and never given features." Turn cut not yet reached.
- Met: The object never states a price, a result it couldn't see, or a sales pitch.
  Script kept unchanged; its lines contain no price, offer or result ("No water. No shaking. No me.").

## What went in

```text
Script (from the talking object ad script skill):
Narrator: the shaker bottle (has-been). Mood: sheepish.
Clip 1: "I'm the shaker. He hasn't picked me up in weeks."
"This green ring? That's the powder. It never scrubs out."
Clip 2 (the turn): "Then a green pouch moved onto the counter."
"He tears a little pack, tips, and goes."
Clip 3: "No water. No shaking. No me."
"Turns out he never hated greens. He hated me."
Cast note: the shaker carries it; the man it talks about is never seen.
Product: Sprout pouch, front photo attached, plus one daily pack.
Glossy deep green foil, big yellow wordmark, yellow bear face top
right. Show it right: pack torn straight across its top edge; the
pouch opens only at its resealable top, never torn.
Tool: 8-second clips with sound, up to 3 reference images.
```

## What came out

```text
## 1. Narrator

**Confirmed: the shaker bottle (has-been).** It belongs on that kitchen counter. It has a simple cylinder shape with a smooth front for the face. It has no brand and no body, and its clear-white plastic and black lid look nothing like the glossy green Sprout pouch. The face stays on the shaker only. The bear printed on the pouch is the product's own label art. It is never animated and never given features.

## 2. Avatar card

**Character card:**
"A plain unbranded translucent white plastic shaker bottle with a black flip-top lid and no lettering, measurement marks or logos anywhere, stained by a faded olive-green powder ring around the inside just above the base, a few dried green flecks under the lid rim and light scuffs on the body, its face moulded into the smooth upper front of the body just below the lid band, with two round glossy dark eyes, two thin raised plastic brow ridges, a small closed slightly lopsided mouth at rest, and no arms and no legs."

**Voice line:**
"A man in his early thirties, slow and unhurried with small pauses, sheepish and dryly self-aware, neutral General American accent."

No line needs a gesture. The shaker shows "This green ring?" by sliding its eyes down to the stain, so it has no limbs.

MISSING: accent. No brand home accent was given, so I assumed neutral General American. Change it if the brand is based elsewhere.
MISSING: true size of the Sprout pouch and of one daily pack (height × width), needed for the side-by-side picture.
MISSING: photo of the daily pack on its own. Please confirm whether one is attached alongside the pouch front photo.
MISSING: brand file: the buyer's moment, humour limits, anything never to show.
MISSING: what buyers tried before Sprout (other than the shaker), and whether the result can be seen.

**Approval 1 of 3:** please approve or change the character card and voice line before I write the reference image prompts.
```
