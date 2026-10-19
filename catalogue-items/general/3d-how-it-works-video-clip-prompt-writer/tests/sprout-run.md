# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 3 of 5 met. Invented facts: 5.

The run stopped at the right point and kept the parts key consistent, but it invented size ratios and an age range. It also wrongly flagged the brand file, label lines and claims as MISSING when Sprout's files had them, and showed the product before its own link.

## Fix

In Stage 0 and Stage 1, add a rule: check the supplied brand files before writing MISSING, and mark each link as sourced, common knowledge or unsupported. State that the product's first appearance, including the shut pouch, is only at its own link, and that sizes stay relative with no invented numbers.

## Judge list

- Met: It stopped for your OK after the avatar cards, the sheets and the storyboard.
  Stopped at approval 1: "Stopped for approval 1... Stage 2 starts once the cards are approved." Later stages not reached.
- Not met: Every link in the chain is marked sourced or common knowledge, never assumed.
  Tests say "6 g needs the label line" and brand claim "needs its source"; links are not each marked sourced, common knowledge, or unsupported.
- Met: The parts key keeps the same name, colour and shape in every prompt.
  Cards keep "small soft blue spheres", "thin yellow strands", "plain cream tube"; no prompts yet, cards consistent.
- Not met: In the storyboard, the product first appears at its own link.
  No storyboard yet. Card shows the shut pouch at link 2, before its link 3, contradicting "named there, and not before".
- Met: The voice is one the brand recorded, hired or licensed, and a person approved the read.
  "The brand's own recorded narrator... A person approves the full read before any picture is paid for."

## Invented

- number: each strand is about 5 times as long as a sphere is wide (Invented size ratio, not in the inputs.)
- number: A few dozen fit across the tube (Invented size figure.)
- number: aged 30 to 45 (Invented age range; the run input says only 'the woman'.)
- claim: EU and UK, "prebiotic" and "supports digestion / gut health" are not authorised health claims (Regulatory claim stated as fact; not in Sprout's files and not marked as general advice.)
- other: MISSING: brand file / label lines / photos / how it works (These were provided in the Sprout files, so the MISSING calls are wrong.)

## Safety

- The shut pouch shown at link 2 puts the product on screen before its own link, breaking the rule and implying product failure.
- The EU/UK regulatory claim is asserted as fact without a source.

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
# Stage 0: Script in (locked script read)

**Three tests**
- **Hidden: pass.** Bacteria feeding on fiber inside the gut cannot be filmed at normal size.
- **True: pass, on condition.**
  - "Bacteria already live in the gut" and "gut bacteria feed on prebiotic fiber" are common knowledge.
  - "6 g" needs the label line as its source.
  - "Supports digestion and gut health" is a brand claim and needs its source.
- **Teaches: pass.** A viewer could sketch it in four boxes: fiber, bacteria, feeding, digestion supported. Most of the film runs without the brand name.

**Honesty notes**
- **Claim rules apply.** This is a supplement, so the brand must read and approve the script before any picture is made.
- **Regulator flag.** In the EU and UK, "prebiotic" and "supports digestion / gut health" are not authorised health claims unless they are tied to a specific approved claim. Confirm the wording for each market where the ad will run.
- **"Supports" is the ceiling.** On screen, the bacteria feed and nothing more. There is no glow, no "healthy" change to the tube, and no body before and after.
- **"Inside you" is shown only as the plain cream tube.** No anatomy, no see-through body.

**MISSING**
- `MISSING: brand file`: claims with sources (especially "supports digestion and gut health"), banned claims, brand colours and font, pronunciation of "Sprout" and "prebiotic".
- `MISSING: every label line` from the pouch and the daily pack, including the 6 g line and the fiber type.
- `MISSING: what it's made of`: the named prebiotic fiber or fibers.
- `MISSING: how it works, with a source for each step`.
- `MISSING: photos`: side, top and out-of-pack views of the pouch and the daily pack. The product model needs these.
- `MISSING: current offer terms`, for the closing on-screen text only.

# Stage 1: Avatar cards (the parts key)

**1. Fiber (the avatar, the product's active part)**
- **Buyer's name:** fiber
- **Colour:** yellow, one flat warm yellow. Check it against the Sprout pack colours once the brand file arrives.
- **Shape:** thin, smooth, slightly curved strands with no texture or branching.
- **How it moves:** drifts in slowly, unfurls, and settles among the blue spheres.
  - In the feeding shot, strands shorten gently as the spheres gather on them.
  - It does nothing more than that.
- **Size:** each strand is about 5 times as long as a sphere is wide, and very thin.
- **First appearance:** link 3 ("Sprout brings six grams…"), named there and not before.

**2. Bacteria**
- **Buyer's name:** the bacteria already in your gut
- **Colour:** small soft blue spheres, one matte blue.
- **Shape:** simple round spheres with no faces, tails or spikes.
- **How it moves:**
  - Drifts slowly and waits (link 1).
  - Hangs idle with nothing to gather on (link 2).
  - Gathers on the yellow strands and nudges gently while feeding (link 4).
- **Size:** the base unit of the small-size world. A few dozen fit across the tube.

**3. The gut**
- **Buyer's name:** inside you, your gut
- **Colour:** plain cream.
- **Shape:** a smooth plain tube, seen from inside as soft curved walls. No folds, villi, veins or organ detail.
- **How it moves:** it doesn't. It is the still set the parts move in.
- **Size:** fills the frame and frames the spheres and strands.

**4. The product (Sprout)**
- **Models:** the pouch and the single daily pack, built from the real photos.
- **Colour and shape:** the colours, shape and label exactly as photographed. They will be locked once the side, top and out-of-pack photos and the label lines are supplied.
- **Where it appears:**
  - **Link 2:** the pouch stays shut on the counter, at human size or as a cutaway. Unnamed, as the snag ("no fiber when the powder stays shut").
  - **Link 3:** named, shown as the source of the yellow strands.
  - **Surface again:** the daily pack, torn open by hand at the door, real label facing the camera.

**5. The woman (surface moments only)**
- **Look:** a stylised 3D adult aged 30 to 45, with a warm, simple, non-photoreal look. Not a real person, an expert or a patient.
- **Clothing:**
  - Breakfast: fully clothed in everyday home clothes.
  - At the door: a coat.
- **Manner:** calm and silent throughout. No lip movement and no hand on the stomach.
- **Where she appears:** only at human size, at breakfast at seven and at the door. She never appears in the small-size world.

**Neutral everything else**
- Soft even light and a little haze for scale.
- No other colours in the small-size world, so the eye follows blue and yellow.

**Voice**
- The brand's own recorded narrator: calm, warm, unhurried, off screen.
- No cloned or borrowed voice.
- A person approves the full read before any picture is paid for.

**Stopped for approval 1.** Please approve or correct the avatar cards and the voice, and supply the MISSING items. Stage 2 (reference render prompts) starts once the cards are approved.
```
