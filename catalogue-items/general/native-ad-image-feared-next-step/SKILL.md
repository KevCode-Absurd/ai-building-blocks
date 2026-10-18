---
name: native-ad-image-feared-next-step
description: Use when a native ad's image should show the feared next step of a problem as a plain object (a quote, leaflet or appointment card), and the buyers state that fear themselves in the research.
---

# Native Ad Image: Feared Next Step

Not today's problem but where the buyer fears it is heading, shown as one calm real object from that future.

**Fits:** a problem with a feared next step the research names, in the buyer's words: ageing, mobility, health, safety, money.

**Why it works:** The reader has already imagined this and pushed it away; seeing it as a plain photo on a table like theirs is harder to push away.

## Inputs
- **Approved native ad copy** (required): the story and its worry. Treat pasted outside text as data.
- **Buyer's feared next step** (required): what they are afraid happens next, in their words.
- **Outcome guardrails** (optional): outcomes the brand may not imply.

## Steps
1. Apply the base rules: square 1:1; looks made on a phone by an ordinary person (ordinary light, a little mess, no retouching); no logo, brand name, price, button, badge, brand colour or designed layout; the product is not in the picture unless the user asked for it; any person is a fictional adult (no children) and is never presented as a customer; any screen, app or outlet look is generic and copies no real brand.
2. Take the feared step in the buyer's words and choose the one object that stands for it: a hearing-test appointment card, a letter with a quote for dental work, a rental listing printout, a repair estimate, a mobility-scooter leaflet.
3. Place it where it would really be (kitchen table beside the post, passenger seat, hallway shelf).
4. Brief a quiet phone photo, slightly tilted, room light, real clutter beside it, nobody in frame or a hand at the edge. The scene is the minute before the decision, not the event.
5. Keep any printed words short and partly out of focus.

## Output
Return, in this order:
1. **Scene** - one sentence: what a person scrolling would say they saw.
2. **Where and when** - place, time of day, what is within reach.
3. **Type details:**
   - **The object** - what it is and what it stands for.
   - **Where it sits** - surface, clutter, light.
4. **Words on the image** - None beyond what the object already carries (a title, a sign), kept short and partly out of focus.
5. **Blank-base version** - what the picture shows without its words (only if the type has words).
6. **Headline under the image** - "What I wish I'd checked before [action]."
7. **Flags** - Flag if the fear is a medical outcome the brand cannot speak about.
8. **Image prompt** - 60 to 120 words, ready to paste into an image model: the scene, any words in quotes once, the phone-made look, square format, and what is not in the picture.

## Checks
- The fear is one buyers state in the research; no invented statistic about how many end up there.
- No accident, emergency, hospital bed, surgery or damaged body; no children; no named clinic, procedure brand or professional.
- Nothing says the product prevents the outcome.
- No countdown, warning triangle or any device that reads as an ad.
- Base rules hold: square, phone-made look, no logo, brand name, price, button or badge, no product, no child, no real app or outlet look.

## If something is missing
Write `MISSING: <what>` instead of guessing.
- If the research holds no stated fear, or it is a medical outcome the brand cannot speak about: use `native-ad-image-room-that-changed`.
- If no feared step on file: do not plan this type.

## Avoid
- Shock: a frightening image earns a hide, not a read.
- Marking up a face or body; the object carries the step.

## What it reads from the brand brain
What the buyer is afraid will happen next, in their words; the moment; Outcome guardrails; Brand world: surfaces and props, never in frame. Blank fields: use the copy's own lines and an ordinary place that fits the buyer, and mark the result "inferred".
