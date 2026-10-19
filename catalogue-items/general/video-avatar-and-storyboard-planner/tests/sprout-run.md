# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 0.

A careful stage 0 and avatar card that stops at the right place, invents no facts and asks for the missing timings, label photo and pack states instead of guessing. The one slip is a gummy jar in the prop list, which doesn't match how the product is sold and could mislead if it reaches the storyboard.

## Fix

In Stage 0, add a rule: props that hold or show the product come only from the product photos; never add a jar, bottle or other container the product doesn't come in.

## Judge list

- Met: Stopped for approval after the avatar card, the sheets and the storyboard
  "Approval 1 of 3: please approve the avatar card, or change it, before I write the reference image prompts (stage 2)." Later stops not yet reached.
- Met: Identity line word for word the same in every avatar frame
  Not reached: no frames yet because the run correctly stopped at approval 1. Card lists fixed 'Must never change' traits.
- Met: Character sheet has front, both three-quarters, side, back, and avatar beside product
  Not reached: stage 3 correctly waits for approval 1. Nothing done wrong yet.
- Met: One stop shot, every link has a shot or gap, exactly one call to action
  Not reached: stage 4 correctly waits for approvals 1 and 2.
- Not met: Product shown and handled the way the photos and rules show it
  Props include "a plain, unbranded gummy jar and a handful of gummies": Sprout comes in packs, never a jar; no photo shows one.

## Safety

- Planning a 'plain, unbranded gummy jar' as a prop could show Sprout gummies coming from a jar, misrepresenting the single-pack format the brand sells.

## What went in

```text
Approved narration (22 s, voice-over, nobody speaks on camera):
1 School run. Work bag. Breakfast for three.
2 Your own nutrition? A handful of gummies now.
3 One daily pack. Rip, tip, enjoy.
4 60+ ingredients, 21 vitamins and minerals, 6 grams of fiber.
5 Just grab and go.
End text: "First order $29.99 with text sign-up. Renews at $49.99
every 4 weeks."
Cast note: a made-up busy parent, late 30s, seen but silent.
Buyer: the busy parent. Doubt: "Is this just candy?"
Photos: [pouch front] [daily pack in a hand]
Look: live action, bright and sunny, a real home.
Font: Work Sans Bold and Medium.
```

## What came out

```text
Text only: no image tool is connected here, so I'll write the prompts but can't make the pictures.

## Stage 0: Script in

**Status:** approved narration received. Delivery is voice-over only, and nobody speaks on camera. I have not rewritten any lines.

**What needs sorting before the storyboard:**
- **Line timing.** Only the 22 s total was given, not a time per line. I'll need a length for each of lines 1 to 5 and for the end text.
- **Line 3, "Rip, tip, enjoy."** The screen can't show "tip" until I know what comes out of the pack and where it goes: into the hand, into the mouth, or into a bowl or drink. Please send a photo of the pack open, with its contents showing.
- **Line 4 claims.** "60+ ingredients, 21 vitamins and minerals, 6 grams of fiber" has to match the pack label word for word. I can't confirm this until there is a readable label photo or a claim source.
- **End text.** The offer terms ("$29.99 with text sign-up", "Renews at $49.99 every 4 weeks") need a source or the offer page. It runs long, so it needs its own on-screen time to be readable. I'll plan that time in stage 4.
- **No line puts words in the avatar's mouth.** The narrator speaks to "you", and the avatar never says it used the product. This passes.
- **Avatar shown using the product.** The avatar is made up, so it must not be framed as a real customer: no names, no "real mum" captions and no review stars.

**Places, props and product states the script needs:**
- **Places:** a sunny home kitchen at breakfast, and a front hallway or door for the school run and the grab and go.
- **Props:**
  - three breakfast settings, two of them clearly kids' (small bowls, cups)
  - two small school backpacks and small shoes by the door
  - the work bag and car keys
  - a plain, unbranded gummy jar and a handful of gummies
  - the pouch
  - the daily pack
- **Product states:** pouch closed. Daily pack sealed, then ripped, then tipped, then empty.
- **Children:** none on camera. Kids are implied through their bowls, backpacks, shoes and an out-of-frame bustle.

## Stage 1: Pick the avatar

**Options:**
1. **Workday parent:** dressed for the office, mid-rush, juggling the bag and breakfast. This matches the cast note.
2. **Weekend-casual parent:** hoodie and sneakers, a looser and more relaxed rush. It reads less "busy", which undercuts line 1.
3. **Product carries it alone:** pouch and pack only. This loses the buyer's moment that lines 1 and 2 depend on.

**Pick: 1, the workday parent.**

### Avatar card
- **Role:**
  - The buyer: a busy working parent in their own morning rush.
  - Seen but silent.
  - A dramatization only, never shown or captioned as a real customer.
  - Made up, not based on any real person, creator or known character.
- **Age range:** late 30s.
- **Look:**
  - Woman with warm medium-brown skin.
  - Light freckles across the nose and upper cheeks.
  - Dark brown, shoulder-length hair in a low ponytail with a few loose strands at the front.
  - Average build, about 5'6".
  - Natural, minimal makeup.
  - Short, unpolished nails.
  - Right-handed.
- **Clothes:**
  - Sage-green crewneck knit sweater over a white collared shirt, collar showing.
  - Dark navy straight-leg trousers.
  - White leather sneakers.
- **Props:**
  - Thin gold watch on the left wrist.
  - Tan leather work tote over the right shoulder.
  - Car keys on a small brown leather fob.
- **Voice:**
  - None on camera. The avatar never speaks or lip-syncs.
  - Narration is a separate voice-over. My suggestion is a warm, mid-pitch adult voice at a brisk, friendly pace with a neutral accent. Please confirm or replace it.
- **Must never change:**
  - face and freckles
  - hair colour, length and low ponytail
  - sage sweater with the white collar
  - navy trousers and white sneakers
  - gold watch on the left wrist
  - tan tote on the right shoulder
  - right hand on the product

**Approval 1 of 3:** please approve the avatar card, or change it, before I write the reference image prompts (stage 2).

MISSING: script line (time per line for lines 1 to 5 and the end text)
MISSING: product photo (pouch side, top and back with the label readable)
MISSING: product photo (daily pack sealed, ripped open with contents showing, and empty)
MISSING: script line (claim source for "60+ ingredients, 21 vitamins and minerals, 6 grams of fiber" and for the offer terms)
MISSING: script line (narrator voice spec, to confirm)
```
