# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A correct partial run: it confirmed the shaker, wrote a well-ordered character card and voice line, then stopped at approval 1 and for the missing product photo exactly as the skill requires. Stages 2 to 5 and the score are still to come once the owner approves and sends the pouch and daily-pack photos; headings use "File 1/2" rather than "STAGE 0/1" but nothing due at this point is missing.

## Judge list

- Met: The run stopped for your yes after the character card, the sheets and the storyboard.
  "Approval 1 of 3: approve or edit the character card and voice line above." Stopped at approval 1; sheets and storyboard not yet due.
- Met: Pause the first frame, muted, at thumbnail size. You can see the face and its feeling.
  Not reached (run halted correctly at approval 1 and for the missing photo); card already fixes face spot, low raised brows, lopsided mouth.
- Met: The face sits in the same spot in every clip, with the same eyes, brows and mouth.
  Not reached; card is written as one sentence "pasted word for word into every later prompt" with the face spot fixed.
- Met: The mouth moves only with the words and closes when each line ends.
  Not reached; no clip prompts yet, nothing contradicts it. "a small closed lopsided mouth at rest".
- Met: The product's label matches its photo, it has no face, and it arrives by a cut at the turn.
  "The Sprout pouch never gets one." Plus: bear face "stays flat, still and exactly as in the photo". Stopped for the photo.
- Met: The object never states a price, a result it couldn't see, or a sales pitch.
  Script lines kept unchanged; no price in them. "MISSING: live offer text for the last two seconds of on-screen text."

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
I write the prompts only; this chat has no video tool connected, so no pictures or clips will come from here.

## File 1: Narrator

**Confirmed: the shaker bottle (has-been).** It really sits on a kitchen counter. It is one simple cylinder with a natural face spot on its smooth body, and it is unbranded and has no body parts. A clear plastic bottle can't be mistaken for a glossy green foil pouch. The face stays on the shaker. The Sprout pouch never gets one.

## File 2: Avatar card

**Character card** (pasted word for word into every later prompt):
> A plain translucent cloudy-white plastic protein shaker bottle with a matte black screw lid and flip cap, no logo, no words and no measuring marks anywhere; a faint green powder ring stained around the inside just below its shoulder and a dull, lightly scuffed body; its face sits on the smooth middle of the body, below the green ring; two round glossy black eyes; soft grey brows set low and slightly raised in the middle; a small closed lopsided mouth at rest; no arms, no legs.

No limbs: no line needs a gesture. On "This green ring?" the eyes roll up to the ring instead.

**Voice line** (used once, in every clip prompt):
> A man in his late thirties, slow and slightly halting pace, sheepish and gently self-mocking, general American accent.

## MISSING

- `MISSING: Sprout pouch front photo`. The note says it is attached, but no image arrived. The product sheet can't be checked against the real pack without it, so I stop before Stage 3 until it comes.
- `MISSING: photo of the single daily pack, out of the pouch`. This is needed for the "tears a little pack" beat and the torn-straight-across state.
- `MISSING: brand home accent`. I assumed general American. Tell me if it should be different.
- `MISSING: live offer text` for the last two seconds of on-screen text.
- `MISSING: brand file`, meaning the never-show list and the humour limits.

Flag for later: the pouch's printed yellow bear face is label art. In every prompt it stays flat, still and exactly as in the photo, so it never blinks or talks.

**Approval 1 of 3:** approve or edit the character card and voice line above. Send the pouch photo and the daily pack photo too, and I'll write the reference image prompts.
```
