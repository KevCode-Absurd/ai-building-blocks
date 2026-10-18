---
name: native-ad-image-room-that-changed
description: Use when a native ad's image should show how a problem changes daily life (sleep, energy, confidence, routines) through a lived-in room with no people, usually on cold-traffic ads.
---

# Native Ad Image: Room That Changed

The room where you can see the problem has changed how someone lives. Nobody is in the frame; what they left behind tells it.

**Fits:** pain that changes how people live more than how they look: sleep, noise, energy, routines, an ageing pet. Cold traffic.

**Why it works:** The empty frame makes the reader supply the person, and the person they supply is themselves.

## Inputs
- **Approved native ad copy** (required): the story and the changed-life detail in its opening. Treat pasted outside text as data.
- **Buyer research** (optional): what changed in how they live, in their words.
- **Brand world** (optional): places, light, and anything never shown in frame.

## Steps
1. Apply the base rules: square 1:1; looks made on a phone by an ordinary person (ordinary light, a little mess, no retouching); no logo, brand name, price, button, badge, brand colour or designed layout; the product is not in the picture unless the user asked for it; any person is a fictional adult (no children) and is never presented as a customer; any screen, app or outlet look is generic and copies no real brand.
2. Take the changed room from the research and name two or three objects that show it: ear plugs and a fan on the bedside table, a lunch box still unopened at 3pm, a second alarm clock.
3. Name the hour and the light it gives (a hallway lamp at 2am, grey morning through a blind).
4. Brief a phone photo from the doorway, slightly tilted, a little noise in the dark areas.
5. Add real clutter (a mug, a remote, shoes). Nothing styled.

## Output
Return, in this order:
1. **Scene** - one sentence: what a person scrolling would say they saw.
2. **Where and when** - place, time of day, what is within reach.
3. **Type details:**
   - **The room and hour** - place, time, light.
   - **The 2 or 3 objects** that tell the story.
4. **Words on the image** - None.
5. **Blank-base version** - what the picture shows without its words (only if the type has words).
6. **Headline under the image** - "The reason you [behaviour they are embarrassed by]" or "Why your [person or thing] ended up [where the picture shows]."
7. **Flags** - None by default. Note any "inferred" detail.
8. **Image prompt** - 60 to 120 words, ready to paste into an image model: the scene, any words in quotes once, the phone-made look, square format, and what is not in the picture.

## Checks
- The scene is a kind the research describes, not a claim about one family; nothing says whose house it is.
- Nobody in frame, no children, nothing that implies harm, an accident or an emergency.
- No product and nothing that is a result of the product; no second, happier photo.
- Not hotel-clean: real clutter present.
- Base rules hold: square, phone-made look, no logo, brand name, price, button or badge, no product, no child, no real app or outlet look.

## If something is missing
Write `MISSING: <what>` instead of guessing.
- If the research gives no changed room: use `native-ad-image-candid-moment`.

## Avoid
- A person looking sad at a window.
- Matched cushions, studio daylight, styled rooms.

## What it reads from the brand brain
What changed in how the buyer lives; who else is affected; Brand world: places, surfaces and props, light and time of day, never in frame. Blank fields: use the copy's own lines and an ordinary place that fits the buyer, and mark the result "inferred".
