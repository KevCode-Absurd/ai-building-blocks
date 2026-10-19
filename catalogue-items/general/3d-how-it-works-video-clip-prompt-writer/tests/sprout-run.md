# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 4.

This is a careful stage 0 and 1 handover. It tests the chain, marks each link's support, flags regulator issues, uses MISSING lines for absent photos and label facts, and stops for approval. The only numbers added are design choices and sums of the given 29 s, not Sprout facts.

## Judge list

- Met: Stopped for OK after avatar cards, sheets and storyboard
  Ended with "Stop: approval 1." and held back stage 2; it correctly went no further than stage 1.
- Met: Every link marked sourced or common knowledge, never assumed
  Table marks links as "Common knowledge" or "Brand claim" and flags "Needs the label line" and "needs a brand source".
- Met: Parts key keeps same name, colour and shape in every prompt
  Parts key table gives blue spheres, yellow strands, cream tube. No later prompts exist yet, and nothing contradicts it.
- Met: Product first appears at its own link in the storyboard
  "It appears first in link 3, named there"; the opening table is stated to be Sprout-free. No storyboard yet.
- Met: Voice is brand-recorded and a person approved the read
  "the brand's own recorded narrator"; "a person approves the full read before any picture is paid for."

## Invented

- number: Smallest part. About a tenth the width of the tube's inner space. (Size ratio is a design choice, not a Sprout fact, but it is presented as a spec; minor.)
- number: Each strand is about 6 to 10 spheres long (Design scale choice, not a fact about Sprout.)
- number: age about 30 to 40 (Design choice for the stylised person, not a fact.)
- number: surface 4 s, dive 4 s, four links × 4 s, surface again 5 s, for 29 s total (Arithmetic on the given 29 s and the skill's timing guidance; it sums to 29.)

## What went in

```text
Script (29 s, from "Show what your product does where no camera
can see"): chain: 6 g prebiotic fiber meets the bacteria already
in your gut, they feed on it, so it supports digestion. Surface:
"Breakfast at seven. But who else is eating?" Dive: "Now smaller
than a grain of salt, inside you." Links: bacteria wait; no fiber
when the powder stays shut; "Sprout brings six grams of prebiotic
fiber, food for them."; "They feed, and that supports digestion
and gut health." Surface again: a daily pack torn at the door.
Parts key: bacteria = small soft blue spheres; fiber = thin yellow
strands; the gut = a plain cream tube.
Cast note: the fiber carries it; the woman appears only at human
size, silent; calm, warm narrator.
Photos: [pouch front] [daily pack in a hand]
Voice: the brand's own recorded narrator.
```

## What came out

```text
I write the prompts only. No picture or video tool is connected to this chat, so no images or clips will be made here.

## Stage 0: Script in (locked script, three tests)

**Chain as written**

| Link | Line | Support |
|---|---|---|
| 1 | Bacteria wait in the gut | Common knowledge |
| 2 | No fiber when the powder stays shut | Common knowledge (no intake, no food for them) |
| 3 | "Sprout brings six grams of prebiotic fiber, food for them." | Brand claim. **Needs the label line showing 6 g per serving.** |
| 4 | "They feed, and that supports digestion and gut health." | Feeding is common knowledge. **"Supports digestion and gut health" needs a brand source.** |

**Tests**
- **Hidden: pass.** Gut bacteria feeding on fiber can't be filmed at normal size.
- **True: conditional pass.** It holds only if links 3 and 4 get their sources. If "supports digestion and gut health" can't be backed, cut link 4 back to "They feed on it." and drop the outcome.
- **Teaches: pass.** A viewer could sketch it in four boxes: bacteria wait, no food, fiber arrives, they feed. Only one line names the brand.

**Honesty notes**
- The verbs are soft and true ("brings", "supports"). On screen, the fiber only arrives and gets fed on. Nothing heals, glows, swells or "fixes".
- **Regulated field.** This is food or a supplement making a gut claim, so the brand must read the script before any picture is made.
    - In the EU and UK, "prebiotic" and gut-health wording are not authorised claims for most fibers.
    - In the US, "supports digestion" is a structure/function claim and may need the standard disclaimer on screen.
    - Confirm the market.
- **Body.** Show no see-through torso and no stomach on the woman. The dive must leave her before it shrinks. One way: follow the spoon or glass down, then dissolve into the plain cream tube. Inside, show only the cream tube, with no organs or anatomy.
- **Product timing.** The product (pouch, daily pack, name) and the yellow fiber strands must not appear before link 3. The breakfast table in the opening must be Sprout-free. In link 2, the pack stays shut and off-shot, or it is not shown at all.
- **Timing:** surface 4 s, dive 4 s, four links × 4 s, surface again 5 s, for 29 s total.

**MISSING**
- `MISSING: real photo files`. The pouch and pack are named in brackets but no images are attached, so the product sheet can't be checked against the real pack. Also needed: side, top and out-of-pack photos of the pouch and the daily pack.
- `MISSING: every label line, typed exactly` (serving size, the "6 g prebiotic fiber" line, ingredients).
- `MISSING: what the fiber is` (e.g. inulin, chicory root, acacia) and the source for each step of how it works.
- `MISSING: brand file`. This covers approved claims with sources, banned claims, what buyers assume, brand colours and font, the market and regulator, and how "Sprout" and "prebiotic" are said.
- `MISSING: current offer and terms` for the closing on-screen text.

## Stage 1: Avatar cards (parts key, product, person) and voice

**Parts key**

| Part (buyer's name) | Colour | Shape | How it moves | Size against the others |
|---|---|---|---|---|
| **Gut bacteria** | Soft blue, one shade, matte | Small soft spheres, slightly squashy, no faces, no eyes, no limbs | Drift slowly in loose groups. Wait in place in link 1, then gather and nestle along the strands in link 4. | Smallest part. About a tenth the width of the tube's inner space. |
| **Prebiotic fiber** (the avatar, carries the ad) | Yellow, one shade, gently lit, never glowing | Thin, smooth, loosely curled strands | Drift in from above in link 3 and settle softly among the spheres. No sparkle, no burst, no "power" effect. | Each strand is about 6 to 10 spheres long and thinner than one sphere. |
| **The gut** | Plain cream | A simple smooth tube, soft walls, no folds, veins or anatomy | Still. At most a slow, faint breathing curve of the wall. | The setting. It frames everything and fills the edges of the frame. |

Everything else stays neutral: soft warm-grey haze, soft light, no letters, numbers or logos inside the small world.

**Product card: Sprout**
- **What it is:** the pouch and a single daily pack, modelled only from the real photos.
    - Shape, colours and every label line come from those photos and are typed exactly.
    - No invented details.
    - Pending: `MISSING: real photo files and label lines`.
- **Where it appears:**
    - It appears first in link 3, named there, beside or above the falling yellow strands. It is shown at human size as a short cut-in of the pack, or as the narrator line alone, to be decided at the storyboard.
    - It returns in the closing shot, where the daily pack is torn open at the door and the real label is readable.
- **Use:** the daily pack is used the brand's way. `MISSING: how it's used` (stirred into water, a drink or breakfast?).

**Person card: the woman (human size only)**
- **Look:**
    - A stylised 3D adult, age about 30 to 40.
    - Fully clothed: knit top at breakfast, the same top with a coat added at the door.
    - Calm, relaxed face. Warm, unbranded kitchen and hallway.
- **Role:** silent, appearing only in the opening and closing surface shots. She is never a real person, an expert, a patient, or anyone in clinic or illness framing.
- **Matching:** her pose and energy at the door match breakfast and are only a touch easier. There is no before-and-after body.

**Narrator voice**
- **Voice:** the brand's own recorded narrator, calm and warm. Off screen throughout, with no lip-sync.
- **Spellings by sound for the voice script:**
    - "prebiotic" as *pree-by-OT-ik*
    - "Sprout" as *SPROWT* (confirm with the brand)
- **Approval:** a person approves the full read before any picture is paid for.

**Stop: approval 1.** Please approve the parts key, the product card, the woman and the voice, or send changes. Please also send the missing photos, label lines, fiber type and claim sources. I'll write the reference render prompts (stage 2) once these are approved.
```
