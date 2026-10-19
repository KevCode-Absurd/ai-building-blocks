# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A usable, honest snapshot brief: the instant matches the story's first line, the person is faceless hands at a sink, the old way is generic and the prompt bakes in the house rules. Two small nits: the caption line omits the shape's (type, character count) tag, and the flag "Review 5 was not provided" is wrong since review 5 is in the brand's files, though it changes nothing in the picture.

## Judge list

- Met: Story's first line and the picture are the same instant
  "Staring down at the huge tablet back in his palm, before the third try" matches "three tries to get it down" at the kitchen sink.
- Met: Buyer would say "that's me", not "that's an ad"
  "Only his hands and forearms show", "natural everyday mess", "realistic phone-camera grain", first-person view over the sink.
- Met: Nobody smiling, posing or pulling a pained face
  "No face"; strain is in the body: "Right hand gripping a half-empty glass of water tightly."
- Met: No product, logo, price or words in the picture
  "No face, no text, no logos, no labels, no brand colours, no product packaging"; bottles are "plain unlabelled".
- Met: Line under the image describes the thing or moment, never the reader
  "Third try. Every morning." names the moment, 25 characters, no product name, nothing about the reader.

## What went in

```text
Story ad (approved, built on review 5 and the brand's own line
about pills):
Every morning at the kitchen sink: one huge multivitamin, a full
glass of water, and three tries to get it down.
Then the probiotic. Then the B12.
Now it's one Sprout daily pack. Tear the top, eat the small
handful of gummies inside. 60+ ingredients, 21 vitamins and
minerals, 6 g prebiotic fiber. No water needed.

Buyer: the quitter who wants to stick, 28 to 45, office jobs.
Brand look: bright, sunny, everyday adults in casual clothes at
home. Never clinical.
```

## What came out

```text
**1. Scene**
Someone's hand by a sunny kitchen sink, holding one huge vitamin tablet next to a half-drunk glass of water.

**2. Where and when**
A home kitchen sink on a weekday morning, about 7:30. Within reach are the tap, a half-empty glass of water, two plain unlabelled supplement bottles by the tap, a mug, a phone face-down, and a tea towel bunched on the counter.

**3. The instant**
Staring down at the huge tablet back in his palm, before the third try.

**4. Who held the phone**
The buyer himself. The camera looks down from his own eye line over the sink at his hands. It reads as "this is me".

**5. The person**
- **Age and look:** a made-up man of about 35. Only his hands and forearms show, with no face.
- **Clothes:** the cuffs of a grey crewneck sweater pushed up, and a plain watch on the left wrist.
- **Left hand:** palm up and open, holding one oversized chalky multivitamin, slightly damp from the last try.
- **Right hand:** grips the glass low and tight, with water about halfway down.

**6. Words on the image**
None.

**7. Line under the image**
Third try. Every morning.

**8. Flags**
- **Inferred:**
  - The pause before the third try. The story names "three tries" but not which second to catch.
  - The half-empty glass, used to show earlier tries.
  - That the buyer is a man.
  - The watch and sweater, as office-job cues.
- **Not seen:** Review 5 was not provided. The instant is built from the ad text only.
- **Out of frame:**
  - The Sprout pack and the gummies.
  - Any face.
  - Any label, brand or rival pack. The bottles are generic, with no text.
  - Children and pets.
  - Any before-and-after.
- **Brand look:** It is kept bright and sunny with everyday clothes and no clinical feel. Morning window sun suits it.

**9. Image prompt**
Candid smartphone photo, square 1:1, first-person view looking down over a home kitchen sink on a weekday morning. A man's hands in grey sweater cuffs pushed up, plain watch on his left wrist. Left palm open holding one oversized chalky multivitamin tablet, slightly damp. Right hand gripping a half-empty glass of water tightly. Two plain unlabelled white supplement bottles beside the tap, a mug, a bunched tea towel. Low bright morning sun through the window, natural everyday mess, slightly off-centre framing, tap cut off at the frame edge. No face, no text, no logos, no labels, no brand colours, no product packaging, unretouched, realistic phone-camera grain.
```
