# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A clean, paste-ready GPT Image prompt that keeps every lock line, the approved words and the sealed pouch, and drops the rejected shaker, old tagline and placeholder. Minor soft spots: hands aren't named left/right, 'rounded sans' doesn't match the brand's Work Sans, and 'hands lower right' was chosen without seeing the layout sketch, but the MISSING list and check are useful.

## Judge list

- Met: Every attached photo has one stated role.
  "Image 1 is the real product... Image 2 is the real product, the daily pack... Image 3 is the layout, used for structure only."
- Met: Lock lines appear word for word, and the pack hasn't been swapped or simplified.
  Keep line repeats all five input lock lines verbatim; subject block uses "glossy deep green stand-up foil pouch" and "torn straight across the top only".
- Met: Approved words appear once, in quotes, with their place, or clear space is asked for.
  "Words: \"Rip. Tip. Enjoy.\" top left, large bold rounded sans, colour #00582D." appears once in the prompt.
- Met: No rejected idea, research note or placeholder made it into the prompt.
  Prompt has no shaker bottle, no "Tear. Pour. Done.", no "HEADLINE HERE"; Left out lists all three as dropped.
- Met: The camera is a real position, and the hands say which one holds what.
  "Camera: counter height, 40 cm away"; "an adult hand holds the daily pack... tips... into the other palm" (not left/right, but roles clear).
- Met: Anything it couldn't know is marked MISSING, and the product is shown closed until answered.
  Six MISSING lines (bear count, size vs hand, pack printing, three photo roles); "the sealed pouch" kept closed; pack tear is on file.

## What went in

```text
Approved scene: kitchen counter in daylight. An adult hand tears
a daily pack across the top and pours the gummies into the other
palm. The Sprout Original pouch stands behind, label to camera.
Approved text: "Rip. Tip. Enjoy." top left, forest green #00582D.
Size: 4:5. Tool: GPT Image. Prompt limit: 1,000 characters.

Images: 1 = adult pouch, front on. 2 = a daily pack, torn across
the top. 3 = layout sketch (headline box says "HEADLINE HERE").

Lock lines (from the truth sheet): glossy deep green stand-up foil
pouch; big yellow wordmark, yellow bear face top right; "28 Daily
Packs" at the bottom; small opaque deep-green bears, soft matte;
daily pack torn straight across the top only.
Rules: the big pouch opens only at its resealable top, never torn.
Photos bright, sunny, candy-like. Never clinical.

Notes: we rejected a version with a shaker bottle in it. Also
tried "Tear. Pour. Done." Make it pop, really bright, vibrant,
super bright and fun.
```

## What came out

```text
**1. Prompt** (997 characters including line breaks)

```
A 4:5 photo for a social ad. Image 1: real pouch. Image 2: real daily pack. Image 3: layout only, ignore its text.
Subject: an adult hand holds the daily pack torn straight across the top only, and tips small opaque deep-green bears, soft matte, into the other palm; fingers clear of the print. Behind, the sealed pouch, label to camera: glossy deep green stand-up foil pouch; big yellow wordmark, yellow bear face top right; "28 Daily Packs" at the bottom.
Place: kitchen counter; hands lower right, pouch behind, space top left.
Camera: counter height, 40 cm away, sharp focus. Light: bright sunlight from the left, soft shadows, saturated colour.
Words: "Rip. Tip. Enjoy." top left, large bold rounded sans, colour #00582D.
Keep the product exactly as in Images 1–2, labels as printed: glossy deep green stand-up foil pouch; big yellow wordmark, yellow bear face top right; "28 Daily Packs" at the bottom; small opaque deep-green bears, soft matte; daily pack torn straight across the top only.
```

**2. Images**
- Image 1 is the real product, the adult pouch front-on. Copy its shape, colours and printing.
- Image 2 is the real product, the daily pack torn across the top. Copy its shape, colours, printing and tear.
- Image 3 is the layout, used for structure only. Its "HEADLINE HERE" text is ignored.
- These roles come from your descriptions. I haven't opened the photos, so confirm each one shows what's listed before sending.

**3. Left out**
- Dropped: the rejected shaker-bottle version, the old line "Tear. Pour. Done.", the "HEADLINE HERE" placeholder, and the stacked "pop / bright / vibrant / super bright / fun" adjectives. Those adjectives became bright sunlight and saturated colour. "Candy-like, never clinical" also became sunlight and saturated colour.
- The pouch's resealable-top rule became "sealed pouch" behind the hands.

**4. Check** (run on the first image, side by side with Images 1–2 and zoomed in. Pass/fail is pending until the image exists)
1. Product: pouch shape, gloss, deep green, yellow wordmark, bear face top right, "28 Daily Packs" at the bottom. The daily pack matches Image 2, is torn straight across the top only, and is the right size in the hand. The pouch is sealed and not torn.
2. Words: "Rip. Tip. Enjoy." appears once, top left, in #00582D, spelt right. There is no other text, and "HEADLINE HERE" does not appear.
3. Action: the bears tip out of the torn top only, in a realistic amount, into the open palm. The pouch stays closed.
4. Hands and faces: the hands are adult, whole and natural, with a real grip. No finger covers the pack print or the pouch label. There are no stray letters or logos.
5. Light: sunlight comes from the left, and shadows and reflections on both packs and the bears match the counter. The pouch sits on the counter and the pack touches the fingers.
6. Camera: counter height, about 40 cm, hands lower right, pouch behind, clear space top left.

Write each failure as one line (asked → got) for the mistakes list. Fix one thing per round, using the keep line and "keep everything else the same".

**5. Missing**
- MISSING: product fact: how many bears are in one daily pack. The prompt shows the pack's contents without a count, which risks an unrealistic amount.
- MISSING: product fact: daily pack size against a hand, and pouch size against a hand or counter.
- MISSING: product fact: lock lines for the daily pack's own colour and printing. Right now only Image 2 carries them.
- MISSING: photo role: pack in a hand (true size).
- MISSING: photo role: pack in use (pouring).
- MISSING: photo role: close-up of the bears' surface.
```
